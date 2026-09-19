import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';

const sourceRoot = fileURLToPath(new URL('..', import.meta.url));
const productionEntryFiles = ['application.ts', 'main.ts'];
const productionFeatureRoot = join(sourceRoot, 'features');

const excludedDirectories = new Set([
  'node_modules',
  '__tests__',
  '__screenshots__',
]);

const testOnlyPathPattern = /(?:^|\/)(?:__tests__|__screenshots__)\//;
const testOnlyFilePattern = /\.(?:test|fixture)(?:\.ts)?$/;
const domainFilePattern =
  /^features\/(?:problem-model|problem-dsl|named-expression|problem-generation|themes|puzzle\/modes)\//;
const modeFilePattern = /^features\/puzzle\/modes\//;
const themeModulePattern = /^features\/themes(?:\/|$)/;
const uiModulePattern = /^features\/puzzle\/ui(?:\/|$)/;
const testOnlyPackagePattern =
  /^(?:vitest|@vitest\/[^/]+|approvals|playwright|@playwright\/[^/]+|fast-check|@fast-check\/[^/]+)(?:\/|$)/;

type ProductionImports = {
  file: string;
  specifiers: string[];
};

function isProductionFileName(name: string): boolean {
  return (
    name.endsWith('.ts') &&
    !name.endsWith('.test.ts') &&
    !name.endsWith('.fixture.ts') &&
    !name.endsWith('.d.ts')
  );
}

function collectProductionFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (excludedDirectories.has(entry.name)) {
        continue;
      }
      files.push(...collectProductionFiles(join(directory, entry.name)));
    } else if (isProductionFileName(entry.name)) {
      files.push(join(directory, entry.name));
    }
  }
  return files.sort();
}

function collectProductionImportFiles(): string[] {
  return [
    ...productionEntryFiles.map((name) => join(sourceRoot, name)),
    ...collectProductionFiles(productionFeatureRoot),
  ].sort();
}

function extractImportSpecifiers(source: string): string[] {
  const pattern =
    /(?:import|export)\s[^'";]*?from\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  const specifiers: string[] = [];
  for (const match of source.matchAll(pattern)) {
    const specifier = match[1] ?? match[2] ?? match[3];
    if (specifier !== undefined) {
      specifiers.push(specifier);
    }
  }
  return specifiers;
}

function collectProductionImports(): ProductionImports[] {
  return collectProductionImportFiles().map((absolutePath) => {
    const relativePath = absolutePath
      .slice(sourceRoot.length)
      .replaceAll('\\', '/');
    return {
      file: relativePath,
      specifiers: extractImportSpecifiers(readFileSync(absolutePath, 'utf8')),
    };
  });
}

const productionImports = collectProductionImports();

function resolveSpecifier(file: string, specifier: string): string {
  const directory = file.includes('/') ? file.slice(0, file.lastIndexOf('/')) : '.';
  const joined = `${directory}/${specifier}`;
  const resolved: string[] = [];
  for (const segment of joined.split('/')) {
    if (segment === '' || segment === '.') {
      continue;
    }
    if (segment === '..') {
      resolved.pop();
      continue;
    }
    resolved.push(segment);
  }
  return resolved.join('/');
}

function isTestOnlyModuleImport(file: string, specifier: string): boolean {
  const resolved = resolveSpecifier(file, specifier);
  if (
    [specifier, resolved, `${resolved}.ts`].some(
      (candidate) =>
        testOnlyPathPattern.test(candidate) || testOnlyFilePattern.test(candidate),
    )
  ) {
    return true;
  }
  return resolved === 'testing' || resolved.startsWith('testing/');
}
function isUiImport(file: string, specifier: string): boolean {
  if (specifier === 'lit' || specifier.startsWith('lit/')) {
    return true;
  }
  return uiModulePattern.test(resolveSpecifier(file, specifier));
}

function violationLines(
  files: ProductionImports[],
  violates: (file: string, specifier: string) => boolean,
): string[] {
  const lines: string[] = [];
  for (const { file, specifiers } of files) {
    for (const specifier of specifiers) {
      if (violates(file, specifier)) {
        lines.push(`${file} imports '${specifier}'`);
      }
    }
  }
  return lines;
}

function expectNoViolations(rule: string, violations: string[]): void {
  expect(violations, [rule, ...violations].join('\n')).toEqual([]);
}

test('production modules do not import test-only modules', () => {
  expectNoViolations(
    'Production modules must not import test files, fixtures, or testing/ infrastructure:',
    violationLines(
      productionImports.filter(({ specifiers }) =>
        specifiers.some((specifier) => specifier.startsWith('.')),
      ),
      isTestOnlyModuleImport,
    ),
  );
});

test('domain modules do not import Lit or UI modules', () => {
  expectNoViolations(
    'Domain and problem-model modules must stay framework-independent and must not import Lit or UI modules:',
    violationLines(
      productionImports.filter(({ file }) => domainFilePattern.test(file)),
      isUiImport,
    ),
  );
});

test('mode modules do not import theme modules', () => {
  expectNoViolations(
    'Mode modules must work with canonical quantity IDs only and must not import concrete Theme implementations:',
    violationLines(
      productionImports.filter(({ file }) => modeFilePattern.test(file)),
      (_file, specifier) => themeModulePattern.test(resolveSpecifier(_file, specifier)),
    ),
  );
});

test('production code does not import test-only packages', () => {
  expectNoViolations(
    'Production modules must not import test-only packages (vitest, playwright, approvals, fast-check):',
    violationLines(productionImports, (_file, specifier) =>
      testOnlyPackagePattern.test(specifier),
    ),
  );
});

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
  /^features\/(?:problem-model|problem-dsl|named-expression|problem-generation|representations|themes|puzzle\/modes)\//;
const modeFilePattern = /^features\/puzzle\/modes\//;
const themeModulePattern = /^features\/themes(?:\/|$)/;
const themeFilePattern = /^features\/themes\//;
const puzzleModulePattern = /^features\/puzzle(?:\/|$)/;
const uiModulePattern = /^features\/puzzle\/ui(?:\/|$)/;
const testOnlyPackagePattern =
  /^(?:vitest|@vitest\/[^/]+|approvals|playwright|@playwright\/[^/]+|fast-check|@fast-check\/[^/]+)(?:\/|$)/;
const katexPackagePattern = /^katex(?:\/|$)/;
const katexAdapterFile =
  'features/puzzle/ui/katex-academic-display-adapter.ts';

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

test('domain modules do not import Mode modules', () => {
  expectNoViolations(
    'Domain and problem-generation modules own canonical mathematics and must not depend on the Mode axis:',
    violationLines(
      productionImports.filter(
        ({ file }) =>
          domainFilePattern.test(file) && !modeFilePattern.test(file),
      ),
      (file, specifier) =>
        /^features\/(?:puzzle|session|navigation)(?:\/|$)/.test(
          resolveSpecifier(file, specifier),
        ),
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

test('theme production modules do not import puzzle modules', () => {
  expectNoViolations(
    'Theme production modules must remain reusable without importing features/puzzle/**:',
    violationLines(
      productionImports.filter(({ file }) => themeFilePattern.test(file)),
      (file, specifier) =>
        puzzleModulePattern.test(resolveSpecifier(file, specifier)),
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

test('only the pluggable UI adapter imports KaTeX', () => {
  expectNoViolations(
    'KaTeX must remain outside the semantic, representation, Mode, and screen-model layers:',
    violationLines(
      productionImports.filter(({ file }) => file !== katexAdapterFile),
      (_file, specifier) => katexPackagePattern.test(specifier),
    ),
  );
});

test('the academic display adapter contract is AST-based', () => {
  const adapterContractFile = join(
    sourceRoot,
    'features/puzzle/ui/academic-display-adapter.ts',
  );
  const source = readFileSync(adapterContractFile, 'utf8');
  expect(source).toContain(
    'render: (\n    relation: Relation,\n    symbols: AcademicSymbolMap,\n    target: HTMLElement,\n  ) => void;',
  );
  expect(source).not.toMatch(/render:\s*\(\s*source\s*:/);
  expect(source).toMatch(
    /import type \{ Relation \} from '..\/..\/problem-model\/expression';/,
  );
  expect(source).toMatch(
    /import type \{ AcademicSymbolMap \} from '..\/..\/representations\/academic-symbol-map';/,
  );
});

test('misconception classification stays a canonical domain concern', () => {
  const misconceptionFiles = productionImports.filter(({ file }) =>
    /^features\/problem-model\/misconception(?:\.ts)?$/.test(file),
  );
  expect(misconceptionFiles.length).toBeGreaterThan(0);
  expectNoViolations(
    'Misconception classification must not import Theme, UI, or localization modules:',
    violationLines(misconceptionFiles, (file, specifier) => {
      const resolved = resolveSpecifier(file, specifier);
      return (
        themeModulePattern.test(resolved) ||
        uiModulePattern.test(resolved) ||
        puzzleModulePattern.test(resolved)
      );
    }),
  );
  const classifierSource = readFileSync(
    join(sourceRoot, 'features/problem-model/misconception.ts'),
    'utf8',
  );
  expect(classifierSource).not.toMatch(
    /dronePower|droneCount|basePower|followersPerPost|promotedPostCount|startingFollowers|finalFollowers|gaming\.drone-power|creator\.followers/,
  );
});

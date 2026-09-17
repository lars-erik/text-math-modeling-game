import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

type ApprovalReporter = {
  name: string;
  canReportOn(fileName: string): boolean;
  report(approvedFileName: string, receivedFileName: string): void;
};

type ApprovalOptions = {
  reporters: ApprovalReporter[];
  normalizeLineEndingsTo: string;
  failOnLineEndingDifferences: boolean;
  appendEOL: boolean;
  EOL: string;
  errorOnStaleApprovedFiles: boolean;
  shouldIgnoreStaleApprovedFile: (fileName?: string) => boolean;
  stripBOM: boolean;
  forceApproveAll: boolean;
  blockUntilReporterExits: boolean;
  maxLaunches: number;
};

type ApprovalsModule = {
  configure(options: ApprovalOptions): void;
  verify(
    directory: string,
    name: string,
    value: string,
    options?: ApprovalOptions,
  ): void;
};

const require = createRequire(import.meta.url);
const approvals = require('approvals') as ApprovalsModule;

const consoleDiffReporter: ApprovalReporter = {
  name: 'console-diff',
  canReportOn: (fileName) => fileName.endsWith('.txt'),
  report: (approvedFileName, receivedFileName) => {
    const received = readFileSync(receivedFileName, 'utf8');

    console.log(`--- ${approvedFileName}`);
    console.log(`+++ ${receivedFileName}`);

    if (!existsSync(approvedFileName)) {
      console.log('@@ approved baseline is missing @@');
      printAddedLines(received);
      return;
    }

    printChangedLines(readFileSync(approvedFileName, 'utf8'), received);
  },
};

const options: ApprovalOptions = {
  reporters: [consoleDiffReporter],
  normalizeLineEndingsTo: '\n',
  failOnLineEndingDifferences: true,
  appendEOL: false,
  EOL: '\n',
  errorOnStaleApprovedFiles: false,
  shouldIgnoreStaleApprovedFile: () => false,
  stripBOM: false,
  forceApproveAll: false,
  blockUntilReporterExits: true,
  maxLaunches: 1,
};

approvals.configure(options);

const approvalDirectory = fileURLToPath(
  new URL('../approval/', import.meta.url),
);

export function verifyApproval(name: string, value: string): void {
  approvals.verify(approvalDirectory, name, value, options);
}

function printAddedLines(value: string): void {
  for (const line of value.split('\n')) {
    if (line.length > 0) {
      console.log(`+ ${line}`);
    }
  }
}

function printChangedLines(approved: string, received: string): void {
  const approvedLines = approved.split('\n');
  const receivedLines = received.split('\n');
  const lineCount = Math.max(approvedLines.length, receivedLines.length);

  for (let index = 0; index < lineCount; index += 1) {
    const approvedLine = approvedLines[index];
    const receivedLine = receivedLines[index];

    if (approvedLine === receivedLine) {
      continue;
    }

    console.log(`@@ line ${index + 1} @@`);
    if (approvedLine !== undefined) {
      console.log(`- ${approvedLine}`);
    }
    if (receivedLine !== undefined) {
      console.log(`+ ${receivedLine}`);
    }
  }
}

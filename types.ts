
export enum RepoStatus {
  GREEN = 'GREEN',
  AUTO_FIXABLE = 'AUTO_FIXABLE',
  RED = 'RED'
}

export enum Framework {
  NONE = 'none',
  NEXT = 'next',
  REACT = 'react',
  SVELTEKIT = 'sveltekit',
  NUXT = 'nuxt',
  ASTRO = 'astro',
  REMIX = 'remix',
  VUE = 'vue',
  SVELTE = 'svelte',
  ANGULAR = 'angular'
}

export type PhaseState = 'PENDING' | 'SUCCESS' | 'FAILED' | 'SKIPPED' | 'RUNNING';

export interface PhaseResult {
  id: number;
  name: string;
  status: PhaseState;
  log?: string;
}

export type PRStatus = 'NONE' | 'DRAFT' | 'OPEN' | 'MERGED' | 'CLOSED';

export interface Diagnosis {
  repo: string;
  status: RepoStatus;
  reason: string;
  languages: string[];
  framework: Framework;
  ci: 'github-actions' | 'none';
  timestamp: string;
  aiGuardComments?: string[];
  vulnerabilities?: number;
  workflows?: string[];
  jobs?: string[];
  copilotInstructions?: string;
  lastRunLogs?: string[];
  autopsyReport?: AutopsyReport;
  phases?: PhaseResult[];
  // PR & Automerge fields
  prStatus: PRStatus;
  prUrl?: string;
  automergeEnabled: boolean;
  automergeRules?: string[];
  // V1 Hospital enhancements
  web3Stack?: string[];
  hasSmartBrainInsight?: boolean;
  healthScore?: number; // Added for V2.2 scoring gauges
}

export interface AutopsyReport {
  runId: string;
  timestamp: string;
  treeSnapshot: string[];
  capturedFiles: string[];
  traces: Record<string, string>;
  envKeys: string[];
}

export interface HealthReport {
  timestamp: string;
  mermedaPresent: boolean;
  jqPresent: boolean;
  nodePresent: boolean;
  fallbackPresent: boolean;
  missingScripts: string[];
  notExecutable: string[];
  dryRunErrors: string[];
}

export interface VitalsReport {
  repoSize: string;
  fileCount: string;
  largestDirs: string;
  commitCount: string;
  lastCommitAge: string;
  testDurationSec: number;
  buildDurationSec: number;
}

export interface FirewallRule {
  pattern: string;
  severity: 'CRITICAL' | 'WARNING';
  description: string;
}

export interface FirewallReport {
  installed: boolean;
  activeRules: FirewallRule[];
  lastInterceptedFiles: string[];
}

export interface BlackboxRecording {
  runId: string;
  timestamp: string;
  env: string;
  gitStatus: string;
  gitLog: string;
  trace: string;
}

export interface GenomeChange {
  file: string;
  change: 'added' | 'modified' | 'removed';
}

export interface GenomeReport {
  from: string;
  to: string;
  changes: GenomeChange[];
}

export interface ImmunizerReport {
  locked: boolean;
  hashFound: boolean;
  integrityOk: boolean;
  lastLockedAt: string;
  filesProtected: number;
  hash: string;
}

export interface FleetData {
  generatedAt: string;
  repos: Diagnosis[];
}

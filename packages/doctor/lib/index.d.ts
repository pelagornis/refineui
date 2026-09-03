type DoctorCategory = "setup" | "compatibility" | "foundations" | "components" | "library" | "accessibility";
type CheckStatus = "pass" | "fail" | "not-applicable" | "not-verified";
type FindingSeverity = "error" | "warn" | "info";
type ProjectKind = "app" | "library";
type DoctorMeta = {
    target: string;
    workspace?: string;
    projectKinds: ProjectKind[];
    date: string;
    refineui: {
        declared: Record<string, string>;
    };
};
type DoctorCheck = {
    rule: string;
    category: DoctorCategory;
    status: CheckStatus;
    evidence?: string;
    reason?: string;
    references: string[];
};
type DoctorFinding = {
    rule: string;
    severity: FindingSeverity;
    message: string;
    file: string;
    files?: string[];
    line?: number;
    references: string[];
    remediation: string;
};
type DoctorReport = {
    schemaVersion: 2;
    meta: DoctorMeta;
    summary: {
        error: number;
        warn: number;
        info: number;
    };
    checks: DoctorCheck[];
    findings: DoctorFinding[];
    verdicts: [];
    coverage: [];
    rejected: Array<{
        candidate: string;
        reason: string;
        file?: string;
    }>;
};
type WorkspaceTarget = {
    root: string;
    packageJsonPath: string;
    relativePath: string;
    name?: string;
    projectKinds: ProjectKind[];
    declared: Record<string, string>;
    sourceFiles: string[];
};
type RuleContext = {
    docsBase: string;
    workspace: WorkspaceTarget;
};
type RuleResult = {
    check: DoctorCheck;
    findings: DoctorFinding[];
};
type DoctorRule = {
    id: string;
    category: DoctorCategory;
    run: (ctx: RuleContext) => RuleResult;
};

declare function discoverWorkspaces(targetRoot: string): WorkspaceTarget[];
declare function readFileLines(filePath: string): string[];
declare function relPath(root: string, filePath: string): string;

declare const ALL_RULES: DoctorRule[];
declare const DOCS: {
    index: string;
    installation: string;
    theming: string;
    doctor: string;
};
declare function runDoctor(targetRoot: string, workspace: WorkspaceTarget, options?: {
    categories?: string[];
}): DoctorReport;
declare function formatRemediation(target: string, finding: DoctorFinding): string;

declare function reportToYaml(report: DoctorReport): string;
declare function reportToSummary(report: DoctorReport): string;

export { ALL_RULES, type CheckStatus, DOCS, type DoctorCategory, type DoctorCheck, type DoctorFinding, type DoctorMeta, type DoctorReport, type FindingSeverity, type WorkspaceTarget, discoverWorkspaces, formatRemediation, readFileLines, relPath, reportToSummary, reportToYaml, runDoctor };

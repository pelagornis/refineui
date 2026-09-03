export type DoctorCategory =
    | "setup"
    | "compatibility"
    | "foundations"
    | "components"
    | "library"
    | "accessibility";

export type CheckStatus = "pass" | "fail" | "not-applicable" | "not-verified";

export type FindingSeverity = "error" | "warn" | "info";

export type ProjectKind = "app" | "library";

export type DoctorMeta = {
    target: string;
    workspace?: string;
    projectKinds: ProjectKind[];
    date: string;
    refineui: {
        declared: Record<string, string>;
    };
};

export type DoctorCheck = {
    rule: string;
    category: DoctorCategory;
    status: CheckStatus;
    evidence?: string;
    reason?: string;
    references: string[];
};

export type DoctorFinding = {
    rule: string;
    severity: FindingSeverity;
    message: string;
    file: string;
    files?: string[];
    line?: number;
    references: string[];
    remediation: string;
};

export type DoctorReport = {
    schemaVersion: 2;
    meta: DoctorMeta;
    summary: { error: number; warn: number; info: number };
    checks: DoctorCheck[];
    findings: DoctorFinding[];
    verdicts: [];
    coverage: [];
    rejected: Array<{ candidate: string; reason: string; file?: string }>;
};

export type WorkspaceTarget = {
    root: string;
    packageJsonPath: string;
    relativePath: string;
    name?: string;
    projectKinds: ProjectKind[];
    declared: Record<string, string>;
    sourceFiles: string[];
};

export type RuleContext = {
    docsBase: string;
    workspace: WorkspaceTarget;
};

export type RuleResult = {
    check: DoctorCheck;
    findings: DoctorFinding[];
};

export type DoctorRule = {
    id: string;
    category: DoctorCategory;
    run: (ctx: RuleContext) => RuleResult;
};

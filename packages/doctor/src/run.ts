import type { DoctorFinding, DoctorReport, RuleResult, WorkspaceTarget } from "./types.js";
import { packageSetupRule } from "./rules/package-setup.js";
import { stylesheetSetupRule } from "./rules/stylesheet-setup.js";
import { foundationContractRule } from "./rules/foundation-contract.js";
import { compositionApiRule } from "./rules/composition-api.js";
import { componentImportsRule } from "./rules/component-imports.js";

const ALL_RULES = [
    packageSetupRule,
    stylesheetSetupRule,
    foundationContractRule,
    compositionApiRule,
    componentImportsRule,
];

const DOCS = {
    index: "https://ui.pelagornis.com/llms.txt",
    installation: "https://ui.pelagornis.com/development/installation/",
    theming: "https://ui.pelagornis.com/development/theming/",
    doctor: "https://ui.pelagornis.com/ai-tools/doctor/",
};

function summarize(findings: DoctorFinding[]) {
    return findings.reduce(
        (acc, f) => {
            acc[f.severity] += 1;
            return acc;
        },
        { error: 0, warn: 0, info: 0 },
    );
}

function validateReport(report: DoctorReport): void {
    const failRules = new Set(report.checks.filter((c) => c.status === "fail").map((c) => c.rule));
    for (const finding of report.findings) {
        if (!failRules.has(finding.rule)) {
            throw new Error(`Finding rule ${finding.rule} has no matching fail check`);
        }
    }
    for (const check of report.checks.filter((c) => c.status === "fail")) {
        if (!report.findings.some((f) => f.rule === check.rule)) {
            throw new Error(`Fail check ${check.rule} has no finding`);
        }
    }
    const summary = summarize(report.findings);
    if (summary.error !== report.summary.error || summary.warn !== report.summary.warn || summary.info !== report.summary.info) {
        throw new Error("Summary does not match findings severity counts");
    }
}

export function runDoctor(
    targetRoot: string,
    workspace: WorkspaceTarget,
    options?: { categories?: string[] },
): DoctorReport {
    const ctx = { docsBase: "https://ui.pelagornis.com", workspace };
    const rules = options?.categories?.length
        ? ALL_RULES.filter((r) => options.categories?.includes(r.category))
        : ALL_RULES;

    const results: RuleResult[] = rules.map((rule) => rule.run(ctx));
    const checks = results.map((r) => r.check);
    const findings = results.flatMap((r) => r.findings);

    const report: DoctorReport = {
        schemaVersion: 2,
        meta: {
            target: targetRoot,
            workspace: workspace.relativePath === "." ? undefined : workspace.relativePath,
            projectKinds: workspace.projectKinds,
            date: new Date().toISOString().slice(0, 10),
            refineui: { declared: workspace.declared },
        },
        summary: summarize(findings),
        checks,
        findings,
        verdicts: [],
        coverage: [],
        rejected: [],
    };

    validateReport(report);
    return report;
}

export function formatRemediation(
    target: string,
    finding: DoctorFinding,
): string {
    return [
        "Fix the following RefineUI Doctor finding.",
        "",
        `Target project: ${target}`,
        `File: ${finding.file}${finding.line ? `:${finding.line}` : ""}`,
        `Problem: ${finding.message}`,
        "",
        "Requirements:",
        finding.remediation.trim(),
        "",
        "References:",
        ...finding.references.map((ref) => `- ${ref}`),
        "",
        "Do not change unrelated files. Re-run `refineui-doctor` after fixing.",
    ].join("\n");
}

export { DOCS, ALL_RULES };

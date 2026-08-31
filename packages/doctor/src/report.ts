import type { DoctorReport } from "./types.js";

function yamlQuote(value: string): string {
    if (/[:#\[\]{}&*!|>'"%@`]/.test(value) || value.includes("\n")) {
        return JSON.stringify(value);
    }
    return value;
}

function indentBlock(text: string, spaces: number): string {
    const pad = " ".repeat(spaces);
    return text
        .split("\n")
        .map((line) => (line ? pad + line : line))
        .join("\n");
}

export function reportToYaml(report: DoctorReport): string {
    const lines: string[] = [];
    lines.push("schemaVersion: 2");
    lines.push("meta:");
    lines.push(`  target: ${yamlQuote(report.meta.target)}`);
    if (report.meta.workspace) lines.push(`  workspace: ${yamlQuote(report.meta.workspace)}`);
    lines.push(`  projectKinds: [${report.meta.projectKinds.join(", ")}]`);
    lines.push(`  date: ${report.meta.date}`);
    lines.push("  refineui:");
    lines.push("    declared:");
    for (const [pkg, version] of Object.entries(report.meta.refineui.declared)) {
        lines.push(`      ${pkg}: ${yamlQuote(version)}`);
    }

    lines.push("summary:");
    lines.push(`  error: ${report.summary.error}`);
    lines.push(`  warn: ${report.summary.warn}`);
    lines.push(`  info: ${report.summary.info}`);

    lines.push("checks:");
    for (const check of report.checks) {
        lines.push(`  - rule: ${check.rule}`);
        lines.push(`    category: ${check.category}`);
        lines.push(`    status: ${check.status}`);
        if (check.evidence) lines.push(`    evidence: ${yamlQuote(check.evidence)}`);
        if (check.reason) lines.push(`    reason: ${yamlQuote(check.reason)}`);
        lines.push(`    references:`);
        for (const ref of check.references) lines.push(`      - ${yamlQuote(ref)}`);
    }

    lines.push("findings:");
    if (report.findings.length === 0) {
        lines.push("  []");
    } else {
        for (const finding of report.findings) {
            lines.push(`  - rule: ${finding.rule}`);
            lines.push(`    severity: ${finding.severity}`);
            lines.push(`    message: ${yamlQuote(finding.message)}`);
            lines.push(`    file: ${yamlQuote(finding.file)}`);
            if (finding.line) lines.push(`    line: ${finding.line}`);
            lines.push(`    references:`);
            for (const ref of finding.references) lines.push(`      - ${yamlQuote(ref)}`);
            lines.push(`    remediation: |`);
            lines.push(indentBlock(finding.remediation, 6));
        }
    }

    lines.push("verdicts: []");
    lines.push("coverage: []");
    lines.push("rejected: []");

    return `${lines.join("\n")}\n`;
}

export function reportToSummary(report: DoctorReport): string {
    const { error, warn, info } = report.summary;
    const ws = report.meta.workspace ?? ".";
    const lines = [
        `RefineUI Doctor — ${report.meta.date}`,
        `Target: ${report.meta.target} (${ws})`,
        `Packages: ${Object.keys(report.meta.refineui.declared).join(", ") || "none"}`,
        "",
        `Summary: ${error} error(s), ${warn} warn(s), ${info} info`,
        "",
    ];

    for (const check of report.checks) {
        const icon =
            check.status === "pass"
                ? "✓"
                : check.status === "fail"
                  ? "✗"
                  : check.status === "not-applicable"
                    ? "–"
                    : "?";
        lines.push(`${icon} ${check.rule} (${check.status})${check.evidence ? `: ${check.evidence}` : ""}`);
    }

    if (report.findings.length > 0) {
        lines.push("");
        lines.push("Findings:");
        for (const f of report.findings.slice(0, 10)) {
            lines.push(`  [${f.severity}] ${f.file}${f.line ? `:${f.line}` : ""} — ${f.message}`);
        }
        if (report.findings.length > 10) {
            lines.push(`  … and ${report.findings.length - 10} more (see YAML report)`);
        }
    }

    return lines.join("\n");
}

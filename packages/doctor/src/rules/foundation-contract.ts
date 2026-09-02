import type { DoctorRule, DoctorFinding } from "../types.js";
import { readFileLines, relPath } from "../discover.js";

const REFS = [
    "https://ui.pelagornis.com/foundations/",
    "https://ui.pelagornis.com/llms.txt",
];

const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/;
const RGBA_PATTERN = /rgba?\(\s*\d+/;
const ARBITRARY_PX_PATTERN = /(?:^|[\s"'`])(\d+(?:\.\d+)?px)(?:[\s"'`]|$)/;
const STYLE_FILE = /\.(tsx?|jsx?|css)$/;

function isLikelyTokenLine(line: string): boolean {
    return (
        line.includes("var(--refineui") ||
        line.includes("@refineui/tokens") ||
        line.includes("refineui-color") ||
        line.trim().startsWith("//") ||
        line.trim().startsWith("*") ||
        line.trim().startsWith("/*")
    );
}

export const foundationContractRule: DoctorRule = {
    id: "foundation-contract",
    category: "foundations",
    run({ workspace }) {
        const codeFiles = workspace.sourceFiles.filter((f) => STYLE_FILE.test(f));
        const findings: DoctorFinding[] = [];

        for (const file of codeFiles) {
            const lines = readFileLines(file);
            lines.forEach((line, index) => {
                if (isLikelyTokenLine(line)) return;
                const rel = relPath(workspace.root, file);
                const lineNo = index + 1;

                if (HEX_PATTERN.test(line)) {
                    findings.push({
                        rule: "foundation-contract",
                        severity: "warn",
                        message: "Hardcoded hex color detected — use RefineUI design tokens instead",
                        file: rel,
                        line: lineNo,
                        references: REFS,
                        remediation:
                            "Replace hardcoded hex/rgba colors with semantic tokens (e.g. var(--refineui-color-alias-*) or Tailwind theme tokens from @refineui/tokens).",
                    });
                } else if (RGBA_PATTERN.test(line)) {
                    findings.push({
                        rule: "foundation-contract",
                        severity: "warn",
                        message: "Hardcoded rgb/rgba color detected — use RefineUI design tokens instead",
                        file: rel,
                        line: lineNo,
                        references: REFS,
                        remediation:
                            "Replace hardcoded rgb/rgba with semantic color tokens from @refineui/tokens.",
                    });
                } else if (ARBITRARY_PX_PATTERN.test(line) && !line.includes("strokeWidth")) {
                    findings.push({
                        rule: "foundation-contract",
                        severity: "info",
                        message: "Arbitrary px value detected — prefer RefineUI spacing/size tokens",
                        file: rel,
                        line: lineNo,
                        references: REFS,
                        remediation:
                            "Use spacing, foundation size, or component size tokens instead of raw px values in component styles.",
                    });
                }
            });
        }

        const capped = findings.slice(0, 20);
        if (capped.length === 0) {
            return {
                check: {
                    rule: "foundation-contract",
                    category: "foundations",
                    status: "pass",
                    evidence: `Scanned ${codeFiles.length} source files — no token violations`,
                    references: REFS,
                },
                findings: [],
            };
        }

        const significant = capped.filter((f) => f.severity !== "info");
        if (significant.length === 0) {
            return {
                check: {
                    rule: "foundation-contract",
                    category: "foundations",
                    status: "pass",
                    evidence: `${capped.length} informational px hint(s) — no contract violations`,
                    references: REFS,
                },
                findings: [],
            };
        }

        return {
            check: {
                rule: "foundation-contract",
                category: "foundations",
                status: "fail",
                evidence: `${significant.length} token contract issue(s) in ${new Set(significant.map((f) => f.file)).size} file(s)`,
                references: REFS,
            },
            findings: capped,
        };
    },
};

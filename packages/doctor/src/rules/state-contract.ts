import type { DoctorRule, DoctorFinding } from "../types.js";
import { readFileLines, relPath } from "../discover.js";

const REFS = [
    "https://ui.pelagornis.com/foundations/design-tokens/",
    "https://ui.pelagornis.com/llms.txt",
];

const COMPONENT_TSX = /packages\/react\/src\/components\/[^/]+\/[A-Z][^/]+\.tsx$/;

export const stateContractRule: DoctorRule = {
    id: "state-contract",
    category: "components",
    run({ workspace }) {
        const findings: DoctorFinding[] = [];
        const componentFiles = workspace.sourceFiles.filter((f) => COMPONENT_TSX.test(f.replace(/\\/g, "/")));

        for (const file of componentFiles) {
            const lines = readFileLines(file);
            const rel = relPath(workspace.root, file);
            const content = lines.join("\n");

            const exportFn = content.match(/export function (\w+)/);
            if (!exportFn) continue;
            const componentName = exportFn[1];
            if (componentName.startsWith("use")) continue;

            const hasDataRefineui =
                content.includes('data-refineui="') ||
                content.includes("data-refineui={'") ||
                content.includes('data-refineui={');

            if (!hasDataRefineui && !content.includes("forwardRef")) {
                findings.push({
                    rule: "state-contract",
                    severity: "info",
                    message: `Root component ${componentName} has no data-refineui attribute`,
                    file: rel,
                    references: REFS,
                    remediation:
                        "Set data-refineui on the component root. Use data-variant, data-size, and data-state for visual/interaction contracts.",
                });
            }

            lines.forEach((line, index) => {
                if (/:focus(?!-visible)/.test(line) && !line.includes(":focus-visible")) {
                    findings.push({
                        rule: "state-contract",
                        severity: "warn",
                        message: ":focus used without :focus-visible — prefer keyboard-only focus rings",
                        file: rel,
                        line: index + 1,
                        references: REFS,
                        remediation:
                            "Use :focus-visible with --refineui-focus-ring-* vars. Avoid :focus for mouse clicks.",
                    });
                }
            });
        }

        const capped = findings.slice(0, 15);
        const significant = capped.filter((f) => f.severity === "warn");

        if (significant.length === 0) {
            return {
                check: {
                    rule: "state-contract",
                    category: "components",
                    status: "pass",
                    evidence: `Scanned ${componentFiles.length} component roots — state contract OK`,
                    references: REFS,
                },
                findings: [],
            };
        }

        return {
            check: {
                rule: "state-contract",
                category: "components",
                status: "fail",
                evidence: `${significant.length} state/focus contract issue(s)`,
                references: REFS,
            },
            findings: significant,
        };
    },
};

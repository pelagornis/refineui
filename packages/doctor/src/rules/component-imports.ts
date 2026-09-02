import type { DoctorRule, DoctorFinding } from "../types.js";
import { readFileLines, relPath } from "../discover.js";

const REFS = [
    "https://ui.pelagornis.com/development/installation/",
    "https://ui.pelagornis.com/llms.txt",
];

const SHALLOW_IMPORT_PATTERN = /from\s+["']@refineui\/react\/(?:src\/|components\/)/;
const LEGACY_IMPORT_PATTERN = /from\s+["']refineui["']/;

export const componentImportsRule: DoctorRule = {
    id: "component-imports",
    category: "components",
    run({ workspace }) {
        const sourceFiles = workspace.sourceFiles.filter((f) => /\.(tsx?|jsx?)$/.test(f));
        const findings: DoctorFinding[] = [];

        for (const file of sourceFiles) {
            const lines = readFileLines(file);
            lines.forEach((line, index) => {
                if (SHALLOW_IMPORT_PATTERN.test(line)) {
                    findings.push({
                        rule: "component-imports",
                        severity: "error",
                        message: "Deep import from @refineui/react — import from the package root instead",
                        file: relPath(workspace.root, file),
                        line: index + 1,
                        references: REFS,
                        remediation: 'Use `import { Button, ... } from "@refineui/react"` — never deep-import internal paths.',
                    });
                }
                if (LEGACY_IMPORT_PATTERN.test(line)) {
                    findings.push({
                        rule: "component-imports",
                        severity: "error",
                        message: 'Legacy "refineui" import — use scoped "@refineui/react" package',
                        file: relPath(workspace.root, file),
                        line: index + 1,
                        references: REFS,
                        remediation: 'Replace `from "refineui"` with `from "@refineui/react"`.',
                    });
                }
            });
        }

        if (findings.length === 0) {
            return {
                check: {
                    rule: "component-imports",
                    category: "components",
                    status: "pass",
                    evidence: `Scanned ${sourceFiles.length} files — imports follow @refineui/react conventions`,
                    references: REFS,
                },
                findings: [],
            };
        }

        return {
            check: {
                rule: "component-imports",
                category: "components",
                status: "fail",
                evidence: `${findings.length} import convention violation(s)`,
                references: REFS,
            },
            findings: findings.slice(0, 15),
        };
    },
};

import type { DoctorRule, DoctorFinding } from "../types.js";
import { readFileLines, relPath } from "../discover.js";

const REFS = [
    "https://design.pelagornis.com/refineui/components/",
    "https://design.pelagornis.com/refineui/llm.txt",
];

const CONVENIENCE_PROPS = ["title", "description", "items", "actions", "onClose"] as const;

function extractRefineuiImports(content: string): Set<string> {
    const names = new Set<string>();
    const importPattern = /import\s+(?:type\s+)?(?:\{([^}]+)\}|(\w+))\s+from\s+["']@refineui\/react["']/g;
    let match: RegExpExecArray | null;
    while ((match = importPattern.exec(content)) !== null) {
        const block = match[1];
        if (block) {
            for (const part of block.split(",")) {
                const name = part.trim().split(/\s+as\s+/)[0]?.trim();
                if (name && /^[A-Z]/.test(name)) names.add(name);
            }
        } else if (match[2]) {
            names.add(match[2]);
        }
    }
    return names;
}

export const compositionApiRule: DoctorRule = {
    id: "composition-api",
    category: "components",
    run({ workspace }) {
        const tsxFiles = workspace.sourceFiles.filter((f) => /\.tsx$/.test(f));
        const findings: DoctorFinding[] = [];

        for (const file of tsxFiles) {
            const content = readFileLines(file).join("\n");
            const refineuiComponents = extractRefineuiImports(content);
            if (refineuiComponents.size === 0) continue;

            const lines = content.split("\n");
            lines.forEach((line, index) => {
                for (const component of refineuiComponents) {
                    const openTag = new RegExp(`<${component}\\b`);
                    if (!openTag.test(line)) continue;

                    for (const prop of CONVENIENCE_PROPS) {
                        const pattern = new RegExp(`\\b${prop}\\s*=`);
                        if (pattern.test(line)) {
                            findings.push({
                                rule: "composition-api",
                                severity: "warn",
                                message: `Convenience prop "${prop}" on <${component}> — use composable subcomponents instead`,
                                file: relPath(workspace.root, file),
                                line: index + 1,
                                references: REFS,
                                remediation: [
                                    "RefineUI components use composable subcomponent APIs only.",
                                    `Do not pass convenience props (${CONVENIENCE_PROPS.join(", ")}) to RefineUI components.`,
                                    "Compose with documented subcomponents (e.g. Dialog.Title, Dialog.Content).",
                                ].join("\n"),
                            });
                        }
                    }
                }
            });
        }

        const capped = findings.slice(0, 15);
        if (capped.length === 0) {
            return {
                check: {
                    rule: "composition-api",
                    category: "components",
                    status: "pass",
                    evidence: `Scanned ${tsxFiles.length} TSX files — no convenience prop usage on @refineui/react imports`,
                    references: REFS,
                },
                findings: [],
            };
        }

        return {
            check: {
                rule: "composition-api",
                category: "components",
                status: "fail",
                evidence: `${capped.length} convenience prop usage(s) on RefineUI components`,
                references: REFS,
            },
            findings: capped,
        };
    },
};

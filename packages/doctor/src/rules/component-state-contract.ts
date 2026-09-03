import type { DoctorRule, DoctorFinding } from "../types.js";
import { readFileLines, relPath } from "../discover.js";
import { loadComponentSpecs } from "../component-spec.js";

const REFS = [
    "https://ui.pelagornis.com/ai-tools/doctor/",
    "https://ui.pelagornis.com/llms.txt",
];

const SOURCE_FILE = /\.(tsx?|jsx?)$/;

/** Match data-state="literal" or data-state={'literal'} on same or nearby line as data-refineui */
const DATA_STATE_STRING = /data-state=["'{]([a-zA-Z0-9_-]+)["'}]/g;

/** Extract data-refineui from line */
const DATA_REFINEUI = /data-refineui=["'{]([a-zA-Z0-9_-]+)["'}]/;

export const componentStateContractRule: DoctorRule = {
    id: "component-state-contract",
    category: "components",
    run({ workspace }) {
        const loaded = loadComponentSpecs();
        const findings: DoctorFinding[] = [];

        if (!loaded) {
            return {
                check: {
                    rule: "component-state-contract",
                    category: "components",
                    status: "not-verified",
                    reason: "Component spec manifest not found — build @refineui/react or run from monorepo",
                    references: REFS,
                },
                findings: [],
            };
        }

        const { dataStateSchema } = loaded;
        const sourceFiles = workspace.sourceFiles.filter((f) => SOURCE_FILE.test(f));

        for (const file of sourceFiles) {
            const lines = readFileLines(file);
            const rel = relPath(workspace.root, file);

            lines.forEach((line, index) => {
                const refineuiMatch = line.match(DATA_REFINEUI);
                if (!refineuiMatch) return;

                const dataRefineui = refineuiMatch[1];
                const allowed = dataStateSchema[dataRefineui];
                if (!allowed?.length) return;

                for (const stateMatch of line.matchAll(DATA_STATE_STRING)) {
                    const received = stateMatch[1];
                    if (allowed.includes(received)) continue;

                    findings.push({
                        rule: "component-state-contract",
                        severity: "error",
                        message: `Invalid component state "${received}" on data-refineui="${dataRefineui}"`,
                        file: rel,
                        line: index + 1,
                        references: REFS,
                        remediation: [
                            `Component: ${dataRefineui}`,
                            `Attribute: data-state`,
                            `Received: ${received}`,
                            `Expected: ${allowed.map((v) => `- ${v}`).join("\n")}`,
                            "",
                            "See packages/react/spec/components/*.json — Spec defines contracts, not implementation docs.",
                        ].join("\n"),
                    });
                }
            });
        }

        const capped = findings.slice(0, 20);

        if (capped.length === 0) {
            return {
                check: {
                    rule: "component-state-contract",
                    category: "components",
                    status: "pass",
                    evidence: `Validated data-state literals against ${Object.keys(dataStateSchema).length} DOM contract(s)`,
                    references: REFS,
                },
                findings: [],
            };
        }

        return {
            check: {
                rule: "component-state-contract",
                category: "components",
                status: "fail",
                evidence: `${capped.length} invalid data-state value(s) against Component Spec`,
                references: REFS,
            },
            findings: capped,
        };
    },
};

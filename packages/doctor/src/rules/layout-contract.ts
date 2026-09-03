import type { DoctorFinding, DoctorRule } from "../types.js";
import { relPath } from "../discover.js";
import { collectComponentSources, readWorkspaceFile } from "../keyboard-spec.js";
import { findPhysicalDirectionHits, loadLayoutContracts } from "../layout-spec.js";

const REFS = [
    "https://ui.pelagornis.com/ai-tools/doctor/",
    "https://ui.pelagornis.com/llms.txt",
];

type FindingInput = Omit<DoctorFinding, "rule">;

function push(findings: DoctorFinding[], input: FindingInput): void {
    findings.push({ rule: "layout-contract", ...input });
}

/**
 * Validates declared layout / RTL contracts.
 * Doctor checks physical left/right utilities — not full bidirectional layout proof.
 */
export const layoutContractRule: DoctorRule = {
    id: "layout-contract",
    category: "accessibility",
    run({ workspace }) {
        const contracts = loadLayoutContracts();
        const findings: DoctorFinding[] = [];

        if (contracts.length === 0) {
            return {
                check: {
                    rule: "layout-contract",
                    category: "accessibility",
                    status: "not-verified",
                    reason: "Component spec layout contracts not found",
                    references: REFS,
                },
                findings: [],
            };
        }

        let validatedComponents = 0;

        for (const entry of contracts) {
            const sourcePaths = collectComponentSources(workspace.root, entry.exportName);
            if (sourcePaths.length === 0) continue;

            validatedComponents += 1;

            for (const file of sourcePaths) {
                const content = readWorkspaceFile(file);
                const rel = relPath(workspace.root, file);
                const hits = findPhysicalDirectionHits(content);

                for (const hit of hits) {
                    push(findings, {
                        severity: "error",
                        message: `Layout contract violation — physical direction utility "${hit.id}"`,
                        file: rel,
                        line: hit.line,
                        references: REFS,
                        remediation: [
                            `Component: ${entry.componentId}`,
                            `Contract: layout.direction=logical` +
                                (entry.layout.rtl ? ", layout.rtl=true" : ""),
                            `Found: ${hit.id}`,
                            `Expected: ${hit.expected}`,
                            `Snippet: ${hit.snippet}`,
                            `Use logical Tailwind (ps/pe/ms/me/text-start) or CSS logical properties.`,
                        ].join("\n"),
                    });
                }
            }
        }

        const capped = findings.slice(0, 25);

        if (validatedComponents === 0) {
            return {
                check: {
                    rule: "layout-contract",
                    category: "accessibility",
                    status: "not-applicable",
                    evidence: "No component implementation directories match declared layout contracts",
                    references: REFS,
                },
                findings: [],
            };
        }

        if (capped.length === 0) {
            return {
                check: {
                    rule: "layout-contract",
                    category: "accessibility",
                    status: "pass",
                    evidence: `Validated layout/RTL contracts on ${validatedComponents} component(s)`,
                    references: REFS,
                },
                findings: [],
            };
        }

        return {
            check: {
                rule: "layout-contract",
                category: "accessibility",
                status: "fail",
                evidence: `${capped.length} layout contract violation(s)`,
                references: REFS,
            },
            findings: capped,
        };
    },
};

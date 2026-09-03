import { join } from "node:path";
import type { DoctorFinding, DoctorRule } from "../types.js";
import { relPath } from "../discover.js";
import { readWorkspaceFile } from "../keyboard-spec.js";
import {
    blockReferencesSlot,
    extractForcedColorsBlock,
    extractPrefersContrastBlock,
    interactiveSlotsForForcedColors,
    loadEnvironmentContracts,
} from "../environment-spec.js";

const REFS = [
    "https://ui.pelagornis.com/ai-tools/doctor/",
    "https://ui.pelagornis.com/llms.txt",
];

type FindingInput = Omit<DoctorFinding, "rule">;

function push(findings: DoctorFinding[], input: FindingInput): void {
    findings.push({ rule: "environment-contract", ...input });
}

/**
 * Validates declared environment contracts (forced-colors + prefers-contrast).
 * Doctor checks required CSS structure/patterns — not full High Contrast audit.
 */
export const environmentContractRule: DoctorRule = {
    id: "environment-contract",
    category: "accessibility",
    run({ workspace }) {
        const contracts = loadEnvironmentContracts();
        const findings: DoctorFinding[] = [];

        if (contracts.length === 0) {
            return {
                check: {
                    rule: "environment-contract",
                    category: "accessibility",
                    status: "not-verified",
                    reason: "Component spec environment contracts not found",
                    references: REFS,
                },
                findings: [],
            };
        }

        const forcedColorEntries = contracts.filter((entry) =>
            entry.environments.includes("forced-colors"),
        );
        const prefersContrastEntries = contracts.filter((entry) =>
            entry.environments.includes("prefers-contrast"),
        );

        if (forcedColorEntries.length === 0 && prefersContrastEntries.length === 0) {
            return {
                check: {
                    rule: "environment-contract",
                    category: "accessibility",
                    status: "not-applicable",
                    evidence: "No forced-colors / prefers-contrast environment contracts declared",
                    references: REFS,
                },
                findings: [],
            };
        }

        const cssPath = join(workspace.root, "refineui.css");
        const cssContent = readWorkspaceFile(cssPath);
        const cssRel = existsRelative(workspace.root, "refineui.css")
            ? relPath(workspace.root, cssPath)
            : "refineui.css";

        if (!cssContent) {
            push(findings, {
                severity: "error",
                message: "environment contracts require refineui.css",
                file: cssRel,
                references: REFS,
                remediation: [
                    "Contract: states.environment includes forced-colors and/or prefers-contrast",
                    "Expected: packages/react/refineui.css with matching @media blocks",
                ].join("\n"),
            });

            return {
                check: {
                    rule: "environment-contract",
                    category: "accessibility",
                    status: "fail",
                    evidence: "1 environment contract violation(s)",
                    references: REFS,
                },
                findings,
            };
        }

        if (forcedColorEntries.length > 0) {
            const forcedBlock = extractForcedColorsBlock(cssContent);
            if (!forcedBlock) {
                push(findings, {
                    severity: "error",
                    message: "Missing @media (forced-colors: active) block",
                    file: cssRel,
                    references: REFS,
                    remediation: [
                        "Contract: states.environment = forced-colors",
                        "Expected: @media (forced-colors: active) { ... } in refineui.css",
                        "Use system colors (Highlight, CanvasText, ButtonBorder) — not theme aliases.",
                    ].join("\n"),
                });
            } else {
                for (const entry of forcedColorEntries) {
                    const slots = interactiveSlotsForForcedColors(entry.dataRefineui);
                    for (const slot of slots) {
                        if (!blockReferencesSlot(forcedBlock, slot)) {
                            push(findings, {
                                severity: "error",
                                message: `forced-colors CSS missing slot "${slot}"`,
                                file: cssRel,
                                references: REFS,
                                remediation: [
                                    `Component: ${entry.componentId}`,
                                    `Slot: ${slot}`,
                                    `Contract: states.environment includes forced-colors`,
                                    `Expected: [data-refineui="${slot}"] rules inside @media (forced-colors: active)`,
                                ].join("\n"),
                            });
                        }
                    }
                }
            }
        }

        if (prefersContrastEntries.length > 0) {
            const contrastBlock = extractPrefersContrastBlock(cssContent);
            if (!contrastBlock) {
                push(findings, {
                    severity: "error",
                    message: "Missing @media (prefers-contrast: more) block",
                    file: cssRel,
                    references: REFS,
                    remediation: [
                        "Contract: states.environment = prefers-contrast",
                        "Expected: @media (prefers-contrast: more) { ... } in refineui.css",
                    ].join("\n"),
                });
            } else {
                for (const entry of prefersContrastEntries) {
                    const slots = interactiveSlotsForForcedColors(entry.dataRefineui);
                    for (const slot of slots) {
                        if (!blockReferencesSlot(contrastBlock, slot)) {
                            push(findings, {
                                severity: "error",
                                message: `prefers-contrast CSS missing slot "${slot}"`,
                                file: cssRel,
                                references: REFS,
                                remediation: [
                                    `Component: ${entry.componentId}`,
                                    `Slot: ${slot}`,
                                    `Contract: states.environment includes prefers-contrast`,
                                    `Expected: [data-refineui="${slot}"] rules inside @media (prefers-contrast: more)`,
                                ].join("\n"),
                            });
                        }
                    }
                }
            }
        }

        const capped = findings.slice(0, 25);
        const validatedCount = forcedColorEntries.length + prefersContrastEntries.length;

        if (capped.length === 0) {
            return {
                check: {
                    rule: "environment-contract",
                    category: "accessibility",
                    status: "pass",
                    evidence: `Validated environment contracts on ${validatedCount} component declaration(s) (forced-colors: ${forcedColorEntries.length}, prefers-contrast: ${prefersContrastEntries.length})`,
                    references: REFS,
                },
                findings: [],
            };
        }

        return {
            check: {
                rule: "environment-contract",
                category: "accessibility",
                status: "fail",
                evidence: `${capped.length} environment contract violation(s)`,
                references: REFS,
            },
            findings: capped,
        };
    },
};

function existsRelative(root: string, file: string): boolean {
    return readWorkspaceFile(join(root, file)).length > 0;
}

import { join } from "node:path";
import type { DoctorFinding, DoctorRule } from "../types.js";
import { relPath } from "../discover.js";
import { collectComponentSources, readWorkspaceFile } from "../keyboard-spec.js";
import {
    hasFocusInitialPattern,
    hasFocusReturnPattern,
    hasFocusTrapPattern,
    hasFocusVisibleVisualContract,
    loadFocusContracts,
    readFileIfExists,
    resolveFocusTrapHookPath,
} from "../focus-spec.js";

const REFS = [
    "https://ui.pelagornis.com/ai-tools/doctor/",
    "https://ui.pelagornis.com/llms.txt",
];

type FindingInput = Omit<DoctorFinding, "rule">;

function push(findings: DoctorFinding[], input: FindingInput): void {
    findings.push({ rule: "focus-contract", ...input });
}

export const focusContractRule: DoctorRule = {
    id: "focus-contract",
    category: "accessibility",
    run({ workspace }) {
        const contracts = loadFocusContracts();
        const findings: DoctorFinding[] = [];

        if (contracts.length === 0) {
            return {
                check: {
                    rule: "focus-contract",
                    category: "accessibility",
                    status: "not-verified",
                    reason: "Component spec focus contracts not found",
                    references: REFS,
                },
                findings: [],
            };
        }

        const cssContent = readWorkspaceFile(join(workspace.root, "refineui.css"));
        const hookPath = resolveFocusTrapHookPath(workspace.root);
        const hookContent = readFileIfExists(hookPath);

        let validatedComponents = 0;

        for (const entry of contracts) {
            const sourcePaths = collectComponentSources(workspace.root, entry.exportName);
            if (sourcePaths.length === 0) continue;

            validatedComponents += 1;
            const componentContent = sourcePaths.map((file) => readWorkspaceFile(file)).join("\n");
            const primaryFile = relPath(workspace.root, sourcePaths[0]!);

            const { visual, behavior } = entry.focus;

            if (visual?.required && visual.selector === ":focus-visible") {
                if (
                    !hasFocusVisibleVisualContract(
                        entry.dataRefineui,
                        cssContent,
                        componentContent,
                        entry.declaresFocusVisiblePseudo,
                    )
                ) {
                    push(findings, {
                        severity: "error",
                        message: `Focus visual contract violation — :focus-visible pattern not found`,
                        file: primaryFile,
                        references: REFS,
                        remediation: [
                            `Component: ${entry.componentId}`,
                            `Contract: focus.visual`,
                            `Expected: ${visual.selector} styling for interactive slots`,
                            `Add refineui.css :focus-visible rules or focus-visible utility classes.`,
                        ].join("\n"),
                    });
                }
            }

            if (behavior?.trap) {
                if (!hasFocusTrapPattern(componentContent)) {
                    push(findings, {
                        severity: "error",
                        message: `Focus behavior contract violation — focus trap pattern not found`,
                        file: primaryFile,
                        references: REFS,
                        remediation: [
                            `Component: ${entry.componentId}`,
                            `Contract: focus.behavior.trap = true`,
                            `Expected: useFocusTrap(...) or equivalent trap implementation`,
                        ].join("\n"),
                    });
                }
            }

            if (behavior?.initial === "first-focusable") {
                if (!hasFocusInitialPattern(componentContent, hookContent)) {
                    push(findings, {
                        severity: "error",
                        message: `Focus behavior contract violation — initial focus pattern not found`,
                        file: primaryFile,
                        references: REFS,
                        remediation: [
                            `Component: ${entry.componentId}`,
                            `Contract: focus.behavior.initial = first-focusable`,
                            `Expected: focus first focusable element on open (e.g. useFocusTrap hook)`,
                        ].join("\n"),
                    });
                }
            }

            if (behavior?.return === "trigger") {
                if (!hasFocusReturnPattern(componentContent, hookContent)) {
                    push(findings, {
                        severity: "error",
                        message: `Focus behavior contract violation — focus return pattern not found`,
                        file: primaryFile,
                        references: REFS,
                        remediation: [
                            `Component: ${entry.componentId}`,
                            `Contract: focus.behavior.return = trigger`,
                            `Expected: restore focus to trigger on close (e.g. previousFocus in useFocusTrap)`,
                        ].join("\n"),
                    });
                }
            }
        }

        const capped = findings.slice(0, 25);

        if (validatedComponents === 0) {
            return {
                check: {
                    rule: "focus-contract",
                    category: "accessibility",
                    status: "not-applicable",
                    evidence: "No component implementation directories match declared focus contracts",
                    references: REFS,
                },
                findings: [],
            };
        }

        if (capped.length === 0) {
            return {
                check: {
                    rule: "focus-contract",
                    category: "accessibility",
                    status: "pass",
                    evidence: `Validated focus contracts on ${validatedComponents} component(s)`,
                    references: REFS,
                },
                findings: [],
            };
        }

        return {
            check: {
                rule: "focus-contract",
                category: "accessibility",
                status: "fail",
                evidence: `${capped.length} focus contract violation(s)`,
                references: REFS,
            },
            findings: capped,
        };
    },
};

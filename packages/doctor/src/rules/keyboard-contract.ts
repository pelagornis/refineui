import type { DoctorFinding, DoctorRule } from "../types.js";
import { relPath } from "../discover.js";
import {
    collectComponentSources,
    hasActionPattern,
    hasKeyHandler,
    isFullyNativeKeyboard,
    loadKeyboardContracts,
    readWorkspaceFile,
} from "../keyboard-spec.js";

const REFS = [
    "https://ui.pelagornis.com/ai-tools/doctor/",
    "https://ui.pelagornis.com/llms.txt",
];

type FindingInput = Omit<DoctorFinding, "rule">;

function push(findings: DoctorFinding[], input: FindingInput): void {
    findings.push({ rule: "keyboard-contract", ...input });
}

export const keyboardContractRule: DoctorRule = {
    id: "keyboard-contract",
    category: "accessibility",
    run({ workspace }) {
        const contracts = loadKeyboardContracts();
        const findings: DoctorFinding[] = [];

        if (contracts.length === 0) {
            return {
                check: {
                    rule: "keyboard-contract",
                    category: "accessibility",
                    status: "not-verified",
                    reason: "Component spec keyboard contracts not found",
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
            const content = sourcePaths.map((file) => readWorkspaceFile(file)).join("\n");
            const primaryFile = relPath(workspace.root, sourcePaths[0]!);

            if (isFullyNativeKeyboard(entry.bindings)) continue;

            for (const [key, binding] of Object.entries(entry.bindings)) {
                if (binding.native) continue;

                const contractPath = `keyboard.${key}`;

                if (!hasKeyHandler(content, key)) {
                    push(findings, {
                        severity: "error",
                        message: `Keyboard contract violation — missing handler for "${key}"`,
                        file: primaryFile,
                        references: REFS,
                        remediation: [
                            `Component: ${entry.componentId}`,
                            `Key: ${key}`,
                            `Expected: ${binding.action}`,
                            `Received: none`,
                            `Contract: ${contractPath}`,
                        ].join("\n"),
                    });
                    continue;
                }

                if (!hasActionPattern(content, binding.action)) {
                    push(findings, {
                        severity: "error",
                        message: `Keyboard contract violation — "${key}" does not implement "${binding.action}"`,
                        file: primaryFile,
                        references: REFS,
                        remediation: [
                            `Component: ${entry.componentId}`,
                            `Key: ${key}`,
                            `Expected action: ${binding.action}`,
                            `Contract: ${contractPath}`,
                            `Ensure the key handler implements the declared action pattern.`,
                        ].join("\n"),
                    });
                }
            }
        }

        const capped = findings.slice(0, 25);

        if (validatedComponents === 0) {
            return {
                check: {
                    rule: "keyboard-contract",
                    category: "accessibility",
                    status: "not-applicable",
                    evidence: "No component implementation directories match declared keyboard contracts",
                    references: REFS,
                },
                findings: [],
            };
        }

        if (capped.length === 0) {
            return {
                check: {
                    rule: "keyboard-contract",
                    category: "accessibility",
                    status: "pass",
                    evidence: `Validated keyboard contracts on ${validatedComponents} component(s)`,
                    references: REFS,
                },
                findings: [],
            };
        }

        return {
            check: {
                rule: "keyboard-contract",
                category: "accessibility",
                status: "fail",
                evidence: `${capped.length} keyboard contract violation(s)`,
                references: REFS,
            },
            findings: capped,
        };
    },
};

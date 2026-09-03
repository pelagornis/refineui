import type { DoctorFinding, DoctorRule } from "../types.js";
import { readFileLines, relPath } from "../discover.js";
import {
    extractAttributeExpression,
    extractAttributeStringLiteral,
    fileContainsSlot,
    hasAttribute,
    loadAccessibilitySlots,
    usesNativeElement,
} from "../accessibility-spec.js";

const REFS = [
    "https://ui.pelagornis.com/ai-tools/doctor/",
    "https://ui.pelagornis.com/llms.txt",
];

const SOURCE_FILE = /\.(tsx|jsx)$/;

type FindingInput = Omit<DoctorFinding, "rule">;

function push(findings: DoctorFinding[], input: FindingInput): void {
    findings.push({ rule: "accessibility-contract", ...input });
}

function validateRequiredAttributes(
    content: string,
    rel: string,
    componentId: string,
    slotId: string,
    requiredAttributes: Record<string, { required: boolean; type?: string }>,
    findings: DoctorFinding[],
): void {
    for (const [attr, contract] of Object.entries(requiredAttributes)) {
        if (!contract.required) continue;

        const contractPath = `accessibility.${slotId}.requiredAttributes.${attr}`;

        if (!hasAttribute(content, attr)) {
            push(findings, {
                severity: "error",
                message: `Missing required accessibility attribute "${attr}" on ${slotId}`,
                file: rel,
                references: REFS,
                remediation: [
                    `Component: ${componentId}`,
                    `Slot: ${slotId}`,
                    `Missing required attribute: ${attr}`,
                    `Contract: ${contractPath}`,
                    `Expected: required: true${contract.type ? `, type: ${contract.type}` : ""}`,
                ].join("\n"),
            });
            continue;
        }

        if (contract.type === "boolean") {
            const literal = extractAttributeStringLiteral(content, attr);
            if (literal !== null) {
                push(findings, {
                    severity: "error",
                    message: `Invalid type for "${attr}" — boolean expression required, string literal found`,
                    file: rel,
                    references: REFS,
                    remediation: [
                        `Component: ${componentId}`,
                        `Slot: ${slotId}`,
                        `Attribute: ${attr}`,
                        `Received: "${literal}" (string literal)`,
                        `Contract: ${contractPath}`,
                        `Expected: aria-expanded={boolean} — canonical RefineUI form`,
                    ].join("\n"),
                });
            } else if (extractAttributeExpression(content, attr) === null) {
                push(findings, {
                    severity: "error",
                    message: `Invalid type for "${attr}" — expected boolean JSX expression`,
                    file: rel,
                    references: REFS,
                    remediation: [
                        `Component: ${componentId}`,
                        `Slot: ${slotId}`,
                        `Attribute: ${attr}`,
                        `Contract: ${contractPath}`,
                        `Expected: {boolean expression} e.g. aria-expanded={open}`,
                    ].join("\n"),
                });
            }
        }

        if (contract.type === "string") {
            const literal = extractAttributeStringLiteral(content, attr);
            const expr = extractAttributeExpression(content, attr);
            if (literal === null && expr === null) {
                push(findings, {
                    severity: "error",
                    message: `Invalid type for "${attr}" — expected string expression or id reference`,
                    file: rel,
                    references: REFS,
                    remediation: [
                        `Component: ${componentId}`,
                        `Slot: ${slotId}`,
                        `Attribute: ${attr}`,
                        `Contract: ${contractPath}`,
                        `Expected: type string (expression referencing id/token)`,
                    ].join("\n"),
                });
            }
        }
    }
}

function validateNativeElement(
    content: string,
    rel: string,
    componentId: string,
    slotId: string,
    contract: { native?: boolean; element?: string },
    findings: DoctorFinding[],
): void {
    if (!contract.native || contract.element !== "button") return;
    if (!fileContainsSlot(content, slotId)) return;

    if (!usesNativeElement(content, "button")) {
        push(findings, {
            severity: "error",
            message: `Native button contract violated on ${slotId}`,
            file: rel,
            references: REFS,
            remediation: [
                `Component: ${componentId}`,
                `Slot: ${slotId}`,
                `Contract: accessibility.${slotId}.native = true`,
                `Expected: <button data-refineui="${slotId}"> — not <div role="button">`,
            ].join("\n"),
        });
    }
}

function validateRelationships(
    slotFiles: Map<string, { rel: string; content: string }>,
    componentId: string,
    slotId: string,
    relationships: Array<{
        attribute: string;
        target: string;
        targetAttribute?: string;
        required: boolean;
    }>,
    findings: DoctorFinding[],
): void {
    const source = slotFiles.get(slotId);
    if (!source) return;

    for (const relContract of relationships) {
        if (!relContract.required) continue;

        const sourceExpr = extractAttributeExpression(source.content, relContract.attribute);
        if (!sourceExpr) continue;

        const target = slotFiles.get(relContract.target);
        if (!target) {
            push(findings, {
                severity: "error",
                message: `Accessibility relationship target file missing for ${relContract.target}`,
                file: source.rel,
                references: REFS,
                remediation: [
                    `Component: ${componentId}`,
                    `${relContract.attribute} on ${slotId} requires target slot ${relContract.target}`,
                    `Expected: implementation file with data-refineui="${relContract.target}"`,
                ].join("\n"),
            });
            continue;
        }

        const targetAttr = relContract.targetAttribute ?? "id";
        const targetExpr = extractAttributeExpression(target.content, targetAttr);
        if (!targetExpr) {
            push(findings, {
                severity: "error",
                message: `Target ${targetAttr} missing on ${relContract.target}`,
                file: target.rel,
                references: REFS,
                remediation: [
                    `Component: ${componentId}`,
                    `Relationship: ${slotId}.${relContract.attribute} → ${relContract.target}.${targetAttr}`,
                    `Contract: accessibility.${slotId}.relationships`,
                ].join("\n"),
            });
            continue;
        }

        if (sourceExpr !== targetExpr) {
            push(findings, {
                severity: "error",
                message: `Accessibility relationship mismatch: ${relContract.attribute} ↔ ${targetAttr}`,
                file: source.rel,
                references: REFS,
                remediation: [
                    `Component: ${componentId}`,
                    `${slotId}.${relContract.attribute}={${sourceExpr}}`,
                    `${relContract.target}.${targetAttr}={${targetExpr}}`,
                    `Expected: both expressions must reference the same id token`,
                    `Contract: accessibility.${slotId}.relationships`,
                ].join("\n"),
            });
        }
    }
}

export const accessibilityContractRule: DoctorRule = {
    id: "accessibility-contract",
    category: "accessibility",
    run({ workspace }) {
        const slots = loadAccessibilitySlots();
        const findings: DoctorFinding[] = [];

        if (slots.length === 0) {
            return {
                check: {
                    rule: "accessibility-contract",
                    category: "accessibility",
                    status: "not-verified",
                    reason: "Component spec accessibility contracts not found",
                    references: REFS,
                },
                findings: [],
            };
        }

        const sourceFiles = workspace.sourceFiles.filter((f) => SOURCE_FILE.test(f));
        const slotIds = new Set(slots.map((s) => s.slotId));

        /** slotId → { rel, content } — first matching implementation file */
        const slotFiles = new Map<string, { rel: string; content: string }>();

        for (const file of sourceFiles) {
            const content = readFileLines(file).join("\n");
            const rel = relPath(workspace.root, file);
            for (const slotId of slotIds) {
                if (fileContainsSlot(content, slotId) && !slotFiles.has(slotId)) {
                    slotFiles.set(slotId, { rel, content });
                }
            }
        }

        const slotsByComponent = new Map<string, typeof slots>();
        for (const entry of slots) {
            const list = slotsByComponent.get(entry.componentId) ?? [];
            list.push(entry);
            slotsByComponent.set(entry.componentId, list);
        }

        let validatedSlots = 0;

        for (const entry of slots) {
            const file = slotFiles.get(entry.slotId);
            if (!file) continue;
            validatedSlots += 1;

            validateNativeElement(
                file.content,
                file.rel,
                entry.componentId,
                entry.slotId,
                entry.contract,
                findings,
            );

            if (entry.contract.requiredAttributes) {
                validateRequiredAttributes(
                    file.content,
                    file.rel,
                    entry.componentId,
                    entry.slotId,
                    entry.contract.requiredAttributes,
                    findings,
                );
            }
        }

        for (const [componentId, componentSlots] of slotsByComponent) {
            const relSlots = componentSlots.filter((s) => slotFiles.has(s.slotId));
            if (relSlots.length === 0) continue;

            for (const entry of relSlots) {
                if (!entry.contract.relationships?.length) continue;
                validateRelationships(
                    slotFiles,
                    componentId,
                    entry.slotId,
                    entry.contract.relationships,
                    findings,
                );
            }
        }

        const capped = findings.slice(0, 25);

        if (validatedSlots === 0) {
            return {
                check: {
                    rule: "accessibility-contract",
                    category: "accessibility",
                    status: "not-applicable",
                    evidence: "No component implementation files with declared accessibility slots in this workspace",
                    references: REFS,
                },
                findings: [],
            };
        }

        if (capped.length === 0) {
            return {
                check: {
                    rule: "accessibility-contract",
                    category: "accessibility",
                    status: "pass",
                    evidence: `Validated declared accessibility contracts on ${validatedSlots} slot(s)`,
                    references: REFS,
                },
                findings: [],
            };
        }

        return {
            check: {
                rule: "accessibility-contract",
                category: "accessibility",
                status: "fail",
                evidence: `${capped.length} accessibility contract violation(s)`,
                references: REFS,
            },
            findings: capped,
        };
    },
};

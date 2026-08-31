import type { DoctorRule, DoctorFinding } from "../types.js";
import { relPath } from "../discover.js";

const REFS = [
    "https://design.pelagornis.com/refineui/development/installation/",
    "https://design.pelagornis.com/refineui/llms.txt",
];

export const packageSetupRule: DoctorRule = {
    id: "package-setup",
    category: "setup",
    run({ workspace }) {
        const hasReact = Boolean(workspace.declared["@refineui/react"]);
        const hasTokens = Boolean(workspace.declared["@refineui/tokens"]);
        const isApp = workspace.projectKinds.includes("app");

        if (!isApp) {
            return {
                check: {
                    rule: "package-setup",
                    category: "setup",
                    status: "not-applicable",
                    reason: "Library package — app dependency check skipped",
                    references: REFS,
                },
                findings: [],
            };
        }

        const missing: string[] = [];
        if (!hasReact) missing.push("@refineui/react");
        if (!hasTokens) missing.push("@refineui/tokens");

        if (missing.length === 0) {
            return {
                check: {
                    rule: "package-setup",
                    category: "setup",
                    status: "pass",
                    evidence: `package.json declares ${Object.keys(workspace.declared).join(", ")}`,
                    references: REFS,
                },
                findings: [],
            };
        }

        const finding: DoctorFinding = {
            rule: "package-setup",
            severity: "error",
            message: `Missing required RefineUI packages: ${missing.join(", ")}`,
            file: relPath(workspace.root, workspace.packageJsonPath),
            references: REFS,
            remediation: [
                "Install required RefineUI packages for app projects:",
                "  bun add @refineui/react @refineui/tokens",
                "Optional but recommended:",
                "  bun add @refineui/web-icons @refineui/utilities",
            ].join("\n"),
        };

        return {
            check: {
                rule: "package-setup",
                category: "setup",
                status: "fail",
                evidence: `Missing: ${missing.join(", ")}`,
                references: REFS,
            },
            findings: [finding],
        };
    },
};

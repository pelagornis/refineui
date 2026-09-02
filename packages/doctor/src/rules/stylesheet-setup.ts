import fs from "node:fs";
import path from "node:path";
import type { DoctorRule, DoctorFinding } from "../types.js";
import { relPath } from "../discover.js";

const REFS = [
    "https://ui.pelagornis.com/development/theming/",
    "https://ui.pelagornis.com/llms.txt",
];

const REQUIRED_IMPORTS = [
    "@refineui/tokens/tailwind.css",
    "@refineui/react/refineui.css",
];

const RECOMMENDED_IMPORTS = ["@refineui/web-icons/dist/fonts/refineui-system-icons.css"];

function scanStylesheets(workspace: { root: string; sourceFiles: string[] }): string[] {
    const cssFiles = workspace.sourceFiles.filter((f) => f.endsWith(".css"));
    const entryCandidates = [
        path.join(workspace.root, "src", "index.css"),
        path.join(workspace.root, "src", "styles", "global.css"),
        path.join(workspace.root, "src", "app.css"),
        path.join(workspace.root, "src", "main.css"),
    ];
    return [...new Set([...cssFiles, ...entryCandidates.filter((f) => fs.existsSync(f))])];
}

function fileContainsImport(content: string, imp: string): boolean {
    return content.includes(imp);
}

export const stylesheetSetupRule: DoctorRule = {
    id: "stylesheet-setup",
    category: "setup",
    run({ workspace }) {
        const isApp = workspace.projectKinds.includes("app");
        if (!isApp) {
            return {
                check: {
                    rule: "stylesheet-setup",
                    category: "setup",
                    status: "not-applicable",
                    reason: "Library package — global stylesheet import check skipped",
                    references: REFS,
                },
                findings: [],
            };
        }

        const stylesheets = scanStylesheets(workspace);
        const allContent = stylesheets
            .map((f) => {
                try {
                    return fs.readFileSync(f, "utf8");
                } catch {
                    return "";
                }
            })
            .join("\n");

        const missingRequired = REQUIRED_IMPORTS.filter((imp) => !fileContainsImport(allContent, imp));
        const missingRecommended = RECOMMENDED_IMPORTS.filter((imp) => !fileContainsImport(allContent, imp));

        if (missingRequired.length === 0) {
            const evidence =
                missingRecommended.length > 0
                    ? `Required imports present; optional missing: ${missingRecommended.join(", ")}`
                    : "All required stylesheet imports found";
            return {
                check: {
                    rule: "stylesheet-setup",
                    category: "setup",
                    status: "pass",
                    evidence,
                    references: REFS,
                },
                findings: [],
            };
        }

        const finding: DoctorFinding = {
            rule: "stylesheet-setup",
            severity: "error",
            message: `Missing RefineUI stylesheet imports: ${missingRequired.join(", ")}`,
            file: stylesheets[0] ? relPath(workspace.root, stylesheets[0]) : "src/index.css",
            references: REFS,
            remediation: [
                "Add the following imports to your global CSS entry (e.g. src/index.css):",
                "",
                '@import "@refineui/tokens/tailwind.css";',
                '@import "@refineui/web-icons/dist/fonts/refineui-system-icons.css";',
                '@import "@refineui/react/refineui.css";',
            ].join("\n"),
        };

        return {
            check: {
                rule: "stylesheet-setup",
                category: "setup",
                status: "fail",
                evidence: `Missing: ${missingRequired.join(", ")}`,
                references: REFS,
            },
            findings: [finding],
        };
    },
};

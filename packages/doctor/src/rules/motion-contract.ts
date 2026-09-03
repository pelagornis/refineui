import type { DoctorRule, DoctorFinding } from "../types.js";
import { readFileLines, relPath } from "../discover.js";

const REFS = [
    "https://ui.pelagornis.com/foundations/motion/",
    "https://ui.pelagornis.com/development/motion/",
];

const STYLE_FILE = /\.(tsx?|jsx?|css)$/;

export const motionContractRule: DoctorRule = {
    id: "motion-contract",
    category: "accessibility",
    run({ workspace }) {
        const findings: DoctorFinding[] = [];
        const codeFiles = workspace.sourceFiles.filter((f) => STYLE_FILE.test(f));

        for (const file of codeFiles) {
            const lines = readFileLines(file);
            const rel = relPath(workspace.root, file);
            lines.forEach((line, index) => {
                if (line.includes("prefers-reduced-motion")) return;
                if (!/\btransition\b|\banimation\b|\btransform\b/.test(line)) return;
                if (line.includes("var(--refineui-motion") || line.includes("refineui.css")) return;
                if (line.trim().startsWith("//") || line.trim().startsWith("*")) return;

                const hasDurationMs = /\b\d+m?s\b/.test(line) && !line.includes("var(");
                if (!hasDurationMs) return;

                findings.push({
                    rule: "motion-contract",
                    severity: "info",
                    message: "Hardcoded motion duration — prefer semantic motion CSS vars",
                    file: rel,
                    line: index + 1,
                    references: REFS,
                    remediation:
                        "Use var(--refineui-motion-duration-*) roles and honor prefers-reduced-motion. Import @refineui/react/refineui.css.",
                });
            });
        }

        const stylesheets = workspace.sourceFiles.filter(
            (f) => f.endsWith(".css") && !f.includes("node_modules"),
        );
        const hasReducedMotionCss = stylesheets.some((file) =>
            readFileLines(file).some((l) => l.includes("prefers-reduced-motion")),
        );
        const importsRefineCss = codeFiles.some((file) =>
            readFileLines(file).some(
                (l) => l.includes("@refineui/react/refineui.css") || l.includes('refineui.css"'),
            ),
        );

        if (workspace.projectKinds.includes("app") && !hasReducedMotionCss && !importsRefineCss) {
            findings.push({
                rule: "motion-contract",
                severity: "warn",
                message: "No reduced-motion contract detected — import @refineui/react/refineui.css",
                file: workspace.relativePath,
                references: REFS,
                remediation:
                    "Import @refineui/react/refineui.css once at the app root. Token CSS collapses motion roles under prefers-reduced-motion.",
            });
        }

        const capped = findings.slice(0, 15);
        const significant = capped.filter((f) => f.severity !== "info");

        if (significant.length === 0) {
            return {
                check: {
                    rule: "motion-contract",
                    category: "accessibility",
                    status: "pass",
                    evidence: "Motion contract satisfied or informational hints only",
                    references: REFS,
                },
                findings: [],
            };
        }

        return {
            check: {
                rule: "motion-contract",
                category: "accessibility",
                status: "fail",
                evidence: `${significant.length} motion contract issue(s)`,
                references: REFS,
            },
            findings: capped.filter((f) => f.severity !== "info"),
        };
    },
};

import fs from "node:fs";
import path from "node:path";
import type { ProjectKind, WorkspaceTarget } from "./types.js";

const REFINEUI_DEPS = ["@refineui/react", "@refineui/tokens", "@refineui/utilities", "@refineui/web-icons"];
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "lib", "build", ".astro", "coverage", ".next", ".turbo"]);

type PackageJson = {
    name?: string;
    private?: boolean;
    main?: string;
    module?: string;
    exports?: unknown;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
};

function readJson<T>(filePath: string): T | null {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
    } catch {
        return null;
    }
}

function collectSourceFiles(dir: string, acc: string[] = []): string[] {
    if (!fs.existsSync(dir)) return acc;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP_DIRS.has(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collectSourceFiles(full, acc);
            continue;
        }
        if (/\.(tsx?|jsx?|css|astro)$/.test(entry.name)) {
            acc.push(full);
        }
    }
    return acc;
}

function inferProjectKinds(pkg: PackageJson, root: string): ProjectKind[] {
    const kinds: ProjectKind[] = [];
    const scripts = pkg.scripts ?? {};
    const hasAppScript = Object.keys(scripts).some((key) => /^(dev|start|preview)$/.test(key));
    const hasExports = Boolean(pkg.exports ?? pkg.main ?? pkg.module);
    const srcDirs = ["src", "app", "pages"].map((d) => path.join(root, d));
    const hasAppEntry = srcDirs.some((d) => fs.existsSync(path.join(d, "main.tsx")) || fs.existsSync(path.join(d, "App.tsx")) || fs.existsSync(path.join(d, "index.tsx")));

    if (hasAppScript || hasAppEntry) kinds.push("app");
    if (hasExports && !pkg.private) kinds.push("library");
    if (kinds.length === 0 && fs.existsSync(path.join(root, "src"))) kinds.push("app");

    return kinds;
}

function extractRefineuiDeps(pkg: PackageJson): Record<string, string> {
    const merged = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.peerDependencies,
    };
    const declared: Record<string, string> = {};
    for (const name of REFINEUI_DEPS) {
        if (merged[name]) declared[name] = merged[name];
    }
    return declared;
}

function hasRefineuiUsage(root: string): boolean {
    const pkgPath = path.join(root, "package.json");
    const pkg = readJson<PackageJson>(pkgPath);
    if (!pkg) return false;
    return Object.keys(extractRefineuiDeps(pkg)).length > 0;
}

export function discoverWorkspaces(targetRoot: string): WorkspaceTarget[] {
    const absRoot = path.resolve(targetRoot);
    const workspaces: WorkspaceTarget[] = [];

    function considerPackage(dir: string) {
        const pkgPath = path.join(dir, "package.json");
        if (!fs.existsSync(pkgPath)) return;
        const pkg = readJson<PackageJson>(pkgPath);
        if (!pkg) return;
        const declared = extractRefineuiDeps(pkg);
        if (Object.keys(declared).length === 0) return;

        const srcRoot = fs.existsSync(path.join(dir, "src")) ? path.join(dir, "src") : dir;
        workspaces.push({
            root: dir,
            packageJsonPath: pkgPath,
            relativePath: path.relative(absRoot, dir) || ".",
            name: pkg.name,
            projectKinds: inferProjectKinds(pkg, dir),
            declared,
            sourceFiles: collectSourceFiles(srcRoot),
        });
    }

    considerPackage(absRoot);

    const queue = [absRoot];
    while (queue.length > 0) {
        const dir = queue.pop();
        if (!dir) break;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue;
            const full = path.join(dir, entry.name);
            if (entry.name === "packages" || entry.name === "apps" || entry.name === "examples") {
                for (const child of fs.readdirSync(full, { withFileTypes: true })) {
                    if (!child.isDirectory() || SKIP_DIRS.has(child.name)) continue;
                    considerPackage(path.join(full, child.name));
                }
            }
            if (fs.existsSync(path.join(full, "package.json")) && hasRefineuiUsage(full) && full !== absRoot) {
                considerPackage(full);
            }
            queue.push(full);
        }
    }

    const seen = new Set<string>();
    return workspaces.filter((ws) => {
        if (seen.has(ws.root)) return false;
        seen.add(ws.root);
        return true;
    });
}

export function readFileLines(filePath: string): string[] {
    try {
        return fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    } catch {
        return [];
    }
}

export function relPath(root: string, filePath: string): string {
    return path.relative(root, filePath) || path.basename(filePath);
}

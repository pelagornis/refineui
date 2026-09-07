import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, "../../../docs/src/content/docs");
const llmPath = path.resolve(__dirname, "../../../docs/public/llm.txt");
const designMdPath = path.resolve(__dirname, "../../../docs/public/DESIGN.md");
const outPath = path.resolve(__dirname, "../src/generated/docs-index.json");

/** @param {string} content */
function parseFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) {
        return { meta: {}, body: content };
    }

    /** @type {Record<string, string>} */
    const meta = {};
    for (const line of match[1].split("\n")) {
        const parsed = line.match(/^([\w-]+):\s*(.+)$/);
        if (!parsed) continue;
        meta[parsed[1]] = parsed[2].replace(/^["']|["']$/g, "");
    }

    return { meta, body: match[2] };
}

/** @param {string} rel */
function slugFromPath(rel) {
    return rel.replace(/\.mdx$/, "").replace(/\\/g, "/");
}

/** @param {string} slug */
function categoryFromSlug(slug) {
    if (slug === "ai-tools" || slug.startsWith("ai-tools/")) return "ai-tools";
    if (slug === "components" || slug.startsWith("components/")) return "components";
    if (slug === "foundations" || slug.startsWith("foundations/")) return "foundations";
    if (slug === "development" || slug.startsWith("development/")) return "development";
    return "guides";
}

/** @param {string} dir @param {string} [base] */
function walk(dir, base = "") {
    /** @type {string[]} */
    const entries = [];
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const rel = base ? `${base}/${name}` : name;
        if (fs.statSync(full).isDirectory()) {
            entries.push(...walk(full, rel));
            continue;
        }
        if (name.endsWith(".mdx")) {
            entries.push(rel);
        }
    }
    return entries;
}

/** @param {string} body */
function stripMdxImports(body) {
    return body.replace(/^import[\s\S]*?;\s*\n/gm, "");
}

const pages = walk(docsRoot).map((rel) => {
    const full = path.join(docsRoot, rel);
    const raw = fs.readFileSync(full, "utf8");
    const { meta, body } = parseFrontmatter(raw);
    const slug = slugFromPath(rel);
    const plain = stripMdxImports(body);
    const searchText = `${meta.title ?? ""} ${meta.description ?? ""} ${plain}`.toLowerCase();

    return {
        slug,
        href: `/${slug}/`,
        title: meta.title ?? slug,
        description: meta.description ?? "",
        category: categoryFromSlug(slug),
        content: plain.trim(),
        searchText,
    };
});

const llmIndex = fs.existsSync(llmPath) ? fs.readFileSync(llmPath, "utf8") : "";
const designMd = fs.existsSync(designMdPath) ? fs.readFileSync(designMdPath, "utf8") : "";

const index = {
    generatedAt: new Date().toISOString(),
    llmIndex,
    designMd,
    pages,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(index, null, 2)}\n`);
console.log(`@refineui/mcp: indexed ${pages.length} docs pages → ${outPath}`);

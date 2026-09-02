/** Astro `base` prefix when docs are not served from domain root (`import.meta.env.BASE_URL`). */
const DOCS_BASE = import.meta.env.BASE_URL;

function docsBasePath(): string {
    if (!DOCS_BASE || DOCS_BASE === "/") return "";
    return DOCS_BASE.endsWith("/") ? DOCS_BASE.slice(0, -1) : DOCS_BASE;
}

/** Prefix internal paths with the docs base. Idempotent for already-prefixed paths. */
export function withBase(path: string): string {
    if (/^https?:\/\//i.test(path) || path.startsWith("#")) return path;

    const base = docsBasePath();
    const normalized = path.startsWith("/") ? path : `/${path}`;

    if (!base) return normalized;
    if (normalized === base || normalized.startsWith(`${base}/`)) return normalized;

    return `${base}${normalized}`;
}

/** Strip docs base from pathname for active-link comparisons. */
export function stripBase(path: string): string {
    const base = docsBasePath();
    if (!base) return path;
    if (path === base) return "/";
    if (path.startsWith(`${base}/`)) return path.slice(base.length) || "/";
    return path;
}

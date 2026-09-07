import { stripBase, withBase } from "./docs-path";

/** Starlight locale codes used by this docs site (`undefined` = root / English). */
export type DocsLocaleCode = "ko" | undefined;

const LOCALE_PREFIXES = ["ko"] as const;

/**
 * Explicit allowlist for root `docs/public/` assets.
 * Prefer this over heuristics so `/components/button/` never matches.
 */
const LOCALE_AGNOSTIC_PATHS = new Set([
    "/DESIGN.md",
    "/llms.txt",
    "/llm.txt",
    "/mcp.example.json",
    "/robots.txt",
    "/favicon.svg",
]);

export function isDocsLocaleCode(value: string | undefined | null): value is "ko" {
    return value === "ko";
}

/** Normalize Starlight `locale` (`undefined` for root English). */
export function toDocsLocale(locale: string | undefined | null): DocsLocaleCode {
    return isDocsLocaleCode(locale) ? locale : undefined;
}

/** Pathname without query/hash, always leading `/`. */
function normalizePathname(path: string): string {
    const bare = path.split(/[?#]/, 1)[0] ?? path;
    return bare.startsWith("/") ? bare : `/${bare}`;
}

/**
 * Root public file (single path segment + extension), e.g. `/llm.txt`, `/ko/DESIGN.md`.
 * Doc routes like `/components/button/` never match.
 */
function isRootPublicFilePath(path: string): boolean {
    return /^\/[^/]+\.[A-Za-z0-9]+$/.test(path);
}

/** True for root public assets (DESIGN.md, llm.txt, …), with or without a locale prefix. */
export function isLocaleAgnosticPath(path: string): boolean {
    const normalized = normalizePathname(path);
    if (LOCALE_AGNOSTIC_PATHS.has(normalized) || isRootPublicFilePath(normalized)) {
        return true;
    }
    const { path: stripped } = splitLocalePath(normalized);
    return LOCALE_AGNOSTIC_PATHS.has(stripped) || isRootPublicFilePath(stripped);
}

/** Strip a locale prefix from a public-asset path; leave other paths unchanged. */
export function toLocaleAgnosticPath(path: string): string {
    const normalized = normalizePathname(path);
    if (!isLocaleAgnosticPath(normalized)) return normalized;
    const { path: stripped } = splitLocalePath(normalized);
    return withBase(stripped);
}

/**
 * Prefix an internal docs path with the active locale.
 * Root English stays unprefixed (`/components/` → `/components/`).
 * Korean gets `/ko/…`. External URLs, hashes, and locale-agnostic public files are unchanged.
 */
export function withLocalePath(path: string, locale: DocsLocaleCode): string {
    if (/^https?:\/\//i.test(path) || path.startsWith("#")) return path;

    const normalized = normalizePathname(path);
    if (isLocaleAgnosticPath(normalized)) {
        return toLocaleAgnosticPath(normalized);
    }
    if (!locale) return withBase(normalized);

    if (normalized === `/${locale}` || normalized.startsWith(`/${locale}/`)) {
        return withBase(normalized);
    }
    if (normalized === "/") return withBase(`/${locale}/`);
    return withBase(`/${locale}${normalized}`);
}

/** Detect locale + strip it from a pathname (after docs base). */
export function splitLocalePath(pathname: string): {
    locale: DocsLocaleCode;
    path: string;
} {
    const stripped = stripBase(pathname);
    for (const code of LOCALE_PREFIXES) {
        if (stripped === `/${code}`) return { locale: code, path: "/" };
        if (stripped.startsWith(`/${code}/`)) {
            return { locale: code, path: stripped.slice(code.length + 1) || "/" };
        }
    }
    return { locale: undefined, path: stripped };
}

/** Strip a leading locale segment from a Starlight page id (`ko/…` → `…`). */
export function stripLocaleFromPageId(pageId: string): string {
    for (const code of LOCALE_PREFIXES) {
        if (pageId === code) return "index";
        if (pageId.startsWith(`${code}/`)) return pageId.slice(code.length + 1);
    }
    return pageId;
}

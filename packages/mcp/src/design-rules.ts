import { getDesignMd } from "./docs-store.js";

/**
 * Embedded from `docs/public/DESIGN.md` at MCP build time (Stitch DESIGN.md alpha).
 * Prefer `getDesignMd()` for new call sites.
 */
export const DESIGN_RULES = getDesignMd();

/**
 * Component sizes now emit from `@refineui/tokens` `generate-css.mjs`
 * (Foundation-linked). This script is kept as a no-op sync guard for older CI
 * paths that still invoke it after `tsup`.
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cssPath = join(__dirname, "../../tokens/dist/css-variables.css");

if (!existsSync(cssPath)) {
    console.warn(
        "[generate-refineui-css] tokens CSS missing — run `@refineui/tokens` build first.",
    );
    process.exit(0);
}

console.log(
    "Component sizes are Foundation-linked via @refineui/tokens; skip react size append.",
);

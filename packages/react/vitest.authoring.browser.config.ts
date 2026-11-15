import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["test/authoring-manifest.browser.test.ts", "test/code-block.browser.test.tsx", "test/date-input.browser.test.tsx", "test/time-input.browser.test.tsx"],
        environment: "jsdom",
    },
});

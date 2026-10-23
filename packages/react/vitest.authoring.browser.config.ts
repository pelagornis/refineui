import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["test/authoring-manifest.browser.test.ts"],
        environment: "jsdom",
    },
});

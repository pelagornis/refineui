import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["test/authoring-manifest.test.ts"],
        environment: "node",
    },
});

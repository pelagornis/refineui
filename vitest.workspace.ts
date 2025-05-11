import { defineWorkspace } from "vitest/config";

/**
 * @see https://vitest.dev/guide/workspace.html
 */
export default defineWorkspace([
  {
    test: {
        name: "version",
        include: ["./packages/version/**/*.test.(tsx|ts)"],
        environment: "node"
    },
  },
  {
    test: {
      name: "react",
      include: ["./packages/react/test/**/*.test.(tsx|ts)"],
      environment: "jsdom",
    },
  },
  {
    test: {
      name: "tokens",
      include: ["./packages/tokens/test/**/*.test.(tsx|ts)"],
    },
  },
  {
    test: {
      name: "utilities",
      include: ["./packages/utilities/test/**/*.test.(tsx|ts)"],
    },
  }
]);
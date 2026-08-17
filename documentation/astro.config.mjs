import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      /** Avoid resolving CJS-only entries — keep ESM in the bundle */
      noExternal: ["@refineui/react", "@refineui/tokens"],
    },
    optimizeDeps: {
      /**
       * Do not prebundle workspace packages — Vite's dep cache was serving a stale Menu
       * (`absolute top-full` / `rounded-xlarge` / no portal) after source rebuilds.
       */
      exclude: ["@refineui/react", "@refineui/tokens", "@refineui/utilities"],
    },
  },
  integrations: [
    react(),
    starlight({
      head: [
        {
          tag: "meta",
          attrs: {
            name: "viewport",
            content: "width=device-width, initial-scale=1, viewport-fit=cover",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.googleapis.com",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: "anonymous",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
          },
        },
      ],
      title: "RefineUI",
      description: "Design system for Pelagornis products — components, interaction, and style as one language.",
      customCss: ["./src/styles/global.css"],
      sidebar: [
        { label: "Introduction", slug: "intro" },
        {
          label: "Foundations",
          autogenerate: { directory: "foundations" },
        },
        {
          label: "Layout",
          autogenerate: { directory: "layout" },
        },
        {
          label: "Components",
          autogenerate: { directory: "components" },
        },
      ],
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/pelagornis/refineui" }],
    }),
  ],
});

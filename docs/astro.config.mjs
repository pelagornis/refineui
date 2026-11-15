import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { remarkDocsCode } from './src/remark/remarkDocsCode.mjs';

const monorepoRoot = fileURLToPath(new URL('..', import.meta.url));
const reactNodeEnvironment = process.argv.includes('build') ? 'production' : 'development';

/** Iconography lives in refineui-system-icons — swap when the icons site ships. */
const ICONOGRAPHY_SITE = 'https://icons.pelagornis.com';

export default defineConfig({
  site: 'https://ui.pelagornis.com',
  redirects: {
    // No trailing-slash twins: `trailingSlash: 'ignore'` maps both forms to one
    // route, and declaring both is a static route collision (hard error in
    // upcoming Astro versions).
    '/ai-integration': '/ai-tools',
    '/ai-tools/llms-txt': '/llms.txt',
    '/ko/ai-integration': '/ko/ai-tools',
    // Locale-agnostic public files (docs/public) — Starlight may prefix /ko/
    '/ko/DESIGN.md': '/DESIGN.md',
    '/ko/llms.txt': '/llms.txt',
    '/ko/llm.txt': '/llm.txt',
    '/ko/mcp.example.json': '/mcp.example.json',
    '/ko/robots.txt': '/robots.txt',
    '/ko/favicon.svg': '/favicon.svg',
  },
  vite: {
    /**
     * React selects its CJS entry at dependency-optimization time. Bun can
     * otherwise retain NODE_ENV=production while serving `astro dev`, which
     * pairs a production renderer with development island modules.
     */
    define: {
      'process.env.NODE_ENV': JSON.stringify(reactNodeEnvironment),
    },
    plugins: [tailwindcss()],
    resolve: {
      /** Source aliases — tree-shake and avoid Babel deopt on the 500KB dist bundle. */
      alias: [
        { find: /^@refineui\/react$/, replacement: path.resolve(monorepoRoot, 'packages/react/src/index.ts') },
        { find: /^@refineui\/tokens$/, replacement: path.resolve(monorepoRoot, 'packages/tokens/src/index.ts') },
      ],
      /** All islands and aliased workspace source must share this renderer's React instance. */
      dedupe: ['react', 'react-dom'],
    },
    ssr: {
      noExternal: ['@refineui/react', '@refineui/tokens', '@refineui/web-icons'],
    },
    optimizeDeps: {
      exclude: ['@refineui/react', '@refineui/tokens', '@refineui/utilities', '@refineui/web-icons'],
    },
  },
  markdown: {
    remarkPlugins: [remarkDocsCode],
  },
  integrations: [
    react(),
    starlight({
      head: [
        {
          tag: 'meta',
          attrs: {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1, viewport-fit=cover',
          },
        },
      ],
      title: 'RefineUI',
      description:
        'Enterprise design system architecture — visual foundations, components, development, and AI experience.',
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        ko: { label: '한국어', lang: 'ko' },
      },
      pagefind: true,
      customCss: ['./src/styles/global.css'],
      /** Fences render through RefineUI CodeBlock (src/remark/remarkDocsCode.mjs). */
      expressiveCode: false,
      components: {
        Header: './src/overrides/Header.astro',
        Footer: './src/overrides/Footer.astro',
        PageFrame: './src/overrides/PageFrame.astro',
        Sidebar: './src/overrides/Sidebar.astro',
        Pagination: './src/overrides/Pagination.astro',
        ThemeSelect: './src/overrides/ThemeSelect.astro',
        PageTitle: './src/overrides/PageTitle.astro',
        MobileMenuFooter: './src/overrides/MobileMenuFooter.astro',
        PageSidebar: './src/overrides/PageSidebar.astro',
        TableOfContents: './src/overrides/TableOfContents.astro',
        MobileTableOfContents: './src/overrides/MobileTableOfContents.astro',
      },
      sidebar: [
        {
          label: 'Guides',
          items: [{ label: 'Getting started', slug: 'getting-started' }],
        },
        {
          label: 'Foundations',
          items: [
            { label: 'Overview', slug: 'foundations' },
            {
              label: 'Design Tokens',
              items: [
                { label: 'Introduction', slug: 'foundations/design-tokens' },
                { label: 'Color', slug: 'foundations/color' },
                { label: 'Typography', slug: 'foundations/typography' },
                { label: 'Spacing', slug: 'foundations/spacing' },
                { label: 'Sizing', slug: 'foundations/sizing' },
                { label: 'Radius', slug: 'foundations/radius' },
                { label: 'Border', slug: 'foundations/border' },
                { label: 'Elevation', slug: 'foundations/elevation' },
                { label: 'Opacity', slug: 'foundations/opacity' },
                { label: 'Motion', slug: 'foundations/motion' },
                { label: 'Z-index', slug: 'foundations/z-index' },
              ],
            },
            {
              label: 'Layout',
              slug: 'foundations/layout',
            },
            {
              label: 'Iconography',
              link: ICONOGRAPHY_SITE,
              attrs: { target: '_blank', rel: 'noreferrer' },
            },
          ],
        },
        {
          label: 'Components',
          items: [
            { label: 'Overview', slug: 'components' },
            { label: 'Accordion', slug: 'components/accordion' },
            { label: 'Alert', slug: 'components/alert' },
            { label: 'Avatar', slug: 'components/avatar' },
            { label: 'Avatars', slug: 'components/avatars' },
            { label: 'Badge', slug: 'components/badge' },
            { label: 'Box', slug: 'components/box' },
            { label: 'Breadcrumb', slug: 'components/breadcrumb' },
            { label: 'Bubble', slug: 'components/bubble' },
            { label: 'Button', slug: 'components/button' },
            { label: 'Button Group', slug: 'components/button-group' },
            { label: 'Calendar', slug: 'components/calendar' },
            { label: 'Card', slug: 'components/card' },
            { label: 'Carousel', slug: 'components/carousel' },
            { label: 'Chart', slug: 'components/chart' },
            { label: 'Code Block', slug: 'components/code-block' },
            { label: 'Checkbox', slug: 'components/checkbox' },
            { label: 'Collapsible', slug: 'components/collapsible' },
            { label: 'Command', slug: 'components/command' },
            { label: 'Container', slug: 'components/container' },
            { label: 'Context Menu', slug: 'components/context-menu' },
            { label: 'Date Input', slug: 'components/date-input' },
            { label: 'Dialog', slug: 'components/dialog' },
            { label: 'Divider', slug: 'components/divider' },
            { label: 'Drawer', slug: 'components/drawer' },
            { label: 'Dropdown', slug: 'components/dropdown' },
            { label: 'Field', slug: 'components/field' },
            { label: 'Footer', slug: 'components/footer' },
            { label: 'Grid', slug: 'components/grid' },
            { label: 'Input', slug: 'components/input' },
            { label: 'Input OTP', slug: 'components/input-otp' },
            { label: 'Kbd', slug: 'components/kbd' },
            { label: 'Label', slug: 'components/label' },
            { label: 'Link', slug: 'components/link' },
            { label: 'Marker', slug: 'components/marker' },
            { label: 'Menu', slug: 'components/menu' },
            { label: 'Message', slug: 'components/message' },
            { label: 'Navigation Menu', slug: 'components/navigation-menu' },
            { label: 'Pagination', slug: 'components/pagination' },
            { label: 'Popover', slug: 'components/popover' },
            { label: 'Progress', slug: 'components/progress' },
            { label: 'Progress Stepper', slug: 'components/progress-stepper' },
            { label: 'Radio', slug: 'components/radio' },
            { label: 'Resizable', slug: 'components/resizable' },
            { label: 'Result', slug: 'components/result' },
            { label: 'Scroll Area', slug: 'components/scroll-area' },
            { label: 'Search Field', slug: 'components/search-field' },
            { label: 'Segmented Control', slug: 'components/segmented-control' },
            { label: 'Select', slug: 'components/select' },
            { label: 'Sidebar', slug: 'components/sidebar' },
            { label: 'Skeleton', slug: 'components/skeleton' },
            { label: 'Slider', slug: 'components/slider' },
            { label: 'Spin Button', slug: 'components/spin-button' },
            { label: 'Spinner', slug: 'components/spinner' },
            { label: 'Stack', slug: 'components/stack' },
            { label: 'Stepper', slug: 'components/stepper' },
            { label: 'Switch', slug: 'components/switch' },
            { label: 'Table', slug: 'components/table' },
            { label: 'Tabs', slug: 'components/tabs' },
            { label: 'Tag', slug: 'components/tag' },
            { label: 'Textarea', slug: 'components/textarea' },
            { label: 'Time Input', slug: 'components/time-input' },
            { label: 'Toast', slug: 'components/toast' },
            { label: 'Toolbar', slug: 'components/toolbar' },
            { label: 'Tooltip', slug: 'components/tooltip' },
            { label: 'Tree', slug: 'components/tree' },
          ],
        },
        {
          label: 'Development',
          items: [
            { label: 'Overview', slug: 'development' },
            { label: 'Installation', slug: 'development/installation' },
            { label: 'Theming', slug: 'development/theming' },
            { label: 'Motion', slug: 'development/motion' },
          ],
        },
        {
          label: 'AI & Tools',
          items: [
            { label: 'Overview', slug: 'ai-tools' },
            { label: 'DESIGN.md', link: '/DESIGN.md' },
            { label: 'llms.txt', link: '/llms.txt' },
            { label: 'Skill', slug: 'ai-tools/skill' },
            { label: 'Doctor', slug: 'ai-tools/doctor' },
            { label: 'MCP', slug: 'ai-tools/mcp' },
          ],
        },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/pelagornis/refineui' }],
    }),
  ],
});

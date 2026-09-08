import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { removeEmptyFrameHeaders } from './src/expressive-code/removeEmptyFrameHeaders.mjs';

const monorepoRoot = fileURLToPath(new URL('..', import.meta.url));

/** Iconography lives in refineui-system-icons — swap when the icons site ships. */
const ICONOGRAPHY_SITE = 'https://github.com/pelagornis/refineui-system-icons';

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
    plugins: [tailwindcss()],
    resolve: {
      /** Source aliases — tree-shake and avoid Babel deopt on the 500KB dist bundle. */
      alias: {
        '@refineui/react$': path.resolve(monorepoRoot, 'packages/react/src/index.ts'),
        '@refineui/tokens$': path.resolve(monorepoRoot, 'packages/tokens/src/index.ts'),
      },
    },
    ssr: {
      noExternal: ['@refineui/react', '@refineui/tokens'],
    },
    optimizeDeps: {
      exclude: ['@refineui/utilities'],
    },
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
      expressiveCode: {
        /**
         * Syntax colors from Night Owl; block chrome from RefineUI tokens.
         * Prefer mono + body size + primary fg so code scans as a distinct surface.
         * No editor/terminal chrome by default — opt in with `title="…"` / `frame="…"`.
         */
        useStarlightDarkModeSwitch: true,
        useStarlightUiThemeColors: true,
        defaultProps: {
          frame: 'none',
        },
        frames: {
          showCopyToClipboardButton: true,
          extractFileNameFromCode: false,
        },
        plugins: [removeEmptyFrameHeaders()],
        styleOverrides: {
          borderRadius: 'var(--refineui-radius-rounded-large)',
          borderWidth: 'var(--refineui-stroke-width-thin)',
          borderColor: 'var(--refineui-color-alias-border-default)',
          codeBackground: 'var(--refineui-color-alias-surface-sunken)',
          codeForeground: 'var(--refineui-color-alias-foreground-primary)',
          codeFontFamily: 'var(--refineui-docs-font-mono)',
          codeFontSize: 'var(--refineui-typography-body-2-font-size)',
          codeFontWeight: 'var(--refineui-typography-caption-2-font-weight)',
          codeLineHeight: 'var(--refineui-typography-body-1-line-height)',
          codePaddingBlock: 'var(--refineui-spacing-size-x-large)',
          codePaddingInline: 'var(--refineui-spacing-size-x-large)',
          codeSelectionBackground: 'var(--refineui-color-alias-background-surface-selected)',
          focusBorder: 'var(--refineui-color-alias-border-focus)',
          uiFontFamily: 'var(--refineui-typography-body-2-font-family)',
          uiFontSize: 'var(--refineui-typography-caption-2-font-size)',
          uiFontWeight: 'var(--refineui-typography-caption-2-font-weight)',
          uiLineHeight: 'var(--refineui-typography-caption-2-line-height)',
          uiPaddingBlock: 'var(--refineui-spacing-size-xx-small)',
          uiPaddingInline: 'var(--refineui-spacing-size-large)',
          frames: {
            shadowColor: 'transparent',
            frameBoxShadowCssValue: 'var(--refineui-elevation-2)',
            editorBackground: 'var(--refineui-color-alias-surface-sunken)',
            terminalBackground: 'var(--refineui-color-alias-surface-sunken)',
            editorTabBarBackground: 'var(--refineui-color-alias-background-primary)',
            editorTabBarBorderColor: 'var(--refineui-color-alias-border-default)',
            editorTabBarBorderBottomColor: 'var(--refineui-color-alias-border-default)',
            editorActiveTabBackground: 'var(--refineui-color-alias-surface-sunken)',
            editorActiveTabForeground: 'var(--refineui-color-alias-foreground-primary)',
            editorActiveTabIndicatorTopColor: 'var(--refineui-color-alias-foreground-link)',
            editorActiveTabIndicatorBottomColor: 'transparent',
            editorTabBorderRadius: 'var(--refineui-radius-rounded-medium)',
            terminalTitlebarBackground: 'var(--refineui-color-alias-background-primary)',
            terminalTitlebarForeground: 'var(--refineui-color-alias-foreground-secondary)',
            terminalTitlebarBorderBottomColor: 'var(--refineui-color-alias-border-default)',
            terminalTitlebarDotsForeground: 'var(--refineui-color-alias-foreground-tertiary)',
            inlineButtonForeground: 'var(--refineui-color-alias-foreground-secondary)',
            inlineButtonBorder: 'var(--refineui-color-alias-border-default)',
            tooltipSuccessBackground: 'var(--refineui-color-alias-surface-inverse)',
            tooltipSuccessForeground: 'var(--refineui-color-alias-foreground-inversed)',
          },
          textMarkers: {
            markBackground: 'var(--refineui-color-alias-background-surface-selected)',
            markBorderColor: 'var(--refineui-color-alias-border-default)',
            inlineMarkerBorderRadius: 'var(--refineui-radius-rounded-small)',
            insBackground: 'var(--refineui-color-alias-background-success-subtle)',
            delBackground: 'var(--refineui-color-alias-background-error-subtle)',
          },
        },
      },
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
          translations: { ko: '가이드' },
          items: [{ label: 'Getting started', translations: { ko: '시작하기' }, slug: 'getting-started' }],
        },
        {
          label: 'Foundations',
          translations: { ko: '파운데이션' },
          items: [
            { label: 'Overview', translations: { ko: '개요' }, slug: 'foundations' },
            {
              label: 'Design Tokens',
              translations: { ko: '디자인 토큰' },
              items: [
                { label: 'Introduction', translations: { ko: '소개' }, slug: 'foundations/design-tokens' },
                { label: 'Color', translations: { ko: '컬러' }, slug: 'foundations/color' },
                { label: 'Typography', translations: { ko: '타이포그래피' }, slug: 'foundations/typography' },
                { label: 'Spacing', translations: { ko: 'Spacing' }, slug: 'foundations/spacing' },
                { label: 'Sizing', translations: { ko: 'Sizing' }, slug: 'foundations/sizing' },
                { label: 'Radius', translations: { ko: 'Radius' }, slug: 'foundations/radius' },
                { label: 'Border', translations: { ko: 'Border' }, slug: 'foundations/border' },
                { label: 'Elevation', translations: { ko: 'Elevation' }, slug: 'foundations/elevation' },
                { label: 'Opacity', translations: { ko: '투명도' }, slug: 'foundations/opacity' },
                { label: 'Motion', translations: { ko: '모션' }, slug: 'foundations/motion' },
                { label: 'Z-index', translations: { ko: 'Z-index' }, slug: 'foundations/z-index' },
              ],
            },
            {
              label: 'Layout',
              translations: { ko: '레이아웃' },
              slug: 'foundations/layout',
            },
            {
              label: 'Iconography',
              translations: { ko: 'Iconography' },
              link: ICONOGRAPHY_SITE,
              attrs: { target: '_blank', rel: 'noreferrer' },
            },
          ],
        },
        {
          label: 'Components',
          translations: { ko: '컴포넌트' },
          items: [
            { label: 'Overview', translations: { ko: '개요' }, slug: 'components' },
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
            { label: 'Checkbox', slug: 'components/checkbox' },
            { label: 'Command', slug: 'components/command' },
            { label: 'Container', slug: 'components/container' },
            { label: 'Dialog', slug: 'components/dialog' },
            { label: 'Divider', slug: 'components/divider' },
            { label: 'Drawer', slug: 'components/drawer' },
            { label: 'Dropdown', slug: 'components/dropdown' },
            { label: 'Field', slug: 'components/field' },
            { label: 'Footer', slug: 'components/footer' },
            { label: 'Grid', slug: 'components/grid' },
            { label: 'Input', slug: 'components/input' },
            { label: 'Input OTP', slug: 'components/input-otp' },
            { label: 'Label', slug: 'components/label' },
            { label: 'Link', slug: 'components/link' },
            { label: 'Menu', slug: 'components/menu' },
            { label: 'Navigation Menu', slug: 'components/navigation-menu' },
            { label: 'Pagination', slug: 'components/pagination' },
            { label: 'Popover', slug: 'components/popover' },
            { label: 'Progress', slug: 'components/progress' },
            { label: 'Progress Stepper', slug: 'components/progress-stepper' },
            { label: 'Radio', slug: 'components/radio' },
            { label: 'Resizable', slug: 'components/resizable' },
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
            { label: 'Toast', slug: 'components/toast' },
            { label: 'Tooltip', slug: 'components/tooltip' },
            { label: 'Tree', slug: 'components/tree' },
          ],
        },
        {
          label: 'Development',
          translations: { ko: '개발' },
          items: [
            { label: 'Overview', translations: { ko: '개요' }, slug: 'development' },
            { label: 'Installation', translations: { ko: '설치' }, slug: 'development/installation' },
            { label: 'Theming', translations: { ko: '테마' }, slug: 'development/theming' },
            { label: 'Motion', translations: { ko: '모션' }, slug: 'development/motion' },
          ],
        },
        {
          label: 'AI & Tools',
          translations: { ko: 'AI & 도구' },
          items: [
            { label: 'Overview', translations: { ko: '개요' }, slug: 'ai-tools' },
            { label: 'DESIGN.md', link: '/DESIGN.md' },
            { label: 'llms.txt', link: '/llms.txt' },
            { label: 'Skill', translations: { ko: 'Skill' }, slug: 'ai-tools/skill' },
            { label: 'Doctor', translations: { ko: 'Doctor' }, slug: 'ai-tools/doctor' },
            { label: 'MCP', translations: { ko: 'MCP' }, slug: 'ai-tools/mcp' },
          ],
        },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/pelagornis/refineui' }],
    }),
  ],
});

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { removeEmptyFrameHeaders } from './src/expressive-code/removeEmptyFrameHeaders.mjs';

export default defineConfig({
  redirects: {
    '/intro': '/getting-started',
    '/intro/': '/getting-started/',
    '/introduction': '/getting-started',
    '/introduction/': '/getting-started/',
    '/foundations/layout/container': '/foundations/layout#container',
    '/foundations/layout/container/': '/foundations/layout/#container',
    '/foundations/layout/grid': '/foundations/layout#grid',
    '/foundations/layout/grid/': '/foundations/layout/#grid',
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      /** Avoid resolving CJS-only entries — keep ESM in the bundle */
      noExternal: ['@refineui/react', '@refineui/tokens'],
    },
    optimizeDeps: {
      exclude: ['@refineui/react', '@refineui/tokens', '@refineui/utilities'],
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
              items: [
                { label: 'Introduction', slug: 'foundations/iconography' },
                { label: 'Icons', slug: 'foundations/iconography/icons' },
                { label: 'Icon usage', slug: 'foundations/iconography/icon-usage' },
              ],
            },
          ],
        },
        {
          label: 'Components',
          items: [
            { label: 'Overview', slug: 'components' },
            {
              label: 'Actions',
              items: [
                { label: 'Button', slug: 'components/button' },
                { label: 'Button Group', slug: 'components/button-group' },
                { label: 'Segmented Control', slug: 'components/segmented-control' },
                { label: 'Toggle Button', slug: 'components/toggle-button' },
              ],
            },
            {
              label: 'Content',
              items: [
                { label: 'Accordion', slug: 'components/accordion' },
                { label: 'Bubble', slug: 'components/bubble' },
                { label: 'Divider', slug: 'components/divider' },
                { label: 'Label', slug: 'components/label' },
                { label: 'Link', slug: 'components/link' },
              ],
            },
            {
              label: 'Data Display',
              items: [
                { label: 'Avatar', slug: 'components/avatar' },
                { label: 'Avatars', slug: 'components/avatars' },
                { label: 'Badge', slug: 'components/badge' },
                { label: 'Calendar', slug: 'components/calendar' },
                { label: 'Card', slug: 'components/card' },
                { label: 'Carousel', slug: 'components/carousel' },
                { label: 'Chart', slug: 'components/chart' },
                { label: 'Table', slug: 'components/table' },
                { label: 'Tag', slug: 'components/tag' },
              ],
            },
            {
              label: 'Feedback',
              items: [
                { label: 'Alert', slug: 'components/alert' },
                { label: 'Progress', slug: 'components/progress' },
                { label: 'Progress Stepper', slug: 'components/progress-stepper' },
                { label: 'Skeleton', slug: 'components/skeleton' },
                { label: 'Spinner', slug: 'components/spinner' },
                { label: 'Toast', slug: 'components/toast' },
                { label: 'Tooltip', slug: 'components/tooltip' },
              ],
            },
            {
              label: 'Forms',
              items: [
                { label: 'Checkbox', slug: 'components/checkbox' },
                { label: 'Field', slug: 'components/field' },
                { label: 'Input', slug: 'components/input' },
                { label: 'Input OTP', slug: 'components/input-otp' },
                { label: 'Radio', slug: 'components/radio' },
                { label: 'Search Field', slug: 'components/search-field' },
                { label: 'Select', slug: 'components/select' },
                { label: 'Slider', slug: 'components/slider' },
                { label: 'Spin Button', slug: 'components/spin-button' },
                { label: 'Switch', slug: 'components/switch' },
                { label: 'Textarea', slug: 'components/textarea' },
              ],
            },
            {
              label: 'Layout',
              items: [
                { label: 'Box', slug: 'components/box' },
                { label: 'Container', slug: 'components/container' },
                { label: 'Grid', slug: 'components/grid' },
                { label: 'Resizable', slug: 'components/resizable' },
                { label: 'Scroll Area', slug: 'components/scroll-area' },
                { label: 'Stack', slug: 'components/stack' },
              ],
            },
            {
              label: 'Navigation',
              items: [
                { label: 'Breadcrumb', slug: 'components/breadcrumb' },
                { label: 'Footer', slug: 'components/footer' },
                { label: 'Menu', slug: 'components/menu' },
                { label: 'Navigation Menu', slug: 'components/navigation-menu' },
                { label: 'Pagination', slug: 'components/pagination' },
                { label: 'Sidebar', slug: 'components/sidebar' },
                { label: 'Stepper', slug: 'components/stepper' },
                { label: 'Tabs', slug: 'components/tabs' },
              ],
            },
            {
              label: 'Overlays',
              items: [
                { label: 'Command', slug: 'components/command' },
                { label: 'Dialog', slug: 'components/dialog' },
                { label: 'Drawer', slug: 'components/drawer' },
                { label: 'Dropdown', slug: 'components/dropdown' },
                { label: 'Popover', slug: 'components/popover' },
              ],
            },
          ],
        },
        {
          label: 'Development',
          items: [
            { label: 'Overview', slug: 'development' },
            { label: 'Installation', slug: 'development/installation' },
            { label: 'Theming', slug: 'development/theming' },
            { label: 'Motion', slug: 'development/motion' },
            { label: 'AI Integration', slug: 'ai-integration' },
          ],
        },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/pelagornis/refineui' }],
    }),
  ],
});

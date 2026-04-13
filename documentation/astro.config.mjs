import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      /** CJS 엔트리만 잡히는 이슈 방지 — 번들 시 ESM로 통일 */
      noExternal: ['@refineui/react', '@refineui/tokens'],
    },
    optimizeDeps: {
      include: ['@refineui/react'],
    },
  },
  integrations: [
    react(),
    starlight({
      plugins: [],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: 'anonymous',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
          },
        },
      ],
      title: 'RefineUI',
      description: 'Pelagornis RefineUI Web Kit — 디자인 시스템 컴포넌트 라이브러리',
      customCss: ['./src/styles/global.css'],
      sidebar: [
        { label: '시작하기', slug: 'intro' },
        {
          label: '컴포넌트',
          autogenerate: { directory: 'components' },
        },
        {
          label: '가이드',
          items: [
            { label: '프로젝트 구조', slug: 'guides/packages' },
            { label: 'CLI', slug: 'guides/cli' },
          ],
        },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/pelagornis/refineui' }],
    }),
  ],
});

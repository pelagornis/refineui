import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import pagePlugin from '@pelagornis/page';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@refineui/tokens': join(__dirname, '../packages/tokens/dist/index.mjs'),
      },
    },
    ssr: {
      noExternal: ['@refineui/react'],
    },
    optimizeDeps: {
      include: ['@refineui/react'],
    },
  },
  integrations: [
    react(),
    starlight({
      plugins: [],
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

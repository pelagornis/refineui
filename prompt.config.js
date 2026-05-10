/**
 * Prompt Guide config — RefineUI
 * RefineUI: React/TypeScript web UI library monorepo.
 * Keep the packages/ layout. After edits run `prompt-guide install`.
 * @see https://github.com/pelagornis/prompt-guide
 */
module.exports = {
  tool: 'cursor',
  platform: 'web',

  model: {
    default: 'claude-sonnet-4',
    options: ['claude-sonnet-4', 'claude-opus-4', 'gpt-4o', 'gpt-4o-mini'],
  },

  context: {
    include: [
      'packages/react/**',
      'packages/tokens/**',
      'packages/utilities/**',
      'packages/version/**',
      '*.config.js',
      '*.config.ts',
      'tsconfig*.json',
      'pnpm-workspace.yaml',
    ],
    exclude: [
      '**/.env', '**/.env.*', '**/secrets/**', '**/*secret*', '**/*credentials*',
      '**/*.pem', '**/*.key', '**/node_modules/**', '**/dist/**', '**/build/**',
      '**/lib/**', '**/lib-commonjs/**',
      '**/.next/**', '**/out/**', '**/.git/**', '**/.cache/**', '**/vendor/**',
    ],
    max_files: 50,
    max_tokens: 8000,
  },

  prompts: {
    default: 'prompts/system.core.yml',
    review: 'prompts/review.yml',
    designSystem: 'prompts/design-system.figma.yml',
  },

  taskPresets: {
    default: { description: 'General coding with full system rules', prompt: 'prompts/system.core.yml' },
    review: { description: 'Code review with checklist', prompt: 'prompts/review.yml', model: 'claude-sonnet-4' },
    refactor: { description: 'Refactor only; preserve behavior', prompt: 'prompts/system.core.yml', rules_extra: ['Change behavior only when requested; preserve semantics.', 'Prefer small, incremental steps.'] },
    implement: { description: 'Implement from spec/ticket', prompt: 'prompts/system.core.yml', rules_extra: ['Implement exactly what is specified.', 'Add tests or test plan.'] },
    fix_bug: { description: 'Locate and fix with minimal change', prompt: 'prompts/system.core.yml', rules_extra: ['Identify root cause before changing code.', 'Minimal diff; no refactors unless required.'] },
    design: { description: 'UI/design/token work (Foundation-based)', prompt: 'prompts/design-system.figma.yml', rules_extra: ['Apply design-system.figma + system.core. Use @refineui/tokens only.'] },
    security_audit: { description: 'Security-focused review', prompt: 'prompts/review.yml', rules_extra: ['Focus on: secrets, input validation, auth, sensitive data in logs.'] },
  },

  platforms: {
    web: {
      label: 'Web (RefineUI)',
      context: {
        include: [
          'packages/react/**',
          'packages/tokens/**',
          'packages/utilities/**',
          'packages/version/**',
          '*.config.js',
          '*.config.ts',
          'tsconfig*.json',
          'pnpm-workspace.yaml',
        ],
      },
      rules_key: 'web',
    },
    ios: { label: 'iOS', context: { include: ['ios/**', '*.xcodeproj/**', 'Shared/**', 'src/**'] }, rules_key: 'ios' },
    android: { label: 'Android', context: { include: ['android/**', 'app/**', 'lib/**', 'src/**'] }, rules_key: 'android' },
    flutter: { label: 'Flutter', context: { include: ['lib/**', 'ios/**', 'android/**', 'test/**', 'pubspec.yaml'] }, rules_key: 'flutter' },
    server: { label: 'Server', context: { include: ['src/**', 'lib/**', 'app/**', 'internal/**', 'cmd/**'] }, rules_key: 'server' },
  },

  rules: {
    no_auto_scan: true,
    deterministic: true,
    strict: true,
    no_hallucination: true,
    cite_sources: true,
    require_file_refs: true,
    stay_in_scope: true,
    no_unsolicited_changes: true,
  },
};

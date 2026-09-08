# @refineui/version

Package version registration for [RefineUI](https://ui.pelagornis.com) — records which package versions a bundle loaded, so duplicate copies are visible at runtime.

Every RefineUI package calls `version()` once at module scope. The helper appends to `window.__packages__`, which makes a duplicated dependency easy to spot in a browser console instead of debugging it through mismatched styles or broken context.

## Install

```bash
npm install @refineui/version
yarn add @refineui/version
pnpm add @refineui/version
bun add @refineui/version
```

No peer dependencies — this package is safe to load in any bundle.

## Usage

```ts
import { version } from "@refineui/version";

version("@my-scope/my-package", "1.2.3");
```

Inspect what a page loaded:

```js
window.__packages__;
// { "@refineui/react": ["0.0.1"], "@refineui/tokens": ["1.0.0"] }
```

An array with more than one entry means two copies of that package are in the bundle.

## Behavior

- Registration is idempotent per bundle — a module-local cache keeps repeated calls from double-appending.
- Server-safe: when `window` is unavailable the call is a no-op, so SSR and Node tooling are unaffected.
- Clearing `window.__packages__` lets a caller re-register, which is the hook tests use to reset state.

## Development

```bash
bun run build
```

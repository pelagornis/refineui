# Changesets

Every change to a published `@refineui/*` package needs a changeset. Run:

```bash
bun run changeset
```

Pick the affected packages, pick `patch` / `minor` / `major`, write a one-line
summary, and commit the generated `.changeset/*.md` file with your PR.

Dependents are bumped for you — a `patch` on `@refineui/tokens` also patches
`@refineui/react` and `@refineui/mcp`. Only select a package explicitly when it
has its own user-facing change to describe.

## Release flow

Merging to `main` runs `.github/workflows/release.yml`:

1. Pending changesets → the workflow opens a "chore: version packages" PR that
   applies the bumps and writes each `CHANGELOG.md`.
2. Merging that PR → the workflow builds the packages and publishes them to
   npm with `bun publish`.

Docs (`@refineui/docs`) is private and is never versioned or published.

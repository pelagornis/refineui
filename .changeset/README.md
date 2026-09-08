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
   npm via OIDC trusted publishing, with no long-lived token.

Each package needs a trusted publisher registered once on npmjs.com (GitHub
Actions → `pelagornis` / `refineui` / `release.yml`). npm can only attach that
to a package that already exists, so a brand-new package's first version has to
be published with a token before it can go tokenless.

Docs (`@refineui/docs`) is private and is never versioned or published.

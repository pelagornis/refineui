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

1. Merge to `main` with pending changesets → `.github/workflows/version.yml`
   opens/updates a "chore: version packages" PR (bumps + `CHANGELOG.md`).
2. Merge that version PR → versions land on `main`, but nothing is published yet.
3. Push package tags (`@refineui/<pkg>@<version>`) → `.github/workflows/release.yml`
   builds and publishes to npm via OIDC trusted publishing.

Each package needs a trusted publisher registered once on npmjs.com (GitHub
Actions → `pelagornis` / `refineui` / `release.yml`). npm can only attach that
to a package that already exists, so a brand-new package's first version has to
be published with a token before it can go tokenless.

Docs (`@refineui/docs`) is private and is never versioned or published.

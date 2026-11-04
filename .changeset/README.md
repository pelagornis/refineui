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

Everything runs in `.github/workflows/release.yml` on push to `main`:

1. Merge to `main` with pending changesets → the workflow opens/updates a
   "chore: version packages" PR (bumps, `CHANGELOG.md`, and `bun.lock`).
2. Merge that version PR → no changesets are left, so the same workflow builds
   and publishes every unpublished version to npm via OIDC trusted publishing,
   then pushes `@refineui/<pkg>@<version>` tags and creates GitHub releases.

Do not version locally with `changeset version` alone — use
`bun run version:packages`, which also syncs the workspace versions bun.lock
records (`bun pm pack` reads those when it rewrites `workspace:*`). To retry a
failed publish, re-run the workflow (or dispatch it); published versions are
skipped.

Each package needs a trusted publisher registered once on npmjs.com (GitHub
Actions → `pelagornis` / `refineui` / `release.yml`). npm can only attach that
to a package that already exists, so a brand-new package's first version has to
be published with a token before it can go tokenless.

Docs (`@refineui/docs`) is private and is never versioned or published.

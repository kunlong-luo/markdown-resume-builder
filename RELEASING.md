# Releasing Resume Craft

Resume Craft publishes stable releases only. Pre-release versions such as alpha, beta, rc, canary, next, nightly, dev, and experimental are not published.

## Versioning

Use semantic versioning:

- Patch: `2.0.0 -> 2.0.1` for backward-compatible fixes.
- Minor: `2.0.0 -> 2.1.0` for backward-compatible features.
- Major: `2.0.0 -> 3.0.0` for breaking changes.

The version in `package.json` is the source of truth.

## Recommended release process

1. Merge all changes that should be included in the release.
2. Make sure `main` is green.
3. Update only to a new stable version in `package.json` through a normal pull request.
4. Let the required CI checks pass.
5. Squash-merge the version bump pull request into `main`.

When GitHub detects that the `package.json` version changed on `main`, the Release workflow runs automatically.

The workflow will:

- ignore `package.json` edits that do not change the version;
- reject non-stable SemVer versions;
- enforce the stable dependency policy;
- install with the frozen pnpm lockfile;
- run type checking, unit tests, and the production build;
- create or reuse the annotated `vX.Y.Z` tag;
- package the complete `dist/` output as ZIP and TAR.GZ archives;
- generate `SHA256SUMS.txt`;
- publish a GitHub Release with automatically generated release notes.

## Manual fallback

If an automatic run needs to be retried, open **Actions -> Release -> Run workflow**, select `main`, and enter the exact stable version already present in `package.json`.

## Failed releases

The workflow is safe to rerun. If the tag already exists on the same commit, it is reused. If a tag with the same version points to a different commit, the workflow fails instead of moving the tag.

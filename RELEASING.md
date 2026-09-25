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
3. Update `package.json` to the new stable version in a normal pull request and merge it.
4. Open **Actions -> Release**.
5. Choose **Run workflow**.
6. Select the `main` branch.
7. Enter the same version as `package.json`, without the leading `v` (for example `2.0.0`).
8. Run the workflow.

The release workflow will:

- reject non-stable SemVer versions;
- confirm the requested version matches `package.json`;
- enforce the stable dependency policy;
- install with the frozen pnpm lockfile;
- run type checking, unit tests, and the production build;
- create or reuse the annotated `vX.Y.Z` tag;
- package the complete `dist/` output as ZIP and TAR.GZ archives;
- generate `SHA256SUMS.txt`;
- publish a GitHub Release with automatically generated release notes.

## Automation trigger branch

The workflow also accepts an ephemeral branch named `release/vX.Y.Z`. This is intended for trusted automation only.

The workflow verifies that the trigger branch points to the latest `main`, validates the version, creates the annotated tag and release, then deletes the trigger branch automatically.

## Failed releases

The workflow is safe to rerun. If the tag already exists on the same commit, it is reused. If a tag with the same version points to a different commit, the workflow fails instead of moving the tag.

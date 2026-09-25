import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const sections = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
];

const prereleaseTags = new Set([
  'alpha',
  'beta',
  'canary',
  'dev',
  'experimental',
  'legacy',
  'next',
  'nightly',
  'rc',
]);

const prereleasePattern =
  /(?:^|[^a-z0-9])(alpha|beta|canary|dev|experimental|legacy|next|nightly|rc)(?:[^a-z0-9]|$)/i;

const violations = [];

for (const section of sections) {
  for (const [name, specifier] of Object.entries(pkg[section] ?? {})) {
    if (typeof specifier !== 'string') continue;

    const normalized = specifier.trim().toLowerCase();

    // Explicit stable npm dist-tags are allowed.
    if (normalized === 'latest' || normalized === 'stable') continue;

    if (prereleaseTags.has(normalized) || prereleasePattern.test(normalized)) {
      violations.push(`${section}: ${name}@${specifier}`);
    }
  }
}

const packageManager = String(pkg.packageManager ?? '');
if (prereleasePattern.test(packageManager)) {
  violations.push(`packageManager: ${packageManager}`);
}

if (violations.length > 0) {
  console.error('Dependency stability policy failed.');
  console.error('Only stable releases are allowed. Use a stable SemVer version, "latest", or "stable".');
  console.error('Pre-release tags such as alpha, beta, rc, canary, next, nightly, dev, experimental, and legacy are not allowed.');
  console.error('');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log('Dependency stability policy passed: direct dependencies use stable releases only.');

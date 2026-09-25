# Contributing to Resume Craft

Thanks for helping improve Resume Craft. Contributions of all sizes are welcome.

## Before you start

- Search existing issues and pull requests before opening a new one.
- Use the bug or feature issue form when possible.
- Keep changes focused. Large unrelated refactors are easier to review as separate pull requests.
- Never include real resume data, access tokens, credentials, or other sensitive information in issues, tests, screenshots, or commits.

## Development setup

Requirements:

- Node.js 24
- pnpm 11.27.x

```bash
git clone https://github.com/kunlong-luo/resume-craft.git
cd resume-craft
pnpm install
pnpm dev
```

Before opening a pull request, run:

```bash
pnpm lint
pnpm test
pnpm build
```

## Contribution workflow

1. Fork the repository or create a feature branch.
2. Branch from the latest `main`.
3. Make the smallest change that solves the problem.
4. Add or update tests when behavior changes.
5. Update documentation when user-facing behavior changes.
6. Open a pull request and complete the checklist.

Recommended branch names:

- `feat/<short-name>`
- `fix/<short-name>`
- `docs/<short-name>`
- `chore/<short-name>`

Recommended commit prefixes follow Conventional Commits where practical: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, and `chore:`.

## UI changes

For visible UI changes, include a short description and screenshots when they help reviewers understand the result. Keep Chinese and English UI copy aligned when a feature is bilingual.

## Security

Do not report vulnerabilities in a public issue. Follow [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the repository's MIT License.

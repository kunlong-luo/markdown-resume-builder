<h1 align="center">🚀 Resume Craft</h1>

<h3 align="center">Local-first Markdown Resume Builder</h3>

<p align="center">
  Build and tailor A4 resumes with Markdown, structured forms, ATS checks, and direct PDF export.
</p>

<p align="center">
  <a href="https://kunlong-luo.github.io/resume-craft/"><strong>Live Demo</strong></a>
  ·
  <a href="./README.md">简体中文</a>
  ·
  <a href="https://github.com/kunlong-luo/resume-craft/discussions">Feedback / Discussions</a>
  ·
  <a href="https://github.com/kunlong-luo/resume-craft/releases/latest">Latest Release</a>
</p>

<p align="center">
  <a href="https://kunlong-luo.github.io/resume-craft/"><img src="https://img.shields.io/badge/Live%20Demo-Try%20Now-4F46E5?style=flat-square&logo=github" alt="Live Demo" /></a>
  <a href="https://github.com/kunlong-luo/resume-craft/actions/workflows/ci.yml"><img src="https://github.com/kunlong-luo/resume-craft/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/kunlong-luo/resume-craft/releases/latest"><img src="https://img.shields.io/github/v/release/kunlong-luo/resume-craft?style=flat-square&logo=github" alt="Latest Release" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License" /></a>
</p>

<p align="center">
  <img src=".github/assets/readme-banner.svg" alt="Resume Craft — Markdown Resume Builder" width="100%" />
</p>


> **Resume Craft** is for job seekers and developers who want to spend less time fighting Word layouts. It combines Markdown, structured forms, and a live A4 preview in a local-first workflow that works without an account.
>
> **Markdown ↔ Form · Live A4 Preview · ATS Checks · Auto Fit · PDF Export · Local-first · PWA**
>
> Resume drafts and settings are primarily stored in the browser. ATS checks, layout tools, and PDF generation run on the client, while optional share links provide a lightweight way to send a resume to others.

---

## 💡 Why Choose Resume Craft?

When creating resumes, candidates frequently suffer from **Word layout nightmares**, **PDF export font corruptions**, **unwanted 1.1-page spills**, and **multi-device font distortion**. Resume Craft provides an end-to-end engineered solution:

```
+-----------------------------------------------------------------------------------+
|                                  RESUME CRAFT                                     |
|                                                                                   |
|  [ Structured Form ] <=========( Real-Time AST Bi-Sync )=========> [ Markdown ]   |
|          |                                                             |          |
|          +---------------------> [ A4 Canvas Core ] <------------------+          |
|                                         |                                         |
|    +------------------------------------+-----------------------------------+    |
|    |                                    |                                   |    |
| [ 1-Click Smart Auto-Fit ]    [ Fallback Font Stack ]      [ ATS JD Keyword Audit ]|
|    |                                    |                                   |    |
|    +------------------------------------+-----------------------------------+    |
|                                         |                                         |
|                   +---------------------+---------------------+                   |
|                   |                                           |                   |
|         [ Direct PDF / Browser Print ]               [ H5 Share Link / QR ]   |
+-----------------------------------------------------------------------------------+
```

---

## 🌟 Core Highlights

### 1. 🔄 Visual Form & Markdown Bi-Directional Sync Engine
* **Bi-Directional Sync**: Seamlessly edit in either the "Structured Form" or "Markdown Source" with real-time updates across the form, Markdown source, and live preview.
* **Drag & Drop Reordering**: Native grip handles allow mouse drag-and-drop to reorder experiences or skills instantly, updating both Markdown text and live previews.

### 2. ⚡ 1-Click Auto Fit & A4 Page Boundary Control
* **Eliminate Page Spills**: Say goodbye to 1.1-page awkward overflows. The lightning button dynamically adjusts margins, line height, and section padding to fit everything onto a pristine 1-page document.
* **Page Boundary Indicators**: Displays A4 physical page bounds and fold lines for layout accuracy.

### 3. ✨ Smart Raw Text Importer
* **One-Click Parsing**: Paste raw text from job portals or old documents. Local lightweight parsing algorithms automatically extract contact info, work history, and skills into clean Markdown.

### 4. 🎯 ATS Job Matching & Smart Audit System
* **JD Keyword Matching**: Paste target Job Descriptions to analyze match percentage and highlight missing keywords.
* **Formatting Audit**: Scans for missing contact details, overlapping timeline dates, and inconsistent technology capitalization (e.g., auto-suggesting `React` over `react`).

### 5. ✍️ Bilingual Spacing Helper
* **Aesthetic Typography**: Automatically inserts aesthetic spaces between Chinese characters, English words, and numbers to optimize document readability.

### 6. 🎨 Industry Color Palettes & Layout Customization
* **Custom Styling**: Select from Indigo, Slate, Emerald, and Amber color palettes; customize single/two-column layouts, base font size (13/14/15px), line height, and header line accents.

### 7. 🔤 System Font Stack & A4 Layout Consistency
* **Cross-Platform Consistency**: Uses a robust fallback stack (PingFang SC, Microsoft YaHei, Source Han Sans SC) with a `794px × 1123px` A4 canvas and adaptive viewport scaling to reduce layout differences across browsers and operating systems. Small variations can still occur because local font metrics differ.

### 8. 💾 Multi-Profile Matrix & Diff Comparison
* **Version Control**: Clone and maintain tailored resume branches for different roles (e.g., `Frontend Lead`, `Full-Stack Developer`).
* **Diff Analysis**: View side-by-side diff highlights comparing text changes and keywords between two versions.

### 9. 🔒 H5 Link Sharing & Optional Access Code
* **Convenient Sharing**: Resume content is encoded into the share URL and can be gated by an optional client-side access code. The current sharing mechanism is not end-to-end encryption; anyone who receives the complete share URL should be treated as potentially able to read the embedded data.

### 10. 📐 Section Sorter
* **Module Reordering**: Automatically detects Markdown section headers (`H2`) and allows moving entire sections up or down with one click.

### 11. 🌙 Dark Mode with Canvas Isolation
* **Eye Comfort**: Full tactile Dark Mode theme with styling isolation so resume previews always maintain pristine white paper with crisp dark text.

### 12. 🌐 Full Bilingual Localization
* **Instant Switch**: Toggle between English (`en`) and Chinese (`zh`) with full UI, template, and diagnostic translation.

### 13. ⚡ PWA & Local-First Storage
* **Local First**: Installable as a desktop or mobile PWA. Resume drafts and settings are stored in browser-local storage, and the project does not provide an application backend for persisting resume content. Shared links embed data in the URL, so only share them with trusted recipients.

---

## 📂 Source Directory Architecture

```
.
├── .github/
│   ├── dependabot.yml           # Dependabot automated weekly checks
│   └── workflows/
│       ├── ci.yml               # CI build & test check pipeline
│       ├── deploy.yml           # Deploy main to GitHub Pages
│       ├── release.yml          # Stable release after package version changes
│       ├── seo-submit.yml       # Optional IndexNow submission after deploy
│       └── promote.yml          # Cross-post new content (dry-run by default)
├── src/
│   ├── assets/                  # Icons & static media assets
│   ├── components/              # Layered UI component architecture
│   │   ├── form/                # Visual structured form input fields
│   │   ├── layout/              # Topbar, sidebar & split layout wrappers
│   │   ├── modals/              # ATS, password lock, draft diff modals
│   │   ├── preview/             # A4 canvas renderer & ZoomControls
│   │   ├── share/               # Public H5 share page component
│   │   └── toolbar/             # Quick action bar & AutoFit controls
│   ├── context/                 # Global React contexts
│   ├── data/                    # Initial templates in EN & ZH
│   ├── hooks/                   # Custom hooks (A4 measurement, shortcuts)
│   ├── i18n/                    # Localization dictionaries
│   ├── lib/                     # AST parsers, Auto-Fit, sharing & storage utilities
│   ├── store/                   # Zustand reactive state store
│   ├── types.ts                 # TypeScript type definitions
│   ├── index.css                # Tailwind CSS v4 & theme variables
│   └── main.tsx                 # Application entrypoint
├── index.html                   # HTML template entry
├── package.json                 # Project dependencies & scripts
├── vite.config.ts               # Vite 8 bundler configuration
└── README.md                    # Main documentation
```

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [React 19](https://react.dev/) + [TypeScript 7](https://www.typescriptlang.org/) | Type-safe, high-performance UI rendering |
| **Bundler** | [Vite 8](https://vite.dev/) | Instant HMR & fast production builds |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Atomic styling with modern CSS variables |
| **State** | [Zustand 5](https://github.com/pmndrs/zustand) | Lightweight reactive state with LocalStorage sync |
| **Animations** | [Motion 13](https://github.com/framer/motion) | Smooth drag-and-drop & modal transitions |
| **Markdown** | `react-markdown` + `remark-gfm` | GFM-compliant markdown parsing |
| **PDF Engine** | Browser print + `html2canvas-pro` + `jspdf` | Direct PDF download plus native Save as PDF workflow |

---

## 🚀 Quick Start Guide

### 1. Clone Repository
```bash
git clone https://github.com/kunlong-luo/resume-craft.git
cd resume-craft
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run Development Server
```bash
pnpm dev
```
Open your browser at [http://localhost:3000](http://localhost:3000) to start editing.

### 4. Scripts Overview

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start Vite dev server on port 3000 |
| `pnpm build` | Build production assets into `dist/` |
| `pnpm lint` | Run TypeScript static type checker |
| `pnpm test` | Run Vitest unit test suite |
| `pnpm preview` | Preview production build locally |
| `pnpm check:stable-deps` | Reject direct dependency pre-releases |

---

## 📈 PDF Download & Print Guide

Resume Craft provides two export paths:

1. **Direct PDF download (default)**: click **Download** to generate a PDF in the browser with `html2canvas-pro + jsPDF`.
2. **Browser print / Save as PDF**: press **Ctrl/Cmd + P** to use the native browser print workflow.

While editing, use the **A4 Page Line** and **1-Click Auto Fit** tools to check page boundaries. For the browser print path (Chrome / Edge / Safari), recommended settings are:

* **Destination**: `Save as PDF`
* **Paper Size**: `A4`
* **Margins**: try **`None`** first and confirm against the preview
* **Options**: enable **`Background graphics`** when needed
* **Headers and Footers**: disable them

---

## 🔐 Privacy & Security Boundaries

Resume Craft is local-first, but local-first does not mean that every stored or shared value is cryptographically encrypted.

- Resume drafts, settings, and profiles are primarily stored in browser `localStorage`.
- The project does not provide an application backend for persisting resume content.
- Share URLs embed resume data in the URL; the optional access code is currently a client-side viewing gate, not end-to-end encryption.
- Do not include real resume data, tokens, passwords, or other sensitive information in issues, pull requests, test fixtures, or screenshots.
- Report security issues through the private process described in [SECURITY.md](SECURITY.md).

---

## 🤝 Contributing & Community

Bug reports, feature ideas, and code contributions are welcome. Before contributing, please read:

- [Contributing Guide](CONTRIBUTING.md) — development setup, commit conventions, and pull request workflow
- [Code of Conduct](CODE_OF_CONDUCT.md) — community expectations
- [Security Policy](SECURITY.md) — report vulnerabilities privately; do not publish sensitive details
- [Support](SUPPORT.md) — where to ask for help or report problems

Before opening a pull request, make sure `pnpm lint`, `pnpm test`, and `pnpm build` all pass.

---

## 📄 License

Distributed under the [MIT License](LICENSE). Free for personal and commercial use.

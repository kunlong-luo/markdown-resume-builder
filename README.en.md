# 🚀 Resume Craft Pro - Markdown Resume Builder (v2.0.0)

English | [简体中文](./README.md)

[![Version](https://img.shields.io/badge/version-v2.0.0--PRO-blue?style=flat-square&logo=github)](https://github.com/kunlong-luo/resume-craft)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Try%20Now-4F46E5?style=flat-square&logo=github)](https://kunlong-luo.github.io/resume-craft/)
[![React](https://img.shields.io/badge/built%20with-React%2019-blueviolet?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/bundler-Vite%208-646CFF?style=flat-square&logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/styling-Tailwind%20v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

> **Resume Craft** is an elegant, bi-directional synchronous, pixel-perfect A4 online resume editor designed specifically for job seekers.
> 
> 🌐 **Live Demo App**: [https://kunlong-luo.github.io/resume-craft/](https://kunlong-luo.github.io/resume-craft/)
> 
> 💡 **Tagline**: *"Craft your perfect one-page resume with Markdown."*
> 
> Combining the speed of Markdown with the simplicity of structured visual forms, it features 1-Click Auto-Fit, ATS audit matching, bilingual spacing rules, professional color palettes, multi-draft matrices, and password-protected H5 sharing. Say goodbye to Word alignment nightmares and craft job-winning resumes in seconds.

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
|         [ Vector PDF / High-Res Canvas ]             [ Encrypted H5 Link / QR ]   |
+-----------------------------------------------------------------------------------+
```

---

## 🌟 Core Highlights

### 1. 🔄 Visual Form & Markdown Bi-Directional Sync Engine
* **Bi-Directional Sync**: Seamlessly edit in either the "Structured Form" or "Markdown Source" with real-time **<16ms canvas re-rendering**.
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

### 7. 🔤 High-Precision System Font Stack & A4 Scale Consistency
* **Zero Multi-Device Discrepancies**: Eliminates font face distortion caused by external web font load timeouts with a robust fallback chain (PingFang SC, Microsoft YaHei, Source Han Sans SC). Pair with a standardized 1:1 A4 canvas (`794px × 1123px`) and adaptive viewport zoom engine for 100% exact alignment across editor preview, H5 link sharing, and PDF exports.

### 8. 💾 Multi-Profile Matrix & Diff Comparison
* **Version Control**: Clone and maintain tailored resume branches for different roles (e.g., `Frontend Lead`, `Full-Stack Developer`).
* **Diff Analysis**: View side-by-side diff highlights comparing text changes and keywords between two versions.

### 9. 🔒 Encrypted H5 Link Sharing & Password Lock
* **Secure Sharing**: Encodes resume data into URL hashes using LZ-String compression and Web Crypto SHA-256 encryption with optional password protection.

### 10. 📐 Section Sorter
* **Module Reordering**: Automatically detects Markdown section headers (`H2`) and allows moving entire sections up or down with one click.

### 11. 🌙 Dark Mode with Canvas Isolation
* **Eye Comfort**: Full tactile Dark Mode theme with styling isolation so resume previews always maintain pristine white paper with crisp dark text.

### 12. 🌐 Full Bilingual Localization
* **Instant Switch**: Toggle between English (`en`) and Chinese (`zh`) with full UI, template, and diagnostic translation.

### 13. ⚡ PWA & 100% Local Privacy Protection
* **Privacy First**: Installable as a desktop or mobile PWA. All data is persisted locally in IndexedDB / LocalStorage without telemetry or central server tracking.

---

## 📂 Source Directory Architecture

```
.
├── .github/
│   ├── dependabot.yml           # Dependabot automated weekly checks
│   └── workflows/
│       ├── ci.yml               # CI build & test check pipeline
│       ├── deploy.yml           # Deploy main to GitHub Pages
│       ├── release.yml          # Tag-triggered release & asset publish
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
│   ├── lib/                     # AST parsers, Auto-Fit algorithms & Crypto
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
| **Animations** | [Motion 12](https://github.com/framer/motion) | Smooth drag-and-drop & modal transitions |
| **Markdown** | `react-markdown` + `remark-gfm` | GFM-compliant markdown parsing |
| **PDF Engine** | Native Print + `html2canvas-pro` + `jspdf` | Vector-crisp PDF output |

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

---

## 📈 High-Quality PDF Export Tips

Resume Craft supports both **native vector print** and **high-definition Canvas rendering**:

1. Enable **A4 Page Line** in the toolbar while editing to check page bounds.
2. If content spills slightly into page 2, click **1-Click Auto Fit**.
3. In the system print dialog (Chrome / Edge / Safari):
   * **Destination**: `Save as PDF`
   * **Paper Size**: `A4`
   * **Margins**: **`None`** (*Crucial for 1:1 alignment*)
   * **Options**: Check **`Background graphics`**
   * **Headers and Footers**: **Uncheck**

---

## 📄 License

Distributed under the [MIT License](LICENSE). Free for personal and commercial use.

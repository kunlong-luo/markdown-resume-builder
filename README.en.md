# 🚀 ResuCraft Pro - Markdown Resume Builder (v2.0.0)

English | [简体中文](./README.md)

[![Version](https://img.shields.io/badge/version-v2.0.0--PRO-blue?style=flat-square&logo=github)](https://github.com/kunlong-luo/markdown-resume-builder)
[![React](https://img.shields.io/badge/built%20with-React%2019-blueviolet?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/bundler-Vite%208-646CFF?style=flat-square&logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/styling-Tailwind%20v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

> **ResuCraft** is an elegant, bi-directional synchronous, pixel-perfect A4 online resume editor designed specifically for job seekers.
> 
> 💡 **Tagline**: *"Craft your perfect one-page resume with Markdown."*
> 
> Combining the writing speed of Markdown with the simplicity of visual structured forms, it features 1-Click Auto-Fit, ATS audit matching, bilingual spacing rules, professional color palettes, multi-draft matrices, and password-protected H5 sharing. Say goodbye to Word alignment nightmares and craft job-winning resumes in seconds.

---

## 🌟 Core Highlights

### 1. 🔄 Visual Form & Markdown Bi-Directional Sync Engine
*   **Bi-Directional Sync**: Seamlessly switch between the "Visual Form Editor" and "Markdown Source Code".
*   **Drag & Drop Reordering**: Reorder work or project experiences using native Grip handles with real-time preview re-rendering.

### 2. ⚡ 1-Click Auto Fit & A4 Page Boundary Control
*   **Eliminate Page Spills**: Click the Auto Fit button to dynamically fine-tune margins, font line-height, and paragraph spacing, instantly fitting content into 1 page.
*   **Page Boundary Indicators**: Features A4 page height guides and fold lines for precision layout management.

### 3. ✨ Smart Raw Text Importer
*   **One-Click Parsing**: Paste unformatted raw text from job portals or old documents. Local algorithms automatically extract contact info, work history, and skills into clean Markdown.

### 4. 🎯 ATS Job Matching & Smart Audit System
*   **JD Keyword Matching**: Paste target Job Descriptions to analyze match percentage and highlight missing keywords.
*   **Formatting Audit**: Scans for missing contact details, overlapping timeline dates, and inconsistent technology capitalization (e.g., auto-suggesting `React` over `react`).

### 5. ✍️ Bilingual Spacing Helper
*   **Aesthetic Typography**: Automatically inserts aesthetic spaces between Chinese characters, English words, and numbers to optimize document readability.

### 6. 🎨 Industry Color Palettes & Layout Customization
*   **Custom Styling**: Select from Indigo, Slate, Emerald, and Amber color palettes; customize single/two-column layouts, base font size (13/14/15px), line height, and header line accents.

### 7. 💾 Multi-Profile Matrix & Diff Comparison
*   **Version Control**: Clone and maintain tailored resume branches for different roles (e.g., `Frontend Lead`, `Full-Stack Developer`).
*   **Diff Analysis**: View side-by-side diff highlights comparing text changes and keywords between two versions.

### 8. 🔒 Encrypted H5 Link Sharing & Password Lock
*   **Secure Sharing**: Generate compressed, encrypted H5 share links protected by access passwords, alongside high-res QR codes for HR preview.

### 9. 📐 Section Sorter
*   **Module Reordering**: Automatically detects Markdown section headers (`H2`) and allows moving entire sections up or down with one click.

### 10. 🌙 Dark Mode with Canvas Isolation
*   **Eye Comfort**: Full tactile Dark Mode theme with styling isolation so resume previews always maintain pristine white paper with crisp dark text.

### 11. 🌐 Full Bilingual Localization
*   **Instant Switch**: Toggle between English (`en`) and Chinese (`zh`) with full UI, template, and diagnostic translation.

### 12. ⚡ PWA & 100% Local Privacy Protection
*   **Privacy First**: Installable as a desktop or mobile PWA. All data is persisted locally in IndexedDB / LocalStorage without telemetry or central server tracking.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) + [TypeScript 7](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **State Management**: [Zustand 5](https://github.com/pmndrs/zustand)
*   **Motion**: [Framer Motion / Motion 12](https://github.com/framer/motion)
*   **Markdown**: `react-markdown` + `remark-gfm`
*   **Export Engine**: `jspdf` + `html2canvas-pro` + Native Vector Print Driver
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/kunlong-luo/markdown-resume-builder.git
cd markdown-resume-builder
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run Development Server
```bash
pnpm dev
```
Open your browser at [http://localhost:3000](http://localhost:3000)!

### 4. Run Unit Tests
```bash
pnpm test
```

---

## 📈 High-Quality PDF Export Tips

1. Enable **A4 Page Line** in the toolbar while editing.
2. If content spills slightly into page 2, click **1-Click Auto Fit**.
3. Click **Export PDF** and configure print settings:
   * **Destination**: `Save as PDF`
   * **Paper Size**: `A4`
   * **Margins**: `None`
   * **Options**: Check `Background graphics`
   * **Headers and Footers**: Uncheck

---

## 📄 License

Distributed under the [MIT License](LICENSE). Free for personal and commercial use.

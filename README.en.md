# 📑 ResuCraft (Markdown Resume Builder Pro)

English | [简体中文](./README.md)

[![Version](https://img.shields.io/badge/version-v1.3.0--PRO-blue?style=flat-square&logo=github)](https://github.com/kunlong-luo/markdown-resume-builder)
[![React](https://img.shields.io/badge/built%20with-React%2018-blueviolet?style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/bundler-Vite-646CFF?style=flat-square&logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/styling-Tailwind%20v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

> **ResuCraft (Markdown Resume Builder Pro)** is an elegant, bi-directional synchronous, pixel-perfect A4 online resume editor designed specifically for job seekers. Combining the efficiency of Markdown with the simplicity of visual structured forms, it supports full Chinese and English localization. It features smart diagnostic checks, automatic bilingual spacing optimization, professional accent palettes, and a multi-version draft hub. Say goodbye to Word alignment nightmares and craft job-winning professional resumes in seconds.

---

## 🌟 Core Highlights

### 1. 🔄 Visual Form & Markdown Bi-Directional Sync Engine
*   **The Pain Point**: Traditional Markdown editors require users to have strict syntax knowledge. Micro-adjustments (like swapping the sequence of projects) often result in broken parentheses, missing list marks, or messed-up typography.
*   **The Solution**: Built with a state-of-the-art **Bi-Directional Sync Engine**. You can easily draft in the raw "Markdown Code Editor" or switch to the structured "Visual Form Editor". Re-ordering items, adding or removing educational entries, or editing text in the forms will automatically re-render the Markdown source code. Conversely, editing raw Markdown instantaneously updates the visual form data.

### 2. 📏 Perfect A4 Height Boundary & Page Break Guides
*   **The Pain Point**: The biggest mistake in a resume is "1.1 pages" or "1.2 pages". Overflowing lines not only look unprofessional but also get cut off during printing or PDF submission.
*   **The Solution**:
    *   **A4 Height Boundary Line (Page Boundary Line)**: Provides an elegant smart boundary indicator in the right-side preview pane to perfectly simulate the physical A4 size. It calculates and displays "Current page count: X.X pages" in real time.
    *   **Page Break indicator**: Activate foldable page-break guides to help you allocate spacing, font sizes, or lines correctly, ensuring no single-line overflows or ugly margins when exporting your PDF.

### 3. 🌐 Native Bilingual Support (English & Chinese)
*   **The Feature**: Native support for **English (en)** and **Chinese (zh)** language toggles. Switching languages instantly translates the entire UI, action buttons, preloaded default templates, quick input placeholders, and diagnostic check alerts. This is ideal for global candidates and international student applicants.

### 4. 🔍 Smart Diagnostic Audit & Quality Checker
*   **The Feature**: A lightweight, real-time background resume scanner that audits grammar, structure, and spacing:
    *   **Basic Info Audit**: Automatically detects missing contact information, phone numbers, emails, or job targets.
    *   **Timeline Overlap Alert**: Flags logical timeline overlap conflicts in work, project, or academic records.
    *   **Technical Casing Correction**: Identifies technical terms and reminds you to keep industry-standard naming casings (e.g., suggesting to fix `react` to `React`, `typescript` to `TypeScript`, `node.js` to `Node.js`).
    *   **Competitiveness Score**: Dynamically calculates a visual score based on content completeness and typography compliance, giving you immediate feedback.

### 5. ✍️ Intelligent Spacing Formatter (Bilingual Spacing Helper)
*   **The Pain Point**: Missing spacing between Chinese characters, English words, and numbers makes text squished and hard to read, which looks highly unprofessional.
*   **The Solution**: Based on typography design guidelines, we provide a **one-click spacing formatter**. Clicking the `Spacing` optimization button instantly corrects layout spacing details (e.g., converting `Experienced with ReactandNode.jsdev` to clean structured spacing), making your texts read like polished, top-tier engineering documents.

### 6. 🎨 Handcrafted Professional Accent Palettes & Layout Customization
*   **The Feature**:
    *   **Professional Colors**: One-click color themes like **Indigo (Tech & Geek)**, **Slate (System & Academic)**, **Emerald (Finance & Consulting)**, and **Amber (Design & Product)**. Accent colors automatically propagate to headings, borders, bullet points, and highlight tags.
    *   **Micro-Layout Adjustments**: Real-time slider controls for font sizes, line heights, margins (Compact, Moderate, Loose), and optional decorative top accent lines.

### 7. 💾 Multi-Version Resume Matrix & One-Click Diff Analysis
*   **The Feature**: Keep track of multiple resumes tailored for different jobs or roles. Instantly snapshot your current work to spin off a new targeted draft folder (e.g., `Frontend Dev Version`, `Product Manager Version`). Compare any two versions side-by-side using the **One-Click Diff Comparative Analyzer**, which highlights differences in text blocks, keywords, and accents.

### 8. 🔒 Secure H5 Share Links & Independent Access Passwords
*   **The Feature**: Publish a compressed, encrypted, responsive online H5 portfolio link for any version of your resume. Secure your page with an optional **Access Password challenge** to protect sensitive contact data from crawlers or unwanted eyes. Includes a generated HR high-definition QR Code for instant mobile-friendly reading or zero-config desktop printing.

### 9. 📐 Draggable/Interactive Section Sorter
*   **The Feature**: Switch to the "Section Order" view to automatically list major Markdown H2 titles (such as Work Experience, Education, Projects). Reorganize your reading layout order instantly with the up/down controllers without touching raw Markdown blocks, instantly synchronizing with Form values, Source codes, and PDF previews.

### 10. 🕸️ 12px High-Precision Design Alignment Grid
*   **The Feature**: Need pixel-perfect alignments? Turn on the "Grid Lines" overlay to map a 12px background design grid across the resume stage. Align margins, text lines, and dividers perfectly to get a professional, high-end editorial graphic designer feeling.

### 11. 🔍 Interactive Zoom & Screen Adaptation (Zoom & Fit Window)
*   **The Feature**: Interactive zoom slider supporting `50% - 150%` scales, alongside a one-click "Fit to Window" function. Zoom out to supervise macro-level layout pages or zoom in to inspect microscopic line and padding details on any display.

---

## 🛠️ Tech Stack & Architecture

*   **Core Framework**: [React 18](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animation**: [Framer Motion / motion](https://github.com/framer/motion)
*   **Markdown Parsing**: `react-markdown` + `remark-gfm` + Custom rewritten React renderer components
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/kunlong-luo/markdown-resume-builder.git
cd markdown-resume-builder
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment Variables
If you wish to unlock the integrated AI text enhancement and refactoring assistant, copy `.env.example` to `.env` and provide your Google Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the Dev Server
```bash
pnpm dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to start crafting!

---

## 📈 High-Quality PDF Export Guide

To ensure you get a pixel-perfect, crisp, HD PDF with zero cut-offs:
1. While writing, turn on **"A4 Height Boundary"** and **"Page Break Indicator"** in the toolbar.
2. Adjust font size, margin, or spacing so that your content matches the full page (or exact multiple pages) with no trailing single-line overflow.
3. Click **"Export PDF"** on the top right. This automatically triggers and prepares your browser's printing layout.
4. **【CRITICAL Print Dialog Settings】**:
   *   **Destination**: Select `Save as PDF` (or Save to PDF)
   *   **Paper size**: MUST choose `A4`
   *   **Margins**: MUST choose `None` or `Default`
   *   **Options**: MUST check `Background graphics` (otherwise accent colors and border tags will not display)
   *   **Headers and Footers**: Uncheck (so that URL text and system date elements are removed)

---

## 🤝 Contributing

We welcome your contributions! Feel free to submit an Issue for feedback or submit a Pull Request:
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). You are completely free to use, modify, and distribute it for personal, commercial, or corporate purposes.

---

⭐ **If you find this project helpful, please give us a Star on GitHub! Your support is our greatest motivation!**

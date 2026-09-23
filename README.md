# 🚀 Resume Craft · 简匠简历 Pro (v2.0.0)

[English](./README.en.md) | 简体中文

[![Version](https://img.shields.io/badge/version-v2.0.0--PRO-blue?style=flat-square&logo=github)](https://github.com/kunlong-luo/markdown-resume-builder)
[![React](https://img.shields.io/badge/built%20with-React%2019-blueviolet?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/bundler-Vite%208-646CFF?style=flat-square&logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/styling-Tailwind%20v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

> **Resume Craft (简匠简历)** 是一款专为求职者打造的高颜值、双向同步、完美 A4 控页的在线 Markdown 简历编辑器。
> 
> 💡 **核心口号**：*“用 Markdown 匠造完美的一页纸简历 | Craft your perfect one-page resume with Markdown.”*
> 
> 它融合了 Markdown 的极客书写效率与可视化表单的易用性，支持中英双语，提供强大的 ATS 智能诊断、一键压缩贴合（1-Click Auto Fit）、自动中英空格微调、行业专属色盘、多档案草稿矩阵与 H5 密保分享，助你告别排版地狱，秒出大厂级气质的高清简历。

---

## 🌟 核心杀手级特性

### 1. 🔄 可视化表单 & Markdown 双向同步引擎
*   **双向联动**：支持在「可视化表单」与「Markdown 源码」之间无缝切换。
*   **拖拽重排**：表单内置抓手（Grip Handle），支持鼠标拖拽条目秒级调整经历顺序，Markdown 源码与预览图同步实时重绘。

### 2. ⚡ 顶栏「一键压缩贴合」（1-Click Auto Fit）与 A4 控页
*   **消除溢出**：拒绝“1.1 页”断层尴尬。闪电按钮自动级联微调页边距、字体行高与段落间距，瞬间将溢出内容平滑收纳至 1 页之内。
*   **辅助刻度**：提供 A4 页面物理裁剪边界提示与折页指示线，直观掌控纸张空间。

### 3. ✨ 杂乱纯文本智能导入（Smart Raw Text Importer）
*   **一键解析**：直接粘贴来自招聘网站（BOSS/猎聘）、旧 Word 或 PDF 的杂乱纯文本，本地算法自动识别姓名、联系方式、工作经历与技能并清洗规整为标准 Markdown。

### 4. 🎯 ATS 岗位匹配与智能诊断系统
*   **JD 契合度匹配**：粘贴目标岗位 Job Description，算法智能对比匹配度关键词，突出显示核心技能短板。
*   **排版与合规自检**：实时扫描联系方式遗漏、多段经历时间重叠冲突及技术词汇规范大小写（如将 `react` 改为 `React`）。

### 5. ✍️ 一键中英排版空格优化 (Bilingual Spacing)
*   **排版美学**：依据中文排版规范，一键自动在中文与英文、数字之间插入美学空格（如 `熟练使用React开发` ➔ `熟练使用 React 开发`），大幅增加文本呼吸感。

### 6. 🎨 行业专属主题色盘与模版定制
*   **多维排版**：内置科技靛蓝、金融墨绿、极客深黑等行业色盘；支持单双栏布局切换、基础字号（13/14/15px）、行高段距及多种二级标题下划线风格定制。

### 7. 💾 多档案草稿矩阵 (Profile Matrix) 与差异对比
*   **一职一简历**：快速克隆创建特定岗位版本（如 `前端开发版`、`全栈工程师版`）。
*   **Diff 差异对比**：提供左右侧两版本模块级差异对比面板，清晰高亮文本修改与关键字调整。

### 8. 🔒 专属 H5 外链分享与独立访问密码锁
*   **加密分享**：一键生成加密压缩的 H5 分享链接，可设置访问密码保护隐私；提供 HR 扫码预览专用高清二维码。

### 9. 📐 板块位置极速排序 (Section Sorter)
*   **模块重排**：自动识别 Markdown 中的二级标题板块，支持拖拽或一键上下平移整个章节，无须手动繁琐剪切粘贴。

### 10. 🌙 深色模式与 A4 纸张隔离
*   **视觉舒适**：全站配备低疲劳深色模式，同时建立简历画布与导出 PDF 的样式强隔离机制，确保深色模式下预览纸张始终保持清晰白底黑字。

### 11. 🌐 全局中英双语国际化 (Bilingual Localization)
*   **极速切换**：一键无缝切换中文（zh）与英文（en），不仅界面文案，内置简历模版与诊断提示亦全面中英适配。

### 12. ⚡ PWA 离线运行与本地存储
*   **隐私安全**：支持安装至桌面与移动端，所有数据纯前端存储于本地 IndexedDB / LocalStorage，不设中央数据收集服务器，100% 保护个人隐私。

---

## 🛠️ 技术栈与架构

*   **前端框架**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) + [TypeScript 7](https://www.typescriptlang.org/)
*   **样式系统**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **状态管理**: [Zustand 5](https://github.com/pmndrs/zustand)
*   **动效引擎**: [Framer Motion / Motion 12](https://github.com/framer/motion)
*   **Markdown 解析**: `react-markdown` + `remark-gfm`
*   **PDF 导出引擎**: `jspdf` + `html2canvas-pro` + 原生矢量 Print 驱动
*   **图标库**: [Lucide React](https://lucide.dev/)

---

## 🚀 快速启动指南

### 1. 克隆仓库
```bash
git clone https://github.com/kunlong-luo/markdown-resume-builder.git
cd markdown-resume-builder
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 启动开发服务器
```bash
pnpm dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始使用！

### 4. 运行单元测试
```bash
pnpm test
```

---

## 📈 高清 PDF 导出建议

Resume Craft 提供矢量直接打印与高清 Canvas 渲染双模式导出：
1. 撰写过程中可开启 **“A4 辅助线”** 确认页面边界。
2. 内容若有少许超页，点击顶部工具栏 **“一键压缩贴合”** 按钮即可自动收纳至 1 页。
3. 点击 **“导出 PDF”**，在系统打印窗口中：
   *   **目标打印机**：选择 `另存为 PDF` (Save as PDF)
   *   **纸张大小**：选择 `A4`
   *   **边距**：选择 `无` (None)
   *   **选项**：勾选 `背景图形` (Background graphics)
   *   **页眉和页脚**：取消勾选

---

## 📄 开源许可证

本项目采用 [MIT License](LICENSE) 开源许可证。您可以自由地在个人、企业或商业项目中修改和使用。

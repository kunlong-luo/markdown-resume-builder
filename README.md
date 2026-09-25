# 🚀 Resume Craft · 简匠简历 Pro (v2.0.0)

[English](./README.en.md) | 简体中文

[![Version](https://img.shields.io/badge/version-v2.0.0--PRO-blue?style=flat-square&logo=github)](https://github.com/kunlong-luo/resume-craft)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-%E5%9C%A8%E7%BA%BF%E4%BD%93%E9%AA%8C-4F46E5?style=flat-square&logo=github)](https://kunlong-luo.github.io/resume-craft/)
[![CI](https://github.com/kunlong-luo/resume-craft/actions/workflows/ci.yml/badge.svg)](https://github.com/kunlong-luo/resume-craft/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/built%20with-React%2019-blueviolet?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/bundler-Vite%208-646CFF?style=flat-square&logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/styling-Tailwind%20v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

> **Resume Craft (简匠简历)** 是一款专为求职者打造的高颜值、双向同步、完美 A4 控页的在线 Markdown 简历编辑器。
> 
> 🌐 **在线体验地址**：[https://kunlong-luo.github.io/resume-craft/](https://kunlong-luo.github.io/resume-craft/)
> 
> 💡 **核心口号**：*“用 Markdown 匠造完美的一页纸简历 | Craft your perfect one-page resume with Markdown.”*
> 
> 它融合了 Markdown 的极客书写效率与可视化表单的易用性，支持中英双语，提供强大的 ATS 智能诊断、一键压缩贴合（1-Click Auto Fit）、自动中英空格微调、行业专属色盘、多档案草稿矩阵与 H5 密保分享，助你告别排版地狱，秒出大厂级气质的高清简历。

---

## 💡 为什么选择 Resume Craft？

在传统的简历制作中，求职者常常面临 **Word 对齐地狱**、**PDF 导出乱码错位**、**“1.1 页”尴尬尴尬超页** 以及 **跨设备字体变形** 等痛点。Resume Craft 针对这些问题构建了一整套极客级解决方案：

```
+-----------------------------------------------------------------------------------+
|                                  RESUME CRAFT                                     |
|                                                                                   |
|  [ 可视化结构表单 ] <==========( 实时双向 AST 引擎 )==========> [ Markdown 源码 ]    |
|          |                                                             |          |
|          +---------------------> [ A4 画布渲染底座 ] <-----------------+          |
|                                         |                                         |
|    +------------------------------------+-----------------------------------+    |
|    |                                    |                                   |    |
| [ 1-Click 智能压缩贴合 ]    [ 高保真系统字体降级 Stack ]      [ ATS 岗位词库诊断匹配 ]|
|    |                                    |                                   |    |
|    +------------------------------------+-----------------------------------+    |
|                                         |                                         |
|                   +---------------------+---------------------+                   |
|                   |                                           |                   |
|         [ 矢量 PDF / 高清 Canvas ]                   [ 加密 H5 分享 / QR 码 ]       |
+-----------------------------------------------------------------------------------+
```

---

## 🌟 核心杀手级特性

### 1. 🔄 可视化表单 & Markdown 双向同步引擎
* **双域联动**：无论是在左侧「结构化表单」修改姓名职位，还是在「Markdown 源码」编辑项目细节，简历画布均在 **<16ms 毫秒级** 内完成实时重绘。
* **拖拽重排**：表单组件内置 Grip 抓手，鼠标拖拽即可秒级调整项目经历或技能板块排序，Markdown 源码与预览图同步完成文本段落重组。

### 2. ⚡ 顶栏「一键压缩贴合」（1-Click Auto Fit）与 A4 控页
* **消除溢出**：拒绝“1.1 页”尴尬断层！闪电按钮自动级联微调页边距（Margin）、字体行高（Line Height）与段落间距（Spacing），将溢出内容平滑贴合至整齐 1 页纸内。
* **物理辅助刻度**：提供 A4 标准尺寸边界线与物理折页指示线，直观掌控纸张空间。

### 3. ✨ 杂乱纯文本智能导入（Smart Raw Text Importer）
* **一键识别**：直接粘贴来自招聘网站（BOSS/猎聘）、旧 Word 或 PDF 的杂乱纯文本，本地轻量算法自动识别姓名、联系方式、工作经历与技能模块并规整为标准 Markdown。

### 4. 🎯 ATS 岗位匹配与智能诊断系统
* **JD 契合度匹配**：粘贴目标岗位 Job Description，算法智能对比核心匹配度关键词，突出显示核心技能短板。
* **排版与合规自检**：实时扫描联系方式遗漏、多段经历时间重叠冲突及技术词汇规范大小写（如将 `react` / `node` 建议修正为 `React` / `Node.js`）。

### 5. ✍️ 一键中英排版空格优化 (Bilingual Spacing)
* **排版美学**：依据中文排版规范，一键自动在中文与英文、数字之间插入美学空格（如 `熟练使用React开发` ➔ `熟练使用 React 开发`），大幅增加文本呼吸感。

### 6. 🎨 行业专属主题色盘与模版定制
* **多维排版**：内置科技靛蓝、金融墨绿、极客深黑等行业色盘；支持单双栏布局切换、基础字号（13/14/15px）、行高段距及多种二级标题下划线风格定制。

### 7. 🔤 高保真系统字体栈与 A4 物理比例对齐 (High-Precision Font & Scale)
* **跨端零误差**：彻底消除外部 Web 字体加载超时带来的排版错乱，内置包含 PingFang SC、Microsoft YaHei 与 Source Han Sans 的高精度系统降级字体链；配置 1:1 A4 物理画布（`794px × 1123px`）与自适应视口缩放引擎，确保编辑预览、H5 外链分享与 PDF 导出排版、字号、换行折点 100% 精确重合。

### 8. 💾 多档案草稿矩阵 (Profile Matrix) 与差异对比
* **一职一简历**：快速克隆创建特定岗位版本（如 `前端开发版`、`全栈工程师版`）。
* **Diff 差异对比**：提供左右侧两版本模块级差异对比面板，清晰高亮文本修改与关键字调整。

### 9. 🔒 专属 H5 外链分享与独立访问密码锁
* **加密分享**：使用 LZ-String 压缩算法与 Web Crypto SHA-256 加密生成 H5 分享链接，可设置访问密码保护隐私；提供 HR 扫码预览专用高清二维码。

### 10. 📐 板块位置极速排序 (Section Sorter)
* **模块重排**：自动识别 Markdown 中的二级标题板块，支持拖拽或一键上下平移整个章节，无须手动繁琐剪切粘贴。

### 11. 🌙 深色模式与 A4 纸张隔离
* **视觉舒适**：全站配备低疲劳深色模式，同时建立简历画布与导出 PDF 的样式强隔离机制，确保深色模式下预览纸张始终保持清晰白底黑字。

### 12. 🌐 全局中英双语国际化 (Bilingual Localization)
* **极速切换**：一键无缝切换中文（zh）与英文（en），不仅界面文案，内置简历模版与诊断提示亦全面中英适配。

### 13. ⚡ PWA 离线运行与 100% 本地隐私保护
* **隐私安全**：支持安装至桌面与移动端，所有数据纯前端存储于本地 IndexedDB / LocalStorage，不设中央数据收集服务器，100% 保护个人隐私。

---

## 📂 源码目录结构

```
.
├── .github/
│   ├── dependabot.yml           # Dependabot 依赖每周自动巡检
│   └── workflows/
│       ├── ci.yml               # GitHub Actions CI 检查与测试
│       ├── deploy.yml           # main 分支自动部署 GitHub Pages
│       ├── release.yml          # Tag 触发自动打包与 GitHub Release
│       ├── seo-submit.yml       # 部署成功后可选提交 IndexNow
│       └── promote.yml          # 新内容跨平台推广（默认 dry-run）
├── src/
│   ├── assets/                  # 静态资源与矢量图形
│   ├── components/              # UI 组件分层架构
│   │   ├── form/                # 可视化简历结构表单
│   │   ├── layout/              # 顶栏、侧边栏与分栏容器
│   │   ├── modals/              # ATS 诊断、密码锁、草稿对比弹窗
│   │   ├── preview/             # A4 画布渲染器与 ZoomControls
│   │   ├── share/               # H5 外链分享访问端组件
│   │   └── toolbar/             # 快捷工具栏与 AutoFit 按钮
│   ├── context/                 # 全局 Context 与 Provider
│   ├── data/                    # 示例模板与中文/英文初始简历
│   ├── hooks/                   # 自定义 React Hooks (A4测量, 快捷键)
│   ├── i18n/                    # 中英双语国际化词条
│   ├── lib/                     # 核心算法 (AST解析, 贴合算法, 加密)
│   ├── store/                   # Zustand 全局响应式状态管理
│   ├── types.ts                 # TypeScript 强类型定义
│   ├── index.css                # Tailwind CSS v4 & 全局 CSS 变量
│   └── main.tsx                 # 应用入口点
├── index.html                   # HTML 模板入口
├── package.json                 # 依赖配置与运行脚本
├── vite.config.ts               # Vite 8 打包构建配置
└── README.md                    # 项目说明文档
```

---

## 🛠️ 技术栈与依赖库

| 领域 | 技术方案 | 优势 / 说明 |
| :--- | :--- | :--- |
| **前端框架** | [React 19](https://react.dev/) + [TypeScript 7](https://www.typescriptlang.org/) | 极致性能与强类型安全 |
| **构建工具** | [Vite 8](https://vite.dev/) | 毫秒级 HMR 与极速生产打包 |
| **样式引擎** | [Tailwind CSS v4](https://tailwindcss.com/) | 新一代 CSS 变量与极简原子化样式 |
| **状态管理** | [Zustand 5](https://github.com/pmndrs/zustand) | 轻量响应式状态，支持 LocalStorage 持久化 |
| **动效系统** | [Motion 13](https://github.com/framer/motion) | 流畅弹窗、拖拽重排与平滑展开动画 |
| **Markdown** | `react-markdown` + `remark-gfm` | 标准 GFM 语法高能解析 |
| **PDF 导出** | 原生 Print 驱动 + `html2canvas-pro` + `jspdf` | 矢量清晰打印与 Canvas 双保险导出 |
| **图标库** | [Lucide React](https://lucide.dev/) | 矢量现代线条图标 |

---

## 🚀 开发者快速启动指南

### 1. 克隆项目
```bash
git clone https://github.com/kunlong-luo/resume-craft.git
cd resume-craft
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 启动开发服务器
```bash
pnpm dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始开发调试。

### 4. 运行工程脚本

| 脚本命令 | 说明 |
| :--- | :--- |
| `pnpm dev` | 启动 Vite 开发服务器（Port: 3000） |
| `pnpm build` | 构建生产环境产物（dist 目录） |
| `pnpm lint` | 运行 TypeScript 全量静态类型检查 |
| `pnpm test` | 执行 Vitest 自动化单元测试 |
| `pnpm preview` | 预览本地生产打包结果 |

---

## 📈 高清无错位 PDF 导出配置指南

Resume Craft 支持 **原生矢量打印** 与 **高清 Canvas 渲染** 双模式导出。为了确保导出 PDF 零断层、无乱码：

1. **启用辅助网格**：撰写过程中可开启顶部工具栏 **“A4 辅助线”** 确认内容是否超页。
2. **一键压缩贴合**：如果内容稍有溢出（例如超出 2-3 行），点击顶部 **“一键压缩贴合”** 按钮。
3. **系统打印窗口配置（Chrome / Edge / Safari）**：
   * **目标打印机**：选择 `另存为 PDF` (Save as PDF)
   * **纸张大小**：选择 `A4`
   * **边距**：选择 **`无` (None)** （*非常重要！*）
   * **选项**：勾选 **`背景图形` (Background graphics)**
   * **页眉和页脚**：**取消勾选**

---

## ❓ 常见问题 FAQ

<details>
<summary><b>Q1: 我的个人简历数据会被上传到后端服务器吗？</b></summary>
<b>答：</b>绝对不会。Resume Craft 是一个 100% 纯前端架构的离线应用，所有草稿、个人数据均直接加密存储在您本地浏览器的 IndexedDB 和 LocalStorage 中。
</details>

<details>
<summary><b>Q2: 生成的 H5 密保分享链接安全性如何？</b></summary>
<b>答：</b>分享链接使用了 LZ-String 紧凑压缩算法，将简历数据编码在哈希片段中；若设置了密码，内容会通过 Web Crypto API (SHA-256) 在本地加密后再打包，未经授权无法解密读取。
</details>

<details>
<summary><b>Q3: 为什么发布或换电脑后字体依然能保持完全一致？</b></summary>
<b>答：</b>我们在项目中内置了跨平台的“高保真系统降级字体链”，并使用 1:1 A4 物理像素基准（794px × 1123px）配合 `transform: scale()` 视口适配，确保任何屏幕与操作系统下渲染结果高度一致。
</details>

---

## 🤝 参与贡献与社区

欢迎提交 Bug、功能建议和代码贡献。在开始之前，请先阅读：

- [贡献指南](CONTRIBUTING.md) — 开发环境、提交规范和 PR 流程
- [行为准则](CODE_OF_CONDUCT.md) — 社区协作规则
- [安全策略](SECURITY.md) — 漏洞请通过私密渠道报告，不要公开提交敏感细节
- [支持说明](SUPPORT.md) — Bug、功能建议和使用问题的处理方式

提交 Pull Request 前，请确保 `pnpm lint`、`pnpm test` 和 `pnpm build` 均通过。

---

## 📄 开源许可证

本项目采用 [MIT License](LICENSE) 开源许可证。您可以自由地在个人、团队或商业项目中修改和使用。

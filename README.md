# 📑 ResuCraft (Markdown Resume Builder Pro)

[English](./README.en.md) | 简体中文

[![Version](https://img.shields.io/badge/version-v1.4.0--PRO-blue?style=flat-square&logo=github)](https://github.com/kunlong-luo/markdown-resume-builder)
[![React](https://img.shields.io/badge/built%20with-React%2018-blueviolet?style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/bundler-Vite-646CFF?style=flat-square&logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/styling-Tailwind%20v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

> **ResuCraft (Markdown Resume Builder Pro)** 是一款专为求职者设计的高颜值、双向同步、完美 A4 控页的在线简历编辑器。它融合了 Markdown 的书写效率与可视化表单的易用性，支持中英双语，提供强大的智能自检、自动中英空格排版、专业主题色盘、多版本草稿等企业级功能，助你告别 Word 排版地狱，秒出行业顶级气质的专业简历。

---

## 🌟 核心杀手级特性

### 1. 🔄 可视化表单 & Markdown 双向同步引擎
*   **痛点**：传统 Markdown 编辑器需要求职者熟练掌握语法，且在微调多项经历（如调换项目顺序）时极其容易写错括号或遗漏标点导致排版崩溃。
*   **方案**：内置业界先进的**双向数据同步引擎**。你既可以在「Markdown 编辑模式」中自由飞洒，也可以一键切换至「可视化表单模式」进行结构化编辑。在表单中拖拽排序、增删经历或修改内容，Markdown 源码都会实时重绘；反之，在源码中修改任何字符，表单内容也会瞬时解析更新。

### 2. 📏 完美 A4 控页辅助线 & 打印折页指示
*   **痛点**：简历最忌讳“1.1页”或“1.2页”——溢出的几行白字不仅难看，更会在打印或导出时被无情裁剪。
*   **方案**：
    *   **A4 页面高度辅助线 (Page Boundary Line)**：在右侧预览区提供智能裁剪边界提示，精准模拟标准 A4 打印尺寸，并实时计算“当前内容占 X.X 页”。
    *   **折页指示线**：可开启折页辅助线，帮你合理规划内容分布，保障生成的 PDF 绝不出现单行空白溢出。

### 3. 🌐 全局中英双语国际化 (Bilingual)
*   **特性**：应用原生支持 **中文 (zh)** 与 **英文 (en)** 一键切换。切换语言后，不仅界面所有按钮和操作指南会全部汉化/英化，包括内置的简历模板、快捷输入框占位符、以及智能自检的诊断提示也会同步切换，极大地方便了外企求职与海外留学生群体。

### 4. 🔍 智能自检 & 简历文案自研诊断系统
*   **特性**：内置轻量级、高精度简历诊断工具，针对简历排版与内容进行静默实时扫描：
    *   **基础信息自检**：自动识别邮箱、电话、求职意向等关键联系方式是否缺失。
    *   **时间重叠预警**：精准识别多段教育经历、工作经历或项目经历在时间线上的重合冲突，避免逻辑漏洞。
    *   **技术词汇大小写纠正**：智能识别简历中的 IT 技术名词，提醒保持规范的大小写排版（如：自动提示将 `react` 改为 `React`，`typescript` 改为 `TypeScript`）。
    *   **评分自测**：根据内容完整度、排版规整度等维度进行实时打分，直观评估简历竞争力。

### 5. ✍️ 一键中英排版空格优化 (Typesetting Spacing Helper)
*   **痛点**：中文和英文、数字之间如果不加空格，挤在一起会显得极不专业，且手动修改极度耗时。
*   **方案**：基于排版美学指南，提供**一键中英文数字空格优化功能**。不论是在大纲栏还是在具体的段落文本编辑器中，点击 `中英排版` 按钮，系统将自动纠正排版细节（例如：`熟练使用React和TypeScript开发了3个项目` ➔ `熟练使用 React 和 TypeScript 开发了 3 个 项目`），让简历文本瞬间具备大厂官方文档般的极致呼吸感。

### 6. 🎨 精选行业专属主题色盘 & 细节精修
*   **特性**：
    *   **专业色盘**：精选 **科技靛蓝 (Indigo)**、**极客深黑 (Slate)**、**金融墨绿 (Emerald)**、**设计暖啡 (Amber)** 等多套专属色盘，一键渲染主标题、边框、项目符号，迎合不同岗位属性。
    *   **细节微调**：支持对字体大小、行高、页面页边距（紧凑/适中/宽松）以及顶部是否有彩色装饰条等进行像素级无代码调节。

### 7. 💾 多版本一职一简历矩阵 (Resume Matrix) & 一键对比
*   **特性**：内置多岗位/一职一简历版本矩阵。你可以随时基于当前简历，一键建立特定岗位版的分支文件夹（如 `前端开发版`、`全栈工程师版`），甚至提供**极速双版本模块级差异对比 (Diff Analysis)**。在对比面板中，左右两侧清晰高亮呈现两个版本大板块的文本、重点强调和关键字微调差异。

### 8. 🔒 专属 H5 外链分享与独立访问密码安全锁
*   **特性**：一键为特定版本的简历生成经压缩加密的专属在线 H5 分享外链。支持**独立访问密码保护**，输入正确密码才可解锁查看。同时提供“HR 扫码预览”专用高清二维码，方便手机端即时无损预览，或在 PC 端免登录一键直接打印/另存为完美 A4 高清 PDF。

### 9. 📐 简历板块位置一键极速排序 (Section Sorter)
*   **特性**：提供专门的「板块排序」工具面板，自动识别 Markdown 中的二级标题（如工作经历、教育背景、专业技能）。支持通过鼠标一键上下移动板块，垂直阅读排版顺序即时生效，瞬间重绘 Markdown 源码、可视化表单与 PDF 预览，极大地省去繁琐的手动剪切粘贴过程。

### 10. 🕸️ 12px 高精度排版网格辅助线 (Grid Lines)
*   **特性**：追求极致美感的求职者可一键开启「12px 黄金排版网格线」，预览区将布满半透明的对齐辅助微型网格。让你在微调字体大小、行高和间距时，能像专业平面设计师一样，精准掌控像素级的对齐和呼吸感。

### 11. 🔍 交互式缩放与窗口自适应 (Interactive Zoom & Fit)
*   **特性**：提供 `50% - 150%` 自由缩放预览滑块，并支持「Fit 自适应屏幕」功能。让你在各种宽度的显示器上都能以最舒服的视角掌控全局排版。

---

## 🛠️ 技术栈与架构

*   **核心框架**: [React 18](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **样式框架**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **动画过渡**: [Framer Motion / motion](https://github.com/framer/motion)
*   **Markdown 解析**: `react-markdown` + `remark-gfm` + 自定义组件重写
*   **图标库**: [Lucide React](https://lucide.dev/) (高颜图标)

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

---

## 📈 高清 PDF 完美导出指南

为了保证在最终导出的简历中获得一像素不差的完美高清 PDF，请按照以下步骤操作：
1. 撰写过程中，在控制台开启 **“A4 高度辅助线”** 和 **“折页指示线”**。
2. 确保简历内容高度刚好填满 1 页（或整页倍数），没有多余的空白溢出。
3. 点击页面右上角的 **“导出 PDF”**，系统将自动触发并优化浏览器的打印渲染。
4. **【打印面板关键设置】**：
   *   **目标打印机**：选择 `另存为 PDF` (Save as PDF)
   *   **纸张大小**：必须选择 `A4`
   *   **边距**：必须选择 `无` (None) 或是 `默认` (Default)
   *   **选项**：勾选 `背景图形` (Background graphics)（若不勾选，主题色彩和标签条将无法正常显示）
   *   **页眉和页脚**：取消勾选（否则会打印出网址和日期）

---

## 🤝 参与贡献

非常期待您的加入！无论是以提交反馈的形式（Issue），还是直接改进代码（Pull Request），我们都衷心感谢：
1. Fork 本仓库。
2. 创建您的分支 (`git checkout -b feature/AmazingFeature`)。
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)。
4. 推送到分支 (`git push origin feature/AmazingFeature`)。
5. 开启一个 Pull Request。

---

## 📄 开源许可证

本项目采用 [MIT License](LICENSE) 开源许可证。您可以自由地在个人、企业或商业项目中修改和使用。

---

⭐ **如果您觉得这个项目对您有所帮助，欢迎在 GitHub 上点个 Star！这是支持我们持续改进的最佳动力！**

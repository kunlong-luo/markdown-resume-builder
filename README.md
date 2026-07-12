# 📑 ResuCraft (Markdown Resume Builder Pro) 

[![Version](https://img.shields.io/badge/version-v1.3.0--PRO-blue?style=flat-square&logo=github)](https://github.com/)
[![React](https://img.shields.io/badge/built%20with-React%2018-blueviolet?style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/bundler-Vite-646CFF?style=flat-square&logo=vite)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/styling-Tailwind%20v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

> **ResuCraft (Markdown Resume Builder Pro)** 是一款专为求职者设计的高颜值、精细排版、完美 A4 控页的在线 Markdown 简历编辑器。告别传统 Word 排版地狱，告别普通 Markdown 简历单调黑白。通过强大的智能诊断、专业主题色盘、多版本草稿、以及精准 A4 分页裁剪指示，让你的简历一秒拥有顶级排版与行业专属气质。

---

## 🌟 核心杀手级特性 (Core Highlights)

### 1. 📏 A4 页面高度辅助线 (A4 Height Boundary Indicator)
*   **求职痛点**：写简历最忌讳“1.1页”或“1.2页”（多出几行空白溢出到下一页，打印或投递极其难看）。
*   **完美方案**：在右侧预览区提供一个智能控制开关，开启后会根据标准 A4 打印比例（垂直约 1120px）在预览区渲染一条优雅的**分页裁剪线 (Page Boundary Line)**，并在底部动态显示“当前内容占 X.X 页”。让你在撰写时一眼看出内容是否刚好塞满一整页，完美控页。
*   **精细控制**：支持动态计算不同字号、行距下的溢出状态，保障打印出来的 PDF 绝对不会出现空白次页。

### 2. 🎨 一键切换专业主题色盘 (A4 Accent Color Palette)
*   **求职痛点**：黑白简历略显单调，手动更改 Markdown 里的 HTML 样式或 CSS 变量太繁琐，耗时费力。
*   **完美方案**：提供一组精心调配的**行业专属色盘**。一键切换即可自动修改简历的主标题、二级标题底边线、项目小圆点、高亮标签等视觉颜色：
    *   💙 **科技靛蓝 (Indigo)** - 适配互联网、IT、AI 与算法工程师，凸显极客与前沿气质
    *   🖤 **极客深黑 (Slate)** - 适配系统架构师、数据库专家、科研人员，尽显沉稳专业
    *   💚 **金融墨绿 (Emerald)** - 适配投行、基金、财务、咨询顾问，体现高级与睿智
    *   🧡 **设计暖啡 (Amber)** - 适配 UI/UX 设计师、产品经理、运营，流露温暖与创意活力

### 3. 💾 多版本/多岗位草稿箱 (Multi-Version Drafts Hub)
*   **求职痛点**：面对不同公司或岗位（例如有些投“AI 后端”、有些投“全栈”、有些投“技术架构”），需要微调多套简历，手动在本地复制粘贴极易混乱和丢失。
*   **完美方案**：内置一个强大的**本地草稿箱**。你可以一键将当前版本保存为独立新草稿（如命名为：`AI后端版-2026` / `基础架构版`），支持在多套简历之间一键切换、即时对比、重命名、或是快速删除。所有数据安全保存在本地（Local Storage），断电断网都不怕。

### 4. 🔍 智能简历自检与 AI 文案助手 (Resume Quality Checker)
*   **求职痛点**：写完简历后经常存在低级漏洞（漏写邮箱电话、时间线重叠冲突、用词不够专业规范等）。
*   **完美方案**：左侧面板内置一个轻量级的**简历诊断面板**，自动静默扫描：
    *   **基础要素完整度**：检测电话、邮箱、求职意向是否缺失。
    *   **时间线重叠检测**：自动分析多段工作经历/项目经历是否有时间重叠冲突。
    *   **高频专业词汇建议**：识别简历中的技术名词并给出排版建议（如：保持大小写规范，如 `React` 而非 `react`）。
    *   **AI 润色助手**：集成 Google Gemini API，选中文本后支持利用大模型一键进行 **STAR 原则（情境-任务-行动-结果）** 规范化高含金量润色。

### 5. ⌨️ Markdown 快捷工具条 (Markdown Formatting Helper)
*   **求职痛点**：有时候记不清楚加粗（`**`）、斜体（`*`）、分隔线（`---`）或打印强制分页符的代码。
*   **完美方案**：在编辑器上方增加了高质感微型图标按钮，选中文字后点击即可一键套用格式，支持一键在光标处插入 **「打印强制分页符」** 与 **「STAR原则经典推荐模板」**，零基础也能快速写出骨架清晰的极客简历。

### 6. 🔍 实时预览缩放滑块 (Interactive Preview Zoom)
*   **核心特性**：右侧预览区内置了精致的 **Zoom 控制滑块**。支持 `50% - 150%` 自由缩放或 `自适应窗口大小 (Fit Window)`。对于多页简历或超长文档，可以轻松俯瞰整页布局，也可以放大校验每个文字细节。

---

## 🛠️ 技术栈与架构 (Tech Stack)

*   **核心框架**: [React 18](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/) (确保代码类型安全)
*   **样式库**: [Tailwind CSS v4](https://tailwindcss.com/) (极速开发、精细自定义)
*   **动画库**: [Framer Motion / motion](https://github.com/framer/motion) (丝滑、微交互过渡)
*   **Markdown 解析**: `react-markdown` + `remark-gfm` + 自定义渲染组件
*   **AI 接口**: `@google/genai` 接入 Google Gemini 3.5 智能模型
*   **图标库**: [Lucide React](https://lucide.dev/) (极简精致)

---

## 🚀 快速启动指南 (Getting Started)

要想在本地运行或部署此项目，只需简单的几步：

### 1. 克隆仓库
```bash
git clone https://github.com/your-username/resucraft.git
cd resucraft
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 配置环境变量
复制 `.env.example` 并命名为 `.env`，填入你的 Google Gemini API Key 以解锁 AI 润色助手：
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. 启动开发服务器
```bash
pnpm dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始创作你的完美简历！

---

## 📈 核心预览与打印指南 (Print Guide)

为保证简历的最佳打印效果：
1. 编写时，开启右侧的 **A4 高度辅助线** 开关，观察分页虚线。
2. 如内容稍有溢出，可微调字体大小、行距或外边距。
3. 点击右上角的 **“导出 PDF”**，系统会呼起浏览器的打印面板。
4. **【重要设置】**：在浏览器打印设置中，选择 **“另存为 PDF”**，纸张大小选择 **“A4”**，边距选择 **“无”** 或 **“默认”**，勾选 **“背景图形”**，即可获得无缝高清 PDF。

---

## 🤝 参与贡献 (Contributing)

我们非常欢迎你来提交 Issue 或是 Pull Request：
1. Fork 本仓库。
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)。
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)。
4. 推送到分支 (`git push origin feature/AmazingFeature`)。
5. 开启一个 Pull Request。

---

## 📄 开源许可证 (License)

本项目采用 [MIT License](LICENSE) 开源许可证。您可以自由使用、修改及商用。

---

⭐ **如果你觉得这个工具对你有帮助，不妨在 GitHub 上点个 Star！你的支持是我们持续优化的最大动力！**

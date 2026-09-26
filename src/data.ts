export const BLANK_MARKDOWN = '';

export const STARTER_MARKDOWN = `# 你的姓名

## 个人简介

在这里开始填写你的简历内容。

## 工作经历

- 添加你的工作经历、项目成果和关键数据。

## 教育背景

- 添加学校、专业与时间。
`;

export const STARTER_MARKDOWN_EN = `# Your Name

## Summary

Start writing your resume here.

## Experience

- Add your experience, projects, and measurable results.

## Education

- Add your school, degree, and dates.
`;

export const DEFAULT_MARKDOWN = `# 钟晨杰
AI后端开发工程师 ｜ 智能体网关架构 ｜ 分布式系统研发
139 0000 1111 · chenjie_zhong@fake-email.com · https://github.com/chenjie-ai-backend
7年工作经验 ｜ 本科 ｜ 29 ｜ 杭州 · 远程 ｜ 随时到岗

## 个人优势
- 7年高并发Java/Go后端开发与AI大模型应用工程化实战经验。作为核心架构师主导了从0到1的智能体高并发网关平台落地，具备海量并发、分布式缓存、消息队列流式处理的丰富实战经验。
- 深度掌握大模型工程化体系，精通Spring AI, LangChain, MCP (Model Context Protocol) 协议，设计并主导了多智能体（Multi-Agent）路由网关和向量数据库（Vector DB）混合检索系统的架构搭建。
- 具备优秀的系统架构决策与团队技术把关能力，精通Spring Cloud微服务集群、高吞吐Kafka、Netty网络编程、Docker/Kubernetes容器化云原生部署。

## 专业技能
- **后端架构：** Java, Spring Cloud, Spring Boot, Go, Netty, Redis, Kafka, PostgreSQL, K8s
- **AI大模型：** Spring AI, Model Context Protocol (MCP), Agentic Workflow, RAG, pgvector, DeepSeek, Qwen
- **中间件/网络：** Netty, Nginx, RabbitMQ, Elasticsearch, gRPC, Protobuf
- **工程工具：** Python, Docker, Git, Linux, Prometheus, Grafana

## 工作经历

### 北京星河智联科技有限公司　资深AI后端开发工程师　*2024.03 — 至今*
- 作为核心技术骨干主导新一代AI智能路由网关系统的架构设计与落地，针对多模型API高并发流式分发、请求排队、故障容灾三大核心痛点设计了分层弹性路由方案，承载日均千万级调用。
- 研发基于Model Context Protocol (MCP) 的企业级工具注册与智能调度中心，实现大模型动态感知并按需调用外部API，大幅降低工具调用时延并提升准确率至94%。
- 深度优化基于pgvector的向量检索与RAG知识库系统，采用HNSW多路召回与混合精排算法，将大模型上下文召回相关度提升25%，单次语义检索平均耗时低于80ms。
- 设计高并发「Reactive响应式分发 + Kafka流式解耦 + Redis热点缓存」架构，保障流式（SSE）文本输出的高吞吐与低抖动，峰值TPS达到5000+，核心服务可用率达99.99%。

### 深圳云翼未来科技有限公司　高级后端开发工程师　*2021.06 — 2024.02*
- 统筹并推进公司核心高并发数据处理平台的设计与敏捷开发迭代，成功接入全国3000+传感器节点，整体运行可用度达到99.9%。
- 独立完成基于Go与Netty的高性能协议网关，统一封装物联网私有二进制报文，攻克海量长连接下的心跳探活与连接复用难题，单机支持超10万个并发TCP长连接。
- 引入自动化CI/CD流程与Kubernetes服务网格，将新版本发布效率提升60%，并在生产环境中实现全生命周期自愈与故障秒级弹性伸缩。

### 杭州乾坤链动科技有限公司　后端研发工程师　*2018.08 — 2021.05*
- 负责微服务业务集群核心模块的重构与性能调优，运用多级缓存技术和SQL深度优化，将高频核心接口响应延迟压制在50ms以内。
- 参与高吞吐消息流转引擎建设，基于Kafka分区策略与多线程消费机制，彻底解决消息在峰值流量下的积压问题，单日处理数据量超亿条。

## 代表项目

### Ares 智能体（Agent）服务路由网关系统 ｜ 独立架构师与全栈设计人 ｜ *2025.02 — 至今*
- **技术选型：** Spring Cloud Alibaba, Spring AI, pgvector, Kafka, Redis, React
- **核心贡献：** 
  - 从零独立研发高并发、高可用的智能体编排与API路由系统，打通了上游智能体客户端与下游异构大模型推理引擎的多路安全流式分发。
  - 基于Netty开发高性能的SSE流式中继传输模块，解决长时间流式连接的内存泄露风险，并将首字延迟控制在350ms以内。
  - 运用pgvector存储海量提示词模板与历史记忆，实现了端到端的多轮对话RAG智能召回。

## 教育背景

### 浙江大学 ｜ 本科 ｜ 计算机科学与技术 ｜ *2014 — 2018*
- **在校表现**：GPA 3.82 / 4.0（专业前 5%），连续两年获得校优秀学生一等奖学金
- **主修课程**：高级数据结构、分布式系统原理、计算机网络、操作系统、编译原理、数据库系统实现
- **荣誉成就**：全国大学生数学建模大赛一等奖、ACM-ICPC 区域赛铜奖、省级优秀毕业生
`;

export interface ResumeTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
}

export const TEMPLATES: ResumeTemplate[] = [
  {
    id: 'ai_backend',
    name: 'AI后端工程师 (默认)',
    category: '研发开发',
    content: DEFAULT_MARKDOWN
  },
  {
    id: 'frontend',
    name: 'AI前端工程师',
    category: '研发开发',
    content: `# 林智远
AI前端工程师 ｜ React大模型应用架构 ｜ 全栈实战
13812345678 · zhiyuan_lin@163.com · https://github.com/linzy-ai-frontend
5年工作经验 ｜ 本科 ｜ 27 ｜ 杭州 · 上海 ｜ 随时到岗

## 个人优势
- 5年React/TypeScript深耕与AI Agent大模型全栈实战经验。擅长打造高度交互、性能卓越的Web应用，主导或深度参与了多个AI Native产品的研发与交付。
- 精通Next.js、Svelte及Vite工程化，具有深入的LLM/VLM前端工程化集成经验（包含WebRTC实时音频、流式Markdown渲染、Server-Sent Events）。
- 熟练运用LangChain.js, Vercel AI SDK, MCP，能够独立开发高度可定制的LLM对话助手、提示词调试台与Agent工作流编辑器。

## 专业技能
- **前端核心：** React, Next.js, Svelte, TypeScript, Tailwind CSS, Zustand, Redux
- **AI/LLM工具：** Vercel AI SDK, LangChain.js, Model Context Protocol (MCP), Hugging Face, WebSocket Audio
- **后端/全栈：** Node.js, NestJS, Python, FastAPI, PostgreSQL, Prisma, Docker, Serverless
- **工具链：** Webpack, Vite, Git, Cursor, Claude Code, Vercel

## 工作经历

### 字节跳动科技有限公司　高级前端开发工程师　*2024.03 — 至今*
- 主导新一代AI智能助手控制台的前端架构升级，基于Next.js App Router与Zustand重构对话内核，性能指标（FCP）提升35%，复杂大模型流式对话渲染不卡顿。
- 研发了基于Vercel AI SDK的可视化Agent工作流编辑器（采用React Flow），支持用户通过拖拽节点组装AI工作流，累计服务超10万名开发者用户，上线3个月实现月活翻番。
- 深度优化流式Markdown渲染及公式（KaTeX/MathJax）、图表（Mermaid）混合渲染器，在高吞吐输入下保持丝滑动画，滚动跟手度提升80%。

### 杭州悦客科技有限公司　全栈研发工程师　*2021.05 — 2024.02*
- 从0到1研发面向海外市场的AI写作助理(AI Copilot)，独立设计并开发了基于FastAPI和React的精简流式生成后端与编辑器前端，支持多文档联动。
- 引入WebSocket构建低延迟WebRTC实时语音交互模块，打通大模型音频合成端到端流式播放，延迟压缩至400ms以内，海外留存率（D7）提升15%。
- 主导接入Google GCP、OpenAI与Anthropic的多API容灾网关设计，前端自动感知延迟并动态切流，实现全年99.95%的高可用率。

## 代表项目

### FlexAgent - 开源大模型多Agent低代码编排系统 ｜ 独立作者与主导设计 ｜ *2025.01 — 至今*
- **技术选型：** Next.js, Tailwind CSS, Zustand, FastAPI, LangChain.js, PostgreSQL
- **核心贡献：**
  - 独立设计并开发的一款极简、高性能的Agent编排平台，支持导入任何标准的OpenAPI Spec作为MCP工具，可视化配置多Agent协同机制。
  - 采用Canvas双缓冲渲染技术重写连线渲染逻辑，支持1000+节点在同一画布顺畅缩放、拖拽与运行，实现毫秒级事件响应。
  - 完备设计了本地Sandbox机制，利用Web Assembly在沙箱内执行多源工具调用，并在前端实现控制台输出。

## 教育背景

### 浙江大学 ｜ 本科 ｜ 计算机科学与技术 ｜ *2016 — 2020*
- **在校表现**：GPA 3.85 / 4.0（专业前 5%），连续两年荣获校一等奖学金，校优秀毕业生
- **主修课程**：Web前端工程化、人机交互技术、高级数据结构与算法、计算机体系结构、软件工程
- **荣誉成就**：全国高校移动互联网应用开发大赛一等奖、全国大学生计算机设计大赛二等奖
`
  },
  {
    id: 'pm_lead',
    name: '技术产品经理 / 研发总监',
    category: '产品管理',
    content: `# 赵泽宇
研发总监 ｜ 资深技术产品经理 ｜ 高并发系统架构
13987654321 · zeyu_zhao@gmail.com · 微信：tech_lead_zhao
10年工作经验 ｜ 本科 ｜ 32 ｜ 深圳 / 远程 ｜ 在职-考虑机会

## 个人优势
- 10年互联网大厂与高成长独角兽实战经验，兼具「硬核技术背景」与「敏锐商业嗅觉」，精通高并发微服务、大数据与大模型赋能的技术型产品规划与落地。
- 擅长从战略规划到敏捷执行的端到端管理，累计主导交付多个千万级PV/日的核心基础平台项目；统筹过20+人的跨职能（产、研、测、运）团队。
- 精通以数据驱动为核心的产品方法论，擅长在复杂技术瓶颈中提炼产品破局方案，深度理解大型分布式系统与多租户SaaS商业化链路。

## 专业技能
- **产品规划：** 商业化蓝图、PRD编写、竞品分析、用户旅程图（CJM）、精益画布
- **技术领域：** Spring Cloud, Go Micro, Kafka, Kubernetes, Elasticsearch, 大模型RAG
- **团队管理：** 敏捷开发（Scrum）、OKR目标拆解、外包把关、团队梯队建设
- **辅助工具：** Axure, Figma, MindMaster, JIRA, Confluence

## 工作经历

### 腾讯科技（深圳）有限公司　资深技术产品经理 ｜ 架构师　*2021.06 — 至今*
- 主导腾讯云多租户API网关产品的升级换代，负责技术可行性评审与产品功能规划，引入自研限流与安全插件体系，产品线收入同比增长45%。
- 深入产研一线，重塑需求流水线与DevOps发布机制，使研发迭代版本周期从2周缩短至3天，需求按时交付率由72%跃升至95%。
- 牵头策划基于LLM大模型的全自动化API测试与故障诊断助手，覆盖了集团内部80%以上的典型业务，每月节约人工测试及运维成本近120万人民币。

### 北京微光互动科技有限公司　研发总监　*2016.03 — 2021.05*
- 统筹管理研发部、产品部、运维部共25人团队，负责核心SaaS客服平台的技术选型、架构重构及产品迭代决策。
- 主导核心业务数据库自研中间件升级，将数据处理吞吐量提升3.5倍，承载每日5000万级高并发写入，主库可用性提升至99.999%。
- 推动全平台微服务化改造并落地K8s容器化部署，单点部署故障数降低90%，整体云资源服务器成本削减32%。

## 代表项目

### 腾讯云多租户智能API网关商业化平台 ｜ 产品负责人兼首席架构顾问 ｜ *2022.03 — 2024.12*
- **技术选型：** Go, Envoy, Kubernetes, OpenResty, Prometheus, React
- **核心贡献：**
  - 规划并推动自研API网关全面商用，主导计费计量引擎、开发者门户与多租户权限控制体系的方案设计与上线。
  - 首创基于AI的流量异常自动侦测与限流降级策略，将大促期间的突发熔断恢复时间从分钟级压缩至秒级，支撑日均8亿次API调用无故障运行。

## 教育背景

### 华中科技大学 ｜ 本科 ｜ 软件工程 ｜ *2011 — 2015*
- **在校表现**：GPA 3.80 / 4.0，校三好学生标兵，连续三年获国家励志奖学金
- **主修课程**：软件项目管理、面向对象系统分析、分布式计算原理、数据库系统实现、计算机网络
- **荣誉成就**：全国软件专业人才设计与开发大赛华中赛区特等奖、校级优秀毕业设计
`
  },
  {
    id: 'operations',
    name: '产品运营 ｜ 用户增长专家',
    category: '产品运营',
    content: `# 李安琪
资深产品运营 ｜ 用户增长专家 ｜ 用户裂变与商业化实战
13812345678 · anqi_li@163.com · 微信：anqi_growth
6年工作经验 ｜ 本科 ｜ 28 ｜ 深圳 / 广州 ｜ 在职-随时到岗

## 个人优势
- **6年互联网产品运营与用户增长经验**，主导过多个千万级日活App的用户运营、活动策划与社群转化，精通裂变传播、留存优化及商业化变现。
- **数据驱动思维**，熟练掌握SQL、Python及神策数据系统，擅长通过A/B测试、漏斗模型与生命周期流失预警，提升用户生命周期价值（LTV）。
- **全栈项目统筹能力**，主导过从0到1社群裂变系统搭建，曾统筹10人跨职能敏捷团队，创造3个月实现注册用户增长300W+、ROI达3.5的优异业绩。

## 专业技能
- **增长模型：** AARRR漏斗模型、病毒裂变机制、RFM用户分群、精细化触达策略
- **数据分析：** SQL, Python, 神策数据 (Sensors Data), Tableau, Excel高级透视表, A/B测试
- **活动与内容：** 整合营销策划、裂变H5小游戏、KOL内容矩阵孵化、裂变文案撰写
- **项目协作：** 敏捷项目管理, Axure, 飞书项目, 竞品监控, 用户调研与深度访谈

## 工作经历

### 腾讯科技（深圳）有限公司　高级用户增长专家　*2022.06 — 2025.03*
- **用户裂变增长**：负责腾讯核心社交产品线的用户增长与商业化，设计「春节红包裂变」活动体系，实现日活（DAU）峰值提升 30%，新增裂变用户 500 万，活动 ROI 达 2.8。
- **流失用户召回**：基于用户画像与流失漏斗建立精细化推送模型，针对流失 30 天以上的沉默用户进行千人千面的分群召回，流失召回率提升 18%，单次召回成本降低 45%。
- **商业化转化率提升**：负责付费大会员的漏斗转化调优，设计新型权益卡包和组合销售方案，主导 A/B 试验调整购买入口布局，实现核心付费转化率提升 22%，LTV 提升 15%。

### 北京微光互动科技有限公司　产品运营经理　*2019.07 — 2022.05*
- **新用户转化**：负责内容社区App的拉新与首周留存。独立规划「新人7天打卡」成长任务体系，将次日留存率从 32% 提高至 48%，首周活跃度提升 35%。
- **高价值用户运营**：从0到1搭建社群核心KOL运营矩阵，招募并管理 200+ 核心创作者，自产优质内容占比超 40%，实现社区月均互动量增长 120%。
- **活动项目统筹**：策划「年度高光内容评选」活动，统筹产研、设计与社群等 8 人项目组在 3 周内完成全闭环，主导流量分发与外部品牌联合推广，新增注册用户 120 万。

## 代表项目

### 千万级日活社交裂变引擎搭建（主导运营） ｜ 增长运营组长 / 策划负责人 ｜ *2023.01 — 2023.12*
- **技术选型：** 神策数据, A/B Testing平台, 营销自动化引擎, 微信服务号生态
- **核心贡献：**
  - 设计「好友助力 + 能量币兑换」的复合裂变小游戏体系，打通社交传播链路。
  - 累计吸引 1500W+ 用户参与，次级裂变率达 1.65，获客成本（CAC）由 25 元锐降至 2.4 元，实现 0 预算下的爆发式用户增长。

### 内容社区付费转化率爆破项目（核心策划） ｜ 商业化运营核心策划 ｜ *2021.03 — 2021.09*
- **核心贡献：**
  - 通过在购买页增加「智能省钱计算器」及「限时权益倒计时」，提升决策效率。
  - 支付放弃率从 65% 下降到 38%，ARPU 提升 18%，项目首月即带来新增会员收入 420 万元。

## 教育背景

### 厦门大学 ｜ 本科 ｜ 广告学与市场营销 ｜ *2015 — 2019*
- **在校表现**：GPA 3.82 / 4.0（专业前 5%），连续两年获校一等奖学金，校优秀毕业生
- **主修课程**：消费者行为学、数字营销与数据挖掘、品牌传播策划、统计学与市场调研、广告文案写作
- **荣誉成就**：全国大学生广告艺术大赛（大广赛）国家级一等奖、挑战杯创业大赛省级银奖
`
  },
  {
    id: 'campus',
    name: '应届生求职 ｜ 校园研发方向',
    category: '应届生求职',
    content: `# 赵小萌
2026届应届毕业生 ｜ 计算机科学与技术专业 ｜ 前端开发方向
13812345678 · xiaomeng_zhao@163.com · https://github.com/xiaomeng-zhao
应届毕业生 ｜ 本科 ｜ 22 ｜ 杭州 · 上海 ｜ 在校生-寻实习

## 个人优势
- **扎实的前端基础与工程化底蕴**，精通 HTML5、CSS3、ES6+ 及 React / TypeScript 生态，熟悉 Webpack、Vite 构建工具和跨端适配。
- **大模型前端集成经验**，熟悉 OpenAI API、LangChain 以及 WebRTC 实时流式传输。曾参与多项高校 AI 实验室项目，主导开发了大模型可视化 Agent 画布及流式 Markdown 渲染组件。
- **优秀的主动学习与解决问题能力**，GitHub 拥有多个千星开源工具的贡献记录（PR），乐于探索新技术，通过英语六级（CET-6 612分）。

## 专业技能
- **核心基础：** HTML5, CSS3/Tailwind CSS, JavaScript (ES6+), TypeScript, 计算机网络, 数据结构
- **前端框架：** React 19, Next.js (App Router), Vue 3, Zustand, Redux Toolkit, Webpack/Vite
- **AI与流式：** Vercel AI SDK, LangChain.js, Server-Sent Events (SSE), WebRTC, WebSocket
- **开发工具：** Git, Linux, Docker, Postman, Figma, Chrome DevTools 深度性能调试

## 教育背景

### 浙江大学 ｜ 本科 ｜ 计算机科学与技术（工科试验班） ｜ *2022.09 — 2026.06*
- **在校表现**：GPA 3.88 / 4.0（全专业前 3%），连续三年荣获「国家奖学金」、「一等优秀学生奖学金」
- **主修课程**：数据结构与算法（96分）、操作系统（95分）、计算机网络（98分）、软件工程（94分）、编译原理（92分）
- **荣誉成就**：国家奖学金（教育部颁发，Top 0.2%）、全国大学生数学建模竞赛一等奖、浙江大学优秀共青团员

## 实习经历

### 阿里巴巴集团（淘天集团）　前端开发实习生　*2025.06 — 至今*
- **主导组件开发**：负责大促营销会场中高可用卡片组件的设计与封装，利用 React Concurrent Mode 与 CSS 硬件加速，提升开发流畅度，极端低配手机上的帧率由 35fps 稳定在 58fps。
- **性能埋点重构**：重构并精简了核心交易链路的性能埋点上报模块，结合 Web Worker 进行非阻塞日志处理，减少首屏 CPU 主线程占用时长 120ms。
- **开源工具维护**：参与淘天内部中后台低代码物料库的日常维护与更新，修复了 12 个历史遗留的 CSS 弹性盒兼容性 Bug，撰写了详细的使用指引手册。

## 代表项目

### 浙大 AI 智能体低代码工作流引擎（实验室项目） ｜ 前端核心研发与架构设计 ｜ *2024.09 — 2025.01*
- **技术选型：** Next.js, Tailwind CSS, Zustand, LangChain.js, React Flow
- **核心贡献：**
  - **架构设计**：采用 Zustand 进行全局拓扑图状态管理，解决双向节点状态冲突及跨节点通信难题。
  - **高吞吐流式优化**：针对大模型流式输出（SSE），设计了自定义的流式 Markdown 渲染器，支持即时公式和折线图显示。
  - **落地成果**：项目成功开发并接入实验室 6 个重点研究课题，获得了学院老师和评审专家的一致全优好评。

## 荣誉奖项
- **国家奖学金**（教育部颁发，Top 0.2%） ｜ *2024*
- **美国大学生数学建模竞赛 (MCM/ICM) 一等奖** ｜ *2024*
- **“互联网+”大学生创新创业大赛 省级金奖** ｜ *2023*
`
  },
  {
    id: 'english',
    name: 'English CV (Global Standard)',
    category: 'Overseas / Global',
    content: `# Alex Chen
Senior Full-Stack & AI Systems Architect | Distributed Cloud Systems
+1 (555) 234-5678 · alex.chen@fake-email.com · https://github.com/alex-chen-ai
7 Years Exp ｜ B.S. in CS ｜ 29 ｜ San Francisco, CA · Remote ｜ Immediate

## Summary
- 7+ years of engineering experience in high-concurrency distributed systems and AI Agent application architecture. Served as lead architect designing multi-model streaming gateways and resilient microservices handling tens of millions of daily API requests.
- Deep expertise in LLM system engineering, Model Context Protocol (MCP), Spring AI, and LangChain, spearheading hybrid RAG vector database (pgvector) retrieval pipelines and autonomous multi-agent routing frameworks.
- Strong technical leadership and full-stack ownership, proficient in Cloud-Native Kubernetes deployments, high-throughput Kafka streaming, Netty network programming, and modern React/TypeScript frontends.

## Skills
- **Core Languages:** Java, Go, TypeScript, Python, SQL, Rust
- **AI & LLM Stack:** Model Context Protocol (MCP), Spring AI, LangChain, RAG, pgvector, DeepSeek, OpenAI
- **Distributed Systems:** Spring Cloud, Netty, Redis, Apache Kafka, PostgreSQL, Docker, Kubernetes, gRPC
- **Engineering Tools:** Git, Linux, Prometheus, Grafana, CI/CD Pipelines, Vite, Next.js

## Work Experience

### Apex Nexus Technologies Inc.　Lead AI Systems Architect　*2024.03 — Present*
- Spearheaded the end-to-end architecture and rollout of a next-generation AI streaming gateway, implementing dynamic load routing, request queuing, and failover across multiple LLM clusters to support 15M+ daily requests.
- Developed an enterprise-grade Model Context Protocol (MCP) tool registry and intelligent scheduling center, enabling dynamic API discovery with 94% execution accuracy and a 40% reduction in tool calling latency.
- Optimized the pgvector-based RAG knowledge base using HNSW multi-route recall and hybrid reranking, boosting semantic recall precision by 25% with average p95 retrieval latency under 80ms.
- Architected a reactive SSE streaming distribution pipeline with Kafka asynchronous decoupling and Redis cache warming, achieving 5,000+ peak TPS with 99.99% service reliability.

### CloudWing Dynamics Inc.　Senior Backend Engineer　*2021.06 — 2024.02*
- Led technical execution for the company's real-time IoT data aggregation platform connecting 3,000+ distributed sensors with 99.9% uptime.
- Engineered a high-performance Go/Netty binary protocol gateway, resolving heartbeat keepalive bottlenecks and supporting 100,000+ concurrent long-lived TCP connections per instance.
- Championed automated CI/CD workflows and Kubernetes service mesh integration, improving deployment cadence by 60% with zero-downtime canary rollouts.

### Horizon ChainTech Corp.　Software Engineer　*2018.08 — 2021.05*
- Refactored core microservice business modules and optimized complex SQL queries, suppressing high-frequency endpoint latency below 50ms.
- Built a partitioned Kafka event processing engine with multi-threaded consumers, completely eliminating message queue buildup during peak traffic surges.

## Featured Projects

### Ares Multi-Agent Routing Gateway System　*2025.02 — Present*
- **Role & Scope:** Principal Architect & Full-Stack Developer
- **Tech Stack:** Spring Cloud, Spring AI, pgvector, Apache Kafka, Redis, React
- **Impact & Deliverables:**
  - Built an open-source, low-latency agent workflow router with dynamic memory isolation and secure multi-tenant streaming distribution.
  - Implemented SSE relay proxy in Netty, mitigating long-lived connection memory overhead and slashing first-token latency to under 350ms.
  - Integrated pgvector prompt template caching and conversational vector store for multi-turn RAG retrieval.

## Education

### Zhejiang University ｜ B.S. in Computer Science & Technology ｜ *2014.09 — 2018.06*
- **GPA / Performance**: GPA 3.82 / 4.0 (Top 5% in Major), First-Class Academic Scholarship
- **Core Courses**: Advanced Data Structures, Distributed Systems, Computer Networks, Operating Systems, Database Internals
- **Honors & Awards**: First Prize in National Mathematical Contest in Modeling, ACM-ICPC Regional Bronze Medal, Provincial Outstanding Graduate
`
  }
];

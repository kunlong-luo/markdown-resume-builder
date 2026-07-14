const COMMON_TECH_KEYWORDS = [
  'React', 'Vue', 'Angular', 'Next.js', 'Nuxt', 'Svelte', 'TypeScript', 'JavaScript', 'ES6', 'HTML5', 'CSS3', 'Sass', 'Less', 'Tailwind',
  'Node.js', 'Express', 'Koa', 'NestJS', 'Java', 'Spring', 'SpringBoot', 'SpringCloud', 'MyBatis', 'Hibernate', 'Go', 'Golang', 'Gin', 'Beego',
  'Fiber', 'Python', 'Django', 'Flask', 'FastAPI', 'C++', 'C#', 'Rust', 'Ruby', 'PHP', 'Laravel', 'Symphony', 'SQL', 'MySQL', 'PostgreSQL',
  'Oracle', 'Redis', 'Memcached', 'MongoDB', 'ElasticSearch', 'Kafka', 'RabbitMQ', 'ActiveMQ', 'Docker', 'Kubernetes', 'K8s', 'DevOps',
  'CI/CD', 'Jenkins', 'Git', 'GitHub', 'GitLab', 'SVN', 'Nginx', 'Apache', 'Tomcat', 'Webpack', 'Vite', 'Rollup', 'Gulp', 'Redux', 'Zustand',
  'MobX', 'Pinia', 'Vuex', 'GraphQL', 'RESTful', 'Microservices', 'SOA', 'Serverless', 'SaaS', 'PaaS', 'IaaS', 'AWS', 'Azure', 'GCP', 'Alibaba Cloud',
  'Tencent Cloud', 'Linux', 'Shell', 'CentOS', 'Ubuntu', 'Nacos', 'Eureka', 'ZooKeeper', 'Consul', 'Prometheus', 'Grafana', 'ELK', 'Hadoop',
  'Spark', 'Flink', 'Hive', 'HBase', 'TensorFlow', 'PyTorch', 'OpenCV', 'LLM', 'RAG', 'Agent', 'LangChain', 'LlamaIndex', 'Solr', 'Neo4j',
  'Pnpm', 'Yarn', 'Npm', 'Babel', 'Eslint', 'Prettier', 'Vitest', 'Jest', 'Cypress', 'Playwright', 'Swagger', 'Postman', 'OAuth', 'JWT',
  '高并发', '微服务', '分布式', '多线程', '并发编程', '性能优化', '调优', '架构设计', '缓存优化', '分库分表', '负载均衡', '服务治理', '容器化',
  '自动化测试', '单元测试', '集成测试', '代码重构', '需求分析', '敏捷开发', '项目管理', '团队协作', '技术选型', '数据库设计', '接口文档',
  '安全防范', '加密解密', '数据结构', '算法', '操作系统', '计算机网络', '编译原理'
];

export function extractKeywordsFromJd(jdText: string): string[] {
  if (!jdText) return [];
  
  const foundKeywords = new Set<string>();
  
  // 1. Check our dictionary (case insensitive for English)
  COMMON_TECH_KEYWORDS.forEach(kw => {
    const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let regex: RegExp;
    
    if (/^[a-zA-Z0-9_\+#\-]+$/.test(kw)) {
      regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    } else {
      regex = new RegExp(escaped, 'g');
    }
    
    if (regex.test(jdText)) {
      foundKeywords.add(kw);
    }
  });

  // 2. Extra English capitalized words from JD
  const candidateWords = jdText.match(/[A-Z][a-zA-Z0-9\+#\-]{1,15}/g) || [];
  const excludeWords = new Set(['The', 'And', 'For', 'With', 'From', 'This', 'That', 'These', 'Those', 'Have', 'Has', 'Been', 'Will', 'Would', 'Should', 'Could', 'They', 'Them', 'Their', 'Company', 'Role', 'Team', 'Job', 'Description', 'Candidate', 'Work', 'Experience', 'Years', 'Skills', 'Ability', 'About', 'We', 'Our', 'You', 'Your', 'Required', 'Preferred', 'Strong', 'Excellent', 'Good', 'Plus']);
  candidateWords.forEach(w => {
    if (!excludeWords.has(w) && !foundKeywords.has(w)) {
      foundKeywords.add(w);
    }
  });

  return Array.from(foundKeywords);
}

export function analyzeResumeMatch(markdown: string, jdKeywords: string[]) {
  if (!jdKeywords || jdKeywords.length === 0) {
    return { score: 0, matched: [], missing: [] };
  }

  const matched: string[] = [];
  const missing: string[] = [];
  const lowerResume = markdown.toLowerCase();

  jdKeywords.forEach(kw => {
    const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let regex: RegExp;
    if (/^[a-zA-Z0-9_\+#\-]+$/.test(kw)) {
      regex = new RegExp(`\\b${escaped}\\b`, 'i');
    } else {
      regex = new RegExp(escaped, 'i');
    }

    if (regex.test(lowerResume)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const score = Math.round((matched.length / jdKeywords.length) * 100);

  return {
    score,
    matched,
    missing
  };
}

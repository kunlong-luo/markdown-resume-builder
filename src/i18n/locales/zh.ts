export interface TranslationSchema {
  common: {
    confirm: string;
    cancel: string;
    close: string;
    save: string;
    delete: string;
    copy: string;
    copied: string;
    edit: string;
    reset: string;
    done: string;
    loading: string;
    success: string;
    error: string;
  };
  header: {
    title: string;
    subtitle: string;
    aiChecker: string;
    rawImporter: string;
    shareH5: string;
    backupHub: string;
    exportPdf: string;
    exportingPdf: string;
    legalHelp: string;
    themeToggleLight: string;
    themeToggleDark: string;
    langToggle: string;
  };
  toolbar: {
    visualMode: string;
    markdownMode: string;
    splitMode: string;
    previewMode: string;
    aesthetics: string;
    sectionSorter: string;
    autoFit: string;
    autoFitTooltip: string;
    typesettingSpace: string;
    typesettingSpaceTooltip: string;
    pageBreakLine: string;
    foldLine: string;
    gridLines: string;
    zoomIn: string;
    zoomOut: string;
    zoomReset: string;
    historyUndo: string;
    historyRedo: string;
    wordCount: string;
    charCount: string;
    lineCount: string;
  };
  aesthetics: {
    title: string;
    themeColor: string;
    customColor: string;
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    blockGap: string;
    margin: string;
    h2Style: string;
    topAccentLine: string;
    templateLayout: string;
    presets: {
      sans: string;
      serif: string;
      mono: string;
      standardFontSize: string;
      compactFontSize: string;
      spaciousFontSize: string;
      standardMargin: string;
      compactMargin: string;
      spaciousMargin: string;
      accentLineH2: string;
      bgBarH2: string;
      minimalH2: string;
      singleColumn: string;
      twoColumn: string;
    };
  };
  importer: {
    title: string;
    description: string;
    placeholder: string;
    importBtn: string;
    privacyNotice: string;
  };
  errorBoundary: {
    title: string;
    subtitle: string;
    backupCopy: string;
    backupCopied: string;
    reload: string;
    reset: string;
    confirmReset: string;
  };
}

export const zh: TranslationSchema = {
  common: {
    confirm: '确认',
    cancel: '取消',
    close: '关闭',
    save: '保存',
    delete: '删除',
    copy: '复制',
    copied: '已复制',
    edit: '编辑',
    reset: '重置',
    done: '完成',
    loading: '加载中...',
    success: '成功',
    error: '错误',
  },
  header: {
    title: 'ResuCraft 简历生成器',
    subtitle: 'Markdown 简历排版神器 Pro',
    aiChecker: '简历自检',
    rawImporter: '文本导入',
    shareH5: 'H5 分享',
    backupHub: '版本管理',
    exportPdf: '导出 PDF',
    exportingPdf: '生成 PDF 中...',
    legalHelp: '帮助与说明',
    themeToggleLight: '深色模式',
    themeToggleDark: '浅色模式',
    langToggle: 'Language',
  },
  toolbar: {
    visualMode: '可视化排版',
    markdownMode: 'Markdown 源码',
    splitMode: '双栏对照',
    previewMode: '纯净预览',
    aesthetics: '排版设置',
    sectionSorter: '模块排序',
    autoFit: '一键压缩贴合',
    autoFitTooltip: '自动微调间距与边距，收纳于 1 页内',
    typesettingSpace: '中英排版',
    typesettingSpaceTooltip: '自动在中文与英文、数字之间插入空格',
    pageBreakLine: 'A4 辅助线',
    foldLine: '折页指示线',
    gridLines: '12px 网格',
    zoomIn: '放大预览',
    zoomOut: '缩小预览',
    zoomReset: '自适应 100%',
    historyUndo: '撤销 (Ctrl+Z)',
    historyRedo: '重做 (Ctrl+Y)',
    wordCount: '词',
    charCount: '字符',
    lineCount: '行',
  },
  aesthetics: {
    title: '排版与视觉设置',
    themeColor: '主题色彩',
    customColor: '自定义 HEX 颜色',
    fontFamily: '字体系统',
    fontSize: '基础字号',
    lineHeight: '文本行高',
    blockGap: '段落间距',
    margin: '页面边距',
    h2Style: '二级标题样式',
    topAccentLine: '顶部装饰条',
    templateLayout: '页面版式布局',
    presets: {
      sans: '现代无衬线 (Inter / Noto)',
      serif: '经典衬线 (Georgia / 宋体)',
      mono: '极客等宽 (JetBrains Mono)',
      standardFontSize: '标准 (14px)',
      compactFontSize: '紧凑 (13px)',
      spaciousFontSize: '宽松 (15px)',
      standardMargin: '标准 (20mm)',
      compactMargin: '紧凑 (15mm)',
      spaciousMargin: '宽松 (25mm)',
      accentLineH2: '左侧主题下划线',
      bgBarH2: '主题色背景块',
      minimalH2: '极简纯文本加粗',
      singleColumn: '标准单栏',
      twoColumn: '双栏布局',
    }
  },
  importer: {
    title: '文本解析与导入',
    description: '粘贴旧简历或纯文本，自动清洗提取为规范 Markdown。',
    placeholder: '在此粘贴您的旧简历或纯文本...\n例如：张三 手机 13800138000 邮箱 zhangsan@example.com 5年前端经验...',
    importBtn: '开始提取解析',
    privacyNotice: '所有解析纯前端完成，隐私安全零泄露。',
  },
  errorBoundary: {
    title: '遇到未预期的运行时异常',
    subtitle: '应用已被安全屏障拦截，您的简历源码已被妥善保存在本地缓存中。',
    backupCopy: '一键备份简历源码',
    backupCopied: '已复制 Markdown 备份',
    reload: '刷新页面重试',
    reset: '重置所有本地数据并全新恢复',
    confirmReset: '确定要清空本地缓存并重置简历吗？建议先备份当前简历文本。',
  }
};

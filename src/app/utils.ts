import { PPTProject } from './types';

// 模拟本地存储
const STORAGE_KEY = 'ppt_projects';

export const storage = {
  getProjects: (): PPTProject[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getProject: (id: string): PPTProject | null => {
    const projects = storage.getProjects();
    return projects.find(p => p.id === id) || null;
  },

  saveProject: (project: PPTProject): void => {
    const projects = storage.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  },

  deleteProject: (id: string): void => {
    const projects = storage.getProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  },

  createProject: (name: string): PPTProject => {
    const project: PPTProject = {
      id: `project_${Date.now()}`,
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      slides: [],
      metadata: {},
      conversationHistory: [],
      status: 'conversation',
    };
    
    storage.saveProject(project);
    return project;
  },
};

// AI模拟响应生成器
export const aiSimulator = {
  generateResponse: async (message: string, dimension?: string, model?: string): Promise<string> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    // 根据不同维度生成不同回答
    if (dimension === 'objective') {
      return '好的，我了解了。您希望这份PPT用于【产品发布会】，目标是向潜在客户和合作伙伴展示新产品的核心功能和价值主张。\n\n接下来，让我们确定您的目标受众。请问主要听众是：\n1. 企业决策者（CEO、CTO等）\n2. 技术团队（开发者、架构师）\n3. 市场营销人员\n4. 投资人\n\n或者您可以直接描述您的目标受众特征？';
    }
    
    if (dimension === 'audience') {
      return '明白了，您的受众主要是【企业决策者和技术团队】。我会在内容设计上兼顾商业价值和技术深度。\n\n现在让我们规划PPT的内容结构。基于产品发布会的场景，我建议以下大纲：\n\n1. 封面页 - 产品名称与核心定位\n2. 问题背景 - 市场痛点分析\n3. 解决方案 - 产品核心功能\n4. 技术架构 - 系统特性与优势\n5. 应用案例 - 实际使用场景\n6. 商业价值 - ROI与效益分析\n7. 实施路线 - 部署与服务支持\n8. 结尾页 - 联系方式\n\n您觉得这个框架如何？需要调整或补充哪些部分吗？';
    }

    if (dimension === 'content') {
      return '太好了！内容框架已确认。现在让我们确定视觉风格。\n\n根据您的行业特性和受众特点，我推荐以下几种风格方向：\n\n**1. 科技商务风格**\n- 配色：深蓝+科技蓝+白色\n- 特点：专业、现代、可信赖\n- 适合：To B企业产品\n\n**2. 极简现代风格**\n- 配色：黑白灰+点缀色\n- 特点：简洁、高端、突出内容\n- 适合：创新型产品\n\n**3. 活力创新风格**\n- 配色：渐变色+亮色系\n- 特点：年轻、动感、创意\n- 适合：互联网产品\n\n您倾向于哪种风格？或者有其他品牌色要求吗？';
    }

    if (dimension === 'style') {
      return '完美！我会采用【科技商务风格】，使用#2563EB作为主色调，搭配思源黑体和Inter字体。\n\n最后一步，请确认输出格式需求：\n\n**标准格式**\n- 16:9 宽屏（推荐，适合现代投影）\n- 4:3 传统（兼容老式设备）\n\n**页数要求**\n- 根据刚才确定的大纲，预计生成8-12页\n\n**兼容性**\n- 支持 PowerPoint / WPS / Keynote\n- 纯前端模拟模式（演示用途）\n\n确认后，我将为您生成完整的PPT框架！';
    }

    // 默认通用回答
    return '我理解了您的需求。让我帮您梳理一下：\n\n' + message.substring(0, 50) + '...\n\n请继续详细描述，这样我能为您生成更精准的PPT内容。';
  },

  generateOutline: (metadata: any): any[] => {
    // 根据对话结果生成PPT大纲
    const objective = metadata.objective || '产品发布会';
    return [
      {
        id: 'outline_1',
        order: 0,
        title: objective,
        description: '封面页 - 展示主题和核心定位',
        layout: 'title',
      },
      {
        id: 'outline_2',
        order: 1,
        title: '市场背景与痛点',
        description: '分析当前市场存在的问题和挑战',
        layout: 'content',
      },
      {
        id: 'outline_3',
        order: 2,
        title: '核心解决方案',
        description: '介绍产品的核心功能和价值主张',
        layout: 'content',
      },
      {
        id: 'outline_4',
        order: 3,
        title: '技术架构与特性',
        description: '展示系统架构和技术优势',
        layout: 'two-column',
      },
      {
        id: 'outline_5',
        order: 4,
        title: '应用场景',
        description: '实际使用场景和案例展示',
        layout: 'content',
      },
      {
        id: 'outline_6',
        order: 5,
        title: '商业价值',
        description: 'ROI分析和效益评估',
        layout: 'content',
      },
      {
        id: 'outline_7',
        order: 6,
        title: '实施路线',
        description: '部署流程和服务支持',
        layout: 'content',
      },
      {
        id: 'outline_8',
        order: 7,
        title: '感谢观看',
        description: '结尾页 - 联系方式',
        layout: 'title',
      },
    ];
  },

  generateSlides: (metadata: any): any[] => {
    // 根据对话结果生成幻灯片
    return [
      {
        id: 'slide_1',
        order: 0,
        content: {
          layout: 'title',
          title: metadata.objective || '产品发布会',
          subtitle: metadata.audience || 'AI智能生成 · 企业级解决方案',
          backgroundColor: '#2563EB',
          textColor: '#FFFFFF',
        },
      },
      {
        id: 'slide_2',
        order: 1,
        content: {
          layout: 'content',
          title: '市场背景与痛点',
          bulletPoints: [
            '传统PPT制作耗时费力，平均需要4-6小时',
            '内容结构不清晰，难以有效传达核心信息',
            '视觉设计不专业，影响企业形象',
            '缺乏规范化模板，品牌一致性差',
          ],
        },
      },
      {
        id: 'slide_3',
        order: 2,
        content: {
          layout: 'content',
          title: '核心解决方案',
          bulletPoints: [
            'AI对话引导 - 5维结构化需求收集',
            '智能内容生成 - 自动生成符合逻辑的内容框架',
            '可视化编辑器 - 所见即所得的编辑体验',
            '企业级输出 - 符合商务规范的专业成果',
          ],
        },
      },
      {
        id: 'slide_4',
        order: 3,
        content: {
          layout: 'two-column',
          title: '技术架构与特性',
          content: '**前端技术栈**\n- React 18 + TypeScript\n- Tailwind CSS 设计系统\n- React Router 路由管理\n\n**核心功能模块**\n- 五维对话引擎\n- 实时预览系统\n- 多格式导出',
        },
      },
      {
        id: 'slide_5',
        order: 4,
        content: {
          layout: 'content',
          title: '应用场景',
          bulletPoints: [
            '产品发布会 - 快速制作专业发布PPT',
            '商务提案 - 结构化展示解决方案',
            '培训课件 - 教学内容标准化输出',
            '工作汇报 - 高效生成汇报材料',
          ],
        },
      },
      {
        id: 'slide_6',
        order: 5,
        content: {
          layout: 'content',
          title: '商业价值',
          bulletPoints: [
            '效率提升：制作时间从6小时缩短至30分钟',
            '质量保证：AI辅助确保内容逻辑和结构完整',
            '成本节约：减少外包设计成本80%',
            '品牌统一：企业模板规范化管理',
          ],
        },
      },
      {
        id: 'slide_7',
        order: 6,
        content: {
          layout: 'title',
          title: '感谢观看',
          subtitle: '让AI成为您的PPT制作助手',
          backgroundColor: '#1E40AF',
          textColor: '#FFFFFF',
        },
      },
    ];
  },
};
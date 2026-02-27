// 核心数据类型定义

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ConversationDimension {
  name: string;
  key: 'objective' | 'audience' | 'content' | 'style' | 'format';
  completed: boolean;
  data?: any;
}

export interface OutlineItem {
  id: string;
  order: number;
  title: string;
  description?: string;
  layout: 'title' | 'content' | 'two-column' | 'image-text' | 'blank';
}

export interface SlideContent {
  title?: string;
  subtitle?: string;
  content?: string;
  bulletPoints?: string[];
  imageUrl?: string;
  layout: 'title' | 'content' | 'two-column' | 'image-text' | 'blank';
  backgroundColor?: string;
  textColor?: string;
}

export interface Slide {
  id: string;
  order: number;
  content: SlideContent;
  thumbnail?: string;
}

export interface PPTProject {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  slides: Slide[];
  outline?: OutlineItem[];
  metadata: {
    objective?: string;
    audience?: string;
    contentLogic?: string;
    visualStyle?: string;
    outputFormat?: string;
  };
  conversationHistory: Message[];
  status: 'conversation' | 'outline' | 'editing' | 'completed';
}

export interface ExportOptions {
  format: 'pptx' | 'html' | 'pdf';
  theme?: string;
  includeNotes?: boolean;
}
export type Scope = 'corpus' | 'web-l1' | 'web-l2';
export type SidecarType = 'citations' | 'doc' | 'table' | 'chart' | 'audio' | 'map' | 'compare' | 'json';

export interface Citation {
  docId: string;
  title: string;
  page?: number;
  ts?: string;
  url?: string;
  quote?: string;
}

export interface AttachmentChart {
  type: 'chart';
  data: Array<{ name: string; value: number }>;
  title?: string;
  chartType?: 'line' | 'bar' | 'pie';
}

export interface AttachmentDoc {
  type: 'doc';
  kind: 'md' | 'pdf';
  url?: string;
  content?: string;
  title?: string;
}

export interface AttachmentTable {
  type: 'table';
  headers: string[];
  rows: string[][];
  title?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  text?: string;
  createdAt: number;
  citations?: Citation[];
  attachments?: (AttachmentChart | AttachmentDoc | AttachmentTable)[];
  metrics?: {
    latency_ms?: number;
    model?: string;
    verifier?: number;
  };
  isStreaming?: boolean;
}

export interface AgentConfig {
  id: string;
  name: string;
  domains: string[];
  knowledgeIds: string[];
  temperature: number;
  scope: Scope;
  citations: boolean;
  knowledgeLevel?: 'beginner' | 'basic' | 'intermediate' | 'advanced';
}

export interface Chat {
  id: string;
  title: string;
  projectId?: string;
  messages: Message[];
  agent: AgentConfig;
  updatedAt: number;
  pinned?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  chatIds: string[];
}

export interface SidecarPayload<T = any> {
  type: SidecarType;
  data: T;
  meta?: {
    title?: string;
    messageId?: string;
  };
}

export interface SidecarPlugin<T = any> {
  id: string;
  label: string;
  match: (p: SidecarPayload) => boolean;
  Render: React.FC<{ payload: SidecarPayload<T> }>;
}

export interface UiState {
  leftWidth: number;
  rightWidth: number;
  leftCollapsed: boolean;
  rightOpen: boolean;
  isMobile: boolean;
  leftDrawerOpen: boolean;
  rightDrawerOpen: boolean;
}
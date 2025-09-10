'use client';

import { Message, AgentConfig } from './types';
import { mockMessages } from './mock-data';

// Mock streaming API
export async function* streamChatResponse(message: string, config: AgentConfig): AsyncGenerator<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const responses = [
    "Đây là một câu hỏi rất hay về Phật học. ",
    "Theo lời dạy của các bậc Tổ sư, ",
    "chúng ta có thể hiểu rằng ",
    "tâm thức có nhiều tầng khác nhau. ",
    "\n\nTrong Duy thức học, ",
    "người ta phân chia tâm thức thành 8 thức: ",
    "nhãn thức, nhĩ thức, tỷ thức, thiệt thức, thân thức, ý thức, mạt na thức và a lại da thức. ",
    "\n\nMỗi thức có chức năng riêng ",
    "và cùng nhau tạo nên trải nghiệm hoàn chỉnh của con người."
  ];
  
  for (const chunk of responses) {
    await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 120));
    yield chunk;
  }
}

// Mock API endpoints
export const api = {
  sendMessage: async (message: string, config: AgentConfig): Promise<Message> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      text: 'Đây là câu trả lời mẫu từ hệ thống AI Phật giáo.',
      createdAt: Date.now(),
      citations: mockMessages[1].citations,
      attachments: mockMessages[1].attachments,
      metrics: {
        latency_ms: 1200,
        model: 'gpt-4o-mini',
        verifier: 95
      }
    };
  },

  getChats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockMessages;
  },

  getProjects: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [];
  }
};
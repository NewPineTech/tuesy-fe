import { Chat, Project, Message, Citation, AgentConfig } from './types';

export const mockCitations: Citation[] = [
  {
    docId: 'sutra_001',
    title: 'Kinh Kim Cương',
    page: 15,
    quote: 'Phàm sở hữu tướng, giai thị hư vọng...',
    url: '/docs/kim-cuong-kinh.pdf'
  },
  {
    docId: 'tuesy_lecture_042',
    title: 'Bài giảng của HT Tuệ Sỹ về Thiền học',
    ts: '00:15:30',
    quote: 'Thiền không phải là trạng thái vô tư...',
    url: '/audio/tuesy-thien-hoc-042.mp3'
  },
  {
    docId: 'vinaya_rules',
    title: 'Luật Tỳ Kheo',
    page: 78,
    quote: 'Tứ Ba La Di pháp...',
    url: '/docs/luat-ty-kheo.pdf'
  }
];

export const defaultAgent: AgentConfig = {
  id: 'tuesy_agent',
  name: 'Đại sư Tuệ Sỹ',
  domains: ['Phật học', 'Thiền', 'Triết học'],
  knowledgeIds: ['tuesy_corpus', 'buddhist_sutras', 'zen_teachings'],
  temperature: 0.7,
  scope: 'corpus',
  citations: true
};

export const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    text: 'Xin Thầy giải thích về ý nghĩa của "tâm bất sanh bất diệt" trong Phật học?',
    createdAt: Date.now() - 300000
  },
  {
    id: '2',
    role: 'assistant',
    text: 'Khái niệm "tâm bất sanh bất diệt" là một trong những giáo lý căn bản trong Phật học, đặc biệt trong Đại thừa Phật giáo. Theo lời dạy của các bậc Tổ sư, tâm thật sự của chúng ta - tức Phật tính - không có sanh diệt.\n\nĐây không có nghĩa là tâm của chúng ta bất động hay trơ lì, mà ngược lại, đó là bản chất linh động, tự nhiên của tâm thức. Như HT Tuệ Sỹ đã giảng: "Tâm không sanh không diệt, nhưng vẫn có thể khởi tác dụng, vẫn có thể cảm thông với mọi hiện tượng."',
    createdAt: Date.now() - 240000,
    citations: mockCitations.slice(0, 2),
    attachments: [
      {
        type: 'chart',
        data: [
          { name: 'Tâm ý thức', value: 30 },
          { name: 'Tâm A lại da', value: 70 },
          { name: 'Tâm Phật tính', value: 100 }
        ],
        title: 'Các tầng tâm thức trong Phật học'
      }
    ],
    metrics: {
      latency_ms: 1200,
      model: 'gpt-4o-mini',
      verifier: 95
    }
  },
  {
    id: '3',
    role: 'user',
    text: 'Thầy có thể cho con biết thêm về pháp môn Thiền không?',
    createdAt: Date.now() - 120000
  },
  {
    id: '4',
    role: 'assistant',
    text: 'Thiền là con đường tu tập trực tiếp, không dựa vào ngôn từ văn tự mà hướng thẳng đến bản tâm. Trong truyền thống Thiền tông Việt Nam, đặc biệt qua lời dạy của các bậc Thiền sư như Trúc Lâm Tam Tổ, Thiền được hiểu là "trực chỉ nhân tâm, kiến tánh thành Phật".\n\nThiền không phải là ngồi yên lặng để tâm trống không, mà là giữ tâm tỉnh thức trong mọi hoạt động hàng ngày. Khi ta thật sự hiểu được Thiền, ta sẽ thấy rằng "đi cũng Thiền, đứng cũng Thiền, nói cũng Thiền, im cũng Thiền".',
    createdAt: Date.now() - 60000,
    citations: mockCitations,
    attachments: [
      {
        type: 'doc',
        kind: 'md',
        title: 'Thiền môn nhật tụng',
        content: '# Thiền môn nhật tụng\n\n## Công phu sáng\n- Tọa thiền 30 phút\n- Tụng Tâm Kinh 3 biến\n\n## Công phu chiều\n- Hành thiền 20 phút\n- Quán tưởng Phật hiệu'
      },
      {
        type: 'table',
        headers: ['Pháp môn', 'Thời gian', 'Mục đích'],
        rows: [
          ['Tọa thiền', '30-60 phút', 'An tâm định tĩnh'],
          ['Hành thiền', '15-30 phút', 'Tu trong động'],
          ['Quán tưởng', '10-20 phút', 'Tập trung tâm niệm']
        ],
        title: 'Các pháp môn tu tập hàng ngày'
      }
    ],
    metrics: {
      latency_ms: 980,
      model: 'gpt-4o-mini',
      verifier: 98
    }
  }
];

export const mockChats: Chat[] = [
  {
    id: 'chat_001',
    title: 'Tâm bất sanh bất diệt',
    messages: mockMessages,
    agent: defaultAgent,
    updatedAt: Date.now() - 60000,
    pinned: true
  },
  {
    id: 'chat_002',
    title: 'Thiền và đời sống hàng ngày',
    messages: mockMessages.slice(0, 2),
    agent: defaultAgent,
    updatedAt: Date.now() - 3600000
  },
  {
    id: 'chat_003',
    title: 'Giới luật trong Phật giáo',
    messages: [mockMessages[0]],
    agent: defaultAgent,
    updatedAt: Date.now() - 7200000
  }
];

export const mockProjects: Project[] = [
  {
    id: 'project_001',
    name: 'Nghiên cứu Thiền học',
    description: 'Tập hợp các cuộc thảo luận về Thiền học theo HT Tuệ Sỹ',
    chatIds: ['chat_001', 'chat_002']
  },
  {
    id: 'project_002',
    name: 'Giới luật Phật giáo',
    description: 'Tìm hiểu về các quy tắc tu tập trong Phật giáo',
    chatIds: ['chat_003']
  }
];
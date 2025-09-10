'use client';

import { Button } from '@/components/ui/button';
import { 
  FileText, 
  HelpCircle, 
  Sparkles, 
  TrendingUp,
  MessageSquare
} from 'lucide-react';

interface QuickActionsProps {
  onAction: (prompt: string) => void;
  className?: string;
}

export function QuickActions({ onAction, className }: QuickActionsProps) {
  const actions = [
    {
      icon: FileText,
      label: 'Tóm tắt',
      prompt: 'Hãy tóm tắt nội dung trên một cách ngắn gọn và dễ hiểu.'
    },
    {
      icon: HelpCircle, 
      label: 'Giải thích đơn giản',
      prompt: 'Hãy giải thích nội dung trên một cách đơn giản, dễ hiểu hơn.'
    },
    {
      icon: TrendingUp,
      label: 'Giải thích chuyên sâu',
      prompt: 'Hãy giải thích nội dung trên một cách chuyên sâu và chi tiết hơn.'
    },
    {
      icon: MessageSquare,
      label: 'Hỏi thêm',
      prompt: 'Hãy đưa ra một câu hỏi tiếp theo liên quan đến nội dung trên.'
    }
  ];

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className || ''}`}>
      <span className="text-xs text-muted-foreground">Thao tác:</span>
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          size="sm"
          onClick={() => onAction(action.prompt)}
          className="h-6 px-2 text-xs border-zinc-600 hover:border-zinc-500 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-zinc-100 rounded-md"
        >
          <action.icon className="h-3 w-3 mr-1" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
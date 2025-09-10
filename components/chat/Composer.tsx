'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Send, 
  Settings,
  Sparkles,
  FileText,
  BarChart3,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgentConfig, Scope } from '@/lib/types';
import { defaultAgent } from '@/lib/mock-data';

interface ComposerProps {
  onSendMessage: (message: string, config: AgentConfig) => void;
  isStreaming?: boolean;
}

export function Composer({ onSendMessage, isStreaming = false }: ComposerProps) {
  const [message, setMessage] = useState('');
  const [agentConfig, setAgentConfig] = useState<AgentConfig>(defaultAgent);
  const [showConfig, setShowConfig] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isStreaming) {
      onSendMessage(message, agentConfig);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const quickActions = [
    { icon: FileText, label: 'Tóm tắt', prompt: 'Hãy tóm tắt nội dung này một cách ngắn gọn.' },
    { icon: HelpCircle, label: 'Giải thích đơn giản', prompt: 'Hãy giải thích điều này như dành cho học sinh.' },
    { icon: BarChart3, label: 'Tạo bảng/biểu đồ', prompt: 'Hãy tạo bảng hoặc biểu đồ để minh họa.' },
    { icon: Sparkles, label: 'Hỏi tiếp', prompt: 'Hãy đưa ra câu hỏi tiếp theo liên quan.' }
  ];

  const domains = ['Phật học', 'Thiền', 'Triết học', 'Tâm lý học', 'Giáo dục'];
  const knowledgeBases = [
    'Kinh điển Phật giáo',
    'Bài giảng HT Tuệ Sỹ',
    'Thiền học Việt Nam',
    'Triết học Đông phương'
  ];

  return (
    <div className="border-t border-border bg-background p-4">
      {/* Agent Configuration Summary */}
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="text-xs">
          {agentConfig.name}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          {agentConfig.scope === 'corpus' ? 'Chỉ cơ sở dữ liệu' : 
           agentConfig.scope === 'web-l1' ? 'Web cấp 1' : 'Web cấp 2'}
        </Badge>
        {agentConfig.citations && (
          <Badge variant="outline" className="text-xs">
            Có trích dẫn
          </Badge>
        )}
        <Badge variant="outline" className="text-xs">
          Nhiệt độ: {agentConfig.temperature}
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Thao tác nhanh:</span>
        {quickActions.map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            size="sm"
            className="h-7 px-2 gap-1"
            onClick={() => setMessage(action.prompt)}
          >
            <action.icon className="h-3 w-3" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* Main Composer */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi của bạn... (Ctrl+Enter để gửi)"
            className="min-h-[100px] pr-24 resize-none"
            disabled={isStreaming}
          />
          
          {/* Toolbar */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <Popover open={showConfig} onOpenChange={setShowConfig}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">Cấu hình Agent</h4>
                  
                  {/* Citations Toggle */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="citations" className="text-sm">
                      Hiển thị trích dẫn
                    </Label>
                    <Switch
                      id="citations"
                      checked={agentConfig.citations}
                      onCheckedChange={(checked) =>
                        setAgentConfig({ ...agentConfig, citations: checked })
                      }
                    />
                  </div>

                  {/* Scope Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm">Phạm vi tìm kiếm</Label>
                    <Select
                      value={agentConfig.scope}
                      onValueChange={(value: Scope) =>
                        setAgentConfig({ ...agentConfig, scope: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corpus">Chỉ cơ sở dữ liệu</SelectItem>
                        <SelectItem value="web-l1">Web cấp 1</SelectItem>
                        <SelectItem value="web-l2">Web cấp 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Temperature Slider */}
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Nhiệt độ: {agentConfig.temperature}
                    </Label>
                    <Slider
                      value={[agentConfig.temperature]}
                      onValueChange={([value]) =>
                        setAgentConfig({ ...agentConfig, temperature: value })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Reset Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAgentConfig(defaultAgent)}
                    className="w-full gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Đặt lại mặc định
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button
              type="submit"
              size="sm"
              className="h-8 px-3"
              disabled={!message.trim() || isStreaming}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Status */}
      {isStreaming && (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full" />
          Đang xử lý...
        </div>
      )}
    </div>
  );
}
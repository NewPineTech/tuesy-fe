'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AgentConfig } from '@/lib/types';

interface ChatControlsProps {
  agentConfig: AgentConfig;
  onConfigChange: (config: AgentConfig) => void;
}

export function ChatControls({ agentConfig, onConfigChange }: ChatControlsProps) {
  const knowledgeLevels = [
    { value: 'beginner', label: 'Đại chúng' },
    { value: 'basic', label: 'Sơ cơ' },
    { value: 'intermediate', label: 'Trung cấp' },
    { value: 'advanced', label: 'Cao cấp' }
  ];

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-t border-border/50 bg-background">
      {/* Knowledge level selector */}
      <Select
        value={agentConfig.knowledgeLevel || 'basic'}
        onValueChange={(value) => 
          onConfigChange({ ...agentConfig, knowledgeLevel: value as any })
        }
      >
        <SelectTrigger className="h-8 w-auto min-w-0 px-3 py-0 text-xs border border-zinc-700 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 rounded-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700">
          {knowledgeLevels.map((level) => (
            <SelectItem key={level.value} value={level.value} className="text-xs text-zinc-200 focus:bg-zinc-700">
              {level.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Citation toggle button */}
      <button
        type="button"
        onClick={() => onConfigChange({ ...agentConfig, citations: !agentConfig.citations })}
        className={`h-8 px-3 text-xs rounded-full border transition-all focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
          agentConfig.citations
            ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700'
            : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-750'
        }`}
      >
        Trích dẫn
      </button>
    </div>
  );
}
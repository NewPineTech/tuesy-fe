'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Folder, 
  Database, 
  Settings, 
  Plus, 
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Pin,
  Clock,
  PanelLeftClose,
  BookOpen,
  MoreHorizontal,
  User,
  Download,
  Phone,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { mockChats, mockProjects } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface LeftNavProps {
  collapsed: boolean;
  width: number;
  onToggleCollapse?: () => void;
}

export function LeftNav({ collapsed, width, onToggleCollapse }: LeftNavProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(['project_001']));
  const [userMenuExpanded, setUserMenuExpanded] = useState(false);

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const formatTime = (timestamp: number) => {
    try {
      return formatDistanceToNow(timestamp, { 
        addSuffix: true, 
        locale: vi 
      });
    } catch {
      return 'vừa xong';
    }
  };

  if (collapsed) {
    return (
      <div className="w-16 border-r border-border flex flex-col items-center py-4 gap-4" style={{ backgroundColor: '#1F1E1D' }}>
        <Button variant="ghost" size="icon" aria-label="Tạo cuộc trò chuyện mới">
          <Plus className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Tất cả cuộc trò chuyện">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Dự án">
          <Folder className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Dữ liệu">
          <Database className="h-5 w-5" />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" aria-label="Cài đặt">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="border-r border-border flex flex-col"
      style={{ width: `${width}px`, backgroundColor: '#1F1E1D' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        {/* Product title and collapse button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">ĐT</span>
            </div>
            <div>
              <h2 className="font-medium">Đạo Tràng Ảo</h2>
              <p className="text-xs text-muted-foreground">Thỉnh pháp cùng Hòa Thượng Tuệ Sỹ</p>
            </div>
          </div>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Trò chuyện mới */}
        <Button 
          className="w-full justify-start gap-2 h-11 mb-3"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          Trò chuyện mới
        </Button>
        
        {/* Tìm kiếm */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>

      {/* Content - Single scrollable area */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {/* Kiến thức Section */}
          <div className="space-y-1">
            <Separator />
            <h3 className="text-sm font-medium text-muted-foreground px-3 py-2">
              Kiến thức
            </h3>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11"
            >
              <BookOpen className="h-4 w-4" />
              Kinh điển Phật giáo
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11"
            >
              <Database className="h-4 w-4" />
              Bài giảng HT Tuệ Sỹ
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11"
            >
              <BookOpen className="h-4 w-4" />
              Thiền học Việt Nam
            </Button>
          </div>

          {/* Dự án Section */}
          <div className="space-y-1">
            <Separator />
            <h3 className="text-sm font-medium text-muted-foreground px-3 py-2">
              Dự án
            </h3>
            {mockProjects.map((project) => (
              <div key={project.id} className="space-y-1">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Folder className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {project.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ({project.chatIds.length} cuộc trò chuyện)
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
            
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-11 text-muted-foreground"
            >
              <Plus className="h-4 w-4" />
              Dự án mới
            </Button>
          </div>

          {/* Các cuộc trò chuyện Section */}
          <div className="space-y-1">
            <Separator />
            <h3 className="text-sm font-medium text-muted-foreground px-3 py-2">
              Các cuộc trò chuyện
            </h3>
            <div className="space-y-1">
              {mockChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {chat.title}
                      </span>
                      {chat.pinned && (
                        <Pin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTime(chat.updatedAt)}
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {chat.messages.length}
                      </Badge>
                    </div>
                    {chat.messages.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {chat.messages[chat.messages.length - 1].text?.slice(0, 80)}...
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer - User Menu Fixed at Bottom */}
      <div className="border-t border-border p-4">
        {/* Expandable Menu Options */}
        {userMenuExpanded && (
          <div className="space-y-2 mb-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11 text-muted-foreground"
            >
              <Download className="h-4 w-4" />
              Download mobile App
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11 text-muted-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11 text-muted-foreground"
            >
              <Phone className="h-4 w-4" />
              Contact us
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11 text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
            <Separator className="my-3" />
          </div>
        )}
        
        {/* User Profile - Always Visible */}
        <div 
          className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 cursor-pointer hover:bg-accent/50 transition-colors group"
          onClick={() => setUserMenuExpanded(!userMenuExpanded)}
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-medium">P</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">Phúc Lê Vũ</div>
            <div className="text-xs text-muted-foreground">Plus</div>
          </div>
          <div className="flex items-center">
            {userMenuExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
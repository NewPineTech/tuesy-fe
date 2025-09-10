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
  Pin,
  Clock
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
}

export function LeftNav({ collapsed, width }: LeftNavProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(['project_001']));

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
      <div className="w-16 bg-background border-r border-border flex flex-col items-center py-4 gap-4">
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
      className="bg-background border-r border-border flex flex-col"
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Button 
          className="w-full justify-start gap-2 h-10 mb-3"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          Tạo cuộc trò chuyện mới
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* All Chats Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              Tất cả cuộc trò chuyện
            </div>
            <div className="space-y-1 mt-2">
              {mockChats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors",
                    "hover:bg-accent/50"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium truncate">
                        {chat.title}
                      </span>
                      {chat.pinned && (
                        <Pin className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTime(chat.updatedAt)}
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        {chat.messages.length}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Projects Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground">
              <Folder className="h-4 w-4" />
              Dự án
            </div>
            <div className="space-y-1 mt-2">
              {mockProjects.map((project) => {
                const isExpanded = expandedProjects.has(project.id);
                const projectChats = mockChats.filter(chat => 
                  project.chatIds.includes(chat.id)
                );
                
                return (
                  <div key={project.id}>
                    <div
                      className={cn(
                        "group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors",
                        "hover:bg-accent/50"
                      )}
                      onClick={() => toggleProject(project.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">
                          {project.name}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {project.chatIds.length} cuộc trò chuyện
                        </div>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="ml-6 space-y-1">
                        {projectChats.map((chat) => (
                          <div
                            key={chat.id}
                            className={cn(
                              "flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-colors",
                              "hover:bg-accent/50"
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <span className="text-sm truncate">
                                {chat.title}
                              </span>
                              <div className="text-xs text-muted-foreground">
                                {formatTime(chat.updatedAt)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Additional Navigation Items */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              size="sm"
            >
              <Database className="h-4 w-4" />
              Dữ liệu & Kiến thức
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              size="sm"
            >
              <Settings className="h-4 w-4" />
              Cài đặt
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
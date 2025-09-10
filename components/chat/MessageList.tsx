'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Copy, 
  RotateCcw, 
  Pin, 
  ExternalLink, 
  FileText,
  BarChart3,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message, Citation } from '@/lib/types';
import { useUiStore } from '@/lib/state/useUiStore';
import { useSidecar } from '@/lib/state/useSidecar';
import { QuickActions } from './QuickActions';

interface MessageListProps {
  messages: Message[];
  onSendMessage?: (message: string) => void;
}

export function MessageList({ messages, onSendMessage }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setRightOpen } = useUiStore();
  const { isMobile, setRightDrawerOpen } = useUiStore();
  const { push: pushPayload } = useSidecar();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const openCitations = (message: Message) => {
    if (message.citations) {
      pushPayload({
        type: 'citations',
        data: message.citations,
        meta: {
          title: 'Nguồn trích dẫn',
          messageId: message.id
        }
      });
      if (isMobile) {
        setRightDrawerOpen(true);
      } else {
        setRightOpen(true);
      }
    }
  };

  const openAttachment = (message: Message, attachmentIndex: number) => {
    const attachment = message.attachments?.[attachmentIndex];
    if (attachment) {
      pushPayload({
        type: attachment.type as any,
        data: attachment,
        meta: {
          title: attachment.title || `${attachment.type} attachment`,
          messageId: message.id
        }
      });
      if (isMobile) {
        setRightDrawerOpen(true);
      } else {
        setRightOpen(true);
      }
    }
  };

  return (
    <ScrollArea className="flex-1" ref={scrollRef}>
      <div className="p-4 space-y-6">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "group relative",
              message.role === 'user' ? "ml-4 md:ml-8" : "mr-4 md:mr-8"
            )}
          >
            {/* Message Content */}
            <div
              className={cn(
                "rounded-2xl px-3 py-3 md:px-4 shadow-sm",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-card border border-border"
              )}
            >
              {/* Streaming indicator */}
              {message.isStreaming && (
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                  <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full" />
                  Đang phản hồi...
                </div>
              )}
              
              {/* Message Text */}
              {message.text && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {message.text.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0 text-sm md:text-base leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {/* Citations */}
              {message.citations && message.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openCitations(message)}
                    className="gap-2 text-xs h-8"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Xem {message.citations.length} nguồn trích dẫn</span>
                    <span className="sm:hidden">{message.citations.length} nguồn</span>
                  </Button>
                </div>
              )}

              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2">
                  <div className="flex flex-wrap gap-2">
                    {message.attachments.map((attachment, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => openAttachment(message, i)}
                        className="gap-2 text-xs h-8"
                      >
                        {attachment.type === 'chart' && <BarChart3 className="h-4 w-4" />}
                        {attachment.type === 'doc' && <FileText className="h-4 w-4" />}
                        {attachment.type === 'table' && <FileText className="h-4 w-4" />}
                        <span className="hidden sm:inline">{attachment.title || `Xem ${attachment.type}`}</span>
                        <span className="sm:hidden">{attachment.type}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Message Actions */}
            <div
              className={cn(
                "flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 md:transition-opacity",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                <Copy className="h-3 w-3" />
              </Button>
              {message.role === 'assistant' && (
                <>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    <Pin className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>

            {/* Metrics */}
            {message.metrics && (
              <div className="flex items-center gap-2 md:gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {message.metrics.latency_ms}ms
                </div>
                {message.metrics.model && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                    {message.metrics.model}
                  </Badge>
                )}
                {message.metrics.verifier && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                    <span className="hidden sm:inline">Độ tin cậy: </span>{message.metrics.verifier}%
                  </Badge>
                )}
              </div>
            )}

            {/* Quick Actions for completed assistant messages */}
            {message.role === 'assistant' && !message.isStreaming && onSendMessage && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <QuickActions 
                  onAction={onSendMessage}
                  className="justify-start"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
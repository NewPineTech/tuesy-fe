'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, PanelRight } from 'lucide-react';
import { ResizeHandle } from '@/components/layout/ResizeHandle';
import { LeftNav } from '@/components/layout/LeftNav';
import { MessageList } from '@/components/chat/MessageList';
import { Composer } from '@/components/chat/Composer';
import { Sidecar } from '@/components/sidecar/Sidecar';
import { useUiStore, COLLAPSED_LEFT_WIDTH } from '@/lib/state/useUiStore';
import { useHotkeys } from '@/lib/hooks/useHotkeys';
import { streamChatResponse } from '@/lib/api';
import { Message, AgentConfig } from '@/lib/types';
import { mockMessages } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const [isClient, setIsClient] = useState(false);
  const {
    leftWidth,
    rightWidth,
    leftCollapsed,
    rightOpen,
    isMobile,
    leftDrawerOpen,
    rightDrawerOpen,
    setLeftWidth,
    setRightWidth,
    setLeftCollapsed,
    setIsMobile,
    setLeftDrawerOpen,
    setRightDrawerOpen,
    resetWidths
  } = useUiStore();

  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isStreaming, setIsStreaming] = useState(false);

  useHotkeys();

  // Ensure client-side rendering only after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle responsive design
  useEffect(() => {
    function updateMobile() {
      const mobile = window.innerWidth < 1280;
      setIsMobile(mobile);
    }
    
    if (isClient) {
      updateMobile();
      window.addEventListener('resize', updateMobile);
      return () => window.removeEventListener('resize', updateMobile);
    }
  }, [setIsMobile, isClient]);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return null;
  }

  // Handle message sending with streaming
  const handleSendMessage = async (text: string, config: AgentConfig) => {
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      text,
      createdAt: Date.now()
    };

    const assistantMessage: Message = {
      id: `assistant_${Date.now()}`,
      role: 'assistant',
      text: '',
      createdAt: Date.now(),
      isStreaming: true
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsStreaming(true);

    try {
      let fullResponse = '';
      for await (const chunk of streamChatResponse(text, config)) {
        fullResponse += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, text: fullResponse }
              : msg
          )
        );
      }

      // Add citations and metrics after streaming completes
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { 
                ...msg, 
                isStreaming: false,
                citations: mockMessages[1].citations,
                attachments: mockMessages[3].attachments,
                metrics: {
                  latency_ms: 1200,
                  model: 'gpt-4o-mini',
                  verifier: 95
                }
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Streaming error:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { 
                ...msg, 
                text: 'Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn.',
                isStreaming: false
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  // Calculate layout dimensions
  const effectiveLeftWidth = leftCollapsed ? COLLAPSED_LEFT_WIDTH : leftWidth;
  const centerWidth = `calc(100% - ${effectiveLeftWidth}px - ${rightOpen ? rightWidth + 8 : 0}px)`;

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Sheet open={leftDrawerOpen} onOpenChange={setLeftDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <LeftNav collapsed={false} width={320} />
            </SheetContent>
          </Sheet>
          
          <h1 className="font-semibold">Đạo Tràng Ảo</h1>
          
          <Sheet open={rightDrawerOpen} onOpenChange={setRightDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <PanelRight className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-96 p-0">
              <Sidecar width={384} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Chat */}
        <div className="flex-1 flex flex-col min-h-0">
          <MessageList messages={messages} />
          <Composer onSendMessage={handleSendMessage} isStreaming={isStreaming} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Left Navigation */}
      <LeftNav collapsed={leftCollapsed} width={effectiveLeftWidth} />
      
      {/* Left Resize Handle */}
      {!leftCollapsed && (
        <ResizeHandle
          onResize={(delta) => setLeftWidth(leftWidth + delta)}
          onDoubleClick={resetWidths}
        />
      )}
      
      {/* Center Chat Area */}
      <div 
        className="flex flex-col min-h-0"
        style={{ width: centerWidth }}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            {leftCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLeftCollapsed(false)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="font-medium">Tâm bất sanh bất diệt</h1>
              <p className="text-sm text-muted-foreground">
                Với Đại sư Tuệ Sỹ • {isStreaming ? 'Đang phản hồi...' : 'Sẵn sàng'}
              </p>
            </div>
          </div>
          
          {!rightOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => useUiStore.getState().setRightOpen(true)}
            >
              <PanelRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Messages */}
        <MessageList messages={messages} />
        
        {/* Composer */}
        <Composer onSendMessage={handleSendMessage} isStreaming={isStreaming} />
      </div>
      
      {/* Right Resize Handle */}
      {rightOpen && (
        <ResizeHandle
          onResize={(delta) => setRightWidth(rightWidth - delta)}
          onDoubleClick={resetWidths}
        />
      )}
      
      {/* Right Sidecar */}
      {rightOpen && <Sidecar width={rightWidth} />}
    </div>
  );
}
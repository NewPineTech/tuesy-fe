'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, PanelRight } from 'lucide-react';
import { ResizeHandle } from '@/components/layout/ResizeHandle';
import { LeftNav } from '@/components/layout/LeftNav';
import { MessageList } from '@/components/chat/MessageList';
import { Composer } from '@/components/chat/Composer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { Sidecar } from '@/components/sidecar/Sidecar';
import { useUiStore, COLLAPSED_LEFT_WIDTH } from '@/lib/state/useUiStore';
import { useHotkeys } from '@/lib/hooks/useHotkeys';
import { streamChatResponse } from '@/lib/api';
import { Message, AgentConfig } from '@/lib/types';
import { mockMessages } from '@/lib/mock-data';
import { MobileVoiceComposer } from '@/components/mobile/MobileVoiceComposer';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { MobileSidecar } from '@/components/mobile/MobileSidecar';
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
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    id: 'tuesy_agent',
    name: 'Đại sư Tuệ Sỹ',
    domains: ['Phật học', 'Thiền', 'Triết học'],
    knowledgeIds: ['tuesy_corpus'],
    temperature: 0.7,
    scope: 'corpus',
    citations: true,
    knowledgeLevel: 'basic'
  });

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
  const handleSendMessage = async (text: string, config?: AgentConfig) => {
    const finalConfig = config || agentConfig;
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
      for await (const chunk of streamChatResponse(text, finalConfig)) {
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
        {/* Mobile Header - Improved */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <Sheet open={leftDrawerOpen} onOpenChange={setLeftDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm p-0">
              <MobileNavigation onClose={() => setLeftDrawerOpen(false)} />
            </SheetContent>
          </Sheet>
          
          <div className="flex-1 text-center">
            <h1 className="font-medium text-base">Đạo Tràng Ảo</h1>
            <p className="text-xs text-muted-foreground">
              {isStreaming ? 'Thầy đang phản hồi...' : 'Với Hòa Thượng Tuệ Sỹ'}
            </p>
          </div>
          
          <Sheet open={rightDrawerOpen} onOpenChange={setRightDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <PanelRight className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-md p-0">
              <MobileSidecar onClose={() => setRightDrawerOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Chat - Improved */}
        <div className="flex-1 flex flex-col min-h-0">
          <MessageList messages={messages} />
          <MobileVoiceComposer 
            onSendMessage={handleSendMessage} 
            isStreaming={isStreaming}
            agentConfig={mockMessages[0] ? {
              id: 'tuesy_agent',
              name: 'Đại sư Tuệ Sỹ',
              domains: ['Phật học', 'Thiền', 'Triết học'],
              knowledgeIds: ['tuesy_corpus'],
              temperature: 0.7,
              scope: 'corpus',
              citations: true
            } : {
              id: 'tuesy_agent',
              name: 'Đại sư Tuệ Sỹ',
              domains: ['Phật học'],
              knowledgeIds: ['tuesy_corpus'],
              temperature: 0.7,
              scope: 'corpus',
              citations: true
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Left Navigation */}
      <LeftNav 
        collapsed={leftCollapsed} 
        width={effectiveLeftWidth} 
        onToggleCollapse={() => setLeftCollapsed(true)}
      />
      
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
        style={{ width: centerWidth, backgroundColor: '#262624' }}
      >
        {/* Chat Header */}
        <ChatHeader
          title="Tâm bất sanh bất diệt"
          leftCollapsed={leftCollapsed}
          rightOpen={rightOpen}
          onToggleLeftNav={() => setLeftCollapsed(false)}
          onToggleRightPanel={() => useUiStore.getState().setRightOpen(true)}
        />

        {/* Messages */}
        <MessageList 
          messages={messages} 
          onSendMessage={(message) => handleSendMessage(message)}
        />
        
        {/* Composer */}
        <Composer 
          onSendMessage={handleSendMessage} 
          isStreaming={isStreaming} 
          agentConfig={agentConfig}
          onConfigChange={setAgentConfig}
        />
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
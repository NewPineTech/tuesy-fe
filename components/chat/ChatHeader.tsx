'use client';

import { Button } from '@/components/ui/button';
import { Menu, PanelRight } from 'lucide-react';

interface ChatHeaderProps {
  title: string;
  leftCollapsed: boolean;
  rightOpen: boolean;
  onToggleLeftNav: () => void;
  onToggleRightPanel: () => void;
}

export function ChatHeader({
  title,
  leftCollapsed,
  rightOpen,
  onToggleLeftNav,
  onToggleRightPanel
}: ChatHeaderProps) {

  return (
    <div className="border-b border-border bg-background">
      {/* Main header row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {leftCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleLeftNav}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="font-medium">{title}</h1>
          </div>
        </div>
        
        {!rightOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleRightPanel}
            className="h-8 w-8 p-0"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        )}
      </div>

    </div>
  );
}
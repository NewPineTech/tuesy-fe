'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidecar } from '@/lib/state/useSidecar';
import { SidecarPlugin } from '@/lib/types';

// Import plugins
import { CitationsPlugin } from './plugins/Citations';
import { DocPlugin } from './plugins/Doc';
import { ChartPlugin } from './plugins/Chart';
import { TablePlugin } from './plugins/Table';
import { JsonFallbackPlugin } from './plugins/JsonFallback';

const pluginRegistry: SidecarPlugin[] = [
  CitationsPlugin,
  DocPlugin,
  ChartPlugin,
  TablePlugin,
  JsonFallbackPlugin, // Always last as fallback
];

interface SidecarProps {
  width: number;
}

export function Sidecar({ width }: SidecarProps) {
  const { payloads, activeTab, setActiveTab, close } = useSidecar();

  if (payloads.length === 0) {
    return (
      <div 
        className="bg-background border-l border-border flex items-center justify-center"
        style={{ width: `${width}px` }}
      >
        <div className="text-center text-muted-foreground">
          <div className="mb-2 text-4xl">📋</div>
          <p className="text-sm">Nhấn vào trích dẫn hoặc biểu đồ</p>
          <p className="text-sm">để xem chi tiết tại đây</p>
        </div>
      </div>
    );
  }

  const currentPayload = payloads[activeTab];
  const plugin = pluginRegistry.find(p => p.match(currentPayload)) || JsonFallbackPlugin;

  return (
    <div 
      className="bg-background border-l border-border flex flex-col"
      style={{ width: `${width}px` }}
    >
      {/* Tab Header */}
      <div className="border-b border-border p-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium">Chi tiết</h2>
          <div className="flex items-center gap-1">
            {payloads.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                  disabled={activeTab === 0}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setActiveTab(Math.min(payloads.length - 1, activeTab + 1))}
                  disabled={activeTab === payloads.length - 1}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        {payloads.length > 1 ? (
          <Tabs value={activeTab.toString()} onValueChange={(v) => setActiveTab(parseInt(v))}>
            <TabsList className="w-full h-8 p-0">
              {payloads.map((payload, index) => (
                <div key={index} className="relative flex-1">
                  <TabsTrigger 
                    value={index.toString()}
                    className="w-full h-full text-xs px-2 relative"
                  >
                    <span className="truncate">
                      {payload.meta?.title || payload.type}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        close(index);
                      }}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </TabsTrigger>
                </div>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {currentPayload.meta?.title || currentPayload.type}
              </span>
              <Badge variant="outline" className="text-xs">
                {plugin.label}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => close(0)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        <plugin.Render payload={currentPayload} />
      </div>
    </div>
  );
}
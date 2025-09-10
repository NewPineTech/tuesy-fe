'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  FileText,
  Play,
  Clock,
  Copy,
  Share,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidecar } from '@/lib/state/useSidecar';
import { Citation } from '@/lib/types';

interface MobileSidecarProps {
  onClose: () => void;
}

export function MobileSidecar({ onClose }: MobileSidecarProps) {
  const { payloads, activeTab, setActiveTab, close } = useSidecar();
  const [showActions, setShowActions] = useState(false);

  if (payloads.length === 0) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-medium">Chi tiết</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <div className="text-muted-foreground">
            <div className="mb-4 text-4xl">📋</div>
            <p className="text-sm mb-2">Chưa có nội dung</p>
            <p className="text-xs">Nhấn vào trích dẫn hoặc biểu đồ để xem chi tiết</p>
          </div>
        </div>
      </div>
    );
  }

  const currentPayload = payloads[activeTab];

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="font-medium truncate">
              {currentPayload.meta?.title || currentPayload.type}
            </h2>
            {payloads.length > 1 && (
              <p className="text-xs text-muted-foreground">
                {activeTab + 1} / {payloads.length}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {payloads.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                disabled={activeTab === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(Math.min(payloads.length - 1, activeTab + 1))}
                disabled={activeTab === payloads.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Actions Bar */}
      {showActions && (
        <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/50">
          <Button variant="outline" size="sm" className="gap-2">
            <Copy className="h-4 w-4" />
            Sao chép
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share className="h-4 w-4" />
            Chia sẻ
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => close(activeTab)}
          >
            <X className="h-4 w-4" />
            Đóng
          </Button>
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-1 bg-card">
        {currentPayload.type === 'citations' && (
          <CitationsMobileView 
            citations={Array.isArray(currentPayload.data) ? currentPayload.data : currentPayload.data.citations || []} 
          />
        )}
        
        {currentPayload.type === 'doc' && (
          <DocMobileView doc={currentPayload.data} />
        )}
        
        {currentPayload.type === 'table' && (
          <TableMobileView table={currentPayload.data} />
        )}
        
        {currentPayload.type === 'chart' && (
          <ChartMobileView chart={currentPayload.data} />
        )}
      </ScrollArea>
    </div>
  );
}

function CitationsMobileView({ citations }: { citations: Citation[] }) {
  return (
    <div className="p-4 space-y-4 bg-card">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Nguồn trích dẫn</h3>
        <Badge variant="secondary">{citations.length} nguồn</Badge>
      </div>
      
      <div className="space-y-4">
        {citations.map((citation: Citation, index: number) => (
          <div key={`${citation.docId}-${index}`} className="space-y-3">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-medium text-sm leading-tight flex-1">
                  {citation.title}
                </h4>
                {citation.url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0"
                    asChild
                  >
                    <a href={citation.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              
              {citation.quote && (
                <div className="bg-muted rounded-lg p-3">
                  <blockquote className="text-sm italic">
                    &ldquo;{citation.quote}&rdquo;
                  </blockquote>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {citation.page && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Trang {citation.page}
                  </div>
                )}
                {citation.ts && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {citation.ts}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {index < citations.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  );
}

function DocMobileView({ doc }: { doc: any }) {
  return (
    <div className="p-4 bg-card">
      <div className="mb-4">
        <h3 className="font-medium mb-2">{doc.title || 'Tài liệu'}</h3>
        <Badge variant="secondary">{doc.kind === 'pdf' ? 'PDF' : 'Markdown'}</Badge>
      </div>
      
      {doc.kind === 'md' && doc.content && (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {doc.content.split('\n').map((line: string, index: number) => {
            if (line.startsWith('# ')) {
              return <h1 key={index} className="text-lg font-bold mb-3">{line.slice(2)}</h1>;
            } else if (line.startsWith('## ')) {
              return <h2 key={index} className="text-base font-semibold mb-2">{line.slice(3)}</h2>;
            } else if (line.startsWith('- ')) {
              return <li key={index} className="ml-4 list-disc mb-1">{line.slice(2)}</li>;
            } else if (line.trim()) {
              return <p key={index} className="mb-3 leading-relaxed">{line}</p>;
            }
            return <br key={index} />;
          })}
        </div>
      )}
      
      {doc.kind === 'pdf' && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="mb-2">PDF Viewer</p>
          <p className="text-sm">Trình xem PDF sẽ được tích hợp</p>
          {doc.url && (
            <Button variant="outline" className="mt-4" asChild>
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                Mở PDF
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function TableMobileView({ table }: { table: any }) {
  return (
    <div className="p-4 bg-card">
      <div className="mb-4">
        <h3 className="font-medium mb-2">{table.title || 'Bảng dữ liệu'}</h3>
        <Badge variant="secondary">
          {table.rows?.length || 0} hàng × {table.headers?.length || 0} cột
        </Badge>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {table.headers?.map((header: string, index: number) => (
                <th key={index} className="text-left p-2 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows?.map((row: string[], rowIndex: number) => (
              <tr key={rowIndex} className="border-b border-border/50">
                {row.map((cell: string, cellIndex: number) => (
                  <td key={cellIndex} className="p-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChartMobileView({ chart }: { chart: any }) {
  return (
    <div className="p-4 bg-card">
      <div className="mb-4">
        <h3 className="font-medium mb-2">{chart.title || 'Biểu đồ'}</h3>
        <Badge variant="secondary">
          {chart.chartType === 'line' ? 'Biểu đồ đường' : 'Biểu đồ cột'}
        </Badge>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-4 text-center">
        <div className="text-muted-foreground">
          <div className="mb-2 text-2xl">📊</div>
          <p className="text-sm">Biểu đồ sẽ được hiển thị tại đây</p>
        </div>
      </div>
    </div>
  );
}
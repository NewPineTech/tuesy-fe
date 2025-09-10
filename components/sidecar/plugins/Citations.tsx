import { SidecarPlugin, Citation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Play, FileText, Clock } from 'lucide-react';

interface CitationsData {
  citations: Citation[];
}

function CitationsRenderer({ payload }: { payload: any }) {
  const citations = Array.isArray(payload.data) ? payload.data : payload.data.citations || [];

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Nguồn trích dẫn</h3>
          <Badge variant="secondary">{citations.length} nguồn</Badge>
        </div>
        
        <div className="space-y-4">
          {citations.map((citation: Citation, index: number) => (
            <div key={`${citation.docId}-${index}`} className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm leading-tight">
                    {citation.title}
                  </h4>
                  {citation.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 flex-shrink-0"
                      asChild
                    >
                      <a href={citation.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
                
                {citation.quote && (
                  <blockquote className="pl-3 border-l-2 border-primary/20 text-sm text-muted-foreground italic">
                    "{citation.quote}"
                  </blockquote>
                )}
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {citation.page && (
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Trang {citation.page}
                    </div>
                  )}
                  {citation.ts && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {citation.ts}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
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
    </ScrollArea>
  );
}

export const CitationsPlugin: SidecarPlugin = {
  id: 'citations',
  label: 'Citations',
  match: (payload) => payload.type === 'citations',
  Render: CitationsRenderer,
};
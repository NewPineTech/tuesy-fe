import { SidecarPlugin } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';

function JsonRenderer({ payload }: { payload: any }) {
  const title = payload.meta?.title || `${payload.type} Data`;
  
  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(payload.data, null, 2));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-medium">{title}</h3>
            <Badge variant="secondary" className="mt-1">JSON</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={copyJson}>
            <Copy className="h-4 w-4 mr-2" />
            Copy JSON
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <pre className="p-4 text-xs bg-muted/20 whitespace-pre-wrap">
          {JSON.stringify(payload.data, null, 2)}
        </pre>
      </ScrollArea>
    </div>
  );
}

export const JsonFallbackPlugin: SidecarPlugin = {
  id: 'json-fallback',
  label: 'Raw Data',
  match: () => true, // Always matches as fallback
  Render: JsonRenderer,
};
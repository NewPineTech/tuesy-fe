import { SidecarPlugin } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink } from 'lucide-react';

function DocRenderer({ payload }: { payload: any }) {
  const doc = payload.data;
  
  if (doc.kind === 'pdf') {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-medium">{doc.title || 'PDF Document'}</h3>
              <Badge variant="secondary" className="mt-1">PDF</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
              {doc.url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Mở
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>PDF Viewer</p>
            <p className="text-sm">Trình xem PDF sẽ được tích hợp tại đây</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-medium">{doc.title || 'Markdown Document'}</h3>
            <Badge variant="secondary" className="mt-1">Markdown</Badge>
          </div>
          {doc.url && (
            <Button variant="outline" size="sm" asChild>
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Mở
              </a>
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {doc.content?.split('\n').map((line: string, index: number) => {
              if (line.startsWith('# ')) {
                return <h1 key={index} className="text-lg font-bold mb-3">{line.slice(2)}</h1>;
              } else if (line.startsWith('## ')) {
                return <h2 key={index} className="text-base font-semibold mb-2">{line.slice(3)}</h2>;
              } else if (line.startsWith('- ')) {
                return <li key={index} className="ml-4 list-disc">{line.slice(2)}</li>;
              } else if (line.trim()) {
                return <p key={index} className="mb-2">{line}</p>;
              }
              return <br key={index} />;
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export const DocPlugin: SidecarPlugin = {
  id: 'doc',
  label: 'Document',
  match: (payload) => payload.type === 'doc',
  Render: DocRenderer,
};
import { SidecarPlugin } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Copy } from 'lucide-react';

function TableRenderer({ payload }: { payload: any }) {
  const tableData = payload.data;
  const title = tableData.title || payload.meta?.title || 'Bảng dữ liệu';
  const headers = tableData.headers || [];
  const rows = tableData.rows || [];

  const copyAsCSV = () => {
    const csvContent = [
      headers.join(','),
      ...rows.map((row: string[]) => row.join(','))
    ].join('\n');
    
    navigator.clipboard.writeText(csvContent);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-medium">{title}</h3>
            <Badge variant="secondary" className="mt-1">
              {rows.length} hàng × {headers.length} cột
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyAsCSV}>
              <Copy className="h-4 w-4 mr-2" />
              Copy CSV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Xuất
            </Button>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header: string, index: number) => (
                  <TableHead key={index} className="font-medium">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row: string[], rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {row.map((cell: string, cellIndex: number) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}

export const TablePlugin: SidecarPlugin = {
  id: 'table',
  label: 'Table',
  match: (payload) => payload.type === 'table',
  Render: TableRenderer,
};
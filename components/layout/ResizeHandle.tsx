'use client';

import { useResize } from '@/lib/hooks/useResize';
import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  direction?: 'horizontal' | 'vertical';
  className?: string;
  onDoubleClick?: () => void;
}

export function ResizeHandle({ 
  onResize, 
  direction = 'horizontal', 
  className,
  onDoubleClick 
}: ResizeHandleProps) {
  const { handleMouseDown } = useResize({ onResize, direction });

  return (
    <div
      className={cn(
        'bg-border hover:bg-primary/20 transition-colors cursor-col-resize select-none',
        direction === 'horizontal' ? 'w-2 min-w-[8px] cursor-col-resize' : 'h-2 min-h-[8px] cursor-row-resize',
        className
      )}
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
      role="separator"
      aria-label={`Resize ${direction} handle`}
    />
  );
}
'use client';

import { useCallback, useEffect, useRef } from 'react';

interface UseResizeOptions {
  onResize: (delta: number) => void;
  direction: 'horizontal' | 'vertical';
}

export function useResize({ onResize, direction }: UseResizeOptions) {
  const isResizing = useRef(false);
  const startPos = useRef(0);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    isResizing.current = true;
    startPos.current = direction === 'horizontal' ? event.clientX : event.clientY;
    event.preventDefault();
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
  }, [direction]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing.current) return;
      
      const currentPos = direction === 'horizontal' ? event.clientX : event.clientY;
      const delta = currentPos - startPos.current;
      onResize(delta);
      startPos.current = currentPos;
    },
    [direction, onResize]
  );

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = '';
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { handleMouseDown };
}
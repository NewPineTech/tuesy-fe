'use client';

import { useEffect } from 'react';
import { useUiStore } from '@/lib/state/useUiStore';
import { useSidecar } from '@/lib/state/useSidecar';

export function useHotkeys() {
  const { toggleLeftPane, toggleRightPane, setRightWidth, rightWidth } = useUiStore();
  const { nextTab, prevTab } = useSidecar();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Alt+1: Toggle left pane
      if (event.altKey && event.key === '1') {
        event.preventDefault();
        toggleLeftPane();
        return;
      }

      // Alt+3: Toggle right pane
      if (event.altKey && event.key === '3') {
        event.preventDefault();
        toggleRightPane();
        return;
      }

      // Alt+=: Increase right pane width
      if (event.altKey && event.key === '=') {
        event.preventDefault();
        setRightWidth(rightWidth + 40);
        return;
      }

      // Alt+-: Decrease right pane width
      if (event.altKey && event.key === '-') {
        event.preventDefault();
        setRightWidth(rightWidth - 40);
        return;
      }

      // [: Previous tab
      if (event.key === '[' && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault();
        prevTab();
        return;
      }

      // ]: Next tab
      if (event.key === ']' && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault();
        nextTab();
        return;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleLeftPane, toggleRightPane, setRightWidth, rightWidth, nextTab, prevTab]);
}
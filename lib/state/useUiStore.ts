'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UiState } from '@/lib/types';

interface UiStore extends UiState {
  setLeftWidth: (width: number) => void;
  setRightWidth: (width: number) => void;
  setLeftCollapsed: (collapsed: boolean) => void;
  setRightOpen: (open: boolean) => void;
  setIsMobile: (mobile: boolean) => void;
  setLeftDrawerOpen: (open: boolean) => void;
  setRightDrawerOpen: (open: boolean) => void;
  toggleLeftPane: () => void;
  toggleRightPane: () => void;
  resetWidths: () => void;
}

const DEFAULT_LEFT_WIDTH = 280;
const DEFAULT_RIGHT_WIDTH = 420;
const MIN_LEFT_WIDTH = 220;
const MAX_LEFT_WIDTH = 420;
const MIN_RIGHT_WIDTH = 320;
const MAX_RIGHT_WIDTH = 560;
const COLLAPSED_LEFT_WIDTH = 64;

export const useUiStore = create<UiStore>()(
  persist(
    (set, get) => ({
      leftWidth: DEFAULT_LEFT_WIDTH,
      rightWidth: DEFAULT_RIGHT_WIDTH,
      leftCollapsed: false,
      rightOpen: false,
      isMobile: false,
      leftDrawerOpen: false,
      rightDrawerOpen: false,

      setLeftWidth: (width: number) => {
        const clampedWidth = Math.max(MIN_LEFT_WIDTH, Math.min(MAX_LEFT_WIDTH, width));
        set({ leftWidth: clampedWidth });
      },

      setRightWidth: (width: number) => {
        const clampedWidth = Math.max(MIN_RIGHT_WIDTH, Math.min(MAX_RIGHT_WIDTH, width));
        set({ rightWidth: clampedWidth });
      },

      setLeftCollapsed: (collapsed: boolean) => set({ leftCollapsed: collapsed }),
      setRightOpen: (open: boolean) => set({ rightOpen: open }),
      setIsMobile: (mobile: boolean) => set({ isMobile: mobile }),
      setLeftDrawerOpen: (open: boolean) => set({ leftDrawerOpen: open }),
      setRightDrawerOpen: (open: boolean) => set({ rightDrawerOpen: open }),

      toggleLeftPane: () => {
        const { leftCollapsed, isMobile } = get();
        if (isMobile) {
          set({ leftDrawerOpen: !get().leftDrawerOpen });
        } else {
          set({ leftCollapsed: !leftCollapsed });
        }
      },

      toggleRightPane: () => {
        const { rightOpen, isMobile } = get();
        if (isMobile) {
          set({ rightDrawerOpen: !get().rightDrawerOpen });
        } else {
          set({ rightOpen: !rightOpen });
        }
      },

      resetWidths: () => {
        set({
          leftWidth: DEFAULT_LEFT_WIDTH,
          rightWidth: DEFAULT_RIGHT_WIDTH,
        });
      },
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        leftWidth: state.leftWidth,
        rightWidth: state.rightWidth,
        leftCollapsed: state.leftCollapsed,
        rightOpen: state.rightOpen,
      }),
    }
  )
);

export { COLLAPSED_LEFT_WIDTH, MIN_LEFT_WIDTH, MAX_LEFT_WIDTH, MIN_RIGHT_WIDTH, MAX_RIGHT_WIDTH };
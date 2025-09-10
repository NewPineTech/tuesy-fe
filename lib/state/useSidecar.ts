'use client';

import { create } from 'zustand';
import { SidecarPayload } from '@/lib/types';

interface SidecarStore {
  payloads: SidecarPayload[];
  activeTab: number;
  push: (payload: SidecarPayload) => void;
  close: (index: number) => void;
  clear: () => void;
  setActiveTab: (index: number) => void;
  nextTab: () => void;
  prevTab: () => void;
}

export const useSidecar = create<SidecarStore>((set, get) => ({
  payloads: [],
  activeTab: 0,

  push: (payload: SidecarPayload) => {
    const { payloads } = get();
    const existingIndex = payloads.findIndex(
      (p) => p.type === payload.type && p.meta?.messageId === payload.meta?.messageId
    );

    if (existingIndex >= 0) {
      // Update existing payload
      const newPayloads = [...payloads];
      newPayloads[existingIndex] = payload;
      set({ payloads: newPayloads, activeTab: existingIndex });
    } else {
      // Add new payload
      const newPayloads = [...payloads, payload];
      set({ payloads: newPayloads, activeTab: newPayloads.length - 1 });
    }
  },

  close: (index: number) => {
    const { payloads, activeTab } = get();
    const newPayloads = payloads.filter((_, i) => i !== index);
    const newActiveTab = activeTab >= index && activeTab > 0 ? activeTab - 1 : activeTab;
    set({ 
      payloads: newPayloads, 
      activeTab: Math.min(newActiveTab, newPayloads.length - 1) 
    });
  },

  clear: () => set({ payloads: [], activeTab: 0 }),

  setActiveTab: (index: number) => {
    const { payloads } = get();
    if (index >= 0 && index < payloads.length) {
      set({ activeTab: index });
    }
  },

  nextTab: () => {
    const { payloads, activeTab } = get();
    if (payloads.length > 0) {
      set({ activeTab: (activeTab + 1) % payloads.length });
    }
  },

  prevTab: () => {
    const { payloads, activeTab } = get();
    if (payloads.length > 0) {
      const newTab = activeTab - 1;
      set({ activeTab: newTab < 0 ? payloads.length - 1 : newTab });
    }
  },
}));
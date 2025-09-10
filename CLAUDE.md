# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vietnamese AI chat application called "Đạo Tràng Ảo" (Virtual Temple) that allows users to interact with an AI representation of Buddhist Master Tuệ Sỹ. The application features a three-panel interface: left navigation, center chat area, and right sidecar for displaying additional content like citations, documents, charts, and tables.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (static export)
- `npm start` - Start production server
- `npm run lint` - Run ESLint linting

## Architecture

### Core Technologies
- **Next.js 13.5.1** with App Router and static export (`output: 'export'`)
- **React 18.2** with TypeScript
- **Tailwind CSS** for styling with shadcn/ui components
- **Zustand** for state management (UI layout and sidecar content)
- **Radix UI** primitives via shadcn/ui

### Key State Management
- `useUiStore` (`lib/state/useUiStore.ts`) - Manages responsive layout, panel widths, collapse states
- `useSidecar` (`lib/state/useSidecar.ts`) - Manages tabbed sidecar content with citations, documents, charts

### Layout Structure
- **Responsive design**: Mobile uses sheet/drawer overlays, desktop uses resizable panels
- **Three-panel layout**: Left nav (280px default), center chat (fluid), right sidecar (420px default)
- **Resizable panels**: Custom ResizeHandle component with double-click to reset
- **Collapsible left nav**: Collapses to 64px with icon-only view

### Component Architecture
- `app/page.tsx` - Main chat interface with responsive layout logic
- `components/layout/` - Layout components (LeftNav, ResizeHandle)
- `components/chat/` - Chat components (MessageList, Composer)
- `components/sidecar/` - Sidecar with plugin system for different content types
- `components/ui/` - shadcn/ui component library

### Type Definitions (`lib/types.ts`)
- `Message` - Chat message with streaming, citations, attachments, metrics
- `AgentConfig` - AI agent configuration with scope, temperature, knowledge base
- `SidecarPayload` - Typed payloads for different sidecar content types
- `UiState` - Layout state including panel widths and mobile states

### Sidecar Plugin System
Located in `components/sidecar/plugins/`, each plugin implements:
- `match()` function to identify compatible payload types
- `Render` component for displaying the content
- Supports: citations, documents (MD/PDF), tables, charts, JSON fallback

### Styling & Theming
- Uses shadcn/ui design system with Tailwind CSS
- Dark theme by default via `next-themes`
- Custom CSS variables for theming in `app/globals.css`
- Components configured in `components.json` with `@/` path aliases

### Data Flow
- Mock data in `lib/mock-data.ts` for development
- Streaming API responses via `lib/api.ts`
- Vietnamese language UI with Buddhist terminology
- Real-time message updates during streaming responses

### Key Features
- **Streaming responses**: Progressive message updates with typing indicators
- **Citations**: Clickable references with page numbers and quotes
- **Attachments**: Charts, tables, and documents displayed in sidecar
- **Hotkeys**: Custom keyboard shortcuts via `lib/hooks/useHotkeys.ts`
- **Responsive**: Mobile-first design with drawer navigation
- **Persistent state**: UI preferences saved via Zustand persistence

## File Structure Notes
- Path aliases configured: `@/*` maps to project root
- TypeScript strict mode enabled
- Static export configuration for deployment
- ESLint configured with Next.js rules (ignored during builds)
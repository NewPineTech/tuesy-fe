import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Đạo Tràng Ảo - Thỉnh Pháp Cùng Hòa Thượng Tuệ Sỹ',
  description: 'Tất cả mọi người trên thế giới đều có thể online trò chuyện với Tuệ Sỹ bằng chính giọng nói của Ngài với mọi ngôn ngữ - về sở học cả đời Ngài để lại.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
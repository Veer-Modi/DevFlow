"use client";

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          className: 'dark:bg-[#111827] dark:text-gray-100 dark:border-gray-800 border bg-white text-gray-900',
          style: {
            borderRadius: '12px',
          }
        }} 
      />
    </ThemeProvider>
  );
}

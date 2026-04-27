"use client";

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        {children}
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            className: 'dark:bg-[#171717] dark:text-gray-100 dark:border-gray-800 border bg-white text-gray-900',
            style: {
              borderRadius: '12px',
            }
          }} 
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

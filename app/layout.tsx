// @ts-nocheck
import React from 'react';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}

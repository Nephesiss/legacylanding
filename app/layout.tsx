// @ts-nocheck
import React from 'react';
import { Poppins } from 'next/font/google';
import './globals.css';

<link
  rel="icon"
  href="/logo?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>

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

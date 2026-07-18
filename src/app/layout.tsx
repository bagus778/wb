import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Cyber Store - Pterodactyl & Scripts',
  description: 'Instant deployment web store',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-grid min-h-screen relative overflow-x-hidden">
        {/* Efek Cahaya Neon Abstrak di Latar Belakang */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { ShoppingBag, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Telegram Store Aggregator',
  description: 'Buy products from Telegram bots easily.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-text">
        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6">
          {children}
        </main>
      </body>
    </html>
  );
}

'use client';

import React from 'react';
import { ReactNode } from 'react';
import Navigation from './Navigation';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} ProBreakthrough. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
} 
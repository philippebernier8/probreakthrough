"use client";

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Logo from './Logo';

export default function Navigation() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleAthleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleMenuItemClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Logo className="h-8 w-auto" />
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <Link href="/players" className="text-gray-700 hover:text-red-700 px-3 py-2 text-sm font-medium">
              Browse Athletes
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-red-700 px-3 py-2 text-sm font-medium">
              My Profile
            </Link>
            <Link href="/messages" className="text-gray-700 hover:text-red-700 px-3 py-2 text-sm font-medium relative">
              Messages
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </Link>
            {/* Suppression de la cloche de notifications */}
            {/* <div className="flex items-center px-2">
              <NotificationBell />
            </div> */}
            {status === 'loading' ? (
              <div className="text-gray-500 px-3 py-2 text-sm">Loading...</div>
            ) : session ? (
              <>
                <span className="text-gray-700 px-3 py-2 text-sm">
                  Welcome, {session.user.name || session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-700 hover:text-red-700 px-3 py-2 text-sm font-medium"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-red-700 px-3 py-2 text-sm font-medium">
                  Sign in
                </Link>
                <Link href="/register" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 
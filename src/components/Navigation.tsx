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
            {/* Always show Browse Athletes */}
            <Link href="/players" className="text-gray-700 hover:text-red-700 px-3 py-2 text-sm font-medium">
              Browse Athletes
            </Link>
            
            {/* Show these only when user is logged in */}
            {status === 'loading' ? (
              <div className="text-gray-500 px-3 py-2 text-sm">Loading...</div>
            ) : session ? (
              <>
            <Link href="/profile" className="text-gray-700 hover:text-red-700 px-3 py-2 text-sm font-medium">
              My Profile
            </Link>
                <Link href="/messages" className="text-gray-700 hover:text-red-700 px-3 py-2 text-sm font-medium relative">
                  Messages
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    0
                  </span>
                </Link>
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
          
          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {/* Always show Browse Athletes */}
            <Link
              href="/players"
              className="text-gray-700 hover:text-red-700 block px-3 py-2 text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Athletes
            </Link>
            
            {/* Show these only when user is logged in */}
            {status === 'loading' ? (
              <div className="text-gray-500 block px-3 py-2 text-base">Loading...</div>
            ) : session ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-red-700 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/messages"
                  className="text-gray-700 hover:text-red-700 block px-3 py-2 text-base font-medium relative"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Messages
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 inline-flex items-center justify-center">
                    0
                  </span>
                </Link>
                <div className="text-gray-700 block px-3 py-2 text-base">
                  Welcome, {session.user.name || session.user.email}
                </div>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-red-700 block px-3 py-2 text-base font-medium w-full text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-red-700 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-red-600 text-white block px-3 py-2 text-base font-medium rounded-lg hover:bg-red-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 
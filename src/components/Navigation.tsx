"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import NotificationBell from './NotificationBell';

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo et navigation principale */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PB</span>
              </div>
              <span className="text-xl font-bold text-gray-800">ProBreakthrough</span>
            </Link>
            
            <div className="ml-10 flex items-center space-x-8">
              <Link href="/players" className="text-gray-700 hover:text-red-700 px-3 py-2 text-sm font-medium">
                Browse Athletes
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-red-700 px-3 py-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/messages" className="text-gray-700 hover:text-red-700 px-3 py-2 text-sm font-medium">
                Messages
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-red-700 px-3 py-2 text-sm font-medium">
                Profile
              </Link>
            </div>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            <NotificationBell />
            
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-red-700 px-3 py-2 text-sm font-medium">
                  Sign in
                </Link>
                <Link href="/register" className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 
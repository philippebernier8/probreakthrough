'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface MessageNotificationProps {
  unreadCount: number;
  onMarkAsRead: () => void;
}

export default function MessageNotification({ unreadCount, onMarkAsRead }: MessageNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (unreadCount > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
    return;
  }, [unreadCount]);

  if (!isVisible || unreadCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Nouveau message
            </p>
            <p className="text-sm text-gray-500">
              Vous avez {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => {
                setIsVisible(false);
                onMarkAsRead();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
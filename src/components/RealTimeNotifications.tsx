'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Notification {
  id: string;
  type: 'message' | 'mention' | 'endorsement' | 'profile_view';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  link?: string;
}

interface RealTimeNotificationsProps {
  onNotificationClick: (notification: Notification) => void;
}

export default function RealTimeNotifications({ onNotificationClick }: RealTimeNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: session } = useSession();

  // Simulate real-time notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'message',
        title: 'Nouveau message',
        message: 'John Smith vous a envoyé un message',
        timestamp: new Date(),
        isRead: false,
        senderId: 'john@example.com',
        senderName: 'John Smith',
        senderAvatar: 'J'
      },
      {
        id: '2',
        type: 'endorsement',
        title: 'Nouvelle recommandation',
        message: 'Marie Dubois vous a recommandé pour "Leadership"',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        isRead: false,
        senderId: 'marie@example.com',
        senderName: 'Marie Dubois',
        senderAvatar: 'M'
      },
      {
        id: '3',
        type: 'profile_view',
        title: 'Profil consulté',
        message: 'Un coach a consulté votre profil',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        isRead: true
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Show notification when new message arrives
  useEffect(() => {
    if (unreadCount > 0 && 'Notification' in window && Notification.permission === 'granted') {
      const latestNotification = notifications.find(n => !n.isRead);
      if (latestNotification) {
        new Notification(latestNotification.title, {
          body: latestNotification.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
    }
  }, [unreadCount, notifications]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'endorsement':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'profile_view':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 004 5v12a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-1.81 1.19z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Marquer comme lu
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 004 5v12a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-1.81 1.19z" />
                </svg>
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    markAsRead(notification.id);
                    onNotificationClick(notification);
                    setShowDropdown(false);
                  }}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {notification.senderAvatar ? (
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {notification.senderAvatar}
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowDropdown(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-800 text-center"
              >
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
} 
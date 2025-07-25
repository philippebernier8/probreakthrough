"use client";

import { useState } from 'react';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New message from Coach Smith', time: '2 min ago' },
    { id: 2, message: 'Your video has been analyzed', time: '1 hour ago' }
  ]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75l2.25 2.25H2.25L4.5 13.5V9.75a6 6 0 0 1 6-6z" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="text-sm text-gray-600 hover:text-gray-800">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
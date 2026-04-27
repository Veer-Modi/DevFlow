"use client";

import { useState, useEffect, useRef } from 'react';
import api from '@/utils/api';
import Link from 'next/link';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      const data = res.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.is_read).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;

    try {
      await api.patch(`/notifications/${id}`);
      
      // Update local state
      const updatedNotifications = notifications.map(n => 
        n._id === id ? { ...n, is_read: true } : n
      );
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter((n: any) => !n.is_read).length);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const timeSince = (dateStr: string) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  const previewNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white relative p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
      >
        <span className="sr-only">View notifications</span>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {unreadCount} unread
              </span>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {previewNotifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {previewNotifications.map((notif) => (
                  <div 
                    key={notif._id}
                    onClick={() => handleMarkAsRead(notif._id, notif.is_read)}
                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${!notif.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${
                        notif.type === 'warning' || notif.type === 'blocked' ? 'text-red-500' : 'text-blue-500'
                      }`}>
                        {notif.type}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {timeSince(notif.created_at)}
                      </span>
                    </div>
                    <p className={`text-sm ${!notif.is_read ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Link 
            href="/notifications"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-sm font-medium text-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700/80 border-t border-gray-200 dark:border-gray-700 transition-colors rounded-b-md"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  Sparkles,
  Radio,
  Clock,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = () => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) setNotifications(data.notifications);
        if (typeof data.unreadCount === 'number') setUnreadCount(data.unreadCount);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    // Auto check every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead && user) {
      fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notif.id }),
      }).catch(() => {});

      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-700 dark:text-slate-200 hover:text-[#C49339] dark:hover:text-[#F0C96A] rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
        title="Announcements & Alerts"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-600 text-white font-black text-[10px] rounded-full flex items-center justify-center animate-bounce shadow-md">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-[#07111F] text-slate-900 dark:text-white border-2 border-slate-200 dark:border-[#D6A84F]/30 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] flex items-center justify-center font-bold">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-black">Official Alerts</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-600 dark:text-red-400 font-extrabold text-[10px]">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-[#C49339] dark:text-[#F0C96A] hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <Sparkles className="w-6 h-6 text-[#D6A84F] mx-auto mb-2 opacity-60" />
                <p className="font-bold">No new notifications</p>
                <p className="text-[11px]">All caught up with latest broadcasts!</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 transition-colors relative cursor-pointer ${
                    !n.isRead
                      ? 'bg-amber-500/5 dark:bg-[#D6A84F]/10 hover:bg-amber-500/10'
                      : 'hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {!n.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                  )}

                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                        {n.type === 'LIVE_SESSION'
                          ? '📹 Live Call'
                          : n.type === 'COURSE_UPDATE'
                          ? '🎓 Course'
                          : n.type === 'PROMO'
                          ? '🏷️ Offer'
                          : '📢 Notice'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatTimeAgo(n.createdAt)}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-950 dark:text-white leading-snug">
                      {n.title}
                    </h4>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {n.message}
                    </p>

                    {n.link && (
                      <a
                        href={n.link}
                        target={n.link.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C49339] dark:text-[#F0C96A] hover:underline pt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Open Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

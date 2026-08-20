'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Trash2,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Tag,
  Radio,
  Clock,
  Eye,
} from 'lucide-react';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('ANNOUNCEMENT');
  const [link, setLink] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  const fetchNotifications = () => {
    fetch('/api/admin/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) setNotifications(data.notifications);
        if (data.totalStudents) setTotalStudents(data.totalStudents);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsBroadcasting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          type,
          link: link.trim() || null,
          targetRole: 'ALL',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFeedback({ text: data.message || 'Notification broadcasted successfully!', isError: false });
        setTitle('');
        setMessage('');
        setLink('');
        setType('ANNOUNCEMENT');
        fetchNotifications();
      } else {
        setFeedback({ text: data.error || 'Failed to broadcast notification', isError: true });
      }
    } catch {
      setFeedback({ text: 'Network error occurred while broadcasting', isError: true });
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this broadcast notification?')) return;

    try {
      const res = await fetch(`/api/admin/notifications?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchNotifications();
      } else {
        alert('Failed to delete notification');
      }
    } catch {
      alert('Error deleting notification');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Broadcast Notifications</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] text-xs font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>Live Broadcast</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Send real-time alerts, class updates, live meet links, and promo announcements to all registered students.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] flex items-center justify-center font-bold">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Broadcasts</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{notifications.length}</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Active Students</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalStudents}</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Delivery Channel</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">In-App Bell 🔔 + Dashboard</span>
          </div>
        </div>
      </div>

      {/* Broadcast Form (Munna Bhai Only) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1728] border-2 border-slate-200 dark:border-[#D6A84F]/30 shadow-lg space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white flex items-center justify-center font-bold">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Compose & Send New Broadcast</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Only you (Munna Bhai) have access to send this. It will be instantly delivered to every student&apos;s bell icon.
            </p>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 font-bold ${
              feedback.isError
                ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {feedback.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleBroadcast} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notification Headline / Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 🔥 Live Q&A Session Tomorrow at 7:00 PM!"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none font-bold placeholder-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category Badge
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none font-bold"
              >
                <option value="ANNOUNCEMENT">📢 General Announcement</option>
                <option value="LIVE_SESSION">📹 Live Session / Google Meet</option>
                <option value="COURSE_UPDATE">🎓 Course / Lesson Update</option>
                <option value="PROMO">🏷️ Special Offer / Promo</option>
                <option value="ALERT">⚠️ Important Notice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Message Description *
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here... (e.g. Hey creators, we have just added 3 new viral reel breakdowns in the Instagram course. Check it out now!)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none placeholder-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Optional Button Link (URL or Page Path)
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="e.g. /courses/instagram-growth-mastery or https://meet.google.com/xyz"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none placeholder-slate-400 font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isBroadcasting || !title.trim() || !message.trim()}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] hover:from-[#E0B45C] hover:to-[#D6A84F] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#D6A84F]/30 hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isBroadcasting ? 'Broadcasting Now...' : 'Broadcast Notification to All Students →'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History Table */}
      <div className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs space-y-4 p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Broadcast History & Engagement</h3>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading sent notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
            No broadcast notifications sent yet. Use the form above to send your first announcement!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-4">Notification</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Action Link</th>
                  <th className="p-4">Student Reads</th>
                  <th className="p-4">Date Sent</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 max-w-sm">
                      <p className="font-bold text-slate-900 dark:text-white text-xs">{n.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{n.message}</p>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        {n.type}
                      </span>
                    </td>

                    <td className="p-4">
                      {n.link ? (
                        <a
                          href={n.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#C49339] dark:text-[#F0C96A] font-bold hover:underline font-mono"
                        >
                          <span className="truncate max-w-[120px]">{n.link}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px]">
                        {n.readCount} Students Read
                      </span>
                    </td>

                    <td className="p-4 text-slate-500 dark:text-slate-400 text-[11px]">
                      {new Date(n.createdAt).toLocaleString()}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

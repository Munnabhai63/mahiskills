'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, CheckCircle2, MessageSquare } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    fetch('/api/admin/messages')
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: !current }),
      });
      if (res.ok) fetchMessages();
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading contact inquiries...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Contact Inquiries & Messages</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Inquiries sent through the public website contact form.</p>
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-center text-xs text-slate-500">
            No contact messages received yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-3xl border transition-all ${
                msg.isRead
                  ? 'bg-white dark:bg-[#0B1728] border-slate-200 dark:border-white/5 opacity-80'
                  : 'bg-white dark:bg-[#0B1728] border-slate-300 dark:border-[#D6A84F]/40 shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{msg.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{msg.email}</span>
                  {msg.phone && <span className="text-xs text-slate-500 dark:text-slate-400">• {msg.phone}</span>}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => toggleRead(msg.id, msg.isRead)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                      msg.isRead
                        ? 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                        : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {msg.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>
                </div>
              </div>

              <div className="pt-3 space-y-1">
                <h4 className="text-xs font-bold text-[#C49339] dark:text-[#F0C96A]">{msg.subject}</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

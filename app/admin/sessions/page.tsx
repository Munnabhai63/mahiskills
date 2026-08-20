'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, Ban, Video, Plus } from 'lucide-react';

export default function AdminSessionsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Block Date Form
  const [blockDateInput, setBlockDateInput] = useState('');
  const [blockReasonInput, setBlockReasonInput] = useState('');

  const loadData = () => {
    fetch('/api/admin/sessions')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status }),
      });
      if (res.ok) loadData();
    } catch {
      alert('Failed to update booking status');
    }
  };

  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDateInput) return;

    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'BLOCK_DATE',
          date: blockDateInput,
          reason: blockReasonInput || 'Unavailable',
        }),
      });

      if (res.ok) {
        setBlockDateInput('');
        setBlockReasonInput('');
        loadData();
      }
    } catch {
      alert('Error blocking date');
    }
  };

  const handleUnblockDate = async (date: string) => {
    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UNBLOCK_DATE', date }),
      });
      if (res.ok) loadData();
    } catch {
      alert('Error unblocking date');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading 1:1 sessions...</div>;
  }

  const bookings = data?.bookings || [];
  const blockedDates = data?.blockedDates || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">1:1 Session Bookings & Availability</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage student consultations, block holiday dates, and send meeting links.</p>
      </div>

      {/* Block Date Tool */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Ban className="w-4 h-4 text-[#D6A84F]" />
          <span>Block a Date (Prevent Bookings)</span>
        </h3>

        <form onSubmit={handleBlockDate} className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={blockDateInput}
            onChange={(e) => setBlockDateInput(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none font-medium"
            required
          />
          <input
            type="text"
            value={blockReasonInput}
            onChange={(e) => setBlockReasonInput(e.target.value)}
            placeholder="Reason (e.g. Travel / Public Holiday)"
            className="flex-1 min-w-[200px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-bold text-xs shadow-xs"
          >
            Block Date
          </button>
        </form>

        {blockedDates.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {blockedDates.map((b: any) => (
              <span
                key={b.id}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold"
              >
                <span>{b.date} ({b.reason || 'Blocked'})</span>
                <button
                  onClick={() => handleUnblockDate(b.date)}
                  className="text-rose-500 hover:text-rose-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-white/10">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">All 1:1 Session Bookings</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-4">Booking #</th>
                <th className="p-4">Student</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Topic / Notes</th>
                <th className="p-4">Meeting Link</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {bookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{b.bookingNumber}</td>

                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white">{b.studentName}</p>
                    <p className="text-[11px] text-slate-400">{b.studentEmail} • {b.studentPhone}</p>
                  </td>

                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    {b.bookingDate} <br />
                    <span className="text-[#C49339] dark:text-[#F0C96A] text-[11px] font-bold">{b.startTime} - {b.endTime}</span>
                  </td>

                  <td className="p-4 max-w-xs">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{b.topic}</p>
                    {b.notes && <p className="text-[10px] text-slate-400 truncate italic">{b.notes}</p>}
                  </td>

                  <td className="p-4">
                    <a
                      href={b.meetingLink || 'https://meet.google.com/mahiskills-mentor'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#C49339] dark:text-[#F0C96A] font-bold hover:underline"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Meet Link</span>
                    </a>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                          : b.status === 'COMPLETED'
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {b.status === 'CONFIRMED' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'COMPLETED')}
                          className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'CANCELLED')}
                          className="px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-bold"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

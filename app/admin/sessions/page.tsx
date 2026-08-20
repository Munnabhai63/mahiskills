'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  Video,
  Plus,
  Edit,
  ExternalLink,
  MessageCircle,
  X,
  Check,
  Sparkles,
  Link2,
} from 'lucide-react';

export default function AdminSessionsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Block Date Form
  const [blockDateInput, setBlockDateInput] = useState('');
  const [blockReasonInput, setBlockReasonInput] = useState('');

  // Meeting Link Edit Modal State
  const [meetingModal, setMeetingModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    bookingNumber: string;
    studentName: string;
    studentPhone: string;
    bookingDate: string;
    startTime: string;
    currentLink: string;
  }>({
    isOpen: false,
    bookingId: '',
    bookingNumber: '',
    studentName: '',
    studentPhone: '',
    bookingDate: '',
    startTime: '',
    currentLink: '',
  });

  const [linkInput, setLinkInput] = useState('');
  const [isSavingLink, setIsSavingLink] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

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

  const handleOpenMeetingModal = (booking: any) => {
    setMeetingModal({
      isOpen: true,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      studentName: booking.studentName,
      studentPhone: booking.studentPhone,
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      currentLink: booking.meetingLink || 'https://meet.google.com/mahiskills-mentor',
    });
    setLinkInput(booking.meetingLink || 'https://meet.google.com/mahiskills-mentor');
    setSaveSuccessMsg(false);
  };

  const handleSaveMeetingLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkInput.trim()) return;

    setIsSavingLink(true);

    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: meetingModal.bookingId,
          meetingLink: linkInput.trim(),
        }),
      });

      if (res.ok) {
        setSaveSuccessMsg(true);
        loadData();
        setTimeout(() => {
          setMeetingModal((prev) => ({ ...prev, isOpen: false }));
          setSaveSuccessMsg(false);
        }, 1200);
      } else {
        alert('Failed to update meeting link');
      }
    } catch {
      alert('Error updating meeting link');
    } finally {
      setIsSavingLink(false);
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
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage student consultations, set custom Google Meet links, and share meeting details directly on WhatsApp.
        </p>
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
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">All 1:1 Session Bookings</h3>
          <span className="text-xs text-slate-400">Total: {bookings.length}</span>
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
              {bookings.map((b: any) => {
                const meetUrl = b.meetingLink || 'https://meet.google.com/mahiskills-mentor';
                const whatsappMsg = encodeURIComponent(
                  `Namaste ${b.studentName} ji,\nHere is your 1:1 Live Strategy Call Google Meet link with Munna Bhai:\n\n🔗 Meeting Link: ${meetUrl}\n📅 Date: ${b.bookingDate}\n⏰ Time: ${b.startTime}\n\nPlease join 5 minutes before time. See you inside!`
                );
                const cleanPhone = b.studentPhone ? b.studentPhone.replace(/[^0-9]/g, '') : '';
                const whatsappUrl = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${whatsappMsg}`;

                return (
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

                    <td className="p-4 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={meetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#C49339] dark:text-[#F0C96A] font-bold hover:underline font-mono text-[11px]"
                          title={meetUrl}
                        >
                          <Video className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[130px]">{meetUrl.replace('https://', '')}</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenMeetingModal(b)}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 hover:bg-[#D6A84F]/20 text-slate-700 dark:text-slate-200 hover:text-[#C49339] dark:hover:text-[#F0C96A] font-bold text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Set Link</span>
                        </button>

                        {b.studentPhone && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 transition-colors"
                            title="Send Meet Link on WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Set Google Meet Link Modal */}
      {meetingModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMeetingModal((prev) => ({ ...prev, isOpen: false }))}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-[#07111F] text-slate-900 dark:text-white rounded-3xl border-2 border-slate-200 dark:border-[#D6A84F]/40 shadow-2xl p-6 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] flex items-center justify-center font-bold">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Set Google Meet Link</h3>
                  <p className="text-[11px] text-slate-400">Booking #{meetingModal.bookingNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setMeetingModal((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold">{meetingModal.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Date:</span>
                <span className="font-bold">{meetingModal.bookingDate} ({meetingModal.startTime})</span>
              </div>
            </div>

            <form onSubmit={handleSaveMeetingLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Google Meet / Zoom URL *
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="https://meet.google.com/abc-defg-hij"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono font-bold focus:border-[#D6A84F] focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Need a new meeting link?</span>
                <a
                  href="https://meet.google.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C49339] dark:text-[#F0C96A] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Create on Google Meet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Google Meet link saved successfully!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMeetingModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingLink || !linkInput.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {isSavingLink ? 'Saving Link...' : 'Save Meet Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

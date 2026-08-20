'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User as UserIcon,
  Phone,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SessionBookingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form Fields
  const [studentName, setStudentName] = useState(user?.name || '');
  const [studentEmail, setStudentEmail] = useState(user?.email || '');
  const [studentPhone, setStudentPhone] = useState(user?.phone || '');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');

  // Booking Flow
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  useEffect(() => {
    if (user) {
      if (!studentName) setStudentName(user.name);
      if (!studentEmail) setStudentEmail(user.email);
      if (!studentPhone && user.phone) setStudentPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setSelectedDate(dateStr);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    fetch(`/api/session/available-slots?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableSlots(data.availableSlots || []);
        if (data.availableSlots?.length > 0) {
          setSelectedSlot(data.availableSlots[0]);
        } else {
          setSelectedSlot('');
        }
      })
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      alert('Please select a date and time slot');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/session/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          startTime: selectedSlot,
          endTime: calculateEndTime(selectedSlot),
          studentName,
          studentEmail,
          studentPhone,
          topic,
          notes,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setBookingSuccess(data.booking);
      } else {
        alert(data.error || 'Failed to complete booking');
      }
    } catch {
      alert('Error during session booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEndTime = (start: string) => {
    const parts = start.split(':');
    let hour = parseInt(parts[0]);
    const rest = parts[1];
    hour = hour === 12 ? 1 : hour + 1;
    return `${hour.toString().padStart(2, '0')}:${rest}`;
  };

  if (bookingSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#C49339] dark:text-[#F0C96A] uppercase tracking-wider">
            BOOKING CONFIRMED
          </span>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white">Your 1:1 Session is Locked!</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Booking ID: <strong className="text-slate-900 dark:text-white">{bookingSuccess.bookingNumber}</strong>
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs text-left space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-xs">Date</span>
              <strong className="text-slate-900 dark:text-white">{bookingSuccess.bookingDate}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Time</span>
              <strong className="text-slate-900 dark:text-white">
                {bookingSuccess.startTime} - {bookingSuccess.endTime}
              </strong>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-xs">Discussion Topic</span>
              <strong className="text-slate-900 dark:text-white">{bookingSuccess.topic}</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold">
              <Video className="w-4 h-4 text-[#D6A84F]" />
              <span>Google Meet Link</span>
            </div>
            <a
              href={bookingSuccess.meetingLink || 'https://meet.google.com/mahiskills-mentor'}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white text-xs font-bold shadow-xs hover:scale-105 transition-transform"
            >
              Join Call
            </a>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white font-bold text-sm"
          >
            <span>View In Student Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white dark:bg-[#0B1728] border border-[#D6A84F]/40 text-xs font-bold text-[#C49339] dark:text-[#F0C96A] shadow-xs">
          <span>☆</span>
          <span>1:1 PRIVATE STRATEGY CALL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white leading-tight">
          Book a 1:1 Personal Mentorship Session <br />
          <span className="text-[#C49339] dark:text-[#F0C96A]">With Munna Bhai</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Get personal guidance, analyze your channel/account, optimize your funnels, and build a tailored monetization plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Session Summary Card */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900 dark:bg-[#07111F] text-white p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800 dark:border-[#D6A84F]/30">
          <div className="flex items-center gap-4 border-b border-white/10 pb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D6A84F] shadow-lg shrink-0 bg-slate-900">
              <img
                src="/images/munna-bhai-transparent.png"
                alt="Munna Bhai"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Munna Bhai</h3>
              <p className="text-xs text-[#F0C96A] font-semibold">Founder, Lead Growth Mentor</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#D6A84F]" />
              <div>
                <strong className="text-white block">1 Full Hour Live Video Call</strong>
                <span>Dedicated 1-on-1 attention over Google Meet.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#D6A84F]" />
              <div>
                <strong className="text-white block">Custom Action Blueprint</strong>
                <span>Clear step-by-step roadmap to scale followers & revenue.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#D6A84F]" />
              <div>
                <strong className="text-white block">Instant Reschedule Support</strong>
                <span>Flexible date adjustments up to 24 hours prior.</span>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Session Fee</span>
              <span className="text-2xl font-black text-[#F0C96A]">₹899</span>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded bg-[#D6A84F]/20 text-[#F0C96A] font-bold">
              100% Guaranteed Value
            </span>
          </div>
        </div>

        {/* Right Form Wizard */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleBooking}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-lg space-y-6"
          >
            <h3 className="text-lg font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-white/10 pb-3">
              Step 1: Choose Date & Time Slot
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Available Slots ({availableSlots.length})
                </label>
                {loadingSlots ? (
                  <div className="py-2.5 text-xs text-slate-400">Loading slots...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="py-2.5 text-xs text-rose-500 font-semibold">
                    No slots available on this date.
                  </div>
                ) : (
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none font-bold"
                    required
                  >
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot} (1 Hour)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-white/10 pb-3 pt-2">
              Step 2: Attendee Information & Topic
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">WhatsApp Phone</label>
                <input
                  type="tel"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Discussion Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Scaling Instagram Reels to 100K"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Additional Questions or Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share your current account link, challenges, or goals..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || availableSlots.length === 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] hover:from-[#E0B45C] hover:to-[#D6A84F] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D6A84F]/30 hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Confirming Booking...' : 'Proceed to Book (₹899) →'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

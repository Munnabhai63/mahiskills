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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!studentName) setStudentName(user.name);
      if (!studentEmail) setStudentEmail(user.email);
      if (!studentPhone && user.phone) setStudentPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    // Default to tomorrow's date
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setErrorMessage(null);
    fetch(`/api/session/available-slots?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        const slots: string[] = data.availableSlots || [];
        setAvailableSlots(slots);
        if (slots.length > 0) {
          setSelectedSlot(slots[0]);
        } else {
          setSelectedSlot('');
        }
      })
      .catch(() => {
        // Fallback default slots
        const defaultSlots = [
          '11:00 AM - 12:00 PM',
          '12:30 PM - 01:30 PM',
          '03:00 PM - 04:00 PM',
          '04:30 PM - 05:30 PM',
          '06:00 PM - 07:00 PM',
          '07:30 PM - 08:30 PM',
        ];
        setAvailableSlots(defaultSlots);
        setSelectedSlot(defaultSlots[0]);
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      setErrorMessage('Please select a date and time slot.');
      return;
    }

    if (!studentName || !studentEmail || !studentPhone || !topic) {
      setErrorMessage('Please fill in all required fields (Name, Email, WhatsApp, and Topic).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

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

      if (res.ok && data.success) {
        setBookingSuccess(data.booking);
      } else {
        setErrorMessage(data.error || 'Failed to complete booking. Please try again.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEndTime = (start: string) => {
    if (start.includes(' - ')) {
      return start.split(' - ')[1];
    }
    const parts = start.split(':');
    let hour = parseInt(parts[0]);
    const rest = parts[1] || '00';
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1:1 SESSION CONFIRMED</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white">Your 1:1 Session is Locked!</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Booking ID: <strong className="text-slate-900 dark:text-white font-mono">{bookingSuccess.bookingNumber}</strong>
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs text-left space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-xs">Date</span>
              <strong className="text-slate-900 dark:text-white">{bookingSuccess.bookingDate}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Time Slot</span>
              <strong className="text-slate-900 dark:text-white">{bookingSuccess.startTime}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Student</span>
              <strong className="text-slate-900 dark:text-white">{bookingSuccess.studentName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">WhatsApp</span>
              <strong className="text-slate-900 dark:text-white">{bookingSuccess.studentPhone}</strong>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/10">
            <span className="text-slate-400 block text-xs mb-1">Topic</span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">{bookingSuccess.topic}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#D6A84F]/10 border border-[#D6A84F]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-[#D6A84F]" />
              <div>
                <strong className="text-xs sm:text-sm text-slate-900 dark:text-white block">Google Meet Link</strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Meeting link will also be sent to WhatsApp & Email</span>
              </div>
            </div>
            <a
              href={bookingSuccess.meetingLink || 'https://meet.google.com/mahiskills-mentor'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-[#D6A84F] text-slate-950 font-bold text-xs hover:bg-[#C49339] transition-colors"
            >
              Join Meet
            </a>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:scale-105 transition-transform"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0B1728] border border-[#D6A84F]/40 text-xs font-bold text-[#C49339] dark:text-[#F0C96A] shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EXCLUSIVE 1-ON-1 STRATEGY CALL</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
          Book 1:1 Live Mentorship With Munna Bhai
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Get personal guidance on Instagram organic growth, monetization funnels, high-ticket freelancing, and digital skill roadmaps tailored specifically to your goals.
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
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none font-medium cursor-pointer"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none font-bold cursor-pointer"
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
                  placeholder="Mahipal Choudhary"
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
                  placeholder="bhupalkata@gmail.com"
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
                  placeholder="+91 93763 43629"
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
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Additional Questions or Notes (Optional)</label>
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
              disabled={isSubmitting || !selectedSlot}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] hover:from-[#E0B45C] hover:to-[#D6A84F] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D6A84F]/30 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Confirming Booking...' : 'Proceed to Book (₹899) →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

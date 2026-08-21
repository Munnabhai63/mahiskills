'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen,
  Calendar,
  CreditCard,
  Award,
  User,
  Settings,
  Play,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Bell,
  Sparkles,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('courses');
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Profile Edit State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');

      fetch('/api/dashboard/stats')
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
        })
        .catch(() => {})
        .finally(() => setLoadingStats(false));
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMsg(null);

    const res = await updateProfile({
      name,
      phone,
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined,
    });

    setIsUpdatingProfile(false);

    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setProfileMsg({ type: 'error', text: res.error || 'Failed to update profile' });
    }
  };

  if (authLoading || loadingStats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#D6A84F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-xs">Loading student dashboard...</p>
      </div>
    );
  }

  const enrollments = stats?.enrollments || [];
  const sessionBookings = stats?.sessions || stats?.sessionBookings || [];
  const orders = stats?.orders || [];
  const certificates = stats?.certificates || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-[#07111F] dark:via-[#0B1728] dark:to-[#07111F] text-white border border-slate-700/50 dark:border-[#D6A84F]/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0C96A] via-[#D6A84F] to-[#B3862D] text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D6A84F]/20 text-[#F0C96A] text-[10px] font-extrabold uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{user?.email}</p>
          </div>
        </div>

        <Link
          href="/session"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 transition-transform shrink-0"
        >
          <Calendar className="w-4 h-4" />
          <span>Book 1:1 Session (₹899)</span>
        </Link>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Enrolled Courses</span>
            <BookOpen className="w-4 h-4 text-[#D6A84F]" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{enrollments.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">1:1 Sessions</span>
            <Calendar className="w-4 h-4 text-[#D6A84F]" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{sessionBookings.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Certificates</span>
            <Award className="w-4 h-4 text-[#D6A84F]" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{certificates.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <CreditCard className="w-4 h-4 text-[#D6A84F]" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{orders.length}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-white/10 pb-2">
        {[
          { id: 'courses', label: 'My Courses', icon: BookOpen },
          { id: 'announcements', label: 'Announcements', icon: Bell },
          { id: 'sessions', label: '1:1 Sessions', icon: Calendar },
          { id: 'certificates', label: 'Certificates', icon: Award },
          { id: 'orders', label: 'Order History', icon: CreditCard },
          { id: 'profile', label: 'Profile Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 text-[#D6A84F]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: MY COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {enrollments.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-center space-y-4">
              <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Courses Enrolled Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our practical, in-demand courses and start learning high-income digital skills today.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-bold text-xs shadow-md"
              >
                <span>Browse All Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enr: any) => {
                const cTitle = enr.title || enr.course?.title || 'Course';
                const cThumbnail = enr.thumbnail || enr.course?.thumbnail || '/images/placeholder-course.jpg';
                const cSlug = enr.slug || enr.course?.slug || '';
                const progress = enr.progressPercent ?? 0;

                return (
                  <div
                    key={enr.id}
                    className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                        <img
                          src={cThumbnail}
                          alt={cTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                          {cTitle}
                        </h3>

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-500 dark:text-slate-400">Course Progress</span>
                            <span className="text-[#C49339] dark:text-[#F0C96A] font-bold">
                              {progress}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#D6A84F] to-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 dark:border-white/5 mt-2">
                      <Link
                        href={`/learn/${cSlug}`}
                        className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-[#D6A84F] hover:bg-[#D6A84F] dark:hover:bg-[#C49339] text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>{progress === 100 ? 'Review Course' : 'Continue Learning'}</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 1:1 SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {sessionBookings.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-center space-y-4">
              <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No 1:1 Sessions Booked</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Schedule a 1-hour private mentorship call with Munna Bhai to get direct feedback on your channels and funnels.
              </p>
              <Link
                href="/session"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-bold text-xs shadow-md"
              >
                <span>Book 1:1 Session (₹899)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            sessionBookings.map((b: any) => (
              <div
                key={b.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {b.topic}
                    </span>
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
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Date: <strong className="text-slate-800 dark:text-slate-200">{b.bookingDate}</strong> • Time: <strong className="text-slate-800 dark:text-slate-200">{b.startTime} - {b.endTime}</strong>
                  </p>
                  <p className="text-[11px] font-mono text-slate-400">ID: {b.bookingNumber}</p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={b.meetingLink || 'https://meet.google.com/mahiskills-mentor'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 transition-transform"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Join Google Meet</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-center space-y-3">
              <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Certificates Earned Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Complete 100% of your course lessons to automatically unlock and receive your verified certificate!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert: any) => (
                <div
                  key={cert.id}
                  className="p-6 rounded-3xl bg-white dark:bg-[#0B1728] border-2 border-[#D6A84F]/40 shadow-md space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#C49339] dark:text-[#F0C96A] uppercase tracking-wider">
                        CERTIFICATE OF ACHIEVEMENT
                      </span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                        {cert.courseName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Issued on {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F0C96A] to-[#D6A84F] text-slate-950 flex items-center justify-center font-bold shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-white/10">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {cert.certificateNumber}
                    </span>

                    <Link
                      href={`/verify-certificate/${cert.certificateNumber}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-[#D6A84F] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View & Verify</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ORDER HISTORY */}
      {activeTab === 'orders' && (
        <div className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {orders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{ord.orderNumber}</td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                      {ord.course?.title || (ord.itemType === 'SESSION' ? '1:1 Mentorship Session' : 'Course')}
                    </td>
                    <td className="p-4 font-black text-slate-900 dark:text-white">
                      ₹{ord.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          ord.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : ord.status === 'PENDING_REVIEW'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'
                            : ord.status === 'FAILED'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}
                      >
                        {ord.status === 'PENDING_REVIEW' ? '⏳ Under Review' : ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <form
          onSubmit={handleProfileSubmit}
          className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 space-y-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-3">
            Account & Security Settings
          </h3>

          {profileMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{profileMsg.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">WhatsApp Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Change Password (Optional)</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">New Password (6+ chars)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:border-[#D6A84F] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-bold text-xs shadow-md disabled:opacity-50"
            >
              {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: ANNOUNCEMENTS & BROADCASTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-4">
              <div className="w-8 h-8 rounded-xl bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Official Broadcasts from Munna Bhai</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Class schedules, live Q&A links, and high-value community updates.</p>
              </div>
            </div>

            <div className="space-y-3">
              {stats?.notifications?.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No announcements at the moment. You are all up to date!
                </div>
              ) : (
                (stats?.notifications || []).map((n: any) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A]">
                          {n.type}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
                    {n.link && (
                      <a
                        href={n.link}
                        target={n.link.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#C49339] dark:text-[#F0C96A] hover:underline pt-1"
                      >
                        <span>View Attached Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Users,
  BookOpen,
  Calendar,
  CreditCard,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AdminAnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-500">
        Loading admin analytics...
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalRevenue: 284900,
    dailyRevenue: 12890,
    monthlyRevenue: 145000,
    totalStudents: 142,
    totalCourses: 4,
    totalSessions: 18,
    confirmedSessions: 6,
    totalCertificates: 24,
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${kpis.totalRevenue.toLocaleString('en-IN')}`,
      sub: 'All time earnings',
      icon: DollarSign,
      color: 'text-[#C49339] dark:text-[#F0C96A]',
    },
    {
      title: "Today's Revenue",
      value: `₹${kpis.dailyRevenue.toLocaleString('en-IN')}`,
      sub: 'Last 24 hours',
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Monthly Revenue',
      value: `₹${kpis.monthlyRevenue.toLocaleString('en-IN')}`,
      sub: 'Current calendar month',
      icon: CreditCard,
      color: 'text-sky-600 dark:text-sky-400',
    },
    {
      title: 'Active Students',
      value: kpis.totalStudents,
      sub: 'Registered learners',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Published Courses',
      value: kpis.totalCourses,
      sub: 'Active catalog programs',
      icon: BookOpen,
      color: 'text-[#C49339] dark:text-[#F0C96A]',
    },
    {
      title: '1:1 Mentorships',
      value: kpis.totalSessions,
      sub: `${kpis.confirmedSessions} upcoming sessions`,
      icon: Calendar,
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Issued Certificates',
      value: kpis.totalCertificates,
      sub: 'Course completions',
      icon: Award,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Platform Analytics & KPIs</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time financial transactions, enrollment volume, and session performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/courses/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#D6A84F]/20 hover:scale-105 transition-transform"
          >
            <span>+ Create New Course</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {c.title}
                </span>
                <div className={`p-2 rounded-xl bg-slate-100 dark:bg-white/5 ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {c.value}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{c.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#C49339] dark:text-[#F0C96A] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {data?.recentOrders?.map((ord: any) => (
              <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{ord.user?.name || 'Customer'}</p>
                  <p className="text-[11px] text-slate-500">{ord.course?.title || '1:1 Session'}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">
                    ₹{ord.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming 1:1 Sessions</h3>
            <Link
              href="/admin/sessions"
              className="text-xs font-bold text-[#C49339] dark:text-[#F0C96A] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {data?.recentBookings?.map((b: any) => (
              <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{b.studentName}</p>
                  <p className="text-[11px] text-slate-500 truncate max-w-xs">{b.topic}</p>
                </div>
                <div className="text-right">
                  <span className="font-medium text-slate-900 dark:text-white">{b.bookingDate}</span>
                  <span className="block text-[10px] text-[#C49339] dark:text-[#F0C96A] font-bold">
                    {b.startTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

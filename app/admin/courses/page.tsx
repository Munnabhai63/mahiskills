'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  BookOpen,
  Clock,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Radio,
} from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchCourses = () => {
    fetch('/api/admin/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          isReadyToSell: newStatus === 'LIVE',
          published: newStatus !== 'DRAFT',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCourses((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: newStatus,
                  isReadyToSell: newStatus === 'LIVE',
                  published: newStatus !== 'DRAFT',
                }
              : c
          )
        );
        setToastMessage(`Course status set to ${newStatus === 'LIVE' ? '🟢 LIVE (Ready to Sell)' : newStatus === 'UPCOMING' ? '⏳ UPCOMING (Pre-Launch)' : '🔒 DRAFT'}`);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        alert('Failed to update status');
      }
    } catch {
      alert('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCourses();
      } else {
        alert('Failed to delete course');
      }
    } catch {
      alert('Error deleting course');
    }
  };

  const liveCoursesCount = courses.filter((c) => c.status === 'LIVE' || (c.published && c.isReadyToSell !== false)).length;
  const upcomingCoursesCount = courses.filter((c) => c.status === 'UPCOMING' || c.isReadyToSell === false).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Courses & Curriculum Manager</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control which courses are Ready to Watch & Sell (🟢 LIVE) vs in Production (⏳ UPCOMING / Coming Soon).
          </p>
        </div>

        <Link
          href="/admin/courses/new"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#D6A84F]/20 hover:scale-105 transition-transform shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </Link>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Ready to Watch & Sell</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{liveCoursesCount} Live Courses</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">In Production / Coming Soon</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{upcomingCoursesCount} Upcoming</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#D6A84F]/10 text-[#C49339] dark:text-[#F0C96A] flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Total Courses</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{courses.length} Masterclasses</span>
          </div>
        </div>
      </div>

      {/* Guide Note for Munna Bhai */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-[#D6A84F] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">
            💡 Selling Status Control Guide:
          </p>
          <p className="text-[11px] leading-relaxed">
            * <strong>🟢 LIVE (Ready to Sell):</strong> Students can buy and watch all lessons immediately.<br />
            * <strong>⏳ UPCOMING (Pre-Launch):</strong> Students see the syllabus and preview, but buy button is locked with <em>&quot;Coming Soon — Enrollments Opening Soon&quot;</em> until you finish uploading videos and switch to Live.<br />
            * <strong>🔒 DRAFT:</strong> Completely hidden from public catalog.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">Loading courses...</div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-4">Course</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Curriculum</th>
                  <th className="p-4">Selling Status (1-Click Switch)</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {courses.map((course) => {
                  const currentStatus = course.status || (course.isReadyToSell === false ? 'UPCOMING' : course.published ? 'LIVE' : 'DRAFT');
                  const isUpdating = updatingId === course.id;

                  return (
                    <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-14 h-9 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200 dark:border-white/10">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white max-w-xs truncate">
                            {course.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">/{course.slug}</span>
                        </div>
                      </td>

                      <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{course.category}</td>

                      <td className="p-4 font-black text-slate-900 dark:text-white">
                        ₹{course.price.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                        {course.modules?.length || 0} Modules • {course.totalLessons || 0} Lessons
                      </td>

                      {/* Interactive 1-Click Status Dropdown */}
                      <td className="p-4">
                        <div className="relative inline-block">
                          <select
                            disabled={isUpdating}
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(course.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer shadow-xs focus:outline-none ${
                              currentStatus === 'LIVE'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-300'
                                : currentStatus === 'UPCOMING'
                                ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-300'
                                : 'bg-slate-100 border-slate-300 text-slate-700 dark:bg-white/10 dark:border-white/20 dark:text-slate-300'
                            } disabled:opacity-50`}
                          >
                            <option value="LIVE">🟢 LIVE (Sell & Watch Now)</option>
                            <option value="UPCOMING">⏳ UPCOMING (Videos Uploading)</option>
                            <option value="DRAFT">🔒 DRAFT (Hidden)</option>
                          </select>
                        </div>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <Link
                          href={`/courses/${course.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white inline-block shadow-xs"
                          title="View Public Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="p-2 rounded-xl bg-[#D6A84F]/20 hover:bg-[#D6A84F]/30 text-[#C49339] dark:text-[#F0C96A] inline-block font-bold shadow-xs"
                          title="Edit & Build Curriculum"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(course.id, course.title)}
                          className="p-2 rounded-xl bg-rose-100 dark:bg-rose-500/20 hover:bg-rose-200 dark:hover:bg-rose-500/30 text-rose-600 dark:text-rose-400 shadow-xs cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

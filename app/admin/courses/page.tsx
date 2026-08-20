'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, BookOpen, Clock, Users } from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Courses & Curriculum Manager</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create, edit modules & lessons, upload video URLs, and manage course pricing.
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
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-900 shrink-0">
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
                        <span className="text-[10px] text-slate-400">/{course.slug}</span>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{course.category}</td>

                    <td className="p-4 font-black text-slate-900 dark:text-white">
                      ₹{course.price.toLocaleString('en-IN')}
                    </td>

                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                      {course.modules?.length || 0} Modules • {course.totalLessons} Lessons
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          course.published
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}
                      >
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/courses/${course.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white inline-block"
                        title="View Public Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="p-1.5 rounded-lg bg-[#D6A84F]/20 hover:bg-[#D6A84F]/30 text-[#C49339] dark:text-[#F0C96A] inline-block font-bold"
                        title="Edit & Build Curriculum"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(course.id, course.title)}
                        className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-500/20 hover:bg-rose-200 dark:hover:bg-rose-500/30 text-rose-600 dark:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

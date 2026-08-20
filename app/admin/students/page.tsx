'use client';

import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, BookOpen, Calendar, CreditCard } from 'lucide-react';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStudents = () => {
    fetch(`/api/admin/students${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.students) setStudents(data.students);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const toggleStatus = async (studentId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, isActive: !currentStatus }),
      });

      if (res.ok) fetchStudents();
    } catch {
      alert('Error updating student status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Student Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">View student registrations, course progress, and account status.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#D6A84F] focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Enrolled Courses</th>
                <th className="p-4">1:1 Sessions</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] font-bold text-xs flex items-center justify-center">
                      {st.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{st.name}</p>
                      <p className="text-[11px] text-slate-400">{st.email}</p>
                    </div>
                  </td>

                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{st.phone || '—'}</td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900 dark:text-white">{st.enrollments?.length || 0}</span>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900 dark:text-white">{st.sessionBookings?.length || 0}</span>
                  </td>

                  <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(st.createdAt).toLocaleDateString()}</td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        st.isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                      }`}
                    >
                      {st.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleStatus(st.id, st.isActive)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        st.isActive
                          ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                          : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {st.isActive ? 'Deactivate' : 'Activate'}
                    </button>
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

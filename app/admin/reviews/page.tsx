'use client';

import React, { useState, useEffect } from 'react';
import { Star, Trash2, CheckCircle2, EyeOff } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    fetch('/api/admin/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: !current }),
      });
      if (res.ok) fetchReviews();
    } catch {
      alert('Failed to update review status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return;
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchReviews();
    } catch {
      alert('Failed to delete review');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading student reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Review Moderation Queue</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Approve, hide or delete course feedback from verified students.</p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Course</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review Comment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white">{r.user?.name}</p>
                    <p className="text-[11px] text-slate-400">{r.user?.email}</p>
                  </td>

                  <td className="p-4 font-bold text-slate-900 dark:text-white truncate max-w-xs">{r.course?.title}</td>

                  <td className="p-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </td>

                  <td className="p-4 max-w-md">
                    <p className="line-clamp-2 text-slate-800 dark:text-slate-200 italic">&quot;{r.comment}&quot;</p>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        r.isApproved
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                      }`}
                    >
                      {r.isApproved ? 'Approved' : 'Hidden'}
                    </span>
                  </td>

                  <td className="p-4 text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>

                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => toggleApproval(r.id, r.isApproved)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-[11px] font-bold"
                    >
                      {r.isApproved ? 'Hide' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
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
    </div>
  );
}

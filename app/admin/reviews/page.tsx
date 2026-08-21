'use client';

import React, { useState, useEffect } from 'react';
import { Star, Trash2, Edit3, Plus, CheckCircle2, EyeOff, Sparkles, X, MessageSquare } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isApproved, setIsApproved] = useState(true);

  const fetchReviews = () => {
    fetch('/api/admin/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchCourses = () => {
    fetch('/api/admin/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          setCourses(data.courses);
          if (data.courses.length > 0 && !selectedCourseId) {
            setSelectedCourseId(data.courses[0].id);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchReviews();
    fetchCourses();
  }, []);

  const openAddModal = () => {
    setEditingReview(null);
    setStudentName('');
    setStudentEmail('');
    setRating(5);
    setComment('');
    setIsApproved(true);
    if (courses.length > 0) setSelectedCourseId(courses[0].id);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (review: any) => {
    setEditingReview(review);
    setSelectedCourseId(review.courseId);
    setStudentName(review.user?.name || '');
    setStudentEmail(review.user?.email || '');
    setRating(review.rating || 5);
    setComment(review.comment || '');
    setIsApproved(review.isApproved !== false);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Please write a review comment');
      return;
    }
    if (!selectedCourseId) {
      setErrorMsg('Please select a course');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      if (editingReview) {
        // Edit existing review
        const res = await fetch('/api/admin/reviews', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingReview.id,
            rating,
            comment,
            isApproved,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setModalOpen(false);
          fetchReviews();
        } else {
          setErrorMsg(data.error || 'Failed to update review');
        }
      } else {
        // Create new review
        const res = await fetch('/api/admin/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: selectedCourseId,
            studentName: studentName.trim() || 'Verified Student',
            studentEmail: studentEmail.trim(),
            rating,
            comment: comment.trim(),
            isApproved,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setModalOpen(false);
          fetchReviews();
        } else {
          setErrorMsg(data.error || 'Failed to create review');
        }
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
    if (!confirm('Are you sure you want to permanently delete this review?')) return;
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
      {/* Top Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Review Management & Moderation</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Write student testimonials directly as admin, or approve, edit and delete reviews across all courses.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs shadow-lg shadow-[#D6A84F]/20 hover:scale-[1.02] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Write / Add New Review</span>
        </button>
      </div>

      {/* Reviews Table */}
      {reviews.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#D6A84F]/10 text-[#C49339] dark:text-[#F0C96A] flex items-center justify-center mx-auto">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Reviews Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You can write the first student review or testimonials for your courses right now.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D6A84F] text-white text-xs font-bold hover:bg-[#C49339] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Write First Review</span>
          </button>
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-4">Student Name</th>
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
                      <p className="font-bold text-slate-900 dark:text-white">{r.user?.name || 'Student'}</p>
                      <p className="text-[11px] text-slate-400">{r.user?.email || 'verified student'}</p>
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white truncate max-w-xs">
                      {r.course?.title}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </td>

                    <td className="p-4 max-w-md">
                      <p className="text-slate-800 dark:text-slate-200 italic line-clamp-2">
                        &quot;{r.comment}&quot;
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          r.isApproved
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}
                      >
                        {r.isApproved ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(r)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-[11px] font-bold inline-flex items-center gap-1"
                        title="Edit Review"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => toggleApproval(r.id, r.isApproved)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-[11px] font-bold"
                      >
                        {r.isApproved ? 'Hide' : 'Approve'}
                      </button>

                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        title="Delete Review"
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

      {/* Add / Edit Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1728] border-2 border-slate-200 dark:border-[#D6A84F]/40 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6A84F]/10 text-[#C49339] dark:text-[#F0C96A] text-[11px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>{editingReview ? 'EDIT REVIEW' : 'CREATE STUDENT REVIEW'}</span>
              </div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">
                {editingReview ? 'Edit Course Review' : 'Add Course Review as Admin'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Write authentic student reviews or testimonials to display on course landing pages.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Select Course */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Course *
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  disabled={Boolean(editingReview)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium focus:border-[#D6A84F] focus:outline-none"
                  required
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Name and Email (for new reviews) */}
              {!editingReview && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Student Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Rating: <span className="text-[#C49339] dark:text-[#F0C96A] font-extrabold">{rating} out of 5 Stars</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Review / Testimonial Text *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Share the student's result, earnings, review of Munna Bhai's guidance, or learning experience..."
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs leading-relaxed focus:border-[#D6A84F] focus:outline-none resize-none"
                  required
                />
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isApprovedCheck"
                  checked={isApproved}
                  onChange={(e) => setIsApproved(e.target.checked)}
                  className="w-4 h-4 rounded text-[#D6A84F] focus:ring-[#D6A84F]"
                />
                <label htmlFor="isApprovedCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Approve and publish publicly on course page immediately
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs shadow-md shadow-[#D6A84F]/20 hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving Review...' : editingReview ? 'Update Review' : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

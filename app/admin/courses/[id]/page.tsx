'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, Video, Eye, Play, Lock } from 'lucide-react';

export default function EditCourseAdminPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // New Module & Lesson State
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [addingModule, setAddingModule] = useState(false);
  const [activeModuleForLesson, setActiveModuleForLesson] = useState<string | null>(null);

  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonVideo, setLessonVideo] = useState('');
  const [lessonDuration, setLessonDuration] = useState('15m');
  const [lessonIsPreview, setLessonIsPreview] = useState(false);

  const loadCourse = () => {
    fetch(`/api/admin/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.course) setCourse(data.course);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (courseId) loadCourse();
  }, [courseId]);

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });

      if (res.ok) {
        alert('Course updated successfully!');
      } else {
        alert('Failed to update course');
      }
    } catch {
      alert('Error updating course');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newModuleTitle }),
      });

      if (res.ok) {
        setNewModuleTitle('');
        setAddingModule(false);
        loadCourse();
      }
    } catch {
      alert('Failed to add module');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module and all its lessons?')) return;

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId }),
      });

      if (res.ok) loadCourse();
    } catch {
      alert('Failed to delete module');
    }
  };

  const handleAddLesson = async (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !lessonVideo.trim()) {
      alert('Lesson title and video URL are required');
      return;
    }

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          title: lessonTitle,
          videoUrl: lessonVideo,
          duration: lessonDuration,
          isPreview: lessonIsPreview,
        }),
      });

      if (res.ok) {
        setLessonTitle('');
        setLessonVideo('');
        setLessonDuration('15m');
        setLessonIsPreview(false);
        setActiveModuleForLesson(null);
        loadCourse();
      }
    } catch {
      alert('Failed to add lesson');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/lessons`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      });

      if (res.ok) loadCourse();
    } catch {
      alert('Failed to delete lesson');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-500">
        Loading course editor...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-20 text-center text-slate-900 dark:text-white">Course not found</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/courses"
          className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/courses/${course.slug}`}
            target="_blank"
            className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-white/10"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Public Page</span>
          </Link>
        </div>
      </div>

      {/* Main Course Details Editor */}
      <form onSubmit={handleUpdateCourse} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 space-y-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-3">
          Course Overview & Pricing
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
            <input
              type="text"
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Slug</label>
            <input
              type="text"
              value={course.slug}
              onChange={(e) => setCourse({ ...course, slug: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Price (₹)</label>
            <input
              type="number"
              value={course.price}
              onChange={(e) => setCourse({ ...course, price: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#F0C96A] font-bold text-xs focus:border-[#D6A84F] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Original Price (₹)</label>
            <input
              type="number"
              value={course.originalPrice || ''}
              onChange={(e) => setCourse({ ...course, originalPrice: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Badge</label>
            <input
              type="text"
              value={course.badge || ''}
              onChange={(e) => setCourse({ ...course, badge: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3">
          <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Course Selling Status & Availability
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              className={`p-3 rounded-xl border-2 flex items-center gap-2.5 cursor-pointer transition-all ${
                (course.status === 'LIVE' || (!course.status && course.isReadyToSell !== false))
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-bold'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 text-xs'
              }`}
            >
              <input
                type="radio"
                name="courseStatus"
                value="LIVE"
                checked={course.status === 'LIVE' || (!course.status && course.isReadyToSell !== false)}
                onChange={() => setCourse({ ...course, status: 'LIVE', isReadyToSell: true, published: true })}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-black text-xs block">🟢 LIVE</span>
                <span className="text-[10px] opacity-80 block">Ready to Watch & Sell</span>
              </div>
            </label>

            <label
              className={`p-3 rounded-xl border-2 flex items-center gap-2.5 cursor-pointer transition-all ${
                course.status === 'UPCOMING' || course.isReadyToSell === false
                  ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 text-xs'
              }`}
            >
              <input
                type="radio"
                name="courseStatus"
                value="UPCOMING"
                checked={course.status === 'UPCOMING' || course.isReadyToSell === false}
                onChange={() => setCourse({ ...course, status: 'UPCOMING', isReadyToSell: false, published: true })}
                className="text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-black text-xs block">⏳ UPCOMING</span>
                <span className="text-[10px] opacity-80 block">Videos Uploading / Pre-Launch</span>
              </div>
            </label>

            <label
              className={`p-3 rounded-xl border-2 flex items-center gap-2.5 cursor-pointer transition-all ${
                course.status === 'DRAFT' || course.published === false
                  ? 'border-slate-500 bg-slate-500/10 text-slate-900 dark:text-white font-bold'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 text-xs'
              }`}
            >
              <input
                type="radio"
                name="courseStatus"
                value="DRAFT"
                checked={course.status === 'DRAFT' || course.published === false}
                onChange={() => setCourse({ ...course, status: 'DRAFT', isReadyToSell: false, published: false })}
                className="text-slate-600 focus:ring-slate-500"
              />
              <div>
                <span className="font-black text-xs block">🔒 DRAFT</span>
                <span className="text-[10px] opacity-80 block">Hidden from Public</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#D6A84F]/20 cursor-pointer hover:scale-105 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Course & Status'}</span>
          </button>
        </div>
      </form>

      {/* Curriculum & Module Builder */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Course Curriculum Builder</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Organize modules and upload lesson videos.</p>
          </div>

          <button
            onClick={() => setAddingModule(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-white/10"
          >
            <Plus className="w-4 h-4 text-[#D6A84F]" />
            <span>Add Module</span>
          </button>
        </div>

        {/* Add Module Drawer */}
        {addingModule && (
          <form onSubmit={handleAddModule} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#07111F] border border-[#D6A84F]/30 flex items-center gap-3">
            <input
              type="text"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="e.g. Module 3: Advanced Funnel Automation"
              className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-bold text-xs"
            >
              Create Module
            </button>
            <button
              type="button"
              onClick={() => setAddingModule(false)}
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Modules List */}
        <div className="space-y-6">
          {course.modules?.map((mod: any, mIdx: number) => (
            <div
              key={mod.id}
              className="rounded-2xl bg-slate-50 dark:bg-[#07111F] border border-slate-200 dark:border-white/10 overflow-hidden space-y-3 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] text-xs font-bold flex items-center justify-center">
                    {mIdx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{mod.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModuleForLesson(activeModuleForLesson === mod.id ? null : mod.id)}
                    className="px-2.5 py-1 rounded-lg bg-[#D6A84F]/15 hover:bg-[#D6A84F]/25 text-[#C49339] dark:text-[#F0C96A] font-bold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Lesson</span>
                  </button>

                  <button
                    onClick={() => handleDeleteModule(mod.id)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    title="Delete Module"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add Lesson Form */}
              {activeModuleForLesson === mod.id && (
                <form
                  onSubmit={(e) => handleAddLesson(e, mod.id)}
                  className="p-4 rounded-xl bg-white dark:bg-[#0B1728] border border-[#D6A84F]/30 space-y-3"
                >
                  <h4 className="text-xs font-bold text-[#C49339] dark:text-[#F0C96A]">Add Lesson to {mod.title}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      placeholder="Lesson Title"
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#07111F] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      value={lessonVideo}
                      onChange={(e) => setLessonVideo(e.target.value)}
                      placeholder="Video URL (MP4 / Stream URL)"
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#07111F] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        value={lessonDuration}
                        onChange={(e) => setLessonDuration(e.target.value)}
                        placeholder="Duration (e.g. 18m)"
                        className="w-32 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#07111F] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
                      />
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <input
                          type="checkbox"
                          checked={lessonIsPreview}
                          onChange={(e) => setLessonIsPreview(e.target.checked)}
                          className="rounded text-[#D6A84F]"
                        />
                        <span>Free Preview</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-bold text-xs"
                      >
                        Save Lesson
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModuleForLesson(null)}
                        className="px-3 py-1.5 text-xs text-slate-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Lessons in Module */}
              <div className="space-y-1.5 pt-1">
                {mod.lessons?.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Play className="w-3.5 h-3.5 text-[#D6A84F]" />
                      <span className="text-slate-900 dark:text-white font-medium truncate">{lesson.title}</span>
                      {lesson.isPreview && (
                        <span className="px-2 py-0.5 rounded bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] text-[10px] font-bold">
                          Preview
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">{lesson.duration}</span>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

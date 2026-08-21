'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Play,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FileText,
  Download,
  ExternalLink,
  Award,
  Sparkles,
  ArrowLeft,
  ShieldAlert,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';

export default function CourseLearningPlayer() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { user, isLoading: authLoading } = useAuth();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [certificateData, setCertificateData] = useState<any | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [showLmsReviewModal, setShowLmsReviewModal] = useState(false);
  const [lmsRating, setLmsRating] = useState(5);
  const [lmsComment, setLmsComment] = useState('');
  const [isSubmittingLmsReview, setIsSubmittingLmsReview] = useState(false);
  const [lmsReviewFeedback, setLmsReviewFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openLmsReview = async () => {
    if (!course?.id) return;
    setLmsRating(5);
    setLmsComment('');
    setLmsReviewFeedback(null);
    setShowLmsReviewModal(true);

    try {
      const res = await fetch(`/api/reviews?courseId=${course.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.review) {
          setLmsRating(data.review.rating || 5);
          setLmsComment(data.review.comment || '');
        }
      }
    } catch {}
  };

  const handleLmsReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course?.id) return;
    if (!lmsComment.trim()) {
      setLmsReviewFeedback({ type: 'error', text: 'Please write a review comment' });
      return;
    }

    setIsSubmittingLmsReview(true);
    setLmsReviewFeedback(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          rating: lmsRating,
          comment: lmsComment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setLmsReviewFeedback({ type: 'success', text: 'Thank you for your feedback! Review submitted.' });
        setTimeout(() => {
          setShowLmsReviewModal(false);
        }, 1500);
      } else {
        setLmsReviewFeedback({ type: 'error', text: data.error || 'Failed to submit review' });
      }
    } catch {
      setLmsReviewFeedback({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmittingLmsReview(false);
    }
  };

  // Load course and progress
  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        const res = await fetch(`/api/courses/${slug}`);
        const data = await res.json();

        if (data.course) {
          setCourse(data.course);

          // Find initial lesson (first lesson of first module)
          if (data.course.modules?.length > 0 && data.course.modules[0].lessons?.length > 0) {
            setCurrentLesson(data.course.modules[0].lessons[0]);
          }

          // Fetch user progress
          const progRes = await fetch(`/api/courses/${slug}/progress`);
          if (progRes.ok) {
            const progData = await progRes.json();
            setCompletedLessonIds(progData.completedLessonIds || []);
            setProgressPercent(progData.progressPercent || 0);
            if (progData.certificateNumber) {
              setCertificateData({ certificateNumber: progData.certificateNumber });
            }
          }
        }
      } catch (err) {
        console.error('LMS load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  // Flatten lessons list to enable Next/Previous navigation
  const allLessons = course?.modules?.flatMap((m: any) => m.lessons) || [];
  const currentLessonIndex = allLessons.findIndex((l: any) => l.id === currentLesson?.id);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const isCurrentCompleted = currentLesson && completedLessonIds.includes(currentLesson.id);

  const toggleLessonComplete = async () => {
    if (!currentLesson) return;

    setIsUpdatingProgress(true);
    const newStatus = !isCurrentCompleted;

    try {
      const res = await fetch(`/api/courses/${slug}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          isCompleted: newStatus,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (newStatus) {
          setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
        } else {
          setCompletedLessonIds((prev) => prev.filter((id) => id !== currentLesson.id));
        }

        setProgressPercent(data.progressPercent);

        // If 100% completed, trigger confetti & modal
        if (data.isCompleted && data.certificate) {
          setCertificateData(data.certificate);
          setShowCertModal(true);
          try {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {}
        } else if (newStatus) {
          // Show practice prompt for non-final lessons
          setShowPracticeModal(true);
        }
      }
    } catch {
      alert('Failed to save progress');
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05080D] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#D6A84F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[#94A3B8]">Loading learning player...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#05080D] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Course Not Found</h2>
          <Link href="/courses" className="text-sm text-[#F0C96A] hover:underline">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Access check
  if (!course.isEnrolled && !currentLesson?.isPreview && user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#05080D] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0B1728] border border-[#D6A84F]/30 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#D6A84F]/10 text-[#F0C96A] flex items-center justify-center mx-auto border border-[#D6A84F]/30">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Enrollment Required</h2>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              You must be enrolled in <strong className="text-white">{course.title}</strong> to access this lesson.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href={`/courses/${slug}`}
              className="w-full inline-block py-3.5 rounded-xl bg-gold-gradient text-[#05080D] font-extrabold text-sm"
            >
              Enroll in Course Now →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let lessonResources = [];
  try {
    if (currentLesson?.resources) {
      lessonResources = typeof currentLesson.resources === 'string' ? JSON.parse(currentLesson.resources) : currentLesson.resources;
    }
  } catch {}

  return (
    <div className="min-h-screen bg-[#05080D] text-white flex flex-col">
      {/* Top Learning Bar */}
      <header className="h-16 bg-[#07111F] border-b border-[#D6A84F]/20 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <span className="text-white/20">|</span>

          <div className="flex flex-col min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
              {course.title}
            </h1>
            <span className="text-[10px] text-[#94A3B8] truncate">
              {currentLesson?.title || 'Welcome'}
            </span>
          </div>
        </div>

        {/* Progress and Sidebar Toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gold-gradient transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#F0C96A]">{progressPercent}% Complete</span>
          </div>

          <button
            onClick={openLmsReview}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-bold border border-white/10 hover:border-[#D6A84F]/40 transition-colors"
            title="Rate & Review Course"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline">Review</span>
          </button>

          {certificateData && (
            <Link
              href={`/verify-certificate/${certificateData.certificateNumber}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D6A84F]/20 text-[#F0C96A] text-xs font-bold border border-[#D6A84F]/30 hover:bg-[#D6A84F]/30 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certificate</span>
            </Link>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white"
            title="Toggle Curriculum Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* LMS Player Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Video Area */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Responsive Video Container */}
          <div className="w-full bg-black aspect-video max-h-[70vh] relative flex items-center justify-center shadow-2xl">
            {currentLesson?.videoUrl ? (
              (() => {
                const url = currentLesson.videoUrl as string;
                // Detect Google Drive links and convert to embed preview
                const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
                if (driveMatch) {
                  const fileId = driveMatch[1];
                  return (
                    <iframe
                      key={currentLesson.id}
                      src={`https://drive.google.com/file/d/${fileId}/preview`}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="w-full h-full"
                      style={{ border: 'none' }}
                    />
                  );
                }
                // Normal video for other URLs
                return (
                  <video
                    key={currentLesson.id}
                    src={url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                );
              })()
            ) : (
              <div className="text-center p-8 text-[#94A3B8]">
                <Play className="w-12 h-12 text-[#D6A84F] mx-auto mb-2 opacity-50" />
                <p className="text-sm">Video will appear here once loaded</p>
              </div>
            )}
          </div>

          {/* Lesson Action Controls & Notes */}
          <div className="p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
            {/* Nav controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-2">
                <button
                  disabled={!prevLesson}
                  onClick={() => prevLesson && setCurrentLesson(prevLesson)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  disabled={!nextLesson}
                  onClick={() => nextLesson && setCurrentLesson(nextLesson)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={toggleLessonComplete}
                disabled={isUpdatingProgress}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  isCurrentCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                    : 'bg-gold-gradient text-[#05080D] shadow-md shadow-[#D6A84F]/20 hover:scale-105'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCurrentCompleted ? 'Completed ✓' : 'Mark as Complete'}</span>
              </button>
            </div>

            {/* Lesson Title & Notes */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {currentLesson?.title}
              </h2>
              <p className="text-sm text-[#94A3B8] leading-relaxed whitespace-pre-line">
                {currentLesson?.description ||
                  'In this practical lesson, you will master the core frameworks step-by-step.'}
              </p>
            </div>

            {/* Downloadable Resources */}
            {lessonResources.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#0B1728] border border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D6A84F]" />
                  <span>Lesson Resources & Templates</span>
                </h4>
                <div className="space-y-2">
                  {lessonResources.map((res: any, idx: number) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-[#07111F] hover:bg-white/5 border border-white/5 text-xs text-white transition-colors"
                    >
                      <span className="font-medium">{res.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#D6A84F]" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 🎯 Practice & Reflection Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B1728] to-[#112240] border border-[#D6A84F]/20 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D6A84F] to-[#C49339] flex items-center justify-center shrink-0">
                  <span className="text-lg">🎯</span>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">Practice Before Moving Forward</h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Real learning happens when you apply what you've watched. Take 15-20 minutes to practice the concepts from this lesson before moving to the next one.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#07111F] border border-white/5 text-center space-y-1">
                  <span className="text-lg">📝</span>
                  <p className="text-[10px] text-[#F0C96A] font-bold">STEP 1</p>
                  <p className="text-[11px] text-white font-medium">Note down 3 key takeaways from this lesson</p>
                </div>
                <div className="p-3 rounded-xl bg-[#07111F] border border-white/5 text-center space-y-1">
                  <span className="text-lg">💻</span>
                  <p className="text-[10px] text-[#F0C96A] font-bold">STEP 2</p>
                  <p className="text-[11px] text-white font-medium">Try it yourself — apply what you learned</p>
                </div>
                <div className="p-3 rounded-xl bg-[#07111F] border border-white/5 text-center space-y-1">
                  <span className="text-lg">✅</span>
                  <p className="text-[10px] text-[#F0C96A] font-bold">STEP 3</p>
                  <p className="text-[11px] text-white font-medium">Mark as complete & move to next lesson</p>
                </div>
              </div>

              <p className="text-[10px] text-[#64748B] italic text-center">
                💡 Students who practice after each lesson are 3x more likely to succeed!
              </p>
            </div>
          </div>
        </div>

      {/* 🎉 Practice Celebration Modal */}
      {showPracticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-md w-full p-7 rounded-3xl bg-[#0B1728] border-2 border-[#D6A84F]/40 shadow-2xl shadow-[#D6A84F]/10 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0C96A] via-[#D6A84F] to-[#B3862D] text-[#05080D] flex items-center justify-center mx-auto shadow-lg">
              <span className="text-3xl">🌟</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">
                Great Job! Lesson Complete 🎉
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                You've finished <strong className="text-[#F0C96A]">{currentLesson?.title}</strong>. Before jumping to the next lesson, take a moment to practice!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#07111F] border border-[#D6A84F]/20 space-y-3 text-left">
              <p className="text-xs font-bold text-[#F0C96A]">✨ Quick Practice Checklist:</p>
              <ul className="space-y-2 text-xs text-[#94A3B8]">
                <li className="flex items-start gap-2">
                  <span className="text-[#D6A84F] mt-0.5">→</span>
                  <span>Did you understand the core concept? If not, re-watch key parts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D6A84F] mt-0.5">→</span>
                  <span>Open your tools and try implementing what was taught.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D6A84F] mt-0.5">→</span>
                  <span>Note any questions — you can ask in your 1:1 session!</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              {nextLesson && (
                <button
                  onClick={() => {
                    setShowPracticeModal(false);
                    setCurrentLesson(nextLesson);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-[#05080D] font-extrabold text-xs flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-[#D6A84F]/30 transition-all"
                >
                  <span>Continue to Next Lesson</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowPracticeModal(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors"
              >
                Practice First 💪
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Right Modules & Lessons Sidebar */}
        <aside
          className={`w-80 sm:w-96 bg-[#07111F] border-l border-[#D6A84F]/20 flex flex-col shrink-0 transition-all duration-300 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full absolute right-0 inset-y-0 z-20'
          }`}
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Course Curriculum</h3>
            <span className="text-xs text-[#94A3B8] font-semibold">
              {completedLessonIds.length}/{allLessons.length} Done
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {course.modules?.map((mod: any, mIdx: number) => (
              <div key={mod.id} className="p-4 space-y-2">
                <h4 className="text-xs font-bold text-[#D6A84F] uppercase tracking-wider">
                  Module {mIdx + 1}: {mod.title}
                </h4>

                <div className="space-y-1 pt-1">
                  {mod.lessons?.map((lesson: any) => {
                    const isCurrent = currentLesson?.id === lesson.id;
                    const isDone = completedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                        className={`w-full p-2.5 rounded-xl flex items-center justify-between gap-2 text-left transition-all text-xs ${
                          isCurrent
                            ? 'bg-[#D6A84F]/20 text-[#F0C96A] font-bold border border-[#D6A84F]/40'
                            : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Play className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-[#F0C96A] fill-current' : 'text-[#64748B]'}`} />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-[#64748B] shrink-0">{lesson.duration}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Course Completion & Certificate Unlock Celebration Modal */}
      {showCertModal && certificateData && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="max-w-lg w-full p-8 rounded-3xl bg-[#0B1728] border-2 border-[#D6A84F] shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F0C96A] via-[#D6A84F] to-[#B3862D] text-[#05080D] flex items-center justify-center mx-auto shadow-xl shadow-[#D6A84F]/30">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-[#D6A84F]/20 text-[#F0C96A] text-xs font-black uppercase tracking-wider">
                100% Course Completed!
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Congratulations, {user?.name}!
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8]">
                You have successfully completed all lessons in <strong className="text-white">{course.title}</strong>. Your verifiable certificate has been issued!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#07111F] border border-white/10 text-xs text-[#94A3B8]">
              <span>Certificate ID: </span>
              <strong className="text-[#F0C96A]">{certificateData.certificateNumber}</strong>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/verify-certificate/${certificateData.certificateNumber}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold-gradient text-[#05080D] font-extrabold text-xs flex items-center justify-center gap-1.5"
              >
                <span>View Verifiable Certificate</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setShowCertModal(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
              >
                Back to Lessons
              </button>
            </div>
          </div>
        </div>
      )}
      {/* LMS Student Course Review Modal */}
      {showLmsReviewModal && course && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#0B1728] border-2 border-[#D6A84F]/40 shadow-2xl space-y-5 relative text-left">
            <button
              onClick={() => setShowLmsReviewModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6A84F]/20 text-[#F0C96A] text-[11px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>COURSE FEEDBACK & RATING</span>
              </div>
              <h2 className="text-xl font-black text-white">
                Review this Masterclass
              </h2>
              <p className="text-xs font-bold text-[#F0C96A] truncate">
                {course.title}
              </p>
            </div>

            {lmsReviewFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  lmsReviewFeedback.type === 'success'
                    ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/60 border border-rose-500 text-rose-300'
                }`}
              >
                {lmsReviewFeedback.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{lmsReviewFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleLmsReviewSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Your Rating: <span className="text-[#F0C96A] font-extrabold">{lmsRating} / 5 Stars</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setLmsRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= lmsRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Share Your Experience / Feedback *
                </label>
                <textarea
                  value={lmsComment}
                  onChange={(e) => setLmsComment(e.target.value)}
                  rows={4}
                  placeholder="How was the video quality? What was your biggest breakthrough? How did Munna Bhai's guidance help you?"
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs leading-relaxed focus:border-[#D6A84F] focus:outline-none resize-none"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowLmsReviewModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLmsReview}
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-[#05080D] font-extrabold text-xs shadow-md hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  {isSubmittingLmsReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

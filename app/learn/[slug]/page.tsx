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
              <video
                key={currentLesson.id}
                src={currentLesson.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
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
          </div>
        </div>

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
    </div>
  );
}

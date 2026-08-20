'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Award,
  Infinity,
  CheckCircle2,
  Play,
  Lock,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import VideoModal from '@/components/VideoModal';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addItem } = useCart();
  const { user } = useAuth();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedPreviewVideo, setSelectedPreviewVideo] = useState<string>('');
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/courses/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.course) setCourse(data.course);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#D6A84F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-xs">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Course Not Found</h2>
        <Link
          href="/courses"
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-bold text-sm"
        >
          Explore Courses →
        </Link>
      </div>
    );
  }

  const handleInstantBuy = async () => {
    if (!user) {
      router.push(`/login?redirect=/courses/${slug}`);
      return;
    }

    if (course.isEnrolled) {
      router.push(`/learn/${slug}`);
      return;
    }

    setIsBuying(true);

    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to initiate purchase');
        setIsBuying(false);
        return;
      }

      const verifyRes = await fetch('/api/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: data.orderId,
          razorpayOrderId: data.razorpayOrderId,
          razorpayPaymentId: `pay_${Date.now()}`,
          razorpaySignature: 'simulated_sig_success',
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok) {
        router.push(`/learn/${slug}`);
      } else {
        alert(verifyData.error || 'Payment verification failed');
      }
    } catch {
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setIsBuying(false);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: course.id,
      title: course.title,
      slug: course.slug,
      price: course.price,
      originalPrice: course.originalPrice,
      thumbnail: course.thumbnail,
      itemType: 'COURSE',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-slate-900 dark:hover:text-white">Courses</Link>
        <span>/</span>
        <span className="text-[#C49339] dark:text-[#F0C96A] font-semibold truncate max-w-xs">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Main Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {course.badge && (
                <span className="px-3 py-1 rounded-full bg-pink-600 text-white font-extrabold text-xs uppercase tracking-wider">
                  {course.badge}
                </span>
              )}
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                {course.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.shortDescription}
            </p>

            {/* Metrics */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-300 pt-2 border-y border-slate-100 dark:border-white/10 py-3">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{course.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({course.reviews?.length || 320} reviews)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#D6A84F]" />
                <span>{course.totalStudents.toLocaleString('en-IN')}+ Students</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#D6A84F]" />
                <span>{course.duration}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#D6A84F]" />
                <span>{course.totalLessons} Lessons</span>
              </div>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#D6A84F] shrink-0 bg-slate-900">
                <img
                  src="/images/munna-bhai-transparent.png"
                  alt="Munna Bhai"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Course Mentor</p>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{course.instructor}</h4>
              </div>
            </div>
          </div>

          {/* What you'll learn */}
          {course.learningOutcomes?.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C49339] dark:text-[#F0C96A]" />
                <span>What You Will Master In This Course</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {course.learningOutcomes.map((outcome: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course Curriculum */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">Course Curriculum</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {course.modules?.length || 0} Modules • {course.totalLessons} Lessons • {course.duration}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {course.modules?.map((mod: any, mIdx: number) => {
                const isOpen = openModuleIndex === mIdx;
                return (
                  <div
                    key={mod.id}
                    className="rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs"
                  >
                    <button
                      onClick={() => setOpenModuleIndex(isOpen ? null : mIdx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left bg-slate-50/80 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{mod.title}</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {mod.lessons?.length || 0} Lessons
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#C49339] dark:text-[#F0C96A]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="p-2 sm:p-3 divide-y divide-slate-100 dark:divide-white/5">
                        {mod.lessons?.map((lesson: any) => (
                          <div
                            key={lesson.id}
                            className="p-3 sm:px-4 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                                {lesson.isPreview || course.isEnrolled ? (
                                  <Play className="w-3.5 h-3.5 text-[#D6A84F] fill-current" />
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </div>
                              <span className="text-slate-800 dark:text-slate-200 truncate font-medium">{lesson.title}</span>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {lesson.isPreview && (
                                <button
                                  onClick={() => {
                                    setSelectedPreviewVideo(
                                      lesson.videoUrl || course.previewVideo || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                                    );
                                    setVideoModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 rounded-md bg-[#D6A84F]/15 hover:bg-[#D6A84F]/25 text-[#C49339] dark:text-[#F0C96A] text-[11px] font-bold transition-colors"
                                >
                                  Free Preview
                                </button>
                              )}
                              <span className="text-xs text-slate-400">{lesson.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Overview */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 space-y-3 shadow-xs">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">About this Course</h3>
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {course.description}
            </div>
          </div>
        </div>

        {/* Right Sticky Checkout Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-3xl bg-white dark:bg-[#0B1728] border-2 border-slate-200 dark:border-[#D6A84F]/30 p-6 shadow-xl space-y-6">
            {/* Thumbnail Preview Trigger */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 dark:border-white/10 group">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  onClick={() => {
                    setSelectedPreviewVideo(
                      course.previewVideo || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                    );
                    setVideoModalOpen(true);
                  }}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D6A84F] to-[#C49339] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"
                  title="Watch Preview Video"
                >
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </button>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-950 dark:text-white">
                  ₹{course.price.toLocaleString('en-IN')}
                </span>
                {course.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{course.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {course.discount && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                    {course.discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-rose-500 font-semibold">
                ⚡ Instant access upon enrollment
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {course.isEnrolled ? (
                <Link
                  href={`/learn/${slug}`}
                  className="w-full py-4 rounded-xl bg-slate-900 hover:bg-[#D6A84F] dark:bg-white/10 dark:hover:bg-[#D6A84F] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Continue Learning LMS</span>
                </Link>
              ) : (
                <>
                  <button
                    onClick={handleInstantBuy}
                    disabled={isBuying}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D6A84F]/30 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {isBuying ? 'Enrolling...' : 'Buy Course Now →'}
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-xs transition-colors border border-slate-200 dark:border-white/5"
                  >
                    Add To Cart
                  </button>
                </>
              )}
            </div>

            {/* Inclusions */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Infinity className="w-4 h-4 text-[#D6A84F]" />
                <span>Full Lifetime Access</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#D6A84F]" />
                <span>Verifiable Certificate of Completion</span>
              </div>
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[#D6A84F]" />
                <span>Downloadable Notion Templates & Cheatsheets</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#D6A84F]" />
                <span>100% Secure Checkout via UPI / Cards</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={selectedPreviewVideo || course.previewVideo || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
        title={`${course.title} • Free Preview`}
      />
    </div>
  );
}

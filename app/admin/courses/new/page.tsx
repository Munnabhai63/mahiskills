'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, Plus, Trash2 } from 'lucide-react';

export default function NewCoursePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('4999');
  const [originalPrice, setOriginalPrice] = useState('9999');
  const [category, setCategory] = useState('Social Media & Growth');
  const [level, setLevel] = useState('All Levels');
  const [badge, setBadge] = useState('Bestseller');
  const [duration, setDuration] = useState('12+ Hours');
  const [instructor, setInstructor] = useState('Munna Bhai');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop');
  const [previewVideo, setPreviewVideo] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [published, setPublished] = useState(true);
  const [status, setStatus] = useState('LIVE');

  // Arrays
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([
    'Master high-income digital growth strategies',
    'Execute step-by-step practical workflows',
  ]);
  const [requirements, setRequirements] = useState<string[]>([
    'Smartphone or computer with internet access',
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          shortDescription,
          description,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : null,
          category,
          level,
          badge,
          duration,
          instructor,
          thumbnail,
          previewVideo,
          published,
          status,
          isReadyToSell: status === 'LIVE',
          learningOutcomes,
          requirements,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to create course');
        setIsSubmitting(false);
        return;
      }

      router.push(`/admin/courses/${data.course.id}`);
    } catch {
      alert('Error creating course');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/courses"
          className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Link>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Create New Course</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 space-y-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. YouTube Growth & Monetization"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. youtube-growth-monetization"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Short Description (Cards & Previews)</label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="One-line punchy description..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Course Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed course overview and curriculum explanation..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Selling Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-[#C49339] dark:text-[#F0C96A] font-bold text-xs focus:border-[#D6A84F] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Original Price (₹)</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Badge</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Bestseller, New"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none font-medium"
            >
              <option value="Social Media & Growth">Social Media & Growth</option>
              <option value="Video Creation & Monetization">Video Creation & Monetization</option>
              <option value="Digital Marketing & Sales">Digital Marketing & Sales</option>
              <option value="Freelancing & Career">Freelancing & Career</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Skill Level</label>
            <input
              type="text"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 14+ Hours"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Thumbnail Image URL</label>
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Preview Video URL</label>
            <input
              type="text"
              value={previewVideo}
              onChange={(e) => setPreviewVideo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
            />
          </div>
        </div>

        {/* Course Status Selector */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3">
          <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Initial Selling Status
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              className={`p-3 rounded-xl border-2 flex items-center gap-2.5 cursor-pointer transition-all ${
                status === 'LIVE'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-bold'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 text-xs'
              }`}
            >
              <input
                type="radio"
                name="newCourseStatus"
                value="LIVE"
                checked={status === 'LIVE'}
                onChange={() => {
                  setStatus('LIVE');
                  setPublished(true);
                }}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-black text-xs block">🟢 LIVE</span>
                <span className="text-[10px] opacity-80 block">Ready to Watch & Sell</span>
              </div>
            </label>

            <label
              className={`p-3 rounded-xl border-2 flex items-center gap-2.5 cursor-pointer transition-all ${
                status === 'UPCOMING'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 text-xs'
              }`}
            >
              <input
                type="radio"
                name="newCourseStatus"
                value="UPCOMING"
                checked={status === 'UPCOMING'}
                onChange={() => {
                  setStatus('UPCOMING');
                  setPublished(true);
                }}
                className="text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-black text-xs block">⏳ UPCOMING</span>
                <span className="text-[10px] opacity-80 block">Videos Uploading / Pre-Launch</span>
              </div>
            </label>

            <label
              className={`p-3 rounded-xl border-2 flex items-center gap-2.5 cursor-pointer transition-all ${
                status === 'DRAFT'
                  ? 'border-slate-500 bg-slate-500/10 text-slate-900 dark:text-white font-bold'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 text-xs'
              }`}
            >
              <input
                type="radio"
                name="newCourseStatus"
                value="DRAFT"
                checked={status === 'DRAFT'}
                onChange={() => {
                  setStatus('DRAFT');
                  setPublished(false);
                }}
                className="text-slate-600 focus:ring-slate-500"
              />
              <div>
                <span className="font-black text-xs block">🔒 DRAFT</span>
                <span className="text-[10px] opacity-80 block">Hidden from Public</span>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#D6A84F]/20 disabled:opacity-50 hover:scale-105 transition-transform"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Course...' : 'Save & Build Modules →'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

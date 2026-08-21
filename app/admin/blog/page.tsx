'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  FileText,
  CheckCircle2,
  Sparkles,
  Search,
  Globe,
  Tag,
  Zap,
} from 'lucide-react';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New/Edit Post Form
  const [showForm, setShowForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Instagram Growth');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop');
  const [readTime, setReadTime] = useState('6 min read');
  const [tagsInput, setTagsInput] = useState('Instagram, Virality, Reels, Growth');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = () => {
    fetch('/api/admin/blog')
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) setPosts(data.posts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPostId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
      if (!seoTitle) setSeoTitle(`${val} | MAHI SKILLS`);
    }
  };

  const handleExcerptChange = (val: string) => {
    setExcerpt(val);
    if (!seoDescription) setSeoDescription(val);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      id: editingPostId || undefined,
      title,
      slug,
      category,
      excerpt,
      content,
      coverImage,
      readTime,
      tags: JSON.stringify(tagsArray),
      seoTitle: seoTitle || `${title} | MAHI SKILLS`,
      seoDescription: seoDescription || excerpt,
      isPublished,
    };

    try {
      const res = await fetch('/api/admin/blog', {
        method: editingPostId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingPostId(null);
        resetForm();
        fetchPosts();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save post');
      }
    } catch {
      alert('Error saving post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setCategory('Instagram Growth');
    setExcerpt('');
    setContent('');
    setCoverImage('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop');
    setReadTime('6 min read');
    setTagsInput('Digital Growth, Online Income, Strategy');
    setSeoTitle('');
    setSeoDescription('');
    setIsPublished(true);
  };

  const startEdit = (post: any) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage);
    setReadTime(post.readTime);
    setSeoTitle(post.seoTitle || '');
    setSeoDescription(post.seoDescription || '');
    setIsPublished(post.isPublished);

    try {
      if (post.tags) {
        const parsed = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags;
        setTagsInput(Array.isArray(parsed) ? parsed.join(', ') : post.tags);
      }
    } catch {
      setTagsInput(post.tags || '');
    }

    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article permanently?')) return;
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchPosts();
    } catch {
      alert('Error deleting post');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">Blog CMS & SEO Engine</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Write high-ranking educational guides with automatic Google Schema, OpenGraph, and rich formatting.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPostId(null);
            resetForm();
            setShowForm(!showForm);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#D6A84F]/20 hover:scale-105 transition-transform shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Write New SEO Article</span>
        </button>
      </div>

      {/* Editor Form */}
      {showForm && (
        <form onSubmit={handleSavePost} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1728] border-2 border-slate-200 dark:border-[#D6A84F]/40 space-y-6 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D6A84F]/10 text-[#C49339] dark:text-[#F0C96A] text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SEO CONTENT PUBLISHER</span>
              </div>
              <h3 className="text-lg font-black text-slate-950 dark:text-white">
                {editingPostId ? 'Edit Article & SEO Settings' : 'Compose New SEO Article'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              Cancel
            </button>
          </div>

          {/* Section 1: Main Content */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Article Title (H1) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. How to Earn ₹50,000/Month from Whop Clipping"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:border-[#D6A84F] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Slug (Auto-generated) *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. how-to-earn-50000-month-whop-clipping"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono focus:border-[#D6A84F] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium focus:border-[#D6A84F] focus:outline-none"
                >
                  <option value="Instagram Growth">Instagram Growth</option>
                  <option value="Whop & Clipping">Whop & Clipping</option>
                  <option value="Freelancing">Freelancing</option>
                  <option value="YouTube Growth">YouTube Growth</option>
                  <option value="WhatsApp Marketing">WhatsApp Marketing</option>
                  <option value="Monetization">Monetization</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cover Image URL *</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Read Time</label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g. 6 min read"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Excerpt / Article Summary (Shown on Google snippet & card) *
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => handleExcerptChange(e.target.value)}
                placeholder="2-3 sentence engaging summary explaining the key breakthrough of this article..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none resize-none"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Article Body (Markdown Headings `##`, `###`, Lists `-`, Pro Tips `&gt; ` Supported) *
                </label>
                <span className="text-[11px] text-[#C49339] dark:text-[#F0C96A] font-semibold">
                  Supports TOC, Callout Boxes & Headings
                </span>
              </div>
              <textarea
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="## 1. The Core Strategy&#10;&#10;Explain the framework here...&#10;&#10;> Pro Tip: Always test your video hook in the first 3 seconds.&#10;&#10;## 2. Step-by-Step Action Plan&#10;&#10;- Step 1: Find viral clips&#10;- Step 2: Edit in CapCut&#10;- Step 3: Publish with high-converting CTA"
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono leading-relaxed focus:border-[#D6A84F] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                SEO Tags / Focus Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Whop Clipping, Video Editing, Passive Income, Creator Economy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Google Search Snippet Preview & Meta Settings */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-[#C49339] dark:text-[#F0C96A] uppercase tracking-wider">
              <Globe className="w-4 h-4" />
              <span>Google Search Result Snippet Preview</span>
            </div>

            {/* Simulated Google Search Card */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#07111F] border border-slate-200 dark:border-white/10 space-y-1 font-sans shadow-xs">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>https://mahiskills.in</span>
                <span>›</span>
                <span>blog</span>
                <span>›</span>
                <span className="text-slate-400">{slug || 'your-slug'}</span>
              </div>
              <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
                {seoTitle || (title ? `${title} | MAHI SKILLS` : 'Article Title Preview | MAHI SKILLS')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {seoDescription || excerpt || 'This is how your article summary and meta description will appear on Google search results...'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Custom SEO Title Tag (Optional)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. Whop Clipping Guide 2026 | MAHI SKILLS"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Custom SEO Meta Description (Optional)
                </label>
                <input
                  type="text"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="150-160 characters search preview description..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Publish Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-[#D6A84F] focus:ring-[#D6A84F]"
              />
              <span>Publish Article Live on `mahiskills.in/blog`</span>
            </label>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs shadow-md shadow-[#D6A84F]/20 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Saving Article...' : editingPostId ? 'Update Article' : 'Publish SEO Article'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Posts Table */}
      <div className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-4">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Read Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Published Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-14 h-9 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-200 dark:border-white/10">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white max-w-sm truncate">{p.title}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">/blog/{p.slug}</span>
                    </div>
                  </td>

                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{p.category}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{p.readTime}</td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        p.isPublished
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                      }`}
                    >
                      {p.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>

                  <td className="p-4 text-slate-500 dark:text-slate-400">
                    {new Date(p.publishedAt || p.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>

                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white inline-block"
                      title="View Article Live"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => startEdit(p)}
                      className="p-1.5 rounded-lg bg-[#D6A84F]/20 hover:bg-[#D6A84F]/30 text-[#C49339] dark:text-[#F0C96A]"
                      title="Edit Article & SEO"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-500/20 hover:bg-rose-200 dark:hover:bg-rose-500/30 text-rose-600 dark:text-rose-400"
                      title="Delete Article"
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

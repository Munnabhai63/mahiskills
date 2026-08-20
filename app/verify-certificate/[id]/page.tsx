'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Download,
  Share2,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Copy,
  Printer,
  Sparkles,
} from 'lucide-react';
import FounderSignature from '@/components/FounderSignature';

export default function VerifyCertificatePage() {
  const params = useParams();
  const certId = params?.id as string;

  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!certId) return;

    fetch(`/api/certificates/${certId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.certificate) setCert(data.certificate);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [certId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#D6A84F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-xs">Verifying certificate credentials...</p>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Certificate Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested certificate ID <strong className="text-slate-800 dark:text-slate-200">{certId}</strong> was not found in the official registry.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const publicUrl = typeof window !== 'undefined' ? window.location.href : `https://mahiskills.in/verify-certificate/${cert.certificateNumber}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(publicUrl)}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:py-0 print:px-0">
      {/* Top Verification Status Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm print:hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                OFFICIALLY VERIFIED CREDENTIAL
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-emerald-950 dark:text-emerald-200 font-medium">
              Certificate <strong className="font-mono text-emerald-900 dark:text-emerald-100">{cert.certificateNumber}</strong> is authentic and recorded in the MAHI SKILLS registry.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Copy className="w-3.5 h-3.5 text-[#D6A84F]" />
            <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#D6A84F]/30 hover:scale-105 transition-transform"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* ULTRA-PROFESSIONAL PRINTABLE CERTIFICATE CARD */}
      <div className="relative rounded-3xl bg-[#FAF8F5] text-slate-900 border-[10px] border-[#07111F] p-8 sm:p-14 shadow-2xl overflow-hidden print:border-none print:shadow-none print:p-8">
        {/* Inner Guilloche Gold Border */}
        <div className="absolute inset-3 sm:inset-4 border-2 border-[#D6A84F] pointer-events-none rounded-xl" />
        <div className="absolute inset-5 sm:inset-6 border border-[#D6A84F]/40 pointer-events-none rounded-lg" />

        {/* Corner Ornaments */}
        <div className="absolute top-7 left-7 text-[#D6A84F] text-2xl font-serif select-none pointer-events-none">❖</div>
        <div className="absolute top-7 right-7 text-[#D6A84F] text-2xl font-serif select-none pointer-events-none">❖</div>
        <div className="absolute bottom-7 left-7 text-[#D6A84F] text-2xl font-serif select-none pointer-events-none">❖</div>
        <div className="absolute bottom-7 right-7 text-[#D6A84F] text-2xl font-serif select-none pointer-events-none">❖</div>

        {/* Subtle Watermark Logo in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-[180px] font-black tracking-widest text-[#07111F]">MAHI</span>
        </div>

        <div className="relative z-10 text-center space-y-7 sm:space-y-9">
          {/* Certificate Header Crest */}
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-[#D6A84F] border-2 border-[#D6A84F] flex items-center justify-center font-black text-2xl mx-auto shadow-md">
              M
            </div>
            <h3 className="text-sm font-black tracking-[0.25em] text-[#07111F] uppercase font-sans">
              MAHI SKILLS ACADEMY
            </h3>
            <p className="text-[10px] tracking-[0.3em] text-[#B3862D] uppercase font-bold">
              VERIFIED DIGITAL EDUCATION CREDENTIAL
            </p>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-wider text-[#07111F] uppercase">
              Certificate of Achievement
            </h1>
            <div className="w-36 h-0.5 bg-gradient-to-r from-transparent via-[#D6A84F] to-transparent mx-auto" />
          </div>

          {/* Body Certification Statement */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm tracking-widest text-slate-600 uppercase font-medium">
              THIS IS PROUDLY PRESENTED TO
            </p>

            <h2 className="text-3xl sm:text-5xl font-black text-[#07111F] font-serif border-b-2 border-[#D6A84F]/60 pb-2 px-6 inline-block">
              {cert.studentName}
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans pt-2">
              for successfully completing all curriculum modules, practical assessments, and demonstrating mastery in
            </p>

            <h3 className="text-xl sm:text-2xl font-black text-[#8C6219] font-sans">
              {cert.courseName}
            </h3>
          </div>

          {/* Bottom Signatures, Gold Seal & QR Code */}
          <div className="pt-6 sm:pt-10 border-t border-[#D6A84F]/40 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            {/* Left: Issue Date & Unique ID */}
            <div className="text-center sm:text-left space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Issue Date: <span className="text-slate-900 font-extrabold">{new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </p>
              <p className="text-[10px] font-mono text-slate-500 font-bold">
                Certificate ID: <span className="text-[#8C6219] font-black">{cert.certificateNumber}</span>
              </p>
            </div>

            {/* Center: Embossed Golden Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F0C96A] via-[#D6A84F] to-[#B3862D] p-1 shadow-xl flex items-center justify-center border-2 border-white">
                <div className="w-full h-full rounded-full border-2 border-dashed border-[#05080D]/40 flex flex-col items-center justify-center text-[#05080D] p-1 text-center">
                  <span className="text-[7px] font-black uppercase tracking-tighter">★ MAHI SKILLS ★</span>
                  <span className="text-[9px] font-black tracking-widest leading-none">VERIFIED</span>
                  <span className="text-[7px] font-bold">EXCELLENCE</span>
                </div>
              </div>
            </div>

            {/* Right: Signature & QR Code */}
            <div className="flex items-center justify-center sm:justify-end gap-4">
              <div className="text-center sm:text-right space-y-0.5">
                <div className="flex justify-center sm:justify-end">
                  <FounderSignature className="h-12 w-36 sm:h-14 sm:w-44 text-[#07111F]" />
                </div>
                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-slate-400 to-slate-600 mx-auto sm:ml-auto" />
                <p className="text-[11px] font-black text-slate-900 tracking-wide">Munna Bhai</p>
                <p className="text-[9px] text-[#8C6219] uppercase tracking-wider font-extrabold">
                  Founder & Lead Mentor
                </p>
              </div>

              {/* QR Code */}
              <div className="w-16 h-16 rounded-lg bg-white p-1 border border-slate-300 shadow-sm shrink-0">
                <img
                  src={qrCodeUrl}
                  alt="Certificate QR Verification"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, ExternalLink } from 'lucide-react';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/certificates')
      .then((res) => res.json())
      .then((data) => {
        if (data.certificates) setCertificates(data.certificates);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading certificates registry...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Issued Certificates Registry</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Auditable list of all earned student certificates.</p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-4">Certificate ID</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Course Completed</th>
                <th className="p-4">Instructor</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#C49339] dark:text-[#F0C96A]">{cert.certificateNumber}</td>

                  <td className="p-4 font-bold text-slate-900 dark:text-white">{cert.studentName}</td>

                  <td className="p-4 text-slate-900 dark:text-white font-medium">{cert.courseName}</td>

                  <td className="p-4 text-slate-600 dark:text-slate-400">{cert.instructorName || 'Munna Bhai'}</td>

                  <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(cert.issueDate).toLocaleDateString()}</td>

                  <td className="p-4 text-right">
                    <Link
                      href={`/verify-certificate/${cert.certificateNumber}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] hover:bg-[#D6A84F]/30 text-xs font-bold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Verify Public</span>
                    </Link>
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

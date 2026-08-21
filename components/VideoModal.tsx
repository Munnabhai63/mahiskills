'use client';

import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-[#07111F] rounded-3xl border border-[#D6A84F]/30 overflow-hidden shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0B1728]">
          <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-video bg-black flex items-center justify-center">
          {(() => {
            if (!videoUrl) {
              return <p className="text-sm text-slate-400">No video preview available</p>;
            }

            // Google Drive embed preview
            const driveMatch = videoUrl.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
            if (driveMatch) {
              return (
                <iframe
                  src={`https://drive.google.com/file/d/${driveMatch[1]}/preview`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="w-full h-full"
                  style={{ border: 'none' }}
                />
              );
            }

            // YouTube embed
            const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            if (ytMatch) {
              return (
                <iframe
                  src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  style={{ border: 'none' }}
                />
              );
            }

            // Standard video
            return (
              <video
                src={videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            );
          })()}
        </div>
      </div>
    </div>
  );
}

import React from 'react';

interface FounderSignatureProps {
  className?: string;
  color?: string;
}

export default function FounderSignature({
  className = 'h-14 w-44',
  color = '#0B1728',
}: FounderSignatureProps) {
  return (
    <div className={`inline-block select-none ${className}`}>
      <svg
        viewBox="0 0 280 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Main Fluid Executive Signature Strokes */}
        {/* Initial M Capital Flourish */}
        <path
          d="M18 62 C 22 42, 28 15, 36 12 C 44 9, 48 24, 46 48 C 44 60, 52 22, 60 16 C 68 10, 74 26, 72 52 C 70 60, 80 44, 88 40"
          stroke={color}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 'unna' loop connections */}
        <path
          d="M86 42 C 92 34, 98 48, 104 42 C 110 36, 116 48, 122 40 C 128 34, 134 46, 140 38 C 146 32, 152 44, 158 36"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 'Bhai' B capital sweep & loop */}
        <path
          d="M165 58 C 170 38, 175 14, 184 10 C 194 6, 202 18, 196 32 C 190 44, 178 46, 186 52 C 196 58, 214 44, 222 36 C 230 28, 236 42, 244 34 C 252 26, 260 38, 268 28"
          stroke={color}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Fast Executive Pen Tail Flourish (Choudhary accent) */}
        <path
          d="M32 68 C 80 66, 160 68, 248 54 C 265 51, 274 42, 266 38"
          stroke={color}
          strokeWidth="2.0"
          strokeLinecap="round"
        />
        {/* Subtle Gold Accent Stroke */}
        <path
          d="M50 72 C 110 74, 180 70, 255 58"
          stroke="#D6A84F"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="2 2"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import AppWrapper from '@/components/AppWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mahiskills.in'),
  title: {
    default: 'MAHI SKILLS | Learn In-Demand Skills. Build Your Future. Earn Without Limits.',
    template: '%s | MAHI SKILLS',
  },
  description:
    'Master high-income digital skills, Instagram growth, YouTube monetization, WhatsApp marketing, and freelancing directly from Munna Bhai. Practical courses and 1:1 mentorship.',
  keywords: [
    'Mahi Skills',
    'Munna Bhai',
    'Instagram Growth Mastery',
    'YouTube Monetization Course',
    'WhatsApp Marketing',
    'Freelancing in India',
    'Digital Skills',
    'Online Earning',
    'Creator Accelerator',
  ],
  authors: [{ name: 'Munna Bhai', url: 'https://mahiskills.in' }],
  creator: 'Munna Bhai',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://mahiskills.in',
    title: 'MAHI SKILLS | Learn In-Demand Skills. Build Your Future. Earn Without Limits.',
    description:
      'Practical digital skills, online growth strategies, and 1:1 personal mentorship from Munna Bhai at Mahi Skills.',
    siteName: 'MAHI SKILLS',
    images: [
      {
        url: '/images/hero-design-ref.jpg',
        width: 1200,
        height: 630,
        alt: 'MAHI SKILLS Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAHI SKILLS | Learn In-Demand Skills. Build Your Future. Earn Without Limits.',
    description:
      'Practical digital skills, online growth strategies, and 1:1 personal mentorship from Munna Bhai at Mahi Skills.',
    images: ['/images/hero-design-ref.jpg'],
    creator: '@mahiskills',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} min-h-screen bg-[#05080D] text-[#F8FAFC] antialiased selection:bg-[#D6A84F]/30 selection:text-white flex flex-col justify-between`}>
        <AuthProvider>
          <CartProvider>
            <AppWrapper>{children}</AppWrapper>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

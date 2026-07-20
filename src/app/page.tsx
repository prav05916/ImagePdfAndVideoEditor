import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'ShivanshStudio - All-in-One Image Editor & Design Platform',
  description: 'Create stunning wedding cards, edit images, generate social media posts, and make passport size photos for government exams with ShivanshStudio. Free online design tools with Hindi & English support.',
  keywords: ['image editor', 'wedding card generator', 'invitation maker', 'social media post', 'background remover', 'quote poster', 'resume photo enhancer', 'online design tool', 'passport size photo maker', 'passport photo editor', 'exam photo creator'],
  authors: [{ name: 'ShivanshStudio Team' }],
  openGraph: {
    title: 'ShivanshStudio - Premium Creative Suite',
    description: 'Create stunning wedding cards, edit videos, enhance images, and generate social media posts.',
    url: 'https://www.shivansh-studio.store',
    siteName: 'ShivanshStudio',
    images: [
      { 
        url: '/og-image.png', 
        width: 1200, 
        height: 630,
        alt: 'ShivanshStudio Platform Preview'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShivanshStudio - Premium Creative Suite',
    description: 'Create stunning wedding cards, edit videos, enhance images, and generate social media posts.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ShivanshStudio",
            "url": "https://www.shivansh-studio.store",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.shivansh-studio.store/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }),
        }}
      />
      <DashboardClient />
    </>
  );
}

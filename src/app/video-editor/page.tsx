import type { Metadata } from 'next';
import VideoEditorClient from './VideoEditorClient';

export const metadata: Metadata = {
  title: 'Free Online Video Editor – Trim, Merge, Add Effects & Edit Videos in Browser | ShivanshStudio',
  description: 'Edit videos online for free — no download or software needed. Trim video clips, merge multiple videos, add text overlays, apply filters, and create social media-ready content directly in your browser. Works on mobile and desktop. Fast & easy video editor.',
  keywords: [
    'free online video editor',
    'trim video online free',
    'merge videos online free',
    'browser video editor no download',
    'video editing tool free india',
    'online video maker free',
    'add text to video online',
    'video filter online free',
    'social media video editor online',
    'youtube video editor free',
    'instagram reel editor online',
    'video cutter online free india',
    'edit video without software',
    'mobile video editor online',
    'shivanshstudio video editor',
  ],
  authors: [{ name: 'ShivanshStudio', url: 'https://www.shivansh-studio.store' }],
  creator: 'ShivanshStudio',
  publisher: 'ShivanshStudio',
  alternates: {
    canonical: 'https://www.shivansh-studio.store/video-editor',
  },
  openGraph: {
    title: 'Free Online Video Editor – Trim, Merge & Edit Videos in Browser | ShivanshStudio',
    description: 'Edit videos in your browser for free. Trim, merge, add effects & text overlays. Perfect for YouTube, Instagram Reels, and WhatsApp videos. No download needed.',
    url: 'https://www.shivansh-studio.store/video-editor',
    siteName: 'ShivanshStudio',
    images: [
      {
        url: 'https://www.shivansh-studio.store/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShivanshStudio Free Online Video Editor – Trim, Merge & Edit Videos',
        type: 'image/png',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Video Editor – Trim, Merge & Edit Videos in Browser',
    description: 'Edit videos online free — trim, merge, add text & effects. No download. Works for YouTube, Instagram & WhatsApp.',
    images: ['https://www.shivansh-studio.store/og-image.png'],
    creator: '@shivanshstudio',
    site: '@shivanshstudio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": "https://www.shivansh-studio.store/video-editor#webpage",
                "url": "https://www.shivansh-studio.store/video-editor",
                "name": "Free Online Video Editor – Trim, Merge, Add Effects & Edit Videos in Browser",
                "isPartOf": { "@id": "https://www.shivansh-studio.store/#website" },
                "inLanguage": "en-IN",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.shivansh-studio.store" },
                    { "@type": "ListItem", "position": 2, "name": "Video Editor", "item": "https://www.shivansh-studio.store/video-editor" }
                  ]
                }
              },
              {
                "@type": "SoftwareApplication",
                "name": "Online Video Editor",
                "url": "https://www.shivansh-studio.store/video-editor",
                "operatingSystem": "Web",
                "applicationCategory": "MultimediaApplication",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
                "description": "Free browser-based video editor. Trim, merge, add text overlays, apply filters, and create social media videos without any download.",
                "publisher": { "@id": "https://www.shivansh-studio.store/#organization" }
              }
            ]
          }),
        }}
      />
      <VideoEditorClient />
    </>
  );
}

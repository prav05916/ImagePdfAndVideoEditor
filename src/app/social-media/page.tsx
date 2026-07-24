import type { Metadata } from 'next';
import SocialMediaClient from './SocialMediaClient';

export const metadata: Metadata = {
  title: 'Free Social Media Post Maker – Design for Instagram, Facebook, WhatsApp & More | ShivanshStudio',
  description: 'Create stunning social media posts, stories, and banners online for free. Professional templates for Instagram Reels covers, Facebook posts, WhatsApp Status, Twitter/X posts, and YouTube thumbnails. No design experience needed. Share instantly.',
  keywords: [
    'social media post maker free',
    'instagram post creator online free',
    'facebook post designer free',
    'whatsapp status maker online',
    'youtube thumbnail maker free',
    'social media banner creator',
    'instagram story maker free',
    'twitter post creator online',
    'facebook cover photo maker',
    'social media graphic design free',
    'online post maker india',
    'free social media template india',
    'instagram reel cover maker',
    'digital marketing post maker',
    'create social media graphics free',
  ],
  authors: [{ name: 'ShivanshStudio', url: 'https://www.shivansh-studio.store' }],
  creator: 'ShivanshStudio',
  publisher: 'ShivanshStudio',
  alternates: {
    canonical: 'https://www.shivansh-studio.store/social-media',
  },
  openGraph: {
    title: 'Free Social Media Post Maker – Instagram, Facebook, WhatsApp & YouTube | ShivanshStudio',
    description: 'Create professional social media posts, stories & banners in minutes. Templates for Instagram, Facebook, WhatsApp, Twitter & YouTube. 100% free, no signup.',
    url: 'https://www.shivansh-studio.store/social-media',
    siteName: 'ShivanshStudio',
    images: [
      {
        url: 'https://www.shivansh-studio.store/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShivanshStudio Social Media Post Maker – Free Design Tool for Instagram, Facebook & WhatsApp',
        type: 'image/png',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Social Media Post Maker – Instagram, Facebook & WhatsApp',
    description: 'Create professional social media posts & stories free — templates for Instagram, Facebook, WhatsApp, YouTube & more.',
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
                "@id": "https://www.shivansh-studio.store/social-media#webpage",
                "url": "https://www.shivansh-studio.store/social-media",
                "name": "Free Social Media Post Maker – Design for Instagram, Facebook, WhatsApp & More",
                "isPartOf": { "@id": "https://www.shivansh-studio.store/#website" },
                "inLanguage": "en-IN",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.shivansh-studio.store" },
                    { "@type": "ListItem", "position": 2, "name": "Social Media Post Maker", "item": "https://www.shivansh-studio.store/social-media" }
                  ]
                }
              },
              {
                "@type": "SoftwareApplication",
                "name": "Social Media Post Maker",
                "url": "https://www.shivansh-studio.store/social-media",
                "operatingSystem": "Web",
                "applicationCategory": "DesignApplication",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
                "description": "Free social media graphic design tool. Create posts, stories and banners for Instagram, Facebook, WhatsApp, YouTube and Twitter instantly.",
                "publisher": { "@id": "https://www.shivansh-studio.store/#organization" }
              }
            ]
          }),
        }}
      />
      <SocialMediaClient />
    </>
  );
}

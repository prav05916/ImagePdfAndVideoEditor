import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'PixelCraft Studio - All-in-One Image Editor & Design Platform',
  description: 'Create stunning wedding cards, edit images, generate social media posts, and more with PixelCraft Studio. Free online design tools with Hindi & English support.',
  keywords: ['image editor', 'wedding card generator', 'invitation maker', 'social media post', 'background remover', 'quote poster', 'resume photo enhancer', 'online design tool'],
  openGraph: {
    title: 'PixelCraft Studio - All-in-One Image Editor & Design Platform',
    description: 'Create stunning wedding cards, edit images, generate social media posts, and more.',
    url: 'https://pixelcraft.studio',
    siteName: 'PixelCraft Studio',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
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
            "@type": "WebSite",
            "name": "PixelCraft Studio",
            "url": "https://pixelcraft.studio",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://pixelcraft.studio/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }),
        }}
      />
      <DashboardClient />
    </>
  );
}

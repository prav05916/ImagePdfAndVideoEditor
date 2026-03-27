import type { Metadata } from 'next';
import QuotePosterClient from './QuotePosterClient';

export const metadata: Metadata = {
  title: 'Quote Poster Maker - Create Inspirational Designs & Posters Online',
  description: 'Turn your favorite quotes into beautiful posters. Customize fonts, backgrounds, and styles. Perfect for social media, wall art, and sharing motivation online. Free quote designer.',
  keywords: ['quote maker online', 'inspirational poster designer', 'instagram quote creator', 'poster maker online', 'quote design tool', 'create quote posters free', 'motivational quote maker'],
  openGraph: {
    title: 'Quote Poster Maker - Create Inspirational Designs Online',
    description: 'Transform your words into beautiful designs. Perfect for sharing and printing.',
    images: [{ url: '/og-quote-poster.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://pixelcraft.studio/quote-poster',
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
            "@type": "SoftwareApplication",
            "name": "Quote Poster Maker",
            "operatingSystem": "Web",
            "applicationCategory": "DesignApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Transform your words into beautiful designs. Perfect for sharing and printing."
          }),
        }}
      />
      <QuotePosterClient />
    </>
  );
}

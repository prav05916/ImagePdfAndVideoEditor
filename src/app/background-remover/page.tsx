import type { Metadata } from 'next';
import BackgroundRemoverClient from './BackgroundRemoverClient';

export const metadata: Metadata = {
  title: 'AI Background Remover - Remove Image Background Online Free & Fast',
  description: 'Remove background from any image for free using AI. Get high-quality transparent backgrounds in seconds. Perfect for product photos, portraits, and eCommerce.',
  keywords: ['AI background remover', 'remove bg free', 'transparent background maker', 'image background removal', 'online bg remover', 'remove background AI', 'free photo background remover'],
  openGraph: {
    title: 'AI Background Remover - Remove Image Background Instantly',
    description: 'High-quality background removal using AI. Free, fast, and accurate.',
    images: [{ url: '/og-bg-remover.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://pixelcraft.studio/background-remover',
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
            "name": "AI Background Remover",
            "operatingSystem": "Web",
            "applicationCategory": "DesignApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "High-quality background removal using AI. Free, fast, and accurate."
          }),
        }}
      />
      <BackgroundRemoverClient />
    </>
  );
}

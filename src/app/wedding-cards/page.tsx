import type { Metadata } from 'next';
import WeddingCardsClient from './WeddingCardsClient';

export const metadata: Metadata = {
  title: 'Wedding Invitation Card Maker - Create Traditional & Modern Cards Online',
  description: 'Design beautiful Indian wedding invitation cards online. Choose from traditional, royal, floral, and vintage templates. Download in PNG or PDF. Hindi & English support. Best free digital shaadi card maker.',
  keywords: ['wedding invitation maker', 'Indian wedding cards', 'digital shaadi card', 'Hindi wedding invitation', 'wedding card design online', 'marriage invitation maker', 'free wedding cards', 'traditional wedding cards'],
  openGraph: {
    title: 'Wedding Invitation Card Maker - Create Traditional & Modern Cards',
    description: 'Design beautiful Indian wedding invitation cards online. Traditional, Royal, Floral, and Vintage styles for your special day.',
    images: [{ url: '/og-wedding-cards.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://pixelcraft.studio/wedding-cards',
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
            "name": "Wedding Invitation Maker",
            "operatingSystem": "Web",
            "applicationCategory": "DesignApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Design beautiful Indian wedding invitation cards online. Traditional, Royal, Floral, and Vintage styles."
          }),
        }}
      />
      <WeddingCardsClient />
    </>
  );
}

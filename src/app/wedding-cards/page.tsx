import type { Metadata } from 'next';
import WeddingCardsClient from './WeddingCardsClient';

export const metadata: Metadata = {
  title: 'Indian Wedding Card Generator - Free Invitation Maker | ShivanshStudio',
  description: 'Create beautiful, customizable Indian wedding cards online in minutes. Support for Hindi & English templates. Share instantly via WhatsApp.',
  keywords: ['wedding card generator', 'indian wedding invitations', 'hindi wedding card maker', 'free shaadi cards', 'digital wedding invites', 'customizable wedding templates', 'whatsapp wedding invitation'],
  openGraph: {
    title: 'Indian Wedding Card Generator - Free Invitation Maker',
    description: 'Create beautiful, customizable Indian wedding cards online in minutes.',
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.shivansh-studio.store/wedding-cards',
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
            "@type": "WebApplication",
            "name": "Wedding Card Generator",
            "url": "https://www.shivansh-studio.store/wedding-cards",
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

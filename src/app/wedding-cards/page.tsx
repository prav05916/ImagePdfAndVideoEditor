import type { Metadata } from 'next';
import WeddingCardsClient from './WeddingCardsClient';

export const metadata: Metadata = {
  title: 'Indian Wedding Card Maker Online Free – Hindi & English Shaadi Invitation | ShivanshStudio',
  description: 'Create beautiful Indian wedding invitation cards online for free. Choose from Traditional, Royal, Floral, and Vintage styles. Full Hindi & English support. Customize bride & groom names, venue, date, and more. Share instantly via WhatsApp. Perfect for Hindu, Muslim, Sikh & all Indian weddings.',
  keywords: [
    'indian wedding card maker online free',
    'hindi wedding invitation card',
    'shaadi invitation card online',
    'wedding invitation card designer',
    'digital wedding card maker india',
    'whatsapp wedding invitation card free',
    'Hindu wedding invitation card',
    'muslim nikah invitation card online',
    'sikh wedding card maker',
    'royal wedding card design online',
    'traditional indian wedding invite',
    'free shadi card maker',
    'wedding e-invite maker hindi',
    'vivah card maker online free',
    'customizable wedding invitation online',
    'floral wedding card designer',
    'online wedding card banao free',
    'digital shaadi patrika',
  ],
  authors: [{ name: 'ShivanshStudio', url: 'https://www.shivansh-studio.store' }],
  creator: 'ShivanshStudio',
  publisher: 'ShivanshStudio',
  alternates: {
    canonical: 'https://www.shivansh-studio.store/wedding-cards',
  },
  openGraph: {
    title: 'Indian Wedding Card Maker Online Free – Hindi & English Shaadi Invitation | ShivanshStudio',
    description: 'Create stunning Indian wedding invitation cards online — Traditional, Royal, Floral & Vintage styles. Full Hindi & English support. Share on WhatsApp instantly. 100% free.',
    url: 'https://www.shivansh-studio.store/wedding-cards',
    siteName: 'ShivanshStudio',
    images: [
      {
        url: 'https://www.shivansh-studio.store/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShivanshStudio Indian Wedding Card Maker – Free Online Shaadi Invitation Creator',
        type: 'image/png',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indian Wedding Card Maker Online Free – Hindi & English Shaadi Invitation',
    description: 'Create beautiful Indian wedding invitation cards free — Traditional, Royal, Floral styles. Hindi & English, WhatsApp sharing.',
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
                "@id": "https://www.shivansh-studio.store/wedding-cards#webpage",
                "url": "https://www.shivansh-studio.store/wedding-cards",
                "name": "Indian Wedding Card Maker Online Free – Hindi & English Shaadi Invitation",
                "isPartOf": { "@id": "https://www.shivansh-studio.store/#website" },
                "inLanguage": "en-IN",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.shivansh-studio.store" },
                    { "@type": "ListItem", "position": 2, "name": "Wedding Cards", "item": "https://www.shivansh-studio.store/wedding-cards" }
                  ]
                }
              },
              {
                "@type": "SoftwareApplication",
                "name": "Indian Wedding Card Generator",
                "url": "https://www.shivansh-studio.store/wedding-cards",
                "operatingSystem": "Web",
                "applicationCategory": "DesignApplication",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
                "description": "Free online Indian wedding invitation card maker. Traditional, Royal, Floral, and Vintage styles. Full Hindi & English support. Instant WhatsApp sharing.",
                "publisher": { "@id": "https://www.shivansh-studio.store/#organization" }
              }
            ]
          }),
        }}
      />
      <WeddingCardsClient />
    </>
  );
}

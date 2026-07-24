import type { Metadata } from 'next';
import QuotePosterClient from './QuotePosterClient';

export const metadata: Metadata = {
  title: 'Free Quote Poster Maker – Create Inspirational Posters & Motivational Quotes Online | ShivanshStudio',
  description: 'Design beautiful quote posters, motivational graphics, and inspirational images online for free. Perfect for Instagram, WhatsApp status, Facebook posts, and wall art. Custom fonts, backgrounds, and templates. No design skills needed.',
  keywords: [
    'quote poster maker online free',
    'inspirational quote designer',
    'motivational quote maker',
    'instagram quote creator free',
    'whatsapp status quote maker',
    'poster design online free',
    'quote image generator',
    'free poster maker india',
    'shayari image maker online',
    'thought of the day poster',
    'hindi quote poster maker',
    'custom quote poster design',
    'facebook quote image creator',
    'wall art quote maker',
    'quote graphic design tool free',
  ],
  authors: [{ name: 'ShivanshStudio', url: 'https://www.shivansh-studio.store' }],
  creator: 'ShivanshStudio',
  publisher: 'ShivanshStudio',
  alternates: {
    canonical: 'https://www.shivansh-studio.store/quote-poster',
  },
  openGraph: {
    title: 'Free Quote Poster Maker – Create Inspirational Posters Online | ShivanshStudio',
    description: 'Turn your favorite quotes into stunning posters. Custom fonts, backgrounds, and styles. Perfect for Instagram, WhatsApp & Facebook sharing. 100% free.',
    url: 'https://www.shivansh-studio.store/quote-poster',
    siteName: 'ShivanshStudio',
    images: [
      {
        url: 'https://www.shivansh-studio.store/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShivanshStudio Quote Poster Maker – Free Inspirational Design Tool',
        type: 'image/png',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Quote Poster Maker – Create Inspirational Posters Online',
    description: 'Create stunning quote posters for Instagram, WhatsApp & Facebook — free, instant, no design skills needed.',
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
                "@id": "https://www.shivansh-studio.store/quote-poster#webpage",
                "url": "https://www.shivansh-studio.store/quote-poster",
                "name": "Free Quote Poster Maker – Create Inspirational Posters & Motivational Quotes Online",
                "isPartOf": { "@id": "https://www.shivansh-studio.store/#website" },
                "inLanguage": "en-IN",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.shivansh-studio.store" },
                    { "@type": "ListItem", "position": 2, "name": "Quote Poster Maker", "item": "https://www.shivansh-studio.store/quote-poster" }
                  ]
                }
              },
              {
                "@type": "SoftwareApplication",
                "name": "Quote Poster Maker",
                "url": "https://www.shivansh-studio.store/quote-poster",
                "operatingSystem": "Web",
                "applicationCategory": "DesignApplication",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
                "description": "Free online tool to create quote posters, motivational graphics, and inspirational images for Instagram, WhatsApp, and social media.",
                "publisher": { "@id": "https://www.shivansh-studio.store/#organization" }
              }
            ]
          }),
        }}
      />
      <QuotePosterClient />
    </>
  );
}

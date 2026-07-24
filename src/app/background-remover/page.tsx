import type { Metadata } from 'next';
import BackgroundRemoverClient from './BackgroundRemoverClient';

export const metadata: Metadata = {
  title: 'Free AI Background Remover – Remove Image Background Online Instantly | ShivanshStudio',
  description: 'Remove background from any photo in seconds using AI — completely free. Perfect for product photos, portraits, ID photos, and eCommerce. Get crisp transparent PNG backgrounds without Photoshop. No signup required.',
  keywords: [
    'AI background remover free',
    'remove background from photo online free',
    'transparent background maker',
    'remove bg free india',
    'image background removal tool',
    'online background eraser free',
    'remove photo background without photoshop',
    'product photo background remover',
    'portrait background remover online',
    'free background removal tool india',
    'remove white background online',
    'png transparent background maker',
    'shivanshstudio background remover',
  ],
  authors: [{ name: 'ShivanshStudio', url: 'https://www.shivansh-studio.store' }],
  creator: 'ShivanshStudio',
  publisher: 'ShivanshStudio',
  alternates: {
    canonical: 'https://www.shivansh-studio.store/background-remover',
  },
  openGraph: {
    title: 'Free AI Background Remover – Remove Image Background Instantly | ShivanshStudio',
    description: 'Remove any image background in seconds using AI — free, fast and accurate. Get transparent PNG with no Photoshop needed.',
    url: 'https://www.shivansh-studio.store/background-remover',
    siteName: 'ShivanshStudio',
    images: [
      {
        url: 'https://www.shivansh-studio.store/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShivanshStudio AI Background Remover – Free Online Tool',
        type: 'image/png',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Background Remover – Remove Image Background Instantly',
    description: 'Remove any image background in seconds using AI — free, fast, no signup needed.',
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
                "@id": "https://www.shivansh-studio.store/background-remover#webpage",
                "url": "https://www.shivansh-studio.store/background-remover",
                "name": "Free AI Background Remover – Remove Image Background Online Instantly",
                "isPartOf": { "@id": "https://www.shivansh-studio.store/#website" },
                "inLanguage": "en-IN",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.shivansh-studio.store" },
                    { "@type": "ListItem", "position": 2, "name": "Background Remover", "item": "https://www.shivansh-studio.store/background-remover" }
                  ]
                }
              },
              {
                "@type": "SoftwareApplication",
                "name": "AI Background Remover",
                "url": "https://www.shivansh-studio.store/background-remover",
                "operatingSystem": "Web",
                "applicationCategory": "DesignApplication",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
                "description": "AI-powered background removal tool. Upload any image and get a transparent PNG background in seconds — completely free.",
                "publisher": { "@id": "https://www.shivansh-studio.store/#organization" }
              }
            ]
          }),
        }}
      />
      <BackgroundRemoverClient />
    </>
  );
}

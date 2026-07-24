import type { Metadata } from 'next';
import ImageEditorClient from './ImageEditorClient';

export const metadata: Metadata = {
  title: 'Free Online Photo Editor – Crop, Resize, Filters & Enhance Images | ShivanshStudio',
  description: 'Edit photos online for free with ShivanshStudio\'s powerful browser-based image editor. Crop, resize, rotate, apply filters, adjust brightness & contrast, and enhance images instantly. No download required. Works on mobile & desktop.',
  keywords: [
    'free online photo editor',
    'image editor online free india',
    'crop image online',
    'resize photo online free',
    'photo filters online',
    'image enhancer free',
    'edit image without software',
    'browser photo editor',
    'online image editing tool',
    'rotate photo online free',
    'adjust brightness contrast online',
    'shivanshstudio image editor',
    'photo editing tool india',
  ],
  authors: [{ name: 'ShivanshStudio', url: 'https://www.shivansh-studio.store' }],
  creator: 'ShivanshStudio',
  publisher: 'ShivanshStudio',
  alternates: {
    canonical: 'https://www.shivansh-studio.store/image-editor',
  },
  openGraph: {
    title: 'Free Online Photo Editor – Crop, Resize, Filters & Enhance Images | ShivanshStudio',
    description: 'Professional-grade photo editing tools right in your browser. Crop, resize, filter, and enhance images for free — no signup, no download needed.',
    url: 'https://www.shivansh-studio.store/image-editor',
    siteName: 'ShivanshStudio',
    images: [
      {
        url: 'https://www.shivansh-studio.store/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShivanshStudio Free Online Photo Editor – Crop, Resize & Filter Images',
        type: 'image/png',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Photo Editor – Crop, Resize & Enhance Images',
    description: 'Edit photos online for free. Crop, resize, apply filters & enhance images — no download needed.',
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
                "@id": "https://www.shivansh-studio.store/image-editor#webpage",
                "url": "https://www.shivansh-studio.store/image-editor",
                "name": "Free Online Photo Editor – Crop, Resize, Filters & Enhance Images",
                "isPartOf": { "@id": "https://www.shivansh-studio.store/#website" },
                "inLanguage": "en-IN",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.shivansh-studio.store" },
                    { "@type": "ListItem", "position": 2, "name": "Image Editor", "item": "https://www.shivansh-studio.store/image-editor" }
                  ]
                }
              },
              {
                "@type": "SoftwareApplication",
                "name": "Online Photo Editor",
                "url": "https://www.shivansh-studio.store/image-editor",
                "operatingSystem": "Web",
                "applicationCategory": "MultimediaApplication",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
                "description": "Free browser-based photo editor. Crop, resize, rotate, apply filters, and enhance images with no download required.",
                "publisher": { "@id": "https://www.shivansh-studio.store/#organization" }
              }
            ]
          }),
        }}
      />
      <ImageEditorClient />
    </>
  );
}



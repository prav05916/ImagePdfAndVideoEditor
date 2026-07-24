import type { Metadata } from 'next';
import PassportMakerClient from './PassportMakerClient';

export const metadata: Metadata = {
  title: 'Passport Size Photo Maker Online Free – Exam & Government ID Photos | ShivanshStudio',
  description: 'Create perfect passport size photos online for free. Ideal for UPSC, SSC, Railways, Aadhaar, PAN Card, visa, and all government exam applications. AI-powered background removal and standard size cropping. Download instantly in seconds.',
  keywords: [
    'passport size photo maker online free',
    'passport photo creator online',
    'exam photo maker india',
    'upsc ssc photo size maker',
    'government exam photo creator',
    'aadhaar photo size maker',
    'pan card photo size editor',
    'visa photo maker online free',
    'AI background removal passport photo',
    'crop photo to passport size online',
    '35x45mm photo maker online',
    'official document photo maker',
    'biometric photo maker online india',
    'driving licence photo size maker',
    'neet jee photo size maker',
  ],
  authors: [{ name: 'ShivanshStudio', url: 'https://www.shivansh-studio.store' }],
  creator: 'ShivanshStudio',
  publisher: 'ShivanshStudio',
  alternates: {
    canonical: 'https://www.shivansh-studio.store/passport-maker',
  },
  openGraph: {
    title: 'Passport Size Photo Maker Online Free – Exam & Government ID Photos | ShivanshStudio',
    description: 'Make passport size photos for UPSC, SSC, Railways, Aadhaar, Visa & all exams — free & instant. AI background removal + standard size cropping included.',
    url: 'https://www.shivansh-studio.store/passport-maker',
    siteName: 'ShivanshStudio',
    images: [
      {
        url: 'https://www.shivansh-studio.store/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShivanshStudio Passport Size Photo Maker – Free Online Tool for Exams & Government IDs',
        type: 'image/png',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Passport Size Photo Maker Online Free – Exam & Government ID Photos',
    description: 'Make passport photos for UPSC, SSC, Aadhaar, Visa & all exams — free, fast, AI-powered.',
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

export default function PassportMakerPage() {
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
                "@id": "https://www.shivansh-studio.store/passport-maker#webpage",
                "url": "https://www.shivansh-studio.store/passport-maker",
                "name": "Passport Size Photo Maker Online Free – Exam & Government ID Photos",
                "isPartOf": { "@id": "https://www.shivansh-studio.store/#website" },
                "inLanguage": "en-IN",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.shivansh-studio.store" },
                    { "@type": "ListItem", "position": 2, "name": "Passport Photo Maker", "item": "https://www.shivansh-studio.store/passport-maker" }
                  ]
                }
              },
              {
                "@type": "SoftwareApplication",
                "name": "Passport Size Photo Maker",
                "url": "https://www.shivansh-studio.store/passport-maker",
                "operatingSystem": "Web",
                "applicationCategory": "DesignApplication",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
                "description": "Create passport size photos for UPSC, SSC, Railways, Aadhaar, Visa, and all government exams. AI background removal and standard cropping included — free.",
                "publisher": { "@id": "https://www.shivansh-studio.store/#organization" }
              }
            ]
          }),
        }}
      />
      <PassportMakerClient />
    </>
  );
}

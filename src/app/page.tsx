import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'ShivanshStudio – Free Online Image Editor, Wedding Cards & Design Tools India',
  description: 'ShivanshStudio is India\'s free all-in-one design platform. Create Indian wedding cards in Hindi & English, remove image backgrounds with AI, make passport size photos for exams, design Instagram posts, create invitation cards and more. 100% free, no signup required.',
  keywords: [
    'free online image editor india',
    'wedding card generator hindi english',
    'passport size photo maker for exam',
    'AI background remover free india',
    'invitation card maker online free',
    'social media post maker india',
    'quote poster maker free',
    'resume photo enhancer online',
    'video editor online free india',
    'shivansh studio',
    'online design tool free india',
    'shaadi card maker online',
    'WhatsApp wedding invitation card',
    'digital invitation maker hindi',
    'shadi card online banao',
  ],
  authors: [{ name: 'ShivanshStudio', url: 'https://www.shivansh-studio.store' }],
  creator: 'ShivanshStudio',
  publisher: 'ShivanshStudio',
  alternates: {
    canonical: 'https://www.shivansh-studio.store',
  },
  openGraph: {
    title: 'ShivanshStudio – Free Online Image Editor, Wedding Cards & Design Tools India',
    description: 'Create stunning Indian wedding cards, remove image backgrounds with AI, make passport photos, edit images & design social media posts — 100% free. Hindi & English supported.',
    url: 'https://www.shivansh-studio.store',
    siteName: 'ShivanshStudio',
    images: [
      {
        url: 'https://www.shivansh-studio.store/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShivanshStudio – Free Online Design Platform for Indian Users',
        type: 'image/png',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShivanshStudio – Free Online Image Editor & Design Tools',
    description: 'Create wedding cards, remove backgrounds, make passport photos & more — 100% free. Hindi & English support.',
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
      'max-video-preview': -1,
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
                "@id": "https://www.shivansh-studio.store/#webpage",
                "url": "https://www.shivansh-studio.store",
                "name": "ShivanshStudio – Free Online Image Editor, Wedding Cards & Design Tools India",
                "isPartOf": { "@id": "https://www.shivansh-studio.store/#website" },
                "about": { "@id": "https://www.shivansh-studio.store/#webapp" },
                "description": "India's free all-in-one design platform. Create wedding cards, remove backgrounds, make passport photos, design social media posts and more.",
                "inLanguage": "en-IN",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://www.shivansh-studio.store"
                    }
                  ]
                }
              },
              {
                "@type": "WebSite",
                "@id": "https://www.shivansh-studio.store/#website",
                "url": "https://www.shivansh-studio.store",
                "name": "ShivanshStudio",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://www.shivansh-studio.store/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            ]
          }),
        }}
      />
      <DashboardClient />
    </>
  );
}


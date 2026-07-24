import type { Metadata } from 'next';
import ResumeEnhancerClient from './ResumeEnhancerClient';

export const metadata: Metadata = {
  title: 'Resume Photo Enhancer – Professional Profile Photo for CV, LinkedIn & Job Applications | ShivanshStudio',
  description: 'Enhance your resume profile photo with AI for free. Get a professional, ATS-friendly headshot perfect for LinkedIn, CV, job applications and government forms. Remove background, improve lighting, and make a great first impression instantly.',
  keywords: [
    'resume photo enhancer free',
    'professional profile photo editor',
    'linkedin photo editor online',
    'cv photo maker india',
    'ats friendly resume photo',
    'job application photo editor',
    'ai profile picture enhancer',
    'professional headshot editor free',
    'remove background for resume photo',
    'formal photo maker online',
    'government job photo editor',
    'passport photo for resume',
    'resume pic background changer',
    'free professional photo editor india',
  ],
  authors: [{ name: 'ShivanshStudio', url: 'https://www.shivansh-studio.store' }],
  creator: 'ShivanshStudio',
  publisher: 'ShivanshStudio',
  alternates: {
    canonical: 'https://www.shivansh-studio.store/resume-enhancer',
  },
  openGraph: {
    title: 'Resume Photo Enhancer – Professional Profile Photo for CV & LinkedIn | ShivanshStudio',
    description: 'Enhance your resume photo with AI — ATS-friendly, professional results for LinkedIn, CV, and job applications. Background removal + photo enhancement free.',
    url: 'https://www.shivansh-studio.store/resume-enhancer',
    siteName: 'ShivanshStudio',
    images: [
      {
        url: 'https://www.shivansh-studio.store/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShivanshStudio Resume Photo Enhancer – AI Professional Profile Picture Tool',
        type: 'image/png',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Photo Enhancer – Professional Profile Photo for CV & LinkedIn',
    description: 'Enhance your resume photo with AI — professional, ATS-friendly results for LinkedIn & job applications. Free!',
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
                "@id": "https://www.shivansh-studio.store/resume-enhancer#webpage",
                "url": "https://www.shivansh-studio.store/resume-enhancer",
                "name": "Resume Photo Enhancer – Professional Profile Photo for CV, LinkedIn & Job Applications",
                "isPartOf": { "@id": "https://www.shivansh-studio.store/#website" },
                "inLanguage": "en-IN",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.shivansh-studio.store" },
                    { "@type": "ListItem", "position": 2, "name": "Resume Photo Enhancer", "item": "https://www.shivansh-studio.store/resume-enhancer" }
                  ]
                }
              },
              {
                "@type": "SoftwareApplication",
                "name": "Resume Photo Enhancer",
                "url": "https://www.shivansh-studio.store/resume-enhancer",
                "operatingSystem": "Web",
                "applicationCategory": "BusinessApplication",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
                "description": "AI-powered resume photo enhancement tool. Get a professional, ATS-friendly headshot for LinkedIn, CV, and job applications instantly.",
                "publisher": { "@id": "https://www.shivansh-studio.store/#organization" }
              }
            ]
          }),
        }}
      />
      <ResumeEnhancerClient />
    </>
  );
}

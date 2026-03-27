import type { Metadata } from 'next';
import ResumeEnhancerClient from './ResumeEnhancerClient';

export const metadata: Metadata = {
  title: 'Resume Photo Enhancer - Professional AI Headshot & CV Photo Tool',
  description: 'Improve your resume photo with AI. Enhance clarity, adjust lighting, and get a professional look for your job application. Create perfect CV photos online for free.',
  keywords: ['resume photo enhancer', 'professional headshot tool', 'AI photo enhancer', 'CV photo editor', 'passport photo maker', 'enhance resume photo free', 'professional CV photo maker'],
  openGraph: {
    title: 'Resume Photo Enhancer - Professional AI Headshot Tool',
    description: 'Get the perfect professional photo for your resume. AI-powered enhancement for job seekers.',
    images: [{ url: '/og-resume-enhancer.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://pixelcraft.studio/resume-enhancer',
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
            "name": "Resume Photo Enhancer",
            "operatingSystem": "Web",
            "applicationCategory": "DesignApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Get the perfect professional photo for your resume. AI-powered enhancement for job seekers."
          }),
        }}
      />
      <ResumeEnhancerClient />
    </>
  );
}

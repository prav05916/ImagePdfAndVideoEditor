import type { Metadata } from 'next';
import ResumeEnhancerClient from './ResumeEnhancerClient';

export const metadata: Metadata = {
  title: 'Resume Photo Enhancer - Professional ATS Optimization | ShivanshStudio',
  description: 'Enhance your resume profile photo with AI. Get professional results that pass ATS checks and make a great first impression for job applications.',
  keywords: ['resume photo enhancer', 'professional profile picture', 'ats friendly photo', 'linkedin photo editor', 'cv photo maker', 'ai photo enhancer', 'job application photo'],
  openGraph: {
    title: 'Resume Photo Enhancer - Professional Profile Pictures',
    description: 'Enhance your resume profile photo with AI for professional ATS-friendly results.',
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.shivansh-studio.store/resume-enhancer',
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
            "name": "Resume Photo Enhancer",
            "url": "https://www.shivansh-studio.store/resume-enhancer",
            "operatingSystem": "Web",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Create high-scoring ATS-optimized resumes with dynamic AI suggestions and templates."
          }),
        }}
      />
      <ResumeEnhancerClient />
    </>
  );
}

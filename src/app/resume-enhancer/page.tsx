import type { Metadata } from 'next';
import ResumeEnhancerClient from './ResumeEnhancerClient';

export const metadata: Metadata = {
  title: 'AI Resume Builder - ATS Optimizer & Free CV Maker Online',
  description: 'Create an optimized, professional resume with AI. Live ATS score checker, targeted keyword integration, performance metrics optimization, and clean PDF exports for job seekers.',
  keywords: ['AI resume builder', 'ATS resume optimizer', 'free CV maker online', 'ATS score checker', 'professional resume template', 'resume keyword optimization', 'metrics-driven CV builder'],
  openGraph: {
    title: 'AI Resume Builder - ATS Optimizer & Free CV Maker Online',
    description: 'Create high-scoring ATS-optimized resumes. Get dynamic suggestions, keyword improvements, and export professional PDFs.',
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
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
            "@type": "SoftwareApplication",
            "name": "AI Resume Builder & ATS Optimizer",
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

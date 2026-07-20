import type { Metadata } from 'next';
import PassportMakerClient from './PassportMakerClient';

export const metadata: Metadata = {
  title: 'Passport Size Photo Maker - AI Background Removal & Cropping',
  description: 'Create perfect passport size photos for government exams and official documents. AI-powered background removal and standard cropping. Download instantly.',
  keywords: ['passport size photo maker', 'online passport photo creator', 'exam photo maker', 'ai background removal', 'crop to passport size', 'official document photo'],
  openGraph: {
    title: 'Passport Size Photo Maker - AI Background Removal',
    description: 'Create perfect passport size photos for exams and official documents easily.',
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.shivansh-studio.store/passport-maker',
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
            "@type": "SoftwareApplication",
            "name": "Passport Size Photo Maker",
            "operatingSystem": "Web",
            "applicationCategory": "DesignApplication",
            "offers": { "@type": "Offer", "price": "50", "priceCurrency": "INR" },
            "description": "Create perfect passport size photos for government exams and official documents with AI background removal."
          }),
        }}
      />
      <PassportMakerClient />
    </>
  );
}

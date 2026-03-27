import type { Metadata } from 'next';
import SocialMediaClient from './SocialMediaClient';

export const metadata: Metadata = {
  title: 'Social Media Post Maker - Design for Instagram, Facebook, Twitter & More',
  description: 'Create professional social media posts in minutes. Choose from templates for Instagram stories, Facebook posts, and more. Boost your online presence with free design tools.',
  keywords: ['social media post maker', 'instagram story creator', 'facebook post designer', 'social media templates', 'online design tool', 'create social media posts free', 'post maker online'],
  openGraph: {
    title: 'Social Media Post Maker - Design for Instagram, Facebook & Twitter',
    description: 'Stunning social media designs in minutes. Professional templates for all major platforms.',
    images: [{ url: '/og-social-media.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://pixelcraft.studio/social-media',
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
            "name": "Social Media Post Maker",
            "operatingSystem": "Web",
            "applicationCategory": "DesignApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Stunning social media designs in minutes. Professional templates for all major platforms."
          }),
        }}
      />
      <SocialMediaClient />
    </>
  );
}

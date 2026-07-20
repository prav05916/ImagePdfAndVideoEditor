import type { Metadata } from 'next';
import VideoEditorClient from './VideoEditorClient';

export const metadata: Metadata = {
  title: 'Online Video Editor - Trim, Merge & Edit Videos | ShivanshStudio',
  description: 'A powerful online video editor. Trim videos, add effects, merge clips, and create stunning content for social media directly in your browser. Free video maker.',
  keywords: ['online video editor', 'trim video online', 'video maker', 'social media video editor', 'free video editing tool', 'merge videos online', 'browser video editor', 'shivanshstudio video'],
  openGraph: {
    title: 'Online Video Editor - Trim, Merge & Edit Videos Fast',
    description: 'Simple and powerful video editing in your browser. Perfect for social media and quick edits.',
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.shivansh-studio.store/video-editor',
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
            "name": "Online Video Editor",
            "url": "https://www.shivansh-studio.store/video-editor",
            "operatingSystem": "Web",
            "applicationCategory": "MultimediaApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Simple and powerful video editing in your browser. Perfect for social media and quick edits."
          }),
        }}
      />
      <VideoEditorClient />
    </>
  );
}

import type { Metadata } from 'next';
import VideoEditorClient from './VideoEditorClient';

export const metadata: Metadata = {
  title: 'Online Video Editor - Trim, Merge, Convert & Edit Videos Online Free',
  description: 'A simple and powerful online video editor. Trim videos, add effects, and create stunning content for social media. No download required. Free video maker.',
  keywords: ['online video editor', 'trim video online', 'video maker', 'social media video editor', 'free video editing tool', 'merge videos online', 'video converter'],
  openGraph: {
    title: 'Online Video Editor - Trim, Merge & Edit Videos Fast',
    description: 'Simple and powerful video editing in your browser. Perfect for social media and quick edits.',
    images: [{ url: '/og-video-editor.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://pixelcraft.studio/video-editor',
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
            "name": "Online Video Editor",
            "operatingSystem": "Web",
            "applicationCategory": "DesignApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Simple and powerful video editing in your browser. Perfect for social media and quick edits."
          }),
        }}
      />
      <VideoEditorClient />
    </>
  );
}

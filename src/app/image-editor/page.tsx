import type { Metadata } from 'next';
import ImageEditorClient from './ImageEditorClient';

export const metadata: Metadata = {
  title: 'Online Photo Editor - Free Image Editing & Design Tool | ShivanshStudio',
  description: 'Professional online photo editor. Crop, resize, apply filters, enhance images, and create stunning graphics for free. Fast browser-based editing.',
  keywords: ['online photo editor', 'free image editing', 'photo filters', 'crop image online', 'resize image online', 'photo enhancer', 'edit image free', 'online design tool', 'shivanshstudio editor', 'browser photo editor'],
  openGraph: {
    title: 'Online Photo Editor - Free Image Editing & Design Tool',
    description: 'Professional-grade photo editing tools right in your browser. Free, fast, and easy to use.',
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.shivansh-studio.store/image-editor',
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
            "name": "Online Photo Editor",
            "url": "https://www.shivansh-studio.store/image-editor",
            "operatingSystem": "Web",
            "applicationCategory": "MultimediaApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Professional-grade photo editing tools right in your browser. Free, fast, and easy to use."
          }),
        }}
      />
      <ImageEditorClient />
    </>
  );
}

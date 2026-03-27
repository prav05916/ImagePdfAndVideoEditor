import type { Metadata } from 'next';
import ImageEditorClient from './ImageEditorClient';

export const metadata: Metadata = {
  title: 'Online Photo Editor - Free Image Editing, Filter & Design Tool',
  description: 'Edit your photos online with ease. Crop, resize, apply filters, and enhance your images. Professional editing tools in your browser. All-in-one free photo editor.',
  keywords: ['online photo editor', 'free image editing', 'photo filters', 'crop image online', 'resize image online', 'photo enhancer', 'edit image free', 'online design tool'],
  openGraph: {
    title: 'Online Photo Editor - Free Image Editing & Design Tool',
    description: 'Professional-grade photo editing tools right in your browser. Free, fast, and easy to use.',
    images: [{ url: '/og-image-editor.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://pixelcraft.studio/image-editor',
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
            "name": "Online Photo Editor",
            "operatingSystem": "Web",
            "applicationCategory": "DesignApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Professional-grade photo editing tools right in your browser. Free, fast, and easy to use."
          }),
        }}
      />
      <ImageEditorClient />
    </>
  );
}

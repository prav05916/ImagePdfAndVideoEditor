import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pixelcraft.studio';

  const routes = [
    '',
    '/image-editor',
    '/video-editor',
    '/wedding-cards',
    '/invitation-maker',
    '/social-media',
    '/background-remover',
    '/quote-poster',
    '/resume-enhancer',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}

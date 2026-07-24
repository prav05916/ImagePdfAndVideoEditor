import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all good bots to crawl everything
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',        // Block API routes from indexing
          '/_next/',      // Block Next.js internals
          '/search',      // Block any search result pages
        ],
      },
      // Allow Google's image bot explicitly for richer image indexing
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      // Allow Googlebot-Video for video editor page
      {
        userAgent: 'Googlebot-Video',
        allow: '/video-editor',
      },
    ],
    sitemap: 'https://www.shivansh-studio.store/sitemap.xml',
    host: 'https://www.shivansh-studio.store',
  };
}

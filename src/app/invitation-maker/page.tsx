import type { Metadata } from 'next';
import InvitationMakerClient from './InvitationMakerClient';

export const metadata: Metadata = {
  title: 'Free Online Invitation Maker – Birthday, Anniversary, Party & Event Cards | ShivanshStudio',
  description: 'Create beautiful digital invitation cards online for free. Customize birthday invitations, anniversary cards, party invites, festival greetings & more. Easy-to-use designer with Hindi & English templates. Share instantly on WhatsApp.',
  keywords: [
    'invitation maker online free',
    'birthday invitation card maker',
    'digital invitation card creator',
    'party invite designer online',
    'anniversary invitation card online',
    'event invitation maker free',
    'WhatsApp invitation card maker',
    'hindi invitation maker',
    'free invitation card design',
    'custom invite online india',
    'festival invitation card',
    'online birthday card maker india',
    'digital invite creator hindi',
    'shaadi invitation card online',
  ],
  authors: [{ name: 'ShivanshStudio', url: 'https://www.shivansh-studio.store' }],
  creator: 'ShivanshStudio',
  publisher: 'ShivanshStudio',
  alternates: {
    canonical: 'https://www.shivansh-studio.store/invitation-maker',
  },
  openGraph: {
    title: 'Free Online Invitation Maker – Birthday, Anniversary & Party Cards | ShivanshStudio',
    description: 'Create beautiful digital invitations for every occasion — birthdays, anniversaries, parties & festivals. Easy to customize, instant WhatsApp sharing. Free!',
    url: 'https://www.shivansh-studio.store/invitation-maker',
    siteName: 'ShivanshStudio',
    images: [
      {
        url: 'https://www.shivansh-studio.store/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShivanshStudio Online Invitation Maker – Free Birthday & Party Card Creator',
        type: 'image/png',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Invitation Maker – Birthday, Party & Event Cards',
    description: 'Create beautiful digital invitation cards free. Birthday, anniversary, party invites — instant WhatsApp sharing.',
    images: ['https://www.shivansh-studio.store/og-image.png'],
    creator: '@shivanshstudio',
    site: '@shivanshstudio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
            "@graph": [
              {
                "@type": "WebPage",
                "@id": "https://www.shivansh-studio.store/invitation-maker#webpage",
                "url": "https://www.shivansh-studio.store/invitation-maker",
                "name": "Free Online Invitation Maker – Birthday, Anniversary & Party Cards",
                "isPartOf": { "@id": "https://www.shivansh-studio.store/#website" },
                "inLanguage": "en-IN",
                "breadcrumb": {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.shivansh-studio.store" },
                    { "@type": "ListItem", "position": 2, "name": "Invitation Maker", "item": "https://www.shivansh-studio.store/invitation-maker" }
                  ]
                }
              },
              {
                "@type": "SoftwareApplication",
                "name": "Online Invitation Maker",
                "url": "https://www.shivansh-studio.store/invitation-maker",
                "operatingSystem": "Web",
                "applicationCategory": "DesignApplication",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "availability": "https://schema.org/InStock" },
                "description": "Create beautiful digital invitation cards for birthdays, anniversaries, parties, and festivals. Hindi & English templates, instant WhatsApp sharing.",
                "publisher": { "@id": "https://www.shivansh-studio.store/#organization" }
              }
            ]
          }),
        }}
      />
      <InvitationMakerClient />
    </>
  );
}

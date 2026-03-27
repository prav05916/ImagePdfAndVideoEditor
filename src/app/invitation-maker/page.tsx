import type { Metadata } from 'next';
import InvitationMakerClient from './InvitationMakerClient';

export const metadata: Metadata = {
  title: 'Online Invitation Maker - Birthday, Party, Anniversary & Event Invites Free',
  description: 'Create custom invitations for birthdays, anniversaries, and parties. Easy-to-use designer with beautiful templates and Hindi support. Design and share digital invites fast.',
  keywords: ['online invitation maker', 'birthday card maker', 'party invite designer', 'free invitation templates', 'custom event invites', 'anniversary invitation maker', 'digital invitations online'],
  openGraph: {
    title: 'Online Invitation Maker - Birthday, Party & Event Invites',
    description: 'Beautiful digital invitations for every occasion. Easy to customize and share.',
    images: [{ url: '/og-invitation-maker.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://pixelcraft.studio/invitation-maker',
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
            "name": "Online Invitation Maker",
            "operatingSystem": "Web",
            "applicationCategory": "DesignApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Beautiful digital invitations for every occasion. Easy to customize and share."
          }),
        }}
      />
      <InvitationMakerClient />
    </>
  );
}

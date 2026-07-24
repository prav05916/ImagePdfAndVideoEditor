import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Footer from "@/components/layout/Footer";
import AIAssistant from "@/components/ui/AIAssistant";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shivansh-studio.store"),
  title: {
    default: "ShivanshStudio – Free Online Image Editor, Wedding Cards & Design Tools",
    template: "%s | ShivanshStudio",
  },
  description:
    "ShivanshStudio is your free all-in-one design platform. Create stunning Indian wedding cards, remove image backgrounds with AI, edit photos, make passport size photos for government exams, design social media posts, and more. Supports Hindi & English.",
  keywords: [
    "image editor online free",
    "wedding card generator india",
    "invitation maker online",
    "social media post maker",
    "AI background remover free",
    "quote poster maker",
    "resume photo enhancer",
    "online design tool free",
    "Indian wedding cards online",
    "Hindi wedding invitation maker",
    "passport photo maker online",
    "passport size photo editor",
    "exam photo maker",
    "video editor online free",
    "shivansh studio",
    "digital design tools india",
    "free graphic design tool",
    "shaadi card maker online",
    "WhatsApp wedding invitation",
  ],
  authors: [{ name: "ShivanshStudio", url: "https://www.shivansh-studio.store" }],
  creator: "ShivanshStudio",
  publisher: "ShivanshStudio",
  category: "Design & Creative Tools",
  openGraph: {
    title: "ShivanshStudio – Free Online Image Editor, Wedding Cards & Design Tools",
    description:
      "Create stunning wedding cards, remove backgrounds with AI, make passport photos, edit images, and design social media posts — all free. Hindi & English supported.",
    url: "https://www.shivansh-studio.store",
    type: "website",
    siteName: "ShivanshStudio",
    locale: "en_IN",
    images: [
      {
        url: "https://www.shivansh-studio.store/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShivanshStudio – Free Online Design Platform for Indian Users",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShivanshStudio – Free Online Image Editor & Design Tools",
    description:
      "Create wedding cards, remove backgrounds, make passport photos & more — free. Hindi & English support.",
    images: ["https://www.shivansh-studio.store/og-image.png"],
    creator: "@shivanshstudio",
    site: "@shivanshstudio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://www.shivansh-studio.store",
  },
  verification: {
    google: "ox4VTUbDahG8OuY0-swj_8gpmzcLW3mhs1hUKsuQONg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <head>
        {/* DNS prefetch and preconnect for performance */}
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="preconnect" href="https://www.clarity.ms" />

        {/* Font preconnects */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Google Site Verification is now handled via Next.js metadata.verification */}

        {/* Font styles */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:ml-[280px] min-h-screen flex flex-col">
            <Topbar />
            <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
            <Footer />
          </main>
          <AIAssistant />
        </div>

        {/* Microsoft Clarity - Standard implementation with afterInteractive and crossorigin */}
        <Script id="microsoft-clarity" strategy="afterInteractive" src="https://www.clarity.ms/tag/w1qfvyn1or" crossOrigin="anonymous" />
        <Script
          id="custom-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wuk7mjculr");`
          }}
        />

        {/* Global Structured Data (JSON-LD) – Organization + WebSite + WebApplication */}
        <Script
          id="json-ld-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.shivansh-studio.store/#organization",
                  "name": "ShivanshStudio",
                  "url": "https://www.shivansh-studio.store",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.shivansh-studio.store/logo.png",
                    "width": 512,
                    "height": 512
                  },
                  "sameAs": [
                    "https://www.shivansh-studio.store"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.shivansh-studio.store/#website",
                  "url": "https://www.shivansh-studio.store",
                  "name": "ShivanshStudio",
                  "description": "Free all-in-one image editor, wedding card generator, passport photo maker, background remover and more.",
                  "publisher": { "@id": "https://www.shivansh-studio.store/#organization" },
                  "inLanguage": "en-IN",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.shivansh-studio.store/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "WebApplication",
                  "@id": "https://www.shivansh-studio.store/#webapp",
                  "name": "ShivanshStudio",
                  "url": "https://www.shivansh-studio.store",
                  "description": "All-in-one free design platform: image editor, wedding card generator, passport size photo maker, AI background remover, video editor, and social media post creator.",
                  "applicationCategory": "DesignApplication",
                  "operatingSystem": "Web",
                  "browserRequirements": "Requires JavaScript. Requires HTML5.",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "INR",
                    "availability": "https://schema.org/InStock"
                  },
                  "author": {
                    "@id": "https://www.shivansh-studio.store/#organization"
                  }
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
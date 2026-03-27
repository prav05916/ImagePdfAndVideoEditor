import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Footer from "@/components/layout/Footer";
import AIAssistant from "@/components/ui/AIAssistant";

export const metadata: Metadata = {
  metadataBase: new URL("https://pixelcraft.studio"),
  title: {
    default: "PixelCraft Studio - All-in-One Image Editor & Design Platform",
    template: "%s | PixelCraft Studio",
  },
  description:
    "Create stunning wedding cards, edit images, generate social media posts, and more with PixelCraft Studio. Free online design tools with Hindi & English support.",
  keywords: [
    "image editor",
    "wedding card generator",
    "invitation maker",
    "social media post",
    "background remover",
    "quote poster",
    "resume photo enhancer",
    "online design tool",
    "Indian wedding cards",
    "Hindi wedding invitation",
  ],
  openGraph: {
    title: "PixelCraft Studio - All-in-One Image Editor & Design Platform",
    description:
      "Create stunning wedding cards, edit images, generate social media posts, and more.",
    type: "website",
    siteName: "PixelCraft Studio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelCraft Studio - All-in-One Image Editor & Design Platform",
    description:
      "Create stunning wedding cards, edit images, generate social media posts, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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

        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="ox4VTUbDahG8OuY0-swj_8gpmzcLW3mhs1hUKsuQONg"
        />

        {/* Font styles */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        
        {/* Microsoft Clarity - Using your exact script format */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "w1qfvyn1or");
          `}
        </Script>
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

        {/* Global Structured Data (JSON-LD) */}
        <Script id="json-ld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PixelCraft Studio",
            "url": "https://pixelcraft.studio",
            "description": "All-in-one image editor, video editor, and wedding card generator.",
            "applicationCategory": "DesignApplication",
            "operatingSystem": "Web",
            "author": {
              "@type": "Person",
              "name": "Er Praveeen Kumar"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </Script>
      </body>
    </html>
  );
}

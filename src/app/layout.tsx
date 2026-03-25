import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import AIAssistant from "@/components/ui/AIAssistant";

export const metadata: Metadata = {
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
      "Create stunning wedding cards, edit images, generate social media posts, and more. Free online design tools with Hindi & English support.",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
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
          </main>
          <AIAssistant />
        </div>
      </body>
    </html>
  );
}

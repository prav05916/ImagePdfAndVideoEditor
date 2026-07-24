import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy – ShivanshStudio | How We Protect Your Data',
  description: 'Read the Privacy Policy of ShivanshStudio. Learn how we collect, use, and protect your personal data including uploaded images, payment information, and cookies. Your privacy is our priority.',
  alternates: {
    canonical: 'https://www.shivansh-studio.store/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy – ShivanshStudio',
    description: 'Read how ShivanshStudio handles and protects your personal data, images, and payment information.',
    url: 'https://www.shivansh-studio.store/privacy-policy',
    siteName: 'ShivanshStudio',
    images: [
      {
        url: 'https://www.shivansh-studio.store/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShivanshStudio Privacy Policy',
        type: 'image/png',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy – ShivanshStudio',
    description: 'Learn how ShivanshStudio collects, uses, and protects your personal data.',
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>We only collect the information necessary to provide you with our services. This includes images or files you upload for editing, and basic contact information when you make a payment or contact us.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p>Your uploaded files are processed strictly for the purpose of generating your requested output (e.g., edited photos, wedding cards). We do not use your personal images or data for any other purposes, nor do we sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Security and Retention</h2>
            <p>We implement security measures to protect your data. Uploaded images and generated documents are temporarily stored on our servers to allow you to download them. We periodically clear our temporary storage to protect your privacy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
            <p>We use third-party payment processors (such as Razorpay) to securely handle transactions. We do not store your full credit card or banking information on our servers. These payment processors have their own privacy policies governing your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies</h2>
            <p>We use essential cookies to keep track of your session and preferences while using our web application. You can instruct your browser to refuse all cookies, but some parts of our service may not function properly without them.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. Any changes will be posted on this page.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions – ShivanshStudio | User Agreement & Service Terms',
  description: 'Read the Terms and Conditions for using ShivanshStudio. Understand your rights and responsibilities when using our free online design tools including image editor, wedding card maker, and passport photo creator.',
  alternates: {
    canonical: 'https://www.shivansh-studio.store/terms',
  },
  openGraph: {
    title: 'Terms and Conditions – ShivanshStudio',
    description: 'Read the user agreement and service terms for ShivanshStudio\'s free online design tools.',
    url: 'https://www.shivansh-studio.store/terms',
    siteName: 'ShivanshStudio',
    images: [
      {
        url: 'https://www.shivansh-studio.store/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShivanshStudio Terms and Conditions',
        type: 'image/png',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Terms and Conditions – ShivanshStudio',
    description: 'Read the user agreement and service terms for ShivanshStudio.',
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using our website (https://www.shivansh-studio.store/) and services, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Digital Services</h2>
            <p>ShivanshStudio provides digital design tools, including but not limited to image editing, wedding card generation, and passport photo creation. Since all our services are digital in nature, no physical goods are shipped.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Payments</h2>
            <p>All payments made on the website are secure. We use third-party payment processors (such as Razorpay) to handle transactions. By making a payment, you agree to provide current, complete, and accurate purchase and account information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Intellectual Property</h2>
            <p>The service and its original content, features, and functionality are and will remain the exclusive property of ShivanshStudio and its licensors. You may not reproduce, distribute, or create derivative works without explicit permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. User Guidelines</h2>
            <p>You agree not to use our tools for any illegal purposes or to create content that is harmful, offensive, or violates any laws or third-party rights. We reserve the right to terminate access for users who violate these guidelines.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Modifications</h2>
            <p>We reserve the right to modify or replace these Terms at any time. We will notify users of any significant changes by updating the date at the top of this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us.</p>
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

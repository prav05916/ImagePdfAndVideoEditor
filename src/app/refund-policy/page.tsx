import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund and Cancellation Policy - ShivanshStudio',
  description: 'Refund, Cancellation, and Shipping Policy for ShivanshStudio.',
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund & Cancellation Policy</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Non-tangible Irrevocable Goods</h2>
            <p>ShivanshStudio operates entirely in the digital space. We offer digital services such as online image editing, wedding card generation, and automated resume formatting. Because our products are digital and delivered immediately upon payment, we issue refunds for non-tangible irrevocable goods only under exceptional circumstances.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Returns Policy</h2>
            <p><strong>My business does not support returns.</strong> As all deliverables are digital files (e.g., PDFs, JPGs, PNGs) downloaded directly to your device, they cannot be "returned" in a physical sense. Once a digital product has been downloaded or generated after payment, it is considered consumed.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Shipping Policy</h2>
            <p><strong>My business does not ship physical goods.</strong> All services provided by ShivanshStudio are entirely digital. You will not receive any physical package, mail, or shipment from us. Your finalized designs and edited photos are delivered electronically via direct download links on our website immediately after processing.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cancellations</h2>
            <p>If you face technical issues generating your document or if the final output fails to render due to a bug on our platform, you may contact our support team. We will review the issue and, if the service completely failed to deliver as described, we may process a cancellation and refund at our sole discretion.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Contacting Us for Support</h2>
            <p>If you experience any issues downloading or receiving your digital product, please contact us immediately so we can assist you and ensure you receive the service you paid for.</p>
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

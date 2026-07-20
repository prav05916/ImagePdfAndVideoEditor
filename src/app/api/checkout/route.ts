import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with a placeholder secret key if the environment variable isn't set
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-01-27.acacia' as any, // Typecast to any to avoid version errors if old stripe version
});

export async function POST(req: NextRequest) {
  try {
    const { productName, amount, redirectUrl } = await req.json();

    // The redirectUrl shouldn't contain query params at the end. We assume it's just the page URL.
    const baseUrl = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const finalRedirect = redirectUrl.startsWith('http') ? redirectUrl : `${baseUrl}${redirectUrl}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: productName || 'Premium Download',
            },
            unit_amount: amount || 5000, // Amount in cents (e.g. 5000 = 50 INR)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${finalRedirect}?success=true`,
      cancel_url: `${finalRedirect}?canceled=true`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

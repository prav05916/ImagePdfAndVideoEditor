import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-01-27.acacia' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } else {
      // For local testing without a webhook secret
      event = JSON.parse(payload);
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Configure NodeMailer
    // Note: You must add SMTP_USER and SMTP_PASS to your .env.local file
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Use an App Password from Gmail
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'p7484823093@gmail.com', // Notifying owner as requested
      subject: 'New Payment Received! - ShivanshStudio',
      text: `Great news! You received a new payment.
      
      Details:
      Amount: ${(session.amount_total || 0) / 100} ${session.currency?.toUpperCase()}
      Customer Email: ${session.customer_details?.email || 'N/A'}
      Payment Status: ${session.payment_status}
      `,
    };

    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
        console.log('Notification email sent to owner');
      } else {
        console.log('SMTP credentials not found. Email notification skipped.');
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Still return 200 so Stripe doesn't retry
    }
  }

  return NextResponse.json({ received: true });
}

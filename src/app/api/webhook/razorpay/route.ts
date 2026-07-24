import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: NextRequest) {
  try {
    // ── Guard: webhook secret must be configured ──────────────────────────
    if (!RAZORPAY_WEBHOOK_SECRET) {
      console.error('Razorpay Webhook: RAZORPAY_KEY_SECRET is not configured.');
      return NextResponse.json(
        { error: 'Server misconfiguration.' },
        { status: 500 }
      );
    }

    const payload = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // ── Signature is mandatory — reject anything without it ───────────────
    if (!signature) {
      console.error('Razorpay Webhook: Missing x-razorpay-signature header.');
      return NextResponse.json(
        { error: 'Missing signature.' },
        { status: 401 }
      );
    }

    // ── Verify HMAC-SHA256 signature ──────────────────────────────────────
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');

    // Use timingSafeEqual to prevent timing attacks
    const sigBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    if (
      sigBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      console.error('Razorpay Webhook: Invalid signature.');
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
    }

    const event = JSON.parse(payload);

    // ── Handle payment captured event ─────────────────────────────────────
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;

      // Configure NodeMailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: 'p7484823093@gmail.com',
        subject: 'New Payment Received! - ShivanshStudio',
        text: `Great news! You received a new payment via Razorpay.

Details:
Payment ID: ${payment.id}
Order ID: ${payment.order_id}
Amount: ₹${(payment.amount || 0) / 100} ${payment.currency}
Customer Email: ${payment.email || 'N/A'}
Customer Contact: ${payment.contact || 'N/A'}
Payment Status: ${payment.status}
Method: ${payment.method}
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
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Razorpay Webhook Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

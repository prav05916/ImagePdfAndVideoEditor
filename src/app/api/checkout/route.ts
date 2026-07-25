import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

function getRazorpayInstance() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
  });
}

// Razorpay minimum is 100 paise (₹1), max sensibly capped at ₹5000
const MIN_AMOUNT_PAISE = 100;
const MAX_AMOUNT_PAISE = 500_000;

export async function POST(req: NextRequest) {
  try {
    const razorpay = getRazorpayInstance();
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const { productName, amount } = body;

    // ── Input validation ────────────────────────────────────────────────────
    if (
      typeof amount !== 'number' ||
      !Number.isInteger(amount) ||
      amount < MIN_AMOUNT_PAISE ||
      amount > MAX_AMOUNT_PAISE
    ) {
      return NextResponse.json(
        {
          error: `Invalid amount. Must be an integer between ${MIN_AMOUNT_PAISE} and ${MAX_AMOUNT_PAISE} paise.`,
        },
        { status: 400 }
      );
    }

    if (
      typeof productName !== 'string' ||
      productName.trim().length === 0 ||
      productName.length > 255
    ) {
      return NextResponse.json(
        { error: 'Invalid productName.' },
        { status: 400 }
      );
    }

    // ── Create Razorpay order ────────────────────────────────────────────────
    const order = await razorpay.orders.create({
      amount, // already validated in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        productName: productName.trim(),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    // Log full error server-side but return a generic message to the client
    console.error('Razorpay Order Error:', err);
    return NextResponse.json(
      { error: 'Payment could not be initiated. Please try again.' },
      { status: 500 }
    );
  }
}

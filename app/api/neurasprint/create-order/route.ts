import { NextResponse } from "next/server"
import crypto from "crypto"

// ─── Razorpay API credentials ───
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!

// ─── POST: Create Razorpay Order ───
export async function POST(request: Request) {
  try {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        {
          error:
            "Payment gateway keys are not configured yet. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local to accept payments.",
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { registrationId, email, fullName } = body

    if (!registrationId || !email) {
      return NextResponse.json(
        { error: "Missing registration details" },
        { status: 400 }
      )
    }

    // Create order via Razorpay Orders API
    const orderPayload = {
      amount: 9900, // ₹99 in paise
      currency: "INR",
      receipt: registrationId,
      notes: {
        registration_id: registrationId,
        email: email,
        full_name: fullName,
        event: "NeuraSprint 2026",
      },
    }

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64"),
      },
      body: JSON.stringify(orderPayload),
    })

    if (!razorpayResponse.ok) {
      const errData = await razorpayResponse.json()
      console.error("Razorpay order creation failed:", errData)
      return NextResponse.json(
        { error: "Failed to create payment order. Please try again." },
        { status: 500 }
      )
    }

    const order = await razorpayResponse.json()

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID, // public key sent to client for checkout
    })
  } catch (error: any) {
    console.error("Create order error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

// ─── Supabase admin client ───
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!

// ─── POST: Verify Razorpay Payment ───
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registration_id,
    } = body

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !registration_id
    ) {
      return NextResponse.json(
        { error: "Missing payment verification data" },
        { status: 400 }
      )
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (generatedSignature !== razorpay_signature) {
      console.error("Payment signature mismatch", {
        expected: generatedSignature,
        received: razorpay_signature,
      })

      // Update payment status to failed
      await supabaseAdmin
        .from("neurasprint_registrations")
        .update({
          payment_status: "failed",
          razorpay_order_id,
          razorpay_payment_id,
        })
        .eq("registration_id", registration_id)

      return NextResponse.json(
        { error: "Payment verification failed. Signature mismatch." },
        { status: 400 }
      )
    }

    // Signature valid — update payment to paid
    const { data, error } = await supabaseAdmin
      .from("neurasprint_registrations")
      .update({
        payment_status: "paid",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paid_at: new Date().toISOString(),
        status: "confirmed",
      })
      .eq("registration_id", registration_id)
      .select("registration_id, full_name, email")
      .single()

    if (error) {
      console.error("Failed to update payment status:", error)
      return NextResponse.json(
        { error: "Payment verified but failed to update records. Contact support." },
        { status: 500 }
      )
    }

    // Send confirmation email (non-blocking)
    sendConfirmationEmail(data).catch((err) =>
      console.error("Failed to send confirmation email:", err)
    )

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully! You're registered for NeuraSprint 2026.",
      registration_id: data.registration_id,
    })
  } catch (error: any) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// ─── Send confirmation email ───
async function sendConfirmationEmail(registration: {
  registration_id: string
  full_name: string
  email: string
}) {
  try {
    const nodemailer = require("nodemailer")

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://codeneurax.com"

    await transporter.sendMail({
      from: `"CodeNeuraX" <${process.env.SMTP_USER || "codeneurax@gmail.com"}>`,
      to: registration.email,
      subject: `🎉 NeuraSprint 2026 — Registration Confirmed! [${registration.registration_id}]`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0118; color: #e2e8f0; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; color: #fff;">🚀 NeuraSprint 2026</h1>
            <p style="margin: 8px 0 0; color: #e9d5ff; font-size: 14px;">The 24-Hour Web Development Challenge</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #a78bfa; margin-top: 0;">Registration Confirmed! 🎉</h2>
            <p>Hi <strong>${registration.full_name}</strong>,</p>
            <p>Your registration for <strong>NeuraSprint 2026</strong> has been confirmed and payment received.</p>
            
            <div style="background: #1a0a2e; border: 1px solid #7c3aed40; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 8px; color: #a78bfa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Registration ID</p>
              <p style="margin: 0; font-size: 28px; font-weight: bold; color: #fff; font-family: monospace;">${registration.registration_id}</p>
            </div>

            <div style="background: #1a0a2e; border: 1px solid #7c3aed20; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #a78bfa; margin-top: 0; font-size: 14px;">Event Details</h3>
              <p style="margin: 4px 0;">📅 <strong>Date:</strong> December 28-29, 2026</p>
              <p style="margin: 4px 0;">⏰ <strong>Duration:</strong> 24 Hours</p>
              <p style="margin: 4px 0;">🌐 <strong>Mode:</strong> Online</p>
              <p style="margin: 4px 0;">🏆 <strong>Prize Pool:</strong> ₹7,500+</p>
            </div>

            <p style="color: #94a3b8; font-size: 14px;">Keep your Registration ID safe. You'll need it on the event day.</p>
            <p style="color: #94a3b8; font-size: 14px;">Stay tuned for updates on our WhatsApp community and social channels!</p>
            
            <div style="text-align: center; margin-top: 32px;">
              <a href="${siteUrl}/neurasprint" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Event Page</a>
            </div>
          </div>
          <div style="padding: 20px 32px; background: #050010; text-align: center; font-size: 12px; color: #64748b;">
            <p>© 2026 CodeNeuraX. All rights reserved.</p>
            <p>Questions? Reply to this email or contact us at codeneurax@gmail.com</p>
          </div>
        </div>
      `,
    })
  } catch (err) {
    console.error("Email send error:", err)
  }
}

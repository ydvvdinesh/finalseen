import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

// ─── Supabase admin client (service role) ───
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Generate unique registration ID ───
function generateRegistrationId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // no I, O, 0, 1 to avoid confusion
  let id = "NS26-"
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// ─── POST: Register for NeuraSprint 2026 ───
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      fullName,
      email,
      phone,
      college,
      year,
      branch,
      skills,
      githubUrl,
      linkedinUrl,
      priorHackathons,
    } = body

    // Validation
    if (!fullName || !email || !phone || !college || !year || !branch) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Phone validation (Indian)
    const phoneClean = phone.replace(/[\s\-\+]/g, "")
    if (!/^(\+91|91)?[6-9]\d{9}$/.test(phoneClean)) {
      return NextResponse.json(
        { error: "Invalid phone number. Please enter a valid Indian mobile number." },
        { status: 400 }
      )
    }

    // Check if already registered
    const { data: existing } = await supabaseAdmin
      .from("neurasprint_registrations")
      .select("id, registration_id, payment_status")
      .eq("email", email.toLowerCase().trim())
      .single()

    if (existing) {
      if (existing.payment_status === "paid") {
        return NextResponse.json(
          {
            error: "You are already registered and payment is confirmed!",
            registration_id: existing.registration_id,
            already_paid: true,
          },
          { status: 409 }
        )
      }
      // Already registered but payment pending — return existing record for retry
      return NextResponse.json(
        {
          message: "Registration found. Complete your payment.",
          registration_id: existing.registration_id,
          id: existing.id,
          payment_pending: true,
        },
        { status: 200 }
      )
    }

    // Generate unique registration ID
    let registrationId = generateRegistrationId()
    // Ensure uniqueness
    let attempts = 0
    while (attempts < 5) {
      const { data: idCheck } = await supabaseAdmin
        .from("neurasprint_registrations")
        .select("id")
        .eq("registration_id", registrationId)
        .single()
      if (!idCheck) break
      registrationId = generateRegistrationId()
      attempts++
    }

    // Insert registration
    const { data: registration, error: insertError } = await supabaseAdmin
      .from("neurasprint_registrations")
      .insert({
        full_name: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phoneClean,
        college: college.trim(),
        year,
        branch: branch.trim(),
        skills: skills || [],
        github_url: githubUrl?.trim() || null,
        linkedin_url: linkedinUrl?.trim() || null,
        prior_hackathons: priorHackathons?.trim() || null,
        registration_id: registrationId,
        payment_status: "pending",
        payment_amount: 9900, // ₹99 in paise
        status: "registered",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Registration insert error:", insertError)
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "This email is already registered." },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: "Failed to save registration. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: "Registration successful! Proceed to payment.",
        registration_id: registrationId,
        id: registration.id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// ─── GET: Check registration status ───
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const registrationId = searchParams.get("registration_id")

    if (!email && !registrationId) {
      return NextResponse.json(
        { error: "Provide email or registration_id" },
        { status: 400 }
      )
    }

    let query = supabaseAdmin
      .from("neurasprint_registrations")
      .select("registration_id, full_name, email, payment_status, status, created_at, paid_at")

    if (registrationId) {
      query = query.eq("registration_id", registrationId)
    } else if (email) {
      query = query.eq("email", email.toLowerCase().trim())
    }

    const { data, error } = await query.single()

    if (error || !data) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error("Registration check error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

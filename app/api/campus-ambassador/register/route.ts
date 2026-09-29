import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'
import { checkRateLimit } from '@/lib/rate-limiter'
import { archiveDeletedAmbassador, archiveAmbassadorApplication } from '@/lib/audit-logger'

// Use service role key to bypass RLS for inserts
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

// Generate unique ref number: CNX-CA-XXXX
function generateRefNo(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed ambiguous chars
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `CNX-CA-${code}`
}

export async function POST(req: Request) {
  // Rate limiting: 3 registrations per 10 minutes per IP
  const rateLimit = checkRateLimit(req, {
    windowMs: 10 * 60 * 1000,
    maxRequests: 3,
    message: 'Too many registration attempts. Please try again later.',
  })
  if (!rateLimit.allowed && rateLimit.response) {
    return rateLimit.response
  }

  try {
    // CSRF Protection
    const origin = req.headers.get('origin')
    const referer = req.headers.get('referer')
    const allowedDomains = ['http://localhost:3000', 'https://www.codeneurax.in', 'https://codeneurax.in']
    const isAllowedOrigin = origin && (allowedDomains.some(domain => origin.startsWith(domain)) || origin.endsWith('.vercel.app'))
    const isAllowedReferer = referer && (allowedDomains.some(domain => referer.startsWith(domain)) || referer.includes('.vercel.app'))

    if (process.env.NODE_ENV === 'production' && origin && !isAllowedOrigin && !isAllowedReferer) {
      return NextResponse.json({ error: 'Unauthorized request origin' }, { status: 403 })
    }

    const formData = await req.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const college = formData.get('college') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const linkedinUrl = formData.get('linkedin_url') as string
    const photo = formData.get('photo') as File | null

    // Validate required fields
    if (!name || !email || !college || !phone || !address || !linkedinUrl) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Input size limits
    if (name.length > 100 || email.length > 100 || college.length > 200 || phone.length > 20 || address.length > 500 || linkedinUrl.length > 300) {
      return NextResponse.json({ error: 'Input exceeds maximum allowed length' }, { status: 413 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate LinkedIn URL
    if (!linkedinUrl.includes('linkedin.com')) {
      return NextResponse.json({ error: 'Please provide a valid LinkedIn profile URL' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Check if email already registered
    const { data: existing } = await supabase
      .from('campus_ambassadors')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      if (existing.status === 'pending') {
        return NextResponse.json({ error: 'You already have a pending application. Please wait for admin review.' }, { status: 409 })
      }
      if (existing.status === 'approved') {
        return NextResponse.json({ error: 'You are already an approved Campus Ambassador!' }, { status: 409 })
      }
      // If rejected, archive previous rejected attempt for compliance before re-registering
      await archiveDeletedAmbassador(supabase, existing, {
        req,
        deletedByEmail: email,
        actionType: 're_registration_replacement',
        reason: 'User re-registered after previous application rejection',
      })
      await supabase.from('campus_ambassadors').delete().eq('id', existing.id)
    }

    // Generate unique ref_no (retry if collision)
    let refNo = generateRefNo()
    let retries = 5
    while (retries > 0) {
      const { data: existingRef } = await supabase
        .from('campus_ambassadors')
        .select('id')
        .eq('ref_no', refNo)
        .maybeSingle()
      if (!existingRef) break
      refNo = generateRefNo()
      retries--
    }

    // Upload photo to Supabase Storage
    let photoUrl = ''
    if (photo && photo.size > 0) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(photo.type)) {
        return NextResponse.json({ error: 'Photo must be JPEG, PNG, or WebP format' }, { status: 400 })
      }
      // Max 5MB
      if (photo.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Photo must be under 5MB' }, { status: 413 })
      }

      const ext = photo.type.split('/')[1] === 'jpeg' ? 'jpg' : photo.type.split('/')[1]
      const fileName = `${refNo.toLowerCase()}.${ext}`
      const buffer = Buffer.from(await photo.arrayBuffer())

      const { error: uploadError } = await supabase.storage
        .from('ambassador-photos')
        .upload(fileName, buffer, {
          contentType: photo.type,
          upsert: true,
        })

      if (uploadError) {
        console.error('Photo upload error:', uploadError)
        return NextResponse.json({
          error: `Photo upload failed: ${uploadError.message}. Please verify the 'ambassador-photos' storage bucket exists in Supabase.`,
        }, { status: 500 })
      }

      const { data: urlData } = supabase.storage
        .from('ambassador-photos')
        .getPublicUrl(fileName)
      photoUrl = urlData.publicUrl
    }

    const ambassadorPayload = {
      ref_no: refNo,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      college: college.trim(),
      phone: phone.trim(),
      address: address.trim(),
      linkedin_url: linkedinUrl.trim(),
      photo_url: photoUrl,
      status: 'pending',
    }

    // Insert into database
    const { data: newAmbassador, error: insertError } = await supabase
      .from('campus_ambassadors')
      .insert(ambassadorPayload)
      .select()
      .maybeSingle()

    if (insertError) {
      console.error('Insert error:', insertError)
      if (insertError.code === '42P01' || insertError.message?.includes('does not exist')) {
        return NextResponse.json({
          error: 'Database table "campus_ambassadors" does not exist yet. Please run the SQL migration script in Supabase SQL Editor.',
        }, { status: 500 })
      }
      return NextResponse.json({ error: `Registration failed: ${insertError.message || 'Please try again.'}` }, { status: 500 })
    }

    // Legal & Government Audit Archive: Record immutable copy of applicant submission
    await archiveAmbassadorApplication(supabase, newAmbassador || { ...ambassadorPayload, id: refNo }, {
      req,
      actorEmail: email.trim().toLowerCase(),
      actionType: 'ambassador_applied',
      reason: 'Candidate submitted new Campus Ambassador application',
    })

    // Send notification email to admin
    try {
      const host = process.env.SMTP_HOST
      const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
      const user = process.env.SMTP_USER
      const pass = process.env.SMTP_PASS
      const to = process.env.CONTACT_TO || 'codeneurax@gmail.com'

      if (host && user && pass) {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        })

        await transporter.sendMail({
          from: `CNX Campus Ambassador <${user}>`,
          to,
          subject: `New Campus Ambassador Registration — ${refNo}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>🎓 New Campus Ambassador Registration</h2>
              <p><strong>Ref No:</strong> ${refNo}</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>College:</strong> ${college}</p>
              <p><strong>Address:</strong> ${address}</p>
              <p><strong>LinkedIn:</strong> <a href="${linkedinUrl}">${linkedinUrl}</a></p>
              ${photoUrl ? `<p><strong>Photo:</strong> <a href="${photoUrl}">View Photo</a></p>` : ''}
              <hr/>
              <p style="color: #888;">Review and approve this profile from the Admin Panel.</p>
            </div>
          `,
        })
      }
    } catch (emailErr) {
      // Don't fail registration if email notification fails
      console.error('Email notification error:', emailErr)
    }

    return NextResponse.json({ ok: true, ref_no: refNo })
  } catch (err) {
    console.error('Campus Ambassador Registration error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

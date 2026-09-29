import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { checkRateLimit } from '@/lib/rate-limiter'

export async function POST(req: Request) {
  // Rate limiting: 5 applications per 10 minutes per IP
  const rateLimit = checkRateLimit(req, {
    windowMs: 10 * 60 * 1000,
    maxRequests: 5,
    message: 'Too many speaker applications submitted. Please try again later.',
  })
  if (!rateLimit.allowed && rateLimit.response) {
    return rateLimit.response
  }

  try {
    const origin = req.headers.get('origin')
    const referer = req.headers.get('referer')
    
    // CSRF Protection: Validate Origin or Referer against trusted domains
    const allowedDomains = ['http://localhost:3000', 'https://www.codeneurax.in', 'https://codeneurax.in']
    const isAllowedOrigin = origin && allowedDomains.some(domain => origin.startsWith(domain))
    const isAllowedReferer = referer && allowedDomains.some(domain => referer.startsWith(domain))
    
    if (process.env.NODE_ENV === 'production' && origin && !isAllowedOrigin && !isAllowedReferer) {
      return NextResponse.json({ error: 'Unauthorized request origin' }, { status: 403 })
    }

    const {
      name,
      email,
      phone,
      linkedin,
      expertise,
      message,
      eventId,
      eventTitle,
    } = await req.json()

    if (!name || !email || !expertise || !message || !eventId || !eventTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Input size limits
    if (
      name.length > 100 ||
      email.length > 100 ||
      expertise.length > 200 ||
      eventTitle.length > 200 ||
      message.length > 2000
    ) {
      return NextResponse.json({ error: 'Input exceeds maximum allowed length' }, { status: 413 })
    }

    const to = process.env.SPEAKER_TO || process.env.CONTACT_TO || 'codeneurax@gmail.com'
    const host = process.env.SMTP_HOST
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (!host || !user || !pass) {
      console.warn('Missing SMTP env variables')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    const mail = await transporter.sendMail({
      from: `CNX Speaker Application <${user}>`,
      replyTo: email,
      to,
      subject: `Speaker Application: ${eventTitle}`,
      text: [
        `Event: ${eventTitle} (ID: ${eventId})`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || '—'}`,
        `LinkedIn: ${linkedin || '—'}`,
        `Expertise: ${expertise}`,
        '',
        'About / Experience:',
        message,
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px;">
          <h2 style="color: #7c3aed;">New Speaker Application</h2>
          <p style="background: #1f2937; color: #e5e7eb; padding: 12px 16px; border-radius: 8px;">
            <strong>Event:</strong> ${eventTitle}<br/>
            <strong>Event ID:</strong> ${eventId}
          </p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${linkedin ? `<p><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></p>` : ''}
          <p><strong>Expertise / Topic:</strong> ${expertise}</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p><strong>About / Experience:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    })

    if (!mail.accepted || mail.accepted.length === 0) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Speaker application API error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

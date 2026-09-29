import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { checkRateLimit } from '@/lib/rate-limiter'

export async function POST(req: Request) {
  // Rate limiting: 5 messages per 10 minutes per IP
  const rateLimit = checkRateLimit(req, {
    windowMs: 10 * 60 * 1000,
    maxRequests: 5,
    message: 'Too many contact requests submitted. Please try again in a few minutes.',
  })
  if (!rateLimit.allowed && rateLimit.response) {
    return rateLimit.response
  }

  try {
    const origin = req.headers.get('origin')
    const referer = req.headers.get('referer')
    
    // Basic CSRF Protection: Validate Origin or Referer against trusted domains
    const allowedDomains = ['http://localhost:3000', 'https://www.codeneurax.in', 'https://codeneurax.in']
    const isAllowedOrigin = origin && allowedDomains.some(domain => origin.startsWith(domain))
    const isAllowedReferer = referer && allowedDomains.some(domain => referer.startsWith(domain))
    
    // Enforce check in production, or if origin is present
    if (process.env.NODE_ENV === 'production' && origin && !isAllowedOrigin && !isAllowedReferer) {
      return NextResponse.json({ error: 'Unauthorized request origin' }, { status: 403 })
    }

    const { name, email, topic, message } = await req.json()

    if (!name || !email || !topic || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Input Size Limits to prevent memory exhaustion
    if (name.length > 100 || email.length > 100 || topic.length > 50 || message.length > 2000) {
      return NextResponse.json({ error: 'Input exceeds maximum allowed length' }, { status: 413 })
    }

    const to = process.env.CONTACT_TO || 'codeneurax@gmail.com'
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
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
    })

    const subjectMap: Record<string, string> = {
      career_guidance: 'Career Guidance Request',
      make_website: 'Website Development Request',
      promotion: 'Promotion Request',
      other: 'Other Inquiry',
    }

    const safeName = String(name).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]!))
    const safeEmail = String(email).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]!))
    const safeTopic = String(subjectMap[topic] || topic).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]!))
    const safeMessage = String(message).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]!))

    const mail = await transporter.sendMail({
      from: `CodeNeuraX Contact <${user}>`,
      replyTo: email,
      to,
      subject: subjectMap[topic] || 'New Contact Request',
      text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>New Contact Request</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Topic:</strong> ${safeTopic}</p>
          <hr/>
          <p style="white-space: pre-wrap;">${safeMessage}</p>
        </div>
      `,
    })

    if (!mail.accepted || mail.accepted.length === 0) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

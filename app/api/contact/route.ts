import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const { name, email, topic, message } = await req.json()

    if (!name || !email || !topic || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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

    const mail = await transporter.sendMail({
      from: `CodeNeuraX Contact <${user}>`,
      replyTo: email,
      to,
      subject: subjectMap[topic] || 'New Contact Request',
      text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>New Contact Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Topic:</strong> ${subjectMap[topic] || topic}</p>
          <hr/>
          <p style="white-space: pre-wrap;">${message}</p>
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

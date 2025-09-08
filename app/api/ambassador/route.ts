import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const { name, email, university, message, phone, linkedin, photoUrl } = await req.json()

    if (!name || !email || !university) {
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
      secure: port === 465,
      auth: { user, pass },
    })

    const mail = await transporter.sendMail({
      from: `CNX Ambassador <${user}>`,
      replyTo: email,
      to,
      subject: 'New Campus Ambassador Application',
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || ''}\nLinkedIn: ${linkedin || ''}\nPhoto: ${photoUrl || ''}\nUniversity: ${university}\n\nMessage:\n${message || ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>New Campus Ambassador Application</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${linkedin ? `<p><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></p>` : ''}
          ${photoUrl ? `<p><strong>Photo URL:</strong> <a href="${photoUrl}">${photoUrl}</a></p>` : ''}
          <p><strong>University:</strong> ${university}</p>
          ${message ? `<hr/><p style="white-space: pre-wrap;">${message}</p>` : ''}
        </div>
      `,
    })

    if (!mail.accepted || mail.accepted.length === 0) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Ambassador API error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}



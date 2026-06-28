import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'pedidoscoprecubrimientos@gmail.com'

function escapeHtml(input: unknown) {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log('=== MENSAJE DE CONTACTO (SMTP no configurado) ===')
      console.log('De:', name, `<${email}>`)
      console.log('Teléfono:', phone)
      console.log('Asunto:', subject)
      console.log('Mensaje:', message)
      return NextResponse.json({ error: 'SMTP no configurado' }, { status: 503 })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const safeName = escapeHtml(name).trim()
    const safeEmail = escapeHtml(email).trim()
    const safePhone = escapeHtml(phone).trim()
    const safeSubject = escapeHtml(subject).trim()
    const safeMessage = escapeHtml(message).trim()

    const from = process.env.SMTP_FROM || process.env.SMTP_USER
    const now = new Date()
    const metaLine = `Enviado desde el formulario de contacto · ${now.toLocaleString('es-MX')}`

    await transporter.sendMail({
      from,
      to: CONTACT_TO_EMAIL,
      subject: `[COP México] Contacto · ${safeSubject || 'Sin asunto'} (${safeName || 'Sin nombre'})`,
      replyTo: safeEmail || undefined,
      text: [
        'Nuevo mensaje desde el formulario de contacto (COP México)',
        '',
        `Nombre: ${safeName || 'No proporcionado'}`,
        `Email: ${safeEmail || 'No proporcionado'}`,
        `Teléfono: ${safePhone || 'No proporcionado'}`,
        `Asunto: ${safeSubject || 'Sin asunto'}`,
        '',
        'Mensaje:',
        safeMessage || '(Vacío)',
        '',
        metaLine,
      ].join('\n'),
      html: `
        <div style="background:#f5f5f5;padding:24px;font-family:system-ui,-apple-system,sans-serif;color:#111;">
          <div style="max-width:680px;margin:0 auto;">
            <div style="background:#fff;border:1px solid #e5e5e5;">
              <div style="height:4px;background:#f97316;"></div>
              <div style="padding:18px 20px;border-bottom:1px solid #e5e5e5;">
                <div style="font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#525252;font-weight:700;">COP México · Contacto</div>
                <div style="margin-top:6px;font-size:22px;font-weight:800;">Nuevo mensaje</div>
                <div style="margin-top:6px;font-size:12px;color:#737373;">${escapeHtml(metaLine)}</div>
              </div>
              <div style="padding:18px 20px;">
                <div style="display:grid;gap:10px;">
                  <div style="border:1px solid #e5e5e5;padding:12px;">
                    <div style="font-size:11px;color:#737373;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Nombre</div>
                    <div style="margin-top:4px;font-size:14px;font-weight:600;">${safeName || 'No proporcionado'}</div>
                  </div>
                  <div style="border:1px solid #e5e5e5;padding:12px;">
                    <div style="font-size:11px;color:#737373;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Email</div>
                    <div style="margin-top:4px;font-size:14px;font-weight:600;"><a href="mailto:${safeEmail}" style="color:#111;">${safeEmail || 'No proporcionado'}</a></div>
                  </div>
                  <div style="border:1px solid #e5e5e5;padding:12px;">
                    <div style="font-size:11px;color:#737373;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Teléfono</div>
                    <div style="margin-top:4px;font-size:14px;font-weight:600;">${safePhone || 'No proporcionado'}</div>
                  </div>
                  <div style="border:1px solid #e5e5e5;padding:12px;">
                    <div style="font-size:11px;color:#737373;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Asunto</div>
                    <div style="margin-top:4px;font-size:14px;font-weight:700;">${safeSubject || 'Sin asunto'}</div>
                  </div>
                </div>
                <div style="margin-top:14px;border:1px solid #e5e5e5;background:#fafafa;padding:14px;">
                  <div style="font-size:11px;color:#737373;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Mensaje</div>
                  <div style="margin-top:8px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${safeMessage || '(Vacío)'}</div>
                </div>
              </div>
              <div style="padding:14px 20px;border-top:1px solid #e5e5e5;font-size:12px;color:#737373;">
                Responder a este correo contestará al remitente (${safeEmail || 'sin email'}).
              </div>
            </div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ message: 'Mensaje enviado correctamente' }, { status: 200 })
  } catch (error) {
    console.error('Error al enviar email:', error)
    return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 })
  }
}

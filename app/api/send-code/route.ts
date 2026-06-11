import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createToken } from '@/lib/verification-token';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const token = createToken(email, code);

    let emailSent = false;
    try {
      await transporter.sendMail({
        from: `"Metal Sport Gym" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Verify your Metal Sport account',
        text: `Your verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nMetal Sport Gym`,
        html: `
          <div style="font-family:'Inter',Arial,sans-serif;max-width:480px;margin:0 auto;background:#050f0a;border-radius:16px;overflow:hidden;border:1px solid rgba(0,212,170,0.15);">
            <div style="background:linear-gradient(135deg,#00d4aa 0%,#0891b2 100%);padding:32px 24px;text-align:center;">
              <div style="width:56px;height:56px;border-radius:16px;background:rgba(0,0,0,0.2);display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;border:1px solid rgba(255,255,255,0.15);">
                <span style="font-size:24px;font-weight:900;color:#fff;letter-spacing:1px;">MS</span>
              </div>
              <h1 style="color:#fff;font-size:20px;font-weight:800;margin:0;letter-spacing:1px;text-transform:uppercase;">Metal Sport Gym</h1>
              <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:4px 0 0;">Verify your account</p>
            </div>
            <div style="padding:28px 24px;background:#0a1812;">
              <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 20px;line-height:1.5;">
                Use the code below to verify your account and start your journey.
              </p>
              <div style="text-align:center;font-size:38px;font-weight:900;letter-spacing:10px;color:#00d4aa;padding:22px;background:rgba(0,212,170,0.06);border-radius:12px;border:1px solid rgba(0,212,170,0.12);font-family:monospace;">
                ${code}
              </div>
              <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);">
                <p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0;">
                  <span style="color:rgba(0,212,170,0.5);">⏱</span> This code expires in <strong style="color:rgba(255,255,255,0.4);">10 minutes</strong>
                </p>
              </div>
            </div>
            <div style="padding:16px 24px;text-align:center;background:#050f0a;border-top:1px solid rgba(255,255,255,0.04);">
              <p style="color:rgba(255,255,255,0.15);font-size:11px;margin:0;">
                Metal Sport Gym — Built for those who push beyond limits.
              </p>
            </div>
          </div>`,
      });
      emailSent = true;
    } catch (err: any) {
      console.log(`[DEV] Email failed: ${err?.message}`);
    }

    return NextResponse.json({ token, code: emailSent ? undefined : code, emailSent });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

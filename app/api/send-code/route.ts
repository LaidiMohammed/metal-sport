import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createToken } from '@/lib/verification-token';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const token = createToken(email, code);

    // Send email via Resend
    try {
      await resend.emails.send({
        from: 'metal.sport.31 <metal.sport.31@gym31.com>',
        to: email,
        subject: 'Your verification code for metal.sport.31',
        text: `Your verification code is: ${code}\n\nThis code expires in 10 minutes.`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:12px;">
            <div style="text-align:center;margin-bottom:20px;">
              <div style="width:48px;height:48px;border-radius:50%;background:#059669;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:18px;">M31</div>
              <h2 style="margin:8px 0 0;color:#1f2937;">metal.sport.31</h2>
            </div>
            <div style="background:#fff;border-radius:8px;padding:24px;border:1px solid #e5e7eb;">
              <p style="color:#4b5563;font-size:14px;margin:0 0 16px;">Use the code below to verify your account:</p>
              <div style="text-align:center;font-size:36px;font-weight:900;letter-spacing:8px;color:#059669;padding:20px;background:#f0fdf4;border-radius:8px;">${code}</div>
              <p style="color:#9ca3af;font-size:12px;margin:16px 0 0;">This code expires in 10 minutes.</p>
            </div>
          </div>`,
      });
    } catch {
      console.log(`[DEV] Email send failed — code for ${email}: ${code}`);
    }

    return NextResponse.json({ token });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

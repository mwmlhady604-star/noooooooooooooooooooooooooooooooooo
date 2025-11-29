import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, subject, html } = body;

    if (!email || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: "Iraq Business Registration <onboarding@adamhub.ai>"
,
      to: email,
      subject,
      html
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

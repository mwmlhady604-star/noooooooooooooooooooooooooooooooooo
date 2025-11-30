import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    // Check if Resend is properly configured
    if (!resend) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const { email, subject, html } = body;

    if (!email || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: "Iraq Business Registration <onboarding@adamhub.ai>",
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
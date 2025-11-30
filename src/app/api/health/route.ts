import { NextResponse } from "next/server";

export async function GET() {
  const status: Record<string, unknown> = {
    ok: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "unknown",
    // Check if required environment variables are present
    checks: {
      openaiApiKey: !!process.env.OPENAI_API_KEY,
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      resendApiKey: !!process.env.RESEND_API_KEY,
    }
  };

  return NextResponse.json(status);
}



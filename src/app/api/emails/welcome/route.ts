import { NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/resend";
import WelcomeEmail from "@/emails/Welcome";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: "Welcome to MiniCom!",
      react: WelcomeEmail({ name }),
    });

    if (error) {
      console.error("Resend welcome email error:", error);
      return NextResponse.json(
        { error: "Send failed", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (exception) {
    console.error("Welcome email endpoint error:", exception);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

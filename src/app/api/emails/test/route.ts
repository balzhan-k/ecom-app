import { NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const to = body?.email as string | undefined;
    const subject = (body?.subject as string) || "Resend test";
    const html =
      (body?.html as string) ||
      `<div style="font-family:Arial,sans-serif">
         <h2 style="color:#0e7490">Hello from MiniCom</h2>
         <p>If you see this, Resend works! 🎉</p>
       </div>`;

    if (!to) {
      return NextResponse.json(
        { error: "Please provide 'email' in JSON body" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json(
        { error: "Send failed", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e) {
    console.error("Resend test error:", e);
    return NextResponse.json({ error: "send failed" }, { status: 500 });
  }
}

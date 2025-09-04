import { NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/resend";
import OrderConfirmationEmail from "@/emails/OrderConfirmation";

export async function POST(req: Request) {
  try {
    const { email, orderId, items, totalAmount, currency } = await req.json();

    if (!email || !orderId || !items || !totalAmount || !currency) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `Your MiniCom Order Confirmation #${orderId.substring(0, 8)}`,
      react: OrderConfirmationEmail({ orderId, items, totalAmount, currency }),
    });

    if (error) {
      console.error("Resend order confirmation email error:", error);
      return NextResponse.json(
        { error: "Send failed", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (exception) {
    console.error("Order confirmation email endpoint error:", exception);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

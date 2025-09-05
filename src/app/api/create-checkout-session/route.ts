import { NextResponse } from "next/server";
import Stripe from "stripe";
import { initializeFirebaseAdmin } from "@/lib/firebase-admin";

const db = initializeFirebaseAdmin();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  try {
    const { items, userId } = await req.json(); // Изменено: добавлен userId

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const productId = item.id;
      const quantity = item.quantity;

      const productDoc = await db.collection("products").doc(productId).get();

      if (!productDoc.exists) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      const productData = productDoc.data();
      if (
        !productData ||
        typeof productData.price !== "number" ||
        typeof productData.title !== "string"
      ) {
        throw new Error(`Invalid product data for ID ${productId}.`);
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product: productId, // Исправлено: используем 'product' вместо 'product_data' с 'id'
          unit_amount: Math.round(productData.price * 100), // Умножаем на 100 и округляем до целого
        },
        quantity: quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get(
        "origin"
      )}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
      metadata: {
        // Добавлено: передаем userId в метаданные сессии
        userId: userId,
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (error: unknown) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

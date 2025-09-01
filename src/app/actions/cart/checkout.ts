"use server";

import Stripe from "stripe";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)
    ),
  });
}

const db = admin.firestore();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export interface CheckoutItem {
  id: string;
  quantity: number;
}

export async function createCheckoutSession(
  items: CheckoutItem[],
  userId?: string, // Добавлен userId
  origin?: string
) {
  try {
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
        typeof productData.title !== "string" ||
        typeof productData.stripePriceId !== "string" // Добавлена проверка на stripePriceId
      ) {
        throw new Error(
          `Invalid product data for ID ${productId}. Missing price or title.`
        );
      }

      lineItems.push({
        price: productData.stripePriceId, // Используем stripePriceId
        quantity: quantity,
      });
    }

    const baseUrl =
      origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      ...(userId && { metadata: { userId } }), // Условно добавляем userId в метаданные
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    };
  } catch (error: unknown) {
    console.error("Error creating checkout session:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

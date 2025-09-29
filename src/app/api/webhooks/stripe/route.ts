import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { initializeFirebaseAdmin } from "@/lib/firebase-admin";
import admin from "firebase-admin";
import { resend, FROM_EMAIL } from "@/lib/resend";
import OrderConfirmationEmail from "@/emails/OrderConfirmation";

const db = initializeFirebaseAdmin();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

async function getRawBody(request: NextRequest): Promise<string> {
  const chunks: Uint8Array[] = [];
  const reader = request.body?.getReader();

  if (!reader) {
    throw new Error("No request body");
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const body = new Uint8Array(
    chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  );
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.length;
  }

  return new TextDecoder().decode(body);
}

export async function POST(request: NextRequest) {
  try {
    const sig = request.headers.get("stripe-signature");
    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      );
    }

    const rawBody = await getRawBody(request);

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("❌ Missing STRIPE_WEBHOOK_SECRET environment variable");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error("❌ Signature verification error:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      default:
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    await updateProductStock(fullSession);

    const userId = session.metadata?.userId;
    if (userId) {
      const orderData = await saveOrderToHistory(fullSession, userId);

      const customerEmail = session.customer_details?.email;
      if (customerEmail && orderData) {
        try {
          const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [customerEmail],
            subject: `Your MiniCom Order Confirmation #${orderData.sessionId.substring(0, 8)}`,
            react: OrderConfirmationEmail({
              orderId: orderData.sessionId,
              items: orderData.items,
              totalAmount: orderData.totalAmount,
              currency: orderData.currency,
            }),
          });

          if (error) {
            console.error("Resend order confirmation email error:", error);
          }
        } catch (error) {
          console.error("❌ Failed to send order confirmation email:", error);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error processing order:", error);
    throw error;
  }
}

async function updateProductStock(session: Stripe.Checkout.Session) {
  if (!session.line_items?.data) {
    console.warn("⚠️ No items in session");
    return;
  }

  const batch = db.batch();

  for (const lineItem of session.line_items.data) {
    try {
      const stripeProduct = lineItem.price?.product as Stripe.Product;
      const productId = stripeProduct?.id;

      if (!productId) {
        console.warn(
          "⚠️ Firebase ID not found for product:",
          stripeProduct?.name
        );
        continue;
      }

      const quantity = lineItem.quantity || 0;

      const productQuery = await db
        .collection("products")
        .where("stripeProductId", "==", productId)
        .limit(1)
        .get();
      const productDoc = productQuery.docs[0];

      if (!productDoc?.exists) {
        console.warn(
          `⚠️ Product ${productId} not found in Firebase (by stripeProductId)`
        );
        continue;
      }

      const productRef = productDoc.ref;
      const productData = productDoc.data();
      const currentStock = productData?.stock || 0;
      const newStock = Math.max(0, currentStock - quantity);

      batch.update(productRef, {
        stock: newStock,
        "meta.updatedAt": new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Error updating product:", error);
    }
  }

  await batch.commit();
}

async function saveOrderToHistory(
  session: Stripe.Checkout.Session,
  userId: string
) {
  try {
    if (!session.line_items?.data) {
      console.warn("⚠️ No items to save to history");
      return;
    }

    const items = await Promise.all(
      session.line_items.data.map(async (lineItem) => {
        const stripeProduct = lineItem.price?.product as Stripe.Product;

        let firebaseProductId: string | undefined;
        let firebaseProductName: string =
          stripeProduct?.name || "Unknown Product";

        if (stripeProduct?.id) {
          const productQuery = await db
            .collection("products")
            .where("stripeProductId", "==", stripeProduct.id)
            .limit(1)
            .get();
          if (productQuery.docs.length > 0) {
            const productDoc = productQuery.docs[0];
            firebaseProductId = productDoc.id;
            const productData = productDoc.data();
            firebaseProductName =
              productData?.title || stripeProduct?.name || "Unknown Product";
          }
        }

        return {
          productId: firebaseProductId || stripeProduct?.id || "unknown",
          productName: firebaseProductName,
          quantity: lineItem.quantity || 0,
          price: (lineItem.price?.unit_amount || 0) / 100,
          totalPrice:
            ((lineItem.price?.unit_amount || 0) * (lineItem.quantity || 0)) /
            100,
        };
      })
    );

    const orderData = {
      userId,
      sessionId: session.id,
      items,
      totalAmount: (session.amount_total || 0) / 100,
      currency: session.currency || "usd",
      status: "completed",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      paymentStatus: session.payment_status,
    };

    await db.collection("orders").add(orderData);
    return orderData;
  } catch (error) {
    console.error("❌ Error saving order:", error);
    throw error;
  }
}

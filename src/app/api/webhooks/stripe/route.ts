import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK if not already initialized
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

// Special function to get raw body of the request
// Required for Stripe webhook signature verification
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
    console.log("🔔 Received webhook from Stripe");

    // Get signature from headers
    const sig = request.headers.get("stripe-signature");
    if (!sig) {
      console.error("❌ Missing Stripe signature");
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      );
    }

    // Get raw body for verification
    const rawBody = await getRawBody(request);

    // Verify signature (this is important for security!)
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
      console.log("✅ Stripe signature successfully verified");
    } catch (err) {
      console.error("❌ Signature verification error:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        console.log("💳 Processing successful payment");
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      default:
        console.log(`🤷 Unknown event type: ${event.type}`);
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

// Function to handle successful payment completion
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    console.log(`🛒 Processing session: ${session.id}`);

    // Get session details including line_items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items", "line_items.data.price.product"], // Исправлено
    });

    console.log("📦 Items in order:", fullSession.line_items?.data.length);

    console.log("⚙️ Calling updateProductStock..."); // Добавлен лог
    // Update product stock
    await updateProductStock(fullSession);

    // If user was authenticated, save order to history
    const userId = session.metadata?.userId;
    if (userId) {
      console.log(`👤 Saving order for user: ${userId}`);
      const orderData = await saveOrderToHistory(fullSession, userId);

      // Send order confirmation email
      const customerEmail = session.customer_details?.email;
      if (customerEmail && orderData) {
        try {
          // We can call the API route, but calling Resend directly is more efficient here.
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: customerEmail,
              orderId: orderData.sessionId,
              items: orderData.items,
              totalAmount: orderData.totalAmount,
              currency: orderData.currency,
            }),
          });
          console.log(`📧 Order confirmation email sent to ${customerEmail}`);
        } catch (error) {
          console.error("❌ Failed to send order confirmation email:", error);
        }
      }
    } else {
      console.log("👤 Order from unauthenticated user");
    }

    console.log("✅ Order successfully processed");
  } catch (error) {
    console.error("❌ Error processing order:", error);
    throw error;
  }
}

// Function to update product stock quantities
async function updateProductStock(session: Stripe.Checkout.Session) {
  if (!session.line_items?.data) {
    console.warn("⚠️ No items in session");
    return;
  }

  console.log("📦 Updating product stock...");

  // Use batch for atomic updates of all products
  const batch = db.batch();

  for (const lineItem of session.line_items.data) {
    console.log("🔄 Processing line item:", lineItem.id); // Добавлен лог
    try {
      // Get product ID from Stripe product metadata
      const stripeProduct = lineItem.price?.product as Stripe.Product;
      const productId = stripeProduct?.id; // Изменено: теперь используем stripeProduct.id

      if (!productId) {
        console.warn(
          "⚠️ Firebase ID not found for product:",
          stripeProduct?.name
        );
        continue;
      }

      const quantity = lineItem.quantity || 0;
      console.log(`📦 Updating product ${productId}: -${quantity}`);

      // Get current product data
      // const productRef = db.collection("products").doc(productId);
      // const productDoc = await productRef.get();

      const productQuery = await db
        .collection("products")
        .where("stripeProductId", "==", productId)
        .limit(1)
        .get();
      const productDoc = productQuery.docs[0]; // Получаем первый (и единственный) документ

      if (!productDoc?.exists) {
        console.warn(
          `⚠️ Product ${productId} not found in Firebase (by stripeProductId)`
        );
        continue;
      }

      const productRef = productDoc.ref;
      const productData = productDoc.data();
      const currentStock = productData?.stock || 0;
      const newStock = Math.max(0, currentStock - quantity); // Prevent negative stock

      // Add operation to batch
      batch.update(productRef, {
        stock: newStock,
        "meta.updatedAt": new Date().toISOString(),
      });

      console.log(`📦 ${productData?.title}: ${currentStock} → ${newStock}`);
    } catch (error) {
      console.error("❌ Error updating product:", error);
    }
  }

  // Execute all updates atomically
  await batch.commit();
  console.log("✅ Product stock updated");
}

// Function to save order to user's history
async function saveOrderToHistory(
  session: Stripe.Checkout.Session,
  userId: string
) {
  try {
    if (!session.line_items?.data) {
      console.warn("⚠️ No items to save to history");
      return;
    }

    // Prepare items data
    const items = await Promise.all(
      session.line_items.data.map(async (lineItem) => {
        // Изменено: добавлен await Promise.all и async
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
            firebaseProductId = productDoc.id; // Получаем ID документа Firebase
            const productData = productDoc.data();
            firebaseProductName =
              productData?.title || stripeProduct?.name || "Unknown Product";
          }
        }

        return {
          productId: firebaseProductId || stripeProduct?.id || "unknown", // Используем ID документа Firebase, если найден, иначе Stripe Product ID
          productName: firebaseProductName,
          quantity: lineItem.quantity || 0,
          price: (lineItem.price?.unit_amount || 0) / 100, // Convert cents to dollars
          totalPrice:
            ((lineItem.price?.unit_amount || 0) * (lineItem.quantity || 0)) /
            100,
        };
      })
    );

    // Create order record
    const orderData = {
      userId,
      sessionId: session.id,
      items,
      totalAmount: (session.amount_total || 0) / 100, // Convert cents to dollars
      currency: session.currency || "usd",
      status: "completed",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      paymentStatus: session.payment_status,
    };

    // Save to orders collection
    await db.collection("orders").add(orderData);
    console.log("✅ Order saved to user history");
    return orderData; // Return the created order data
  } catch (error) {
    console.error("❌ Error saving order:", error);
    throw error;
  }
}

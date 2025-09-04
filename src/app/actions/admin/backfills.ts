"use server";

import admin from "firebase-admin";
import { stripe } from "@/lib/stripe";
import { toCents } from "@/utils/formatters";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set"
    );
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY: ${error}`);
  }
}

const db = admin.firestore();

export async function backfillStripeIds(): Promise<{
  total: number;
  updated: number;
  skipped: number;
  errors: number;
  details: string[];
}> {
  const snapshot = await db.collection("products").get();

  const total = snapshot.size;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  const details: string[] = [];

  console.log(`Found ${total} products to check...`);

  for (const docSnapshot of snapshot.docs) {
    const productId = docSnapshot.id;
    const productData = docSnapshot.data() as {
      title?: string;
      description?: string;
      images?: string[];
      price?: number;
      stripeProductId?: string;
      stripePriceId?: string;
    };

    try {
      console.log(
        `Processing product: ${productData.title || "Unknown"} (${productId})`
      );

      let stripeProductId = productData.stripeProductId;
      let stripePriceId = productData.stripePriceId;
      let needsUpdate = false;

      if (!stripeProductId) {
        console.log(`Creating Stripe product for: ${productData.title}`);

        const stripeProduct = await stripe.products.create({
          name: productData.title || "Untitled Product",
          description: productData.description || "No description",
          images: Array.isArray(productData.images)
            ? productData.images.slice(0, 8)
            : [],
        });

        stripeProductId = stripeProduct.id;
        needsUpdate = true;
        details.push(
          `Created Stripe product: ${stripeProduct.id} for ${productData.title}`
        );
      }

      if (!stripePriceId && typeof productData.price === "number") {
        console.log(`Creating Stripe price for: ${productData.title}`);

        const priceInCents = toCents(productData.price);
        const stripePrice = await stripe.prices.create({
          unit_amount: priceInCents,
          currency: "usd",
          product: stripeProductId!,
        });

        stripePriceId = stripePrice.id;
        needsUpdate = true;
        details.push(
          `Created Stripe price: ${stripePrice.id} for ${productData.title}`
        );
      }

      if (needsUpdate) {
        await db.collection("products").doc(productId).update({
          stripeProductId,
          stripePriceId,
        });

        updated++;
        console.log(`Updated Firebase document for: ${productData.title}`);
      } else {
        skipped++;
        console.log(`Skipped (already has Stripe IDs): ${productData.title}`);
      }
    } catch (error) {
      console.error(`Error processing product ${productId}:`, error);
      errors++;
      details.push(`Error for ${productData.title || "Unknown"}: ${error}`);
    }
  }

  console.log(
    `Backfill completed: ${updated} updated, ${skipped} skipped, ${errors} errors`
  );

  return {
    total,
    updated,
    skipped,
    errors,
    details,
  };
}

"use server";

import { collections, db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { stripe } from "@/lib/stripe";
import { toCents } from "@/utils/formatters";

export async function backfillStripeIds(): Promise<{
  total: number;
  updated: number;
  skipped: number;
  errors: number;
  details: string[];
}> {
  const productsRef = collection(db, collections.products);
  const snapshot = await getDocs(productsRef);
  
  let total = snapshot.size;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  let details: string[] = [];

  console.log(`Found ${total} products to check...`);

  for (const docSnapshot of snapshot.docs) {
    const productId = docSnapshot.id;
    const productData = docSnapshot.data() as any;

    try {
      console.log(`Processing product: ${productData.title || 'Unknown'} (${productId})`);

      // Проверяем, есть ли уже Stripe ID
      let stripeProductId = productData.stripeProductId;
      let stripePriceId = productData.stripePriceId;
      let needsUpdate = false;

      // Если нет Product ID, создаём в Stripe
      if (!stripeProductId) {
        console.log(`Creating Stripe product for: ${productData.title}`);
        
        const stripeProduct = await stripe.products.create({
          name: productData.title || 'Untitled Product',
          description: productData.description || 'No description',
          images: Array.isArray(productData.images) ? productData.images.slice(0, 8) : [],
        });
        
        stripeProductId = stripeProduct.id;
        needsUpdate = true;
        details.push(`Created Stripe product: ${stripeProduct.id} for ${productData.title}`);
      }

      // Если нет Price ID или цена изменилась, создаём новую цену
      if (!stripePriceId && typeof productData.price === 'number') {
        console.log(`Creating Stripe price for: ${productData.title}`);
        
        const priceInCents = toCents(productData.price);
        const stripePrice = await stripe.prices.create({
          unit_amount: priceInCents,
          currency: 'usd',
          product: stripeProductId!,
        });
        
        stripePriceId = stripePrice.id;
        needsUpdate = true;
        details.push(`Created Stripe price: ${stripePrice.id} for ${productData.title}`);
      }

      // Если что-то создали, обновляем документ в Firebase
      if (needsUpdate) {
        await updateDoc(doc(db, collections.products, productId), {
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
      details.push(`Error for ${productData.title || 'Unknown'}: ${error}`);
    }
  }

  console.log(`Backfill completed: ${updated} updated, ${skipped} skipped, ${errors} errors`);
  
  return {
    total,
    updated,
    skipped,
    errors,
    details
  };
}
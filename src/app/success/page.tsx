import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import Image from "next/image";
import ClearCartOnMount from "./ClearCartOnMount";
import Link from "next/link";
import type Stripe from "stripe";
import { initializeFirebaseAdmin } from "@/lib/firebase-admin";
import admin from "firebase-admin";

const db = initializeFirebaseAdmin();

async function ensureOrderSaved(
  session: Stripe.Response<Stripe.Checkout.Session>
) {
  try {
    const userId = session.metadata?.userId as string | undefined;
    if (!userId) return; 

    const existing = await db
      .collection("orders")
      .where("sessionId", "==", session.id)
      .limit(1)
      .get();
    if (!existing.empty) return;

    const items = await Promise.all(
      (session.line_items?.data ?? []).map(
        async (lineItem: Stripe.LineItem) => {
          const price = lineItem.price; 
          const productRef = price?.product ?? null; 

          let stripeProductId: string | undefined;
          let firebaseProductName: string = "Unknown Product";
          if (
            productRef &&
            typeof productRef === "object" &&
            "name" in productRef
          ) {
            firebaseProductName = (productRef as Stripe.Product).name;
          }

          if (productRef) {
            if (typeof productRef === "string") {
              stripeProductId = productRef;
            } else {
              stripeProductId = productRef.id;
            }

            if (stripeProductId) {
              const productQuery = await db
                .collection("products")
                .where("stripeProductId", "==", stripeProductId)
                .limit(1)
                .get();
              if (!productQuery.empty) {
                const productDoc = productQuery.docs[0];
                const productData = productDoc.data();
                firebaseProductName = productData?.title || firebaseProductName;
                stripeProductId = productDoc.id;
              }
            }
          }

          const unitAmount = price?.unit_amount ?? 0; 
          const quantity = lineItem.quantity ?? 0;

          return {
            productId: stripeProductId || "unknown",
            productName: firebaseProductName,
            quantity,
            price: unitAmount / 100,
            totalPrice: (unitAmount * quantity) / 100,
          };
        }
      )
    );

    const orderData = {
      userId,
      sessionId: session.id,
      items,
      totalAmount: (session.amount_total ?? 0) / 100,
      currency: session.currency || "usd",
      status: "completed",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      paymentStatus: session.payment_status,
    };

    await db.collection("orders").add(orderData);
  } catch (e) {
    console.error("ensureOrderSaved error", e);
  }
}

interface SuccessProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export default async function Success({ searchParams }: SuccessProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  try {
    const session: Stripe.Response<Stripe.Checkout.Session> =
      await stripe.checkout.sessions.retrieve(session_id, {
        expand: [
          "line_items",
          "line_items.data.price.product",
          "payment_intent",
        ],
      });

    const status = session.status;

    if (status === "open") {
      return redirect("/");
    }

    if (status === "complete") {
      await ensureOrderSaved(session);
      return (
        <div className="container mt-10 mb-20 mx-auto flex flex-col items-center justify-center max-w-sm lg:max-w-lg">
          <ClearCartOnMount />
          <Image
            src="/cart-main-banner.jpg"
            alt="Shopping Bag"
            width={480}
            height={480}
            className="rounded-lg w-full max-w-[480px]"
          />

          <p className="text-lg font-bold leading-tight text-center text-cyan-700 mt-6">
            Payment Successful!
          </p>
          <p className="text-sm font-normal leading-normal  text-center mt-2 text-stone-500 ">
            Thank you for your order! Your order has been placed and is on its
            way. You&apos;ll receive an email confirmation shortly.
          </p>
          <Link
            href="/"
            className="bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-3 rounded-lg transition-colors mt-4 font-semibold"
          >
            Continue shopping
          </Link>
          <div className="text-sm text-gray-500 mt-6 text-center">
            <p>
              If you have any questions, please contact our support:{" "}
              <a
                href="mailto:support@example.com"
                className="text-cyan-600 hover:underline"
              >
                support@minicom.com
              </a>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-8 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">
            Payment Processing
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Your payment is being processed. Status: {status}
          </p>
          <Link
            href="/"
            className="inline-block bg-cyan-700 text-white px-6 py-3 rounded-lg hover:bg-cyan-800 transition-colors font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error retrieving session:", error);
    return (
      <div className="container mx-auto p-8 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Error Checking Payment
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Unable to verify your payment status. Please contact support.
          </p>
          <Link
            href="/"
            className="inline-block bg-cyan-700 text-white px-6 py-3 rounded-lg hover:bg-cyan-800 transition-colors font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
}

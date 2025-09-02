import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import Image from "next/image";
import ClearCartOnMount from "./ClearCartOnMount";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)
    ),
  });
}

const db = admin.firestore();

async function ensureOrderSaved(session: any) {
  try {
    const userId = session?.metadata?.userId as string | undefined;
    if (!userId) return; // only save for authenticated users

    // Skip if already saved
    const existing = await db
      .collection("orders")
      .where("sessionId", "==", session.id)
      .limit(1)
      .get();
    if (!existing.empty) return;

    const items = await Promise.all(
      (session.line_items?.data || []).map(async (lineItem: any) => {
        const stripeProduct = lineItem.price?.product as
          | { id?: string; name?: string }
          | undefined;
        let firebaseProductId: string | undefined;
        let firebaseProductName: string =
          stripeProduct?.name || "Unknown Product";

        if (stripeProduct?.id) {
          const productQuery = await db
            .collection("products")
            .where("stripeProductId", "==", stripeProduct.id)
            .limit(1)
            .get();
          if (!productQuery.empty) {
            const productDoc = productQuery.docs[0];
            firebaseProductId = productDoc.id;
            const productData = productDoc.data() as any;
            firebaseProductName = productData?.title || firebaseProductName;
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
  } catch (e) {
    console.error("ensureOrderSaved error", e);
  }
}

interface SuccessProps {
  searchParams: {
    session_id?: string;
  };
}

export default async function Success({ searchParams }: SuccessProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "line_items.data.price.product", "payment_intent"],
    });

    const status = session.status;
    const customerEmail = session.customer_details?.email;

    if (status === "open") {
      return redirect("/");
    }

    if (status === "complete") {
      // Fallback: save order if webhook hasn't saved it yet
      await ensureOrderSaved(session);
      return (
        <div className="container mt-10 mb-20 mx-auto flex flex-col items-center justify-center max-w-sm lg:max-w-lg">
          {/* Clear cart when arriving at success page */}
          <ClearCartOnMount />
          <Image
            src="/shoppingBag.jpg"
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
            way. You'll receive an email confirmation shortly.
          </p>
          <a
            href="/"
            className="bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-3 rounded-lg transition-colors mt-4 font-semibold"
          >
            Continue shopping
          </a>
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
          <a
            href="/"
            className="inline-block bg-cyan-700 text-white px-6 py-3 rounded-lg hover:bg-cyan-800 transition-colors font-semibold"
          >
            Continue Shopping
          </a>
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
          <a
            href="/"
            className="inline-block bg-cyan-700 text-white px-6 py-3 rounded-lg hover:bg-cyan-800 transition-colors font-semibold"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }
}

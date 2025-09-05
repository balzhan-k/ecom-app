import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/types/product";
import { Timestamp } from "firebase-admin/firestore";
import { initializeFirebaseAdmin } from "@/lib/firebase-admin";
import admin from "firebase-admin";

interface OrderItem {
  productId: string;
  thumbnail?: string;
  [key: string]: unknown;
}

interface Order {
  id: string;
  createdAt: Timestamp;
  items: OrderItem[];
  [key: string]: unknown;
}

const db = initializeFirebaseAdmin();

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const [, token] = authHeader.split(" ");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const userId = decoded.uid;

    const snap = await db
      .collection("orders")
      .where("userId", "==", userId)
      .get();

    const ordersRaw = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as unknown as Order)
      .sort((a, b) => {
        const at = a?.createdAt?.seconds ?? 0;
        const bt = b?.createdAt?.seconds ?? 0;
        return bt - at;
      });

    const orders = await Promise.all(
      ordersRaw.map(async (order) => {
        const items = await Promise.all(
          (order.items || []).map(async (item) => {
            if (item.thumbnail) return item;
            let thumbnail: string | undefined;
            try {
              if (item.productId) {
                const prodDoc = await db
                  .collection("products")
                  .doc(item.productId)
                  .get();
                if (prodDoc.exists) {
                  const data = prodDoc.data() as Product;
                  if (Array.isArray(data?.images) && data.images.length > 0) {
                    thumbnail = data.images[0];
                  }
                }
              }
            } catch {}
            return { ...item, thumbnail };
          })
        );
        return { ...order, items };
      })
    );

    return NextResponse.json({ orders });
  } catch (e) {
    console.error("GET /api/orders error", e);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

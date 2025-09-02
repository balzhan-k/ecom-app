import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)
    ),
  });
}

const db = admin.firestore();

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
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => {
        const at = a?.createdAt?.seconds ?? 0;
        const bt = b?.createdAt?.seconds ?? 0;
        return bt - at;
      });

    const orders = await Promise.all(
      ordersRaw.map(async (order: any) => {
        const items = await Promise.all(
          (order.items || []).map(async (item: any) => {
            if (item.thumbnail) return item;
            let thumbnail: string | undefined;
            try {
              if (item.productId) {
                const prodDoc = await db
                  .collection("products")
                  .doc(item.productId)
                  .get();
                if (prodDoc.exists) {
                  const data = prodDoc.data() as any;
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

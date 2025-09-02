"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import Link from "next/link";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface OrderDoc {
  id: string;
  createdAt?: { seconds: number; nanoseconds: number } | null;
  status: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data: OrderDoc[] = snapshot.docs.map((doc) => {
          const d = doc.data() as any;
          return {
            id: doc.id,
            createdAt: d.createdAt ?? null,
            status: d.status,
            totalAmount: d.totalAmount,
            currency: d.currency,
            items: d.items ?? [],
          };
        });
        setOrders(data);
      } catch (e) {
        console.error("Failed to load orders", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-gray-700">Please sign in to view your orders.</p>
        <Link
          href="/login"
          className="inline-block mt-4 px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cyan-700">My Orders</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-700">You have no orders yet.</p>
          <Link
            href="/"
            className="inline-block mt-4 px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="bg-white p-4 rounded shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <div className="font-medium">
                    Order #{order.id.substring(0, 8)}
                  </div>
                  <div>
                    {order.createdAt
                      ? new Date(
                          order.createdAt.seconds * 1000
                        ).toLocaleString()
                      : "—"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-cyan-700">
                    {order.totalAmount.toFixed(2)}{" "}
                    {order.currency.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">{order.status}</div>
                </div>
              </div>

              <div className="mt-3 border-t pt-3">
                <ul className="text-sm text-gray-700 space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span>
                        {item.totalPrice.toFixed(2)}{" "}
                        {order.currency.toUpperCase()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

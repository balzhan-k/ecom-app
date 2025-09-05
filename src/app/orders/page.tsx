"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  thumbnail?: string;
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
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const json = await res.json();
        const data: OrderDoc[] = (json.orders || []).map((o: OrderDoc) => ({
          id: o.id,
          createdAt: o.createdAt ?? null,
          status: o.status,
          totalAmount: o.totalAmount,
          currency: o.currency,
          items: o.items ?? [],
        }));
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
          className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-700"
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
        <ul className="space-y-4 mb-20">
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
                <ul className="space-y-3">
                  {order.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center border-b border-gray-200 pb-3 last:border-b-0"
                    >
                      {/* thumbnail */}
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.productName}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg mr-4"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg mr-4" />
                      )}

                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {item.productName}
                        </h4>
                        <p className="text-cyan-700 font-semibold">
                          {order.currency.toUpperCase()} {item.price.toFixed(2)}
                        </p>
                        <div className="mt-1 text-sm text-gray-600">
                          Qty: {item.quantity}
                        </div>
                      </div>

                      <div className="text-right font-semibold text-gray-800">
                        {item.totalPrice.toFixed(2)}{" "}
                        {order.currency.toUpperCase()}
                      </div>
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

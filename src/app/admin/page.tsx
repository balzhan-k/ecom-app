"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import ProductCardBase from "@/components/products/ProductCardBase";
import { getAllProducts } from "@/utils/products";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  calculateDiscountedPrice,
} from "@/utils/formatters";
import { Product } from "@/types/product";

export default function AdminDashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (userData?.role !== "admin") {
        router.push("/");
        return;
      }
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    const load = async () => {
      if (loading || !user || userData?.role !== "admin") return;
      try {
        setLoadingProducts(true);
        const list = await getAllProducts();
        setProducts(list);
      } catch (e) {
        console.error("Failed to load products", e);
        setError("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };
    load();
  }, [loading, user, userData]);

  if (loading) {
    return (
      <div className="container mx-auto py-4 pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user || userData?.role !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto py-4 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="tracking-light text-2xl font-bold leading-tight text-cyan-700 py-2">
         Your Dashboard
        </h1>
        <Link
          href="/admin/products/new"
          className="bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-800 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add New
        </Link>
      </div>

      {loadingProducts ? (
        <div className="text-center text-gray-600">Loading products...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {products.map((product) => {
            const discounted = calculateDiscountedPrice(
              product.price,
              product.discountPercentage
            );
            const imageUrl =
              product.images && product.images.length > 0
                ? product.images[0]
                : "/placeholder.jpg";

            return (
              <ProductCardBase
                key={product.id}
                product={product}
                imageHeightClass="h-64"
                showDiscountBadge
                showStock
                actions={
                  <>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded bg-cyan-700 text-white hover:bg-cyan-800"
                    >
                      <PencilIcon className="w-4 h-4" /> Edit
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/delete`}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded bg-rose-500 text-white hover:bg-rose-700"
                    >
                      <TrashIcon className="w-4 h-4" /> Delete
                    </Link>
                  </>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

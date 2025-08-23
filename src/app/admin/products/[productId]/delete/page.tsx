"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteProductAction } from "@/app/actions/admin/products";
import { getProductById } from "@/utils/products";
import { useEffect } from "react";
import { Product } from "@/types/product";
import { TrashIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import {
  formatPrice,
  formatNumber,
  formatText,
  getProductDisplayTitle,
} from "@/utils/formatters";

interface DeletePageProps {
  params: Promise<{ productId: string }>;
}

export default function DeletePage({ params }: DeletePageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadProduct() {
      try {
        const { productId } = await params;
        const productData = await getProductById(productId);

        if (!productData) {
          setError("Product not found");
          return;
        }

        setProduct(productData);
      } catch (err) {
        setError("Failed to load product");
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params]);

  const handleDelete = async () => {
    if (!product) return;

    setDeleting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("id", product.id);

      const result = await DeleteProductAction(
        { success: false, message: "", inputs: {} },
        formData
      );

      if (result.success) {
        router.push("/admin");
      } else {
        setError(result.message || "Failed to delete product");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error deleting product:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || "Product not found"}
          </div>
          <Link
            href="/admin"
            className="bg-cyan-700 text-white px-4 py-2 rounded-lg hover:bg-cyan-800 transition-colors"
          >
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 pb-20">
      <div className="mx-auto">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-cyan-700 hover:text-cyan-800 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Admin
          </Link>
        </div>

        <div className="bg-white border border-red-200 rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <TrashIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Delete Product
              </h1>
              <p className="text-gray-600">This action cannot be undone</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold text-gray-900 mb-2">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Title</p>
                <p className="font-medium">{getProductDisplayTitle(product)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{formatText(product.category)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-medium">{formatPrice(product.price)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Stock</p>
                <p className="font-medium">{formatNumber(product.stock)}</p>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Warning</h3>
            <p className="text-red-700 text-sm">
              Deleting this product will permanently remove it from the database
              and delete all associated images. This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <TrashIcon className="w-4 h-4" />
                  Delete Product
                </>
              )}
            </button>

            <Link
              href="/admin"
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

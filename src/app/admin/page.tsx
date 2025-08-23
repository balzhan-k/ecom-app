import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/utils/products";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  formatPrice,
  getProductDisplayTitle,
  calculateDiscountedPrice,
} from "@/utils/formatters";

// Force dynamic rendering to prevent caching issues
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const products = await getAllProducts();

  return (
    <div className="container mx-auto py-4 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="tracking-light text-2xl font-bold leading-tight text-cyan-700 py-2">
          Admin Products
        </h1>
        <Link
          href="/admin/products/new"
          className="bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-800 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add New
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex items-center gap-4"
          >
            <Image
              src={product.images[0]}
              alt={product.title}
              width={64}
              height={64}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <div className="space-y-1">
                <div className="font-medium text-gray-900">
                  {getProductDisplayTitle(product)}
                </div>
                <div className="text-sm text-gray-600">{product.category}</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-cyan-600">
                    {formatPrice(
                      calculateDiscountedPrice(
                        product.price,
                        product.discountPercentage
                      )
                    )}
                  </span>
                  {(product.discountPercentage ?? 0) > 0 && (
                    <span className="text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <PencilIcon className="w-4 h-4" />
              </Link>

              <Link
                href={`/admin/products/${product.id}/delete`}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <TrashIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

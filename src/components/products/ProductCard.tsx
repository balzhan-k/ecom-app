"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import {
  calculateDiscountedPrice,
  getProductDisplayTitle,
} from "@/utils/formatters";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.jpg";

  return (
    <Link href={`/categories/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-64 w-full">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-t-lg"
          />
          {(product.discountPercentage ?? 0) > 0 && (
            <div className="absolute top-2 right-2 bg-rose-500 text-white px-2 py-1 rounded text-sm font-bold">
              -{product.discountPercentage}%
            </div>
          )}
        </div>

        <div className="p-4">
          <h3
            className="font-semibold text-gray-800 mb-2 text-sm leading-tight min-h-[2.5rem] flex items-start"
            title={getProductDisplayTitle(product)}
          >
            {getProductDisplayTitle(product)}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-cyan-600">
              ${discountedPrice.toFixed(2)}
            </span>
            {(product.discountPercentage ?? 0) > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

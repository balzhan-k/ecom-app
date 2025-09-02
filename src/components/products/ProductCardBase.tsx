"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import {
  calculateDiscountedPrice,
  formatPrice,
  getProductDisplayTitle,
} from "@/utils/formatters";

interface ProductCardBaseProps {
  product: Product;
  imageHeightClass?: string; // e.g., "h-64" or "h-48"
  showDiscountBadge?: boolean;
  showStock?: boolean;
  actions?: React.ReactNode; // custom actions area (e.g., Edit/Delete)
}

export default function ProductCardBase({
  product,
  imageHeightClass = "h-64",
  showDiscountBadge = true,
  showStock = false,
  actions,
}: ProductCardBaseProps) {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage
  );

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.jpg";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className={`relative w-full ${imageHeightClass}`}>
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover rounded-t-lg"
        />
        {showDiscountBadge && (product.discountPercentage ?? 0) > 0 && (
          <div className="absolute top-2 right-2 bg-rose-500 text-white px-2 py-1 rounded text-sm font-bold">
            -{product.discountPercentage}%
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-gray-800 mb-2 text-sm leading-tight min-h-[3.3rem] lg:min-h-[2.5rem] line-clamp-3 lg:line-clamp-2"
          title={getProductDisplayTitle(product)}
        >
          {getProductDisplayTitle(product)}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-cyan-600">
            {formatPrice(discountedPrice)}
          </span>
          {(product.discountPercentage ?? 0) > 0 && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {showStock && (
          <div className="text-xs text-gray-500 mt-1">
            Stock: {product.stock}
          </div>
        )}

        {actions && <div className="mt-4 flex gap-2">{actions}</div>}
      </div>
    </div>
  );
}

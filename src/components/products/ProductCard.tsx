"use client";

import Link from "next/link";
import { Product } from "@/types/product";
import ProductCardBase from "./ProductCardBase";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/categories/products/${product.id}`}>
      <div className="cursor-pointer">
        <ProductCardBase
          product={product}
          imageHeightClass="h-64"
          showDiscountBadge
        />
      </div>
    </Link>
  );
}

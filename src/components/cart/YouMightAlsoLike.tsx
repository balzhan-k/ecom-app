"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { getRandomProducts } from "@/utils/products";
import ProductCard from "@/components/products/ProductCard";

export default function YouMightAlsoLike() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const randomProducts = await getRandomProducts(4);
        setProducts(randomProducts);
      } catch (error) {
        console.error("Error fetching random products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h2 className="text-ыь font-bold text-cyan-700 mb-6">
          You might also like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse rounded-lg h-96"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto p-8 mt-8">
      <h2 className="text-2xl font-bold text-cyan-700 mb-6">
        You might also like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { Product } from "@/types/product";
import { getDiscountedProducts } from "@/utils/products";
import ProductCard from "@/components/products/ProductCard";

export default function DiscountedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const discountedProducts = await getDiscountedProducts(10);
        setProducts(discountedProducts);
      } catch (error) {
        console.error("Error fetching discounted products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pb-20">
        <div className="bg-gray-200 animate-pulse rounded-lg h-6 w-48 mb-6"></div>
        <div className="flex gap-6 overflow-hidden">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse rounded-lg h-96 w-72 flex-shrink-0"
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
    <div className="container mx-auto mb-15">
      <h2 className="text-xl font-bold text-cyan-700 mb-6">
      Featured Products
      </h2>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all z-10 border border-cyan-50"
        >
          <svg
            className="w-6 h-6 text-cyan-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all z-10 border border-cyan-50"
        >
          <svg
            className="w-6 h-6 text-cyan-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-48 lg:w-72">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

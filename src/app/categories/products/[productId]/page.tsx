"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductById } from "@/utils/products";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import QuantityControl from "@/components/common/QuantityControl";

export default function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();
  const [localQuantity, setLocalQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { productId } = await params;
        const productData = await getProductById(productId);
        if (!productData) {
          notFound();
        }
        setProduct(productData);
      } catch (error) {
        console.error("Error loading product:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params]);

  if (loading) {
    return null; // Next.js автоматически покажет loading.tsx
  }

  if (!product) {
    notFound();
  }

  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  const cartItem = cart.find((item) => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.title,
        price: discountedPrice,
        thumbnail: product.images?.[0] || "/placeholder.jpg",
        stock: product.stock,
      },
      localQuantity
    );
  };

  const handleIncrease = () => {
    if (localQuantity < product.stock) {
      setLocalQuantity(localQuantity + 1);
    }
  };

  const handleDecrease = () => {
    if (localQuantity > 1) {
      setLocalQuantity(localQuantity - 1);
    }
  };

  return (
    <div className="py-8 pb-20">
      <h1 className="text-2xl font-bold text-cyan-700 mb-4">{product.brand}{'. '}{product.title}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative h-100">
          <Image
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg"
          />
        </div>

        <div>
         
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl font-bold text-cyan-600">
              ${discountedPrice.toFixed(2)}
            </span>
            {(product.discountPercentage ?? 0) > 0 && (
              <span className="text-lg text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <QuantityControl
              quantity={localQuantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              maxQuantity={product.stock}
              minQuantity={1}
              size="md"
            />

            <button
              onClick={handleAddToCart}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
            >
              Add to Cart
            </button>
          </div>

          {currentQuantity > 0 && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>In Cart:</strong> {currentQuantity} item
                {currentQuantity > 1 ? "s" : ""}
              </p>
            </div>
          )}

          <div className="space-y-1 text-sm text-gray-600">
            {[
              { label: "Brand", value: product.brand },
              { label: "Stock", value: `${product.stock} pcs` },
              {
                label: "Material",
                value: product.material,
                condition: !!product.material,
              },
              {
                label: "Color",
                value: product.color,
                condition: !!product.color,
              },
              {
                label: "Pack Quantity",
                value: product.packQuantity,
                condition: !!product.packQuantity,
              },
              {
                label: "Pages",
                value: product.pageCount,
                condition: !!product.pageCount,
              },
              { label: "Weight", value: `${product.weight} kg` },
              {
                label: "Dimensions",
                value: `${product.dimensions?.width} × ${product.dimensions?.height} × ${product.dimensions?.depth} cm`,
              },
              { label: "Warranty", value: product.warrantyInformation },
              { label: "Shipping", value: product.shippingInformation },
              { label: "Return Policy", value: product.returnPolicy },
              { label: "Availability", value: product.availabilityStatus },
              {
                label: "Minimum Order",
                value: `${product.minimumOrderQuantity} pcs`,
              },
            ]
              .filter((detail) => detail.condition !== false)
              .map((detail, index) => (
                <p key={index}>
                  <strong>{detail.label}:</strong> {detail.value}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

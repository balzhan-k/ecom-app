"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";

export function CartIcon() {
  const currentPath = usePathname();
  const { getTotalItems } = useCart();

  // Получаем общее количество товаров в корзине
  const totalItems = getTotalItems();

  return (
    <Link
      href="/cart"
      className={`hidden md:flex items-center transition-colors relative ${
        currentPath === "/cart"
          ? "text-cyan-600"
          : "text-cyan-800 hover:text-cyan-600"
      }`}
    >
      <ShoppingCartIcon className="w-6 h-6" />

      {/* Счетчик товаров */}
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-cyan-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}

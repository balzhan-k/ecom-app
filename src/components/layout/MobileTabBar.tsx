"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  HomeIcon,
  ShoppingCartIcon,
  UserIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export default function MobileTabBar() {
  const pathname = usePathname();
  const { user, userData } = useAuth();
  const { getTotalItems } = useCart();

  // Получаем общее количество товаров в корзине
  const totalItems = getTotalItems();

  const tabs = [
    { href: "/", icon: HomeIcon, label: "Home" },
    ...(userData?.role === "admin"
      ? [{ href: "/admin", icon: ShieldCheckIcon, label: "Admin" }]
      : []),
    ...(user
      ? [{ href: "/orders", icon: ClipboardDocumentListIcon, label: "Orders" }]
      : [{ href: "/login", icon: UserIcon, label: "Login" }]),
    { href: "/cart", icon: ShoppingCartIcon, label: "Cart" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 flex justify-around items-center h-16 md:hidden z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const isCart = tab.href === "/cart";

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center relative"
          >
            <div className="relative">
              <tab.icon
                className={`h-6 w-6 ${
                  isActive
                    ? "text-cyan-600"
                    : "text-cyan-800 hover:text-cyan-600"
                }`}
              />

              {/* Счетчик товаров для корзины */}
              {isCart && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-cyan-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </div>

            <span
              className={`text-xs ${
                isActive ? "text-cyan-600" : "text-cyan-800 hover:text-cyan-600"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

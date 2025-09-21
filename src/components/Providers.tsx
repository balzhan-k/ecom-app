"use client";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main className="flex-1">
          <div className="md:max-w-7xl mx-auto px-4">{children}</div>
        </main>
        <Footer />
        <MobileTabBar />
      </CartProvider>
    </AuthProvider>
  );
}

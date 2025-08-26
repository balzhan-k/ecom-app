import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { CartProvider } from "@/context/CartContext";
import MobileTabBar from "@/components/layout/MobileTabBar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "MiniCom",
  description: "Mini E-commerce Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <html lang="en">
        <body className="min-h-screen flex flex-col antialiased">
          <AuthProvider>
          <Header />
          <main className="flex-1">
            <div className="md:max-w-7xl mx-auto px-4">
              {children}
            </div>
          </main>
          <Footer />
          <MobileTabBar />
          </AuthProvider>
        </body>
      </html>
    </CartProvider>
  );
}

import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MobileTabBar from "@/components/layout/MobileTabBar";
import { CartProvider } from "@/context/CartContext";
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
    <html lang="en">
      <body
        className={`${notoSans.className} min-h-screen flex flex-col antialiased`}
      >
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
      </body>
    </html>
  );
}

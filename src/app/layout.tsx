import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
import Providers from "@/components/Providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

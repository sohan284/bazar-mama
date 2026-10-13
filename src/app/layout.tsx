import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { shop } from "@/lib/store";
import "./globals.css";

const bangla = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${shop.name} | ${shop.tagline}`,
  description: "চাল, ডাল, তেল, মশলা থেকে খাঁটি মধু-ঘি — অর্ডার করুন, ক্যাশ অন ডেলিভারি।",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body className={`${bangla.variable} font-sans antialiased`}>
        <CartProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-28 pt-4">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { OrderSummary } from "@/components/OrderSummary";
import { ProductImage } from "@/components/ProductImage";
import { QtyControl } from "@/components/QtyControl";
import { useCart } from "@/lib/cart";
import { taka } from "@/lib/store";

export default function CartPage() {
  const { lines, subtotal, delivery, total } = useCart();

  if (lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-5xl">🛍️</p>
        <h1 className="mt-4 text-2xl font-bold">আপনার ব্যাগ খালি</h1>
        <p className="mt-2 text-black/50">পণ্য বেছে নিন, অথবা চেকআউটে বাজারের লিস্ট লিখে দিন।</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600">
            পণ্য দেখুন
          </Link>
          <Link
            href="/checkout"
            className="rounded-xl border border-brand-500 px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50"
          >
            📝 লিস্ট দিয়ে অর্ডার
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section>
        <h1 className="mb-4 text-2xl font-bold">আপনার ব্যাগ</h1>
        <ul className="space-y-3">
          {lines.map(({ product, qty }) => (
            <li key={product.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
              <ProductImage
                src={product.image}
                alt={product.name}
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-xl bg-brand-50 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{product.name}</p>
                <p className="text-sm text-black/50">
                  {product.unit} · {taka(product.price)}
                </p>
                <p className="font-bold text-brand-700 sm:hidden">{taka(product.price * qty)}</p>
              </div>
              <div className="w-32 shrink-0">
                <QtyControl productId={product.id} full />
              </div>
              <p className="hidden w-24 text-right font-bold text-brand-700 sm:block">{taka(product.price * qty)}</p>
            </li>
          ))}
        </ul>
      </section>

      <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm lg:sticky lg:top-20">
        <h2 className="mb-4 text-lg font-bold">অর্ডার সারাংশ</h2>
        <OrderSummary subtotal={subtotal} delivery={delivery} total={total} />
        <Link
          href="/checkout"
          className="mt-5 block rounded-xl bg-brand-500 py-3 text-center font-semibold text-white hover:bg-brand-600"
        >
          অর্ডার করতে এগিয়ে যান →
        </Link>
        <Link href="/" className="mt-3 block text-center text-sm text-brand-700 hover:underline">
          আরও পণ্য যোগ করুন
        </Link>
      </aside>
    </div>
  );
}

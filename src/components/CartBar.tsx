"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { taka, toBn } from "@/lib/store";

export function CartBar() {
  const { count, subtotal } = useCart();
  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 p-4">
      <Link
        href="/cart"
        className="mx-auto flex max-w-xl items-center justify-between rounded-2xl bg-brand-600 px-5 py-4 text-white shadow-lg hover:bg-brand-700"
      >
        <span>{toBn(count)}টি পণ্য · {taka(subtotal)}</span>
        <span className="font-semibold">ব্যাগ দেখুন →</span>
      </Link>
    </div>
  );
}

"use client";

import { useCart } from "@/lib/cart";
import { toBn } from "@/lib/store";

export function QtyControl({ productId, full = false }: { productId: string; full?: boolean }) {
  const { qtyOf, setQty } = useCart();
  const qty = qtyOf(productId);

  if (qty === 0) {
    return (
      <button
        onClick={() => setQty(productId, 1)}
        className={`${full ? "w-full" : ""} rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600`}
      >
        + ব্যাগে নিন
      </button>
    );
  }

  return (
    <div
      className={`${full ? "w-full" : ""} flex items-center justify-between rounded-lg border border-brand-500 bg-brand-50`}
    >
      <button
        onClick={() => setQty(productId, qty - 1)}
        className="px-4 py-2 text-lg font-bold text-brand-700"
        aria-label="কমান"
      >
        −
      </button>
      <span className="font-semibold text-brand-700">{toBn(qty)}</span>
      <button
        onClick={() => setQty(productId, qty + 1)}
        className="px-4 py-2 text-lg font-bold text-brand-700"
        aria-label="বাড়ান"
      >
        +
      </button>
    </div>
  );
}

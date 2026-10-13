"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { OrderDetails, OrderTracker } from "@/components/OrderParts";
import { useOrders } from "@/lib/orders";
import { shop } from "@/lib/store";

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccess />
    </Suspense>
  );
}

function OrderSuccess() {
  const id = useSearchParams().get("id");
  const orders = useOrders();

  if (!orders) return null;

  const order = orders.find((o) => o.id === id);
  if (!order) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">কোনো অর্ডার পাওয়া যায়নি</h1>
        <Link href="/orders" className="mt-4 inline-block text-brand-700 hover:underline">
          আমার অর্ডার দেখুন
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl bg-white p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-100 text-4xl">✅</div>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">ধন্যবাদ, {order.customer.name}!</h1>
        <p className="mt-2 text-black/60">আপনার অর্ডারটি গ্রহণ করা হয়েছে। কিছুক্ষণের মধ্যে মামা ফোন করে কনফার্ম করবে।</p>
        <p className="mt-4 inline-block rounded-xl bg-brand-50 px-4 py-2 font-semibold text-brand-700">
          অর্ডার নম্বর: {order.id}
        </p>
      </div>

      <div className="mt-4 rounded-3xl bg-white p-6 shadow-sm">
        <OrderTracker status={order.status} />
      </div>

      <div className="mt-4 rounded-3xl bg-white p-6 shadow-sm">
        <OrderDetails order={order} />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/orders" className="rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600">
          📦 আমার অর্ডার
        </Link>
        <Link href="/" className="rounded-xl border border-brand-500 px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50">
          আরও বাজার করুন
        </Link>
        <a
          href={`tel:${shop.phone.replace(/-/g, "")}`}
          className="rounded-xl border border-black/10 px-6 py-3 font-semibold hover:bg-black/5"
        >
          📞 কল করুন
        </a>
      </div>
    </div>
  );
}

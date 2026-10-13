"use client";

import Link from "next/link";
import { useState } from "react";
import { formatTime, OrderAmount, OrderDetails, OrderTracker, StatusBadge } from "@/components/OrderParts";
import { useOrders } from "@/lib/orders";

export default function MyOrdersPage() {
  const orders = useOrders();
  const [openId, setOpenId] = useState<string | null>(null);

  if (!orders) return null;

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-5xl">📦</p>
        <h1 className="mt-4 text-2xl font-bold">এখনো কোনো অর্ডার নেই</h1>
        <p className="mt-2 text-black/50">অর্ডার করলে এখানে তার স্ট্যাটাস দেখতে পাবেন।</p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600">
          বাজার শুরু করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">আমার অর্ডার</h1>
      <p className="text-sm text-black/50">দোকান স্ট্যাটাস বদলালে এখানে সাথে সাথে দেখাবে।</p>

      <ul className="mt-4 space-y-3">
        {orders.map((order) => {
          const open = openId === order.id;
          return (
            <li key={order.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-semibold">{order.id}</span>
                  <StatusBadge status={order.status} />
                  <span className="text-sm text-black/50">{formatTime(order.createdAt)}</span>
                  <span className="ml-auto">
                    <OrderAmount order={order} />
                  </span>
                </div>
                <OrderTracker status={order.status} />
                <button
                  onClick={() => setOpenId(open ? null : order.id)}
                  className="text-sm font-medium text-brand-700 hover:underline"
                >
                  {open ? "বিস্তারিত লুকান ▲" : "বিস্তারিত দেখুন ▼"}
                </button>
              </div>
              {open && (
                <div className="border-t border-black/5 p-4">
                  <OrderDetails order={order} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

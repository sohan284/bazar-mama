"use client";

import { useState } from "react";
import { formatTime, OrderAmount, OrderDetails, StatusBadge } from "@/components/OrderParts";
import { clearOrders, orderStatuses, updateOrderStatus, useOrders, type Order, type OrderStatus } from "@/lib/orders";
import { taka, toBn } from "@/lib/store";

type Filter = OrderStatus | "all";

export default function AdminPage() {
  const orders = useOrders();
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  if (!orders) return null;

  const today = new Date().toDateString();
  const todays = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const stats = [
    { label: "আজকের অর্ডার", value: toBn(todays.length) },
    { label: "নতুন (কনফার্ম বাকি)", value: toBn(orders.filter((o) => o.status === "new").length) },
    { label: "ডেলিভারিতে", value: toBn(orders.filter((o) => o.status === "delivering").length) },
    { label: "আজকের বিক্রি", value: taka(todays.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0)) },
  ];
  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  function resetDemo() {
    if (confirm("সব অর্ডার মুছে ফেলবেন? এটা আর ফেরত আনা যাবে না।")) clearOrders();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">অর্ডারসমূহ</h1>
          <p className="text-sm text-black/50">নতুন অর্ডার এলে নিজে থেকে এখানে চলে আসবে</p>
        </div>
        {orders.length > 0 && (
          <button onClick={resetDemo} className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm text-red-700 hover:bg-red-50">
            🗑️ সব অর্ডার মুছুন
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-black/50">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-brand-700">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {(["all", ...Object.keys(orderStatuses)] as Filter[]).map((key) => {
          const count = key === "all" ? orders.length : orders.filter((o) => o.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                filter === key ? "bg-brand-500 text-white" : "bg-white text-black/70 shadow-sm hover:bg-brand-50"
              }`}
            >
              {key === "all" ? "সব" : orderStatuses[key].label} ({toBn(count)})
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-10 text-center text-black/50 shadow-sm">
          {orders.length === 0 ? "এখনো কোনো অর্ডার আসেনি। সাইট থেকে একটা অর্ডার করে দেখুন।" : "এই স্ট্যাটাসে কোনো অর্ডার নেই।"}
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {visible.map((order) => (
            <AdminOrderCard
              key={order.id}
              order={order}
              open={openId === order.id}
              onToggle={() => setOpenId(openId === order.id ? null : order.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function AdminOrderCard({ order, open, onToggle }: { order: Order; open: boolean; onToggle: () => void }) {
  return (
    <li className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <button onClick={onToggle} className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 p-4 text-left hover:bg-black/[0.02]">
        <span className="font-semibold">{order.id}</span>
        <StatusBadge status={order.status} />
        <span className="text-sm text-black/50">{formatTime(order.createdAt)}</span>
        <span className="basis-full text-sm sm:basis-auto">
          {order.customer.name} · {order.customer.area}
        </span>
        <span className="ml-auto">
          <OrderAmount order={order} />
        </span>
        <span className="text-black/40">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-black/5 p-4">
          <OrderDetails order={order} />
          <div className="text-sm">
            <p className="mb-2 text-black/50">স্ট্যাটাস বদলান</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(orderStatuses) as OrderStatus[]).map((key) => (
                <button
                  key={key}
                  disabled={key === order.status}
                  onClick={() => updateOrderStatus(order.id, key)}
                  className={`rounded-lg px-3 py-1.5 font-medium ${
                    key === order.status ? orderStatuses[key].className : "border border-black/10 hover:bg-black/5"
                  }`}
                >
                  {orderStatuses[key].label}
                </button>
              ))}
            </div>
            {order.updatedAt && <p className="mt-2 text-xs text-black/40">শেষ আপডেট: {formatTime(order.updatedAt)}</p>}
          </div>
        </div>
      )}
    </li>
  );
}

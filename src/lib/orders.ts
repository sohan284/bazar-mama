"use client";

import { createLocalStore, useHydrated } from "@/lib/local-store";

export const orderStatuses = {
  new: { label: "নতুন", className: "bg-orange-100 text-orange-700" },
  confirmed: { label: "কনফার্মড", className: "bg-blue-100 text-blue-700" },
  delivering: { label: "ডেলিভারিতে", className: "bg-purple-100 text-purple-700" },
  delivered: { label: "ডেলিভারি হয়েছে", className: "bg-brand-100 text-brand-700" },
  cancelled: { label: "বাতিল", className: "bg-red-100 text-red-700" },
} as const;

export type OrderStatus = keyof typeof orderStatuses;

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  updatedAt?: string;
  customer: {
    name: string;
    phone: string;
    area: string;
    address: string;
  };
  slot: string;
  note: string;
  bazarList: string;
  items: { id: string; name: string; unit: string; price: number; qty: number }[];
  subtotal: number;
  delivery: number;
  total: number;
};

// Demo storage: orders live in this browser's localStorage, so the customer
// pages and the admin page only share orders when opened in the same browser.
const store = createLocalStore<Order[]>("bazar-demo-orders", []);

/** All saved orders, newest first; `null` until the browser storage has been read. */
export function useOrders(): Order[] | null {
  const orders = store.use();
  return useHydrated() ? orders : null;
}

export function saveOrder(order: Order) {
  return store.set([order, ...store.get().filter((o) => o.id !== order.id)]);
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const updatedAt = new Date().toISOString();
  store.set(store.get().map((o) => (o.id === id ? { ...o, status, updatedAt } : o)));
}

export function clearOrders() {
  store.reset();
}

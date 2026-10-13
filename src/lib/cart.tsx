"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useProductMap } from "@/lib/catalog";
import { deliveryChargeFor, type Product } from "@/lib/store";

export type CartLine = { product: Product; qty: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  qtyOf: (id: string) => number;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bazar-demo-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);
  const productById = useProductMap();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const value = useMemo<CartContextValue>(() => {
    const lines = Object.entries(items)
      // Products deleted from the catalog in the admin panel drop out of the cart.
      .map(([id, qty]) => ({ product: productById.get(id)!, qty }))
      .filter((line) => line.product && line.qty > 0);
    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
    const delivery = deliveryChargeFor(subtotal);

    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      subtotal,
      delivery,
      total: subtotal + delivery,
      qtyOf: (id) => items[id] ?? 0,
      setQty: (id, qty) =>
        setItems((prev) => {
          const next = { ...prev };
          if (qty <= 0) delete next[id];
          else next[id] = qty;
          return next;
        }),
      clear: () => setItems({}),
    };
  }, [items, productById]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

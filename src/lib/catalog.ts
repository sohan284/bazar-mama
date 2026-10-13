"use client";

import { useMemo } from "react";
import { createLocalStore } from "@/lib/local-store";
import { defaultProducts, type Product } from "@/lib/store";

// Demo storage: the catalog starts as the products in store.json. The first admin
// change saves the whole list to localStorage, and from then on this browser uses it.
const store = createLocalStore<Product[]>("bazar-demo-products", defaultProducts);

export const useProducts = store.use;

export function useProductMap() {
  const products = useProducts();
  return useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
}

export function newProductId() {
  return `p-${Date.now().toString(36)}`;
}

/** Adds the product (newest first) or replaces the one with the same id. */
export function saveProduct(product: Product): boolean {
  const products = store.get();
  const exists = products.some((p) => p.id === product.id);
  return store.set(exists ? products.map((p) => (p.id === product.id ? product : p)) : [product, ...products]);
}

export function deleteProduct(id: string) {
  store.set(store.get().filter((p) => p.id !== id));
}

/** Drops all admin changes and goes back to the products in store.json. */
export function resetCatalog() {
  store.reset();
}

"use client";

import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/catalog";

export function FeaturedProducts() {
  const featured = useProducts().filter((p) => p.featured);
  if (featured.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold">🍯 আমাদের খাঁটি পণ্য</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { ProductForm } from "@/components/ProductForm";
import { ProductImage } from "@/components/ProductImage";
import { deleteProduct, resetCatalog, useProducts } from "@/lib/catalog";
import { useHydrated } from "@/lib/local-store";
import { categories, categoryName, isNewProduct, taka, toBn, type Product } from "@/lib/store";

export default function AdminProductsPage() {
  const hydrated = useHydrated();
  const products = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [flash, setFlash] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => (category === "all" || p.category === category) && (!q || p.name.toLowerCase().includes(q)),
    );
  }, [products, query, category]);

  const closeForm = useCallback(() => setEditing(null), []);

  function handleSaved(product: Product, isNew: boolean) {
    setEditing(null);
    setFlash(
      isNew
        ? `"${product.name}" যোগ হয়েছে — হোম পেজে সবার আগে দেখাচ্ছে।`
        : `"${product.name}" আপডেট হয়েছে।`,
    );
  }

  function handleDelete(product: Product) {
    if (!confirm(`"${product.name}" মুছে ফেলবেন?`)) return;
    deleteProduct(product.id);
    setFlash(`"${product.name}" মুছে ফেলা হয়েছে।`);
  }

  function handleReset() {
    if (!confirm("আপনার যোগ/এডিট করা সব পরিবর্তন মুছে আগের প্রোডাক্ট লিস্টে ফিরে যাবে। চালিয়ে যাবেন?")) return;
    resetCatalog();
    setFlash("প্রোডাক্ট লিস্ট আগের অবস্থায় ফিরিয়ে আনা হয়েছে।");
  }

  if (!hydrated) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">প্রোডাক্টসমূহ</h1>
          <p className="text-sm text-black/50">মোট {toBn(products.length)}টি প্রোডাক্ট</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm hover:bg-black/5">
            ↺ আগের লিস্টে ফিরুন
          </button>
          <button
            onClick={() => setEditing("new")}
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            + নতুন প্রোডাক্ট
          </button>
        </div>
      </div>

      {flash && (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
          <span>✅ {flash}</span>
          <Link href="/" target="_blank" className="font-semibold underline">
            হোম পেজ দেখুন ↗
          </Link>
          <button onClick={() => setFlash("")} className="ml-auto text-brand-700/60 hover:text-brand-700" aria-label="বন্ধ করুন">
            ×
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="প্রোডাক্ট খুঁজুন…"
          className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-brand-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-black/10 bg-white px-3 py-2.5 outline-none focus:border-brand-500"
        >
          <option value="all">সব ক্যাটাগরি</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-10 text-center text-black/50 shadow-sm">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
      ) : (
        <ul className="mt-4 divide-y divide-black/5 overflow-hidden rounded-2xl bg-white shadow-sm">
          {visible.map((p) => (
            <li key={p.id} className="flex items-center gap-3 p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-50">
                <ProductImage src={p.image} alt={p.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-1.5 font-semibold">
                  <span className="truncate">{p.name}</span>
                  {isNewProduct(p) && <span className="rounded bg-brand-600 px-1.5 text-xs text-white">নতুন</span>}
                  {p.featured && <span title="হোম পেজে ফিচার্ড">⭐</span>}
                </p>
                <p className="text-sm text-black/50">
                  {p.unit} · {categoryName.get(p.category) ?? p.category}
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="font-bold text-brand-700">{taka(p.price)}</p>
                {p.mrp > p.price && <p className="text-xs text-black/40 line-through">{taka(p.mrp)}</p>}
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => setEditing(p)} className="rounded-lg px-3 py-1.5 text-sm text-brand-700 hover:bg-brand-50">
                  এডিট
                </button>
                <button onClick={() => handleDelete(p)} className="rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                  মুছুন
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <ProductForm
          key={editing === "new" ? "new" : editing.id}
          product={editing === "new" ? undefined : editing}
          onClose={closeForm}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

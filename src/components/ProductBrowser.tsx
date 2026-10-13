"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/catalog";
import { categories, toBn } from "@/lib/store";

const PAGE_SIZE = 15;
// Products are local JSON, so the next page is ready instantly. The short delay keeps
// the loader visible in the demo; with a real API the request time replaces it.
const LOAD_DELAY_MS = 700;

export function ProductBrowser() {
  const products = useProducts();
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (active === "all" || p.category === active) &&
        (!q || p.name.toLowerCase().includes(q)),
    );
  }, [products, active, query]);

  const hasMore = shown < visible.length;

  // Load the next page when the sentinel below the grid comes near the viewport.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLoading(true);
        loadTimer.current = setTimeout(() => {
          setShown((n) => n + PAGE_SIZE);
          setLoading(false);
        }, LOAD_DELAY_MS);
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => () => clearTimeout(loadTimer.current), []);

  function resetPaging() {
    clearTimeout(loadTimer.current);
    setLoading(false);
    setShown(PAGE_SIZE);
  }

  // When the filter bar is stuck and the user is deep in the list, jump back to the
  // start of the products so the new results are in view.
  function scrollToProducts() {
    const section = sectionRef.current;
    if (section && section.getBoundingClientRect().top < 64) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  const chip = (id: string, label: string) => (
    <button
      key={id}
      onClick={() => {
        setActive(id);
        resetPaging();
        scrollToProducts();
      }}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
        active === id
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-black/10 bg-white text-black/70 hover:border-brand-500"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section id="products" ref={sectionRef} className="mt-8 scroll-mt-16">
      {/* top-16 = header height, so the bar sits right under the sticky header */}
      <div className="sticky top-16 z-10 -mx-4 border-b border-black/5 bg-[#f6f7f5]/95 px-4 pb-2 pt-3 backdrop-blur">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            resetPaging();
            scrollToProducts();
          }}
          placeholder="পণ্য খুঁজুন… যেমন: চাল, তেল, মধু"
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-brand-500"
        />

        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
          {chip("all", "সব পণ্য")}
          {categories.map((c) => chip(c.id, `${c.icon} ${c.name}`))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-black/50">কোনো পণ্য পাওয়া যায়নি।</p>
      ) : (
        <>
          <p className="mt-3 text-sm text-black/50">{toBn(visible.length)}টি পণ্য</p>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {visible.slice(0, shown).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div ref={sentinelRef} className="py-6 text-center text-sm text-black/50">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                আরও পণ্য লোড হচ্ছে…
              </span>
            ) : (
              !hasMore && visible.length > PAGE_SIZE && "✓ সব পণ্য দেখানো হয়েছে"
            )}
          </div>
        </>
      )}
    </section>
  );
}

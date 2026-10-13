"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { useCart } from "@/lib/cart";
import { shop, toBn } from "@/lib/store";

export function Header() {
  const { count } = useCart();
  const isAdmin = usePathname().startsWith("/admin");

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark className="h-10 w-10" />
          <span className="leading-tight">
            <span className="block text-xl font-bold text-brand-700">{shop.name}</span>
            <span className="block text-xs text-black/50">দিনাজপুর</span>
          </span>
        </Link>

        {isAdmin ? (
          <span className="rounded-full bg-black/5 px-4 py-2 text-sm font-medium">অ্যাডমিন প্যানেল</span>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/orders" className="rounded-full px-3 py-2 font-medium text-black/70 hover:bg-black/5">
              📦 <span className="hidden sm:inline">আমার অর্ডার</span>
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 font-medium text-brand-700 hover:bg-brand-100"
            >
              <span>ব্যাগ</span>
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-brand-500 px-1.5 text-sm text-white">
                {toBn(count)}
              </span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

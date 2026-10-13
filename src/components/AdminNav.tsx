"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "📦 অর্ডার" },
  { href: "/admin/products", label: "🛍️ প্রোডাক্ট" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-5 flex gap-2 border-b border-black/10">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`-mb-px border-b-2 px-4 py-2.5 font-medium ${
              active ? "border-brand-500 text-brand-700" : "border-transparent text-black/50 hover:text-black/80"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

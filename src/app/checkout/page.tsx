"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrderSummary } from "@/components/OrderSummary";
import { useCart } from "@/lib/cart";
import { buildOrder, type CheckoutErrors } from "@/lib/checkout";
import { saveOrder } from "@/lib/orders";
import { areas, shop, taka, timeSlots, toBn } from "@/lib/store";

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-brand-500";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, delivery, total, clear } = useCart();
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const listOnly = lines.length === 0;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = buildOrder(new FormData(e.currentTarget), lines);
    if ("errors" in result) {
      setErrors(result.errors);
      return;
    }

    if (!saveOrder(result.order)) {
      setErrors({ form: "অর্ডার সেভ করা যায়নি। ব্রাউজারের স্টোরেজ ভরে গেছে কিনা দেখুন।" });
      return;
    }
    setSubmitting(true);
    clear();
    router.push(`/order-success?id=${encodeURIComponent(result.order.id)}`);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold">অর্ডার কনফার্ম করুন</h1>
          <p className="text-black/50">কোনো লগইন বা অগ্রিম পেমেন্ট লাগবে না। পণ্য হাতে পেয়ে টাকা দিন।</p>
        </div>

        <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold">📍 ডেলিভারির তথ্য</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="আপনার নাম *" error={errors.name}>
              <input name="name" className={inputClass} placeholder="যেমন: রহিম উদ্দিন" />
            </Field>
            <Field label="মোবাইল নম্বর *" error={errors.phone}>
              <input name="phone" inputMode="tel" className={inputClass} placeholder="01XXXXXXXXX" />
            </Field>
          </div>
          <Field label="এলাকা *" error={errors.area}>
            <select name="area" defaultValue="" className={inputClass}>
              <option value="" disabled>
                এলাকা বেছে নিন
              </option>
              {areas.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </Field>
          <Field label="পুরো ঠিকানা *" error={errors.address}>
            <textarea
              name="address"
              rows={2}
              className={inputClass}
              placeholder="বাসা নং, রোড, ফ্ল্যাট, কাছের পরিচিত জায়গা"
            />
          </Field>
        </div>

        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold">🕒 কখন ডেলিভারি চান?</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {timeSlots.map((slot, i) => (
              <label
                key={slot}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 px-4 py-3 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
              >
                <input type="radio" name="slot" value={slot} defaultChecked={i === 0} className="accent-brand-500" />
                <span>{slot}</span>
              </label>
            ))}
          </div>
          {errors.slot && <p className="text-sm text-red-600">{errors.slot}</p>}
        </div>

        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold">📝 বাজারের লিস্ট {listOnly ? "*" : "(ঐচ্ছিক)"}</h2>
          <p className="text-sm text-black/50">
            সাইটে নেই এমন কিছু লাগলে এখানে লিখে দিন — মামা বাজার করে নিয়ে আসবে। দাম ফোনে জানিয়ে দেওয়া হবে।
          </p>
          <textarea
            name="bazarList"
            rows={4}
            className={inputClass}
            placeholder={"যেমন:\nডিম ১ ডজন\nপেঁয়াজ ২ কেজি\nরসুন ৫০০ গ্রাম"}
          />
          {errors.bazarList && <p className="text-sm text-red-600">{errors.bazarList}</p>}
          <Field label="বিশেষ নির্দেশনা (ঐচ্ছিক)">
            <input name="note" className={inputClass} placeholder="যেমন: আসার আগে কল দিবেন" />
          </Field>
        </div>
      </section>

      <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm lg:sticky lg:top-20">
        <h2 className="mb-3 text-lg font-bold">আপনার অর্ডার</h2>
        {listOnly ? (
          <p className="mb-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
            ব্যাগে কোনো পণ্য নেই — শুধু বাজারের লিস্ট দিয়ে অর্ডার হবে। ডেলিভারি চার্জ {taka(shop.deliveryCharge)}।
          </p>
        ) : (
          <>
            <ul className="mb-4 max-h-64 space-y-2 overflow-y-auto text-sm">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex justify-between gap-3">
                  <span className="text-black/70">
                    {product.name} × {toBn(qty)}
                  </span>
                  <span className="shrink-0">{taka(product.price * qty)}</span>
                </li>
              ))}
            </ul>
            <OrderSummary subtotal={subtotal} delivery={delivery} total={total} />
          </>
        )}

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-black/[0.03] px-3 py-2 text-sm">
          <span>💵</span>
          <span>পেমেন্ট: ক্যাশ অন ডেলিভারি</span>
        </div>

        {errors.form && <p className="mt-3 text-sm text-red-600">{errors.form}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-xl bg-brand-500 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {submitting ? "অর্ডার হচ্ছে…" : "✅ অর্ডার কনফার্ম করুন"}
        </button>
        <Link href="/cart" className="mt-3 block text-center text-sm text-brand-700 hover:underline">
          ← ব্যাগে ফিরে যান
        </Link>
      </aside>
    </form>
  );
}

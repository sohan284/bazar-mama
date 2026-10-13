import { shop, taka } from "@/lib/store";

type Props = { subtotal: number; delivery: number; total: number };

export function OrderSummary({ subtotal, delivery, total }: Props) {
  const remaining = shop.freeDeliveryMin - subtotal;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-black/60">পণ্যের দাম</span>
        <span>{taka(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-black/60">ডেলিভারি চার্জ</span>
        <span>{delivery === 0 ? "ফ্রি" : taka(delivery)}</span>
      </div>
      {remaining > 0 && subtotal > 0 && (
        <p className="rounded-lg bg-orange-50 px-3 py-2 text-orange-700">
          আর {taka(remaining)} এর পণ্য নিলে ডেলিভারি ফ্রি!
        </p>
      )}
      <div className="flex justify-between border-t border-black/10 pt-2 text-base font-bold">
        <span>সর্বমোট</span>
        <span className="text-brand-700">{taka(total)}</span>
      </div>
    </div>
  );
}

import { orderStatuses, type Order, type OrderStatus } from "@/lib/orders";
import { taka, toBn } from "@/lib/store";

export function formatTime(iso: string) {
  return new Date(iso).toLocaleString("bn-BD", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = orderStatuses[status];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}>{s.label}</span>;
}

const steps: { status: OrderStatus; icon: string }[] = [
  { status: "new", icon: "📝" },
  { status: "confirmed", icon: "✅" },
  { status: "delivering", icon: "🛵" },
  { status: "delivered", icon: "🏠" },
];

export function OrderTracker({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">এই অর্ডারটি বাতিল করা হয়েছে।</p>;
  }

  const current = steps.findIndex((s) => s.status === status);
  return (
    <ol className="grid grid-cols-4">
      {steps.map((step, i) => {
        const done = i <= current;
        return (
          <li key={step.status} className="relative flex flex-col items-center text-center">
            {i > 0 && (
              <span className={`absolute right-1/2 top-5 h-1 w-full -translate-y-1/2 ${i <= current ? "bg-brand-500" : "bg-black/10"}`} />
            )}
            <span
              className={`relative grid h-10 w-10 place-items-center rounded-full text-lg ${
                done ? "bg-brand-500" : "bg-black/5 grayscale"
              } ${i === current ? "ring-4 ring-brand-100" : ""}`}
            >
              {step.icon}
            </span>
            <span className={`mt-1.5 text-xs leading-4 ${done ? "font-semibold text-brand-700" : "text-black/40"}`}>
              {orderStatuses[step.status].label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-black/50">ডেলিভারি ঠিকানা</p>
          <p className="font-medium">{order.customer.name}</p>
          <a href={`tel:${order.customer.phone}`} className="font-medium text-brand-700 hover:underline">
            📞 {toBn(order.customer.phone)}
          </a>
          <p className="mt-1">
            {order.customer.address}, {order.customer.area}
          </p>
        </div>
        <div>
          <p className="text-black/50">ডেলিভারির সময়</p>
          <p className="font-medium">{order.slot}</p>
          <p className="mt-2 text-black/50">পেমেন্ট</p>
          <p className="font-medium">ক্যাশ অন ডেলিভারি</p>
        </div>
      </div>

      {order.items.length > 0 && (
        <table className="w-full">
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-black/5">
                <td className="py-1.5">
                  {item.name} <span className="text-black/50">({item.unit})</span>
                </td>
                <td className="py-1.5 text-center">× {toBn(item.qty)}</td>
                <td className="py-1.5 text-right">{taka(item.price * item.qty)}</td>
              </tr>
            ))}
            <tr>
              <td className="pt-2 text-black/50" colSpan={2}>
                ডেলিভারি চার্জ
              </td>
              <td className="pt-2 text-right">{order.delivery === 0 ? "ফ্রি" : taka(order.delivery)}</td>
            </tr>
            <tr className="font-bold">
              <td colSpan={2}>সর্বমোট</td>
              <td className="text-right text-brand-700">{taka(order.total)}</td>
            </tr>
          </tbody>
        </table>
      )}

      {order.bazarList && (
        <div>
          <p className="mb-1 text-black/50">📝 বাজারের লিস্ট (দাম ফোনে জানানো হবে)</p>
          <p className="whitespace-pre-line rounded-xl bg-orange-50 p-3">{order.bazarList}</p>
          {order.items.length === 0 && (
            <p className="mt-2 text-black/50">ডেলিভারি চার্জ: {taka(order.delivery)}</p>
          )}
        </div>
      )}

      {order.note && (
        <p>
          <span className="text-black/50">নির্দেশনা: </span>
          {order.note}
        </p>
      )}
    </div>
  );
}

/** Order total for list headers; list-only orders have no price until the shop calls. */
export function OrderAmount({ order }: { order: Order }) {
  return order.items.length > 0 ? (
    <span className="font-bold text-brand-700">{taka(order.total)}</span>
  ) : (
    <span className="text-sm font-semibold text-orange-700">📝 লিস্ট অর্ডার</span>
  );
}

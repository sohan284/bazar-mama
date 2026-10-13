import type { CartLine } from "@/lib/cart";
import type { Order } from "@/lib/orders";
import { areas, deliveryChargeFor, shop, timeSlots } from "@/lib/store";

export type CheckoutErrors = Partial<Record<"name" | "phone" | "area" | "address" | "slot" | "bazarList" | "form", string>>;

const BD_PHONE = /^01[3-9]\d{8}$/;

/**
 * Validates the checkout form and builds the order from the cart.
 * Runs in the browser because the catalog (and so the prices) lives in localStorage.
 */
export function buildOrder(form: FormData, lines: CartLine[]): { order: Order } | { errors: CheckoutErrors } {
  const field = (key: string) => String(form.get(key) ?? "").trim();
  const name = field("name");
  const phone = field("phone").replace(/[\s-]/g, "");
  const area = field("area");
  const address = field("address");
  const slot = field("slot");
  const note = field("note");
  const bazarList = field("bazarList");

  const items: Order["items"] = lines
    .filter((l) => l.qty > 0)
    .map(({ product, qty }) => ({ id: product.id, name: product.name, unit: product.unit, price: product.price, qty }));

  const errors: CheckoutErrors = {};
  if (!name) errors.name = "নাম লিখুন";
  if (!BD_PHONE.test(phone)) errors.phone = "সঠিক মোবাইল নম্বর দিন (যেমন 017XXXXXXXX)";
  if (!areas.includes(area)) errors.area = "এলাকা বেছে নিন";
  if (address.length < 5) errors.address = "পুরো ঠিকানা লিখুন";
  if (!timeSlots.includes(slot)) errors.slot = "ডেলিভারির সময় বেছে নিন";
  if (items.length === 0 && !bazarList) errors.bazarList = "ব্যাগে পণ্য নেই — বাজারের লিস্ট লিখে দিন";
  if (Object.keys(errors).length > 0) return { errors };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  // A list-only order has no known price yet, so it pays the normal delivery charge.
  const delivery = items.length === 0 ? shop.deliveryCharge : deliveryChargeFor(subtotal);

  return {
    order: {
      id: `BB-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "new",
      customer: { name, phone, area, address },
      slot,
      note,
      bazarList,
      items,
      subtotal,
      delivery,
      total: subtotal + delivery,
    },
  };
}

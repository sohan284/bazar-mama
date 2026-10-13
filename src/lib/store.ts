import data from "@/data/store.json";

export type Category = (typeof data.categories)[number];

export type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  mrp: number;
  category: string;
  /** https URL, or a data: URL for photos uploaded from the admin panel. */
  image: string;
  featured?: boolean;
  /** Set on products added from the admin panel; drives the "নতুন" badge. */
  addedAt?: string;
};

export const shop = data.shop;
export const areas = data.areas;
export const timeSlots = data.timeSlots;
export const categories = data.categories;
/** The starting catalog; the live (admin-editable) list comes from useProducts() in lib/catalog. */
export const defaultProducts: Product[] = data.products;

export const categoryName = new Map(categories.map((c) => [c.id, c.name]));

const NEW_BADGE_DAYS = 7;

export function isNewProduct(product: Product) {
  return !!product.addedAt && Date.now() - Date.parse(product.addedAt) < NEW_BADGE_DAYS * 86_400_000;
}

const bnDigits = "০১২৩৪৫৬৭৮৯";

export function toBn(value: number | string) {
  return String(value).replace(/\d/g, (d) => bnDigits[Number(d)]);
}

export function taka(amount: number) {
  return `৳${toBn(amount.toLocaleString("en-IN"))}`;
}

export function deliveryChargeFor(subtotal: number) {
  return subtotal === 0 || subtotal >= shop.freeDeliveryMin ? 0 : shop.deliveryCharge;
}

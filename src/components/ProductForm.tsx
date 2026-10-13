"use client";

import { useEffect, useState } from "react";
import { ProductImage } from "@/components/ProductImage";
import { newProductId, saveProduct } from "@/lib/catalog";
import { categories, type Product } from "@/lib/store";

type Props = {
  /** The product to edit; leave out to add a new one. */
  product?: Product;
  onClose: () => void;
  onSaved: (product: Product, isNew: boolean) => void;
};

type Errors = Partial<Record<"name" | "unit" | "price" | "mrp" | "category" | "image" | "form", string>>;

const inputClass = "w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 outline-none focus:border-brand-500";

/** Shrinks a photo to fit in `maxSize` px and returns it as a JPEG data URL, small enough for localStorage. */
async function compressImage(file: File, maxSize = 600, quality = 0.8): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", quality);
}

export function ProductForm({ product, onClose, onSaved }: Props) {
  const isNew = !product;
  const [name, setName] = useState(product?.name ?? "");
  const [unit, setUnit] = useState(product?.unit ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [mrp, setMrp] = useState(product && product.mrp !== product.price ? String(product.mrp) : "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [image, setImage] = useState(product?.image ?? "");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [errors, setErrors] = useState<Errors>({});
  const [uploading, setUploading] = useState(false);

  /** Updates a field and clears its error, so old messages don't linger while typing. */
  const edit = (key: keyof Errors, set: (value: string) => void) => (e: { target: { value: string } }) => {
    set(e.target.value);
    setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, image: "শুধু ছবির ফাইল দিন" }));
      return;
    }
    setUploading(true);
    try {
      setImage(await compressImage(file));
      setErrors((e) => ({ ...e, image: undefined }));
    } catch {
      setErrors((e) => ({ ...e, image: "ছবিটা পড়া যায়নি, অন্য ছবি দিন" }));
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = Number(price);
    const mrpNum = mrp.trim() ? Number(mrp) : priceNum;

    const next: Errors = {};
    if (!name.trim()) next.name = "প্রোডাক্টের নাম লিখুন";
    if (!unit.trim()) next.unit = "পরিমাণ লিখুন, যেমন ১ কেজি";
    if (!Number.isInteger(priceNum) || priceNum <= 0) next.price = "সঠিক দাম লিখুন (পূর্ণ সংখ্যা)";
    if (!Number.isInteger(mrpNum) || mrpNum < priceNum) next.mrp = "MRP বিক্রয় দামের সমান বা বেশি হতে হবে";
    if (!category) next.category = "ক্যাটাগরি বেছে নিন";
    if (!/^(https:\/\/|data:image\/)/.test(image.trim())) next.image = "ছবি আপলোড করুন অথবা https:// দিয়ে শুরু হওয়া লিংক দিন";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const saved: Product = {
      id: product?.id ?? newProductId(),
      name: name.trim(),
      unit: unit.trim(),
      price: priceNum,
      mrp: mrpNum,
      category,
      image: image.trim(),
      ...(featured && { featured: true }),
      ...(isNew ? { addedAt: new Date().toISOString() } : product.addedAt && { addedAt: product.addedAt }),
    };
    if (!saveProduct(saved)) {
      setErrors({ form: "সেভ করা যায়নি — ব্রাউজারের স্টোরেজ ভরে গেছে। ছোট ছবি দিন বা কিছু প্রোডাক্ট মুছুন।" });
      return;
    }
    onSaved(saved, isNew);
  }

  const error = (key: keyof Errors) => errors[key] && <p className="mt-1 text-sm text-red-600">{errors[key]}</p>;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center sm:p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        noValidate
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "নতুন প্রোডাক্ট যোগ করুন" : "প্রোডাক্ট এডিট করুন"}</h2>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-xl text-black/50 hover:bg-black/5" aria-label="বন্ধ করুন">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="mb-1 block text-sm font-medium">ছবি *</span>
            <div className="flex gap-3">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-50">
                {image && /^(https:\/\/|data:image\/)/.test(image) ? (
                  <ProductImage src={image} alt="" fill sizes="96px" className="object-cover" />
                ) : (
                  <span className="grid h-full place-items-center text-3xl">🖼️</span>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <label className="block cursor-pointer rounded-xl border border-dashed border-brand-500 bg-brand-50 px-3 py-2.5 text-center text-sm font-medium text-brand-700 hover:bg-brand-100">
                  {uploading ? "ছবি প্রস্তুত হচ্ছে…" : "📷 ফোন/কম্পিউটার থেকে ছবি দিন"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                </label>
                <input
                  value={image.startsWith("data:") ? "" : image}
                  onChange={edit("image", setImage)}
                  placeholder={image.startsWith("data:") ? "আপলোড করা ছবি ব্যবহার হচ্ছে" : "অথবা ছবির লিংক (https://...)"}
                  className={`${inputClass} text-sm`}
                />
              </div>
            </div>
            {error("image")}
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">প্রোডাক্টের নাম *</span>
            <input value={name} onChange={edit("name", setName)} className={inputClass} placeholder="যেমন: খাঁটি সরিষার তেল" />
            {error("name")}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">পরিমাণ *</span>
              <input value={unit} onChange={edit("unit", setUnit)} className={inputClass} placeholder="যেমন: ১ লিটার" />
              {error("unit")}
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">ক্যাটাগরি *</span>
              <select value={category} onChange={edit("category", setCategory)} className={inputClass}>
                <option value="" disabled>
                  বেছে নিন
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
              {error("category")}
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">বিক্রয় দাম (৳) *</span>
              <input value={price} onChange={edit("price", setPrice)} inputMode="numeric" className={inputClass} placeholder="৩২০" />
              {error("price")}
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">MRP (৳)</span>
              <input value={mrp} onChange={edit("mrp", setMrp)} inputMode="numeric" className={inputClass} placeholder="ছাড় না থাকলে খালি রাখুন" />
              {error("mrp")}
            </label>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 px-3 py-2.5">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-brand-500" />
            <span className="text-sm">⭐ হোম পেজের &quot;আমাদের খাঁটি পণ্য&quot; সেকশনে দেখান</span>
          </label>
        </div>

        {error("form")}

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-black/10 py-3 font-semibold hover:bg-black/5">
            বাতিল
          </button>
          <button disabled={uploading} className="flex-1 rounded-xl bg-brand-500 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
            {isNew ? "প্রোডাক্ট যোগ করুন" : "সেভ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}

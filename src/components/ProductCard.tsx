import { ProductImage } from "@/components/ProductImage";
import { QtyControl } from "@/components/QtyControl";
import { isNewProduct, taka, toBn, type Product } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="flex flex-col rounded-2xl border border-black/5 bg-white p-3 shadow-sm">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-50">
        <ProductImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 220px, (min-width: 640px) 25vw, 50vw"
          className="object-cover"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-orange-500 px-1.5 py-0.5 text-xs font-semibold text-white">
            {toBn(discount)}% ছাড়
          </span>
        )}
        {isNewProduct(product) && (
          <span className="absolute right-2 top-2 rounded-md bg-brand-600 px-1.5 py-0.5 text-xs font-semibold text-white">
            নতুন
          </span>
        )}
      </div>

      <h3 className="mt-3 line-clamp-2 min-h-12 font-semibold leading-6">{product.name}</h3>
      <p className="text-sm text-black/50">{product.unit}</p>

      <div className="mb-3 mt-1 flex items-baseline gap-2">
        <span className="text-lg font-bold text-brand-700">{taka(product.price)}</span>
        {product.mrp > product.price && (
          <span className="text-sm text-black/40 line-through">{taka(product.mrp)}</span>
        )}
      </div>

      <div className="mt-auto">
        <QtyControl productId={product.id} full />
      </div>
    </div>
  );
}

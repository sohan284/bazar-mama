import Image from "next/image";
import { CartBar } from "@/components/CartBar";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { ProductBrowser } from "@/components/ProductBrowser";
import { shop, taka } from "@/lib/store";

const perks = [
  { icon: "🚚", title: "ঘরে ডেলিভারি", text: `${taka(shop.freeDeliveryMin)}+ অর্ডারে ফ্রি` },
  { icon: "💵", title: "ক্যাশ অন ডেলিভারি", text: "পণ্য হাতে পেয়ে টাকা" },
  { icon: "🏷️", title: "পাইকারি দামে", text: "MRP থেকে কম দামে" },
  { icon: "📝", title: "লিস্ট দিয়ে অর্ডার", text: "বাজারের লিস্ট লিখে দিন" },
];

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden rounded-3xl bg-brand-700 px-6 py-10 text-white sm:px-10 sm:py-14">
        <Image src={shop.heroImage} alt="" fill priority sizes="(min-width: 1152px) 1120px, 100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-700 via-brand-700/85 to-brand-700/30" />
        <p className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-sm">দিনাজপুর শহরে হোম ডেলিভারি</p>
        <h1 className="max-w-xl text-3xl font-bold leading-tight sm:text-5xl">{shop.tagline}</h1>
        <p className="mt-3 max-w-lg text-white/80">
          চাল, ডাল, তেল, মশলা থেকে খাঁটি মধু-ঘি। আপনি শুধু বলুন কী লাগবে, মামা বাজার করে ঘরে পৌঁছে দেবে।
        </p>
        <a
          href="#products"
          className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50"
        >
          বাজার শুরু করুন
        </a>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {perks.map((perk) => (
          <div key={perk.title} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <span className="text-2xl">{perk.icon}</span>
            <div>
              <p className="font-semibold leading-5">{perk.title}</p>
              <p className="text-sm text-black/50">{perk.text}</p>
            </div>
          </div>
        ))}
      </section>

      <FeaturedProducts />

      <ProductBrowser />
      <CartBar />
    </>
  );
}

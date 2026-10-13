import Image, { type ImageProps } from "next/image";

// Only Unsplash is allowed in next.config remotePatterns. Photos uploaded in the admin
// panel (data: URLs) and links to other sites are shown as-is, without optimisation.
const OPTIMIZED_HOST = "https://images.unsplash.com/";

export function ProductImage({ src, alt, ...props }: Omit<ImageProps, "src"> & { src: string }) {
  return <Image src={src} alt={alt} unoptimized={!src.startsWith(OPTIMIZED_HOST)} {...props} />;
}

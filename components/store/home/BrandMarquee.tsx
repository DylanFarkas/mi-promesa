import Image from "next/image";
import Link from "next/link";
import { cloudinaryOptimizedUrl } from "@/lib/cloudinary";
import type { Brand } from "@/types/database";

type BrandMarqueeData = Pick<Brand, "name" | "slug" | "logo_url">;

const BRAND_IMAGE_SIZES = {
  featured: "(max-width: 768px) 100vw, 1280px",
  default: "(max-width: 768px) 100vw, 640px",
} as const;

interface BrandMarqueeProps {
  brands: BrandMarqueeData[];
}

function BrandCard({
  brand,
  featured,
}: {
  brand: BrandMarqueeData;
  featured: boolean;
}) {
  return (
    <Link
      href={`/marcas/${brand.slug}`}
      aria-label={brand.name}
      className={`
        group relative block overflow-hidden border border-zinc-100 bg-white
        transition-shadow duration-500 hover:shadow-lg
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary
        ${featured ? "md:col-span-2 md:row-span-2 min-h-[280px] md:min-h-0" : "min-h-[220px]"}
      `}
    >
      {brand.logo_url ? (
        <Image
          src={cloudinaryOptimizedUrl(brand.logo_url, featured ? 1920 : 1280)}
          alt=""
          fill
          unoptimized
          priority={featured}
          sizes={featured ? BRAND_IMAGE_SIZES.featured : BRAND_IMAGE_SIZES.default}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] group-focus-visible:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
        />
      ) : (
        <div className="absolute inset-0 bg-white" aria-hidden />
      )}

      <div
        className="
          absolute inset-0 bg-white/0 backdrop-blur-none
          transition-all duration-500 ease-out
          max-md:bg-white/75
          group-hover:bg-white/90 group-hover:backdrop-blur-[2px]
          group-focus-visible:bg-white/90 group-focus-visible:backdrop-blur-[2px]
          motion-reduce:transition-none
        "
        aria-hidden
      />

      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
        <div
          className="
            flex flex-col items-center text-center
            max-md:translate-y-0 max-md:opacity-100
            translate-y-6 opacity-0
            transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-75
            group-focus-visible:translate-y-0 group-focus-visible:opacity-100
            motion-reduce:translate-y-0 motion-reduce:opacity-0
            motion-reduce:group-hover:opacity-100 motion-reduce:group-focus-visible:opacity-100
          "
        >
          <span
            className="
              mb-4 block h-px w-10 bg-secondary
              max-md:w-8
              transition-all duration-500 ease-out
              md:w-0 md:group-hover:w-10 md:group-hover:delay-150
              group-focus-visible:w-10
              motion-reduce:w-10
            "
            aria-hidden
          />

          <h3
            className={`
              font-[family-name:var(--font-noto-serif),Georgia,serif] font-medium text-on-surface
              ${featured ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl md:text-2xl"}
            `}
          >
            {brand.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export function BrandMarquee({ brands }: BrandMarqueeProps) {
  if (!brands.length) return null;

  return (
    <section className="border-y border-zinc-100 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-16">
          <div>
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Curaduría
            </span>
            <h2 className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-2xl text-on-surface md:text-[1.75rem]">
              Marcas que confiamos
            </h2>
          </div>

          <Link
            href="/marcas"
            className="border-b border-on-surface pb-1 text-xs font-semibold uppercase tracking-widest text-on-surface transition-opacity hover:opacity-70"
          >
            Ver todas las marcas
          </Link>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-4 md:gap-5 md:auto-rows-[minmax(200px,1fr)]">
          {brands.map((brand, index) => (
            <BrandCard
              key={brand.slug}
              brand={brand}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
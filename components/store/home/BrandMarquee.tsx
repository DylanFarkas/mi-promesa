import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cloudinaryOptimizedUrl } from "@/lib/cloudinary";
import type { Brand } from "@/types/database";

type BrandMarqueeData = Pick<Brand, "name" | "slug" | "logo_url">;

const CARD_SIZES = "(max-width: 640px) 260px, 340px";

interface BrandMarqueeProps {
  brands: BrandMarqueeData[];
}

function BrandCard({
  brand,
  clone = false,
}: {
  brand: BrandMarqueeData;
  clone?: boolean;
}) {
  return (
    <Link
      href={`/marcas/${brand.slug}`}
      aria-label={clone ? undefined : brand.name}
      aria-hidden={clone || undefined}
      tabIndex={clone ? -1 : undefined}
      className="
        group relative block w-[260px] shrink-0 overflow-hidden border border-zinc-100 bg-white
        mr-4 md:mr-5
        transition-shadow duration-500 hover:shadow-xl
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary
        sm:w-[300px] md:w-[340px]
      "
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {brand.logo_url ? (
          <div className="absolute inset-0 flex items-center justify-center p-8 md:p-10">
            <Image
              src={cloudinaryOptimizedUrl(brand.logo_url, 640)}
              alt=""
              width={280}
              height={160}
              unoptimized
              sizes={CARD_SIZES}
              className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-surface px-6"
            aria-hidden
          >
            <span className="text-center font-[family-name:var(--font-noto-serif),Georgia,serif] text-lg text-on-surface-variant">
              {brand.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-zinc-100 px-5 py-4 md:px-6 md:py-5">
        <h3 className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-lg text-on-surface md:text-xl">
          {brand.name}
        </h3>
        <ArrowUpRight
          className="size-4 shrink-0 text-on-surface-variant transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-secondary motion-reduce:transition-none"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
    </Link>
  );
}

export function BrandMarquee({ brands }: BrandMarqueeProps) {
  if (!brands.length) return null;

  // Velocidad constante sin importar la cantidad de marcas.
  const durationSeconds = Math.max(brands.length * 6, 24);

  return (
    <section className="overflow-hidden border-y border-zinc-100 bg-white py-16 md:py-20">
      <div className="mx-auto mb-12 flex max-w-7xl flex-col gap-4 px-6 sm:flex-row sm:items-end sm:justify-between md:mb-16 md:px-8">
        <div>
          <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Marcas aliadas
          </span>
          <h2 className="font-[family-name:var(--font-noto-serif),Georgia,serif] text-2xl text-on-surface md:text-[1.75rem]">
            Marcas que confiamos
          </h2>
        </div>

        <Link
          href="/marcas"
          className="self-start border-b border-on-surface pb-1 text-xs font-semibold uppercase tracking-widest text-on-surface transition-opacity hover:opacity-70 sm:self-auto"
        >
          Ver todas las marcas
        </Link>
      </div>

      <div className="brand-marquee">
        <div
          className="brand-marquee-track flex"
          style={
            { "--marquee-duration": `${durationSeconds}s` } as CSSProperties
          }
        >
          {brands.map((brand) => (
            <BrandCard key={brand.slug} brand={brand} />
          ))}
          {brands.map((brand) => (
            <span key={`clone-${brand.slug}`} className="brand-marquee-clone contents">
              <BrandCard brand={brand} clone />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

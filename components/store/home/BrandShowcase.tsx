"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cloudinaryOptimizedUrl } from "@/lib/cloudinary";
import type { Brand } from "@/types/database";

type BrandShowcaseData = Pick<Brand, "name" | "slug" | "logo_url">;

interface BrandShowcaseProps {
  brands: BrandShowcaseData[];
}

function BrandLogo({
  brand,
  size,
}: {
  brand: BrandShowcaseData;
  size: number;
}) {
  if (!brand.logo_url) {
    return (
      <span className="px-4 text-center font-serif text-lg text-on-surface-variant">
        {brand.name}
      </span>
    );
  }

  return (
    <Image
      src={cloudinaryOptimizedUrl(brand.logo_url, size)}
      alt=""
      width={size}
      height={Math.round(size * 0.6)}
      unoptimized
      className="max-h-full max-w-full object-contain"
    />
  );
}

export function BrandShowcase({ brands }: BrandShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!brands.length) return null;

  const activeBrand = brands[activeIndex];

  return (
    <section className="border-y border-zinc-100 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-16">
          <div>
            <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Marcas aliadas
            </span>
            <h2 className="font-serif text-2xl text-on-surface md:text-[1.75rem]">
              Marcas en las que confiamos
            </h2>
          </div>

          <Link
            href="/marcas"
            className="self-start border-b border-on-surface pb-1 text-xs font-semibold uppercase tracking-widest text-on-surface transition-opacity hover:opacity-70 sm:self-auto"
          >
            Ver todas las marcas
          </Link>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_400px] lg:gap-20">
          {/* Índice de marcas */}
          <ul className="border-t border-zinc-100">
            {brands.map((brand, index) => (
              <li key={brand.slug} className="border-b border-zinc-100">
                <Link
                  href={`/marcas/${brand.slug}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className="group flex items-center gap-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary md:py-5"
                >
                  {/* Miniatura del logo — solo visible sin panel de vista previa */}
                  <span
                    className="flex size-14 shrink-0 items-center justify-center border border-zinc-100 bg-white p-2 lg:hidden"
                    aria-hidden
                  >
                    <BrandLogo brand={brand} size={120} />
                  </span>

                  <span className="flex-1 font-serif text-2xl leading-tight text-on-surface transition-[transform,color] duration-300 ease-out group-hover:translate-x-2 group-hover:text-secondary md:text-[2rem] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                    {brand.name}
                  </span>

                  <ArrowUpRight
                    className="size-5 shrink-0 text-zinc-300 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-secondary motion-reduce:transition-none"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Panel de vista previa del logo */}
          <div className="hidden lg:block" aria-hidden>
            <div className="sticky top-28 border border-zinc-100 bg-surface">
              <div className="relative aspect-square">
                {brands.map((brand, index) => (
                  <div
                    key={brand.slug}
                    className={`absolute inset-0 flex items-center justify-center p-14 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                      index === activeIndex
                        ? "scale-100 opacity-100"
                        : "scale-[0.97] opacity-0"
                    }`}
                  >
                    <BrandLogo brand={brand} size={640} />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-zinc-100 px-6 py-4">
                <span className="truncate text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                  {activeBrand.name}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-zinc-400">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(brands.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

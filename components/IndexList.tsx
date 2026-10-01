"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Discipline, Work } from "@/content/work";

const comingSoon: Record<Discipline, string> = {
  Apps: "More apps on the way.",
  Photography: "The first photographs are being edited.",
  Apparel: "T-shirts and prints are in the sketchbook.",
};

export function IndexList({ groups }: { groups: { discipline: Discipline; items: Work[] }[] }) {
  const [hovered, setHovered] = useState<Work | null>(null);

  return (
    <>
      {/* Preview of whatever name is under the pointer or focus. */}
      <div
        aria-hidden
        className={`pointer-events-none fixed left-1/2 top-1/2 z-0 w-[min(46vw,420px)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
      >
        {hovered && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
            <Image src={hovered.cover} alt="" fill sizes="420px" className="object-cover" />
            {hovered.mark && (
              <Image
                src={hovered.mark}
                alt=""
                width={160}
                height={160}
                className="absolute left-1/2 top-1/2 w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-[22.5%]"
              />
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-20 [perspective:1100px]">
        {groups.map(({ discipline, items }) => (
          <section
            key={discipline}
            aria-labelledby={`g-${discipline}`}
            className={`transition-opacity duration-300 [transform:rotateX(12deg)] ${hovered && hovered.discipline !== discipline ? "opacity-0" : "opacity-100"}`}
          >
            <h2
              id={`g-${discipline}`}
              className={`mb-5 text-center text-[15px] text-ash transition-opacity duration-300 ${hovered ? "opacity-0" : ""}`}
            >
              {discipline}
              {items.length > 0 && <span className="tabular-nums"> ({items.length})</span>}
            </h2>
            {items.length > 0 ? (
              <ul className="flex flex-wrap items-baseline justify-center gap-x-[0.55em] gap-y-1 text-[clamp(34px,6.2vw,88px)] leading-[1.05] font-medium tracking-[-0.03em]">
                {items.map((w) => (
                  <li key={w.slug}>
                    <Link
                      href={`/work/${w.slug}`}
                      onPointerEnter={() => setHovered(w)}
                      onPointerLeave={() => setHovered(null)}
                      onFocus={() => setHovered(w)}
                      onBlur={() => setHovered(null)}
                      className={`transition-opacity duration-300 ${hovered && hovered.slug !== w.slug ? "opacity-25" : "opacity-100"}`}
                    >
                      {w.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-[clamp(22px,3vw,36px)] tracking-tight text-bone/55">
                {comingSoon[discipline]}
              </p>
            )}
          </section>
        ))}
      </div>
    </>
  );
}

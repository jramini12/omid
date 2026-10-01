import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { IndexList } from "@/components/IndexList";
import { disciplines, work } from "@/content/work";

export const metadata: Metadata = { title: "Index" };

export default function IndexPage() {
  const groups = disciplines.map((d) => ({
    discipline: d,
    items: work.filter((w) => w.discipline === d),
  }));

  return (
    <div className="relative">
      <Chrome fixed={false} />
      <main id="main" className="relative min-h-dvh overflow-hidden px-5 pb-40 pt-36 sm:px-8 md:px-12">
        <div className="horizon-glow !top-[96%] opacity-60" aria-hidden />
        <h1 className="sr-only">Index of everything</h1>
        <IndexList groups={groups} />
      </main>
    </div>
  );
}

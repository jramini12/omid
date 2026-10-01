import type { Metadata } from "next";
import Link from "next/link";
import { Chrome } from "@/components/Chrome";
import { work } from "@/content/work";

export const metadata: Metadata = { title: "Profile" };

export default function Profile() {
  const apps = work.filter((w) => w.discipline === "Apps").length;

  return (
    <div className="relative">
      <Chrome fixed={false} />
      <main id="main" className="relative min-h-dvh overflow-hidden">
        <div className="sky" aria-hidden />
        <div className="horizon-glow" aria-hidden />

        <div className="relative z-10 mx-auto grid min-h-dvh max-w-6xl content-center gap-14 px-5 pt-36 pb-28 sm:px-8 sm:py-36 md:grid-cols-[1.1fr_1fr] md:items-end">
          <h1 className="leading-none">
            <span
              lang="fa"
              dir="rtl"
              className="block font-farsi text-[clamp(120px,22vw,300px)] font-medium leading-[1.1] tracking-normal"
            >
              امید
            </span>
            <span className="mt-2 block text-[clamp(28px,3.4vw,44px)] font-medium tracking-tight">
              Omid. It means hope.
            </span>
          </h1>

          <div className="max-w-[46ch] space-y-6 text-[18px] leading-[1.6] text-bone/85 md:pb-4">
            <p>
              I design and build things I want to exist. So far that is {apps} iPhone apps, each one
              made to fix a small, real problem: sorting a camera roll, surviving an airport, keeping
              track of a shirt collection.
            </p>
            <p>
              Photographs and clothing are next. T-shirts, prints and whatever else turns up in the
              sketchbook will land here as they are made.
            </p>
            <p className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href="/"
                className="underline decoration-bone/30 underline-offset-4 transition-colors hover:decoration-dawn"
              >
                See the work
              </Link>
              <a
                href="https://www.instagram.com/omid_96a/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-bone/30 underline-offset-4 transition-colors hover:decoration-dawn"
              >
                Follow @omid_96a on Instagram<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
        </div>

        <p className="absolute bottom-0 right-0 z-30 p-5 text-[13px] text-ash sm:p-8 md:px-12">
          Sky by{" "}
          <a
            href="https://unsplash.com/@heycrisso?utm_source=omid&utm_medium=referral"
            className="underline decoration-ash/40 underline-offset-4 hover:text-bone"
          >
            Chris Galbraith
          </a>
        </p>
      </main>
    </div>
  );
}

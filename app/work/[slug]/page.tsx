import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Chrome } from "@/components/Chrome";
import { getWork, work } from "@/content/work";

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const w = getWork((await params).slug);
  return w ? { title: w.title, description: w.line } : {};
}

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const w = getWork(slug);
  if (!w) notFound();

  const i = work.indexOf(w);
  const next = work[(i + 1) % work.length];

  return (
    <div className="relative">
      <Chrome fixed={false} />
      <main id="main">
        <div className="relative h-[72svh] min-h-[420px] overflow-hidden">
          <Image src={w.cover} alt="" fill priority sizes="100vw" className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black" />
          {w.mark && (
            <Image
              src={w.mark}
              alt={`${w.title} app icon`}
              width={320}
              height={320}
              priority
              className="absolute left-1/2 top-1/2 w-[clamp(110px,16vw,200px)] -translate-x-1/2 -translate-y-1/2 rounded-[22.5%] shadow-[0_40px_80px_-24px_rgb(0_0_0/0.8)]"
            />
          )}
        </div>

        <article className="mx-auto -mt-[clamp(40px,8vw,110px)] max-w-5xl px-5 pb-24 sm:px-8 relative">
          <h1 className="text-[clamp(56px,11vw,150px)] leading-[0.9] font-medium tracking-[-0.045em] text-balance">{w.title}</h1>
          <p className="mt-6 max-w-[28ch] text-balance text-[clamp(22px,2.6vw,32px)] leading-tight tracking-tight text-bone/85">
            {w.line}
          </p>

          <div className="mt-16 grid gap-12 md:grid-cols-[1fr_16rem]">
            <div className="max-w-[62ch] space-y-8">
              <p className="text-[18px] leading-[1.6] text-bone/80">{w.summary}</p>
              <ul className="divide-y divide-bone/10 border-y border-bone/10">
                {w.highlights.map((h) => (
                  <li key={h} className="py-3.5 text-[17px]">
                    {h}
                  </li>
                ))}
              </ul>
              {w.link && (
                <a
                  href={w.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-3 text-[15px] font-medium text-night transition-colors hover:bg-dawn"
                >
                  {w.link.label}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </div>

            <dl className="space-y-5 text-[15px]">
              <div>
                <dt className="text-ash">Discipline</dt>
                <dd>{w.discipline}</dd>
              </div>
              {w.platforms && (
                <div>
                  <dt className="text-ash">Runs on</dt>
                  <dd>{w.platforms}</dd>
                </div>
              )}
              <div>
                <dt className="text-ash">Year</dt>
                <dd>{w.year}</dd>
              </div>
              {w.coverCredit && (
                <div>
                  <dt className="text-ash">Cover photo</dt>
                  <dd>
                    <a
                      href={`https://unsplash.com/@${w.coverCredit.username}?utm_source=omid&utm_medium=referral`}
                      className="underline decoration-bone/30 underline-offset-4 hover:decoration-bone"
                    >
                      {w.coverCredit.name}
                    </a>{" "}
                    on Unsplash
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <nav aria-label="Next project" className="mt-28 mb-16 border-t border-bone/10 pt-8">
            <Link href={`/work/${next.slug}`} className="group block">
              <span className="text-[15px] text-ash">Next</span>
              <span className="mt-1 block text-[clamp(40px,7vw,96px)] leading-none font-medium tracking-[-0.04em] transition-colors group-hover:text-dawn">
                {next.title}
              </span>
            </Link>
          </nav>
        </article>
      </main>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Work } from "@/content/work";

/** Degrees between neighbouring cards on the cylinder. */
const STEP = 30;
/** Cards further round than this fade out entirely. */
const FADE_FROM = 1.35;
const FADE_TO = 1.9;

type Layout = { w: number; h: number; r: number; depth: number; perspective: number };

function measure(): Layout {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mobile = vw < 640;
  let w = mobile ? vw * 0.74 : Math.min(vw * 0.5, 860);
  let h = mobile ? w * 1.22 : w * 0.62;
  // Keep the card clear of the top and bottom chrome.
  const maxH = vh * (mobile ? 0.56 : 0.5);
  if (h > maxH) {
    w *= maxH / h;
    h = maxH;
  }
  const r = ((w / 2) / Math.tan(((STEP / 2) * Math.PI) / 180)) * 1.1;
  return { w, h, r, depth: w * 0.1, perspective: w * 2.6 };
}

/** Wrap a position into [-n/2, n/2) so the ring loops forever. */
function wrap(x: number, n: number) {
  return ((((x + n / 2) % n) + n) % n) - n / 2;
}

export function Carousel({ items }: { items: Work[] }) {
  const n = items.length;
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const pos = useRef(0); // current rotation, in cards
  const target = useRef(0);
  const layout = useRef<Layout | null>(null);
  const raf = useRef(0);
  const reduced = useRef(false);
  const drag = useRef<{ x: number; start: number; moved: boolean; lastX: number; lastT: number; v: number } | null>(null);
  const suppressClick = useRef(false);
  const wheel = useRef({ acc: 0, lock: 0 });

  const [active, setActive] = useState(0);
  const ringRef = useRef<HTMLUListElement>(null);
  const activeRef = useRef(0);

  const paint = useCallback(() => {
    const L = layout.current;
    if (!L) return;
    const p = pos.current;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const off = wrap(i - p, n);
      const a = Math.abs(off);
      const fade = a <= FADE_FROM ? 1 : a >= FADE_TO ? 0 : 1 - (a - FADE_FROM) / (FADE_TO - FADE_FROM);
      el.style.transform = `translate(-50%, -50%) rotateY(${off * -STEP}deg) translateZ(${-L.r}px)`;
      el.style.opacity = String(fade);
      el.style.visibility = fade === 0 ? "hidden" : "visible";
      el.style.setProperty("--dim", String(Math.min(a, 1)));
      el.style.zIndex = String(100 - Math.round(a * 10));
    });
    sceneRef.current?.style.setProperty("--floor-x", `${-p * 140}px`);
    const nearest = ((Math.round(p) % n) + n) % n;
    if (nearest !== activeRef.current) {
      activeRef.current = nearest;
      setActive(nearest);
    }
  }, [n]);

  // The animation loop lives in a ref so it can reschedule itself.
  const tick = useRef<() => void>(() => {});
  useEffect(() => {
    tick.current = () => {
      const d = target.current - pos.current;
      if (!drag.current) {
        if (reduced.current || Math.abs(d) < 0.0005) pos.current = target.current;
        else pos.current += d * 0.1;
      }
      paint();
      raf.current =
        drag.current || pos.current !== target.current ? requestAnimationFrame(() => tick.current()) : 0;
    };
  }, [paint]);

  const run = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(() => tick.current());
  }, []);

  const goTo = useCallback(
    (i: number) => {
      target.current = Math.round(target.current) + wrap(i - target.current, n);
      target.current = Math.round(target.current);
      run();
    },
    [n, run],
  );
  const step = useCallback(
    (dir: 1 | -1) => {
      target.current = Math.round(target.current) + dir;
      run();
    },
    [run],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const onMq = () => (reduced.current = mq.matches);
    mq.addEventListener("change", onMq);

    const apply = () => {
      const L = measure();
      layout.current = L;
      const s = sceneRef.current;
      if (s) {
        s.style.setProperty("--card-w", `${L.w}px`);
        s.style.setProperty("--card-h", `${L.h}px`);
        s.style.setProperty("--ring-z", `${L.r - L.depth}px`);
        s.style.setProperty("--perspective", `${L.perspective}px`);
      }
      paint();
    };
    apply();
    ringRef.current?.setAttribute("data-ready", "");
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("resize", apply);
      mq.removeEventListener("change", onMq);
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [paint]);

  // Wheel and trackpad: one card per gesture.
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      e.preventDefault();
      const now = performance.now();
      if (now < wheel.current.lock) return;
      wheel.current.acc += delta;
      if (Math.abs(wheel.current.acc) > 40) {
        step(wheel.current.acc > 0 ? 1 : -1);
        wheel.current.acc = 0;
        wheel.current.lock = now + 420;
      }
    };
    s.addEventListener("wheel", onWheel, { passive: false });
    return () => s.removeEventListener("wheel", onWheel);
  }, [step]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    suppressClick.current = false;
    drag.current = { x: e.clientX, start: pos.current, moved: false, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
    target.current = pos.current;
    run();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const L = layout.current;
    if (!d || !L) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.v = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    pos.current = d.start - dx / (L.w * 0.9);
    target.current = pos.current;
  };
  const endDrag = () => {
    const d = drag.current;
    const L = layout.current;
    drag.current = null;
    if (!d || !L) return;
    if (d.moved) {
      suppressClick.current = true;
      const fling = (-d.v * 220) / (L.w * 0.9);
      target.current = Math.round(pos.current + Math.max(-2, Math.min(2, fling)));
    } else {
      target.current = Math.round(pos.current);
    }
    run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const current = items[active];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured work"
      className="absolute inset-0"
      onKeyDown={onKeyDown}
    >
      <div
        ref={sceneRef}
        className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{ perspective: "var(--perspective, 1200px)" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="sky" aria-hidden />
        <div className="horizon-glow" aria-hidden />
        <div className="floor" aria-hidden />

        <ul
          ref={ringRef}
          className="absolute left-1/2 top-[44%] opacity-0 transition-opacity duration-700 data-ready:opacity-100"
          style={{ transformStyle: "preserve-3d", transform: "translateZ(var(--ring-z, 0px))" }}
        >
          {items.map((w, i) => (
            <li
              key={w.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute left-0 top-0"
              style={{ width: "var(--card-w, 50vw)", height: "var(--card-h, 31vw)", backfaceVisibility: "hidden" }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
            >
              <Link
                href={`/work/${w.slug}`}
                draggable={false}
                onFocus={() => goTo(i)}
                onClick={(e) => {
                  if (suppressClick.current) {
                    suppressClick.current = false;
                    e.preventDefault();
                    return;
                  }
                  if (i !== activeRef.current) {
                    e.preventDefault();
                    goTo(i);
                  }
                }}
                className="group relative block h-full w-full overflow-hidden rounded-[clamp(18px,2.2vw,30px)] bg-neutral-900 outline-offset-8"
              >
                <Image
                  src={w.cover}
                  alt=""
                  fill
                  draggable={false}
                  sizes="(max-width: 640px) 80vw, 860px"
                  priority={i < 2 || i === n - 1}
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"
                />
                {w.mark && (
                  <Image
                    src={w.mark}
                    alt=""
                    width={240}
                    height={240}
                    draggable={false}
                    className="absolute left-1/2 top-[44%] w-[24%] max-w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-[22.5%] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)]"
                  />
                )}
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-[clamp(16px,2.4vw,32px)]">
                  <span className="text-[clamp(22px,2.6vw,40px)] leading-none font-medium tracking-tight">{w.title}</span>
                  <span className="hidden text-[15px] text-bone/70 md:block">{w.discipline}</span>
                </span>
                {/* Side cards sink into the dark. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-black transition-opacity"
                  style={{ opacity: "calc(var(--dim, 0) * 0.55)" }}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[17%] z-20 px-6 text-center sm:bottom-[14%]">
        <p className="text-[15px] text-bone/80">{current.line}</p>
      </div>

      <div className="absolute bottom-0 right-0 z-30 flex items-center gap-4 p-5 text-[15px] sm:p-8 md:px-12">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous project"
          className="grid size-9 place-items-center rounded-full border border-bone/25 transition-colors hover:border-bone/70"
        >
          <Chevron dir="left" />
        </button>
        <span className="tabular-nums" aria-hidden>
          {active + 1}/{n}
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next project"
          className="grid size-9 place-items-center rounded-full border border-bone/25 transition-colors hover:border-bone/70"
        >
          <Chevron dir="right" />
        </button>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic>
        {current.title}, {active + 1} of {n}
      </p>
    </section>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className={dir === "left" ? "rotate-180" : ""}>
      <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

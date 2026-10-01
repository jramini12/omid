// Everything Omid makes lives here. Add a photograph series, a T-shirt or a new app
// by appending an entry: it shows up on the Featured carousel (if `featured`), the
// Index and gets its own page at /work/<slug>.

export type Discipline = "Apps" | "Photography" | "Apparel";

export type Credit = { name: string; username: string };

export type Work = {
  slug: string;
  title: string;
  discipline: Discipline;
  year: number;
  /** One line, shown on cards and the index. */
  line: string;
  /** A short paragraph for the project page. */
  summary: string;
  highlights: string[];
  platforms?: string;
  /** Square artwork (app icon, garment flat, etc.) in /public. */
  mark?: string;
  /** Wide atmosphere image in /public. */
  cover: string;
  coverCredit?: Credit;
  link?: { label: string; href: string };
  featured?: boolean;
};

export const work: Work[] = [
  {
    slug: "posted",
    title: "Posted",
    discipline: "Apps",
    year: 2026,
    line: "A shared to-do board for two.",
    summary:
      "Stick a note on the board, tick it off when it is done, and see what the other person has been up to. Points for finished jobs, a weekly head-to-head that resets every Monday, and treats you save up for together. No accounts, no server: the board lives in your own iCloud and is shared with one person.",
    highlights: [
      "Pastel sticky notes with due dates and repeats",
      "Weekly head-to-head and 12 achievements",
      "iPhone, iPad, Mac, widgets and an Apple Watch app",
      "End-to-end encrypted notes through CloudKit sharing",
    ],
    platforms: "iPhone, iPad, Mac, Apple Watch",
    mark: "/apps/posted.png",
    cover: "/photos/posted.jpg",
    coverCredit: { name: "Vitalii Abakumov", username: "scoutori" },
    link: { label: "Visit the Posted site", href: "https://posted-for-two.vercel.app" },
    featured: true,
  },
  {
    slug: "kit-universe",
    title: "Kit Universe",
    discipline: "Apps",
    year: 2026,
    line: "A catalogue for football shirt collectors.",
    summary:
      "Every detail of every shirt, from nameset and patches to where you wore it. Kit Universe spots the sets hiding inside a collection, like a 1 to 99 squad number run or a club's home, away and third, and shows how close you are to finishing each one.",
    highlights: [
      "Sets that build themselves, with progress rings",
      "Stats and a world map of where your shirts come from",
      "Wishlist with target prices and quick marketplace searches",
      "Works offline, imports your spreadsheet, exports to CSV",
    ],
    platforms: "iPhone",
    mark: "/apps/kit-universe.png",
    cover: "/photos/kit-universe.jpg",
    coverCredit: { name: "Alex Simpson", username: "m_simpsan" },
    featured: true,
  },
  {
    slug: "freedome",
    title: "Freedome",
    discipline: "Apps",
    year: 2026,
    line: "A travel companion that counts down to what is next.",
    summary:
      "The Now screen counts down to whatever comes next on a trip: the airport train, bag drop, gate close, check-in. Each card carries the one action you need. Plan, Places and Docs hand off to the system, from Wallet and Apple Maps to Calendar and Quick Look.",
    highlights: [
      "A live countdown to the next thing on the trip",
      "Day-by-day plan and a map with nearby search",
      "Passes, tickets and bookings in one place",
      "Built with Liquid Glass for iOS 26",
    ],
    platforms: "iPhone",
    mark: "/apps/freedome.png",
    cover: "/photos/freedome.jpg",
    coverCredit: { name: "Eleni Afiontzi", username: "eleniafiontzi" },
    featured: true,
  },
  {
    slug: "flick",
    title: "Flick",
    discipline: "Apps",
    year: 2026,
    line: "Sort your camera roll one swipe at a time.",
    summary:
      "Flick deals every photo and video in your library as a card. Swipe left to bin it, right to keep it, up to favourite it. When you are done, empty the bin in one go and see how much space you got back.",
    highlights: [
      "Swipe to keep, bin or favourite",
      "Batch delete from a reviewable bin",
      "Stats on what you kept and cleared",
      "Photos stay on your device",
    ],
    platforms: "iPhone",
    mark: "/apps/flick.png",
    cover: "/photos/flick.jpg",
    coverCredit: { name: "Annie Spratt", username: "anniespratt" },
    featured: true,
  },
  {
    slug: "dpsi-law",
    title: "DPSI Law",
    discipline: "Apps",
    year: 2026,
    line: "Exam prep for legal interpreters.",
    summary:
      "Built for UK candidates studying for the Diploma in Public Service Interpreting, Law option. Spaced-repetition flashcards for legal vocabulary in any language pair, courtroom dialogue to rehearse out loud, and drills that build exam-day stamina.",
    highlights: [
      "Flashcards scheduled by spaced repetition",
      "Any language pair, with your own terms and context",
      "Speaking drills for courtroom dialogue",
      "Made for the DPSI Law exam",
    ],
    platforms: "iPhone",
    mark: "/apps/dpsi-law.png",
    cover: "/photos/dpsi-law.jpg",
    coverCredit: { name: "Chris Bischoff", username: "cbischoff" },
    link: { label: "Visit the DPSI Law site", href: "https://dpsi-law.vercel.app" },
    featured: true,
  },
];

export const disciplines: Discipline[] = ["Apps", "Photography", "Apparel"];

export const featured = work.filter((w) => w.featured);

export function getWork(slug: string) {
  return work.find((w) => w.slug === slug);
}

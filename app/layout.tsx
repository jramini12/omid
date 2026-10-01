import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Vazirmatn } from "next/font/google";
import "./globals.css";

const grotesk = Familjen_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const vazir = Vazirmatn({
  variable: "--font-farsi",
  subsets: ["arabic"],
  weight: ["300", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Omid, hope",
    template: "%s · Omid",
  },
  description:
    "Omid means hope in Farsi. Apps, photographs and things I design.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${grotesk.variable} ${vazir.variable} antialiased`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

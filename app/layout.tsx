import type { Metadata } from "next";
import { Fredoka, Poppins, Quicksand } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import CursorSparkle from "./components/CursorSparkle";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StoryNest AI - Magical Stories for Kids",
  description: "Create personalized, magical stories for your children in minutes with StoryNest AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body
          className={`${fredoka.variable} ${poppins.variable} ${quicksand.variable} antialiased font-poppins bg-story-lavender text-slate-800`}
        >
          <CursorSparkle />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

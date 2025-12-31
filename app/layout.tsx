import type { Metadata } from "next";
import { Fredoka, Poppins } from "next/font/google"; // Importing clean and friendly fonts
import { ClerkProvider } from "@clerk/nextjs"; // Import Clerk for user login/account management
import "./globals.css"; // Import our global styles
import CursorSparkle from "./components/CursorSparkle"; // The magical sparkle effect that follows the mouse

// Setting up the "Fredoka" font for headings
const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

// Setting up the "Poppins" font for regular text
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

// This information shows up on Google and in the browser tab
export const metadata: Metadata = {
  title: "StoryNest AI - Magical Stories for Kids",
  description: "Create personalized, magical stories for your children in minutes with StoryNest AI.",
};

// This is the main layout that wraps around every page of the website
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body
          className={`${fredoka.variable} ${poppins.variable} antialiased font-poppins bg-story-lavender text-slate-800`}
        >
          {/* Add the magical mouse effect here */}
          <CursorSparkle />

          {/* This is where the content of each page will be shown */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

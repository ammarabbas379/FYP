// This file is the main homepage of the website.
// It brings together different "blocks" (components) to build the full page.

import Header from './components/Header';   // The top navigation bar
import Hero from './components/Hero';       // The big welcome section with the "Create" button
import Features from './components/Features'; // The section explaining what the app does

import CTA from './components/CTA';           // The "Call To Action" section (encourages users to start)
import Footer from './components/Footer';     // The very bottom of the page with links

export default function Home() {
  return (
    <div className="min-h-screen font-poppins bg-story-lavender">
      {/* Show the top navigation bar */}
      <Header />

      <main>
        {/* Main content sections of the homepage */}
        <Hero />
        <Features />
        <CTA />
      </main>

      {/* Show the bottom footer */}
      <Footer />
    </div>
  );
}

"use client"; // This tells Next.js that this component has interactive parts (like buttons or scroll effects)

import Link from 'next/link'; // For jumping to different pages
import Image from 'next/image'; // For high-quality images
import { useState, useEffect } from 'react'; // For keeping track of things (like if the user scrolled)
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'; // User login tools
import { useCredits } from '../context/CreditsProvider'; // Credit system

export default function Header() {
    // These states keep track of whether the page is scrolled and if the mobile menu is open
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { credits } = useCredits();

    // This runs when the page is scrolled to change the header's look
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Navigation items
    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Create Story', href: '/create-story' },
        { label: 'Explore Stories', href: '#' },
        { label: 'Contact Us', href: '/contact-us' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-md py-2' // Smaller and semi-see-through when scrolled
                : 'bg-white/30 backdrop-blur-sm py-4 border-b border-white/20' // Airy and light at the top
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">

                    {/* The StoryNest Logo - clicking it takes you back Home */}
                    <Link href="/" className="flex items-center group">
                        <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                            <Image
                                src="/images/storynest-logo-cursive.png"
                                alt="StoryNest Logo"
                                width={350}
                                height={120}
                                className="h-32 w-auto object-contain -my-10"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation Links (shown only on bigger screens) */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="font-medium text-gray-600 hover:text-story-purple transition-colors relative group"
                            >
                                {item.label}
                                {/* The little line that appears under the link when you hover */}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-story-purple transition-all group-hover:w-full rounded-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Login Buttons + Credit Badge */}
                    <div className="hidden md:flex items-center gap-4">
                        <SignedOut>
                            {/* Shown when the user is NOT logged in */}
                            <SignInButton mode="modal">
                                <button className="bg-story-purple hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-full shadow-lg shadow-purple-200 hover:shadow-purple-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                                    Get Started
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <Link
                                href="/buy-credits"
                                className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-full px-4 py-2 hover:shadow-lg hover:border-amber-300 transition-all group"
                                title="Buy more credits"
                            >
                                <div className="relative w-6 h-6 group-hover:scale-110 transition-transform">
                                    <Image
                                        src="/images/coin.png"
                                        alt="AI Coin"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="font-bold text-amber-700 font-fredoka text-lg">
                                    {credits !== null ? credits : '...'}
                                </span>
                            </Link>
                            {/* Shown when the user IS logged in */}
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>

                    {/* Mobile Menu Button (shown only on small screens) */}
                    <div className="md:hidden flex items-center gap-3">
                        <SignedIn>
                            {/* Mobile credit badge */}
                            <Link
                                href="/buy-credits"
                                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-full px-3 py-1.5"
                            >
                                <div className="relative w-5 h-5">
                                    <Image
                                        src="/images/coin.png"
                                        alt="AI Coin"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="font-bold text-amber-700 font-fredoka text-sm">
                                    {credits !== null ? credits : '...'}
                                </span>
                            </Link>
                        </SignedIn>
                        <button
                            className="p-2 text-gray-600"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                </div>

                {/* Mobile Menu dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t p-4 shadow-lg flex flex-col gap-4 animate-fade-in-up">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="block text-gray-600 hover:text-story-purple font-medium py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="w-full bg-story-purple text-white font-bold py-3 rounded-xl shadow-md">
                                    Get Started
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                )}
            </div>
        </header>
    );
}


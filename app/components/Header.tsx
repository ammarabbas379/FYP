"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-md py-2'
                : 'bg-white/30 backdrop-blur-sm py-4 border-b border-white/20'
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-12 h-12 relative transform group-hover:scale-105 transition-transform duration-300 bg-transparent rounded-xl border-2 border-purple-200/50">
                            <Image
                                src="/images/storynest-logo.png"
                                alt="StoryNest Logo"
                                width={48}
                                height={48}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-2xl font-bold font-fredoka text-story-purple tracking-wide">
                            StoryNest AI
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {['Home', 'Create Story', 'Explore Stories', 'Contact Us'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Home' ? '/' : item === 'Create Story' ? '/create-story' : item === 'Contact Us' ? '/contact-us' : '#'}
                                className="font-medium text-gray-600 hover:text-story-purple transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-story-purple transition-all group-hover:w-full rounded-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:block">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="bg-story-purple hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-full shadow-lg shadow-purple-200 hover:shadow-purple-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                                    Get Started
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>

                    {/* Mobile Auth & Menu */}
                    <div className="md:hidden flex items-center gap-3">
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

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t p-4 shadow-lg flex flex-col gap-4 animate-fade-in-up">
                        {['Home', 'Create Story', 'Explore Stories', 'Contact Us'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Home' ? '/' : item === 'Create Story' ? '/create-story' : item === 'Contact Us' ? '/contact-us' : '#'}
                                className="block text-gray-600 hover:text-story-purple font-medium py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item}
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

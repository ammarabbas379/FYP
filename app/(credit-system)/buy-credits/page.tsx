"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useCredits } from '../../_features/credits/CreditsProvider';
import Image from 'next/image';

// Credit packages available for purchase
const CREDIT_PACKAGES = [
    {
        id: 'starter',
        name: 'Starter Pack',
        credits: 5,
        price: 2.99,
        emoji: '⭐',
        color: 'from-blue-500 to-cyan-400',
        bgGlow: 'shadow-blue-200',
        popular: false,
        perCredit: '0.60',
    },
    {
        id: 'popular',
        name: 'Popular Pack',
        credits: 15,
        price: 6.99,
        emoji: '🌟',
        color: 'from-purple-500 to-pink-500',
        bgGlow: 'shadow-purple-200',
        popular: true,
        perCredit: '0.47',
    },
    {
        id: 'mega',
        name: 'Mega Pack',
        credits: 50,
        price: 17.99,
        emoji: '💎',
        color: 'from-amber-500 to-orange-500',
        bgGlow: 'shadow-amber-200',
        popular: false,
        perCredit: '0.36',
    },
];

export default function BuyCreditsPage() {
    const { credits, refreshCredits } = useCredits();
    const searchParams = useSearchParams();
    const [selectedPackage, setSelectedPackage] = useState<string>('popular');
    const [loading, setLoading] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [purchasedAmount, setPurchasedAmount] = useState(0);
    const [error, setError] = useState('');

    // Handle redirect back from Stripe
    useEffect(() => {
        const success = searchParams.get('success');
        const amount = searchParams.get('amount');
        const canceled = searchParams.get('canceled');
        const sessionId = searchParams.get('session_id');

        const verifySession = async (id: string, amt: number) => {
            try {
                const res = await fetch('/api/stripe/verify-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: id }),
                });
                
                if (res.ok) {
                    setPurchaseSuccess(true);
                    setPurchasedAmount(amt);
                    await refreshCredits();
                } else {
                    const data = await res.json();
                    setError(data.error || 'Failed to verify payment.');
                }
            } catch (err) {
                console.error('Error verifying session:', err);
                setError('Network error while verifying payment.');
            }
        };

        if (success === 'true' && amount && sessionId && !purchaseSuccess && !error) {
            // Verify the session on the backend to award credits
            verifySession(sessionId, parseInt(amount));
            // Remove parameters from URL to avoid re-triggering
            window.history.replaceState(null, '', '/buy-credits');
        } else if (success === 'true' && amount && !sessionId && !purchaseSuccess) {
            // Fallback if no session_id (relies entirely on webhooks)
            setPurchaseSuccess(true);
            setPurchasedAmount(parseInt(amount));
            refreshCredits();
            window.history.replaceState(null, '', '/buy-credits');
        }

        if (canceled === 'true' && !error) {
            setError('Payment cancelled. No charges were made.');
            window.history.replaceState(null, '', '/buy-credits');
        }
    }, [searchParams, refreshCredits, purchaseSuccess, error]);

    const handleBuyNow = async (packageId: string) => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packageId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to initiate checkout');
            }

            // Redirect to Stripe Checkout
            window.location.href = data.url;
        } catch (err: any) {
            console.error('Stripe error:', err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-poppins bg-story-lavender text-black">
            <Header />
            <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
                <SignedIn>
                    <div className="max-w-6xl mx-auto">
                        {/* Page Header */}
                        <div className="text-center mb-12 animate-fade-in-up">
                            <h1 className="text-4xl sm:text-5xl font-bold font-fredoka text-gray-900 mb-4">
                                Buy <span className="text-gradient">Story Credits</span> ✨
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Each credit lets you create one magical AI-generated story.
                                Choose a pack and start your storytelling adventure!
                            </p>

                            {/* Current balance */}
                            <div className="inline-flex items-center gap-3 mt-6 bg-white rounded-full px-6 py-3 shadow-lg border-2 border-purple-100">
                                <div className="relative w-8 h-8">
                                    <Image
                                        src="/images/coin.png"
                                        alt="AI Coin"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-lg font-semibold text-gray-700">
                                    Your Balance:
                                </span>
                                <span className="text-2xl font-bold text-story-purple font-fredoka">
                                    {credits !== null ? credits : '...'}
                                </span>
                                <span className="text-gray-500 text-sm">credits</span>
                            </div>
                        </div>

                        {/* Success Message */}
                        {purchaseSuccess && (
                            <div className="max-w-lg mx-auto mb-10 animate-fade-in-up">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 text-center shadow-lg">
                                    <div className="text-5xl mb-3">🎉</div>
                                    <h3 className="text-2xl font-bold font-fredoka text-green-700 mb-2">
                                        Payment Successful!
                                    </h3>
                                    <p className="text-green-600 text-lg">
                                        <span className="font-bold">{purchasedAmount} credits</span> have been added to your account.
                                    </p>
                                    <button
                                        onClick={() => setPurchaseSuccess(false)}
                                        className="mt-4 text-sm text-green-500 hover:text-green-700 underline"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="max-w-lg mx-auto mb-10 animate-fade-in-up">
                                <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 text-center shadow-lg">
                                    <p className="text-red-600">{error}</p>
                                    <button
                                        onClick={() => setError('')}
                                        className="mt-3 text-sm text-red-400 hover:text-red-600 underline"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Credit Packages */}
                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            {CREDIT_PACKAGES.map((pkg, index) => (
                                <div
                                    key={pkg.id}
                                    className={`relative bg-white rounded-[40px] p-8 transition-all duration-300 text-center
                                        animate-fade-in-up flex flex-col items-center
                                        ${selectedPackage === pkg.id
                                            ? `ring-4 ring-story-purple shadow-2xl ${pkg.bgGlow} scale-[1.05]`
                                            : 'shadow-xl hover:shadow-2xl hover:scale-[1.02] border border-purple-50'
                                        }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    onClick={() => setSelectedPackage(pkg.id)}
                                >
                                    {/* Popular badge */}
                                    {pkg.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg z-10">
                                            🌟 MOST POPULAR
                                        </div>
                                    )}

                                    {/* Package icon */}
                                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${pkg.color} flex items-center justify-center text-4xl mb-6 shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform`}>
                                        {pkg.emoji}
                                    </div>

                                    {/* Package name */}
                                    <h3 className="text-2xl font-bold font-fredoka text-gray-800 mb-2">
                                        {pkg.name}
                                    </h3>

                                    {/* Credits count */}
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-5xl font-bold font-fredoka text-gray-900">
                                            {pkg.credits}
                                        </span>
                                        <span className="text-gray-500 text-xl font-medium">credits</span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <span className="text-4xl font-bold text-story-purple font-fredoka">
                                            ${pkg.price.toFixed(2)}
                                        </span>
                                        <span className="text-gray-400 text-sm font-semibold">USD</span>
                                    </div>

                                    {/* Per credit price */}
                                    <p className="text-sm text-gray-400 mb-8">
                                        Only ${pkg.perCredit} per story
                                    </p>

                                    {/* Buy Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBuyNow(pkg.id);
                                        }}
                                        disabled={loading}
                                        className={`w-full py-4 rounded-2xl font-bold font-fredoka text-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                                            ${loading && selectedPackage === pkg.id ? 'opacity-70 cursor-wait' : ''}
                                            ${selectedPackage === pkg.id
                                                ? 'bg-story-purple text-white shadow-lg shadow-purple-200 hover:bg-purple-700'
                                                : 'bg-purple-50 text-story-purple hover:bg-purple-100'
                                            }`}
                                    >
                                        {loading && selectedPackage === pkg.id ? (
                                            <>
                                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <span>Buy Now</span>
                                                <span className="text-xl">✨</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Secure payment footer */}
                        <div className="flex flex-col items-center gap-4 text-gray-400 mt-12">
                            <div className="flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                                {/* Visa SVG */}
                                <svg className="h-8 w-auto" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.835 31.058H14.502L17.202 14.5H21.535L18.835 31.058Z" fill="#1434CB"/>
                                    <path d="M35.632 15.011C34.708 14.654 33.39 14.316 31.782 14.316C27.502 14.316 24.475 16.591 24.453 19.852C24.43 22.251 26.581 23.585 28.217 24.385C29.897 25.204 30.461 25.722 30.453 26.463C30.439 27.595 29.096 28.113 27.844 28.113C26.505 28.113 25.438 27.811 24.417 27.359L23.754 27.051L23.011 31.621C24.238 32.185 26.506 32.674 28.847 32.688C33.383 32.688 36.333 30.447 36.368 26.963C36.395 24.162 34.69 22.959 31.916 21.628C29.622 20.485 28.877 19.866 28.889 18.995C28.889 18.22 29.752 17.385 31.572 17.385C33.007 17.361 34.148 17.671 34.925 18.012L35.297 18.188L36.039 13.618L35.632 15.011Z" fill="#1434CB"/>
                                    <path d="M43.918 14.5H40.575C39.549 14.5 38.718 14.801 38.269 15.869L32.115 31.058H36.666L37.575 28.536H43.14L43.663 31.058H47.668L43.918 14.5ZM38.835 25.048L41.385 18.05L42.844 25.048H38.835Z" fill="#1434CB"/>
                                    <path d="M12.023 14.5L7.202 26.837L6.685 24.186C5.811 21.228 3.195 18.15 0.334 16.634L0 16.458L4.654 31.045L9.227 31.058L15.938 14.5H12.023Z" fill="#F7B600"/>
                                </svg>
                                {/* Mastercard SVG */}
                                <svg className="h-8 w-auto" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="16" cy="24" r="14" fill="#EB001B" fillOpacity="0.8"/>
                                    <circle cx="32" cy="24" r="14" fill="#F79E1B" fillOpacity="0.8"/>
                                </svg>
                                {/* Stripe SVG */}
                                <svg className="h-8 w-auto" viewBox="0 0 100 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M96.4 18.6h-5.2c-1 0-1.8.8-1.8 1.8v10.1c0 1 .8 1.8 1.8 1.8h5.2c1 0 1.8-.8 1.8-1.8V20.4c0-1-.8-1.8-1.8-1.8zm-5.2-4.1c0-1.1.9-2 2-2h1.3c1.1 0 2 .9 2 2v1.3c0 1.1-.9 2-2 2h-1.3c-1.1 0-2-.9-2-2v-1.3zm-10.9 4.1c-2.3 0-4.1 1-5.1 2.3l-.2-.8c-.1-.7-.8-1.5-1.5-1.5h-4.3c-.8 0-1.5.8-1.5 1.5v21.1c0 .8.7 1.5 1.5 1.5h5.1c.8 0 1.5-.7 1.5-1.5v-10c0-3 1.9-4.8 4.6-4.8 2.6 0 4.1 1.6 4.1 4.5v10.2c0 .8.7 1.5 1.5 1.5h5.1c.8 0 1.5-.7 1.5-1.5v-11.8c.1-5.5-2.9-8.7-7.3-8.7zm-27.1 0c-3.1 0-5.7 1.2-7.3 3.3l-.2-1.8c-.1-.8-.8-1.5-1.6-1.5H67c-.8 0-1.5.7-1.5 1.5v11.8c0 5.5 3.3 8.7 7.7 8.7 2.3 0 4.1-1 5.1-2.3l.2.8c.1.7.8 1.5 1.5 1.5h4.3c.8 0 1.5-.8 1.5-1.5V18.6h-8.2zm-.3 11.2c0 2.9-1.9 4.8-4.6 4.8-2.6 0-4.1-1.6-4.1-4.5V18.6h8.7v11.2z" fill="#6772E5"/>
                                    <path d="M41.7 14.1c0-4.8-3.6-7.5-8.7-7.5-4.4 0-8.6 1.8-11.4 4.5-.4.4-.3 1.1.1 1.5l3 2.6c.3.3.8.2 1.1-.1 1.8-1.8 4.2-2.8 6.5-2.8 2.3 0 3.1 1 3.1 2 0 1.5-1.8 1.9-5.1 3-5.2 1.8-10.4 3.7-10.4 10.3 0 6.6 4.3 9.4 9.4 9.4 3.8 0 7.4-1.5 9.7-4l.2 1.4c.1.9.9 1.6 1.7 1.6h3.9c.8 0 1.5-.7 1.5-1.5V14.1zm-8.8 16.5c-2.3 0-3.3-1.2-3.3-3.1 0-2.3 1.8-3.1 5.3-4.2 1.3-.4 2.5-.8 3.5-1.3v3.7c-1.4 3.3-3.1 4.9-5.5 4.9zm-18.4-6c0-5.4-3.1-8.1-8.1-8.1-2.8 0-5.7 1.1-7.7 3.3-.4.4-.3 1.1.1 1.4l3.1 2.4c.3.3.8.2 1.1-.1 1.1-1.2 2.2-1.7 3.3-1.7.9 0 1.5.3 1.5 1.1 0 .6-.6 1-1.5 1.3-4.2 1.5-8.3 3.1-8.3 8.3 0 5.4 3.6 8.3 8.1 8.3 2.3 0 5-.9 6.8-2.8l.2 1.5c.1.7.7 1.3 1.5 1.3H19c.8 0 1.5-.7 1.5-1.5V18.6h-6.1l.1 6zm-8.1 6.1c-1.9 0-2.8-1.1-2.8-2.8 0-1.6 1.1-2.5 4-3.7.8-.3 1.6-.6 2.3-1v3c-1.1 3.2-1.9 4.5-3.5 4.5z" fill="#6772E5"/>
                                </svg>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Secure 256-bit SSL Encrypted Payment
                            </div>
                        </div>
                    </div>
                </SignedIn>

                {/* Not signed in */}
                <SignedOut>
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center bg-white p-12 rounded-[40px] shadow-2xl border-2 border-purple-50 max-w-md">
                            <div className="text-7xl mb-6 animate-float">🧙‍♂️</div>
                            <h2 className="text-3xl font-bold font-fredoka text-gray-900 mb-4">Magic Awaits!</h2>
                            <p className="text-gray-600 mb-8 text-lg">Please sign in to access the magic credit store and start creating your own adventures.</p>
                            <SignInButton mode="modal">
                                <button className="w-full bg-story-purple hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-purple-100 transition-all transform hover:scale-105 active:scale-95 text-lg">
                                    Sign In to Enter ✨
                                </button>
                            </SignInButton>
                        </div>
                    </div>
                </SignedOut>
            </main>
            <Footer />
        </div>
    );
}

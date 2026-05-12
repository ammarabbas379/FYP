"use client";

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCredits } from '../context/CreditsProvider';
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
    const [selectedPackage, setSelectedPackage] = useState<string>('popular');
    const [showCheckout, setShowCheckout] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [purchasedAmount, setPurchasedAmount] = useState(0);
    const [error, setError] = useState('');

    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    const handleSelectPackage = (pkgId: string) => {
        setSelectedPackage(pkgId);
        setShowCheckout(true);
        setError('');
    };

    const closeCheckout = () => {
        setShowCheckout(false);
        setError('');
    };

    const selectedPkg = CREDIT_PACKAGES.find(p => p.id === selectedPackage);

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
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            {CREDIT_PACKAGES.map((pkg, index) => (
                                <button
                                    key={pkg.id}
                                    onClick={() => handleSelectPackage(pkg.id)}
                                    className={`relative bg-white rounded-3xl p-8 transition-all duration-300 text-left group cursor-pointer
                                        animate-fade-in-up
                                        ${selectedPackage === pkg.id
                                            ? `ring-4 ring-purple-400 ring-offset-4 shadow-2xl ${pkg.bgGlow} scale-[1.03]`
                                            : 'shadow-xl hover:shadow-2xl hover:scale-[1.02]'
                                        }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Popular badge */}
                                    {pkg.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                            ⭐ MOST POPULAR
                                        </div>
                                    )}

                                    {/* Package icon */}
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center text-3xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                        {pkg.emoji}
                                    </div>

                                    {/* Package name */}
                                    <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-1">
                                        {pkg.name}
                                    </h3>

                                    {/* Credits count */}
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-4xl font-bold font-fredoka text-gray-900">
                                            {pkg.credits}
                                        </span>
                                        <span className="text-gray-500 text-lg">credits</span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-3xl font-bold text-story-purple font-fredoka">
                                            ${pkg.price.toFixed(2)}
                                        </span>
                                        <span className="text-gray-400 text-sm">USD</span>
                                    </div>

                                    {/* Per credit price */}
                                    <p className="text-sm text-gray-400">
                                        ${pkg.perCredit} per story
                                    </p>

                                    {/* Buy button hint */}
                                    <div className={`mt-5 w-full py-3 rounded-2xl text-center font-bold font-fredoka text-sm transition-all
                                        ${selectedPackage === pkg.id
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600'
                                        }`}>
                                        {selectedPackage === pkg.id ? '✨ Selected — Click to Pay' : 'Select Pack'}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* PayPal Checkout Modal Overlay */}
                        {showCheckout && paypalClientId && selectedPkg && (
                            <div
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                                onClick={closeCheckout}
                            >
                                {/* Backdrop */}
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

                                {/* Modal */}
                                <div
                                    className="relative bg-white rounded-3xl shadow-2xl border-2 border-purple-100 w-full max-w-md z-10 flex flex-col"
                                    style={{ maxHeight: '90vh' }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Close button — stays on top */}
                                    <button
                                        onClick={closeCheckout}
                                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-20"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    {/* Scrollable content */}
                                    <div className="overflow-y-auto p-8 flex-1">
                                        {/* Package summary */}
                                        <div className="text-center mb-6">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedPkg.color} flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg`}>
                                                {selectedPkg.emoji}
                                            </div>
                                            <h3 className="text-2xl font-bold font-fredoka text-gray-800">
                                                {selectedPkg.name}
                                            </h3>
                                            <div className="flex items-center justify-center gap-2 mt-2">
                                                <span className="text-3xl font-bold text-story-purple font-fredoka">
                                                    {selectedPkg.credits}
                                                </span>
                                                <span className="text-gray-500">credits for</span>
                                                <span className="text-3xl font-bold text-gray-900 font-fredoka">
                                                    ${selectedPkg.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-1">
                                                ${selectedPkg.perCredit} per story
                                            </p>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent mb-6" />

                                        {/* Error inside modal */}
                                        {error && (
                                            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 text-center">
                                                <p className="text-red-600 text-sm">{error}</p>
                                            </div>
                                        )}

                                        {/* PayPal Buttons */}
                                        <PayPalScriptProvider
                                            options={{
                                                clientId: paypalClientId,
                                                currency: "USD",
                                            }}
                                        >
                                            <PayPalButtons
                                                key={selectedPackage}
                                                style={{
                                                    layout: "vertical",
                                                    color: "blue",
                                                    shape: "pill",
                                                    label: "pay",
                                                    height: 50,
                                                }}
                                                createOrder={async () => {
                                                    setError('');
                                                    const res = await fetch('/api/paypal/create-order', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ packageId: selectedPackage }),
                                                    });
                                                    const data = await res.json();
                                                    if (!res.ok) {
                                                        throw new Error(data.error || 'Failed to create order');
                                                    }
                                                    return data.orderID;
                                                }}
                                                onApprove={async (data) => {
                                                    const res = await fetch('/api/paypal/capture-order', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            orderID: data.orderID,
                                                            packageId: selectedPackage,
                                                        }),
                                                    });
                                                    const result = await res.json();
                                                    if (res.ok && result.success) {
                                                        setShowCheckout(false);
                                                        setPurchasedAmount(result.purchased);
                                                        setPurchaseSuccess(true);
                                                        await refreshCredits();
                                                    } else {
                                                        setError(result.error || 'Payment processing failed');
                                                    }
                                                }}
                                                onError={(err) => {
                                                    console.error('PayPal error:', err);
                                                    setError('Payment failed. Please try again.');
                                                }}
                                                onCancel={() => {
                                                    setError('Payment cancelled. No charges were made.');
                                                }}
                                            />
                                        </PayPalScriptProvider>

                                        {/* Secure badge */}
                                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Secure payment powered by PayPal
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                </SignedIn>

                {/* Not signed in */}
                <SignedOut>
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center bg-white p-12 rounded-3xl shadow-xl border-2 border-purple-50 max-w-md">
                            <div className="text-6xl mb-6 animate-bounce">🔐</div>
                            <h2 className="text-2xl font-bold font-fredoka text-gray-900 mb-4">Login Required</h2>
                            <p className="text-gray-600 mb-8">Please sign in to access the credit store and start creating magical stories.</p>
                            <SignInButton mode="modal">
                                <button className="w-full bg-story-purple hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105">
                                    Sign In Now
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

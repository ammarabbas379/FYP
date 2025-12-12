"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

export default function CreateStoryPage() {
    const [storyType, setStoryType] = useState<string>('story-book');
    const [ageGroup, setAgeGroup] = useState<string>('3-5');
    const [imageStyle, setImageStyle] = useState<string>('3d-cartoon');

    const storyTypes = [
        { id: 'story-book', label: 'Story Book', color: 'from-purple-500 to-indigo-600', image: '/images/story-book-cover.jpg' },
        { id: 'bed-story', label: 'Bed Story', color: 'from-blue-400 to-cyan-500', image: '/images/bed-story.jpg' },
        { id: 'educational', label: 'Educational', color: 'from-emerald-400 to-teal-500', image: '/images/educational.jpg' },
    ];

    const ageGroups = [
        { id: '3-5', label: '3-5 Years', color: 'from-rose-400 to-pink-500', image: '/images/age-0-2.jpg' },
        { id: '6-8', label: '6-8 Years', color: 'from-orange-400 to-red-500', image: '/images/age-3-5.jpg' },
        { id: '9-12', label: '9-12 Years', color: 'from-amber-400 to-orange-500', image: '/images/age-5-8.jpg' },
    ];

    const imageStyles = [
        { id: '3d-cartoon', label: '3D Cartoon', color: 'from-blue-400 to-indigo-500', image: '/images/style-3d-cartoon.jpg' },
        { id: 'paper-cut', label: 'Paper Cut', color: 'from-teal-400 to-emerald-500', image: '/images/paper-cut.jpg' },
        { id: 'watercolor', label: 'Watercolor', color: 'from-purple-400 to-fuchsia-500', image: '/images/watercolor-style.jpg' },
    ];

    return (
        <div className="min-h-screen font-poppins bg-story-lavender">
            <Header />
            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <SignedIn>
                    <div className="max-w-6xl mx-auto">
                        {/* Header Section */}
                        <div className="text-center mb-12 animate-fade-in-up">
                            <h1 className="text-4xl sm:text-5xl font-bold font-fredoka text-gray-900 mb-4">
                                Create Your <span className="text-story-purple">Magic Story</span> 📖
                            </h1>
                            <p className="text-lg text-gray-600">
                                Fill in the details below and watch your story come to life!
                            </p>
                        </div>

                        {/* Top Section Grid: Subject (Left) and Story Type (Right) */}
                        <div className="grid lg:grid-cols-12 gap-8 mb-12">
                            {/* Story Input - Left Side (Col Span 5) */}
                            <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-xl animate-fade-in-up animation-delay-100 flex flex-col h-full min-h-[400px]">
                                <label className="block text-2xl font-bold font-fredoka text-gray-800 mb-6">
                                    1. Subject of the Story
                                </label>
                                <textarea
                                    className="w-full h-full p-6 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-story-purple focus:ring-4 focus:ring-purple-100 transition-all text-lg resize-none placeholder-gray-400 outline-none flex-grow"
                                    placeholder="Write the subject of the story you want to generate..."
                                ></textarea>
                                <div className="text-right mt-2 text-gray-400 text-sm">
                                    <svg className="w-4 h-4 inline-block ml-auto" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                </div>
                            </div>

                            {/* Story Type - Right Side (Col Span 7) */}
                            <div className="lg:col-span-7 animate-fade-in-up animation-delay-200">
                                <label className="block text-2xl font-bold font-fredoka text-gray-800 mb-6">
                                    2. Story Type
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {storyTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setStoryType(type.id)}
                                            className={`relative aspect-[3/4] rounded-3xl overflow-hidden transition-all duration-300 group ${storyType === type.id
                                                ? 'ring-4 ring-blue-500 ring-offset-4 shadow-xl scale-[1.02]'
                                                : 'hover:shadow-lg hover:scale-[1.02]'
                                                }`}
                                        >
                                            {/* Background Image / Placeholder */}
                                            {type.image ? (
                                                <Image
                                                    src={type.image}
                                                    alt={type.label}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} transition-transform duration-500 group-hover:scale-110`}>

                                                </div>
                                            )}

                                            {/* Gradient Overlay for Text */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                            {/* Label */}
                                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                                <span className="text-xl font-bold text-white font-fredoka drop-shadow-md">
                                                    {type.label}
                                                </span>
                                            </div>

                                            {/* Selection Indicator (Icon) */}
                                            {storyType === type.id && (
                                                <div className="absolute top-3 right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce-short">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Selections Grid for remaining items: Age Group and Image Style side-by-side */}
                        <div className="grid lg:grid-cols-12 gap-8 mb-12">
                            {/* Age Group */}
                            <div className="lg:col-span-7 animate-fade-in-up animation-delay-300">
                                <label className="block text-2xl font-bold font-fredoka text-gray-800 mb-6">
                                    3. Age Group
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {ageGroups.map((age) => (
                                        <button
                                            key={age.id}
                                            onClick={() => setAgeGroup(age.id)}
                                            className={`relative aspect-[3/4] rounded-3xl overflow-hidden transition-all duration-300 group ${ageGroup === age.id
                                                ? 'ring-4 ring-blue-500 ring-offset-4 shadow-xl scale-[1.02]'
                                                : 'hover:shadow-lg hover:scale-[1.02]'
                                                }`}
                                        >
                                            {/* Background Image / Placeholder */}
                                            {age.image ? (
                                                <Image
                                                    src={age.image}
                                                    alt={age.label}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className={`absolute inset-0 bg-gradient-to-br ${age.color || 'from-gray-300 to-gray-400'} transition-transform duration-500 group-hover:scale-110`}>

                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                                <span className="text-xl font-bold text-white font-fredoka drop-shadow-md">
                                                    {age.label}
                                                </span>
                                            </div>
                                            {ageGroup === age.id && (
                                                <div className="absolute top-3 right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce-short">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Image Style */}
                            <div className="lg:col-span-5 animate-fade-in-up animation-delay-400">
                                <label className="block text-2xl font-bold font-fredoka text-gray-800 mb-6">
                                    4. Cover Book Image
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {imageStyles.map((style) => (
                                        <button
                                            key={style.id}
                                            onClick={() => setImageStyle(style.id)}
                                            className={`relative aspect-[3/4] rounded-3xl overflow-hidden transition-all duration-300 group ${imageStyle === style.id
                                                ? 'ring-4 ring-blue-500 ring-offset-4 shadow-xl scale-[1.02]'
                                                : 'hover:shadow-lg hover:scale-[1.02]'
                                                }`}
                                        >
                                            {/* Background Image / Placeholder */}
                                            {style.image ? (
                                                <Image
                                                    src={style.image}
                                                    alt={style.label}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className={`absolute inset-0 bg-gradient-to-br ${style.color || 'from-gray-300 to-gray-400'} transition-transform duration-500 group-hover:scale-110`}>

                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                                <span className="text-xl font-bold text-white font-fredoka drop-shadow-md">
                                                    {style.label}
                                                </span>
                                            </div>
                                            {imageStyle === style.id && (
                                                <div className="absolute top-3 right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce-short">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <div className="flex justify-end animate-fade-in-up animation-delay-500">
                            <button className="bg-story-gold hover:bg-yellow-400 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl shadow-yellow-200 hover:shadow-yellow-300 transition-all transform hover:-translate-y-1 active:translate-y-0 glow-hover flex items-center gap-3">
                                <span>✨</span> Generate Story
                            </button>
                        </div>
                    </div>
                </SignedIn>

                <SignedOut>
                    <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in-up">
                        <div className="bg-white rounded-3xl p-10 shadow-xl border-2 border-purple-50">
                            <div className="flex justify-center mb-6 animate-float-slow">
                                <Image
                                    src="/images/magic-illustration.png"
                                    alt="Join the magic"
                                    width={180}
                                    height={180}
                                    className="mix-blend-multiply"
                                />
                            </div>
                            <h2 className="text-3xl font-bold font-fredoka text-gray-900 mb-4">
                                Join the Magic! ✨
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 font-poppins">
                                You need to be signed in to create your own magical stories. It only takes a second to start your adventure!
                            </p>
                            <SignInButton mode="modal">
                                <button className="bg-story-purple hover:bg-purple-700 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg shadow-purple-200 hover:shadow-purple-400 transition-all transform hover:-translate-y-1 active:translate-y-0">
                                    Sign In to Create
                                </button>
                            </SignInButton>
                        </div>
                    </div>
                </SignedOut>
            </main>
            <Footer />
        </div >
    );
}

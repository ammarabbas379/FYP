"use client"; // This page has many interactive buttons and choices

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { globalLoader } from '../../components/GenerateLoader';
import { useCredits } from '../../_features/credits/CreditsProvider';

import { checkStorySubject } from '../../utils/contentFilter';

// This is the main page where users customize and create their story
export default function CreateStoryPage() {
    const router = useRouter();
    const { credits, deductCredit, refreshCredits } = useCredits();

    // These states keep track of what the user clicks on (Story type, Age, and Art style)
    const [storySubject, setStorySubject] = useState<string>('');
    const [storyType, setStoryType] = useState<string>('story-book');
    const [ageGroup, setAgeGroup] = useState<string>('3-5');
    const [imageStyle, setImageStyle] = useState<string>('3d-cartoon');
    const [loading, setLoading] = useState<boolean>(false);
    const [subjectError, setSubjectError] = useState<string | null>(null);

    // These lists define the different choices the user can make
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

    const handleGenerateStory = async () => {
        setSubjectError(null);

        if (!storySubject) {
            setSubjectError('Please enter a subject for your story!');
            return;
        }

        // Kid-friendly check
        const filterResult = checkStorySubject(storySubject);
        if (!filterResult.isFriendly) {
            setSubjectError(filterResult.reason || 'Please keep the story subject friendly!');
            return;
        }

        // Check if user has enough credits
        if (credits !== null && credits < 1) {
            alert('You need at least 1 credit to generate a story. Please buy more credits!');
            router.push('/buy-credits');
            return;
        }

        setLoading(true);
        globalLoader.show("Crafting your magical story...");
        try {
            // Deduct 1 credit before generating
            const deducted = await deductCredit(`Generated story: ${storySubject}`);
            if (!deducted) {
                alert('Insufficient credits! Please buy more credits to continue.');
                router.push('/buy-credits');
                return;
            }

            const response = await fetch('/api/generate-story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    storySubject,
                    storyType,
                    ageGroup,
                    imageStyle
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', errorData);
                throw new Error(errorData.details || errorData.error || 'Failed to generate story');
            }

            const data = await response.json();
            router.push(`/view-story/${data.storyId}`);

        } catch (error: any) {
            console.error('Error:', error);
            alert('Something went wrong: ' + error.message);
            // Refresh credits in case deduction happened but generation failed
            await refreshCredits();
        } finally {
            globalLoader.hide();
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-poppins bg-story-lavender text-black">
            <Header />
            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">

                {/* Section only visible if the user IS logged in */}
                <SignedIn>
                    <div className="max-w-6xl mx-auto">
                        {/* Title of the page */}
                        <div className="text-center mb-12 animate-fade-in-up">
                            <h1 className="text-4xl sm:text-5xl font-bold font-fredoka text-gray-900 mb-4">
                                Create Your <span className="text-story-purple">Magic Story</span> 📖
                            </h1>
                            <p className="text-lg text-gray-600">
                                Fill in the details below and watch your story come to life!
                            </p>
                        </div>

                        {/* Top Choices Grid: Subject and Story Type */}
                        <div className="grid lg:grid-cols-12 gap-8 mb-12">
                            {/* 1. The input box where users type their story idea */}
                            <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-xl animate-fade-in-up animation-delay-100 flex flex-col h-full min-h-[400px]">
                                <label htmlFor="subject" className="block text-2xl font-bold font-fredoka text-gray-800 mb-6">
                                    1. Subject of the Story
                                </label>
                                <textarea
                                    id="subject"
                                    value={storySubject}
                                    onChange={(e) => {
                                        setStorySubject(e.target.value);
                                        if (subjectError) setSubjectError(null);
                                    }}
                                    className={`w-full h-full p-6 rounded-2xl bg-gray-50 border-2 transition-all text-lg resize-none placeholder-gray-400 outline-none flex-grow ${subjectError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-100 focus:border-story-purple focus:ring-4 focus:ring-purple-100'}`}
                                    placeholder="Write the subject of the story you want to generate..."
                                ></textarea>
                                {subjectError && (
                                    <p className="mt-3 text-red-500 text-sm font-medium animate-shake">
                                        ⚠️ {subjectError}
                                    </p>
                                )}
                            </div>

                            {/* 2. Selecting what kind of story it is */}
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
                                            {/* Preview image for the story type */}
                                            {type.image && (
                                                <Image
                                                    src={type.image}
                                                    alt={type.label}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                                <span className="text-xl font-bold text-white font-fredoka drop-shadow-md">
                                                    {type.label}
                                                </span>
                                            </div>
                                            {/* Small animated checkmark when selected */}
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

                        {/* Middle Choices Grid: Age Group and Art Style */}
                        <div className="grid lg:grid-cols-12 gap-8 mb-12">
                            {/* 3. Selecting the Age Group */}
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
                                            {age.image && (
                                                <Image
                                                    src={age.image}
                                                    alt={age.label}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
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

                            {/* 4. Selecting the Art Style for the book cover */}
                            <div className="lg:col-span-5 animate-fade-in-up animation-delay-400">
                                <label className="block text-2xl font-bold font-fredoka text-gray-800 mb-6">
                                    4. Book Image Style
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
                                            {style.image && (
                                                <Image
                                                    src={style.image}
                                                    alt={style.label}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
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

                        {/* Credit balance indicator + Generate Button at the bottom */}
                        <div className="flex items-center justify-between animate-fade-in-up animation-delay-500">
                            {/* Credit balance info */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-full px-5 py-3">
                                    <div className="relative w-7 h-7">
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
                                    <span className="text-amber-600 text-sm">credits left</span>
                                </div>
                                {credits !== null && credits < 3 && (
                                    <Link
                                        href="/buy-credits"
                                        className="text-story-purple hover:text-purple-700 font-semibold text-sm underline underline-offset-2"
                                    >
                                        Buy more →
                                    </Link>
                                )}
                            </div>

                            <button
                                onClick={handleGenerateStory}
                                disabled={loading || (credits !== null && credits < 1)}
                                className={`bg-story-purple hover:bg-purple-700 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl shadow-purple-200 hover:shadow-purple-400 transition-all transform hover:-translate-y-1 active:translate-y-0 glow-hover flex items-center gap-3 ${loading || (credits !== null && credits < 1) ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Generating Magic...
                                    </>
                                ) : (credits !== null && credits < 1) ? (
                                    <>
                                        <span>🔒</span> No Credits
                                    </>
                                ) : (
                                    <>
                                        <span>Generate Story (1 credit)</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </SignedIn>

                {/* Section visible ONLY if the user is NOT logged in */}
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
                            {/* Shows a popup for the user to sign in */}
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

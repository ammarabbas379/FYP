"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

interface Story {
    id: number;
    storyId: string;
    storySubject: string | null;
    storyType: string | null;
    ageGroup: string | null;
    imageStyle: string | null;
    title?: string | null;
    coverImage: string | null;
    userEmail: string | null;
    userName: string | null;
    userImage: string | null;
    createdAt: Date | null;
}

interface ExploreContentProps {
    allStories: Story[];
    userEmail: string | undefined;
}

export default function ExploreContent({ allStories, userEmail }: ExploreContentProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

    // Filter stories based on active tab
    const displayStories = activeTab === 'all' 
        ? allStories 
        : allStories.filter(story => story.userEmail === userEmail);

    return (
        <div className="min-h-screen font-poppins bg-story-lavender text-black">
            <Header />
            
            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <SignedIn>
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="text-center mb-12 animate-fade-in-up">
                        <h1 className="text-4xl sm:text-5xl font-bold font-fredoka text-gray-900 mb-4">
                            Explore <span className="text-story-purple">Magical Stories</span> 🌟
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover wonderful tales created by our community, or revisit the magical adventures you've created yourself.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center mb-10 animate-fade-in-up animation-delay-100">
                        <div className="bg-white rounded-full p-1 shadow-md inline-flex">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-8 py-3 rounded-full text-lg font-bold font-fredoka transition-all ${
                                    activeTab === 'all' 
                                        ? 'bg-story-purple text-white shadow-lg' 
                                        : 'text-gray-600 hover:text-story-purple hover:bg-purple-50'
                                }`}
                            >
                                Community Stories
                            </button>
                            {userEmail && (
                                <button
                                    onClick={() => setActiveTab('my')}
                                    className={`px-8 py-3 rounded-full text-lg font-bold font-fredoka transition-all ${
                                        activeTab === 'my' 
                                            ? 'bg-story-purple text-white shadow-lg' 
                                            : 'text-gray-600 hover:text-story-purple hover:bg-purple-50'
                                    }`}
                                >
                                    My Stories
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stories Grid */}
                    {displayStories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in-up animation-delay-200">
                            {displayStories.map((story) => (
                                <Link 
                                    href={`/view-story/${story.storyId}`} 
                                    key={story.id}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-200 flex flex-col h-full"
                                >
                                    {/* Cover Image Placeholder or Actual Image */}
                                    <div className="relative aspect-[4/3] bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden">
                                        {story.coverImage ? (
                                            <img 
                                                src={story.coverImage} 
                                                alt={story.title || 'Story Cover'} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-story-purple flex flex-col items-center justify-center p-6 text-center">
                                                <div className="absolute inset-0 opacity-10 bg-[url('/images/magic-pattern.png')] bg-repeat bg-center pointer-events-none"></div>
                                                <div className="z-10 flex flex-col items-center w-full">
                                                    <div className="text-4xl mb-3">📖</div>
                                                    <h3 className="text-lg font-fredoka font-bold text-white leading-tight mb-2 line-clamp-2">
                                                        {story.title || story.storySubject || 'Untitled Story'}
                                                    </h3>
                                                    <div className="w-8 h-0.5 bg-story-gold mx-auto rounded-full mb-2"></div>
                                                    <p className="text-xs text-story-gold font-bold uppercase tracking-wider">
                                                        StoryNest AI
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Content Info */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="font-fredoka text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                            {story.title || story.storySubject || 'Untitled Story'}
                                        </h3>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {story.ageGroup && (
                                                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full">
                                                    {story.ageGroup} yrs
                                                </span>
                                            )}
                                            {story.imageStyle && (
                                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                                    {story.imageStyle.replace('-', ' ')}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">
                                                    {(story.userName || 'A').charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-gray-600 truncate max-w-[120px]">
                                                    {story.userName || 'Anonymous'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'New'}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-md border border-gray-100">
                            <span className="text-6xl block mb-4">📭</span>
                            <h3 className="text-2xl font-bold font-fredoka text-gray-800 mb-2">
                                No stories found
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {activeTab === 'all' 
                                    ? "It's quiet here. Be the first to create a story!" 
                                    : "You haven't created any stories yet."}
                            </p>
                            <Link 
                                href="/create-story"
                                className="inline-block bg-story-gold hover:bg-yellow-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1"
                            >
                                Create a Story ✨
                            </Link>
                        </div>
                    )}
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
                                You need to be signed in to explore magical stories from the community and revisit your own adventures!
                            </p>
                            <SignInButton mode="modal">
                                <button className="bg-story-purple hover:bg-purple-700 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg shadow-purple-200 hover:shadow-purple-400 transition-all transform hover:-translate-y-1 active:translate-y-0">
                                    Sign In to Explore
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

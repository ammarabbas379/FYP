"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { PageFlip } from 'page-flip';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import StoryQuiz from '@/app/components/StoryQuiz';

interface BookDisplayProps {
    story: {
        id: number;
        storyId: string;
        storySubject: string | null;
        storyType: string | null;
        ageGroup: string | null;
        imageStyle: string | null;
        output: any;
        coverImage: string | null;
    };
}

export default function BookDisplay({ story }: BookDisplayProps) {
    const bookRef = useRef<HTMLDivElement>(null);
    const [pageFlipEnabled, setPageFlipEnabled] = useState(false);
    const pageFlipRef = useRef<PageFlip | null>(null);

    // Audio State
    const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle');
    const [audioErrorMsg, setAudioErrorMsg] = useState<string>('');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioStopRef = useRef<boolean>(true);

    // Auto Page Turn Tracking
    const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
    const latestRequestedIndexRef = useRef(0);
    const prefetchCacheRef = useRef<Record<number, string>>({});

    const storyContent = story.output;

    const playlistTexts = useMemo(() => {
        if (!storyContent) return [];
        const texts: string[] = [];
        texts.push(`${storyContent.title}. A Magical Adventure. Written by StoryNest AI.`);

        if (storyContent.chapters && Array.isArray(storyContent.chapters)) {
            storyContent.chapters.forEach((c: any, index: number) => {
                texts.push(`Chapter ${index + 1}. ${c.chapterTitle || ''}. ${c.content}`);
            });
        } else if (typeof storyContent === 'string') {
            texts.push(storyContent);
        }
        texts.push("The End. Your magical journey may have ended, but its memory will spark forever.");
        return texts;
    }, [storyContent]);

    useEffect(() => {
        return () => {
            audioStopRef.current = true;
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
            }
            Object.values(prefetchCacheRef.current).forEach(url => {
                if (url.startsWith('blob:')) URL.revokeObjectURL(url);
            });
        };
    }, []);

    const generateAudioForText = async (text: string) => {
        const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': '9a7db35a2b769ac22a7ed8ce855d3c8dbd47e5900c5148d980f0bd5aff048ffa',
            },
            body: JSON.stringify({
                text: text.slice(0, 5000), // Safety clip
                model_id: 'eleven_multilingual_v2',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("ElevenLabs API Error:", errorData);
            throw new Error("Failed to generate audio.");
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };

    const playChunk = async (indexToPlay: number) => {
        latestRequestedIndexRef.current = indexToPlay;
        audioStopRef.current = false;

        try {
            if (audioRef.current) {
                audioRef.current.pause();
            }

            setAudioState('loading');
            setAudioErrorMsg('');

            let url = prefetchCacheRef.current[indexToPlay];
            if (!url) {
                url = await generateAudioForText(playlistTexts[indexToPlay]);
                prefetchCacheRef.current[indexToPlay] = url;
            }

            if (latestRequestedIndexRef.current !== indexToPlay) return;
            if (audioStopRef.current) return;

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                if (audioStopRef.current) return;
                if (indexToPlay < playlistTexts.length - 1) {
                    const targetPage = indexToPlay === 0 ? 1 : (indexToPlay * 2 + 1);
                    // This page flip triggers the on('flip') event, progressing the loop automatically!
                    pageFlipRef.current?.flip(targetPage);
                } else {
                    setAudioState('idle');
                }
            };

            audio.onerror = () => {
                if (!audioStopRef.current) {
                    setAudioState('error');
                    setAudioErrorMsg('Failed to play audio');
                }
            };

            await audio.play();
            setAudioState('playing');

            // Prefetch next chunk
            if (indexToPlay < playlistTexts.length - 1) {
                const nextIndex = indexToPlay + 1;
                if (!prefetchCacheRef.current[nextIndex]) {
                    generateAudioForText(playlistTexts[nextIndex]).then(nUrl => {
                        prefetchCacheRef.current[nextIndex] = nUrl;
                    }).catch(console.error);
                }
            }
        } catch (error: any) {
            if (!audioStopRef.current) {
                setAudioState('error');
                setAudioErrorMsg(error.message || 'Something went wrong');
            }
        }
    };

    // React to manual or auto page turns
    useEffect(() => {
        // If they were actively listening, restart narration on the new page automatically
        if (audioState === 'playing' || audioState === 'loading') {
            playChunk(currentAudioIndex);
        } else if (audioState === 'paused') {
            // If they manually flip while paused, reset to idle so they can press play fresh on the new page
            setAudioState('idle');
            audioStopRef.current = true;
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAudioIndex]);

    // Blocks ALL pointer/touch events from reaching PageFlip (which intercepts at mousedown/pointerdown level)
    const blockFlip = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const handleListenClick = () => {
        if (audioState === 'loading') return;

        if (audioState === 'playing') {
            audioStopRef.current = true;
            audioRef.current?.pause();
            setAudioState('paused');
            return;
        }

        if (audioState === 'paused' && audioRef.current) {
            audioStopRef.current = false;
            audioRef.current.play().then(() => setAudioState('playing')).catch(() => setAudioState('error'));
            return;
        }

        // Resumes exactly on the current chunk if idle/error
        playChunk(currentAudioIndex);
    };

    useEffect(() => {
        console.log('BookDisplay: Story Content:', storyContent);
        if (typeof window !== 'undefined' && bookRef.current) {
            console.log('BookDisplay: Initializing PageFlip...');

            const timer = setTimeout(() => {
                try {
                    const pageFlip = new PageFlip(bookRef.current!, {
                        width: 550,
                        height: 733,
                        size: "stretch",
                        minWidth: 315,
                        maxWidth: 800,
                        minHeight: 420,
                        maxHeight: 1100,
                        maxShadowOpacity: 0.5,
                        showCover: true,
                        mobileScrollSupport: false,
                        usePortrait: false, // Double page spread on desktop
                        startZIndex: 0,
                        flippingTime: 1000,
                        drawShadow: true,
                        clickEventForward: false,
                        disableFlipByClick: true,
                    });

                    pageFlipRef.current = pageFlip;

                    pageFlip.on('flip', (e: any) => {
                        const newAudioIndex = Math.floor((e.data + 1) / 2);
                        setCurrentAudioIndex(newAudioIndex);
                    });

                    const pages = bookRef.current!.querySelectorAll('.page-content');
                    console.log('BookDisplay: Found pages:', pages.length);

                    if (pages.length > 0) {
                        pageFlip.loadFromHTML(pages as any);
                        console.log('BookDisplay: PageFlip loaded successfully');
                    }

                    setPageFlipEnabled(true);
                } catch (err) {
                    console.error('BookDisplay: Failed to initialize PageFlip:', err);
                    setPageFlipEnabled(true);
                }
            }, 500);

            return () => {
                clearTimeout(timer);
                if (pageFlipRef.current) {
                    pageFlipRef.current.destroy();
                }
            };
        }
    }, [storyContent]);

    return (
        <div className="min-h-screen bg-story-lavender font-poppins text-black flex flex-col">
            <Header />

            <main className="flex-grow pt-28 pb-12 flex flex-col items-center justify-center px-4 overflow-hidden relative">
                {/* Book Container with defined minimum height */}
                <div className="relative w-full max-w-6xl flex justify-center items-center min-h-[600px] perspective-2000">
                    {!pageFlipEnabled && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl z-50">
                            <div className="w-12 h-12 border-4 border-story-purple border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-fredoka font-bold text-story-purple">Opening your story...</p>
                        </div>
                    )}

                    <div
                        ref={bookRef}
                        className="book-container shadow-2xl rounded-sm"
                        style={{ opacity: pageFlipEnabled ? 1 : 0 }}
                    >
                        {/* 1. FRONT COVER */}
                        <div className="page-content bg-white" data-density="hard">
                            {/* Blank cover */}
                        </div>

                        {/* 2. CHAPTERS: IMAGE LEFT, TEXT RIGHT */}
                        {storyContent.chapters.map((chapter: any, index: number) => (
                            <React.Fragment key={index}>
                                {/* LEFT PAGE: IMAGE */}
                                <div className="page-content bg-white flex flex-col items-center justify-center p-8 border-r border-gray-100 shadow-inner">
                                    <div className="absolute inset-0 bg-[#F3F4F6] opacity-30 pointer-events-none"></div>
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                                        <img
                                            src="/images/story-placeholder.png"
                                            alt={chapter.chapterTitle}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                                            <p className="text-white text-xs font-medium italic leading-snug">
                                                {chapter.chapterDescription}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-[10px] text-gray-300 uppercase tracking-[0.2em]">Illustration</div>
                                </div>

                                {/* RIGHT PAGE: TEXT */}
                                <div className="page-content bg-[#fcf9f2] p-10 sm:p-14 flex flex-col shadow-inner overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>

                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-full bg-story-purple text-white flex items-center justify-center font-bold font-fredoka shadow-md shrink-0 text-xl">
                                            {index + 1}
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-bold font-fredoka text-gray-800 border-b-2 border-story-purple/20 pb-1">
                                            {chapter.chapterTitle || `Chapter ${index + 1}`}
                                        </h2>
                                    </div>

                                    <div className="flex-grow prose prose-lg text-gray-700 leading-relaxed font-poppins selection:bg-purple-100 text-lg">
                                        {chapter.content.split('\n').map((para: string, i: number) => (
                                            <p key={i} className="mb-6 first-letter:text-3xl first-letter:font-bold first-letter:text-story-purple">
                                                {para}
                                            </p>
                                        ))}
                                    </div>

                                    <div className="mt-2 flex justify-end">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleListenClick(); }}
                                            onMouseDown={blockFlip}
                                            onPointerDown={blockFlip}
                                            onTouchStart={blockFlip}
                                            disabled={audioState === 'loading'}
                                            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md ${audioState === 'loading' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                                                audioState === 'playing' ? 'bg-story-gold text-white' :
                                                    'bg-story-purple text-white hover:bg-indigo-600'
                                                }`}
                                        >
                                            {audioState === 'loading' ? (
                                                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                            ) : audioState === 'playing' ? '⏸️ Pause' : audioState === 'paused' ? '▶️ Resume' : '🔊 Listen'}
                                        </button>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center text-[10px] text-gray-400 font-medium italic">
                                        <span>Chapter {index + 1}</span>
                                        <span className="underline decoration-story-purple/30">Page {index * 2 + 2}</span>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}

                        {/* 4. QUIZ PAGES (2 questions per page) */}
                        {storyContent.quiz && storyContent.quiz.length > 0 && (
                            <>
                                {/* Quiz Page 1 (Questions 1-2) */}
                                <div className="page-content bg-[#fcf9f2] p-0 shadow-inner overflow-hidden">
                                    <StoryQuiz quiz={storyContent.quiz.slice(0, 2)} startIndex={0} />
                                </div>
                                {/* Quiz Page 2 (Questions 3-4) */}
                                <div className="page-content bg-[#fcf9f2] p-0 shadow-inner overflow-hidden">
                                    <StoryQuiz quiz={storyContent.quiz.slice(2, 4)} startIndex={2} />
                                </div>
                            </>
                        )}

                        {/* 5. BACK COVER */}
                        <div className="page-content bg-story-purple text-white flex flex-col items-center justify-center p-12 text-center" data-density="hard">
                            <div className="absolute inset-0 opacity-10 bg-[url('/images/magic-pattern.png')] bg-repeat bg-center pointer-events-none transform rotate-180"></div>
                            <div className="z-10">
                                <h3 className="text-4xl font-fredoka font-bold mb-6">The End</h3>
                                <div className="w-16 h-1 bg-story-gold mx-auto rounded-full mb-10"></div>
                                <p className="text-xl opacity-80 mb-12 max-w-xs mx-auto leading-relaxed">
                                    Your magical journey may have ended, but its memory will spark forever.
                                </p>
                                <Link
                                    href="/create-story"
                                    className="inline-flex items-center gap-3 bg-story-gold hover:bg-yellow-400 text-white font-bold py-4 px-10 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95"
                                >
                                    New Adventure ✨
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* SIDE NAVIGATION BUTTONS */}
                    <button
                        onClick={() => pageFlipRef.current?.flipPrev()}
                        aria-label="Previous Page"
                        className="absolute left-0 md:-left-16 lg:-left-24 z-50 p-4 rounded-full bg-white/80 backdrop-blur-md border border-purple-100 shadow-xl text-story-purple hover:bg-purple-50 transition-all transform hover:scale-110 active:scale-95 group hidden sm:flex items-center justify-center"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={() => pageFlipRef.current?.flipNext()}
                        aria-label="Next Page"
                        className="absolute right-0 md:-right-16 lg:-right-24 z-50 p-4 rounded-full bg-white/80 backdrop-blur-md border border-purple-100 shadow-xl text-story-purple hover:bg-purple-50 transition-all transform hover:scale-110 active:scale-95 group hidden sm:flex items-center justify-center"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Controls / Info */}
                <div className="mt-8 flex flex-col items-center gap-4 sm:hidden relative z-10">
                    <div className="flex items-center gap-6 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-purple-100 shadow-xl">
                        <button
                            onClick={() => pageFlipRef.current?.flipPrev()}
                            className="p-2 text-story-purple hover:bg-purple-50 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Flip Pages</span>
                        <button
                            onClick={() => pageFlipRef.current?.flipNext()}
                            className="p-2 text-story-purple hover:bg-purple-50 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-xs text-gray-700 font-bold uppercase tracking-widest animate-pulse relative z-10">
                    Click corners or use arrows for magic
                </p>
            </main>

            <Footer />

            <style jsx global>{`
                .book-container {
                    background: transparent;
                    display: block;
                    margin: 0 auto;
                }
                .page-content {
                    overflow: hidden;
                    box-shadow: inset 0 0 50px rgba(0,0,0,0.02);
                }
                @media (max-width: 1024px) {
                    .book-container {
                        transform: scale(0.9);
                    }
                }
                @media (max-width: 768px) {
                    .book-container {
                        transform: scale(0.7);
                    }
                }
            `}</style>
        </div >
    );
}

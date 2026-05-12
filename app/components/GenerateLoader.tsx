"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

type LoaderState = {
  isOpen: boolean;
  text?: string;
};

type Listener = (state: LoaderState) => void;

let listeners: Listener[] = [];

export const globalLoader = {
  show: (text?: string) => {
    listeners.forEach((listener) => listener({ isOpen: true, text }));
  },
  hide: () => {
    listeners.forEach((listener) => listener({ isOpen: false }));
  },
};

export default function GenerateLoader() {
  const [state, setState] = useState<LoaderState>({ isOpen: false });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const listener = (newState: LoaderState) => {
      setState(newState);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  if (!mounted || !state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-story-lavender/80 backdrop-blur-sm transition-opacity duration-500">
      <div className="relative flex flex-col items-center bg-white rounded-[40px] p-12 shadow-2xl border-4 border-story-purple-light max-w-md w-full mx-4 animate-fade-in-up">
        
        {/* Floating Sparkles in the background of the card */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[40px]">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-story-gold rounded-full opacity-0 animate-sparkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random()}s`,
              }}
            />
          ))}
        </div>

        {/* Magic Illustration */}
        <div className="relative w-48 h-48 animate-float-slow mb-6">
          <Image
            src="/images/magical-loader.png"
            alt="Magical Storybook Loader"
            fill
            className="object-contain mix-blend-multiply"
            priority
          />
        </div>

        {/* Status Text */}
        <div className="text-center relative z-10">
          <h2 className="text-3xl font-bold font-fredoka text-story-purple mb-4 drop-shadow-sm">
            {state.text || "Writing Magic..."}
          </h2>
          
          {/* Playful Loading Dots */}
          <div className="flex items-center justify-center space-x-3 mt-2">
            <div className="h-4 w-4 rounded-full bg-story-pink animate-bounce shadow-md" style={{ animationDelay: "0ms" }}></div>
            <div className="h-4 w-4 rounded-full bg-story-purple animate-bounce shadow-md" style={{ animationDelay: "150ms" }}></div>
            <div className="h-4 w-4 rounded-full bg-story-blue animate-bounce shadow-md" style={{ animationDelay: "300ms" }}></div>
            <div className="h-4 w-4 rounded-full bg-story-gold animate-bounce shadow-md" style={{ animationDelay: "450ms" }}></div>
          </div>
        </div>

      </div>
    </div>
  );
}

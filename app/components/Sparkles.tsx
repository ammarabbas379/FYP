import React from 'react';

const Sparkles = () => {
    // defined positions to avoid hydration mismatch
    const stars = [
        // Original stars
        { top: '-24px', left: '-16px', delay: '0s', size: 'w-8 h-8', color: 'text-yellow-300' },
        { top: '-12px', right: '-24px', delay: '0.5s', size: 'w-6 h-6', color: 'text-purple-300' },
        { bottom: '8px', right: '-32px', delay: '1s', size: 'w-5 h-5', color: 'text-story-gold' },

        // Additional stars for "more like 10 more"
        { top: '-30px', left: '20%', delay: '1.2s', size: 'w-5 h-5', color: 'text-blue-300' },
        { top: '-20px', right: '10%', delay: '0.7s', size: 'w-4 h-4', color: 'text-pink-300' },
        { bottom: '-15px', left: '10%', delay: '1.5s', size: 'w-6 h-6', color: 'text-yellow-200' },
        { bottom: '-10px', right: '30%', delay: '0.3s', size: 'w-4 h-4', color: 'text-purple-200' },
        { top: '50%', left: '-25px', delay: '0.8s', size: 'w-5 h-5', color: 'text-story-gold' },
        { top: '10%', right: '-35px', delay: '1.8s', size: 'w-4 h-4', color: 'text-blue-200' },
        { top: '-25px', left: '60%', delay: '0.2s', size: 'w-5 h-5', color: 'text-purple-400' },
        { bottom: '0px', left: '-20px', delay: '1.1s', size: 'w-4 h-4', color: 'text-pink-400' },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none">
            {stars.map((star, index) => (
                <div
                    key={index}
                    className={`absolute ${star.size} ${star.color} animate-sparkle`}
                    style={{
                        top: star.top,
                        bottom: star.bottom,
                        left: star.left,
                        right: star.right,
                        animationDelay: star.delay
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                </div>
            ))}
        </div>
    );
};

export default Sparkles;

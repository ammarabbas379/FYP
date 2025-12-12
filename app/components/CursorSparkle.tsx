'use client';

import { useEffect, useState } from 'react';

interface Sparkle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    opacity: number;
}

export default function CursorSparkle() {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);

    // Brand colors
    const colors = ['#9D4EDD', '#FF99C8', '#FFC8DD', '#E0AAFF', '#A2D2FF'];

    useEffect(() => {
        let animationFrameId: number;
        let lastTime = Date.now();

        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            // Throttle sparkle creation (create every 50ms)
            if (now - lastTime < 50) return;
            lastTime = now;

            const newSparkle: Sparkle = {
                id: Date.now() + Math.random(), // Unique ID using timestamp + random
                x: e.clientX,
                y: e.clientY,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 10 + 10, // Random size between 10-20px
                opacity: 1,
            };

            setSparkles((prev) => [...prev, newSparkle]);
        };

        // Animate and fade out sparkles
        const animate = () => {
            setSparkles((prev) =>
                prev
                    .map((sparkle) => ({
                        ...sparkle,
                        opacity: sparkle.opacity - 0.02, // Fade out
                        y: sparkle.y - 1, // Float up slightly
                    }))
                    .filter((sparkle) => sparkle.opacity > 0) // Remove faded sparkles
            );
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {sparkles.map((sparkle) => (
                <div
                    key={sparkle.id}
                    className="absolute"
                    style={{
                        left: sparkle.x,
                        top: sparkle.y,
                        width: sparkle.size,
                        height: sparkle.size,
                        opacity: sparkle.opacity,
                        transform: 'translate(-50%, -50%)',
                        transition: 'opacity 0.1s ease-out',
                    }}
                >
                    {/* Star shape */}
                    <svg
                        viewBox="0 0 24 24"
                        fill={sparkle.color}
                        style={{
                            filter: `drop-shadow(0 0 ${sparkle.size / 2}px ${sparkle.color})`,
                        }}
                    >
                        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                    </svg>
                </div>
            ))}
        </div>
    );
}

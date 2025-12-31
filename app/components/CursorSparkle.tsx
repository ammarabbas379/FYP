'use client'; // This component makes magic happen on the screen using the mouse

import { useEffect, useState } from 'react';

// This is what each individual sparkle looks like
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

    // These are the magical colors used for the sparkles
    const colors = ['#9D4EDD', '#FF99C8', '#FFC8DD', '#E0AAFF', '#A2D2FF'];

    useEffect(() => {
        let animationFrameId: number;
        let lastTime = Date.now();

        // This runs every time the user moves their mouse
        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            // We only create a new sparkle every 50 milliseconds so there aren't too many
            if (now - lastTime < 50) return;
            lastTime = now;

            const newSparkle: Sparkle = {
                id: Date.now() + Math.random(), // A unique name for each sparkle
                x: e.clientX,
                y: e.clientY,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 10 + 10, // Sparkles are randomly sized between 10 and 20 pixels
                opacity: 1, // They start fully visible
            };

            setSparkles((prev) => [...prev, newSparkle]);
        };

        // This makes the sparkles move up and fade away over time
        const animate = () => {
            setSparkles((prev) =>
                prev
                    .map((sparkle) => ({
                        ...sparkle,
                        opacity: sparkle.opacity - 0.02, // They get more see-through
                        y: sparkle.y - 1, // They float upwards slowly
                    }))
                    .filter((sparkle) => sparkle.opacity > 0) // Remove them when they are invisible
            );
            animationFrameId = requestAnimationFrame(animate);
        };

        // Listen for mouse movements on the whole window
        window.addEventListener('mousemove', handleMouseMove);
        animationFrameId = requestAnimationFrame(animate);

        // Clean up when the page is closed
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {sparkles.map((sparkle) => (
                // eslint-disable-next-line 
                <div
                    key={sparkle.id}
                    className="cursor-sparkle"
                    style={{
                        '--x': `${sparkle.x}px`,
                        '--y': `${sparkle.y}px`,
                        '--size': `${sparkle.size}px`,
                        '--opacity': sparkle.opacity,
                    } as React.CSSProperties}
                >
                    {/* The star shape itself */}
                    {/* eslint-disable-next-line */}
                    <svg
                        viewBox="0 0 24 24"
                        fill={sparkle.color}
                        className="cursor-sparkle-svg"
                        style={{
                            '--glow-size': `${sparkle.size / 2}px`,
                            '--color': sparkle.color,
                        } as React.CSSProperties}
                    >
                        {/* This path draws a five-pointed star */}
                        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                    </svg>
                </div>
            ))}
        </div>
    );
}

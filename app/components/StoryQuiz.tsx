"use client";

import React, { useState, useRef, useEffect } from 'react';

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface StoryQuizProps {
    quiz: QuizQuestion[];
    startIndex?: number;
}

export default function StoryQuiz({ quiz, startIndex = 0 }: StoryQuizProps) {
    const [answers, setAnswers] = useState<Record<number, string | null>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    // Stop all pointer/mouse events from reaching PageFlip
    const stopPropagation = (e: React.MouseEvent | React.PointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };

    // For touch events, also call preventDefault to block mobile scroll-triggered flips
    const stopTouchPropagation = (e: React.TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const handleOptionSelect = (index: number, option: string) => {
        if (answers[index]) return; // Prevent changing answer
        setAnswers(prev => ({ ...prev, [index]: option }));
    };

    if (!quiz || quiz.length === 0) return null;

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex flex-col p-6 sm:p-10 font-poppins text-gray-800"
            onMouseDown={stopPropagation}
            onMouseMove={stopPropagation}
            onMouseUp={stopPropagation}
            onPointerDown={stopPropagation}
            onPointerMove={stopPropagation}
            onPointerUp={stopPropagation}
            onTouchStart={stopTouchPropagation}
            onTouchEnd={stopTouchPropagation}
            onClick={stopPropagation}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <h2 className="text-2xl font-bold font-fredoka text-gray-800 border-b-2 border-story-purple/20 pb-1">
                        Story Quiz
                    </h2>
                </div>
                {Object.keys(answers).length > 0 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setAnswers({}); }}
                        className="text-xs font-bold text-story-purple hover:text-indigo-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                    >
                        <span>🔄</span> Retry
                    </button>
                )}
            </div>

            <div className="flex-grow space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                {quiz.map((q, qIndex) => (
                    <div key={qIndex} className="space-y-3">
                        <p className="font-bold text-lg text-story-purple">
                            {startIndex + qIndex + 1}. {q.question}
                        </p>
                        <div className="flex flex-col gap-2">
                            {q.options.map((option, oIndex) => {
                                const isSelected = answers[qIndex] === option;
                                const isCorrect = option === q.correctAnswer;
                                const showResult = answers[qIndex] !== undefined;
                                const label = String.fromCharCode(65 + oIndex); // A, B, C, D

                                let buttonClass = "w-full text-left p-3 rounded-xl border-2 transition-all duration-200 text-sm flex items-center gap-3 ";
                                if (!showResult) {
                                    buttonClass += "border-gray-100 hover:border-story-purple hover:bg-purple-50";
                                } else {
                                    if (isSelected && isCorrect) {
                                        buttonClass += "border-green-500 bg-green-50 text-green-700";
                                    } else if (isSelected && !isCorrect) {
                                        buttonClass += "border-red-500 bg-red-50 text-red-700";
                                    } else if (isCorrect) {
                                        buttonClass += "border-green-500 bg-green-50 text-green-700";
                                    } else {
                                        buttonClass += "border-gray-100 opacity-50";
                                    }
                                }

                                return (
                                    <button
                                        key={oIndex}
                                        onClick={(e) => { e.stopPropagation(); handleOptionSelect(qIndex, option); }}
                                        disabled={showResult}
                                        className={buttonClass}
                                    >
                                        <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-current text-white' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {label}
                                        </span>
                                        <div className="flex-grow flex items-center justify-between">
                                            <span>{option}</span>
                                            {showResult && isSelected && (
                                                <span>{isCorrect ? '✨' : '❌'}</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}

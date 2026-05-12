'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// FAQ data structure
const faqData = [
    {
        category: "General",
        questions: [
            {
                id: "q1",
                question: "What is StoryNest?",
                answer: "StoryNest is an AI-powered storytelling platform that turns your ideas into unique stories. Simply enter a prompt, and StoryNest generates engaging tales with creative narratives for endless storytelling adventures."
            },
            {
                id: "q2",
                question: "How does the AI story creation work?",
                answer: "We use advanced artificial intelligence models to process your inputs and weave them into a coherent, engaging story. Our system is specifically tuned to create safe, age-appropriate, and imaginative content for children."
            },
            {
                "id": "q3",
                "question": "Can I print the stories I create?",
                "answer": "No, stories cannot be printed. For more content and new adventures, visit the Explore Stories page anytime."
            }
        ]
    },
    {
        category: "Safety & Privacy",
        questions: [
            {
                id: "q4",
                question: "Is StoryNest safe for children?",
                answer: "Absolutely. Safety is our top priority. Our AI models are equipped with strict content filters to ensure every story is appropriate, kind, and educational. We do not allow the generation of scary or inappropriate content."
            },
            {
                id: "q5",
                question: "How do you handle my child's data?",
                answer: "We only collect the minimum information necessary to personalize stories, such as a first name and interests. We never sell this data to third parties. For more details, please see our Privacy Policy."
            }
        ]
    },
    {
        category: "Account & Billing",
        questions: [
            {
                "id": "q6",
                "question": "Do I need an account to create stories?",
                "answer": "Yes, you need to create an account to start generating personalized stories on StoryNest and access its storytelling features."
            },
            {
                "id": "q7",
                "question": "What are the subscription options?",
                "answer": "We offer both free and premium plans. Our free plan allows for a limited number of stories per month, while our premium 'Storyteller' plan offers unlimited stories, high-resolution illustrations, and priority support."
            }
        ]
    }
];

export default function FAQsPage() {
    const [openId, setOpenId] = useState<string | null>("q1");

    const toggleFaq = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="min-h-screen font-poppins bg-story-lavender flex flex-col">
            <Header />

            <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute top-20 left-0 w-96 h-96 bg-story-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 right-0 w-96 h-96 bg-story-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto relative z-10 max-w-4xl">
                    {/* Page Title */}
                    <div className="text-center mb-12 animate-fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-bold font-fredoka text-story-purple mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-gray-600">
                            Find answers to common questions about your magical journey.
                        </p>
                    </div>

                    {/* FAQ Accordion Section */}
                    <div className="space-y-12">
                        {faqData.map((category, catIndex) => (
                            <div key={catIndex} className="animate-fade-in-up" style={{ animationDelay: `${catIndex * 150}ms` }}>
                                <h2 className="text-2xl font-bold font-fredoka text-story-purple mb-6 pl-4 border-l-4 border-story-gold">
                                    {category.category}
                                </h2>
                                <div className="space-y-4">
                                    {category.questions.map((faq) => (
                                        <div
                                            key={faq.id}
                                            className={`bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 ${openId === faq.id ? 'border-story-purple ring-1 ring-story-purple/20 shadow-md' : 'border-purple-100 hover:border-story-purple/50'}`}
                                        >
                                            <button
                                                onClick={() => toggleFaq(faq.id)}
                                                className="w-full text-left px-6 py-5 flex items-center justify-between group"
                                            >
                                                <span className={`text-lg font-semibold font-fredoka transition-colors ${openId === faq.id ? 'text-story-purple' : 'text-gray-800 group-hover:text-story-purple'}`}>
                                                    {faq.question}
                                                </span>
                                                <span className={`flex-shrink-0 ml-4 transition-transform duration-300 ${openId === faq.id ? 'rotate-180 text-story-purple' : 'text-gray-400 group-hover:text-story-purple'}`}>
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </span>
                                            </button>

                                            <div
                                                className={`transition-all duration-300 ease-in-out ${openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                            >
                                                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-purple-50 pt-4">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Support CTA */}
                    <div className="mt-16 bg-gradient-to-r from-story-purple to-purple-600 rounded-3xl p-8 text-center text-white shadow-xl animate-fade-in-up">
                        <h3 className="text-2xl font-bold font-fredoka mb-2">Still have questions?</h3>
                        <p className="mb-6 opacity-90">We're here to help you make magic happen.</p>
                        <a
                            href="/contact-us"
                            className="inline-block bg-story-gold hover:bg-yellow-400 text-story-purple font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

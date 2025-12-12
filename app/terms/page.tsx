'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen font-poppins bg-story-lavender flex flex-col">
            <Header />

            <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-20 left-0 w-96 h-96 bg-story-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 right-0 w-96 h-96 bg-story-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto relative z-10 max-w-4xl">
                    {/* Page Header */}
                    <div className="text-center mb-12 animate-fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-bold font-fredoka text-story-purple mb-4">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-gray-600">
                            Last updated: December 9, 2025
                        </p>
                    </div>

                    {/* Terms Content */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-purple-100 animate-fade-in-up">
                        <div className="prose prose-lg max-w-none">

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold font-fredoka text-gray-900 mb-4">1. Acceptance of Terms</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    By accessing and using StoryNest ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold font-fredoka text-gray-900 mb-4">2. Description of Service</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    StoryNest is an AI-powered platform that enables users to create personalized stories for children. The Service uses artificial intelligence to generate creative content based on user inputs.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold font-fredoka text-gray-900 mb-4">3. User Accounts</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    To access certain features of the Service, you may be required to create an account. You are responsible for:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Maintaining the confidentiality of your account credentials</li>
                                    <li>All activities that occur under your account</li>
                                    <li>Notifying us immediately of any unauthorized use</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold font-fredoka text-gray-900 mb-4">4. Content Ownership</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Stories created using StoryNest are owned by you, the user. However, by using the Service, you grant StoryNest a non-exclusive, worldwide license to use, display, and distribute the content for the purpose of providing and improving the Service.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold font-fredoka text-gray-900 mb-4">5. Acceptable Use</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    You agree not to use the Service to:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                    <li>Create content that is harmful, offensive, or inappropriate for children</li>
                                    <li>Violate any applicable laws or regulations</li>
                                    <li>Infringe on the intellectual property rights of others</li>
                                    <li>Attempt to gain unauthorized access to the Service or its systems</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold font-fredoka text-gray-900 mb-4">6. Privacy</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Your use of the Service is also governed by our Privacy Policy. We are committed to protecting your privacy and the privacy of children using our platform.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold font-fredoka text-gray-900 mb-4">7. Limitation of Liability</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    StoryNest is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold font-fredoka text-gray-900 mb-4">8. Changes to Terms</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new terms on this page and updating the "Last updated" date.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-bold font-fredoka text-gray-900 mb-4">9. Contact Us</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    If you have any questions about these Terms of Service, please contact us at{' '}
                                    <Link href="/contact-us" className="text-story-purple font-semibold hover:underline">
                                        our contact page
                                    </Link>.
                                </p>
                            </section>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

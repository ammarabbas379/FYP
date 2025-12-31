'use client'; // Interaction (like typing in the form) happens here

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// This is the Contact Us page where users can send messages to the team
export default function ContactPage() {
    // This stores what the user types into the form
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });

    // These keep track of if the message is sending and if it was successful
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Updates the formData state whenever the user types something
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // This runs when the user clicks the "Send Message" button
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Stop the page from refreshing
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            // Send the form data to our server API
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                // If everything went well, show a success message and clear the form
                setStatus({ type: 'success', message: 'Message sent successfully!' });
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    subject: 'General Inquiry',
                    message: ''
                });
            } else {
                // If there was an error, show it to the user
                setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to send message.' });
        } finally {
            setIsSubmitting(false); // Stop the "Sending..." loading state
        }
    };

    return (
        <div className="min-h-screen font-poppins bg-story-lavender flex flex-col">
            <Header />

            <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background decorative blobs */}
                <div className="absolute top-20 left-0 w-96 h-96 bg-story-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 right-0 w-96 h-96 bg-story-gold rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-20 w-96 h-96 bg-story-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                <div className="container mx-auto relative z-10 max-w-6xl">
                    {/* Page Header */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-bold font-fredoka text-story-purple mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Have questions or need help with your magical stories? We'd love to hear from you!
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Left Side: Contact Info and an Image */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100 animate-fade-in-up h-full flex flex-col justify-between">
                            <h2 className="text-2xl font-bold font-fredoka text-gray-800 mb-6">
                                Contact Information
                            </h2>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-story-purple">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                                        <p className="text-gray-600 mb-2">Our support team is here to help.</p>
                                        <a href="mailto:storynest.contact@gmail.com" className="text-story-purple font-semibold hover:text-purple-700 transition-colors">
                                            storynest.contact@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* A friendly illustration image */}
                            <div className="mt-8 rounded-2xl overflow-hidden shadow-lg border-4 border-white transform hover:scale-[1.02] transition-transform duration-300 w-full">
                                <Image
                                    src="/images/magic-contact-kid.jpg"
                                    alt="Magical Kid"
                                    width={400}
                                    height={300}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>

                        {/* Right Side: The actual form the user fills out */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100 animate-fade-in-up relative overflow-hidden">
                            <h2 className="text-2xl font-bold font-fredoka text-gray-800 mb-6 relative z-10">
                                Send us a Message
                            </h2>

                            {/* Success or Error messages shown after clicking Send */}
                            {status.message && (
                                <div className={`relative z-10 mb-6 p-4 rounded-xl ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {status.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-story-purple focus:ring-2 focus:ring-story-purple/20 outline-none transition-all"
                                            placeholder="Fairy"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-story-purple focus:ring-2 focus:ring-story-purple/20 outline-none transition-all"
                                            placeholder="Goodfairy"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-story-purple focus:ring-2 focus:ring-story-purple/20 outline-none transition-all"
                                        placeholder="yourmail@gmail.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700">Subject</label>
                                    <select
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-story-purple focus:ring-2 focus:ring-story-purple/20 outline-none transition-all bg-white"
                                    >
                                        <option>General Inquiry</option>
                                        <option>Partnership</option>
                                        <option>Feedback</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Message</label>
                                    <textarea
                                        id="message"
                                        rows={8}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-story-purple focus:ring-2 focus:ring-story-purple/20 outline-none transition-all resize-none"
                                        placeholder="Type your magical message here..."
                                        required
                                    ></textarea>
                                </div>

                                {/* The Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full bg-story-purple hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 hover:shadow-purple-400 transition-all transform hover:-translate-y-1 active:translate-y-0 glow-hover ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

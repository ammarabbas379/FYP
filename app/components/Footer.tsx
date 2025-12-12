import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-story-purple to-purple-700 pt-16 pb-8 border-t border-purple-400">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-10 h-10 relative transform group-hover:scale-105 transition-transform duration-300 bg-transparent rounded-xl border-2 border-white/30">
                                <Image
                                    src="/images/storynest-logo.png"
                                    alt="StoryNest Logo"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold font-fredoka text-white">StoryNest AI</span>
                        </Link>
                        <p className="text-white mb-6 font-poppins">
                            Where imagination becomes a story. Creating magical moments for families everywhere.
                        </p>
                        <div className="flex gap-4">
                            {['facebook', 'instagram', 'youtube'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-story-purple shadow-sm hover:shadow-md hover:bg-story-purple hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <span className="sr-only">{social}</span>
                                    {social === 'facebook' && (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                    )}
                                    {social === 'instagram' && (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                    )}
                                    {social === 'youtube' && (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                    )}                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-white mb-6 font-fredoka">Quick Links</h4>
                        <ul className="space-y-3">
                            {['Home', 'Create Story', 'Explore Stories', 'Contact Us'].map((link) => (
                                <li key={link}>
                                    <Link href={link === 'Home' ? '/' : link === 'Create Story' ? '/create-story' : link === 'Contact Us' ? '/contact-us' : '#'} className="text-white hover:text-story-gold transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 font-fredoka">Support</h4>
                        <ul className="space-y-3">
                            {['Help Center', 'Terms of Service', 'Privacy Policy', 'FAQs'].map((link) => (
                                <li key={link}>
                                    <Link href={link === 'Help Center' ? '/contact-us' : link === 'Terms of Service' ? '/terms' : '#'} className="text-white hover:text-story-gold transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 font-fredoka">Subscribe</h4>
                        <p className="text-sm text-white mb-4">Get the latest magical updates!</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:border-story-purple focus:ring-1 focus:ring-story-purple text-sm"
                            />
                            <button className="bg-story-purple text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors">
                                →
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-purple-200 pt-8 text-center sm:flex sm:justify-between sm:text-left">
                    <p className="text-sm text-white">
                        © 2025 StoryNest AI. All rights reserved.
                    </p>

                </div>
            </div>
        </footer>
    );
}

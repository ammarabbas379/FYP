import Image from 'next/image';
import Link from 'next/link';
import Sparkles from './Sparkles'; // Import the sparkle animation effect

// This is the Hero section - the very first big section users see when they land on the site
export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-32 overflow-hidden">
            {/* Soft background color gradient */}
            <div className="absolute top-0 right-0 -z-10 w-full h-full bg-gradient-to-br from-story-lavender via-white to-story-gold2 opacity-70"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Left Side: Text and Buttons */}
                    <div className="max-w-2xl animate-fade-in-up">
                        <div className="inline-block px-4 py-1.5 mb-6 bg-white rounded-full shadow-sm border border-purple-100">
                            <span className="text-sm font-bold text-story-purple flex items-center gap-2">
                                <span className="text-yellow-400">✨</span> #1 Storytelling Platform for Kids
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-fredoka leading-tight text-gray-900 mb-6">
                            Craft <span className="text-story-purple relative">
                                Magical
                                {/* Adds sparkles around the word "Magical" */}
                                <Sparkles />
                            </span> Stories for Kids in Minutes
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed font-poppins">
                            Create fun and personalized stories that bring your child's adventures to life and spark their passion for reading. It only takes a few seconds!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* The main button to start creating a story */}
                            <Link href="/create-story">
                                <button className="bg-story-purple hover:bg-purple-700 text-white text-lg font-bold py-4 px-8 rounded-full shadow-xl shadow-purple-200 hover:shadow-purple-400 transition-all transform hover:-translate-y-1 active:translate-y-0 glow-hover">
                                    Create Story
                                </button>
                            </Link>
                        </div>

                        {/* Social proof: shows parent avatars and a headcount */}
                        <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => {
                                    const avatars = [
                                        '/images/parent-avatar.png',
                                        '/images/parent-avatar-2.png',
                                        '/images/parent-avatar-3.png',
                                        '/images/parent-avatar-4.png'
                                    ];
                                    return (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={avatars[i - 1]}
                                                alt={`Happy Parent ${i}`}
                                                width={32}
                                                height={32}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <p>Loved by 10,000+ happy parents</p>
                        </div>
                    </div>

                    {/* Right Side: Big magical illustration */}
                    <div className="relative animate-float lg:h-[600px] flex items-center justify-center">

                        <div className="relative w-full max-w-lg aspect-square">
                            {/* Colorful glowing circles behind the image */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-story-purple-light/20 to-story-blue/20 rounded-full blur-3xl animate-pulse"></div>

                            <div className="relative z-10 w-full h-full flex items-center justify-center group">
                                <div className="absolute inset-0 bg-gradient-to-br from-story-purple-light/30 to-story-blue/30 rounded-full blur-2xl transform group-hover:scale-105 transition-transform duration-500"></div>

                                {/* The main hero drawing */}
                                <Image
                                    src="/hero-illustration.png"
                                    alt="Magical kid knight and baby dragon adventure"
                                    width={600}
                                    height={600}
                                    className="relative z-20 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                    priority
                                />

                                {/* Moving blobs for extra visual magic */}
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-story-gold rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-story-purple rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

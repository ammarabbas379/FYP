import Link from 'next/link';

// This is the "Call to Action" section - it encourages users to start creating a story
export default function CTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* The main purple background of the section */}
            <div className="absolute inset-0 bg-gradient-to-br from-story-purple to-purple-600"></div>

            {/* Decorative pattern and floating colors for a magical feel */}
            <div className="absolute inset-0 overflow-hidden">
                {/* A subtle stardust pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                {/* Large floating blobs of color in the background */}
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-story-pink opacity-20 rounded-full blur-3xl animate-float-slow"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-story-blue opacity-20 rounded-full blur-3xl animate-float-delay"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="max-w-3xl mx-auto">
                    {/* Bouncing sparkles icon */}
                    <div className="inline-block mb-6 animate-bounce">
                        <span className="text-4xl">✨</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-fredoka font-bold text-white mb-6 leading-tight drop-shadow-md">
                        Ready to Create Your First <br />
                        <span className="text-story-gold">Magical Story?</span>
                    </h2>

                    <p className="text-xl text-white/90 font-poppins mb-10 leading-relaxed max-w-2xl mx-auto">
                        Join thousands of parents and storytellers. Imaginative adventures are just a click away!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        {/* Big button to go to the story creation page */}
                        <Link href="/create-story">
                            <button className="bg-white text-story-purple hover:bg-story-gold2 font-bold text-xl py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto">
                                Create Your Story Now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tiny floating stars for extra detail */}
            <div className="absolute top-20 left-20 w-4 h-4 bg-white rounded-full blur-[2px] animate-sparkle"></div>
            <div className="absolute bottom-20 right-20 w-6 h-6 bg-story-gold rounded-full blur-[3px] animate-sparkle delay-100"></div>
        </section>
    );
}

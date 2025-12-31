// This section shows off the cool features of StoryNest
export default function Features() {
    // A list of features to display in cards
    const features = [
        {
            title: "AI-Powered Stories",
            description: "Instantly create unique, magical tales tailored to your child's interests using advanced AI.",
            icon: "✨",
            color: "bg-story-purple-light",
            delay: "0"
        },
        {
            title: "AI-generated Book Covers",
            description: "Bring your story to life with beautiful, one-of-a-kind cover art generated instantly.",
            icon: "📖",
            color: "bg-story-blue",
            delay: "100"
        },
        {
            title: "Read or Listen",
            description: "Enjoy stories with beautiful illustrations and soothing audio narration.",
            icon: "🎧",
            color: "bg-story-pink",
            delay: "200"
        }
    ];

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Soft decorative circles in the background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-story-gold/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-story-blue/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Intro text for the features section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-story-purple font-bold tracking-wider uppercase text-sm mb-2 block">Why StoryNest?</span>
                    <h2 className="text-4xl font-fredoka font-bold text-gray-900 mb-4">Magic in Every Story</h2>
                    <p className="text-lg text-gray-600 font-poppins">
                        Our platform makes it easy to create memories that last a lifetime with features designed for fun and learning.
                    </p>
                </div>

                {/* Grid of feature cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
                            style={{ animationDelay: `${feature.delay}ms` }}
                        >
                            {/* Decorative corner shape that gets bigger on hover */}
                            <div className={`absolute top-0 right-0 w-32 h-32 ${feature.color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`}></div>

                            {/* The icon for the feature */}
                            <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:rotate-6 transition-transform duration-300`}>
                                {feature.icon}
                            </div>

                            <h3 className="text-2xl font-fredoka font-bold text-gray-900 mb-3 group-hover:text-story-purple transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

const heroPairs = [
    { before: '/images/images_optimized/gevers voor.webp', after: '/images/images_optimized/gevers na.webp' },
    { before: '/images/images_optimized/hoek 1 voor.webp', after: '/images/images_optimized/hoek 1 na.webp' },
    { before: '/images/images_optimized/mac voor.webp', after: '/images/images_optimized/mac na.webp' },
    { before: '/images/images_optimized/rood huis voor.webp', after: '/images/images_optimized/rood huis na.webp' },
    { before: '/images/images_optimized/villa voor.webp', after: '/images/images_optimized/villa na.webp' }
];

const Hero = () => {
    const [currentPairIndex, setCurrentPairIndex] = React.useState(0);
    const [showAfter, setShowAfter] = React.useState(false); // Toggle between Before (false) and After (true)

    React.useEffect(() => {
        // Timeline:
        // 0s: Start Pair A (Before)
        // 2s: Fade to Pair A (After)
        // 6s: End Pair A, Switch to Pair B (Before)

        const cycleDuration = 12000;
        const transitionDelay = 4000;

        const interval = setInterval(() => {
            // Reset to next pair's Before state
            setShowAfter(false);
            setCurrentPairIndex((prev) => (prev + 1) % heroPairs.length);
        }, cycleDuration);

        const toggleTimer = setTimeout(() => {
            const toggleInterval = setInterval(() => {
                setShowAfter(true);
            }, cycleDuration);
            return () => clearInterval(toggleInterval);
        }, transitionDelay);

        // Initial trigger for first slide transition
        const initialTimeout = setTimeout(() => setShowAfter(true), transitionDelay);

        return () => {
            clearInterval(interval);
            clearTimeout(toggleTimer);
            clearTimeout(initialTimeout);
        };
    }, []);

    const currentPair = heroPairs[currentPairIndex];

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
            {/* Background Transitions */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10 transition-colors duration-1000"></div>

                {/* Render current pair's Before Image */}
                <img
                    src={currentPair.before}
                    alt="Bereschoon Before"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${!showAfter ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                />

                {/* Render current pair's After Image */}
                <img
                    src={currentPair.after}
                    alt="Bereschoon After"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${showAfter ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                />

                {/* Labels - Moved to bottom right to avoid text overlap */}
                <div className="absolute bottom-12 right-6 md:right-12 z-20">
                    <div className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-500 shadow-xl backdrop-blur-md ${!showAfter ? 'bg-white/90 text-black translate-x-0 opacity-100' : 'translate-x-12 opacity-0 absolute'}`}>
                        Voor
                    </div>
                    <div className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-500 shadow-xl backdrop-blur-md ${showAfter ? 'bg-primary text-white translate-x-0 opacity-100' : 'translate-x-12 opacity-0 absolute'}`}>
                        Na
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
                {/* Removed 'Nu beschikbaar' badge as requested */}

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 mb-8 tracking-tighter animate-in slide-in-from-bottom-10 duration-700">
                    Uitzonderlijke<br />Schoonmaak.
                </h1>

                <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-12 duration-1000 delay-100">
                    Wij herstellen de uitstraling van uw pand met geavanceerde reinigingstechnieken.
                    Professioneel, efficiënt en milieubewust.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-in slide-in-from-bottom-16 duration-1000 delay-200">
                    <a href="#contact" className="group bg-primary text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-all flex items-center shadow-[0_0_20px_rgba(132,204,22,0.4)] hover:shadow-[0_0_30px_rgba(132,204,22,0.6)] hover-lift active:scale-95 btn-shine">
                        Offerte Aanvragen
                        <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <button className="px-8 py-4 rounded-full text-lg font-medium text-white border border-white/30 hover:bg-white/10 transition-all backdrop-blur-sm hover:border-white/50 hover-lift">
                        Bekijk Onze Diensten
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20">
                <ChevronDown className="text-white/70" size={32} />
            </div>
        </section>
    );
};

export default Hero;

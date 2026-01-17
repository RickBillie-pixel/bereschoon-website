import React, { useRef, useEffect, useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Sparkles, ArrowRight } from 'lucide-react';

const BeforeAfterCarousel = () => {
    const scrollContainerRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // Mock data for 10 carousel items
    // In a real scenario, these could be props or fetched
    const items = Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        before: "https://images.unsplash.com/photo-1632759957731-50227bea70f2?q=80&w=600&auto=format&fit=crop", // Dirty pavement example
        after: "https://images.unsplash.com/photo-1632759952046-654b0eb13303?q=80&w=600&auto=format&fit=crop",  // Clean pavement example
        label: i % 2 === 0 ? "Terras Reiniging" : "Oprit Renovatie"
    }));

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        let intervalId;

        const startAutoScroll = () => {
            intervalId = setInterval(() => {
                if (isPaused) return;

                // Calculate scroll amount (width of one card + gap)
                // Assuming card width 300px + gap 16px (1rem) = 316px
                // Ideally reading strictly from DOM
                const cardWidth = scrollContainer.children[0]?.offsetWidth || 300;
                const gap = 16;
                const scrollAmount = cardWidth + gap;

                // Check if we are near end
                const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;

                if (scrollContainer.scrollLeft >= maxScrollLeft - 10) {
                    // Reset to start smoothly
                    scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Scroll next
                    scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }

            }, 5000); // 5 seconds
        };

        startAutoScroll();

        return () => clearInterval(intervalId);
    }, [isPaused]);

    return (
        <div className="w-full py-12 bg-white border-t border-stone-100">
            {/* Carousel Container */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 md:px-8 pb-4 no-scrollbar items-center"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex-shrink-0 w-[85vw] md:w-[calc(25vw-2rem)] snap-center"
                    >
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-stone-100 group">
                            <ReactCompareSlider
                                itemOne={<ReactCompareSliderImage src={item.before} alt="Voor" />}
                                itemTwo={<ReactCompareSliderImage src={item.after} alt="Na" />}
                                className="w-full h-full object-cover"
                            />

                            {/* Labels */}
                            <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded">
                                Voor
                            </div>
                            <div className="absolute top-3 right-3 px-2 py-0.5 bg-primary/90 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                                Na
                            </div>

                            {/* Bottom Label */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent pt-8 translate-y-2 group-hover:translate-y-0 transition-transform">
                                <span className="text-white font-medium text-sm">{item.label}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BeforeAfterCarousel;

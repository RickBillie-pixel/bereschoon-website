import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

const images = [
    '/images/images_optimized/IMG_1633.webp',
    '/images/images_optimized/IMG_1816.webp',
    '/images/images_optimized/IMG_1820.webp',
    '/images/images_optimized/IMG_1823.webp',
    '/images/images_optimized/IMG_2664.webp',
    '/images/images_optimized/IMG_2903.webp',
    '/images/images_optimized/IMG_2920.webp',
    '/images/images_optimized/IMG_3041.webp',
    '/images/images_optimized/IMG_3062.webp',
    '/images/images_optimized/IMG_3083.webp',
    '/images/images_optimized/IMG_3336.webp',
    '/images/images_optimized/IMG_3674.webp',
    '/images/images_optimized/IMG_3692.webp'
];

const Gallery = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <section id="projects" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Gerealiseerde Projecten</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        In een oogopslag: kwaliteit en detail.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Carousel Container */}
                    <div className="overflow-hidden rounded-2xl shadow-2xl bg-black aspect-[16/9] md:aspect-[21/9] relative group">
                        <div
                            className="flex transition-transform duration-500 ease-out h-full"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {images.map((src, index) => (
                                <div key={index} className="min-w-full h-full relative">
                                    <img
                                        src={src}
                                        alt={`Project ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-primary w-6' : 'bg-white/50 hover:bg-white'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;

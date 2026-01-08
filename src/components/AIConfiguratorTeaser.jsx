import React from 'react';
import { Wand2, Upload, Sparkles } from 'lucide-react';

const AIConfiguratorTeaser = () => {
    return (
        <section className="py-32 bg-secondary text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px]"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center space-x-2 text-accent mb-6 border border-accent/30 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                            <Sparkles size={14} />
                            <span>Bereschoon AI</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Zie het resultaat <br className="hidden md:block" />
                            <span className="text-primary">voordat we beginnen.</span>
                        </h2>

                        <p className="text-stone-300 text-lg mb-8 leading-relaxed max-w-xl">
                            Upload een foto van uw pand en laat onze AI direct tonen hoe het eruit ziet na een professionele reiniging. Geen verrassingen, alleen resultaat.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg shadow-primary/25">
                                <Wand2 className="mr-2" size={20} />
                                Probeer het nu
                            </button>
                            <button className="flex items-center justify-center bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-medium transition-all border border-white/10">
                                <Upload className="mr-2" size={20} />
                                Bekijk Demo
                            </button>
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        {/* Abstract UI Mockup */}
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 aspect-video flex items-center justify-center group">
                            <img
                                src="/images/images_optimized/IMG_1686.webp"
                                alt="Demo Scan"
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000"
                            />

                            {/* Scanning Effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-transparent w-full h-2 top-0 group-hover:top-full transition-all duration-[2s] ease-in-out z-20"></div>

                            <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between z-30">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                                    <span className="text-sm font-mono text-stone-300">Processing Image...</span>
                                </div>
                                <span className="text-xs text-accent font-bold">100% COMPLETE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIConfiguratorTeaser;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

const ProjectModal = ({ project, onClose, onNext, onPrev, hasNext, hasPrev }) => {
    const [sliderPosition, setSliderPosition] = useState(50);

    if (!project) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
                <X size={24} />
            </button>

            {/* Navigation */}
            {hasPrev && (
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors hidden md:block"
                >
                    <ChevronLeft size={32} />
                </button>
            )}
            {hasNext && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors hidden md:block"
                >
                    <ChevronRight size={32} />
                </button>
            )}

            {/* Content Container */}
            <motion.div
                className="w-full max-w-6xl max-h-[90vh] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
            >
                {/* Image Section (Slider) */}
                <div className="w-full md:w-2/3 h-[50vh] md:h-auto relative bg-black">
                    <ReactCompareSlider
                        itemOne={
                            <ReactCompareSliderImage
                                src={project.before}
                                alt="Voor"
                            />
                        }
                        itemTwo={
                            <ReactCompareSliderImage
                                src={project.after}
                                alt="Na"
                            />
                        }
                        position={sliderPosition}
                        onPositionChange={setSliderPosition}
                        className="w-full h-full object-contain md:object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 rounded text-white text-xs font-bold">VOOR</div>
                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 rounded text-white text-xs font-bold">NA</div>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/3 p-6 md:p-8 overflow-y-auto bg-white/5 md:border-l border-white/10">
                    <div className="mb-6">
                        <span className="text-primary text-sm font-bold uppercase tracking-wider block mb-2">{project.category}</span>
                        <h3 className="text-2xl font-bold text-white mb-4">{project.projectName}</h3>
                        <div className="h-1 w-12 bg-primary rounded-full"></div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-white font-semibold mb-2 text-sm uppercase text-gray-400">De Uitdaging</h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {project.challenge || "Vervuiling, groene aanslag en weersinvloeden hebben het oppervlak aangetast."}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-2 text-sm uppercase text-gray-400">De Oplossing</h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {project.solution || "Specialistische dieptereiniging met gepaste druk en temperatuur, gevolgd door een beschermende coating."}
                            </p>
                        </div>

                        {/* Mobile Navigation (Visible only on small screens) */}
                        <div className="flex gap-4 pt-4 md:hidden">
                            <button
                                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                                disabled={!hasPrev}
                                className="flex-1 py-3 bg-white/10 rounded-lg text-white font-medium disabled:opacity-30"
                            >
                                Vorige
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onNext(); }}
                                disabled={!hasNext}
                                className="flex-1 py-3 bg-primary rounded-lg text-white font-medium disabled:opacity-30"
                            >
                                Volgende
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProjectModal;

import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { motion } from 'framer-motion';

const ProjectShowcase = ({ projects }) => {
    if (!projects || projects.length === 0) return null;

    return (
        <section className="py-12 space-y-24">
            {projects.map((project, index) => {
                const isEven = index % 2 === 0;

                return (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
                    >
                        {/* Slider Section */}
                        <div className="w-full lg:w-3/5 h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl relative group">
                            <ReactCompareSlider
                                itemOne={
                                    <ReactCompareSliderImage
                                        src={project.before}
                                        alt={`${project.projectName} - Voor`}
                                    />
                                }
                                itemTwo={
                                    <ReactCompareSliderImage
                                        src={project.after}
                                        alt={`${project.projectName} - Na`}
                                    />
                                }
                                className="w-full h-full object-cover"
                            />

                            {/* Labels */}
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs font-bold tracking-wider">
                                VOOR
                            </div>
                            <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-lg text-white text-xs font-bold tracking-wider">
                                NA
                            </div>

                            {/* Drag Instruction */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur text-white text-xs px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                Sleep om het verschil te zien
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full lg:w-2/5 space-y-8">
                            <div>
                                <div className="text-primary font-bold tracking-wider text-sm uppercase mb-2">
                                    {project.category}
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    {project.projectName}
                                </h3>
                                <div className="h-1 w-20 bg-primary/20 rounded-full"></div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100">
                                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                        De Uitdaging
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        {project.challenge || "Vervuiling, groene aanslag en weersinvloeden hebben het oppervlak aangetast."}
                                    </p>
                                </div>

                                <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
                                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        De Oplossing
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        {project.solution || "Specialistische dieptereiniging met gepaste druk en temperatuur, gevolgd door een beschermende coating."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </section>
    );
};

export default ProjectShowcase;

import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { motion } from 'framer-motion';

const ProjectShowcase = ({ projects }) => {
    if (!projects || projects.length === 0) return null;

    return (
        <section className="py-12 md:py-24 space-y-16 md:space-y-24">
            {projects.map((project, index) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="group"
                >
                    {/* Unified Card Design */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-0 lg:gap-8 bg-transparent">

                        {/* Slider Image - Reduced height for mobile compactness */}
                        <div className={`lg:col-span-7 relative h-[280px] md:h-[400px] lg:h-[450px] ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                            <div className="w-full h-full rounded-2xl md:rounded-3xl shadow-lg lg:shadow-2xl overflow-hidden relative z-10 block">
                                <ReactCompareSlider
                                    itemOne={<ReactCompareSliderImage src={project.before} alt={`${project.projectName} - Voor`} />}
                                    itemTwo={<ReactCompareSliderImage src={project.after} alt={`${project.projectName} - Na`} />}
                                    className="w-full h-full object-cover"
                                />
                                {/* Minimal labels */}
                                <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-white/90 backdrop-blur text-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm z-20">
                                    Voor
                                </div>
                                <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm z-20">
                                    Na
                                </div>
                            </div>
                        </div>

                        {/* Content - Compact overlap on mobile, Side on desktop */}
                        <div className={`lg:col-span-5 flex flex-col justify-center lg:p-0 relative z-20 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                            {/* Negative margins for overlap effect on desktop */}
                            <div className={`-mt-8 mx-3 p-5 bg-white rounded-xl shadow-lg border border-gray-100/50 lg:p-8 lg:rounded-3xl lg:shadow-xl lg:border-gray-100 lg:mt-0 lg:mx-0 ${index % 2 === 1 ? 'lg:-mr-12 xl:-mr-16' : 'lg:-ml-12 xl:-ml-16'}`}>
                                <div className="flex justify-between items-start mb-3 lg:mb-4">
                                    <h3 className="text-lg md:text-3xl font-bold tracking-tight text-foreground line-clamp-1">
                                        {project.projectName}
                                    </h3>
                                    <span className="hidden md:inline-flex text-xs font-semibold px-2 py-1 bg-gray-100 text-muted-foreground rounded-full">
                                        {project.category}
                                    </span>
                                </div>

                                {/* Compact Challenge/Solution - Brand Aligned */}
                                <div className="space-y-3 lg:space-y-6">
                                    <div className="relative pl-3.5 border-l-2 border-orange-200">
                                        <h4 className="text-[10px] md:text-xs font-bold text-orange-600 uppercase tracking-widest mb-0.5">Uitdaging</h4>
                                        <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
                                            {project.challenge || "Vervuiling, groene aanslag en weersinvloeden hebben het oppervlak aangetast."}
                                        </p>
                                    </div>

                                    <div className="relative pl-3.5 border-l-2 border-primary/30">
                                        <h4 className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest mb-0.5">Oplossing</h4>
                                        <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
                                            {project.solution || "Specialistische dieptereiniging met gepaste druk en temperatuur, gevolgd door een beschermende coating."}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center lg:mt-8 lg:pt-6 lg:border-gray-100">
                                    <span className="text-xs md:text-sm font-medium text-muted-foreground md:hidden">
                                        {project.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </section>
    );
};

export default ProjectShowcase;

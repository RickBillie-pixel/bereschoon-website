import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn } from 'lucide-react';

const CATEGORIES = [
    { id: 'all', label: 'Alles' },
    { id: 'Oprit', label: 'Oprit & Terras' },
    { id: 'Gevel', label: 'Gevel' },
    { id: 'Tuin', label: 'Onkruid' },
    { id: 'Bedrijf', label: 'Bedrijfsterrein' },
    { id: 'Woning', label: 'Woning' } // Added Woning just in case
];

const ProjectCard = ({ project, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group cursor-pointer rounded-xl overflow-hidden aspect-[4/3] bg-gray-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <img
                src={project.after}
                alt={project.projectName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
            />

            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                    <ZoomIn size={24} />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-primary text-xs font-bold uppercase mb-1 block">{project.category}</span>
                <h4 className="text-white font-semibold truncate">{project.projectName}</h4>
            </div>
        </motion.div>
    );
};

const ProjectGrid = ({ projects, onProjectClick }) => {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredProjects = useMemo(() => {
        if (activeCategory === 'all') return projects;
        return projects.filter(p => {
            // Strict match based on the text stored in DB 'category' column
            return p.category === activeCategory;
        });
    }, [projects, activeCategory]);

    if (!projects || projects.length === 0) return null;

    return (
        <section className="pb-12 pt-0">
            {/* Filter Tabs */}
            {/* Filter Tabs - Modern Pill Design */}
            <div className="flex justify-center mb-12">
                <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-inner">
                    {CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 z-10 ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary rounded-full shadow-md"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        style={{ zIndex: -1 }}
                                    />
                                )}
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() => onProjectClick(project)}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    Geen projecten gevonden in deze categorie.
                </div>
            )}
        </section>
    );
};

export default ProjectGrid;

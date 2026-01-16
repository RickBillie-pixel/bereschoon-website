import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ProjectShowcase from '../components/ProjectShowcase';
import ProjectGrid from '../components/ProjectGrid';
import ProjectModal from '../components/ProjectModal';
import TrustIndicators from '../components/TrustIndicators';
import ProcessSteps from '../components/ProcessSteps';
import CallToAction from '../components/CallToAction';
import { fetchProjects } from '../lib/projects';
import SEO from '../components/SEO';

const Projecten = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const loadProjects = async () => {
            setLoading(true);
            const data = await fetchProjects();
            setProjects(data);
            setLoading(false);
        };
        loadProjects();
    }, []);

    // Split projects into Showcase (Featured) and Grid (Everything else)
    const showcaseProjects = projects.filter(p => p.is_featured);
    // Grid displays non-featured projects, or maybe ALL remaining?
    // Let's show all non-featured projects in the grid.
    const gridProjects = projects.filter(p => !p.is_featured);

    const handleProjectClick = (project) => {
        // Find index of clicked project in the full 'projects' array
        // (Assuming modal navigates through ALL projects for continuity)
        const index = projects.findIndex(p => p.id === project.id);
        if (index !== -1) {
            setSelectedProjectIndex(index);
            setModalOpen(true);
        }
    };

    const nextProject = () => {
        setSelectedProjectIndex((prev) => (prev + 1) % projects.length);
    };

    const prevProject = () => {
        setSelectedProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

    return (
        <PageTransition className="pt-24 bg-white">
            <SEO
                title="Projecten"
                description="Bekijk onze gerealiseerde projecten. Van opritreiniging tot gevelreiniging, zie het resultaat van ons werk."
            />
            <div className="container mx-auto px-6">

                {/* Header Section */}
                <header className="text-center mb-16 md:mb-24 pt-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                        Gerealiseerde Projecten
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed">
                        Een selectie van recente werkzaamheden. Bekijk het verschil tussen voor en na.
                    </p>
                    <TrustIndicators />
                </header>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-gray-400">Projecten laden...</p>
                    </div>
                )}

                {!loading && (
                    <>
                        {/* Hero / Showcase Section */}
                        {/* Only show if there are actual featured projects */}
                        {showcaseProjects.length > 0 && (
                            <div className="mb-24">
                                <ProjectShowcase projects={showcaseProjects} />
                            </div>
                        )}

                        {/* Grid Section */}
                        {gridProjects.length > 0 && (
                            <div className="mb-24">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Meer Projecten</h2>
                                    <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                                </div>
                                <ProjectGrid
                                    projects={gridProjects}
                                    onProjectClick={handleProjectClick}
                                />
                            </div>
                        )}

                        {/* Empty State if absolutely nothing */}
                        {projects.length === 0 && (
                            <div className="text-center py-24 text-gray-500">
                                Nog geen projecten beschikbaar.
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Process Section */}
            <div className="bg-gray-50 py-24 border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <ProcessSteps />
                </div>
            </div>

            {/* CTA Section */}
            <CallToAction
                title="Ook uw project"
                highlight="laten uitvoeren?"
                description="Wij staan klaar om uw woning of bedrijfspand weer te laten stralen."
            />

            {/* Modal */}
            <AnimatePresence>
                {modalOpen && selectedProjectIndex !== null && (
                    <ProjectModal
                        project={projects[selectedProjectIndex]}
                        onClose={() => setModalOpen(false)}
                        onNext={nextProject}
                        onPrev={prevProject}
                        hasNext={projects.length > 1}
                        hasPrev={projects.length > 1}
                    />
                )}
            </AnimatePresence>

        </PageTransition>
    );
};

export default Projecten;

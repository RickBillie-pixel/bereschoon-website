import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { Droplets, Check } from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { viewportSettings } from '../utils/animations';

// Map service IDs to Supabase tables
const serviceTableMap = {
    'oprit-terras-terrein': 'opritreiniging_projects',
    'gevelreiniging': 'gevelreiniging_projects',
    'onkruidbeheersing': 'onkruidbeheersing_projects'
};

// Default categories for each service
const serviceCategoryDefaults = {
    'oprit-terras-terrein': 'Oprit & Terras',
    'gevelreiniging': 'Gevel',
    'onkruidbeheersing': 'Tuin'
};

// Function to fetch projects for a specific service
const fetchServiceProjects = async (serviceId) => {
    const tableName = serviceTableMap[serviceId];
    if (!tableName) {
        console.warn(`No table mapped for service: ${serviceId}`);
        return [];
    }

    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(`Error fetching from ${tableName}:`, error);
            return [];
        }

        if (!data || data.length === 0) {
            console.log(`No projects found in ${tableName}`);
            return [];
        }

        // Transform database projects with robust field checking
        return data
            .map(project => {
                // Try multiple casing/naming options
                const beforeImage = project.before_image_url || project.before_image || project.beforeImage || project['before_image_url'] || null;
                const afterImage = project.after_image_url || project.after_image || project.afterImage || project['after_image_url'] || null;

                return {
                    id: project.id,
                    projectName: project.name,
                    before: beforeImage,
                    after: afterImage,
                    category: serviceCategoryDefaults[serviceId] || 'Project',
                    date: project.date,
                    challenge: project['Uitdaging'] || project['uitdaging'] || project.challenge || "",
                    solution: project['Oplossing'] || project['oplossing'] || project.solution || ""
                };
            })
            // Filter out invalid projects (must have both images)
            .filter(project => {
                const isValid = project.before && project.after;
                if (!isValid) {
                    console.warn('Skipping invalid project (missing images):', project.projectName);
                }
                return isValid;
            });

    } catch (error) {
        console.error('Exception in fetchServiceProjects:', error);
        return [];
    }
};

const ServiceGallery = ({
    serviceId,
    title = "Onze Resultaten",
    subtitle = "Portfolio",
    description = "Bekijk het verschil: sleep de slider om het resultaat te zien."
}) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const ref = useRef(null);
    const isInView = useInView(ref, viewportSettings);

    // Fetch projects from database
    useEffect(() => {
        const loadProjects = async () => {
            if (!serviceId) return;

            setLoading(true);
            const data = await fetchServiceProjects(serviceId);
            setProjects(data);
            setLoading(false);
        };

        loadProjects();
    }, [serviceId]);

    // Group projects by project name
    const groupedProjects = useMemo(() => {
        const groups = {};
        projects.forEach(project => {
            if (!groups[project.projectName]) {
                groups[project.projectName] = [];
            }
            groups[project.projectName].push(project);
        });
        return Object.entries(groups).map(([name, projectList]) => ({
            name,
            projects: projectList,
            category: projectList[0].category,
            thumbnail: projectList[0],
            challenge: projectList[0].challenge,
            solution: projectList[0].solution
        }));
    }, [projects]);

    // Don't render if no projects and not loading
    if (!loading && groupedProjects.length === 0) {
        return null;
    }

    return (
        <section className="py-12 md:py-24 bg-white text-foreground" ref={ref}>
            <div className="container mx-auto px-6">
                {/* Header - Matching Services.jsx style */}
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 mt-4 md:mt-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="max-w-3xl">
                        <motion.span
                            className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4 uppercase tracking-wider"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.2 }}
                        >
                            <Droplets size={16} />
                            {subtitle}
                        </motion.span>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                            {title}
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* Featured Projects - Enterprise Grade Showcase */}
                {!loading && groupedProjects.length > 0 && (
                    <div className="space-y-16 md:space-y-24">
                        {groupedProjects.slice(0, 3).map((group, index) => (
                            <motion.div
                                key={group.name}
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
                                                itemOne={<ReactCompareSliderImage src={group.thumbnail.before} alt={`${group.name} - Voor`} />}
                                                itemTwo={<ReactCompareSliderImage src={group.thumbnail.after} alt={`${group.name} - Na`} />}
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
                                        <div className={`-mt-8 mx-3 p-5 bg-white rounded-xl shadow-lg border border-gray-100/50 lg:p-8 lg:rounded-3xl lg:shadow-xl lg:border-gray-100 lg:mt-0 lg:mx-0 ${index % 2 === 1 ? 'lg:-mr-12 xl:-mr-16' : 'lg:-ml-12 xl:-ml-16'}`}>
                                            <div className="flex justify-between items-start mb-3 lg:mb-4">
                                                <h3 className="text-lg md:text-3xl font-bold tracking-tight text-foreground line-clamp-1">
                                                    {group.name}
                                                </h3>
                                                <span className="hidden md:inline-flex text-xs font-semibold px-2 py-1 bg-gray-100 text-muted-foreground rounded-full">
                                                    {group.category}
                                                </span>
                                            </div>

                                            {/* Compact Challenge/Solution - Brand Aligned */}
                                            <div className="space-y-3 lg:space-y-6">
                                                <div className="relative pl-3.5 border-l-2 border-orange-200">
                                                    <h4 className="text-[10px] md:text-xs font-bold text-orange-600 uppercase tracking-widest mb-0.5">Uitdaging</h4>
                                                    <p className="text-xs md:text-base text-muted-foreground line-clamp-2 md:line-clamp-none leading-relaxed">
                                                        {group.challenge}
                                                    </p>
                                                </div>

                                                <div className="relative pl-3.5 border-l-2 border-primary/30">
                                                    <h4 className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest mb-0.5">Oplossing</h4>
                                                    <p className="text-xs md:text-base text-muted-foreground line-clamp-2 md:line-clamp-none leading-relaxed">
                                                        {group.solution}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center lg:mt-8 lg:pt-6 lg:border-gray-100">
                                                <span className="text-xs md:text-sm font-medium text-muted-foreground md:hidden">
                                                    {group.category}
                                                </span>
                                                {/* Optional: Add a subtle arrow or interaction hint if needed, keeping it clean for now */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ServiceGallery;

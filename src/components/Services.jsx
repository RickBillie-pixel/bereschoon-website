import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

const services = [
    {
        title: 'Dakreiniging',
        description: 'Verleng de levensduur van uw dak met onze milde softwash behandeling.',
        image: '/images/images_optimized/IMG_3041.webp',
    },
    {
        title: 'Gevelreiniging',
        description: 'Verwijder groene aanslag en vuil voor een frisse, nieuwe uitstraling.',
        image: '/images/images_optimized/IMG_2566.webp',
    },
    {
        title: 'Terras & Bestrating',
        description: 'Onkruidvrij en schoon terras zonder schade aan uw voegen.',
        image: '/images/images_optimized/IMG_3251.webp',
    },
];

const Services = () => {
    return (
        <section id="services" className="py-24 bg-white text-foreground">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Onze Expertise</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Wij combineren vakmanschap met de nieuwste technologieën voor een ongeëvenaard resultaat.
                        </p>
                    </div>
                    <a href="#" className="hidden md:flex items-center text-lg font-medium hover:text-gray-600 transition-colors mt-6 md:mt-0">
                        Bekijk alle diensten <ArrowUpRight className="ml-2" size={20} />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover-lift border border-gray-100">
                            <div className="h-64 overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    {service.description}
                                </p>
                                <button className="text-primary font-semibold flex items-center hover:translate-x-1 transition-transform">
                                    Meer info <ArrowRight size={16} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <a href="#" className="inline-flex items-center text-lg font-medium hover:text-gray-600 transition-colors">
                        Bekijk alle diensten <ArrowUpRight className="ml-2" size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Services;

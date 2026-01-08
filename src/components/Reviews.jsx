import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
    {
        name: 'Jan de Vries',
        role: 'VVE Beheerder',
        text: 'Bereschoon heeft ons appartementencomplex weer als nieuw gemaakt. De communicatie verliep soepel en het resultaat is verbluffend.',
        stars: 5,
    },
    {
        name: 'Sarah van den Berg',
        role: 'Huiseigenaar',
        text: 'Super service! Ze kwamen op tijd, werkten netjes en mijn dak ziet er weer fantastisch uit. Zeker een aanrader.',
        stars: 5,
    },
    {
        name: 'Pieter Janssen',
        role: 'Projectontwikkelaar',
        text: 'Voor onze nieuwbouwprojecten werken wij graag samen met Bereschoon. Kwaliteit staat bij hen altijd op nummer één.',
        stars: 5,
    },
];

const Reviews = () => {
    return (
        <section id="reviews" className="py-24 bg-muted/50 border-t border-b border-gray-100">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-16 tracking-tight">Wat onze klanten zeggen</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
                            <div className="flex space-x-1 mb-6 text-yellow-400">
                                {[...Array(review.stars)].map((_, i) => (
                                    <Star key={i} size={20} fill="currentColor" />
                                ))}
                            </div>
                            <p className="text-muted-foreground italic mb-6 leading-relaxed">"{review.text}"</p>
                            <div>
                                <h4 className="font-bold text-foreground">{review.name}</h4>
                                <span className="text-sm text-muted-foreground">{review.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';

const NotFound = () => {
    return (
        <PageTransition>
            <SEO
                title="Pagina niet gevonden"
                description="Deze pagina bestaat niet of is verplaatst. Ga terug naar de homepage van Bereschoon."
                noindex={true}
            />
            <section className="min-h-screen flex items-center justify-center bg-gray-50 pt-24 pb-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-lg mx-auto text-center">
                        {/* 404 Visual */}
                        <div className="mb-8">
                            <span className="text-9xl font-bold text-primary/20">404</span>
                        </div>

                        {/* Content */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Pagina niet gevonden
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Sorry, de pagina die je zoekt bestaat niet of is verplaatst.
                            Geen zorgen, we helpen je graag op weg!
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
                            >
                                <Home size={18} />
                                Naar Homepage
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all border border-gray-200"
                            >
                                <Search size={18} />
                                Contact opnemen
                            </Link>
                        </div>

                        {/* Quick Links */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-4">Populaire pagina's:</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Link
                                    to="/oprit-terras-terrein"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Oprit & Terras
                                </Link>
                                <span className="text-gray-300">•</span>
                                <Link
                                    to="/gevelreiniging"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Gevelreiniging
                                </Link>
                                <span className="text-gray-300">•</span>
                                <Link
                                    to="/projecten"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Projecten
                                </Link>
                                <span className="text-gray-300">•</span>
                                <Link
                                    to="/winkel"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Webshop
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageTransition>
    );
};

export default NotFound;


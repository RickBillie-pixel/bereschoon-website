import React from 'react';
import { ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CallToAction = ({
    title = "Klaar om uw oprit",
    highlight = "professioneel te laten reinigen?",
    description = "Plan direct een inspectie in en ontvang binnen 24 uur een voorstel op maat. Wij zorgen dat alles weer straalt."
}) => {
    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Advanced Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-xs uppercase tracking-widest mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        PLAN DIRECT EEN AFSPRAAK
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight"
                    >
                        {title}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                            {highlight}
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-light"
                    >
                        {description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center gap-8"
                    >
                        <Link
                            to="/contact"
                            className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-bold text-white transition-all duration-200 bg-primary rounded-2xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1"
                        >
                            <span>Vraag vrijblijvende offerte aan</span>
                            <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>

                        <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-primary" />
                                <span>Binnen 24 uur reactie</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-primary" />
                                <span>Geen verkoopdruk</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-primary" />
                                <span>Gratis advies op locatie</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;

import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, User, Star } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';

const Contact = () => {
    return (
        <PageTransition>
            <SEO
                title="Contact"
                description="Neem contact op met Bereschoon voor al uw vragen over buitenreiniging. Wij staan u graag te woord."
                breadcrumbs={[
                    { name: 'Home', url: 'https://bereschoon.nl' },
                    { name: 'Contact', url: 'https://bereschoon.nl/contact' }
                ]}
            />
            <section className="pt-32 pb-24 min-h-screen bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
                        {/* Left Column - Clean, Unified Text Block */}
                        <div className="flex flex-col h-full lg:pt-8">
                            {/* Main Header Group */}
                            <div className="mb-8">
                                <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6 leading-tight">
                                    Persoonlijk contact met Bereschoon
                                </h1>
                                <p className="text-lg text-stone-600 leading-relaxed max-w-lg">
                                    Professionele buitenreiniging voor particulieren en bedrijven. U spreekt direct met een specialist.
                                </p>
                            </div>

                            {/* Trust Indicators - Single Line, Subtle */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-secondary font-medium mb-12">
                                <a
                                    href="https://www.google.com/search?q=Bereschoon+Helmond+reviews"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                >
                                    <div className="flex text-yellow-500 text-base">★★★★★</div>
                                    <span className="font-bold">5.0/5</span>
                                    <span className="text-stone-500 font-normal">op Google</span>
                                </a>
                                <span className="text-stone-300 hidden sm:inline">•</span>
                                <span>150+ projecten</span>
                                <span className="text-stone-300 hidden sm:inline">•</span>
                                <span>3+ jaar ervaring</span>
                                <span className="text-stone-300 hidden sm:inline">•</span>
                                <span>100% Tevredenheid</span>
                            </div>

                            {/* Intro Text */}
                            <p className="text-stone-600 leading-relaxed mb-6 max-w-lg">
                                Bereschoon is actief door heel Nederland met eigen materieel en vakmensen. Kwaliteit en langdurig resultaat staan centraal.
                            </p>

                            {/* Direct Contact - Simple List */}
                            <div className="space-y-4 mb-6">
                                <a href="tel:+31639494059" className="flex items-center gap-4 text-secondary hover:text-primary transition-colors group w-fit">
                                    <Phone className="text-stone-400 group-hover:scale-110 transition-transform" size={16} />
                                    <span className="font-semibold text-lg">+31 (0)6 3949 4059</span>
                                </a>
                                <a href="mailto:info@bereschoon.nl" className="flex items-center gap-4 text-secondary hover:text-primary transition-colors group w-fit">
                                    <Mail className="text-stone-400 group-hover:scale-110 transition-transform" size={16} />
                                    <span className="font-semibold text-lg">info@bereschoon.nl</span>
                                </a>
                                <div className="flex items-center gap-4 text-secondary">
                                    <MapPin className="text-stone-400" size={16} />
                                    <span className="font-medium">Helmond, Nederland</span>
                                </div>
                            </div>

                            {/* Human Touch & Visual Anchor */}
                            <div className="flex items-center gap-5 mb-8">
                                <img
                                    src="/images/Barend.png"
                                    alt="Uw specialist"
                                    className="w-16 h-16 object-cover rounded-2xl shadow-sm border border-stone-100"
                                />
                                <div className="flex items-center gap-3 text-stone-500">
                                    <User size={16} className="text-stone-400" />
                                    <span>U spreekt direct met ons team — persoonlijk contact.</span>
                                </div>
                            </div>

                            {/* Footer/Legal Details */}
                            <div className="mt-auto pt-6 text-xs text-stone-400 flex gap-6">
                                <span>KVK: 91411629</span>
                                <span>BTW: NL91411629B01</span>
                            </div>
                        </div>

                        {/* Right Column - Contact Form */}
                        {/* Clean white card, soft shadow, NO colored top border */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </PageTransition>
    );
};

export default Contact;

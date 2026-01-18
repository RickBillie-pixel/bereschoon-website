import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, User, Star, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import CallToAction from '../components/CallToAction';

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
            {/* Added a subtle premium gradient background */}
            <section className="pt-32 pb-24 min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 relative overflow-hidden">

                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    {/* 
                        Grid Layout Strategy:
                        Mobile: Flex column or Grid 1-col with order.
                        Order: Header -> Form -> Info
                        Desktop: Grid 2-cols.
                        Left Col: Header, Spacer, Info
                        Right Col: Form
                    */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-24 items-stretch">

                        {/* 1. HEADER (Mobile Order 1, Desktop Top-Left) */}
                        <div className="order-1 flex flex-col justify-start">
                            <div className="mb-0 lg:mb-10">
                                <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/5 text-secondary text-sm font-medium mb-6">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Direct antwoord binnen 24 uur
                                </div>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-secondary mb-4 lg:mb-6 leading-tight">
                                    Persoonlijk contact met <span className="text-primary">Bereschoon</span>
                                </h1>
                                <p className="hidden lg:block text-lg text-stone-600 leading-relaxed max-w-lg">
                                    Professionele buitenreiniging voor particulieren en bedrijven. Wij geloven in heldere communicatie en korte lijntjes.
                                </p>
                            </div>
                        </div>

                        {/* 2. FORM (Mobile Order 2, Desktop Right Col Spanning Full Height) */}
                        <div className="order-2 lg:row-span-2 lg:col-start-2 relative h-full">
                            {/* Decorative elements behind the form */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-3xl blur-lg -z-10" />

                            <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden h-full flex flex-col">
                                <div className="bg-secondary/5 px-8 py-4 border-b border-stone-100 flex-shrink-0">
                                    <p className="text-sm font-medium text-secondary flex items-center gap-2">
                                        <Clock size={16} />
                                        Gemiddelde reactietijd: &lt; 2 uur
                                    </p>
                                </div>
                                <div className="flex-grow">
                                    <ContactForm />
                                </div>
                            </div>
                        </div>

                        {/* 3. INFO & CARDS (Mobile Order 3, Desktop Bottom-Left) */}
                        <div className="order-3 flex flex-col justify-end h-full">
                            {/* Contact Details Cards */}
                            <div className="grid sm:grid-cols-2 gap-4 mb-10">
                                <a href="tel:+31639494059" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-stone-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Bel ons direct</span>
                                        <span className="font-bold text-secondary group-hover:text-primary transition-colors">+31 (0)6 3949 4059</span>
                                    </div>
                                </a>

                                <a href="mailto:info@bereschoon.nl" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-stone-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
                                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform flex-shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Stuur een e-mail</span>
                                        <span className="font-bold text-secondary group-hover:text-primary transition-colors">info@bereschoon.nl</span>
                                    </div>
                                </a>

                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-stone-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all group sm:col-span-2">
                                    <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 group-hover:scale-110 transition-transform flex-shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Locatie</span>
                                        <span className="font-bold text-secondary">Christiaan Huygenslaan 10a, 5707 RT Helmond</span>
                                    </div>
                                </div>
                            </div>

                            {/* Feature List aligned to bottom */}
                            <div className="space-y-8">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-stone-600">
                                        <CheckCircle2 size={18} className="text-primary" />
                                        <span>Gratis en vrijblijvende offerte</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-stone-600">
                                        <CheckCircle2 size={18} className="text-primary" />
                                        <span>Binnen 24 uur reactie</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-stone-600">
                                        <CheckCircle2 size={18} className="text-primary" />
                                        <span>Actief in heel Nederland</span>
                                    </li>
                                </ul>

                                <div className="pt-6 border-t border-stone-200/50 text-xs text-stone-400 flex flex-wrap gap-6">
                                    <span>KVK: 91411629</span>
                                    <span>BTW: NL91411629B01</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* New CTA Section */}
            <CallToAction
                title="Benieuwd naar het"
                highlight="resultaat?"
                description="Bekijk onze projecten pagina om te zien wat we voor andere klanten hebben betekend."
                buttonText="Bekijk onze projecten"
                href="/projecten"
            />
        </PageTransition>
    );
};

export default Contact;

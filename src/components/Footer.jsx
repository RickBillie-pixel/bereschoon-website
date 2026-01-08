import React from 'react';
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-secondary text-white pt-16 pb-8 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-4">
                        <img src="/images/logo.png" alt="Bereschoon" className="h-16 w-auto mb-4" />
                        <p className="text-stone-300 text-sm leading-relaxed max-w-xs">
                            Professionele externe reiniging voor een stralend resultaat. Wij tillen uw vastgoed naar een hoger niveau.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Diensten</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-white transition-colors">Dak Reiniging</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Gevel Reiniging</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Bestrating</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Zonnepanelen</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Bedrijf</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-white transition-colors">Over Ons</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Projecten</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li className="flex items-center space-x-3">
                                <MapPin size={16} />
                                <span>Amsterdam, Nederland</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={16} />
                                <span>info@bereschoon.nl</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={16} />
                                <span>+31 (0)6 1234 5678</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Bereschoon. Alle rechten voorbehouden.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Instagram size={20} /></a>
                        <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Facebook size={20} /></a>
                        <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        if (isHome) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const navLinks = ['Diensten', 'Over Ons', 'Projecten', 'Reviews', 'Winkel'];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHome
                ? 'bg-white/80 backdrop-blur-md shadow-sm py-4'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img src="/images/logo.png" alt="Bereschoon" className="h-20 w-auto object-contain transition-transform hover:scale-105" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((item) => {
                        const id = item.toLowerCase().replace(' ', '');
                        return isHome ? (
                            <a
                                key={item}
                                href={`#${id}`}
                                className={`text-sm font-medium transition-colors relative group ${isScrolled || !isHome ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'}`}
                            >
                                {item}
                                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ) : (
                            <Link
                                key={item}
                                to={`/#${id}`}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                            >
                                {item}
                                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        );
                    })}

                    <Link
                        to="/configurator"
                        className={`text-sm font-medium transition-colors relative group ${isScrolled || !isHome ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'}`}
                    >
                        AI Oprit Scan
                        <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </Link>

                    <Link
                        to="/configurator"
                        className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/50"
                    >
                        Offerte Aanvragen
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-foreground"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 animate-in slide-in-from-top-5 max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-col space-y-4">
                        {navLinks.map((item) => {
                            const id = item.toLowerCase().replace(' ', '');
                            return isHome ? (
                                <a key={item} href={`#${id}`} className="text-base font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                                    {item}
                                </a>
                            ) : (
                                <Link key={item} to={`/#${id}`} className="text-base font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                                    {item}
                                </Link>
                            );
                        })}
                        <Link to="/configurator" className="text-base font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                            AI Oprit Scan
                        </Link>
                        <Link to="/configurator" className="bg-primary text-white px-5 py-3 rounded-full text-base font-medium w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>
                            Offerte Aanvragen
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

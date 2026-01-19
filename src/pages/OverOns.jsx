import React, { useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { MapPin, ArrowRight, Instagram, Facebook, Youtube } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight } from '../utils/animations';
import SEO from '../components/SEO';
import LogoMarquee from '../components/LogoMarquee';

// Animated counter component
const AnimatedCounter = ({ value, suffix = '', inView }) => {
    const spring = useSpring(0, {
        stiffness: 50,
        damping: 20,
        duration: 2000
    });

    const display = useTransform(spring, (current) => Math.floor(current));

    React.useEffect(() => {
        if (inView) {
            spring.set(value);
        }
    }, [inView, spring, value]);

    return (
        <span className="tabular-nums">
            <motion.span>{display}</motion.span>
            {suffix}
        </span>
    );
};

const stats = [
    { value: 250, suffix: '+', label: 'Opritten & Terrassen', description: 'Bereschoon gemaakt' },
    { value: 2000, suffix: '+', label: 'Uren Gereinigd', description: 'Met passie en precisie' },
    { value: 50000, suffix: '+', label: 'Volgers', description: 'Op sociale media' },
];

const collaborationLogos = [
    "/images/company-logos/logo1.webp",
    "/images/company-logos/logo2.webp",
    "/images/company-logos/logo3.webp",
    "/images/company-logos/logo4.webp",
    "/images/company-logos/logo5.webp",
    "/images/company-logos/logo6.webp",
    "/images/company-logos/logo7.webp",
    "/images/company-logos/logo8.webp",
    "/images/company-logos/logo9.webp",
    "/images/company-logos/logo10.webp"
];

// Mission & Vision Card Component
const MissionVisionCard = ({ title, text, highlight, variant, inView }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

    // Extract highlighted text
    const parts = text.split(highlight);
    const beforeHighlight = parts[0];
    const afterHighlight = parts[1];

    return (
        <motion.div
            ref={cardRef}
            variants={variant === 'left' ? fadeInLeft : fadeInRight}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative group"
        >
            <motion.div
                className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 overflow-hidden h-full"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* Gradient background on hover */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                />

                {/* Animated border on hover */}
                <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                        background: isHovered
                            ? 'linear-gradient(135deg, rgba(132, 204, 22, 0.2), rgba(6, 182, 212, 0.1))'
                            : 'transparent',
                    }}
                    initial={false}
                />

                {/* Content */}
                <div className="relative z-10">
                    {/* Title with accent line */}
                    <div className="mb-6">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                            {title}
                        </h3>
                        <motion.div
                            className="h-1 bg-gradient-to-r from-primary to-cyan-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={inView ? { width: '100%' } : { width: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        />
                    </div>

                    {/* Text with highlight */}
                    <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                        "{beforeHighlight}
                        <span className="text-foreground font-semibold bg-primary/10 px-1.5 py-0.5 rounded">
                            {highlight}
                        </span>
                        {afterHighlight}"
                    </p>

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="w-24 h-24 bg-primary rounded-full blur-2xl" />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const OverOns = () => {
    const statsRef = useRef(null);
    const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
    const missionRef = useRef(null);
    const missionInView = useInView(missionRef, { once: true, amount: 0.3 });

    return (
        <PageTransition>
            <SEO
                title="Over Ons"
                description="Bereschoon is uw specialist in buitenreiniging. Leer meer over onze missie, visie en het team achter de schermen."
                breadcrumbs={[
                    { name: 'Home', url: 'https://bereschoon.nl' },
                    { name: 'Over Ons', url: 'https://bereschoon.nl/over-ons' }
                ]}
            />
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center bg-secondary overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.h1
                                variants={fadeInUp}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                            >
                                Maak kennis met{' '}
                                <span className="text-primary">Beer</span>
                            </motion.h1>

                            <motion.p
                                variants={fadeInUp}
                                className="text-lg text-white/70 leading-relaxed mb-8"
                            >
                                Mijn naam is <span className="text-white font-semibold">Barend Seijkens</span> (23),
                                oftewel 'Beer'. Hierdoor is ook de naam <span className="text-primary font-semibold">'Bereschoon'</span> ontstaan!
                                Ik woon in Helmond (Noord-Brabant).
                            </motion.p>

                            <motion.p
                                variants={fadeInUp}
                                className="text-white/60 leading-relaxed mb-8"
                            >
                                Na vele opritten en terrassen gratis gereinigd te hebben, is de onderneming 'Bereschoon' ontstaan.
                                Reizend door heel het land reinigt Beer opritten, terrassen, looppaden, pleinen, fietspaden,
                                terreinen en nog veel meer!
                            </motion.p>

                            <motion.div
                                variants={fadeInUp}
                                className="flex flex-wrap gap-4 mb-8"
                            >
                                <a
                                    href="/contact"
                                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
                                >
                                    Offerte Aanvragen
                                    <ArrowRight size={18} />
                                </a>
                                <div className="flex items-center gap-2 text-white/60">
                                    <MapPin size={18} className="text-primary" />
                                    <span>Voornamelijk werkzaam in Zuid-Nederland</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Photo - positioned behind wave */}
                        <motion.div
                            variants={fadeInRight}
                            initial="hidden"
                            animate="visible"
                            className="relative z-0"
                            style={{ marginBottom: '-80px' }}
                        >
                            <div className="relative">
                                {/* Decorative elements */}
                                <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                                <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl" />

                                {/* Photo container - simple, no glass effect */}
                                <img
                                    src="/images/Barend.png"
                                    alt="Barend 'Beer' Seijkens - Oprichter Bereschoon"
                                    className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Wave divider - original simple version, on top of photo */}
                <div className="absolute bottom-0 left-0 right-0 z-10">
                    <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 100V60C240 20 480 0 720 20C960 40 1200 80 1440 60V100H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Collaborations Ribbon (subtle) */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="max-w-6xl lg:max-w-7xl mx-auto text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3">
                            Merken & Samenwerkingen
                        </p>
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                            Vertrouwd door partners en leveranciers
                        </h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                            Een greep uit de merken waar we mee samenwerken en waarvan we trots de producten inzetten voor onze projecten.
                        </p>
                        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-r from-white via-gray-50 to-white shadow-sm">
                            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,rgba(132,204,22,0.08),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(6,182,212,0.08),transparent_45%)]" />
                            <div className="relative py-6 px-4">
                                <LogoMarquee logos={collaborationLogos} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Social Media & Collaborations Section */}
            <section className="py-8 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-xl font-bold text-foreground mb-2">
                            Volg Beer op social media
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Voor samenwerkingen, stuur een e-mail naar{' '}
                            <a href="mailto:info@bereschoon.nl" className="text-primary font-semibold hover:underline">
                                info@bereschoon.nl
                            </a>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-left">
                            {[
                                {
                                    label: 'Instagram',
                                    href: 'https://www.instagram.com/bereschoon',
                                    handle: '@bereschoon',
                                    cta: 'Bekijk projecten & reels',
                                    Icon: Instagram,
                                    iconColor: '#E1306C',
                                    accentClass: 'bg-[linear-gradient(135deg,rgba(245,133,41,0.10),rgba(221,42,123,0.10),rgba(129,52,175,0.08))]',
                                },
                                {
                                    label: 'TikTok',
                                    href: 'https://www.tiktok.com/@bereschoon',
                                    handle: '@bereschoon',
                                    cta: 'Korte video’s & resultaten',
                                    customIcon: (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#000000]">
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                        </svg>
                                    ),
                                    accentClass: 'bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.10),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(0,0,0,0.06),transparent_55%)]',
                                },
                                {
                                    label: 'YouTube',
                                    href: 'https://www.youtube.com/@bereschoon',
                                    handle: '@bereschoon',
                                    cta: 'Langere uitleg & tips',
                                    Icon: Youtube,
                                    iconColor: '#FF0000',
                                    accentClass: 'bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.10),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(239,68,68,0.06),transparent_55%)]',
                                },
                                {
                                    label: 'Facebook',
                                    href: 'https://www.facebook.com/p/Bereschoon-100094353067993/',
                                    handle: 'Bereschoon',
                                    cta: 'Updates & contact',
                                    Icon: Facebook,
                                    iconColor: '#1877F2',
                                    accentClass: 'bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.10),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.06),transparent_55%)]',
                                },
                            ].map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.label}
                                    className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                >
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${item.accentClass}`} />
                                    <div className="relative p-4 md:p-5 flex items-center gap-3">
                                        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-secondary/5 border border-secondary/10">
                                            {item.Icon ? <item.Icon size={18} className={item.iconColor ? '' : 'text-foreground'} style={item.iconColor ? { color: item.iconColor } : {}} /> : item.customIcon}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-base font-semibold text-foreground tracking-tight">{item.label}</span>
                                                <span className="text-sm text-muted-foreground truncate">{item.handle}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 mt-0.5">
                                                <span className="text-sm text-muted-foreground">{item.cta}</span>
                                                <ArrowRight size={16} className="text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex-shrink-0" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white" ref={statsRef}>
                <div className="container mx-auto px-6">
                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        animate={statsInView ? "visible" : "hidden"}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="text-center p-8 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
                                    <AnimatedCounter
                                        value={stat.value}
                                        suffix={stat.suffix}
                                        inView={statsInView}
                                    />
                                </div>
                                <div className="text-xl font-semibold text-foreground mb-1">
                                    {stat.label}
                                </div>
                                <div className="text-muted-foreground">
                                    {stat.description}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-24 bg-gradient-to-b from-white via-muted/20 to-white" ref={missionRef}>
                <div className="container mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={missionInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Onze Drijfveer
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Met passie voor schone buitenruimtes en respect voor het milieu
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {/* Mission */}
                        <MissionVisionCard
                            title="Missie"
                            text="Het creëren van schone en veilige buitenruimtes met het gebruik van duurzame en milieuvriendelijke reinigingsoplossingen, terwijl we de hoogste klanttevredenheid nastreven."
                            highlight="duurzame en milieuvriendelijke reinigingsoplossingen"
                            variant="left"
                            inView={missionInView}
                        />

                        {/* Vision */}
                        <MissionVisionCard
                            title="Visie"
                            text="Dé toonaangevende dienstverlener te zijn in milieuvriendelijke reiniging van buitenruimtes in Nederland, waarbij we een positieve impact maken op het milieu en bijdragen aan een schonere en duurzamere toekomst voor iedereen."
                            highlight="milieuvriendelijke reiniging van buitenruimtes"
                            variant="right"
                            inView={missionInView}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-secondary">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="max-w-3xl mx-auto text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Benieuwd wat Beer voor u kan betekenen?
                        </h2>
                        <p className="text-white/70 text-lg mb-8">
                            Vraag vrijblijvend een offerte aan. En wie weet staat Bereschoon binnenkort bij u op de oprit!
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
                        >
                            Offerte Aanvragen
                            <ArrowRight size={20} />
                        </a>
                    </motion.div>
                </div>
            </section>
        </PageTransition>
    );
};

export default OverOns;


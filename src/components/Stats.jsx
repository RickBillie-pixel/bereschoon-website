import React from 'react';
import { Droplets, Star, Trophy, ShieldCheck, Sparkles, Waves } from 'lucide-react';

const stats = [
    { value: '150+', label: 'Projecten Voltooid', icon: Trophy, color: 'text-yellow-400' },
    { value: '3+', label: 'Jaren Ervaring', icon: Waves, color: 'text-cyan-400' },
    { value: '4.8', label: 'Gemiddelde Score', icon: Star, color: 'text-orange-400' },
    { value: '100%', label: 'Bereschoon', icon: Sparkles, color: 'text-white' },
];

const ClawScratch = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <path d="M10,0 Q20,50 10,100 L0,100 Q10,50 0,0 Z" opacity="0.4" />
        <path d="M30,5 Q40,55 30,105 L20,105 Q30,55 20,5 Z" opacity="0.6" />
        <path d="M50,0 Q60,50 50,100 L40,100 Q50,50 40,0 Z" opacity="0.5" />
    </svg>
);

const Stats = () => {
    return (
        <section className="bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900 py-24 text-white border-b border-white/5 relative overflow-hidden">

            {/* Pressure Washer Mist / Steam Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent opacity-60"></div>

            {/* Animated Bubbles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="animate-bubble absolute bg-white/10 rounded-full border border-white/20 backdrop-blur-sm"
                        style={{
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 40 + 10}px`,
                            height: `${Math.random() * 40 + 10}px`,
                            animationDuration: `${Math.random() * 10 + 10}s`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="relative group p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover-lift hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] text-center">

                            {/* Inner Glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                {/* Icon Bubble */}
                                <div className="mb-4 relative">
                                    <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                                    <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center border border-white/20 group-hover:border-cyan-400/50 transition-colors">
                                        <stat.icon size={28} className={`${stat.color} drop-shadow-md`} />
                                    </div>
                                    <Droplets size={12} className="absolute -top-1 -right-1 text-cyan-300 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500" />
                                </div>

                                <div className="text-4xl md:text-5xl font-black mb-2 tracking-tight text-white drop-shadow-lg">
                                    {stat.value}
                                </div>
                                <div className="text-sm md:text-base text-cyan-100/70 font-bold uppercase tracking-widest group-hover:text-cyan-100 transition-colors">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;

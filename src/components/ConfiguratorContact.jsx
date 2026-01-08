import React, { useState, useRef } from 'react';
import { Upload, Camera, Check, ArrowRight, Loader2, Mail, User, Phone, MapPin, Sparkles } from 'lucide-react';

const ConfiguratorContact = () => {
    const [step, setStep] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedService, setSelectedService] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setStep(2);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setStep(3);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setStep(4);
    };

    return (
        <section id="contact" className="py-24 bg-secondary text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 p-32 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 p-32 bg-accent/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute inset-0 pattern-grid-lg opacity-10"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6">
                        <Sparkles size={16} className="text-primary" />
                        <span className="text-sm font-medium tracking-wide">AI Oprit Configurator</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Vraag direct uw offerte aan</h2>
                    <p className="text-lg text-stone-300 max-w-2xl mx-auto">
                        Doorloop de stappen, upload een foto en ontvang direct een indicatie en voorbeeld van het resultaat in uw mail.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                    {/* Left Side: Visual/Preview */}
                    <div className="md:w-5/12 bg-black/40 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                        {selectedImage ? (
                            <>
                                <img src={selectedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                <div className="relative z-10 bg-black/60 p-6 rounded-2xl backdrop-blur-md border border-white/10">
                                    <div className="text-primary font-bold mb-2 uppercase tracking-wider text-xs">Uw Situatie</div>
                                    <h3 className="text-xl font-bold text-white mb-2">Analyse Voltooid</h3>
                                    <div className="flex justify-center space-x-1 text-primary">
                                        {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} size={12} className={i <= step ? "opacity-100" : "opacity-30"} />)}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                    <Camera size={32} className="text-white/70" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Upload uw foto</h3>
                                <p className="text-sm text-stone-400">
                                    Wij analyseren het oppervlak en berekenen de beste behandeling.
                                </p>
                            </div>
                        )}

                        {/* Progress Steps */}
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4 px-8">
                            {[1, 2, 3, 4].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary shadow-[0_0_10px_rgba(132,204,22,0.5)]' : 'bg-white/20'}`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Interactive Form */}
                    <div className="md:w-7/12 p-8 md:p-12 relative flex flex-col">

                        {step === 1 && (
                            <div className="flex-grow flex flex-col justify-center animate-in slide-in-from-right-8 duration-500">
                                <h3 className="text-2xl font-bold mb-8">Stap 1: Upload een foto</h3>

                                <div
                                    className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-primary hover:bg-white/5 transition-all cursor-pointer group"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Upload size={28} className="text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <p className="text-lg font-medium text-white mb-2">Klik om te uploaden</p>
                                    <p className="text-sm text-stone-400">of sleep uw bestand hierheen</p>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="mt-8 text-sm text-stone-400 hover:text-white underline text-center"
                                >
                                    Sla deze stap over
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex-grow flex flex-col justify-center animate-in slide-in-from-right-8 duration-500">
                                <h3 className="text-2xl font-bold mb-8">Stap 2: Wat wilt u reinigen?</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: 'terras', label: 'Terras / Bestrating', desc: 'Verwijderen van onkruid en aanslag' },
                                        { id: 'gevel', label: 'Gevel / Muren', desc: 'Softwash of hogedruk reiniging' },
                                        { id: 'dak', label: 'Dakpannen', desc: 'Mos en algen verwijdering' },
                                        { id: 'overig', label: 'Overig / Speciaal', desc: 'Maatwerk oplossingen' }
                                    ].map((option) => (
                                        <div
                                            key={option.id}
                                            onClick={() => handleServiceSelect(option.id)}
                                            className="p-5 border border-white/10 rounded-xl hover:bg-white/5 hover:border-primary/50 cursor-pointer transition-all hover-lift group text-left"
                                        >
                                            <div className="w-4 h-4 rounded-full border border-white/30 group-hover:border-primary mb-3 flex items-center justify-center">
                                                {selectedService === option.id && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                                            </div>
                                            <h4 className="font-bold text-white mb-1">{option.label}</h4>
                                            <p className="text-xs text-stone-400">{option.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setStep(1)}
                                    className="mt-8 text-sm text-stone-400 hover:text-white flex items-center justify-center"
                                >
                                    Terug naar vorige stap
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="flex-grow flex flex-col justify-center animate-in slide-in-from-right-8 duration-500">
                                <h3 className="text-2xl font-bold mb-6">Stap 3: Uw gegevens</h3>
                                <p className="text-stone-300 text-sm mb-8">
                                    Vul uw gegevens in zodat wij de offerte en het voorbeeld naar u kunnen sturen.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                        <input
                                            type="text" name="name" placeholder="Uw Naam" required
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-stone-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                        <input
                                            type="email" name="email" placeholder="E-mailadres" required
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-stone-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                        <input
                                            type="tel" name="phone" placeholder="Telefoonnummer (optioneel)"
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-stone-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/40 mt-4 flex items-center justify-center btn-shine"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 size={24} className="animate-spin" />
                                        ) : (
                                            <>Verstuur Aanvraag <ArrowRight size={20} className="ml-2" /></>
                                        )}
                                    </button>
                                </form>
                                <button
                                    onClick={() => setStep(2)}
                                    className="mt-6 text-sm text-stone-400 hover:text-white flex items-center justify-center"
                                >
                                    Terug naar vorige stap
                                </button>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="flex-grow flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-500">
                                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/10">
                                    <Check size={48} className="text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Aanvraag Ontvangen!</h3>
                                <p className="text-stone-300 text-lg mb-8 max-w-md">
                                    Bedankt {formData.name}. We hebben uw gegevens en foto ontvangen. U ontvangt binnen 24 uur een vrijblijvende offerte en voorbeeldfoto in uw mailbox.
                                </p>
                                <button
                                    onClick={() => { setStep(1); setSelectedImage(null); }}
                                    className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
                                >
                                    Nieuwe aanvraag starten
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConfiguratorContact;

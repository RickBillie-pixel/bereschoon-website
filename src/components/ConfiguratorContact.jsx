import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Camera, Check, ArrowRight, Loader2, Mail, User, Phone, MapPin, Sparkles } from 'lucide-react';
import BeforeAfterCarousel from './BeforeAfterCarousel';
import CallToAction from './CallToAction';
import { heroStagger, heroText } from '../utils/animations';

const ConfiguratorContact = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // Store original file for upload
    const [selectedService, setSelectedService] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Store original file for later upload
            setSelectedFile(file);
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
        setError(null);

        try {
            // Get edge function URL from environment variable
            const edgeFunctionUrl = import.meta.env.VITE_SUPABASE_EDGE_FUNCTION_URL;

            if (!edgeFunctionUrl) {
                throw new Error('Edge function URL is not configured. Please set VITE_SUPABASE_EDGE_FUNCTION_URL in your .env file.');
            }

            console.log('Submitting to:', edgeFunctionUrl);

            // Create FormData
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            if (formData.phone) {
                formDataToSend.append('phone', formData.phone);
            }
            if (formData.address) {
                formDataToSend.append('address', formData.address);
            }
            // Always send service - should be set in step 2 (terras, gevel, dak, or overig)
            // Send empty string if not selected (should not happen if user went through step 2)
            formDataToSend.append('service', selectedService || '');

            // Handle photo upload
            // Use original file if available, otherwise convert base64 to File
            let photoFile = selectedFile;

            if (!photoFile && selectedImage) {
                // Convert base64 data URL to File object
                const base64Data = selectedImage.split(',')[1]; // Remove data:image/...;base64, prefix
                const mimeType = selectedImage.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mimeType });
                const fileName = `photo-${Date.now()}.jpg`;
                photoFile = new File([blob], fileName, { type: mimeType });
            }

            if (photoFile) {
                formDataToSend.append('photo', photoFile);
            } else {
                throw new Error('Foto is verplicht. Upload een foto in stap 1.');
            }

            console.log('Sending FormData with:', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                service: selectedService,
                hasPhoto: !!photoFile
            });

            // Send to Supabase edge function
            const response = await fetch(edgeFunctionUrl, {
                method: 'POST',
                body: formDataToSend,
            });

            console.log('Response status:', response.status);

            const result = await response.json();
            console.log('Response data:', result);

            if (!response.ok) {
                throw new Error(result.error || 'Er is een fout opgetreden bij het verzenden van uw aanvraag.');
            }

            // Success - move to step 4
            setStep(4);
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.message || 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-secondary text-white relative overflow-hidden flex flex-col">
            {/* 1. Hero Section */}
            <section className="relative pt-28 pb-28 md:pt-32 md:pb-32 px-6 overflow-visible flex flex-col justify-center min-h-[100vh] md:min-h-0">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 p-32 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-0 p-32 bg-accent/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute inset-0 pattern-grid-lg opacity-10"></div>

                <motion.div
                    className="container mx-auto relative z-10 text-center max-w-4xl"
                    variants={heroStagger}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={heroText} className="inline-flex items-center space-x-2 border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-1.5 md:px-5 md:py-2 rounded-full mb-6 md:mb-8 hover:border-primary/50 transition-colors">
                        <Sparkles size={16} className="text-primary" />
                        <span className="text-xs md:text-sm font-medium tracking-wide text-gray-200">Reinigingsscan & Advies</span>
                    </motion.div>

                    <motion.h1 variants={heroText} className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 tracking-tighter text-white drop-shadow-lg max-w-5xl mx-auto leading-tight">
                        <span className="block md:whitespace-nowrap">Ontvang direct een indicatie</span>
                        <span className="block md:whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">van uw reiniging</span>
                    </motion.h1>

                    <motion.p variants={heroText} className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
                        Doorloop de stappen, upload een foto en ontvang direct een indicatie en voorbeeld van het resultaat in uw mail.
                    </motion.p>

                    {/* Mobile Only: Navigation Buttons */}
                    <motion.div variants={heroText} className="flex flex-col gap-4 mt-8 md:hidden px-6">
                        <button
                            onClick={() => document.getElementById('keuzehulp').scrollIntoView({ behavior: 'smooth' })}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center"
                        >
                            Start Scan <ArrowRight size={20} className="ml-2" />
                        </button>
                        <button
                            onClick={() => navigate('/projecten')}
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-4 rounded-xl font-bold hover:bg-white/20 transition-all"
                        >
                            Bekijk Projecten
                        </button>
                    </motion.div>
                </motion.div>
            </section>

            {/* 2. Configurator Tool Section (Overlapping) */}
            <section id="keuzehulp" className="relative z-20 px-4 md:px-6 mt-0 md:-mt-20 pb-24 scroll-mt-32">
                <div className="max-w-5xl mx-auto bg-secondary/80 md:bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row flex-grow ring-1 ring-white/5">

                    {/* Left Side: Visual/Preview */}
                    <div className="md:w-5/12 relative bg-black/40 flex flex-col justify-center items-center text-center overflow-hidden h-[250px] md:h-auto border-b md:border-b-0 md:border-r border-white/10 group">
                        {selectedImage ? (
                            <>
                                <img src={selectedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-100 transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                                <div className="absolute top-4 right-4 z-10">
                                    <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg">
                                        <div className="text-primary font-bold uppercase tracking-wider text-[10px]">
                                            {step < 3 ? 'Beeldanalyse...' : 'Analyse Voltooid'}
                                        </div>
                                        <div className="flex space-x-0.5 text-primary">
                                            {[1, 2, 3].map(i => <Sparkles key={i} size={8} className={step < 3 ? "animate-pulse" : ""} />)}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="relative z-10 p-8">
                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse ring-4 ring-white/5">
                                    <Camera size={32} className="text-white/70" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Upload uw foto</h3>
                                <p className="text-sm text-stone-400 max-w-[200px] mx-auto">
                                    Wij analyseren het oppervlak en berekenen de beste behandeling.
                                </p>
                            </div>
                        )}


                        {/* Progress Steps */}
                        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center space-x-2 md:space-x-4 px-8 z-20">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1 md:h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary shadow-[0_0_10px_rgba(132,204,22,0.5)]' : 'bg-white/20'}`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Interactive Form */}
                    <div className="md:w-7/12 p-5 md:p-10 relative flex flex-col min-h-[400px] bg-gradient-to-b from-transparent to-black/20">

                        {step === 1 && (
                            <div className="flex-grow flex flex-col justify-center animate-in slide-in-from-right-8 duration-500 py-4">
                                <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm border border-primary/20">1</span>
                                    Upload een foto
                                </h3>

                                <div
                                    className="border-2 border-dashed border-white/20 rounded-2xl p-6 md:p-10 text-center hover:border-primary hover:bg-white/5 transition-all cursor-pointer group bg-black/20"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg ring-4 ring-white/5 group-hover:ring-primary/20">
                                        <Upload size={28} className="text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <p className="text-lg font-medium text-white mb-2">Klik om te uploaden</p>
                                    <p className="text-sm text-stone-400">of sleep uw bestand hierheen</p>
                                </div>

                                <button
                                    onClick={() => {
                                        setStep(2);
                                        // Reset file input if user skips
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                    className="mt-8 text-sm text-stone-400 hover:text-white underline text-center"
                                >
                                    Sla deze stap over
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex-grow flex flex-col justify-center animate-in slide-in-from-right-8 duration-500 py-4">
                                <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm border border-primary/20">2</span>
                                    Wat wilt u reinigen?
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    {[
                                        { id: 'terras', label: 'Terras / Bestrating', desc: 'Verwijderen van onkruid en aanslag' },
                                        { id: 'gevel', label: 'Gevel / Muren', desc: 'Softwash of hogedruk reiniging' },
                                        { id: 'dak', label: 'Dakpannen', desc: 'Mos en algen verwijdering' },
                                        { id: 'overig', label: 'Overig / Speciaal', desc: 'Maatwerk oplossingen' }
                                    ].map((option) => (
                                        <div
                                            key={option.id}
                                            onClick={() => handleServiceSelect(option.id)}
                                            className="p-3 md:p-4 border border-white/10 rounded-xl hover:bg-white/5 hover:border-primary/50 cursor-pointer transition-all hover-lift group text-left bg-black/20"
                                        >
                                            <div className="w-4 h-4 rounded-full border border-white/30 group-hover:border-primary mb-2 flex items-center justify-center">
                                                {selectedService === option.id && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                                            </div>
                                            <h4 className="font-bold text-sm md:text-base text-white mb-0.5">{option.label}</h4>
                                            <p className="text-[10px] md:text-xs text-stone-400 leading-tight">{option.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setStep(1)}
                                    className="mt-8 text-sm text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                                >
                                    <ArrowRight className="rotate-180 mr-2" size={14} />
                                    Terug naar vorige stap
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="flex-grow flex flex-col justify-center animate-in slide-in-from-right-8 duration-500 py-4">
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm border border-primary/20">3</span>
                                    Uw gegevens
                                </h3>
                                <p className="text-stone-300 text-sm mb-6 pl-11">
                                    Vul uw gegevens in zodat wij de offerte en het voorbeeld naar u kunnen sturen.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-300 text-sm">
                                            {error}
                                        </div>
                                    )}
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                        <input
                                            type="text" name="name" placeholder="Uw Naam" required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 md:py-3.5 pl-12 pr-4 text-white placeholder-stone-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm md:text-base"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                        <input
                                            type="email" name="email" placeholder="E-mailadres" required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 md:py-3.5 pl-12 pr-4 text-white placeholder-stone-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm md:text-base"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                        <input
                                            type="tel" name="phone" placeholder="Telefoonnummer (optioneel)"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 md:py-3.5 pl-12 pr-4 text-white placeholder-stone-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm md:text-base"
                                        />
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                        <input
                                            type="text" name="address" placeholder="Adres (optioneel)"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 md:py-3.5 pl-12 pr-4 text-white placeholder-stone-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm md:text-base"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-white py-3 md:py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/40 mt-4 flex items-center justify-center btn-shine disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    className="mt-6 text-sm text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                                >
                                    <ArrowRight className="rotate-180 mr-2" size={14} />
                                    Terug naar vorige stap
                                </button>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="flex-grow flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-500 py-8">
                                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/10">
                                    <Check size={48} className="text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Aanvraag Ontvangen!</h3>
                                <p className="text-stone-300 text-lg mb-8 max-w-md">
                                    Bedankt {formData.name}. We hebben uw gegevens en foto ontvangen. U ontvangt binnen 24 uur een vrijblijvende offerte en voorbeeldfoto in uw mailbox.
                                </p>
                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setSelectedImage(null);
                                        setSelectedFile(null);
                                        setSelectedService('');
                                        setFormData({ name: '', email: '', phone: '', address: '' });
                                        setError(null);
                                        // Reset file input
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                    className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
                                >
                                    Nieuwe aanvraag starten
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </section>

            {/* 3. Infinite Before/After Carousel */}
            <BeforeAfterCarousel />

            {/* 4. CTA Section */}
            <div className="relative z-10 bg-white">
                <CallToAction
                    title="Benieuwd naar"
                    highlight="uw mogelijkheden?"
                    description="Start de scan en ontvang direct een vrijblijvende indicatie op maat."
                    buttonText="Maak een indicatie"
                />
            </div>

        </div>
    );
};

export default ConfiguratorContact;

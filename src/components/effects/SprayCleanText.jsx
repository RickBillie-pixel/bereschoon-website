import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SprayCleanText Component
 * Een tekst component met een hogedruk spray schoonmaak effect bij hover
 * De tekst wordt letter voor letter "schoongespoten" met waterdruppels
 */
const SprayCleanText = ({
    children,
    className = '',
    dirtyColor = '#78716c', // stone-500
    cleanColor = '#ffffff',
    autoClean = false,
    autoDelay = 0,
    autoPath = [
        { x: 0.08, y: 0.05 },
        { x: 0.78, y: 0.48 },
        { x: 0.12, y: 0.92 },
    ],
    onAutoComplete,
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isAutoRunning, setIsAutoRunning] = useState(false);
    const [sprayPosition, setSprayPosition] = useState({ x: 0, y: 0 });
    const [cleanedProgress, setCleanedProgress] = useState(0); // 0 to 1 representing how much is cleaned
    const [droplets, setDroplets] = useState([]);
    const containerRef = useRef(null);
    const dropletIdRef = useRef(0);
    const autoRunRef = useRef({ rafId: null, timeoutId: null, lastDroplet: 0, hasRun: false });

    // Convert children to string and split into characters
    const text = typeof children === 'string' ? children : String(children);
    const characters = text.split('');

    // Check for mobile on mount and auto-clean if needed
    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth < 768) {
                setCleanedProgress(1);
            }
        };

        checkMobile();

        // Optional: listen for resize if we want it to be responsive
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const updateSprayAt = useCallback((x, y, rect, spawnDroplets = true) => {
        setSprayPosition({ x, y });

        const progress = Math.max(0, Math.min(1, x / rect.width));
        setCleanedProgress(prev => Math.max(prev, progress));

        if (spawnDroplets) {
            const now = performance.now();
            if (now - autoRunRef.current.lastDroplet < 65) return;
            autoRunRef.current.lastDroplet = now;

            const newDroplets = Array.from({ length: 5 }, () => ({
                id: dropletIdRef.current++,
                x: x + (Math.random() - 0.5) * 25,
                y: y + (Math.random() - 0.5) * 12,
                size: Math.random() * 10 + 4,
                angle: Math.random() * 360,
                velocity: Math.random() * 100 + 50,
                opacity: Math.random() * 0.4 + 0.6,
            }));

            setDroplets(prev => [...prev.slice(-70), ...newDroplets]);
        }
    }, []);

    // Track mouse position for spray effect
    const handleMouseMove = useCallback((e) => {
        if (isAutoRunning) return;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        updateSprayAt(x, y, rect, true);
    }, [isAutoRunning, updateSprayAt]);

    // Clean up old droplets when not hovering
    useEffect(() => {
        if (!isHovering) {
            const timer = setTimeout(() => setDroplets([]), 600);
            return () => clearTimeout(timer);
        }
    }, [isHovering]);

    // Automated cleaning path
    const startAutoClean = useCallback(() => {
        if (autoRunRef.current.hasRun) return;
        if (!containerRef.current) return;

        if (window.innerWidth < 768) {
            setCleanedProgress(1);
            autoRunRef.current.hasRun = true;
            onAutoComplete?.();
            return;
        }

        autoRunRef.current.hasRun = true;
        setIsAutoRunning(true);
        setIsHovering(true);
        setDroplets([]);
        autoRunRef.current.lastDroplet = 0;

        const rect = containerRef.current.getBoundingClientRect();
        const points = (autoPath && autoPath.length >= 2 ? autoPath : [
            { x: 0.08, y: 0.05 },
            { x: 0.78, y: 0.48 },
            { x: 0.12, y: 0.92 },
        ]).map(p => ({
            x: p.x * rect.width,
            y: p.y * rect.height,
        }));

        // Variabele duur per segment voor natuurlijke snelheidsvariatie
        const baseDuration = 1900;
        const segmentDurations = points.slice(1).map(() => 
            baseDuration * (0.7 + Math.random() * 0.6) // 70% tot 130% van basisduur
        );

        let segmentIndex = 0;
        let segmentStart = performance.now();
        let wobblePhase = Math.random() * Math.PI * 2; // Snelle wobble fase
        let verticalDriftPhase = Math.random() * Math.PI * 2; // Langzamere verticale drift
        const verticalDriftSpeed = 0.05 + Math.random() * 0.05; // 0.05 - 0.1 per frame
        const verticalDriftAmplitude = rect.height * 0.02; // 2% van hoogte
        let speedVariation = 1 + (Math.random() - 0.5) * 0.2; // Minder variatie voor rustiger gevoel

        // Easing functie voor natuurlijke beweging
        const easeInOutCubic = (t) => {
            return t < 0.5 
                ? 4 * t * t * t 
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const step = () => {
            const now = performance.now();
            const from = points[segmentIndex];
            const to = points[segmentIndex + 1];
            const segmentDuration = segmentDurations[segmentIndex];
            const elapsed = (now - segmentStart) * speedVariation;
            let t = Math.min(1, elapsed / segmentDuration);

            // Easing toepassen voor natuurlijke beweging
            const easedT = easeInOutCubic(t);

            // Basis interpolatie
            const baseX = from.x + (to.x - from.x) * easedT;
            const baseY = from.y + (to.y - from.y) * easedT;

            // Wobble effect - kleine variaties in y-positie
            wobblePhase += 0.12; // Iets langzamer wobble
            verticalDriftPhase += verticalDriftSpeed; // Langzame drift voor grotere slingers
            const wobbleAmount = Math.sin(wobblePhase) * (rect.height * 0.03); // Max 3% van hoogte
            const verticalDrift = Math.sin(verticalDriftPhase) * verticalDriftAmplitude; // Max 2% van hoogte
            const randomWobble = (Math.random() - 0.5) * (rect.height * 0.015); // Extra kleine random variatie
            
            // Kleine variatie in x voor natuurlijkere beweging
            const xVariation = (Math.random() - 0.5) * (rect.width * 0.01);

            const x = baseX + xVariation;
            const y = baseY + wobbleAmount + verticalDrift + randomWobble;

            updateSprayAt(x, y, rect, true);

            if (t >= 1) {
                if (segmentIndex < points.length - 2) {
                    segmentIndex += 1;
                    segmentStart = now;
                    // Nieuwe random variaties voor volgende segment
                    speedVariation = 1 + (Math.random() - 0.5) * 0.3;
                    wobblePhase = Math.random() * Math.PI * 2;
                    autoRunRef.current.rafId = requestAnimationFrame(step);
                } else {
                    setCleanedProgress(1);
                    setTimeout(() => setIsHovering(false), 400);
                    setIsAutoRunning(false);
                    onAutoComplete?.();
                }
            } else {
                autoRunRef.current.rafId = requestAnimationFrame(step);
            }
        };

        autoRunRef.current.rafId = requestAnimationFrame(step);
    }, [autoPath, onAutoComplete, updateSprayAt]);

    // Schedule automated run
    useEffect(() => {
        if (!autoClean) return;
        autoRunRef.current.timeoutId = setTimeout(startAutoClean, autoDelay);
        return () => {
            if (autoRunRef.current.timeoutId) clearTimeout(autoRunRef.current.timeoutId);
        };
    }, [autoClean, autoDelay, startAutoClean]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (autoRunRef.current.rafId) cancelAnimationFrame(autoRunRef.current.rafId);
            if (autoRunRef.current.timeoutId) clearTimeout(autoRunRef.current.timeoutId);
        };
    }, []);

    // Generate spray particles
    const sprayParticles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
        id: i,
        angle: (i / 20) * 140 - 70,
        delay: i * 0.018,
        size: Math.random() * 5 + 3,
        distance: Math.random() * 60 + 35,
    })), []);

    // Calculate which character index the mouse is over
    const getCharacterCleanState = (index) => {
        const charProgress = index / characters.length;
        return charProgress < cleanedProgress;
    };

    return (
        <motion.span
            ref={containerRef}
            className={`relative inline-block cursor-pointer select-none ${className}`}
            style={{ pointerEvents: isAutoRunning ? 'none' : 'auto' }}
            onMouseEnter={() => window.innerWidth >= 768 && !isAutoRunning && setIsHovering(true)}
            onMouseLeave={() => window.innerWidth >= 768 && !isAutoRunning && setIsHovering(false)}
            onMouseMove={handleMouseMove}
        >
            {/* Individual characters */}
            {characters.map((char, index) => {
                const isCleaned = getCharacterCleanState(index);

                return (
                    <motion.span
                        key={index}
                        style={{
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                        }}
                        animate={{
                            backgroundImage: isCleaned
                                ? `linear-gradient(to bottom, ${cleanColor}, ${cleanColor})`
                                : `linear-gradient(to bottom, ${dirtyColor}, ${dirtyColor})`,
                            filter: isCleaned
                                ? 'blur(0px) brightness(1.15) drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                                : 'blur(0.4px) brightness(0.8)',
                        }}
                        transition={{
                            duration: 0.25,
                            ease: "easeOut"
                        }}
                    >
                        {char}
                    </motion.span>
                );
            })}

            {/* Water spray effect container */}
            <AnimatePresence>
                {isHovering && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none overflow-visible"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ zIndex: 10 }}
                    >
                        {/* Main spray cone at cursor position */}
                        <motion.div
                            className="absolute"
                            style={{
                                left: sprayPosition.x,
                                top: sprayPosition.y,
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            {/* Spray mist glow */}
                            <motion.div
                                className="absolute rounded-full"
                                style={{
                                    width: 90,
                                    height: 90,
                                    left: -45,
                                    top: -45,
                                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, rgba(56, 189, 248, 0.25) 40%, transparent 70%)',
                                    filter: 'blur(8px)',
                                }}
                                animate={{
                                    scale: [1, 1.25, 1],
                                    opacity: [0.7, 1, 0.7],
                                }}
                                transition={{
                                    duration: 0.2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            {/* Spray particles */}
                            {sprayParticles.map((particle) => (
                                <motion.div
                                    key={particle.id}
                                    className="absolute rounded-full"
                                    style={{
                                        width: particle.size,
                                        height: particle.size,
                                        left: -particle.size / 2,
                                        top: -particle.size / 2,
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(6, 182, 212, 0.85))',
                                        boxShadow: '0 0 6px rgba(6, 182, 212, 0.8), 0 0 12px rgba(56, 189, 248, 0.5)',
                                    }}
                                    animate={{
                                        x: [0, Math.cos(particle.angle * Math.PI / 180) * particle.distance],
                                        y: [0, Math.sin(particle.angle * Math.PI / 180) * particle.distance * 0.5 + 20],
                                        opacity: [1, 0],
                                        scale: [1, 0.15],
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        delay: particle.delay,
                                        repeat: Infinity,
                                        ease: "easeOut",
                                    }}
                                />
                            ))}

                            {/* Center pressure point - nozzle */}
                            <motion.div
                                className="absolute rounded-full"
                                style={{
                                    width: 8,
                                    height: 8,
                                    left: -4,
                                    top: -4,
                                    background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(6, 182, 212, 0.9) 100%)',
                                    boxShadow: '0 0 12px rgba(255, 255, 255, 1), 0 0 25px rgba(6, 182, 212, 0.7)',
                                }}
                                animate={{
                                    scale: [1, 1.5, 1],
                                }}
                                transition={{
                                    duration: 0.1,
                                    repeat: Infinity,
                                }}
                            />
                        </motion.div>

                        {/* Flying droplets that follow mouse movement */}
                        {droplets.map((droplet) => (
                            <motion.div
                                key={droplet.id}
                                className="absolute rounded-full"
                                style={{
                                    width: droplet.size,
                                    height: droplet.size,
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(56, 189, 248, 0.8))',
                                    boxShadow: '0 0 5px rgba(6, 182, 212, 0.6)',
                                }}
                                initial={{
                                    x: droplet.x,
                                    y: droplet.y,
                                    opacity: droplet.opacity,
                                    scale: 1,
                                }}
                                animate={{
                                    x: droplet.x + Math.cos(droplet.angle * Math.PI / 180) * droplet.velocity,
                                    y: droplet.y + Math.sin(droplet.angle * Math.PI / 180) * droplet.velocity + 35,
                                    opacity: 0,
                                    scale: 0.1,
                                }}
                                transition={{
                                    duration: 0.65,
                                    ease: "easeOut",
                                }}
                            />
                        ))}

                        {/* Vertical wash line effect */}
                        <motion.div
                            className="absolute top-0 h-full pointer-events-none"
                            style={{
                                left: sprayPosition.x - 3,
                                width: 6,
                                background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), rgba(6, 182, 212, 0.6), transparent)',
                                filter: 'blur(2px)',
                            }}
                            animate={{
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 0.12,
                                repeat: Infinity,
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sparkle effects on cleaned letters */}
            <AnimatePresence>
                {cleanedProgress > 0.9 && isHovering && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none overflow-visible"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ zIndex: 15 }}
                    >
                        {Array.from({ length: 5 }, (_, i) => (
                            <motion.div
                                key={`sparkle-${i}`}
                                className="absolute"
                                style={{
                                    left: `${10 + i * 18}%`,
                                    top: `${20 + (i % 2) * 60}%`,
                                }}
                            >
                                <motion.svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 16 16"
                                    style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.9))' }}
                                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0, 1.3, 0],
                                        rotate: [0, 180],
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: i * 0.1,
                                        repeat: Infinity,
                                        repeatDelay: 0.6,
                                    }}
                                >
                                    <path
                                        d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
                                        fill="white"
                                    />
                                </motion.svg>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.span>
    );
};

export default SprayCleanText;

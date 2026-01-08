import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onFinish, 500); // Allow fade out to complete before unmounting
        }, 3000); // 3 seconds splash

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#2D2420] transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full scale-150 animate-pulse"></div>

                <img
                    src="/images/images_optimized/bereschoon-coin.jpg"
                    alt="Bereschoon"
                    className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-full shadow-2xl animate-coin-flip relative z-10 border-4 border-accent/20"
                />
            </div>
        </div>
    );
};

export default SplashScreen;

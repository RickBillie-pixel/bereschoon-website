import React from 'react';
import { Star, ShieldCheck, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustIndicators = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8 pb-8 border-b border-gray-100"
        >
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
                </div>
                <span className="text-sm font-semibold text-gray-700">4.8/5 Google Reviews</span>
            </div>

            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                <ShieldCheck size={16} className="text-primary" />
                <span className="text-sm font-semibold text-gray-700">150+ Projecten</span>
            </div>

            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                <Calendar size={16} className="text-primary" />
                <span className="text-sm font-semibold text-gray-700">3+ Jaar Ervaring</span>
            </div>
        </motion.div>
    );
};

export default TrustIndicators;

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ProductGrid from '../components/shop/ProductGrid';
import SEO from '../components/SEO';

const Winkel = () => {
  const uspItems = [
    {
      icon: Truck,
      text: <span><strong>Gratis verzending</strong> vanaf €50</span>
    },
    {
      icon: Clock,
      text: <span><strong>1-3 werkdagen</strong> levering</span>
    },
    {
      icon: Shield,
      text: <span><strong>Veilig</strong> iDEAL & meer</span>
    }
  ];

  return (
    <PageTransition className="pt-24">
      <SEO
        title="Webshop"
        description="Bestel professionele reinigingsproducten voor uw tuin en terras in de Bereschoon webshop."
        breadcrumbs={[
          { name: 'Home', url: 'https://bereschoon.nl' },
          { name: 'Webshop', url: 'https://bereschoon.nl/winkel' }
        ]}
      />
      {/* USPs */}
      <section className="border-b bg-white overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block container mx-auto px-6 py-5">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            {uspItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="flex items-center gap-3"
              >
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm text-gray-700">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile View (Marquee) */}
        <div className="md:hidden py-4 bg-gray-50/50">
          <motion.div
            className="flex gap-12 whitespace-nowrap pl-6"
            animate={{ x: "-50%" }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Duplicate items multiple times for smooth loop */}
            {[...uspItems, ...uspItems, ...uspItems, ...uspItems].map((item, index) => (
              <div key={index} className="flex items-center gap-3 flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm text-gray-700">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Title removed as requested */}
            <ProductGrid />
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Waarom Bereschoon Producten?</h2>
            <p className="text-gray-600 mb-8">
              Al onze producten worden door ons eigen team gebruikt bij professionele reinigingswerkzaamheden.
              We verkopen alleen producten waar we 100% achter staan.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-gray-500">Tevreden klanten</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">5★</p>
                <p className="text-sm text-gray-500">Gemiddelde score</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100%</p>
                <p className="text-sm text-gray-500">Professioneel</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">NL</p>
                <p className="text-sm text-gray-500">Made in NL</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Winkel;

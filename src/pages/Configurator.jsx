import React from 'react';
import ConfiguratorContact from '../components/ConfiguratorContact';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';

const Configurator = () => {
    return (
        <PageTransition className="pt-20">
            <SEO
                title="Offerte Aanvragen"
                description="Stel eenvoudig uw eigen schoonmaakpakket samen en ontvang direct een indicatie of offerte."
            />
            <ConfiguratorContact />
        </PageTransition>
    );
};

export default Configurator;

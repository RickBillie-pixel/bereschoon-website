import React from 'react';
import ConfiguratorContact from '../components/ConfiguratorContact';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';

const Configurator = () => {
    return (
        <PageTransition>
            <SEO
                title="Directe Prijsindicatie & Reinigingsadvies | AI Scan"
                description="Upload een foto en ontvang direct een vrijblijvende prijsindicatie en advies voor het reinigen van uw oprit, terras of gevel."
                breadcrumbs={[
                    { name: 'Home', url: 'https://bereschoon.nl' },
                    { name: 'Prijsindicatie & Advies', url: 'https://bereschoon.nl/configurator' }
                ]}
            />
            <ConfiguratorContact />
        </PageTransition>
    );
};

export default Configurator;

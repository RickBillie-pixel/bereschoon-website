import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import HomeQuoteSection from '../components/HomeQuoteSection';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';

const Home = ({ heroReady = true }) => {
    return (
        <PageTransition>
            <SEO
                title="Professionele Buitenreiniging"
                description="Bereschoon biedt uitzonderlijke schoonmaakdiensten voor uw oprit, gevel, terras en meer. Professioneel, efficiënt en milieubewust."
                keywords="reiniging, oprit reiniging, gevelreiniging, terras reiniging, softwash, hoge druk reiniging"
                canonicalUrl="https://bereschoon.nl"
            />
            <Hero ready={heroReady} />
            <Stats />
            <Services />
            <HomeQuoteSection />
        </PageTransition>
    );
};

export default Home;

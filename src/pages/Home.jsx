import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';
import Shop from '../components/Shop';

const Home = () => {
    return (
        <>
            <Hero />
            <Stats />
            <Services />
            <Gallery />
            <Reviews />
            <Shop />
        </>
    );
};

export default Home;

import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Sitewide Structured Data Component
 * Voegt Organization, WebSite en LocalBusiness schema toe aan elke pagina
 */
const StructuredData = () => {
    const baseUrl = 'https://bereschoon.nl';
    
    // Organization Schema
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Bereschoon",
        "url": baseUrl,
        "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/images/logo.png`,
            "width": 512,
            "height": 512
        },
        "image": `${baseUrl}/images/logo.png`,
        "description": "Professionele buitenreinigingsdiensten voor oprit, gevel, terras en meer in heel Nederland.",
        "email": "info@bereschoon.nl",
        "telephone": "+31639494059",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Helmond",
            "addressRegion": "Noord-Brabant",
            "addressCountry": "NL"
        },
        "founder": {
            "@type": "Person",
            "name": "Barend Seijkens",
            "alternateName": "Beer"
        },
        "foundingDate": "2022",
        "sameAs": [
            "https://www.instagram.com/bereschoon",
            "https://www.tiktok.com/@bereschoon",
            "https://www.youtube.com/@bereschoon",
            "https://www.facebook.com/bereschoon"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+31639494059",
            "contactType": "customer service",
            "email": "info@bereschoon.nl",
            "availableLanguage": ["Dutch"]
        }
    };

    // WebSite Schema
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "name": "Bereschoon",
        "url": baseUrl,
        "description": "Bereschoon biedt professionele buitenreinigingsdiensten voor particulieren en bedrijven in heel Nederland.",
        "publisher": {
            "@id": `${baseUrl}/#organization`
        },
        "inLanguage": "nl-NL"
    };

    // LocalBusiness Schema
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${baseUrl}/#localbusiness`,
        "name": "Bereschoon",
        "image": `${baseUrl}/images/logo.png`,
        "url": baseUrl,
        "telephone": "+31639494059",
        "email": "info@bereschoon.nl",
        "description": "Professionele buitenreiniging: oprit, terras, gevel en onkruidbeheersing.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Helmond",
            "addressRegion": "Noord-Brabant",
            "addressCountry": "NL"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 51.4764,
            "longitude": 5.6617
        },
        "priceRange": "€€",
        "areaServed": {
            "@type": "Country",
            "name": "Nederland"
        },
        "serviceType": [
            "Oprit reiniging",
            "Terras reiniging",
            "Gevelreiniging",
            "Onkruidbeheersing",
            "Terreinreiniging"
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "150",
            "bestRating": "5",
            "worstRating": "1"
        },
        "sameAs": [
            "https://www.instagram.com/bereschoon",
            "https://www.tiktok.com/@bereschoon",
            "https://www.youtube.com/@bereschoon",
            "https://www.facebook.com/bereschoon"
        ]
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(localBusinessSchema)}
            </script>
        </Helmet>
    );
};

export default StructuredData;



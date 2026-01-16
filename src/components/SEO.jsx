import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * SEO Component for managing document head metadata
 * 
 * @param {string} title - Page title (will be suffixed with " - Bereschoon")
 * @param {string} description - Meta description
 * @param {string} keywords - Comma separated keywords
 * @param {string} image - Image URL for social sharing (optional)
 * @param {string} type - OG type (website, article, product)
 * @param {object} structuredData - JSON-LD Structured Data object (optional)
 * @param {string} canonicalUrl - Explicit canonical URL (optional, defaults to current path)
 */
const SEO = ({
    title,
    description,
    keywords,
    image = '/images/logo.png',
    type = 'website',
    structuredData,
    canonicalUrl
}) => {
    const location = useLocation();
    const baseUrl = 'https://bereschoon.nl';
    const currentUrl = canonicalUrl || `${baseUrl}${location.pathname}`;
    const fullTitle = `${title} | Bereschoon`;

    // Construct absolute image URL
    const joyImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={currentUrl} />
            <meta name="robots" content="index, follow" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={joyImage} />
            <meta property="og:site_name" content="Bereschoon" />
            <meta property="og:locale" content="nl_NL" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={currentUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={joyImage} />

            {/* JSON-LD Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;

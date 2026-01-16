import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://bereschoon.nl';

/**
 * Normaliseer URL (verwijder trailing slash, behalve voor root)
 */
const normalizeUrl = (url) => {
    if (url === '/' || url === BASE_URL || url === `${BASE_URL}/`) {
        return BASE_URL;
    }
    return url.replace(/\/$/, '');
};

/**
 * SEO Component for managing document head metadata
 * 
 * @param {string} title - Page title (will be suffixed with " | Bereschoon")
 * @param {string} description - Meta description (max 155-160 chars recommended)
 * @param {string} keywords - Comma separated keywords (optional)
 * @param {string} image - Image URL for social sharing (optional, defaults to logo)
 * @param {string} type - OG type: website, article, product (default: website)
 * @param {object} structuredData - JSON-LD Structured Data object (optional)
 * @param {string} canonicalUrl - Explicit canonical URL (optional, defaults to current path)
 * @param {boolean} noindex - Set to true to prevent indexing (default: false)
 * @param {array} breadcrumbs - Array of {name, url} for BreadcrumbList schema (optional)
 */
const SEO = ({
    title,
    description,
    keywords,
    image = '/images/logo.png',
    type = 'website',
    structuredData,
    canonicalUrl,
    noindex = false,
    breadcrumbs
}) => {
    const location = useLocation();
    
    // Construct canonical URL (no trailing slash, except for root)
    const currentPath = location.pathname;
    const rawCanonical = canonicalUrl || `${BASE_URL}${currentPath}`;
    const canonical = normalizeUrl(rawCanonical);
    
    // Full title with brand suffix
    const fullTitle = title ? `${title} | Bereschoon` : 'Bereschoon - Professionele Buitenreiniging';
    
    // Truncate description if too long
    const truncatedDescription = description && description.length > 160 
        ? description.substring(0, 157) + '...'
        : description;

    // Construct absolute image URL
    const absoluteImage = image?.startsWith('http') 
        ? image 
        : `${BASE_URL}${image}`;

    // Robots directive
    const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';

    // BreadcrumbList Schema
    const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": normalizeUrl(crumb.url)
        }))
    } : null;

    // WebPage Schema (base for all pages)
    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${canonical}/#webpage`,
        "url": canonical,
        "name": fullTitle,
        "description": truncatedDescription,
        "inLanguage": "nl-NL",
        "isPartOf": {
            "@id": `${BASE_URL}/#website`
        },
        "about": {
            "@id": `${BASE_URL}/#organization`
        },
        ...(breadcrumbs && { breadcrumb: { "@id": `${canonical}/#breadcrumb` } })
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={truncatedDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            
            {/* Canonical URL - critical for SEO */}
            <link rel="canonical" href={canonical} />
            
            {/* Robots */}
            <meta name="robots" content={robotsContent} />
            <meta name="googlebot" content={robotsContent} />
            
            {/* Language */}
            <meta httpEquiv="content-language" content="nl" />
            <html lang="nl" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={truncatedDescription} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:image:alt" content={title || 'Bereschoon'} />
            <meta property="og:site_name" content="Bereschoon" />
            <meta property="og:locale" content="nl_NL" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonical} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={truncatedDescription} />
            <meta name="twitter:image" content={absoluteImage} />

            {/* WebPage Schema */}
            <script type="application/ld+json">
                {JSON.stringify(webPageSchema)}
            </script>

            {/* BreadcrumbList Schema */}
            {breadcrumbSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            )}

            {/* Custom Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;

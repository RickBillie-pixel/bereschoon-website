/**
 * Structured Data Helpers voor SEO
 * Genereert JSON-LD schema's voor verschillende paginatypes
 */

const BASE_URL = 'https://bereschoon.nl';

/**
 * Genereer FAQPage schema
 * @param {Array} faqs - Array van {question, answer} objecten
 */
export const generateFAQSchema = (faqs) => {
    if (!faqs || faqs.length === 0) return null;
    
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
};

/**
 * Genereer Service schema
 * @param {Object} service - Service gegevens
 */
export const generateServiceSchema = (service) => {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.name,
        "description": service.description,
        "provider": {
            "@id": `${BASE_URL}/#organization`
        },
        "areaServed": {
            "@type": "Country",
            "name": "Nederland"
        },
        "serviceType": service.type || service.name,
        ...(service.image && { "image": service.image.startsWith('http') ? service.image : `${BASE_URL}${service.image}` }),
        ...(service.url && { "url": service.url.startsWith('http') ? service.url : `${BASE_URL}${service.url}` })
    };
};

/**
 * Genereer Product schema voor e-commerce
 * @param {Object} product - Product gegevens
 */
export const generateProductSchema = (product) => {
    const images = product.images || [];
    
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": images.map(img => img.startsWith('http') ? img : `${BASE_URL}${img}`),
        "description": product.short_description || product.description,
        "sku": product.id || product.slug,
        "brand": {
            "@type": "Brand",
            "name": "Bereschoon"
        },
        "offers": {
            "@type": "Offer",
            "url": `${BASE_URL}/winkel/product/${product.slug}`,
            "priceCurrency": "EUR",
            "price": product.price,
            "availability": product.stock > 0 
                ? "https://schema.org/InStock" 
                : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
                "@id": `${BASE_URL}/#organization`
            }
        }
    };
};

/**
 * Genereer BreadcrumbList schema
 * @param {Array} items - Array van {name, url} objecten
 */
export const generateBreadcrumbSchema = (items) => {
    if (!items || items.length === 0) return null;
    
    // Altijd beginnen met Home
    const breadcrumbs = [
        { name: 'Home', url: BASE_URL },
        ...items.map(item => ({
            name: item.name,
            url: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
        }))
    ];
    
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };
};

/**
 * FAQ data voor de service pagina's
 */
export const SERVICE_FAQ_DATA = [
    {
        question: "Hoelang blijft het resultaat mooi?",
        answer: "Dit is afhankelijk van de ligging en de gekozen behandeling. Met onze Premium behandeling en beschermlaag blijft uw terras of oprit doorgaans 2 tot 3 jaar vrij van groene aanslag en korstmossen schoon. Zonder beschermlaag is dit vaak 6-12 maanden."
    },
    {
        question: "Is de reiniging veilig voor mijn tegels?",
        answer: "Absoluut. Wij passen de waterdruk en temperatuur aan op het type steen. Voor kwetsbare stenen gebruiken we softwash-technieken (lage druk, biologische middelen) om schade te voorkomen. Uw bestrating is bij ons in veilige handen."
    },
    {
        question: "Moet ik thuis zijn tijdens de reiniging?",
        answer: "Nee, dat is niet noodzakelijk zolang wij toegang hebben tot het te reinigen oppervlak en een wateraansluiting. Wij sturen u foto's van het resultaat als u niet thuis bent."
    },
    {
        question: "Wat is het verschil tussen reinigen en impregneren?",
        answer: "Reinigen verwijdert het vuil dat nu aanwezig is. Impregneren brengt een onzichtbare beschermlaag aan die diep in de steen trekt. Hierdoor hecht nieuw vuil en groene aanslag zich minder snel, waardoor het resultaat veel langer behouden blijft."
    }
];

export default {
    generateFAQSchema,
    generateServiceSchema,
    generateProductSchema,
    generateBreadcrumbSchema,
    SERVICE_FAQ_DATA
};



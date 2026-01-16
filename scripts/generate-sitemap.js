/**
 * Bereschoon Sitemap Generator
 * 
 * Genereert:
 * - sitemap.xml (index)
 * - sitemap-pages.xml (statische pagina's)
 * - sitemap-products.xml (dynamische producten)
 * 
 * Uitvoeren: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const BASE_URL = 'https://bereschoon.nl';
const OUTPUT_DIR = path.resolve(__dirname, '../public');

// Statische routes die geïndexeerd moeten worden
// GEEN trailing slash (consistent policy: no trailing slash)
const STATIC_ROUTES = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/over-ons', priority: '0.8', changefreq: 'monthly' },
    { path: '/contact', priority: '0.9', changefreq: 'monthly' },
    { path: '/configurator', priority: '0.9', changefreq: 'monthly' },
    { path: '/projecten', priority: '0.8', changefreq: 'weekly' },
    { path: '/oprit-terras-terrein', priority: '0.9', changefreq: 'monthly' },
    { path: '/gevelreiniging', priority: '0.9', changefreq: 'monthly' },
    { path: '/onkruidbeheersing', priority: '0.9', changefreq: 'monthly' },
    { path: '/winkel', priority: '0.8', changefreq: 'daily' },
];

// Routes die NIET in sitemap mogen (noindex)
const NOINDEX_ROUTES = [
    '/winkel/admin',
    '/winkel/account',
    '/winkel/checkout',
    '/winkel/betaling-succes',
    '/winkel/betaling-mislukt',
    '/track',
];

/**
 * Format datum naar W3C datetime (ISO 8601)
 */
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Genereer XML voor een URL entry
 */
function generateUrlEntry(loc, lastmod, changefreq, priority) {
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Genereer sitemap-pages.xml
 */
function generatePagesSitemap() {
    const today = formatDate(new Date());
    
    const urls = STATIC_ROUTES.map(route => 
        generateUrlEntry(
            `${BASE_URL}${route.path}`,
            today,
            route.changefreq,
            route.priority
        )
    ).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Genereer sitemap-products.xml
 */
async function generateProductsSitemap() {
    const today = formatDate(new Date());
    let productUrls = [];

    if (SUPABASE_URL && SUPABASE_KEY) {
        try {
            const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
            const { data: products, error } = await supabase
                .from('products')
                .select('slug, updated_at')
                .eq('active', true);

            if (error) {
                console.error('Supabase error:', error.message);
            } else if (products && products.length > 0) {
                productUrls = products.map(product => {
                    const lastmod = product.updated_at 
                        ? formatDate(new Date(product.updated_at))
                        : today;
                    return generateUrlEntry(
                        `${BASE_URL}/winkel/product/${product.slug}`,
                        lastmod,
                        'weekly',
                        '0.7'
                    );
                });
                console.log(`✓ ${products.length} producten gevonden`);
            }
        } catch (err) {
            console.error('Error fetching products:', err.message);
        }
    } else {
        console.warn('⚠ Supabase credentials niet gevonden - geen producten in sitemap');
    }

    // Return empty sitemap if no products
    if (productUrls.length === 0) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${productUrls.join('\n')}
</urlset>`;
}

/**
 * Genereer sitemap.xml (index)
 */
function generateSitemapIndex() {
    const today = formatDate(new Date());
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-products.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

/**
 * Schrijf sitemap naar bestand
 */
function writeSitemap(filename, content) {
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✓ ${filename} gegenereerd (${path.relative(process.cwd(), filepath)})`);
}

/**
 * Main functie
 */
async function main() {
    console.log('');
    console.log('🗺️  Bereschoon Sitemap Generator');
    console.log('================================');
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Output: ${OUTPUT_DIR}`);
    console.log('');

    // Zorg dat output directory bestaat
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Genereer sitemaps
    console.log('Genereren sitemaps...');
    
    // Pages sitemap
    const pagesSitemap = generatePagesSitemap();
    writeSitemap('sitemap-pages.xml', pagesSitemap);
    
    // Products sitemap
    const productsSitemap = await generateProductsSitemap();
    writeSitemap('sitemap-products.xml', productsSitemap);
    
    // Index sitemap
    const indexSitemap = generateSitemapIndex();
    writeSitemap('sitemap.xml', indexSitemap);

    console.log('');
    console.log('✅ Alle sitemaps succesvol gegenereerd!');
    console.log('');
}

// Run
main().catch(console.error);

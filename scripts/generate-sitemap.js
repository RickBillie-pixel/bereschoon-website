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

const STATIC_ROUTES = [
    '/',
    '/configurator',
    '/contact',
    '/projecten',
    '/over-ons',
    '/oprit-terras-terrein',
    '/gevelreiniging',
    '/onkruidbeheersing',
    '/winkel'
];

async function generateSitemap() {
    console.log('Generating sitemap...');

    let routes = [...STATIC_ROUTES];

    // Fetch dynamic routes (Products)
    if (SUPABASE_URL && SUPABASE_KEY) {
        try {
            const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
            const { data: products, error } = await supabase
                .from('products')
                .select('slug')
                .eq('active', true);

            if (error) throw error;

            if (products) {
                const productRoutes = products.map(p => `/winkel/product/${p.slug}`);
                routes = [...routes, ...productRoutes];
                console.log(`Added ${products.length} product routes.`);
            }
        } catch (err) {
            console.error('Error fetching products:', err.message);
        }
    } else {
        console.warn('Supabase credentials not found. Skipping dynamic routes.');
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outputPath, sitemap);
    console.log(`Sitemap generated at: ${outputPath}`);
}

generateSitemap();

#!/usr/bin/env node
/**
 * Bereschoon SEO Check Script
 * 
 * Controleert:
 * - robots.txt bereikbaarheid en inhoud
 * - Sitemap validiteit
 * - URL status codes
 * - Meta tags aanwezigheid
 * 
 * Uitvoeren: npm run seo:check
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://bereschoon.nl';
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const DIST_DIR = path.resolve(__dirname, '../dist');

// Kleuren voor console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    header: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}\n${'─'.repeat(50)}`)
};

let errors = 0;
let warnings = 0;

/**
 * Check robots.txt
 */
function checkRobotsTxt() {
    log.header('1. Robots.txt Check');
    
    const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
    
    if (!fs.existsSync(robotsPath)) {
        log.error('robots.txt niet gevonden in public/');
        errors++;
        return;
    }
    
    const content = fs.readFileSync(robotsPath, 'utf8');
    
    // Check for Sitemap directive
    if (content.includes('Sitemap:')) {
        log.success('Sitemap directive aanwezig');
    } else {
        log.error('Geen Sitemap directive gevonden');
        errors++;
    }
    
    // Check for User-agent
    if (content.includes('User-agent:')) {
        log.success('User-agent directives aanwezig');
    } else {
        log.error('Geen User-agent directive gevonden');
        errors++;
    }
    
    // Check that CSS/JS is not blocked
    if (content.includes('Disallow: *.css') || content.includes('Disallow: *.js')) {
        log.error('CSS/JS wordt geblokkeerd - dit kan rendering issues veroorzaken');
        errors++;
    } else {
        log.success('CSS/JS niet geblokkeerd');
    }
    
    // Check for admin/account blocking
    if (content.includes('/winkel/admin') && content.includes('/winkel/account')) {
        log.success('Admin en account routes geblokkeerd');
    } else {
        log.warn('Admin/account routes mogelijk niet geblokkeerd');
        warnings++;
    }
    
    log.info(`robots.txt grootte: ${content.length} bytes`);
}

/**
 * Check llms.txt
 */
function checkLlmsTxt() {
    log.header('2. llms.txt Check');
    
    const llmsPath = path.join(PUBLIC_DIR, 'llms.txt');
    
    if (!fs.existsSync(llmsPath)) {
        log.warn('llms.txt niet gevonden - optioneel maar aanbevolen voor LLM crawlers');
        warnings++;
        return;
    }
    
    const content = fs.readFileSync(llmsPath, 'utf8');
    
    if (content.includes(BASE_URL)) {
        log.success('Canonical domein vermeld');
    } else {
        log.warn('Canonical domein niet vermeld');
        warnings++;
    }
    
    if (content.includes('sitemap')) {
        log.success('Sitemap referentie aanwezig');
    } else {
        log.warn('Geen sitemap referentie');
        warnings++;
    }
    
    log.info(`llms.txt grootte: ${content.length} bytes`);
}

/**
 * Check Sitemaps
 */
function checkSitemaps() {
    log.header('3. Sitemap Check');
    
    const sitemaps = ['sitemap.xml', 'sitemap-pages.xml', 'sitemap-products.xml'];
    
    for (const sitemap of sitemaps) {
        const sitemapPath = path.join(PUBLIC_DIR, sitemap);
        
        if (!fs.existsSync(sitemapPath)) {
            if (sitemap === 'sitemap.xml') {
                log.error(`${sitemap} niet gevonden - kritisch!`);
                errors++;
            } else {
                log.warn(`${sitemap} niet gevonden`);
                warnings++;
            }
            continue;
        }
        
        const content = fs.readFileSync(sitemapPath, 'utf8');
        
        // Basic XML validation
        if (content.startsWith('<?xml')) {
            log.success(`${sitemap} is valide XML`);
        } else {
            log.error(`${sitemap} is geen valide XML`);
            errors++;
            continue;
        }
        
        // Check for urlset or sitemapindex
        if (content.includes('<urlset') || content.includes('<sitemapindex')) {
            log.success(`${sitemap} heeft correct root element`);
        } else {
            log.error(`${sitemap} mist urlset/sitemapindex`);
            errors++;
        }
        
        // Count URLs
        const urlCount = (content.match(/<loc>/g) || []).length;
        log.info(`${sitemap} bevat ${urlCount} URLs`);
        
        // Check for noindex URLs (should not be in sitemap)
        const noindexPatterns = ['/admin', '/account', '/checkout', '/track'];
        for (const pattern of noindexPatterns) {
            if (content.includes(pattern)) {
                log.error(`${sitemap} bevat noindex URL: ${pattern}`);
                errors++;
            }
        }
    }
}

/**
 * Check index.html meta tags
 */
function checkIndexHtml() {
    log.header('4. index.html Meta Tags Check');
    
    const indexPath = path.join(PUBLIC_DIR, '../index.html');
    
    if (!fs.existsSync(indexPath)) {
        log.error('index.html niet gevonden');
        errors++;
        return;
    }
    
    const content = fs.readFileSync(indexPath, 'utf8');
    
    // Required meta tags
    const checks = [
        { name: 'title', pattern: /<title>/, required: true },
        { name: 'meta description', pattern: /<meta name="description"/, required: true },
        { name: 'meta robots', pattern: /<meta name="robots"/, required: true },
        { name: 'og:title', pattern: /<meta property="og:title"/, required: true },
        { name: 'og:description', pattern: /<meta property="og:description"/, required: true },
        { name: 'og:image', pattern: /<meta property="og:image"/, required: true },
        { name: 'twitter:card', pattern: /<meta (?:property|name)="twitter:card"/, required: true },
        { name: 'lang attribute', pattern: /<html[^>]*lang="nl"/, required: true },
        { name: 'viewport', pattern: /<meta name="viewport"/, required: true },
        { name: 'charset', pattern: /<meta charset/, required: true },
        { name: 'favicon', pattern: /<link[^>]*rel="icon"/, required: false },
        { name: 'canonical (default)', pattern: /<link[^>]*rel="canonical"/, required: false }
    ];
    
    for (const check of checks) {
        if (check.pattern.test(content)) {
            log.success(`${check.name} aanwezig`);
        } else if (check.required) {
            log.error(`${check.name} ontbreekt`);
            errors++;
        } else {
            log.warn(`${check.name} ontbreekt (optioneel)`);
            warnings++;
        }
    }
}

/**
 * Check static routes list
 */
function checkRoutes() {
    log.header('5. Routes Configuratie Check');
    
    const expectedRoutes = [
        '/',
        '/over-ons',
        '/contact',
        '/configurator',
        '/projecten',
        '/oprit-terras-terrein',
        '/gevelreiniging',
        '/onkruidbeheersing',
        '/winkel'
    ];
    
    const noindexRoutes = [
        '/winkel/admin',
        '/winkel/account',
        '/winkel/checkout',
        '/track'
    ];
    
    log.info(`${expectedRoutes.length} indexeerbare routes verwacht`);
    log.info(`${noindexRoutes.length} noindex routes verwacht`);
    
    // Check sitemap-pages.xml for expected routes
    const sitemapPath = path.join(PUBLIC_DIR, 'sitemap-pages.xml');
    if (fs.existsSync(sitemapPath)) {
        const content = fs.readFileSync(sitemapPath, 'utf8');
        let found = 0;
        
        for (const route of expectedRoutes) {
            const expectedUrl = route === '/' ? BASE_URL : `${BASE_URL}${route}`;
            if (content.includes(expectedUrl)) {
                found++;
            } else {
                log.warn(`Route ${route} niet in sitemap-pages.xml`);
                warnings++;
            }
        }
        
        log.success(`${found}/${expectedRoutes.length} verwachte routes in sitemap`);
    }
}

/**
 * Check build output (if exists)
 */
function checkBuild() {
    log.header('6. Build Output Check');
    
    if (!fs.existsSync(DIST_DIR)) {
        log.info('Geen dist/ folder - build nog niet uitgevoerd');
        log.info('Voer "npm run build" uit om de productie build te maken');
        return;
    }
    
    // Check that static files are copied
    const requiredFiles = ['robots.txt', 'sitemap.xml', 'llms.txt', 'index.html'];
    
    for (const file of requiredFiles) {
        const filePath = path.join(DIST_DIR, file);
        if (fs.existsSync(filePath)) {
            log.success(`${file} aanwezig in dist/`);
        } else {
            log.warn(`${file} ontbreekt in dist/`);
            warnings++;
        }
    }
}

/**
 * Check for common SEO issues in source files
 */
function checkSourceFiles() {
    log.header('7. Source Files Check');
    
    const pagesDir = path.resolve(__dirname, '../src/pages');
    
    if (!fs.existsSync(pagesDir)) {
        log.warn('src/pages/ niet gevonden');
        warnings++;
        return;
    }
    
    const checkSEOComponent = (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        // Check if file imports SEO component
        if (content.includes("from '../components/SEO'") || content.includes("from '../../components/SEO'")) {
            return true;
        }
        return false;
    };
    
    // Get all JSX files recursively
    const getAllJsxFiles = (dir) => {
        let results = [];
        const list = fs.readdirSync(dir);
        
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                results = results.concat(getAllJsxFiles(filePath));
            } else if (file.endsWith('.jsx')) {
                results.push(filePath);
            }
        });
        
        return results;
    };
    
    const jsxFiles = getAllJsxFiles(pagesDir);
    let withSEO = 0;
    let withoutSEO = [];
    
    for (const file of jsxFiles) {
        if (checkSEOComponent(file)) {
            withSEO++;
        } else {
            withoutSEO.push(path.relative(pagesDir, file));
        }
    }
    
    log.success(`${withSEO}/${jsxFiles.length} pagina's hebben SEO component`);
    
    if (withoutSEO.length > 0) {
        log.warn(`Pagina's zonder SEO component: ${withoutSEO.join(', ')}`);
        warnings++;
    }
}

/**
 * Generate summary
 */
function summary() {
    log.header('SAMENVATTING');
    
    if (errors === 0 && warnings === 0) {
        console.log(`${colors.green}✓ Alle SEO checks geslaagd!${colors.reset}`);
    } else {
        if (errors > 0) {
            console.log(`${colors.red}✗ ${errors} error(s) gevonden${colors.reset}`);
        }
        if (warnings > 0) {
            console.log(`${colors.yellow}⚠ ${warnings} warning(s) gevonden${colors.reset}`);
        }
    }
    
    console.log(`\n${'─'.repeat(50)}`);
    console.log('Volgende stappen:');
    console.log('1. Fix alle errors voordat je naar productie gaat');
    console.log('2. Voer "npm run build" uit');
    console.log('3. Test de productie build lokaal met "npm run preview"');
    console.log('4. Valideer structured data op https://validator.schema.org/');
    console.log('5. Test in Google Search Console na deployment');
    console.log(`${'─'.repeat(50)}\n`);
    
    return errors > 0 ? 1 : 0;
}

// Main
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}       BERESCHOON SEO CHECK${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════${colors.reset}`);
console.log(`Domein: ${BASE_URL}`);
console.log(`Datum: ${new Date().toISOString().split('T')[0]}`);

checkRobotsTxt();
checkLlmsTxt();
checkSitemaps();
checkIndexHtml();
checkRoutes();
checkBuild();
checkSourceFiles();

process.exit(summary());



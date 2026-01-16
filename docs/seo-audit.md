# Bereschoon SEO Audit & Implementatie Rapport

**Datum:** 2026-01-16  
**Domein:** https://bereschoon.nl  
**Stack:** Vite + React + React Router (SPA)  
**Hosting:** Firebase Hosting

---

## 📋 Samenvatting

Dit document beschrijft de SEO-optimalisaties die zijn doorgevoerd op de Bereschoon website. De implementatie is gericht op:

1. Volledige crawlability voor zoekmachines
2. Correcte indexering van alle publieke pagina's
3. Bescherming van private/admin pagina's
4. Structured data voor rich snippets
5. Consistente URL-structuur en canonical URLs

---

## 🏗️ Stack & Architectuur

### Technische Stack
- **Framework:** React 19 + Vite 7
- **Routing:** React Router DOM 7 (client-side)
- **Styling:** Tailwind CSS
- **Hosting:** Firebase Hosting
- **Backend:** Supabase (database + edge functions)
- **Betaling:** Mollie

### SEO Uitdagingen SPA
React is een Single Page Application (SPA), wat betekent dat:
- Alle content wordt client-side gerenderd
- Zoekmachines moeten JavaScript uitvoeren om content te zien
- Meta tags worden dynamisch bijgewerkt via react-helmet-async

**Oplossing:** 
- React Helmet Async voor dynamische meta tags
- Sitemaps vooraf gegenereerd (SSG-stijl)
- Structured data in elke pagina

---

## 📁 Geïmplementeerde Bestanden

### 1. `public/robots.txt`
- User-agent directives voor Google, Bing, en LLM crawlers
- Blokkering van admin, account, checkout en track routes
- Sitemap referenties
- Geen blokkering van CSS/JS

### 2. `public/llms.txt`
- Context file voor AI/LLM crawlers (GPTBot, Claude, etc.)
- Beschrijving van diensten en site structuur
- Richtlijnen voor AI-gebruik van content

### 3. Sitemaps
- `sitemap.xml` - Index sitemap
- `sitemap-pages.xml` - Statische pagina's
- `sitemap-products.xml` - Dynamische producten (uit Supabase)

### 4. SEO Component (`src/components/SEO.jsx`)
- Dynamische title, description, keywords
- Canonical URLs (consistent, geen trailing slash)
- Open Graph tags
- Twitter Card tags
- robots meta tag
- JSON-LD support
- Breadcrumb support

### 5. Structured Data (`src/components/StructuredData.jsx`)
- Organization schema (sitewide)
- WebSite schema
- LocalBusiness schema
- Automatisch geladen op elke pagina

### 6. Page-specific Structured Data
- FAQPage schema op service pagina's
- Service schema per dienst
- Product schema op productpagina's
- BreadcrumbList op alle pagina's

### 7. 404 Pagina (`src/pages/NotFound.jsx`)
- Eigen 404 pagina met noindex
- Links naar populaire pagina's
- Gebruiksvriendelijk design

---

## 📊 URL Structuur

### Indexeerbare Pagina's (in sitemap)
| URL | Title | Priority |
|-----|-------|----------|
| `/` | Professionele Buitenreiniging | 1.0 |
| `/over-ons` | Over Ons | 0.8 |
| `/contact` | Contact | 0.9 |
| `/configurator` | Offerte Aanvragen | 0.9 |
| `/projecten` | Projecten | 0.8 |
| `/oprit-terras-terrein` | Oprit & Terras Reiniging | 0.9 |
| `/gevelreiniging` | Gevelreiniging | 0.9 |
| `/onkruidbeheersing` | Onkruidbeheersing | 0.9 |
| `/winkel` | Webshop | 0.8 |
| `/winkel/product/[slug]` | [Product naam] | 0.7 |

### Niet-indexeerbare Pagina's (noindex + geblokkeerd in robots.txt)
| URL | Reden |
|-----|-------|
| `/winkel/admin/*` | Admin dashboard |
| `/winkel/account/*` | Gebruikersaccount |
| `/winkel/checkout` | Checkout proces |
| `/winkel/betaling-succes` | Transactie resultaat |
| `/winkel/betaling-mislukt` | Transactie resultaat |
| `/track/*` | Order tracking |

---

## 🔧 Trailing Slash Policy

**Beslissing:** Geen trailing slash (behalve voor root `/`)

- ✅ `https://bereschoon.nl`
- ✅ `https://bereschoon.nl/contact`
- ❌ `https://bereschoon.nl/contact/`

Dit wordt consistent toegepast in:
- Canonical URLs
- Sitemap URLs
- Interne links
- Structured data

---

## 📈 Structured Data Overzicht

### Sitewide (op elke pagina)
```json
{
  "@type": "Organization",
  "@type": "WebSite",
  "@type": "LocalBusiness"
}
```

### Per Pagina Type

| Pagina Type | Schema Types |
|-------------|--------------|
| Homepage | WebPage |
| Service pagina's | WebPage, FAQPage, Service |
| Product pagina's | WebPage, Product, BreadcrumbList |
| Overige pagina's | WebPage, BreadcrumbList |

---

## ✅ Checklist Voltooiing

- [x] robots.txt met Sitemap directive
- [x] llms.txt voor LLM crawlers
- [x] Sitemap index + child sitemaps
- [x] Dynamische sitemap generatie voor producten
- [x] Unieke title per pagina
- [x] Unieke meta description per pagina
- [x] Canonical URLs consistent
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] robots meta (noindex waar nodig)
- [x] Organization schema
- [x] LocalBusiness schema
- [x] WebSite schema
- [x] Service schema
- [x] Product schema
- [x] FAQPage schema
- [x] BreadcrumbList schema
- [x] 404 pagina met noindex
- [x] Admin/account routes geblokkeerd
- [x] SEO check script

---

## 🧪 Testen

### Lokaal Testen
```bash
# SEO check uitvoeren
npm run seo:check

# Sitemaps genereren
npm run sitemap:generate

# Build maken
npm run build

# Preview build
npm run preview
```

### Online Tools
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema Validator**: https://validator.schema.org/
3. **Google Search Console**: Sitemap indienen
4. **Bing Webmaster Tools**: Sitemap indienen

### Handmatige Checks
1. View Source op productie - controleer meta tags in HTML
2. Browser DevTools > Network > check status codes
3. Lighthouse SEO audit

---

## 🚀 Deployment Checklist

1. [ ] `npm run build` zonder errors
2. [ ] `firebase deploy` uitvoeren
3. [ ] Productie site testen op meta tags
4. [ ] Sitemap.xml bereikbaar op https://bereschoon.nl/sitemap.xml
5. [ ] robots.txt bereikbaar
6. [ ] Sitemap indienen bij Google Search Console
7. [ ] Sitemap indienen bij Bing Webmaster Tools
8. [ ] Rich Results testen met Google tool
9. [ ] Structured data valideren

---

## 📝 Onderhoud

### Bij nieuwe pagina's
1. Voeg SEO component toe met unieke title/description
2. Voeg route toe aan `scripts/generate-sitemap.js` (als indexeerbaar)
3. Voeg noindex toe als pagina niet geïndexeerd moet worden
4. Voer `npm run sitemap:generate` uit

### Bij URL wijzigingen
1. Voeg 301 redirect toe in Firebase config
2. Update sitemap
3. Update interne links

### Periodiek
- [ ] Check Google Search Console voor errors
- [ ] Update lastmod in sitemaps bij content changes
- [ ] Valideer structured data na wijzigingen

---

## 📞 Contact

Voor vragen over deze implementatie:
- **Website:** https://bereschoon.nl
- **Email:** info@bereschoon.nl

---

*Document laatst bijgewerkt: 2026-01-16*


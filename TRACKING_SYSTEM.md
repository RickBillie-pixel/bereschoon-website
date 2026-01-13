# Track & Trace Systeem - Bereschoon

Dit document beschrijft het volledige track & trace systeem dat geïmplementeerd is voor de Bereschoon webshop.

## Overzicht

Het track & trace systeem stelt klanten in staat om hun bestellingen te volgen, zowel met als zonder account. Admins kunnen tracking informatie updaten en automatisch emails versturen wanneer bestellingen verzonden worden.

## Features

### Voor Klanten

1. **Automatische Tracking Code**
   - Bij elke order wordt automatisch een unieke tracking code gegenereerd (formaat: `BS-XXXX-XXXX-XXXX`)
   - De tracking code is zichtbaar in:
     - Order bevestiging
     - Account bestellingen pagina
     - Verzendbevestiging email

2. **Order Volgen - Twee Methoden**
   
   **Methode 1: Via Tracking Code**
   - Ga naar `/track`
   - Voer je tracking code in
   - Zie direct je order status en tracking history
   
   **Methode 2: Via Ordernummer + Postcode**
   - Ga naar `/track`
   - Voer je ordernummer en postcode in
   - Authenticatie via postcode voor beveiliging

3. **Tracking Pagina Features**
   - Real-time order status
   - Volledige tracking history met tijdstempels
   - Verzendadres informatie
   - Bestelde producten overzicht
   - Link naar vervoerder tracking (indien beschikbaar)

4. **Account Integratie**
   - Ingelogde gebruikers kunnen tracking info zien in hun account
   - Direct link naar tracking pagina vanuit bestellingen overzicht

### Voor Admins

1. **Order Management Dashboard**
   - Overzicht van alle bestellingen
   - Quick status updates
   - Tracking informatie per order

2. **Tracking Info Updaten**
   - Vervoerder naam instellen (PostNL, DHL, DPD, etc.)
   - Track & Trace URL van vervoerder toevoegen
   - Custom beschrijving toevoegen
   - Automatische email verzending naar klant

3. **Status Updates**
   - Directe status wijzigingen via dropdown
   - Automatische tracking history entries
   - Timestamps voor verzending en levering

## Database Schema

### Nieuwe Kolommen in `orders` tabel

```sql
- tracking_code TEXT UNIQUE       -- Unieke tracking code (BS-XXXX-XXXX-XXXX)
- tracking_link TEXT              -- Public tracking URL
- carrier_name TEXT               -- Naam van vervoerder
- carrier_tracking_url TEXT       -- Tracking URL van vervoerder
- tracking_code TEXT              -- Track & trace code van vervoerder
```

### Nieuwe `order_tracking_history` tabel

```sql
CREATE TABLE order_tracking_history (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    status TEXT,
    location TEXT,
    description TEXT,
    created_at TIMESTAMPTZ,
    updated_by UUID,
    is_automated BOOLEAN,
    carrier_status TEXT
);
```

## Edge Functions

### 1. `create-payment`
- **Aangepast**: Voegt automatisch tracking history entry toe bij order creatie
- Genereert order in database (tracking code wordt automatisch gegenereerd door trigger)

### 2. `mollie-webhook`
- **Aangepast**: Voegt tracking history entries toe bij status wijzigingen
- Update order status na betaling

### 3. `update-order-tracking` (NIEUW)
- Update tracking informatie voor een order
- Voegt tracking history entries toe
- **Authorization**: Vereist admin rechten

**Request Body:**
```typescript
{
  orderId: string;
  status?: string;
  carrierName?: string;
  carrierTrackingUrl?: string;
  location?: string;
  description?: string;
}
```

## Frontend Components

### 1. `/track` en `/track/:trackingCode` - Publieke Tracking Pagina

**Features:**
- Twee zoek methoden (tracking code of ordernummer + postcode)
- Real-time order status
- Tracking history timeline
- Verzendadres info
- Bestelde producten
- Link naar vervoerder

### 2. Account Orders Page - Verbeterd

**Updates:**
- Tracking code zichtbaar per order
- Direct link naar tracking pagina
- Link naar vervoerder tracking
- Real-time updates via Supabase subscriptions

### 3. Admin Orders Management - Compleet Vernieuwd

**Features:**
- Tracking code per order
- Status updates met auto-email
- Tracking info modal voor verzending
- Vervoerder info toevoegen
- Direct link naar tracking pagina

## Database Triggers

### Auto-generate Tracking Code

```sql
CREATE TRIGGER auto_set_tracking_code
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_tracking_code();
```

Deze trigger:
- Genereert unieke tracking code bij order creatie
- Stelt tracking link in
- Formaat: `BS-XXXX-XXXX-XXXX` (12 karakters, geen verwarrende tekens)

## Row Level Security (RLS)

### Orders Tabel

- **Users**: Kunnen eigen orders zien (via `user_id`)
- **Public**: Kunnen orders zien met geldige `tracking_code` of `payment_id`
- **Admins**: Kunnen alle orders zien en wijzigen

### Order Tracking History Tabel

- **Users**: Kunnen tracking history zien van eigen orders
- **Public**: Kunnen tracking history zien met geldige tracking code
- **Admins**: Kunnen alle tracking history zien en wijzigen

## Email Template

De verzendbevestiging email bevat:
- Order nummer
- Tracking code (groot en duidelijk)
- Link naar tracking pagina
- Link naar vervoerder (indien beschikbaar)
- Verwachte levertijd info
- Bereschoon branding

## Gebruikersflow

### Voor Klanten (Met Account)

1. Plaats order → Ontvang tracking code
2. Order wordt betaald
3. Admin markeert als verzonden
4. Ga naar je account → Klik op order → Zie tracking link
5. OF gebruik tracking code op `/track` pagina
6. Zie real-time updates

### Voor Klanten (Zonder Account)

1. Plaats order → Ontvang tracking code
2. Order wordt betaald  
3. Admin markeert als verzonden
4. Ga naar `/track` pagina
5. Voer tracking code of ordernummer + postcode in
6. Zie order status en tracking history

### Voor Admins

1. Ontvang nieuwe order → Zie in admin dashboard
2. Update status naar "In behandeling"
3. Pak order in en klaar voor verzending
4. Klik op tracking icon (🚚) bij order
5. Vul vervoerder info in:
   - Naam vervoerder (bijv. PostNL)
   - Track & trace URL van vervoerder
   - Optionele notitie
6. Klik "Opslaan"
7. Systeem:
   - Update order status naar "Verzonden"
   - Voegt tracking history entry toe
   - Klant kan nu order volgen via tracking pagina

## Configuratie

### Environment Variables

In `.env` of Supabase Dashboard:

```env
# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Supabase (already configured)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Mollie (already configured)
MOLLIE_API_KEY=xxxxx

# Site URL
SITE_URL=https://bereschoon.nl
```

### Email Setup

Voor email functionaliteit moet je:

1. Account aanmaken op [Resend.com](https://resend.com)
2. Domein verifiëren (bereschoon.nl)
3. API key genereren
4. API key toevoegen aan Supabase secrets:
   ```bash
   supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

## Deployment

### Database Migratie

```bash
# Run de nieuwe migratie
supabase db push

# Of via Supabase Dashboard:
# SQL Editor → Paste inhoud van 20260113000000_add_order_tracking.sql → Run
```

### Edge Functions Deployen

```bash
# Deploy alle nieuwe/geüpdateerde functions
supabase functions deploy update-order-tracking
supabase functions deploy create-payment
supabase functions deploy mollie-webhook
```

## Testing Checklist

### Database

- [ ] Tracking code wordt automatisch gegenereerd bij nieuwe order
- [ ] Tracking code is uniek
- [ ] Tracking history entries worden correct aangemaakt
- [ ] RLS policies werken correct

### Edge Functions

- [ ] `update-order-tracking` werkt met admin authorization
- [ ] `create-payment` voegt tracking history toe
- [ ] `mollie-webhook` update tracking history

### Frontend

- [ ] Tracking pagina werkt met tracking code
- [ ] Tracking pagina werkt met ordernummer + postcode
- [ ] Account orders page toont tracking info
- [ ] Admin kan tracking info updaten

## Troubleshooting

### Tracking code wordt niet gegenereerd

- Check of de migratie correct is uitgevoerd
- Controleer de `set_tracking_code()` function in database
- Check database logs

### Admin kan tracking niet updaten

- Controleer of user admin rechten heeft in `admin_users` tabel
- Check edge function logs
- Controleer authorization header

### Tracking pagina toont geen data

- Controleer RLS policies
- Check of tracking code bestaat in database
- Controleer browser console voor errors

## Toekomstige Verbeteringen

1. **Automatische Tracking Updates**
   - Integratie met PostNL/DHL API
   - Automatische status updates van vervoerder

2. **Email Notificaties (Optioneel)**
   - Verzendbevestiging emails
   - Status update emails

3. **Tracking Widget**
   - Embedded tracking widget voor andere websites
   - API voor externe tracking queries

4. **Analytics**
   - Gemiddelde levertijd per regio
   - Vervoerder performance tracking
   - Customer satisfaction metrics

## Support

Voor vragen of problemen:
- Check Supabase logs in Dashboard
- Check Edge Function logs
- Contact: info@bereschoon.nl

---

**Laatste Update**: 13 januari 2026
**Versie**: 1.0.0


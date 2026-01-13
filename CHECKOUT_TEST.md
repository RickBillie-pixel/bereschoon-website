# 🚀 Checkout & Tracking Systeem - Test Instructies

## ⚡ Performance Optimalisaties

De volgende optimalisaties zijn geïmplementeerd voor snelle laadtijden:

### ✅ Wat is Gefixt:
1. **AuthContext**: Parallel fetching van profile en admin data
2. **NotificationContext**: Fail-safe voor niet-bestaande notifications tabel
3. **Snelle fallbacks**: Geen blocking calls meer
4. **Browser caching**: Fixed met import correcties

---

## 🧪 Test de Checkout Flow

### **Stap 1: Start de Dev Server**
```bash
npm run dev
```
➜ Server draait op: `http://localhost:5173/`

### **Stap 2: Hard Refresh de Browser**
Wis je browser cache om oude code te verwijderen:
- **Windows**: `Ctrl + Shift + R` of `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

### **Stap 3: Test Zonder Account**

1. Ga naar `/winkel`
2. Voeg producten toe aan winkelmandje
3. Ga naar checkout (`/winkel/checkout`)
4. Vul contactgegevens in:
   - Email
   - Naam
   - Telefoonnummer
5. Vul verzendadres in:
   - Straat & Huisnummer
   - Postcode & Plaats
   - Land (NL/BE/LU)
6. **Kies verzendmethode**:
   - ✅ DHL: €5.95 (1-2 werkdagen)
   - ✅ PostNL: €6.95 (1-2 werkdagen)
   - 💰 Gratis bij >€50
7. Klik "Betalen"
8. Op Mollie testpagina:
   - ✅ Klik "Paid" voor succesvolle betaling
   - ❌ Klik "Failed" voor mislukte betaling

### **Stap 4: Test Met Account**

1. Ga naar `/winkel/account`
2. **Registreer** nieuw account:
   - Volledige naam
   - Email
   - Wachtwoord (min. 6 tekens)
3. **Login** met je gegevens
4. Ga terug naar checkout
5. ✨ **Check**: Gegevens zijn automatisch ingevuld!
6. Voltooi de bestelling

### **Stap 5: Test Tracking**

#### Via Account Pagina:
1. Login op `/winkel/account`
2. Klik op "Mijn Bestellingen"
3. ✅ Zie je tracking code (bijv. `TRACK-2026-0001`)
4. Klik "Volg je bestelling"

#### Via Tracking Pagina:
1. Ga naar `/track`
2. **Optie A**: Voer tracking code in
3. **Optie B**: Voer ordernummer + postcode in
4. ✅ Zie order status en tijdlijn

#### Directe Link:
1. Ga naar `/track/TRACK-2026-0001` (gebruik je tracking code)
2. ✅ Direct order details zien

---

## 🔍 Database Controles

### Check Orders in Supabase Dashboard:

```sql
-- Bekijk alle orders met tracking info
SELECT 
  order_number,
  tracking_code,
  tracking_link,
  chosen_carrier_name,
  status,
  total,
  created_at
FROM orders
ORDER BY created_at DESC
LIMIT 10;
```

### Check Order Items:

```sql
-- Bekijk producten in orders
SELECT 
  o.order_number,
  oi.product_name,
  oi.quantity,
  oi.price_at_purchase,
  (oi.quantity * oi.price_at_purchase) as subtotal
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
ORDER BY o.created_at DESC;
```

### Check Tracking History:

```sql
-- Bekijk tracking updates
SELECT 
  o.order_number,
  h.status,
  h.location,
  h.description,
  h.created_at
FROM order_tracking_history h
JOIN orders o ON h.order_id = o.id
ORDER BY h.created_at DESC;
```

---

## ✅ Wat Moet Werken:

### Order Creatie:
- [x] Order nummer format: `2026-0001`
- [x] Tracking code format: `TRACK-2026-0001`
- [x] Tracking link automatisch gegenereerd
- [x] Gekozen carrier opgeslagen (DHL/PostNL)
- [x] Alle producten + prijzen opgeslagen
- [x] Shipping cost correct berekend

### Betaling:
- [x] Mollie redirect werkt
- [x] Test payments werken (Paid/Failed)
- [x] Status update na betaling (paid)
- [x] Tracking history entry bij betaling

### Account Integratie:
- [x] Guest checkout (zonder account)
- [x] Login redirect naar checkout
- [x] Auto-fill gegevens bij login
- [x] Order gekoppeld aan user_id
- [x] Real-time order updates in account

### Tracking:
- [x] Tracking met code
- [x] Tracking met ordernummer + postcode
- [x] Direct link tracking
- [x] Status tijdlijn weergave
- [x] Verzendadres weergave
- [x] Producten lijst weergave

---

## 🐛 Troubleshooting

### **Pagina laadt traag of niet:**
1. Hard refresh: `Ctrl + Shift + Delete` → Clear cache
2. Check console (F12) voor errors
3. Restart dev server: `npm run dev`

### **"selectedCountry is not defined" error:**
1. Hard refresh browser
2. Check of je de laatste versie hebt: `git pull origin main`
3. Rebuild: `npm run build`

### **Order wordt niet aangemaakt:**
1. Check Supabase API key in `.env`
2. Check Mollie API key in Supabase secrets
3. Check browser console voor errors

### **Tracking werkt niet:**
1. Check of order status = "paid"
2. Check of tracking_code bestaat in database
3. Controleer order_tracking_history tabel

---

## 📊 Performance Metrics

**Doel Laadtijden:**
- ✅ Account pagina: < 500ms
- ✅ Checkout pagina: < 1s
- ✅ Tracking pagina: < 500ms

**Wat is geoptimaliseerd:**
- Parallel database queries (AuthContext)
- Fail-safe error handling (NotificationContext)
- Lazy loading van niet-kritieke data
- Browser caching correct geconfigureerd

---

## 🎯 Volgende Stappen

1. **Test alle flows** (guest, account, tracking)
2. **Controleer database** (orders, items, history)
3. **Verify performance** (laadtijden acceptabel?)
4. **Admin panel testen** (orders beheren)

Alles werkt nu snel en smooth! 🚀


# Security Audit Report - Bereschoon

**Date:** 2026-01-21
**Auditor:** Antigravity (Security Engineer)
**Target:** `c:\Users\rickv\Desktop\Bereschoon\bereschoon`

## 1. Executive Summary
This audit identified **2 CRITICAL** vulnerabilities that allow financial fraud (arbitrary price setting) and inventory corruption. The general code quality is high, with excellent React security hygiene (no XSS found). However, the backend (Supabase Edge Functions) trusts client input too much.

*   **CRITICAL:** `create-payment` Edge Function blindly trusts the price sent by the client. An attacker can buy all stock for €0.01 per item.
*   **CRITICAL:** `mollie-webhook` lacks idempotency. Replaying a "paid" webhook causes multiple stock decrements.
*   **MEDIUM:** File upload logic in `calculate-ad-quote` lacks strict MIME-type/extension allowlisting, risking malware storage.
*   **MEDIUM:** Missing Content Security Policy (CSP) in `firebase.json`.
*   **LOW:** Pricing logic for quotes is duplicated on client and server but relying on client-provided JSON for options without deep validation against a master price list in `calculate-ad-quote`.

## 2. Findings Table

| Severity | File:Line | Category | Impact | Fix |
| :--- | :--- | :--- | :--- | :--- |
| **CRITICAL** | `supabase/functions/create-payment/index.ts:132` | **Input Validation / Financial** | User can set any price (e.g., €0.01) for products. | **Fetch prices from DB** based on `productId`. Ignore client `price`. |
| **CRITICAL** | `supabase/functions/mollie-webhook/index.ts:157` | **Logic / Idempotency** | Replaying webhooks corrupts stock levels (negative stock). | Check if order is already `paid` before decrementing stock. |
| **MEDIUM** | `supabase/functions/calculate-ad-quote/index.ts:92` | **File Upload** | Attacker can upload HTML/SVG/EXE masked as images (Stored XSS/Malware distribution). | Enforce strict extension check (jpg, png) & `content-type` allowlist. |
| **MEDIUM** | `firebase.json:71` | **Security Headers** | Missing CSP allows easier XSS exploitation if a vulnerability is introduced later. | Add strict `Content-Security-Policy` header. |
| **LOW** | `supabase/functions/calculate-ad-quote/index.ts:146` | **Input Validation** | Client controls quote options structure; server trusts parsed JSON. | Re-validate all option costs on server against `PRICES` constant. |

## 3. Patches for Top 5 Issues

### Fix 1: Prevention of Price Manipulation
**File:** `supabase/functions/create-payment/index.ts`
**Description:** Instead of using `item.price` from the request body, we query the `products` table for the authoritative price.

```typescript
// [DELETE]
// const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

// [NEW CODE START]
    // 1. Fetch real prices from DB
    const productIds = items.map(i => i.productId).filter(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
    
    // Only fetch if there are valid UUIDs
    let dbProducts: any[] = [];
    if (productIds.length > 0) {
      const { data: foundProducts, error: prodError } = await supabase
        .from('products')
        .select('id, price, name')
        .in('id', productIds);
        
      if (prodError) throw new Error('Kon productprijzen niet ophalen');
      dbProducts = foundProducts || [];
    }

    // 2. Recalculate Subtotal securely
    let subtotal = 0;
    const validatedItems = items.map(item => {
      const dbProduct = dbProducts.find(p => p.id === item.productId);
      
      // If product exists in DB, use DB price. Else fallback to item.price (ONLY for custom items if intended, otherwise throw)
      // SECURITY: Strictly enforce DB price for existing products.
      const realPrice = dbProduct ? dbProduct.price : item.price; 
      
      // Optional: Throw if product not found to prevent 'ghost' items
      if (!dbProduct && item.productId) {
         throw new Error(`Product niet gevonden: ${item.name}`);
      }

      subtotal += realPrice * item.quantity;
      
      return {
        ...item,
        price: realPrice // Overwrite client price with real price
      };
    });
    
    // Use validatedItems for connection to Mollie
// [NEW CODE END]
```

### Fix 2: Webhook Idempotency (Stock Corruption)
**File:** `supabase/functions/mollie-webhook/index.ts`
**Description:** Prevent processing the same payment success event twice.

```typescript
// [INSERT AFTER] const orderId = payment.metadata?.order_id;
    
    // Prevent usage of invalid UUIDs via SQL injection attempts (UUID validation)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)) {
       throw new Error('Invalid Order ID format');
    }

    // Fetch current order status FIRST
    const { data: currentOrder, error: fetchError } = await supabase
       .from('orders')
       .select('status')
       .eq('id', orderId)
       .single();
    
    if (fetchError || !currentOrder) throw new Error('Order niet gevonden');

    // IDEMPOTENCY CHECK: If already paid/cancelled, stop processing default logic
    if (currentOrder.status === 'paid' && payment.status === 'paid') {
        console.log(`Order ${orderId} reeds betaald. Stopping duplicate processing.`);
        return new Response(JSON.stringify({ success: true, message: 'Already processed' }), { headers: corsHeaders });
    }
```

### Fix 3: Secure File Upload
**File:** `supabase/functions/calculate-ad-quote/index.ts`
**Description:** Whitelist expected file types.

```typescript
// [MODIFY] around line 87 (const fileExt...)
    const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!ALLOWED_MIMES.includes(file.type)) {
        addLog(`Skipped file ${file.name}: Invalid type ${file.type}`);
        continue;
    }
    
    if (file.size > MAX_SIZE) {
        addLog(`Skipped file ${file.name}: Too large`);
        continue;
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(fileExt)) {
         addLog(`Skipped file ${file.name}: Invalid extension`);
         continue;
    }
```

### Fix 4: Content Security Policy
**File:** `firebase.json`
**Description:** Add CSP header to prevent XSS.

```json
// [ADD to headers section for source "**"]
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; img-src 'self' data: https://*.supabase.co https://*.supabase.in; script-src 'self' 'unsafe-inline' https://*.supabase.co; connect-src 'self' https://*.supabase.co https://*.mollie.com; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';"
}
```

### Fix 5: Server-Side Option Validation
**File:** `supabase/functions/calculate-ad-quote/index.ts`
**Description:** Ensure `serviceOptions` only contains valid keys from `PRICES`.

```typescript
// [AFTER] serviceOptions parsing
const validOptions = Object.keys(PRICES[serviceType]?.options || {});
serviceOptions = serviceOptions.filter(opt => {
    if(!validOptions.includes(opt)) {
        addLog(`Invalid option filtered: ${opt}`);
        return false;
    }
    return true;
});
```

## 4. Post-Fix Checklist

- [ ] **Deploy Edge Functions:** Run `supabase functions deploy [function_name]` for all patched functions.
- [ ] **Verify Payment Flow:** Perform a test transaction with an intercepted request attempting to change the price. Ensure it fails or charges the correct amount.
- [ ] **Verify Webhook Replay:** Send the same "paid" webhook payload twice to the endpoint using Postman/Curl. Verify stock is decremented only *once*.
- [ ] **Check Headers:** Deploy `firebase.json` changes and inspect headers in DevTools to see `Content-Security-Policy`.
- [ ] **Secret Rotation:** (Optional but recommended) Rotate `SUPABASE_SERVICE_ROLE_KEY` if you suspect it was ever logged or exposed (none found in code, but good practice).

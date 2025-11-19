# Size-Based Pricing Setup Complete ✅

## What Was Done

1. ✅ **Database Schema Updated**
   - Added `size_pricing` JSONB column to products table
   - Created index for efficient queries

2. ✅ **Pricing Structure Created**
   - **5x5**: €6.50
   - **6x6**: €7.70
   - **12x12**: €10.00

3. ✅ **TypeScript Types Updated**
   - Added `size_pricing` to Product interface

4. ✅ **Migration Script Updated**
   - Products will automatically get size pricing when migrated

5. ✅ **Component Created**
   - `components/product-size-selector.tsx` - Size selection component

## How It Works

### For New Products
When you migrate products using `scripts/migrate-to-supabase.js`, all products will automatically get:
```json
{
  "5x5": 6.50,
  "6x6": 7.70,
  "12x12": 10.00
}
```

### For Existing Products
Run this script to update existing products:
```bash
node scripts/update-product-pricing.js
```

## Using the Size Selector Component

Add to your product page:

```tsx
import { ProductSizeSelector } from "@/components/product-size-selector"

// In your product page component
<ProductSizeSelector
  sizePricing={product.size_pricing || {
    "5x5": 6.50,
    "6x6": 7.70,
    "12x12": 10.00
  }}
  selectedSize={selectedSize}
  onSizeSelect={(size, price) => {
    setSelectedSize(size)
    setSelectedPrice(price)
  }}
/>
```

## Displaying Price

When a size is selected, use the selected price for:
- Cart items
- Checkout
- Stripe payment

Example:
```tsx
const finalPrice = selectedSize 
  ? product.size_pricing?.[selectedSize as keyof typeof product.size_pricing] || product.price
  : product.price
```

## Next Steps

1. **Update Product Pages** - Add size selector to product detail pages
2. **Update Cart** - Include selected size in cart items
3. **Update Checkout** - Use size-based price in Stripe checkout
4. **Test** - Verify pricing displays correctly

---

**Pricing is now set up!** All products will have size-based pricing options. 🎉


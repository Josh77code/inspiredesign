# Complete Migration Guide: File-Based Database → Supabase + Vercel Blob

This guide will help you migrate from the current file-based database system to Supabase (for database) and Vercel Blob (for images), while keeping your Stripe integration intact.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Install Required Packages](#step-1-install-required-packages)
3. [Step 2: Set Up Supabase](#step-2-set-up-supabase)
4. [Step 3: Set Up Vercel Blob](#step-3-set-up-vercel-blob)
5. [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
6. [Step 5: Create Database Schema](#step-5-create-database-schema)
7. [Step 6: Run Migration Script](#step-6-run-migration-script)
8. [Step 7: Update Your Code](#step-7-update-your-code)
9. [Step 8: Test the Migration](#step-8-test-the-migration)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- ✅ Supabase account (free tier works)
- ✅ Vercel account with Blob storage enabled
- ✅ Images already uploaded to Vercel Blob
- ✅ Stripe account (already configured)

---

## Step 1: Install Required Packages

Run the following command to install Supabase and Vercel Blob packages:

```bash
npm install @supabase/supabase-js @vercel/blob
```

---

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project (or use existing)
3. Go to **Settings** → **API**
4. Copy your:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (for client-side)
   - **service_role key** (for server-side - keep this secret!)

---

## Step 3: Set Up Vercel Blob

1. Go to your Vercel dashboard
2. Navigate to your project → **Storage** → **Blob**
3. Create a new Blob store (or use existing)
4. Copy your **Blob Store URL** and **Token**

**Note:** If you already have images uploaded, make sure you know:
- The blob store name
- The path structure of your images

---

## Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Vercel Blob Configuration
BLOB_READ_WRITE_TOKEN=your-blob-token

# Existing Stripe (keep these)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret
```

---

## Step 5: Create Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  artist TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  
  -- Image URLs from Vercel Blob
  image_url TEXT, -- Main image URL from Vercel Blob
  image_thumbnail_url TEXT, -- Thumbnail URL
  image_large_url TEXT, -- Large image URL
  
  -- Additional metadata
  folder_path TEXT,
  download_type TEXT DEFAULT 'file',
  download_url TEXT, -- Stripe product download URL
  
  -- File information (stored as JSONB)
  all_files JSONB DEFAULT '[]'::jsonb,
  pdfs JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_artist ON products(artist);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(artist, ''))
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create orders table (if not exists)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  stripe_session_id TEXT UNIQUE,
  customer_email TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'pending',
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create contacts table (if not exists)
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
```

---

## Step 6: Run Migration Script

The migration script (`scripts/migrate-to-supabase.js`) will:
1. Read your existing `data/products.json`
2. Upload product data to Supabase
3. Map image paths to Vercel Blob URLs

**Before running:** Make sure you have:
- ✅ Supabase credentials configured
- ✅ Database schema created
- ✅ Images already in Vercel Blob

Run the migration:
```bash
node scripts/migrate-to-supabase.js
```

---

## Step 7: Update Your Code

The following files have been updated:
- ✅ `lib/supabase.ts` - Supabase client
- ✅ `lib/vercel-blob.ts` - Vercel Blob client
- ✅ `lib/database.ts` - Updated to use Supabase
- ✅ `app/api/products/route.ts` - Updated to use Supabase
- ✅ `components/product-card.tsx` - Updated to use Vercel Blob images

---

## Step 8: Test the Migration

1. **Test Product Fetching:**
   ```bash
   curl http://localhost:3000/api/products
   ```

2. **Test Product by ID:**
   ```bash
   curl http://localhost:3000/api/products/1
   ```

3. **Check Images:**
   - Visit `/products` page
   - Verify images load from Vercel Blob
   - Check browser console for any errors

4. **Test Stripe Integration:**
   - Add product to cart
   - Complete checkout flow
   - Verify order is saved to Supabase

---

## Image URL Mapping

Your images in Vercel Blob should follow this structure:

```
https://[your-blob-store].public.blob.vercel-storage.com/
  products/
    [product-id]/
      main.jpg
      thumbnail.jpg
      large.jpg
```

Or if you have a different structure, update the `getBlobImageUrl` function in `lib/vercel-blob.ts`.

---

## Troubleshooting

### Issue: Images not loading
- **Check:** Vercel Blob token is correct
- **Check:** Image URLs in database match your Blob store structure
- **Check:** CORS settings in Vercel Blob

### Issue: Products not fetching
- **Check:** Supabase credentials are correct
- **Check:** Database schema is created
- **Check:** RLS (Row Level Security) policies if enabled

### Issue: Migration script fails
- **Check:** `data/products.json` exists and is valid JSON
- **Check:** Supabase connection works
- **Check:** All required fields are present in products

### Issue: Stripe integration broken
- **Check:** Stripe keys are still in `.env.local`
- **Check:** Product IDs match between Supabase and Stripe metadata

---

## Next Steps

After successful migration:

1. ✅ Remove old file-based database code (optional)
2. ✅ Set up Supabase RLS policies for security
3. ✅ Configure Vercel Blob CORS for production
4. ✅ Set up database backups in Supabase
5. ✅ Monitor performance and optimize queries

---

## Support

If you encounter issues:
1. Check Supabase logs in dashboard
2. Check Vercel Blob logs
3. Review browser console for errors
4. Check server logs in terminal

---

## Rollback Plan

If you need to rollback:
1. Keep `data/products.json` as backup
2. The old `lib/database.ts` is still available
3. You can switch back by reverting API routes

---

**Migration completed!** 🎉

Your products are now stored in Supabase and images are served from Vercel Blob.


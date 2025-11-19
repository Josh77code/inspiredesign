# Step-by-Step Setup Guide

## Step 1: Get Vercel Blob Token

### Option A: From Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) → Sign in
2. Select your project
3. Go to **Storage** → **Blob**
4. Click on your blob store (or create one)
5. Go to **Settings** → **Tokens**
6. Click **Create Token** → Name it (e.g., "read-write")
7. Copy the token (starts with `vercel_blob_rw_`)
8. Add to `.env.local`:
   ```env
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your-token-here
   ```

### Option B: From Vercel CLI
```bash
vercel blob token create read-write
```

## Step 2: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) → Sign in
2. **Create a new project** (or select existing):
   - Click **New Project**
   - Enter project name
   - Enter database password (save it!)
   - Select region closest to you
   - Wait for project to be created (~2 minutes)

3. Get your credentials:
   - Go to **Settings** → **API**
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep secret!

4. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 3: Create Supabase Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste this SQL:

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
  image_url TEXT,
  image_thumbnail_url TEXT,
  image_large_url TEXT,
  
  -- Additional metadata
  folder_path TEXT,
  download_type TEXT DEFAULT 'file',
  download_url TEXT,
  
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

-- Create orders table
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

-- Create contacts table
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

4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

## Step 4: Verify Environment Variables

Run:
```bash
node scripts/check-env.js
```

All 8 variables should show ✅

## Step 5: Verify Blob Structure

Run:
```bash
node scripts/verify-blob-setup.js
```

This will show:
- How many images you have
- The folder structure
- Suggested mapping for migration

## Step 6: Update Migration Script (if needed)

Based on the blob structure shown, you may need to update `scripts/migrate-to-supabase.js`:

1. Open `scripts/migrate-to-supabase.js`
2. Find the `convertImagePath()` function (around line 71)
3. Update it to match your blob structure

Example structures:
- `products/1/main.jpg` → Keep as-is
- `1/main.jpg` → Change to `products/${productId}/main.jpg`
- `images/product-1.jpg` → Change to match your structure

## Step 7: Run Migration

```bash
node scripts/migrate-to-supabase.js
```

This will:
- Read products from `data/products.json`
- Convert image paths to Vercel Blob URLs
- Insert products into Supabase
- Show progress and summary

## Step 8: Switch to Supabase

After successful migration:

```bash
# Backup old files
cp lib/database.ts lib/database-old.ts
cp app/api/products/route.ts app/api/products/route-old.ts

# Use Supabase versions
cp lib/database-supabase.ts lib/database.ts
cp app/api/products/route-supabase.ts app/api/products/route.ts
```

## Step 9: Test

1. Start dev server: `npm run dev`
2. Visit `/products` - should load from Supabase
3. Check images - should load from Vercel Blob
4. Test cart/checkout - Stripe should still work

## Troubleshooting

### Blob token not working?
- Make sure token starts with `vercel_blob_rw_`
- Check token has read/write permissions
- Verify blob store exists

### Supabase connection failed?
- Check URL format: `https://xxxxx.supabase.co`
- Verify service_role key is correct
- Check if project is active (not paused)

### Migration fails?
- Check `data/products.json` exists
- Verify all env variables are set
- Check Supabase tables are created
- Review error messages in console

---

**Need help?** Check the error messages and refer to `SUPABASE_VERCEL_BLOB_MIGRATION.md` for detailed troubleshooting.


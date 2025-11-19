# Quick Start: Migrate to Supabase + Vercel Blob

## 🚀 Quick Setup (5 Steps)

### Step 1: Install Packages ✅
```bash
npm install @supabase/supabase-js @vercel/blob
```
**Status:** Already done!

### Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → Create/Select Project
2. Go to **Settings** → **API** → Copy:
   - Project URL
   - `anon` public key
   - `service_role` key (keep secret!)

### Step 3: Set Up Vercel Blob

1. Go to Vercel Dashboard → Your Project → **Storage** → **Blob**
2. Create blob store (or use existing)
3. Copy the **Blob Store URL** and **Token**

### Step 4: Add Environment Variables

Add to `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-blob-token
BLOB_STORE_URL=https://your-store.public.blob.vercel-storage.com
```

### Step 5: Create Database Schema

Run this SQL in Supabase SQL Editor:

```sql
-- Products table
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
  image_url TEXT,
  image_thumbnail_url TEXT,
  image_large_url TEXT,
  folder_path TEXT,
  download_type TEXT DEFAULT 'file',
  download_url TEXT,
  all_files JSONB DEFAULT '[]'::jsonb,
  pdfs JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Orders table
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

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 6: Run Migration

```bash
node scripts/migrate-to-supabase.js
```

### Step 7: Switch to Supabase

**Option A: Replace files (Recommended)**
```bash
# Backup old files
cp lib/database.ts lib/database-old.ts
cp app/api/products/route.ts app/api/products/route-old.ts

# Use Supabase versions
cp lib/database-supabase.ts lib/database.ts
cp app/api/products/route-supabase.ts app/api/products/route.ts
```

**Option B: Update imports manually**
- Change `@/lib/database` imports to use Supabase functions
- Update API routes to use async/await

### Step 8: Update Image URLs

Your products should have `image_url` pointing to Vercel Blob. The migration script will convert old paths, but you may need to update `convertImagePath` in `scripts/migrate-to-supabase.js` to match your blob structure.

### Step 9: Test

1. Visit `/products` - should load from Supabase
2. Check images - should load from Vercel Blob
3. Test cart/checkout - should still work with Stripe

## 📝 Important Notes

1. **Image Structure:** Update `convertImagePath` in migration script to match your blob structure
2. **Backup:** Keep `data/products.json` as backup
3. **Rollback:** If issues occur, revert to old files
4. **Environment:** Make sure all env vars are set before running migration

## 🐛 Troubleshooting

**Images not loading?**
- Check `BLOB_STORE_URL` is correct
- Verify image URLs in Supabase match your blob structure
- Check browser console for CORS errors

**Products not loading?**
- Check Supabase credentials
- Verify database schema is created
- Check server logs for errors

**Migration fails?**
- Ensure `.env.local` has all required variables
- Check `data/products.json` exists and is valid
- Verify Supabase connection works

## ✅ Done!

Your products are now in Supabase and images are served from Vercel Blob!


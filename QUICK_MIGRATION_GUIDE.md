# Quick Migration Guide - You're Almost There! 🚀

## ✅ What's Already Done

1. ✅ **Supabase Schema** - Database tables are created and updated
2. ✅ **Packages Installed** - Supabase and Vercel Blob packages ready
3. ✅ **Code Files Created** - All migration files are ready

## 📋 What You Need to Do Now

### Step 1: Add Missing Environment Variables

Add these to your `.env.local`:

```env
# Vercel Blob (Get from Vercel Dashboard → Storage → Blob)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your-token-here
BLOB_STORE_URL=https://mr0u602ri2txkwqt.public.blob.vercel-storage.com

# Supabase (Get from Supabase Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 2: Verify Environment Variables

```bash
node scripts/check-env.js
```

All 8 should show ✅

### Step 3: Verify Blob Structure

```bash
node scripts/verify-blob-setup.js
```

This shows:
- How your images are organized
- Folder structure
- Suggested mapping

### Step 4: Update Migration Script (if needed)

Based on the blob structure, you may need to update `convertImagePath()` in `scripts/migrate-to-supabase.js`:

**Current default:** `products/{id}/main.jpg`

**If your structure is different**, update line ~85 in `migrate-to-supabase.js`:

```javascript
// Example: If your images are at root level
return `${blobStoreUrl}/${filename}`

// Example: If your images are in folders by name
const productName = oldProduct.title.toLowerCase().replace(/\s+/g, '-')
return `${blobStoreUrl}/products/${productName}/${filename}`
```

### Step 5: Run Migration

```bash
node scripts/migrate-to-supabase.js
```

**Expected output:**
```
🚀 Starting migration to Supabase...
📦 Found X products to migrate
📤 Processing batch 1/X...
  ✅ Migrated product 1: Product Name
  ...
📊 Migration Summary:
  ✅ Successfully migrated: X
  ❌ Errors: 0
```

### Step 6: Switch to Supabase

After successful migration:

```bash
# Backup old files
cp lib/database.ts lib/database-old.ts
cp app/api/products/route.ts app/api/products/route-old.ts

# Use Supabase versions
cp lib/database-supabase.ts lib/database.ts
cp app/api/products/route-supabase.ts app/api/products/route.ts
```

### Step 7: Test Everything

```bash
npm run dev
```

1. Visit `http://localhost:3000/products`
2. Check products load from Supabase ✅
3. Check images load from Vercel Blob ✅
4. Test adding to cart ✅
5. Test checkout (Stripe) ✅

## 🎯 Current Status

- ✅ Supabase schema: **READY**
- ⏳ Environment variables: **NEED TO ADD**
- ⏳ Blob structure: **NEED TO VERIFY**
- ⏳ Migration: **READY TO RUN**

## 🆘 Need Help?

### Finding Vercel Blob Token:
1. Vercel Dashboard → Your Project
2. Storage → Blob
3. Settings → Tokens → Create Token

### Finding Supabase Credentials:
1. Supabase Dashboard → Your Project
2. Settings → API
3. Copy Project URL, anon key, service_role key

### Blob Structure Questions:
Run `node scripts/verify-blob-setup.js` - it will show your structure!

---

**You're almost done!** Just add the environment variables and run the migration! 🎉


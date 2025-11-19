# Add Environment Variables Locally

## ⚠️ Important

**Vercel environment variables** are for **production/deployment only**.

For **local development** and **migration scripts**, you need to add them to `.env.local` file.

## Quick Method: Copy from Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Copy each value
3. Add them to your `.env.local` file

## What to Add

Add these lines to your `.env.local` file:

```env
# Supabase (from Supabase Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Vercel Blob (from Vercel Dashboard → Storage → Blob)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your-token-here
BLOB_STORE_URL=https://mr0u602ri2txkwqt.public.blob.vercel-storage.com
```

## Where to Find Values

### From Vercel Dashboard:
1. Go to your project
2. **Settings** → **Environment Variables**
3. Find each variable and copy its value

### From Supabase Dashboard:
1. Go to your project
2. **Settings** → **API**
3. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### From Vercel Blob:
1. Go to your project
2. **Storage** → **Blob**
3. **Settings** → **Tokens** → Copy token → `BLOB_READ_WRITE_TOKEN`

## After Adding

Run this to verify:
```bash
node scripts/check-env.js
```

All 8 variables should show ✅

Then you can proceed with:
```bash
node scripts/verify-blob-setup.js
node scripts/migrate-to-supabase.js
```

---

**Note:** `.env.local` is in `.gitignore` so your secrets stay safe! 🔒


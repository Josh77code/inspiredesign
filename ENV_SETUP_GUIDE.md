# Environment Variables Setup Guide

## ✅ Current Status

Your Stripe variables are already configured! You need to add:

1. **Supabase variables** (3 required)
2. **Vercel Blob variables** (2 required)

## 📝 What to Add to `.env.local`

Add these lines to your `.env.local` file (after your existing Stripe variables):

```env
# ============================================
# Supabase Configuration
# ============================================
# Get these from: Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ============================================
# Vercel Blob Configuration
# ============================================
# Get these from: Vercel Dashboard → Storage → Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your-token-here
BLOB_STORE_URL=https://mr0u602ri2txkwqt.public.blob.vercel-storage.com
```

## 🔑 How to Get Each Value

### Supabase Variables

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### Vercel Blob Variables

1. Go to [vercel.com](https://vercel.com) and sign in
2. Select your project
3. Go to **Storage** → **Blob**
4. Select your blob store (or create one)
5. Copy:
   - **Token** → `BLOB_READ_WRITE_TOKEN` (starts with `vercel_blob_rw_`)
   - **Store URL** → `BLOB_STORE_URL` (already set: `https://mr0u602ri2txkwqt.public.blob.vercel-storage.com`)

## ✅ Verify Setup

After adding the variables, run:

```bash
node scripts/check-env.js
```

This will verify all variables are set correctly.

## 📋 Complete `.env.local` Template

Your complete `.env.local` should look like this:

```env
# Stripe (Already configured ✅)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase (Add these)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Vercel Blob (Add these)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
BLOB_STORE_URL=https://mr0u602ri2txkwqt.public.blob.vercel-storage.com
```

## 🚀 Next Steps After Adding Variables

1. ✅ Verify: `node scripts/check-env.js`
2. ✅ Check blob structure: `node scripts/verify-blob-setup.js`
3. ✅ Create Supabase schema (see `SUPABASE_VERCEL_BLOB_MIGRATION.md`)
4. ✅ Run migration: `node scripts/migrate-to-supabase.js`

---

**Note:** Make sure `.env.local` is in your `.gitignore` to keep secrets safe!


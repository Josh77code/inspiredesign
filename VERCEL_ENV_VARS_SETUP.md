# Vercel Environment Variables Setup

## ⚠️ Important Security Note

The **Service Role Key** should **NOT** have the `NEXT_PUBLIC_` prefix because it's a secret key that should only be used server-side.

## Correct Environment Variable Names

Add these to your **Vercel Dashboard → Settings → Environment Variables**:

```env
# Supabase (Public - safe to expose)
NEXT_PUBLIC_SUPABASE_URL=https://oaiurcyjavngjhbtzrpy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9haXVyY3lqYXZuZ2poYnR6cnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTY3MTMsImV4cCI6MjA3ODk5MjcxM30.rzu-lPXM-sGnosHY4-rDg11NZwGXlu7ADaBO60OiRqs

# Supabase (SECRET - server-side only, NO NEXT_PUBLIC_ prefix!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9haXVyY3lqYXZuZ2poYnR6cnB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQxNjcxMywiZXhwIjoyMDc4OTkyNzEzfQ.-dhfjvCOmu3xRKwJVOwzqZl8vRAuVHDO8NwVHw3e5Rw

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-blob-token-here
BLOB_STORE_URL=https://mr0u602ri2txkwqt.public.blob.vercel-storage.com
```

## ⚠️ Security Warning

**DO NOT** use `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` - this exposes your secret key to the client!

Use `SUPABASE_SERVICE_ROLE_KEY` instead (without `NEXT_PUBLIC_`).

## How to Add in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. Add each variable:
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://oaiurcyjavngjhbtzrpy.supabase.co`
   - **Environment:** Production, Preview, Development (select all)

4. Repeat for:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (with your anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` (with your service role key - **NO NEXT_PUBLIC_ prefix!**)
   - `BLOB_READ_WRITE_TOKEN` (your blob token)
   - `BLOB_STORE_URL` (your blob URL)

5. **Save** and redeploy

## After Adding

The build should now succeed! The code will:
- ✅ Use Supabase if env vars are set
- ✅ Gracefully handle missing env vars during build
- ✅ Work correctly in production

---

**Note:** The code currently supports both `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` for compatibility, but you should use `SUPABASE_SERVICE_ROLE_KEY` (without NEXT_PUBLIC_) for security.


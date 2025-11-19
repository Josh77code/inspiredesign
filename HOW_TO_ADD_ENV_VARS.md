# How to Add Environment Variables to .env.local

## Current Status
Your `.env.local` file currently has **3 lines** (Stripe variables only).

## What You Need to Add

Add these **5 lines** to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your-token-here
BLOB_STORE_URL=https://mr0u602ri2txkwqt.public.blob.vercel-storage.com
```

## Step-by-Step Instructions

1. **Open `.env.local`** in your project root (`C:\Users\USER\Desktop\Inspiredespign\.env.local`)

2. **Add these lines** at the end (after your Stripe variables):

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-actual-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-actual-key-here
   BLOB_READ_WRITE_TOKEN=your-actual-token-here
   BLOB_STORE_URL=https://mr0u602ri2txkwqt.public.blob.vercel-storage.com
   ```

3. **Replace the placeholder values** with your actual values:
   - **Supabase values**: Get from Supabase Dashboard → Settings → API
   - **Blob token**: Get from Vercel Dashboard → Storage → Blob → Settings → Tokens
   - **Blob URL**: Already set (don't change it)

4. **Save the file**

5. **Verify** by running:
   ```bash
   node scripts/check-env.js
   ```

## Example Format

Your `.env.local` should look like this:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51S7FpA...
STRIPE_SECRET_KEY=sk_live_51S7FpA...
STRIPE_WEBHOOK_SECRET=whsec_replace_w...

NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI4MCwiZXhwIjoxOTU0NTQzMjgwfQ.abcdefghijklmnopqrstuvwxyz1234567890
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM4OTY3MjgwLCJleHAiOjE5NTQ1NDMyODB9.abcdefghijklmnopqrstuvwxyz1234567890
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_abcdefghijklmnopqrstuvwxyz1234567890
BLOB_STORE_URL=https://mr0u602ri2txkwqt.public.blob.vercel-storage.com
```

## Important Notes

- ✅ **No spaces** around the `=` sign
- ✅ **No quotes** needed (but quotes are OK if you prefer)
- ✅ **One variable per line**
- ✅ **Case-sensitive** - variable names must match exactly
- ✅ **Save the file** after adding

## After Adding

Once you've added all 5 variables, run:

```bash
node scripts/check-env.js
```

All 8 variables should show ✅, then we can proceed with migration!


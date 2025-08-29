# Rayofi AI Ad Performance Dashboard

Interactive Next.js dashboard that **auto-syncs Meta (Facebook) Ads insights**, classifies ads as **Full Hit / Soft Hit / Miss**, and visualizes Spend, CTR, CPA, ROAS with filters.

## Features
- Auto-sync from Meta Marketing API (level=ad, daily cron)
- Supabase Postgres storage
- Hit rules tuned for Rayofi (Go-Tone vs SwimComm)
- Interactive filters (date range, product)
- Charts (Spend vs Purchases, CTR% & CPA)
- Dark UI, Tailwind

## Quickstart
1. **Supabase**
   - Create a project → SQL Editor → paste `sql/schema.sql` → Run.
   - Copy `Project URL` and `Service Role Key`.

2. **Environment**
   - Copy `.env.example` → `.env.local` and fill:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `FB_ACCESS_TOKEN` (System User long-lived token)
     - `FB_AD_ACCOUNT_ID` (e.g., `act_123...`)
     - `SYNC_SECRET` (any random string)
   - (Optional) `OPENAI_API_KEY` for future AI summaries.

3. **Run**
   ```bash
   npm install
   npm run dev
   # in a new terminal, trigger a sync
   curl -H "x-sync-secret: $SYNC_SECRET" "http://localhost:3000/api/sync?since=2025-07-01&until=2025-08-29"
   ```

4. **Deploy (Vercel)**
   - Push this repo to GitHub → Import to Vercel.
   - Set the same ENV variables in Vercel.
   - Add **Cron Job** (Settings → Cron):
     - Path: `/api/sync`
     - Schedule: `0 2 * * *` (daily 02:00 UTC)
     - Headers: `x-sync-secret: YOUR_SECRET`

## Notes
- Purchases and revenue require a properly configured Pixel with `purchase` events and value. If absent, CPA/ROAS will be zero or NaN.
- Product inference: the app guesses product from `ad_name` (`SwimComm`, `FreeSwim`, `Go-Tone`). You can update `product` manually in DB if needed.
- For fine-grained auth, enable RLS policies in `sql/schema.sql`.

## Extend
- Add `/api/summary` using OpenAI to generate weekly insights.
- Add UI to edit thresholds per product.
- Add designer parsing from ad_name and per-designer leaderboard.

Enjoy!

# Yas Beauty Allure — E-commerce

Monochrome (black & white) **UI** for Yas Beauty Allure — product photography stays in full color.

## Stack

- Next.js (App Router)
- Tailwind CSS
- **Clerk** — customer accounts + admin access
- Local JSON for **live prices** (`data/prices.json`) and **orders** (`data/orders.json`)
- **Paystack** card/bank checkout

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

**Auth is off by default** so you can review the design without signing in. Open `/admin` directly to edit prices. To enable Clerk later, set `NEXT_PUBLIC_AUTH_ENABLED=true` in `.env.local` and add Clerk keys.

Open [http://localhost:3000](http://localhost:3000).

## Clerk

1. Create an application at [Clerk Dashboard](https://dashboard.clerk.com).
2. Copy keys into `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
3. **Store admins:** set `STORE_ADMIN_EMAILS` to a comma-separated list of allowed emails, *or* set a user’s Clerk `publicMetadata.role` to `admin`.
4. Sign in via header **Account** or `/sign-in`. Admins open `/admin` to edit prices.

## Paystack

1. Add test/live keys to `.env`:
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - `PAYSTACK_SECRET_KEY`
   - `NEXT_PUBLIC_SITE_URL` (production domain, no trailing slash)
2. Checkout → **Pay with Paystack**; return URL `/checkout/complete`.
3. **Webhook (required for reliable orders):** in Paystack Dashboard → Settings → API Keys & Webhooks, set  
   `https://YOUR_DOMAIN/api/paystack/webhook`  
   and enable at least `charge.success`. This records paid orders even if the browser never finishes `/checkout/complete`.

## Deploy (when ready)

Import to Vercel, add env vars, and install Clerk via [Vercel Marketplace](https://vercel.com/marketplace/clerk) for auto-provisioned keys if preferred.

**Note:** JSON file writes on serverless are ephemeral — use a database for production admin/orders when you go live.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CLERK_*` / `CLERK_SECRET_KEY` | Auth |
| `STORE_ADMIN_EMAILS` | Who can access `/admin` |
| `NEXT_PUBLIC_SITE_URL` | Paystack callbacks |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` / `PAYSTACK_SECRET_KEY` | Payments |

## Brand

- Instagram: [@yasbeautyallure](https://instagram.com/yasbeautyallure)
- WhatsApp: [+234 814 224 6407](https://wa.me/2348142246407)

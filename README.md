# O&rsquo;rian Dessert — Membership &amp; Loyalty System

A production-ready, bilingual (中文 / English) NFC &amp; QR digital membership and loyalty platform for **O&rsquo;rian Dessert** — premium handmade strawberry daifuku.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Supabase** (Postgres + Storage). Installable as a **PWA** (Add to Home Screen) and deployable to **Vercel** at `member.orian.com`.

---

## ✦ What it does

**For customers** (view-only — no login)
- Self-register with phone + Instagram handle (optional avatar &amp; birthday)
- Beautiful Apple-Wallet-style member card with a live 12-stamp daifuku grid
- QR code to show staff at the booth
- See unlocked rewards, birthday gift, surprise rewards, and full history
- One-tap follow of **@orian.dessert**
- Bilingual, 中文 by default

**For staff** (`/admin`, shared password)
- **Market Mode** — huge search (phone-first), one-tap **+1 stamp**, instant celebration, redeem rewards
- **Dashboard** — today/month stats, recent &amp; most-active customers, popular rewards
- **Customers** — searchable directory + full member detail with stamp/redeem controls
- **Staff management** &amp; **Settings** (reward rules, latest market location, CSV/Excel export) — Owner only

---

## ✦ Business rules

| Rule | Value |
|------|-------|
| 1 box (4 pcs daifuku) | = 1 stamp |
| Card size | 12 stamps |
| Reward @ 3 | RM5 OFF |
| Reward @ 6 | RM10 OFF |
| Reward @ 9 | FREE 2pcs Daifuku |
| Reward @ 12 | FREE 1 Box (4pcs) — **resets the card** |
| Each milestone reward | redeemable **once per cycle** |
| Stamp expiry | 365 days from last stamp |
| Birthday gift | FREE 2pcs on the customer&rsquo;s birthday |

After the 12-stamp reward, stamps reset to 0 and a new cycle begins. **All history is preserved.**

---

## ✦ Permissions

| Action | Owner | Staff |
|--------|:-----:|:-----:|
| Search / view members | ✅ | ✅ |
| Add member, +1 stamp, redeem | ✅ | ✅ |
| −1 stamp (correction) | ✅ | ❌ |
| Edit reward rules / settings | ✅ | ❌ |
| Send surprise reward | ✅ | ❌ |
| Manage staff | ✅ | ❌ |
| Export data | ✅ | ❌ |

Default accounts: **Owner**, **Staff 1**, **Staff 2** — shared password **`0809`** (change in `.env`).

---

## ✦ Local development

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your Supabase keys
cp .env.example .env.local

# 3. Run the dev server
npm run dev
# → http://localhost:3000
```

You&rsquo;ll need a Supabase project first — see **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**.

---

## ✦ Project structure

```
src/
  app/
    page.tsx              Landing
    register/             Register + "find my card"
    member/               Member card (the centerpiece)
    privacy/  terms/      Legal
    admin/
      login/  dashboard/  market/  customers/  staff/  settings/
    api/                  All server routes (auth, members, stamps,
                          redemptions, surprise, settings, admin, export)
  components/             ui, Celebration, LegalPage, AdminShell
  lib/                    types, supabase, auth, api helpers, client
  i18n/                   Bilingual dictionary + provider
supabase/schema.sql       Run this in Supabase SQL Editor
public/brand/             Logo, daifuku art, PWA icons
docs/                     Deployment, backup guides
```

---

## ✦ Documentation

- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** — Supabase setup, env vars, Vercel deploy, custom domain
- **[docs/BACKUP.md](docs/BACKUP.md)** — backups, exports, restoring data

---

© O&rsquo;rian Dessert. Built with care. 🍓

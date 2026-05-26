-- ════════════════════════════════════════════════════════════════
--  O'rian Dessert — Membership System · Supabase / Postgres Schema
--  Run this whole file in: Supabase Dashboard → SQL Editor → New query
-- ════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ─── STAFF ──────────────────────────────────────────────────────
create table if not exists staff (
  id          uuid primary key default gen_random_uuid(),
  username    text unique not null,
  role        text not null check (role in ('owner','staff')),
  created_at  timestamptz not null default now()
);

-- ─── MEMBERS ────────────────────────────────────────────────────
create table if not exists members (
  id            uuid primary key default gen_random_uuid(),
  phone         text unique not null,
  ig_handle     text,
  avatar_url    text,
  birthday      date,
  stamps        int  not null default 0 check (stamps >= 0 and stamps <= 12),
  cycle         int  not null default 1,
  last_stamp_at timestamptz,
  birthday_gift_claimed_year int,
  created_at    timestamptz not null default now()
);
create index if not exists idx_members_phone on members (phone);
create index if not exists idx_members_ig on members (lower(ig_handle));

-- ─── STAMP EVENTS (full ledger, never deleted) ──────────────────
create table if not exists stamp_events (
  id             uuid primary key default gen_random_uuid(),
  member_id      uuid not null references members(id) on delete cascade,
  cycle          int  not null,
  delta          int  not null,          -- +1 add, -1 staff correction
  staff_username text not null,
  notes          text,
  expired        boolean not null default false,
  created_at     timestamptz not null default now()
);
create index if not exists idx_stamp_member on stamp_events (member_id);

-- ─── REDEMPTIONS (history preserved across cycles) ──────────────
create table if not exists redemptions (
  id             uuid primary key default gen_random_uuid(),
  member_id      uuid not null references members(id) on delete cascade,
  cycle          int  not null,
  reward_code    text not null,
  reward_label   text not null,
  staff_username text not null,
  notes          text,
  created_at     timestamptz not null default now()
);
create index if not exists idx_redemptions_member on redemptions (member_id);
-- Each milestone reward claimable once per cycle (RM5/RM10/FREE_2PCS).
-- 12-stamp reward resets the cycle so a new cycle allows fresh claims.
create unique index if not exists uniq_reward_per_cycle
  on redemptions (member_id, cycle, reward_code);

-- ─── SURPRISE REWARDS (Owner-issued) ────────────────────────────
create table if not exists surprise_rewards (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references members(id) on delete cascade,
  content     text not null,
  sent_by     text not null,
  claimed     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─── AUDIT LOG (every operation) ────────────────────────────────
create table if not exists audit_log (
  id             uuid primary key default gen_random_uuid(),
  staff_username text not null,
  member_phone   text,
  member_ig      text,
  action         text not null,
  notes          text,
  created_at     timestamptz not null default now()
);
create index if not exists idx_audit_created on audit_log (created_at desc);

-- ─── SETTINGS (single row, Owner-editable) ──────────────────────
create table if not exists settings (
  id              int primary key default 1,
  reward_rules    jsonb not null,
  market_location jsonb,
  updated_at      timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

-- ════════════════════════════════════════════════════════════════
--  SEED DATA
-- ════════════════════════════════════════════════════════════════
insert into staff (username, role) values
  ('Owner','owner'), ('Staff 1','staff'), ('Staff 2','staff')
on conflict (username) do nothing;

insert into settings (id, reward_rules, market_location) values (
  1,
  '[
    {"threshold":3,"code":"RM5_OFF","label_zh":"RM5 折扣","label_en":"RM5 OFF","resets":false},
    {"threshold":6,"code":"RM10_OFF","label_zh":"RM10 折扣","label_en":"RM10 OFF","resets":false},
    {"threshold":9,"code":"FREE_2PCS","label_zh":"免费 2 粒大福","label_en":"FREE 2pcs Daifuku","resets":false},
    {"threshold":12,"code":"FREE_BOX_4PCS","label_zh":"免费 1 盒 4 粒大福","label_en":"FREE 1 Box 4pcs Daifuku","resets":true}
  ]'::jsonb,
  '{"place":"待更新 / TBA","date":"","time":"","note":""}'::jsonb
) on conflict (id) do nothing;

-- ════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
--  Browser (anon key) can ONLY read member-facing data.
--  All writes go through API routes using the service-role key,
--  which bypasses RLS. Staff identity is enforced in the API layer.
-- ════════════════════════════════════════════════════════════════
alter table members         enable row level security;
alter table stamp_events    enable row level security;
alter table redemptions     enable row level security;
alter table surprise_rewards enable row level security;
alter table settings        enable row level security;
alter table staff           enable row level security;
alter table audit_log       enable row level security;

-- Public read for member card rendering (no phone leakage in URL: lookups by UUID)
create policy "read members"      on members         for select using (true);
create policy "read stamp_events" on stamp_events     for select using (true);
create policy "read redemptions"  on redemptions      for select using (true);
create policy "read surprise"     on surprise_rewards for select using (true);
create policy "read settings"     on settings         for select using (true);
-- staff & audit_log: NO anon policies => fully private (service role only).

-- ════════════════════════════════════════════════════════════════
--  STORAGE: avatars bucket (run once; or create in Dashboard → Storage)
-- ════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
  values ('avatars','avatars', true)
on conflict (id) do nothing;

create policy "avatar public read" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "avatar anon upload" on storage.objects
  for insert with check (bucket_id = 'avatars');

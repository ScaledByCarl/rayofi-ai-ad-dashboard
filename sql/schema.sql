-- Supabase SQL schema for the dashboard
create table if not exists ad_insights (
  id bigserial primary key,
  date date not null,
  campaign text not null,
  ad_set text not null,
  ad_name text not null,
  product text not null default 'Unknown',
  spend_eur numeric not null default 0,
  impressions integer not null default 0,
  clicks integer not null default 0,
  ctr numeric not null default 0,
  cpc_eur numeric not null default 0,
  purchases integer not null default 0,
  purchase_value numeric not null default 0,
  cpa_eur numeric not null default 0,
  roas numeric not null default 0,
  hit_type text not null default 'Miss'
);

create unique index if not exists ad_unique_by_day on ad_insights (ad_name, date);

-- (Optional) RLS: allow read to anon if you want public read-only dashboard
-- alter table ad_insights enable row level security;
-- create policy "public read" on ad_insights for select using (true);

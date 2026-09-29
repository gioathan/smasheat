-- Smasheat Phase 1 schema: menu, business info, hours, gallery.
-- Designed so a future Phase 2 (orders/order_items) can reference
-- menu_items.id (stable uuid) without altering these tables.
--
-- Tables live in a dedicated `smash_eat` schema rather than `public`.
-- After running this migration, add `smash_eat` to the project's
-- Data API "Exposed schemas" list (Dashboard -> Settings -> API), or
-- PostgREST won't serve it and every query from the app will 404.

create extension if not exists "pgcrypto";

create schema if not exists smash_eat;

-- ── Menu ────────────────────────────────────────────────
create table smash_eat.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table smash_eat.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references smash_eat.categories(id) on delete restrict,
  name text not null,
  description text,
  price_cents integer,              -- nullable: e.g. dips with no listed price
  allergen_notes text,
  image_path text,                  -- path within the 'menu-images' storage bucket
  is_available boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index menu_items_category_order_idx on smash_eat.menu_items (category_id, display_order);

-- ── Business info (singleton row) ──────────────────────
create table smash_eat.business_info (
  id int primary key default 1 check (id = 1),
  phone text not null,
  address_line text not null,
  google_maps_url text not null,
  google_review_url text,
  google_rating numeric(2,1),
  google_review_count int,
  instagram_url text,
  wolt_url text,
  efood_url text,
  updated_at timestamptz not null default now()
);

-- ── Regular weekly hours ────────────────────────────────
create table smash_eat.business_hours (
  id uuid primary key default gen_random_uuid(),
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0=Sun..6=Sat
  is_closed boolean not null default false,
  open_time time,
  close_time time,
  unique (day_of_week)
);

-- ── Holiday / one-off overrides ─────────────────────────
create table smash_eat.hours_overrides (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  is_closed boolean not null default true,
  open_time time,
  close_time time,
  note text,
  created_at timestamptz not null default now()
);

-- ── Gallery ──────────────────────────────────────────────
create table smash_eat.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,        -- path within the 'gallery' storage bucket
  alt_text text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
create index gallery_images_order_idx on smash_eat.gallery_images (display_order);

-- PostgREST needs USAGE on the schema and privileges on its tables for the
-- anon/authenticated roles (RLS policies in the next migration still gate
-- actual row access).
grant usage on schema smash_eat to anon, authenticated;
grant all on all tables in schema smash_eat to anon, authenticated;
alter default privileges in schema smash_eat grant all on tables to anon, authenticated;

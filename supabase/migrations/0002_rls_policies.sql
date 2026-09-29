-- Public (anon) can read published content; only the authenticated
-- admin user (single account, created manually, no public sign-up) can write.

alter table smash_eat.categories enable row level security;
alter table smash_eat.menu_items enable row level security;
alter table smash_eat.business_info enable row level security;
alter table smash_eat.business_hours enable row level security;
alter table smash_eat.hours_overrides enable row level security;
alter table smash_eat.gallery_images enable row level security;

create policy "public read categories" on smash_eat.categories for select using (true);
create policy "admin write categories" on smash_eat.categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read menu_items" on smash_eat.menu_items for select using (true);
create policy "admin write menu_items" on smash_eat.menu_items for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read business_info" on smash_eat.business_info for select using (true);
create policy "admin write business_info" on smash_eat.business_info for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read business_hours" on smash_eat.business_hours for select using (true);
create policy "admin write business_hours" on smash_eat.business_hours for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read hours_overrides" on smash_eat.hours_overrides for select using (true);
create policy "admin write hours_overrides" on smash_eat.hours_overrides for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read gallery_images" on smash_eat.gallery_images for select using (true);
create policy "admin write gallery_images" on smash_eat.gallery_images for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ── Storage buckets ──────────────────────────────────────
-- (storage.objects/buckets always live in the 'storage' schema regardless
-- of the app's own schema, so these are unaffected by the smash_eat move.)
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

create policy "public read menu-images" on storage.objects for select
  using (bucket_id = 'menu-images');
create policy "admin write menu-images" on storage.objects for all
  using (bucket_id = 'menu-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'menu-images' and auth.role() = 'authenticated');

create policy "public read gallery" on storage.objects for select
  using (bucket_id = 'gallery');
create policy "admin write gallery" on storage.objects for all
  using (bucket_id = 'gallery' and auth.role() = 'authenticated')
  with check (bucket_id = 'gallery' and auth.role() = 'authenticated');

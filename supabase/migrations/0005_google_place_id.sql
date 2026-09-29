-- The site now reads the Google rating and review count live from the
-- Places API using this ID, instead of trusting hand-typed numbers.
-- google_rating / google_review_count / google_review_url stay in place as a
-- fallback for when the API is unreachable or not yet configured.
-- Safe to run more than once.

alter table smash_eat.business_info
  add column if not exists google_place_id text;

-- Smasheat, Notara 60, Patra 264 42 (looked up via the Places API).
update smash_eat.business_info
set google_place_id = 'ChIJt4sPTgBJXhMREImhVurpr7s'
where id = 1;

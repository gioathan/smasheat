-- Real Smasheat content: categories, menu items, business info, weekly hours.

insert into smash_eat.categories (slug, name, display_order) values
  ('smash-burgers', 'Smash Burgers', 0),
  ('fried-chicken', 'Fried Chicken', 1),
  ('fries', 'Fries', 2),
  ('dips', 'Dips', 3);

insert into smash_eat.menu_items (category_id, name, description, price_cents, allergen_notes, display_order)
select id, v.name, v.description, v.price_cents, v.allergen_notes, v.display_order
from smash_eat.categories, (values
  ('smash-burgers', 'Cheezzzy', 'Smashed 100% beef patty, cheddar, pickles and Smasheat sauce.', 750, null, 0),
  ('smash-burgers', 'The Essential', 'Smashed 100% beef patty, cheddar, bacon, pickles, Smasheat sauce, tomato and iceberg.', 850, null, 1),
  ('smash-burgers', 'Kiss Me Later', 'Smashed 100% beef patty on a garlic-butter brioche bun, smoked gouda, roasted garlic mayo, bacon, tomato and iceberg.', 930, null, 2),
  ('smash-burgers', 'BBQHead', 'Smashed 100% beef patty, cheddar, bacon jam, caramelised onions, smokey mayo, xxxtra BBQ, tomato and iceberg.', 1050, null, 3),
  ('smash-burgers', 'Truffle Me Up', 'Smashed 100% beef patty, parmesan cream, truffle mayo, mushroom ragu and rocket.', 1150, null, 4),
  ('fried-chicken', 'Dua Lipa', 'Buttermilk fried chicken, cheddar, bacon, lemon-lime mayo, pickles, tomato and iceberg.', 850, null, 0),
  ('fried-chicken', 'JDM', 'Buttermilk fried chicken in a honey-miso glaze, bacon jam, pistachio butter, sriracha mayo, Japanese slaw and pickles.', 1250, 'Contains pistachio.', 1),
  ('fries', 'Plain Fries', 'Golden, crispy and salted just right.', 850, null, 0),
  ('fries', 'Itsamess Fries', 'Fries topped with a smashed 100% beef patty, Smasheat sauce and pickles.', 850, null, 1),
  ('fries', 'Cheddar Bacon Fries', 'Fries loaded with cheddar and bacon.', 850, null, 2),
  ('fries', 'Caesars Lover', 'Fries with grated parmesan, bacon and Caesar sauce.', 850, null, 3),
  ('fries', 'Pastitsio Fries', 'Fries with beef mince and smoked bechamel.', 850, null, 4),
  ('fries', 'Truffle Fries', 'Fries with truffle mayo and grated parmesan.', 850, null, 5),
  ('dips', 'Smasheat Sauce', 'Our house signature dip.', null, null, 0),
  ('dips', 'Roasted Garlic Mayo', 'House-made roasted garlic mayo.', null, null, 1),
  ('dips', 'Smokey Mayo', 'House-made smokey mayo.', null, null, 2),
  ('dips', 'Truffle Mayo', 'House-made truffle mayo.', null, null, 3),
  ('dips', 'Sriracha Mayo', 'House-made sriracha mayo.', null, null, 4),
  ('dips', 'Lemon Lime Mayo', 'House-made lemon-lime mayo.', null, null, 5),
  ('dips', 'xxxtra BBQ', 'House-made BBQ sauce.', null, null, 6)
) as v(category_slug, name, description, price_cents, allergen_notes, display_order)
where categories.slug = v.category_slug;

insert into smash_eat.business_info (
  id, phone, address_line, google_maps_url, google_review_url,
  google_rating, google_review_count, instagram_url, wolt_url, efood_url
) values (
  1,
  '+302610421000',
  'Notara 60, Patras 264 42',
  'https://www.google.com/maps/dir/?api=1&destination=Smasheat%20Notara%2060%20Patra%2026442',
  'https://www.google.com/maps/search/?api=1&query=Smasheat%20Notara%2060%20Patra',
  4.8,
  23,
  'https://www.instagram.com/smash_eat_burgers/',
  'https://wolt.com/en/grc/patra/restaurant/smasheat-patra',
  'https://www.e-food.gr/delivery/patra/smasheat-burgers-7823593'
);

-- Mon=1 closed; Tue-Sun (2..6,0) open 17:00-00:00
insert into smash_eat.business_hours (day_of_week, is_closed, open_time, close_time) values
  (0, false, '17:00', '00:00'), -- Sunday
  (1, true, null, null),        -- Monday (closed)
  (2, false, '17:00', '00:00'), -- Tuesday
  (3, false, '17:00', '00:00'), -- Wednesday
  (4, false, '17:00', '00:00'), -- Thursday
  (5, false, '17:00', '00:00'), -- Friday
  (6, false, '17:00', '00:00'); -- Saturday

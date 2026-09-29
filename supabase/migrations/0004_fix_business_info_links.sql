-- 0003 seeded business_info with placeholder Google Maps/review/Wolt/e-food
-- links; this corrects them to the real deep links from the reference site.

update smash_eat.business_info
set
  google_maps_url = 'https://www.google.com/maps/dir/?api=1&destination=Smasheat%20Notara%2060%20Patra%2026442',
  google_review_url = 'https://www.google.com/maps/search/?api=1&query=Smasheat%20Notara%2060%20Patra',
  wolt_url = 'https://wolt.com/en/grc/patra/restaurant/smasheat-patra',
  efood_url = 'https://www.e-food.gr/delivery/patra/smasheat-burgers-7823593'
where id = 1;

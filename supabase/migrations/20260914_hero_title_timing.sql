alter table public.visual_settings
  add column if not exists hero_first_effect_time numeric not null default 3.56 check (hero_first_effect_time between 0 and 60),
  add column if not exists hero_second_effect_time numeric not null default 6.36 check (hero_second_effect_time between 0 and 60 and hero_second_effect_time > hero_first_effect_time);

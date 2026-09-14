alter table public.visual_settings
  add column if not exists welcome_title_scale integer not null default 55 check (welcome_title_scale between 0 and 100);

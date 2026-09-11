alter table public.announcement_settings
  add column if not exists marquee boolean not null default false,
  add column if not exists show_fairs boolean not null default false,
  add column if not exists fairs jsonb not null default '[]'::jsonb
    check (jsonb_typeof(fairs) = 'array' and jsonb_array_length(fairs) <= 30);

update public.announcement_settings
set marquee = true, show_fairs = true, fairs = '[
  {"id":"outubro-2026","label":"10 de Outubro/26 - Bazar de Quintal - Praça do Oscar Villares","endDate":"2026-10-10"},
  {"id":"novembro-2026","label":"21 de Novembro/26 - Ubuntu","endDate":"2026-11-21"},
  {"id":"dezembro-2026","label":"11, 12 e 13 de Dezembro/26 - Bazer de Quintal - Clube da praça","endDate":"2026-12-13"}
]'::jsonb
where id = 1 and fairs = '[]'::jsonb;

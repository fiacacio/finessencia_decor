-- Preserve existing color preferences while adding editable text and typography.
alter table public.section_color_settings
add column if not exists content jsonb not null default '{}'::jsonb
check (jsonb_typeof(content) = 'object' and octet_length(content::text) <= 100000);

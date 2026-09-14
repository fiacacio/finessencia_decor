-- Run after the section_color_settings migration. Existing colors are preserved.
alter table public.section_color_settings
add column if not exists content jsonb not null default '{}'::jsonb
check (jsonb_typeof(content) = 'object' and octet_length(content::text) <= 100000);
-- Existing RLS permits public reads and administrator-only updates.

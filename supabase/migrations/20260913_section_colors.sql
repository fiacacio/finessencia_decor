create table if not exists public.section_color_settings (
  id integer primary key default 1 check (id = 1),
  colors jsonb not null default '{}'::jsonb,
  constraint valid_section_colors check (
    jsonb_typeof(colors) = 'object'
    and colors - array['announcement','header','hero','welcome','arrivals','showcase','catalog','story','about','brand','footer'] = '{}'::jsonb
    and not jsonb_path_exists(colors, '$.* ? (@ != "#faf6f0" && @ != "#f3e9dd" && @ != "#ca8a4a" && @ != "#a75e2b" && @ != "#3a2419" && @ != "#7a8a74")')
  )
);
insert into public.section_color_settings (id) values (1) on conflict (id) do nothing;
alter table public.section_color_settings enable row level security;
grant select on public.section_color_settings to anon, authenticated;
grant update on public.section_color_settings to authenticated;
drop policy if exists "Public reads section colors" on public.section_color_settings;
create policy "Public reads section colors" on public.section_color_settings for select using (true);
drop policy if exists "Admins update section colors" on public.section_color_settings;
create policy "Admins update section colors" on public.section_color_settings for update to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
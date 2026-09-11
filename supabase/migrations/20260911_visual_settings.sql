create table if not exists public.visual_settings (
  id integer primary key default 1 check (id = 1),
  spray_enabled boolean not null default true
);
alter table public.visual_settings
  add column if not exists particle_count integer not null default 700 check (particle_count between 50 and 1500),
  add column if not exists particle_color text not null default '#a75e2b' check (particle_color ~ '^#[0-9a-fA-F]{6}$'),
  add column if not exists particle_opacity integer not null default 85 check (particle_opacity between 0 and 100);
insert into public.visual_settings (id, spray_enabled) values (1, true)
on conflict (id) do nothing;
alter table public.visual_settings enable row level security;
grant select on public.visual_settings to anon, authenticated;
grant update on public.visual_settings to authenticated;
drop policy if exists "Public reads visual settings" on public.visual_settings;
create policy "Public reads visual settings" on public.visual_settings for select using (true);
drop policy if exists "Admins update visual settings" on public.visual_settings;
create policy "Admins update visual settings" on public.visual_settings for update to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

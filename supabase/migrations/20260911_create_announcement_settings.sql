create table if not exists public.announcement_settings (
  id integer primary key default 1 check (id = 1),
  visible boolean not null default true,
  text text not null check (char_length(trim(text)) between 1 and 160),
  color text not null check (color ~ '^#[0-9a-fA-F]{6}$')
);

insert into public.announcement_settings (id, visible, text, color)
values (1, true, 'FRETE GRÁTIS PARA PEDIDOS ACIMA DE R$ 199', '#ca8a4a')
on conflict (id) do nothing;

alter table public.announcement_settings enable row level security;
grant select on public.announcement_settings to anon, authenticated;
grant insert, update, delete on public.announcement_settings to authenticated;

create policy "Public can read announcement" on public.announcement_settings
for select using (true);
create policy "Admins manage announcement" on public.announcement_settings
for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

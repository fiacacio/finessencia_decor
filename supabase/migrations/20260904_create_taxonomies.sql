create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(trim(name)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.essences (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(trim(name)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.taxonomies_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories for each row execute procedure public.taxonomies_set_updated_at();
drop trigger if exists essences_set_updated_at on public.essences;
create trigger essences_set_updated_at before update on public.essences for each row execute procedure public.taxonomies_set_updated_at();

insert into public.categories (name)
select distinct trim(category) from public.products where category is not null and trim(category) <> ''
on conflict (name) do nothing;
insert into public.essences (name)
select distinct trim(essence) from public.products where essence is not null and trim(essence) <> ''
on conflict (name) do nothing;

alter table public.categories enable row level security;
alter table public.essences enable row level security;

create policy "Admins manage categories" on public.categories for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins manage essences" on public.essences for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

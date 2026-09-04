-- Execute this migration with the Supabase CLI or SQL Editor before using /admin.
create extension if not exists unaccent;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  slug text not null unique default '',
  description text,
  price numeric(10,2) not null check (price >= 0),
  category text,
  essence text,
  detail text,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.products_set_slug_and_updated_at()
returns trigger language plpgsql as $$
begin
  new.slug := lower(regexp_replace(unaccent(trim(new.name)), '[^a-zA-Z0-9]+', '-', 'g'));
  new.slug := trim(both '-' from new.slug);
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists products_set_slug_and_updated_at on public.products;
create trigger products_set_slug_and_updated_at before insert or update on public.products
for each row execute procedure public.products_set_slug_and_updated_at();

create index if not exists products_active_updated_at_idx on public.products(active, updated_at desc);
create index if not exists products_category_idx on public.products(category);

insert into public.products (name, price, category, detail, description, image_url, active) values
  ('Vela Aromática', 39.90, 'Velas', '120 g', 'Aroma acolhedor para momentos de pausa.', '/essencias_clique/Velas.jfif', true),
  ('Home Spray', 49.90, 'Home Spray', '250 ml', 'Perfuma seu espaço com leveza e frescor.', '/essencias_clique/Home Spray.jfif', true),
  ('Difusor de Ambientes', 59.90, 'Difusores', '200 ml', 'Fragrância contínua para acolher o ambiente.', '/essencias_clique/Difusores.jfif', true),
  ('Blend Aromático', 29.90, 'Blends', '50 g', 'Mistura aromática para rituais sensoriais.', '/essencias_clique/Blend Aromático.jfif', true),
  ('Escalda-Pés', 34.90, 'Escalda Pés', '150 g', 'Cuidado e relaxamento em cada pausa.', '/essencias_clique/Escalda pés.jfif', true),
  ('Sabonete Artesanal', 22.90, 'Sabonetes', '100 g', 'Limpeza delicada e perfumada para a rotina.', '/essencias_clique/Sabonete Artesanal.jfif', true)
on conflict (slug) do nothing;

alter table public.products enable row level security;

create policy "Public can read active products" on public.products for select using (active = true);
create policy "Admins manage products" on public.products for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

create policy "Public can view product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Admins manage product images" on storage.objects for all to authenticated
using (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check (bucket_id = 'product-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create table if not exists public.customer_popup_settings (
  id integer primary key default 1 check (id = 1),
  enabled boolean not null default false,
  image_url text not null default '/essencias_clique/Difusores.webp',
  title text not null default 'Faça parte da nossa essência' check (char_length(trim(title)) between 1 and 120),
  coupon_code text not null default '' check (char_length(coupon_code) <= 60)
);
insert into public.customer_popup_settings (id) values (1) on conflict do nothing;
alter table public.customer_popup_settings enable row level security;
grant select on public.customer_popup_settings to anon, authenticated;
grant update on public.customer_popup_settings to authenticated;
drop policy if exists "Public reads customer popup" on public.customer_popup_settings;
create policy "Public reads customer popup" on public.customer_popup_settings for select using (true);
drop policy if exists "Admins update customer popup" on public.customer_popup_settings;
create policy "Admins update customer popup" on public.customer_popup_settings for update to authenticated
using ((auth.jwt()->'app_metadata'->>'role') = 'admin') with check ((auth.jwt()->'app_metadata'->>'role') = 'admin');

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null unique check (char_length(email) <= 254 and email = lower(trim(email))),
  phone text not null check (phone ~ '^[0-9]{10,15}$'),
  birth_date date,
  marketing_consent boolean not null default false,
  marketing_consent_at timestamptz,
  consent_text text not null default 'Quero receber novidades e ofertas da Finessência por e-mail e celular.',
  source text not null default 'website_popup',
  created_at timestamptz not null default now()
);
alter table public.customers enable row level security;
revoke all on public.customers from anon, authenticated;
grant select, update, delete on public.customers to authenticated;
drop policy if exists "Admins manage customers" on public.customers;
create policy "Admins manage customers" on public.customers for all to authenticated
using ((auth.jwt()->'app_metadata'->>'role') = 'admin') with check ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Public registration returns no personal data and never updates existing customers.
create or replace function public.register_customer(p_name text, p_email text, p_phone text, p_birth_date date, p_marketing_consent boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.customer_popup_settings where id = 1 and enabled) then
    raise exception 'Registration unavailable';
  end if;
  if p_name is null or char_length(trim(p_name)) not between 2 and 120
    or p_email is null or char_length(p_email) > 254 or trim(p_email) !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or p_phone is null or p_phone !~ '^[0-9]{10,15}$'
    or (p_birth_date is not null and (p_birth_date > (now() at time zone 'America/Sao_Paulo')::date or p_birth_date < date '1900-01-01')) then
    raise exception 'Invalid registration';
  end if;
  insert into public.customers (name,email,phone,birth_date,marketing_consent,marketing_consent_at)
  values (trim(p_name),lower(trim(p_email)),p_phone,p_birth_date,coalesce(p_marketing_consent,false),case when p_marketing_consent then now() else null end)
  on conflict (email) do nothing;
end;
$$;
revoke all on function public.register_customer(text,text,text,date,boolean) from public;
grant execute on function public.register_customer(text,text,text,date,boolean) to anon, authenticated;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('popup-images','popup-images',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict (id) do nothing;
drop policy if exists "Public reads popup images" on storage.objects;
create policy "Public reads popup images" on storage.objects for select using (bucket_id = 'popup-images');
drop policy if exists "Admins manage popup images" on storage.objects;
create policy "Admins manage popup images" on storage.objects for all to authenticated
using (bucket_id = 'popup-images' and (auth.jwt()->'app_metadata'->>'role') = 'admin')
with check (bucket_id = 'popup-images' and (auth.jwt()->'app_metadata'->>'role') = 'admin');


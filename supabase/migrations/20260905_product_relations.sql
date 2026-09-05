-- Run after both 20260904 migrations. Review legacy products first (see README).
begin;
lock table public.products, public.categories, public.essences in access exclusive mode;

do $$
begin
  if exists (select 1 from public.products where nullif(trim(category), '') is null
    or nullif(trim(essence), '') is null) then
    raise exception 'Há produtos sem categoria ou essência. Preencha os campos legados antes de executar esta migração. Consulte o README.';
  end if;
end;
$$;

insert into public.categories(name)
select distinct trim(category) from public.products on conflict (name) do nothing;
insert into public.essences(name)
select distinct trim(essence) from public.products
where trim(essence) <> 'Disponível em todas as essências'
on conflict (name) do nothing;

alter table public.products
  add column category_id uuid references public.categories(id) on delete restrict,
  add column all_essences boolean not null default false;
update public.products p set category_id = c.id from public.categories c where c.name = trim(p.category);
alter table public.products alter column category_id set not null;

create table public.product_essences (
  product_id uuid not null references public.products(id) on delete cascade,
  essence_id uuid not null references public.essences(id) on delete restrict,
  primary key (product_id, essence_id)
);
create index product_essences_essence_idx on public.product_essences(essence_id);
create index products_category_id_idx on public.products(category_id);
update public.products set all_essences = true where trim(essence) = 'Disponível em todas as essências';
insert into public.product_essences(product_id, essence_id)
select p.id, e.id from public.products p join public.essences e on e.name = trim(p.essence)
where not p.all_essences;

-- Preserve the original text for audit; application reads/writes only the relationships.
alter table public.products rename column category to legacy_category;
alter table public.products rename column essence to legacy_essence;

alter table public.product_essences enable row level security;
create policy "Public can read product essences" on public.product_essences for select
using (exists (select 1 from public.products p where p.id = product_id and p.active));
create policy "Admins manage product essences" on public.product_essences for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Public can read categories" on public.categories for select using (true);
create policy "Public can read essences" on public.essences for select using (true);
grant select on public.categories, public.essences, public.product_essences to anon, authenticated;
grant insert, update, delete on public.product_essences to authenticated;

-- Serialize catalog mutations, including direct SQL, so concurrent removals cannot
-- leave a product with no essence. One transaction can replace its entire selection.
create function public.lock_product_relations() returns trigger
language plpgsql set search_path = public, pg_temp as $$
begin
  perform pg_advisory_xact_lock(20260905, 1);
  return null;
end;
$$;
create trigger products_lock_relations before insert or update or delete on public.products
for each statement execute function public.lock_product_relations();
create trigger product_essences_lock_relations before insert or update or delete on public.product_essences
for each statement execute function public.lock_product_relations();
create trigger essences_lock_relations before insert or update or delete on public.essences
for each statement execute function public.lock_product_relations();

create function public.check_product_relations() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if exists (
    select 1 from public.products p
    where (not p.all_essences and not exists (select 1 from public.product_essences pe where pe.product_id = p.id))
       or (p.all_essences and (not exists (select 1 from public.essences)
           or exists (select 1 from public.product_essences pe where pe.product_id = p.id)))
  ) then
    raise exception 'Cada produto precisa de pelo menos uma essência ou da opção de todas as essências (com essências cadastradas).'
      using errcode = '23514';
  end if;
  return null;
end;
$$;
create constraint trigger products_check_relations after insert or update or delete on public.products
deferrable initially deferred for each row execute function public.check_product_relations();
create constraint trigger product_essences_check_relations after insert or update or delete on public.product_essences
deferrable initially deferred for each row execute function public.check_product_relations();
create constraint trigger essences_check_relations after insert or update or delete on public.essences
deferrable initially deferred for each row execute function public.check_product_relations();

create function public.save_product(p_id uuid, p_input jsonb) returns uuid
language plpgsql security invoker set search_path = public, pg_temp as $$
declare
  saved_id uuid;
  selected_ids uuid[];
  use_all boolean := coalesce((p_input ->> 'all_essences')::boolean, false);
begin
  if (auth.jwt() -> 'app_metadata' ->> 'role') is distinct from 'admin' then
    raise exception 'Acesso administrativo necessário.' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(20260905, 1);
  select coalesce(array_agg(distinct value::uuid), '{}'::uuid[]) into selected_ids
  from jsonb_array_elements_text(p_input -> 'essence_ids');
  if not use_all and cardinality(selected_ids) = 0 then
    raise exception 'Selecione pelo menos uma essência.' using errcode = '23514';
  end if;
  if use_all and not exists (select 1 from public.essences) then
    raise exception 'Cadastre pelo menos uma essência.' using errcode = '23514';
  end if;
  if p_id is null then
    insert into public.products(name, description, price, category_id, all_essences, detail, image_url, active)
    values (trim(p_input ->> 'name'), p_input ->> 'description', (p_input ->> 'price')::numeric,
      (p_input ->> 'category_id')::uuid, use_all, p_input ->> 'detail', p_input ->> 'image_url',
      (p_input ->> 'active')::boolean) returning id into saved_id;
  else
    update public.products set name = trim(p_input ->> 'name'), description = p_input ->> 'description',
      price = (p_input ->> 'price')::numeric, category_id = (p_input ->> 'category_id')::uuid,
      all_essences = use_all, detail = p_input ->> 'detail', image_url = p_input ->> 'image_url',
      active = (p_input ->> 'active')::boolean
    where id = p_id returning id into saved_id;
    if saved_id is null then raise exception 'Produto não encontrado.'; end if;
  end if;
  delete from public.product_essences where product_id = saved_id;
  if not use_all then
    insert into public.product_essences(product_id, essence_id)
    select saved_id, unnest(selected_ids);
  end if;
  return saved_id;
end;
$$;
revoke all on function public.save_product(uuid, jsonb) from public, anon;
grant execute on function public.save_product(uuid, jsonb) to authenticated;
revoke all on function public.check_product_relations() from public;
revoke all on function public.lock_product_relations() from public;

-- Schedule validation of all migrated rows before committing.
update public.products set all_essences = all_essences;
commit;

-- Atualização para o banco atual: category_id, all_essences e product_essences.
begin;
alter table public.categories add column if not exists image_url text, add column if not exists hover_image_url text;
alter table public.essences add column if not exists image_url text, add column if not exists hover_image_url text;
create table if not exists public.admin_schema_updates (name text primary key);
alter table public.admin_schema_updates enable row level security;
revoke all on public.admin_schema_updates from anon, authenticated;
do $$ begin
if not exists (select 1 from public.admin_schema_updates where name = 'taxonomy-images-v1') then
insert into public.essences (name,image_url,hover_image_url) values ('Alecrim','/essencias/Alecrim Arco.webp','/essencias_clique/Alecrim.webp') on conflict (name) do update set image_url = coalesce(essences.image_url,excluded.image_url), hover_image_url = coalesce(essences.hover_image_url,excluded.hover_image_url);
insert into public.essences (name,image_url,hover_image_url) values ('Capim Limão','/essencias/Capim limão Arco.webp','/essencias_clique/Capim limão.webp') on conflict (name) do update set image_url = coalesce(essences.image_url,excluded.image_url), hover_image_url = coalesce(essences.hover_image_url,excluded.hover_image_url);
insert into public.essences (name,image_url,hover_image_url) values ('Flor de Figo','/essencias/Flor de figo Arco.webp','/essencias_clique/Flor de Figo.webp') on conflict (name) do update set image_url = coalesce(essences.image_url,excluded.image_url), hover_image_url = coalesce(essences.hover_image_url,excluded.hover_image_url);
insert into public.essences (name,image_url,hover_image_url) values ('Laranjeira','/essencias/Laranjeira Arco.webp','/essencias_clique/Laranjeira.webp') on conflict (name) do update set image_url = coalesce(essences.image_url,excluded.image_url), hover_image_url = coalesce(essences.hover_image_url,excluded.hover_image_url);
insert into public.essences (name,image_url,hover_image_url) values ('Lavanda','/essencias/Lavanda Arco.webp','/essencias_clique/Lavanda.webp') on conflict (name) do update set image_url = coalesce(essences.image_url,excluded.image_url), hover_image_url = coalesce(essences.hover_image_url,excluded.hover_image_url);
insert into public.essences (name,image_url,hover_image_url) values ('Cereja e Avelã','/essencias/Cereja e Avelã Arco.webp','/essencias_clique/Cereja e Avelã.webp') on conflict (name) do update set image_url = coalesce(essences.image_url,excluded.image_url), hover_image_url = coalesce(essences.hover_image_url,excluded.hover_image_url);
insert into public.essences (name,image_url,hover_image_url) values ('Daslu','/essencias/Daslu Arco.webp','/essencias_clique/Daslu.webp') on conflict (name) do update set image_url = coalesce(essences.image_url,excluded.image_url), hover_image_url = coalesce(essences.hover_image_url,excluded.hover_image_url);
insert into public.essences (name,image_url,hover_image_url) values ('Limão Siciliano','/essencias/Limão Siciliano Arco.webp','/essencias_clique/Limão Siciliano.webp') on conflict (name) do update set image_url = coalesce(essences.image_url,excluded.image_url), hover_image_url = coalesce(essences.hover_image_url,excluded.hover_image_url);
insert into public.essences (name,image_url,hover_image_url) values ('Maçã com Canela','/essencias/Maça com Canela Arco.webp','/essencias_clique/Maça com Canela.webp') on conflict (name) do update set image_url = coalesce(essences.image_url,excluded.image_url), hover_image_url = coalesce(essences.hover_image_url,excluded.hover_image_url);
insert into public.categories (name,image_url,hover_image_url) values ('Velas','/essencias_clique/Velas.webp',null) on conflict (name) do update set image_url = coalesce(categories.image_url,excluded.image_url), hover_image_url = coalesce(categories.hover_image_url,excluded.hover_image_url);
insert into public.categories (name,image_url,hover_image_url) values ('Home Spray','/essencias_clique/Home Spray.webp',null) on conflict (name) do update set image_url = coalesce(categories.image_url,excluded.image_url), hover_image_url = coalesce(categories.hover_image_url,excluded.hover_image_url);
insert into public.categories (name,image_url,hover_image_url) values ('Difusores','/essencias_clique/Difusores.webp',null) on conflict (name) do update set image_url = coalesce(categories.image_url,excluded.image_url), hover_image_url = coalesce(categories.hover_image_url,excluded.hover_image_url);
insert into public.categories (name,image_url,hover_image_url) values ('Blends','/essencias_clique/Blend Aromático.webp',null) on conflict (name) do update set image_url = coalesce(categories.image_url,excluded.image_url), hover_image_url = coalesce(categories.hover_image_url,excluded.hover_image_url);
insert into public.categories (name,image_url,hover_image_url) values ('Escalda Pés','/essencias_clique/Escalda pés.webp',null) on conflict (name) do update set image_url = coalesce(categories.image_url,excluded.image_url), hover_image_url = coalesce(categories.hover_image_url,excluded.hover_image_url);
insert into public.categories (name,image_url,hover_image_url) values ('Rechauds','/essencias_clique/Velas.webp',null) on conflict (name) do update set image_url = coalesce(categories.image_url,excluded.image_url), hover_image_url = coalesce(categories.hover_image_url,excluded.hover_image_url);
insert into public.categories (name,image_url,hover_image_url) values ('Sabonetes','/essencias_clique/Sabonete Artesanal.webp',null) on conflict (name) do update set image_url = coalesce(categories.image_url,excluded.image_url), hover_image_url = coalesce(categories.hover_image_url,excluded.hover_image_url);
insert into public.admin_schema_updates(name) values ('taxonomy-images-v1');
end if; end $$;
grant select on public.categories,public.essences to anon,authenticated;
grant insert,update,delete on public.categories,public.essences to authenticated;
drop policy if exists "Public reads categories" on public.categories;
create policy "Public reads categories" on public.categories for select using (true);
drop policy if exists "Public reads essences" on public.essences;
create policy "Public reads essences" on public.essences for select using (true);

create or replace function public.admin_save_product(p_id uuid, p_product jsonb, p_essence_ids uuid[])
returns jsonb language plpgsql security invoker set search_path = public, extensions as $$
declare saved_id uuid; result jsonb;
begin
  if coalesce(auth.jwt()->'app_metadata'->>'role','') <> 'admin' then raise insufficient_privilege using message = 'Acesso administrativo necessário.'; end if;
  if p_id is null then
    insert into public.products(name,description,price,category_id,all_essences,detail,image_url,active)
    values(trim(p_product->>'name'),p_product->>'description',(p_product->>'price')::numeric,(p_product->>'category_id')::uuid,
      coalesce((p_product->>'all_essences')::boolean,false),p_product->>'detail',p_product->>'image_url',coalesce((p_product->>'active')::boolean,true)) returning id into saved_id;
  else
    update public.products set name=trim(p_product->>'name'),description=p_product->>'description',price=(p_product->>'price')::numeric,
      category_id=(p_product->>'category_id')::uuid,all_essences=coalesce((p_product->>'all_essences')::boolean,false),
      detail=p_product->>'detail',image_url=p_product->>'image_url',active=(p_product->>'active')::boolean where id=p_id returning id into saved_id;
    if saved_id is null then raise exception 'Produto não encontrado ou sem permissão para salvar.'; end if;
  end if;
  delete from public.product_essences where product_id=saved_id;
  if not coalesce((p_product->>'all_essences')::boolean,false) then
    insert into public.product_essences(product_id,essence_id) select saved_id,unnest(coalesce(p_essence_ids,'{}'::uuid[])) on conflict do nothing;
  end if;
  select to_jsonb(p) || jsonb_build_object('categories',(select jsonb_build_object('id',c.id,'name',c.name) from public.categories c where c.id=p.category_id),
    'product_essences',coalesce((select jsonb_agg(jsonb_build_object('essences',jsonb_build_object('id',e.id,'name',e.name))) from public.product_essences pe join public.essences e on e.id=pe.essence_id where pe.product_id=p.id),'[]'::jsonb)) into result from public.products p where p.id=saved_id;
  return result;
end $$;
revoke all on function public.admin_save_product(uuid,jsonb,uuid[]) from public,anon;
grant execute on function public.admin_save_product(uuid,jsonb,uuid[]) to authenticated;
notify pgrst, 'reload schema';
commit;

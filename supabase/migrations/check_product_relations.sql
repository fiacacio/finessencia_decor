-- Execute BEFORE 20260905_product_relations.sql to identify missing decisions.
select id, name, category, essence
from public.products
where nullif(trim(category), '') is null or nullif(trim(essence), '') is null
order by name;

-- Review existing taxonomy names before filling legacy product fields.
select id, name from public.categories order by name;
select id, name from public.essences order by name;

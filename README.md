# Finessência

Site institucional e mostruário de decor aromático da Finessência.

## Desenvolvimento local

```bash
pnpm install
pnpm dev
```

O projeto utiliza Next.js, React, TypeScript e Tailwind CSS.

## Painel administrativo

1. Crie um projeto Supabase e execute, nesta ordem, `supabase/migrations/20260904_create_products.sql` e `supabase/migrations/20260904_create_taxonomies.sql` no SQL Editor. Em bancos existentes, não repita as migrações já aplicadas. Depois siga a preparação abaixo e execute `supabase/migrations/20260905_product_relations.sql` antes de publicar esta versão.
2. Copie `.env.example` para `.env.local` e preencha a URL e a chave anônima do projeto.
3. Crie o usuário administrador em **Authentication > Users** e defina o `app_metadata` dele como `{ "role": "admin" }` usando o Admin API ou a ferramenta de gerenciamento do Supabase. Essa etapa permite que as políticas RLS autorizem escrita.
4. Acesse `/admin` e entre com o e-mail e a senha desse usuário.

O catálogo público consulta apenas produtos ativos. Enquanto as variáveis não estiverem configuradas, a página mantém o catálogo de apresentação local para não ficar vazia durante a transição.

## Categorias e essências dos produtos

Todo produto persistido tem uma categoria obrigatória (`category_id`) e uma ou mais essências na tabela `product_essences`, ou `all_essences = true`. A opção de todas inclui essências cadastradas no futuro, exibe **Disponível em todas as essências** e exige ao menos uma essência no cadastro. Selecionar individualmente todas as opções mantém uma lista fixa; não ativa automaticamente a opção dinâmica.

O admin salva via `save_product`, que atualiza o produto e suas associações na mesma transação, com as permissões RLS existentes. Chaves estrangeiras impedem excluir categorias ou essências vinculadas; verificações adiadas até o commit impedem produtos sem essência, inclusive em alterações SQL diretas. Renomear uma categoria/essência preserva os vínculos pelos IDs. Os textos anteriores ficam em `legacy_category` e `legacy_essence` apenas para auditoria.

### Preparação do banco existente

Execute `supabase/check_product_relations.sql`. Se houver linhas no primeiro resultado, preencha no Table Editor do Supabase os campos antigos `category` e `essence` de cada produto com os nomes corretos antes da migração. Para um produto confirmado como disponível em todas, preencha `essence` com o texto exato `Disponível em todas as essências`. Não use esse texto se a disponibilidade não estiver confirmada. Uma essência específica existente é migrada pelo nome; depois da migração, selecione outras pelo admin. Não use uma lista separada por vírgulas no campo antigo.

Os seis produtos de demonstração da migração original não possuem essência: exigem essa revisão também em instalações novas. Não atribuímos um aroma ou disponibilidade total automaticamente. A migração aborta integralmente se houver campos vazios, preservando o banco para correção e nova tentativa.

Após revisar os produtos, execute **todo** o arquivo `supabase/migrations/20260905_product_relations.sql` no SQL Editor, uma única vez. Ele contém a transação, os vínculos, a migração dos dados, as políticas de leitura pública das taxonomias e a função de salvamento. Aplique antes de disponibilizar o novo frontend/admin, pois as versões anteriores usam os campos de texto renomeados.

O repositório contém duas migrações antigas com o mesmo prefixo `20260904`; por isso, para este histórico use a ordem explícita no SQL Editor e não presuma que a CLI já registrou ambas.

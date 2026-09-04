# Finessência

Site institucional e mostruário de decor aromático da Finessência.

## Desenvolvimento local

```bash
pnpm install
pnpm dev
```

O projeto utiliza Next.js, React, TypeScript e Tailwind CSS.

## Painel administrativo

1. Crie um projeto Supabase e execute `supabase/migrations/20260904_create_products.sql` no SQL Editor (ou via Supabase CLI).
2. Copie `.env.example` para `.env.local` e preencha a URL e a chave anônima do projeto.
3. Crie o usuário administrador em **Authentication > Users** e defina o `app_metadata` dele como `{ "role": "admin" }` usando o Admin API ou a ferramenta de gerenciamento do Supabase. Essa etapa permite que as políticas RLS autorizem escrita.
4. Acesse `/admin` e entre com o e-mail e a senha desse usuário.

O catálogo público consulta apenas produtos ativos. Enquanto as variáveis não estiverem configuradas, a página mantém o catálogo de apresentação local para não ficar vazia durante a transição.

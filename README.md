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

## Barra superior

Execute `supabase/migrations/20260911_create_announcement_settings.sql` no SQL Editor do Supabase. Depois, em `/admin`, abra **Barra superior** para mostrar/ocultar o aviso, editar o texto e escolher a cor de fundo. A prévia ajusta automaticamente a cor do texto para manter o contraste.

Use **Salvar alterações** para publicar a configuração para todos os visitantes, que a recebem ao abrir ou atualizar a página. Apenas administradores podem alterar essas opções. Se a tabela ainda não estiver disponível, o site mantém o aviso padrão e o painel informa a falha sem simular um salvamento local.

Para o letreiro e a agenda de feiras, execute também `supabase/migrations/20260911_announcement_marquee.sql` após a criação da tabela acima. Essa migração cadastra as três feiras de outubro, novembro e dezembro de 2026 e ativa o modo letreiro com feiras. No painel, é possível ativar o movimento separadamente e escolher entre o texto livre e a agenda. Cada feira tem descrição e último dia; ela some da barra após essa data no fuso America/Sao_Paulo, inclusive em páginas abertas (atualização a cada 30 segundos). Eventos encerrados permanecem no painel para edição. Sem feiras futuras, a barra em modo feiras fica oculta. O letreiro oferece pausa e respeita a preferência de movimento reduzido.

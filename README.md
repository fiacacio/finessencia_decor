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

Para o letreiro e a agenda de feiras, execute também `supabase/migrations/20260911_announcement_marquee.sql` após a criação da tabela acima. Essa migração cadastra as três feiras de outubro, novembro e dezembro de 2026 e ativa o modo letreiro com feiras. No painel, é possível ativar o movimento separadamente e escolher entre o texto livre e a agenda. Cada feira tem descrição e último dia; ela some da barra após essa data no fuso America/Sao_Paulo, inclusive em páginas abertas (atualização a cada 30 segundos). Eventos encerrados permanecem no painel para edição. Sem feiras futuras, a barra em modo feiras fica oculta. O letreiro respeita a preferência de movimento reduzido; a edição do conteúdo fica no painel administrativo.

## Gotículas do spray

Execute `supabase/migrations/20260911_visual_settings.sql` no SQL Editor do Supabase (também pode ser executado novamente para adicionar os novos controles). Em **Admin > Efeitos > Gotículas do spray**, escolha ativação, quantidade por borrifada (50 a 1500), cor e opacidade (0 a 100%). Clique em **Salvar gotículas**. As opções valem para desktop e celular e são carregadas para todos os visitantes ao abrir ou atualizar o site. Se a configuração ainda não estiver disponível, o site mantém o efeito padrão e o painel informa o erro.


## Cores das seções

Execute a migração `supabase/migrations/20260913_section_colors.sql` no Supabase. Em **Admin > Cores das seções**, escolha uma cor da paleta por seção e clique em **Salvar cores**. A opção Original preserva o visual existente (na barra superior, mantém a cor configurada na aba Barra superior). Restaurar cores originais prepara a restauração; clique em Salvar cores para publicá-la. As alterações são recebidas ao abrir ou atualizar o site. Sem a migração, o site preserva o visual atual e o painel informa a indisponibilidade sem simular salvamento.


## Fotos de categorias e essências e salvamento

O painel agora usa o esquema relacional do banco atual: products.category_id, products.all_essences e product_essences. Execute supabase/migrations/20260913_admin_taxonomy_images.sql antes de usar esta versão. A atualização adiciona capa e segunda foto aos cadastros e uma função transacional para salvar produtos e seus vínculos juntos. Não renomeia nem apaga os campos legados. O salvamento continua restrito a administradores. As fotos existentes são cadastradas uma única vez. Em Categorias ou Essências, clique em Editar, selecione as duas imagens e salve. Sem segunda foto, a capa continua visível ao passar o mouse.

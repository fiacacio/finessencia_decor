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

<<<<<<< Updated upstream
O repositório contém duas migrações antigas com o mesmo prefixo `20260904`; por isso, para este histórico use a ordem explícita no SQL Editor e não presuma que a CLI já registrou ambas.
=======
## Cores das seções

Execute a migração `supabase/migrations/20260913_section_colors.sql` no Supabase. Em **Admin > Cores das seções**, escolha uma cor da paleta por seção e clique em **Salvar cores**. A opção Original preserva o visual existente (na barra superior, mantém a cor configurada na aba Barra superior). Restaurar cores originais prepara a restauração; clique em Salvar cores para publicá-la. As alterações são recebidas ao abrir ou atualizar o site. Sem a migração, o site preserva o visual atual e o painel informa a indisponibilidade sem simular salvamento.


## Fotos de categorias e essências e salvamento

O painel agora usa o esquema relacional do banco atual: products.category_id, products.all_essences e product_essences. Execute supabase/migrations/20260913_admin_taxonomy_images.sql antes de usar esta versão. A atualização adiciona capa e segunda foto aos cadastros e uma função transacional para salvar produtos e seus vínculos juntos. Não renomeia nem apaga os campos legados. O salvamento continua restrito a administradores. As fotos existentes são cadastradas uma única vez. Em Categorias ou Essências, clique em Editar, selecione as duas imagens e salve. Sem segunda foto, a capa continua visível ao passar o mouse.

## Clientes e pop-up de cadastro

Execute `supabase/migrations/20260914_customers_popup.sql` no SQL Editor do Supabase. O arquivo cria clientes, configurações, cadastro público via função e armazenamento de imagens. O pop-up começa desativado. Em **Admin > Clientes**, envie uma imagem JPG/PNG/WEBP de até 5 MB, configure o título, ative e salve. A prévia não grava clientes. A lista mostra os 100 cadastros mais recentes.

O formulário pede nome, e-mail e celular, com nascimento e autorização de marketing opcionais. A autorização é registrada com data e texto; apenas administradores podem consultar clientes. Repetir um e-mail não altera dados ou consentimento e não revela se ele já existe. O cadastro público exige o pop-up ativo. Há um campo antirrobô simples no formulário; ele não substitui limitação de requisições ou CAPTCHA em caso de abuso.

O pop-up abre após 1,8 segundo, apenas uma vez por sessão do navegador após ser fechado. Depois de um cadastro bem-sucedido, não reaparece nesse navegador enquanto o armazenamento local for mantido. O código opcional de cupom é público, exibido após o cadastro e utilizado manualmente no atendimento por WhatsApp; não há geração individual, validação de resgate, aplicação de desconto ou envio automático de mensagens.

## Edição das seções

Execute `supabase/migrations/20260914_section_content.sql` após a migração que cria `section_color_settings`. As cores já salvas são preservadas. Em **Admin > Seções**, selecione uma seção para editar título, subtítulo, parágrafos, texto do botão (abertura), fontes de títulos/corpo, fundo e cor dos textos. Campos disponíveis correspondem ao conteúdo de cada seção. O letreiro permanece na aba Barra superior; logos são imagens e não mudam de fonte. A prévia mostra conteúdo e tipografia, não uma reprodução exata da seção. **Restaurar esta seção** recupera os padrões apenas da seção selecionada e só publica após salvar. Textos são exibidos como texto simples, com quebras de linha, sem HTML. Sem a nova coluna, a página mantém as cores e o conteúdo original; o editor solicita a migração.
>>>>>>> Stashed changes

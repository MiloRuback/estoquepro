# EstoquePro — estado da integração Supabase

## Fontes lidas

- prompt.txt define o local de trabalho: `C:\Users\rubac\Documents\GitHub\estoquepro`.
- O PDF do professor pede o Projeto 3 de controle de estoque e entregáveis de modelagem, DDL, dados, CRUD, cinco consultas e demonstração.
- O PDF de análise confirma que ZIP já continha a interface, API, modelo Prisma, CRUD, relatórios e SQLite demonstrativo; faltavam formalização acadêmica, DDL/seed e validação ponta a ponta.
- O ZIP foi extraído para inspeção; projeto-base no diretório indicado foi preservado e ampliado.

## Supabase

Projeto atual: `eli` (`gafwkjlaianlxgolcors`), região `us-east-2`. Os projetos Supabase anteriores foram apagados pelo usuário. O novo projeto foi criado hoje e recebeu o schema e os dados do EstoquePro. Migrations aplicadas:

1. `estoquepro_initial_schema`
2. `estoquepro_supabase_auth`
3. `auth_and_movement_indexes`

Foi adicionada carga demonstrativa: 2 perfis, 6 categorias, 5 produtos e 7 movimentações. As quatro tabelas do EstoquePro estão com RLS ativado e sem acesso direto para `anon`/`authenticated`; a aplicação usa Prisma server-side. O schema Auth deste projeto novo contém `auth.one_time_tokens.expires_at`, que faltava no projeto anterior e causava erro 500 no cadastro.

## Implementação

- `@supabase/ssr` browser/server clients, `proxy.ts` para renovação e proteção de `/estoque`.
- APIs validam sessão Supabase e consultam o papel Admin/Operador no PostgreSQL.
- Senhas são geridas pelo Supabase Auth; cadastro novo inicia como Operador.
- SQL das movimentações aplica CHECKs, bloqueio de saída acima do saldo e update atômico do produto.
- Modelagem e roteiro escolar estão em `docs/`; consultas estão em `supabase/consultas.sql`.

## Pendências de ambiente e validação

- `.env.local` local já aponta para o projeto novo usando a URL e publishable key. `DATABASE_URL`/`DIRECT_URL` ainda exigem a senha do banco; ela não foi coletada nem gravada no Git. Atualizar também as quatro variáveis no ambiente Vercel.
- Adicionar `http://localhost:3000/auth/callback` e `https://estoquepro-mocha.vercel.app/auth/callback` em Supabase Auth > URL Configuration.
- O projeto recém-criado está com o serviço de e-mail padrão do Supabase. Para confirmar contas em endereços que não pertencem à equipe, configurar um provedor SMTP próprio.
- Promover a conta escolhida para ADMIN com `supabase/bootstrap_admin.sql`.
- Testes ponta a ponta do site exigem a senha do banco, as variáveis Vercel atualizadas, URLs de redirecionamento e um provedor de e-mail adequado para a conta de teste.
- O único aviso de Advisor atual é o INFO esperado de RLS ligado sem policy nas quatro tabelas que não ficam expostas na Data API.

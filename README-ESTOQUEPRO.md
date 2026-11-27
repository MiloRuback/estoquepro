# EstoquePro — Sistema de Controle de Estoque

Aplicação web para pequenas empresas cadastrarem categorias e produtos, registrarem entradas e saídas, acompanharem o saldo e consultarem relatórios. A interface já incluída no projeto cobre dashboard, catálogo, categorias, movimentações, histórico, alertas, relatórios e gestão de perfis.

## Tecnologias

- Next.js 16 (App Router), React 19 e TypeScript
- Supabase Auth para identidade e sessão por cookie
- Supabase PostgreSQL para banco relacional
- Prisma 6 no acesso server-side ao PostgreSQL
- Zod para validação de dados; Tailwind e shadcn/ui na interface

## Configuração local

1. Instale Node.js 20.9+ e dependências com `npm install`.
2. Copie `.env.example` para `.env` e preencha `DATABASE_URL` e `DIRECT_URL` com as URLs do seu projeto Supabase. Use a conexão Transaction pooler na aplicação serverless; não publique a senha do banco.
3. Copie também `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` do projeto Supabase. A publishable key pode estar no front-end; nunca use `service_role` ou uma secret key em variável `NEXT_PUBLIC_`.
4. Gere o cliente e valide o schema: `npx prisma generate`.
5. Inicie a aplicação: `npm run dev` e abra `http://localhost:3000`.

A configuração do Auth precisa permitir `http://localhost:3000/auth/callback` como Redirect URL. Para Vercel, adicione também `https://SEU-DOMINIO.vercel.app/auth/callback` no Auth > URL Configuration.

O serviço de e-mail padrão do Supabase é limitado a endereços da equipe do projeto e a um volume baixo. Para permitir cadastro de qualquer usuário em produção, configure um provedor SMTP próprio em Auth > SMTP Settings.

## Banco Supabase

O projeto Supabase já recebeu as migrations `estoquepro_initial_schema`, `estoquepro_supabase_auth` e `auth_and_movement_indexes`, além da carga demonstrativa. Os arquivos versionados são:

- `supabase/migrations/` — esquema, constraints, trigger de movimentação, vínculo Auth, RLS e índices.
- `supabase/seed.sql` — dados demonstrativos idempotentes.
- `supabase/setup.sql` — script único para a entrega acadêmica (schema + seed).
- `supabase/consultas.sql` — consultas com JOIN, filtros, COUNT, SUM e GROUP BY.
- `supabase/bootstrap_admin.sql` — promove o primeiro perfil Admin depois da confirmação do e-mail.

As tabelas de negócio têm RLS ligado e sem acesso direto pelos papéis `anon` e `authenticated`; o Next.js acessa os dados no servidor via Prisma. Não adicione a chave de banco em código do navegador.

## Autenticação e perfis

A tela inicial permite entrar e criar conta com Supabase Auth. A sessão fica em cookies geridos por `@supabase/ssr`. O `proxy.ts` renova a sessão e protege `/estoque`; as rotas `/api/*` verificam a identidade e buscam o papel atual no PostgreSQL. Cadastro novo começa como `OPERADOR`; a autorização nunca usa metadados editáveis do usuário.

Para habilitar o primeiro administrador: crie e confirme uma conta, troque o e-mail de exemplo em `supabase/bootstrap_admin.sql` pelo e-mail confirmado e execute o SQL no Editor do Supabase. Administradores podem criar perfis pendentes, atribuir papéis e ativar/desativar usuários. O usuário cadastrado ativa sua própria conta pelo formulário do Auth.

## Modelo e entregáveis do trabalho

- `docs/requisitos-e-modelagem.md` — enunciado interpretado, requisitos, regras e DER Mermaid.
- `supabase/migrations/` — modelo físico em SQL com PK, FK, UNIQUE e CHECK.
- `supabase/consultas.sql` — sete consultas relevantes para demonstração.
- `docs/roteiro-apresentacao.md` — sequência de demonstração e evidências a capturar.
- `docs/EstoquePro-Apresentacao.pptx` — apresentação do projeto.

## Build para Vercel

O projeto usa Next.js padrão: `npm run build` e `npm start`. No painel Vercel, configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL` (Transaction pooler) e `DIRECT_URL` (conexão direta). Configure o domínio no Auth Redirect URLs do Supabase antes de testar confirmação de e-mail.

A senha do banco e quaisquer chaves secretas ficam somente em variáveis de ambiente locais/da Vercel e nunca no GitHub.

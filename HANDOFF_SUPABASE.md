# EstoquePro — estado da integração Supabase

## Fontes lidas

- prompt.txt define o local de trabalho: `C:\Users\rubac\Documents\GitHub\estoquepro`.
- O PDF do professor pede o Projeto 3 de controle de estoque e entregáveis de modelagem, DDL, dados, CRUD, cinco consultas e demonstração.
- O PDF de análise confirma que ZIP já continha a interface, API, modelo Prisma, CRUD, relatórios e SQLite demonstrativo; faltavam formalização acadêmica, DDL/seed e validação ponta a ponta.
- O ZIP foi extraído para inspeção; projeto-base no diretório indicado foi preservado e ampliado.

## Supabase

Projeto usado: `MiloRuback's Project` (`ctqgcnsfdvxtnkejeusd`). Ele já possui tabelas de outro app; as alterações do EstoquePro criaram tabelas próprias e não alteraram o schema existente. Migrations aplicadas no Supabase:

1. `estoquepro_initial_schema`
2. `estoquepro_supabase_auth`
3. `auth_and_movement_indexes`

Foi adicionada carga demonstrativa: 2 perfis, 6 categorias, 5 produtos e 7 movimentações. As quatro tabelas do EstoquePro estão com RLS ativado e sem acesso direto para `anon`/`authenticated`; a aplicação usa Prisma server-side. O Supabase Auth em si é usado pelo login/cadastro; não há trigger global de `auth.users`.

## Implementação

- `@supabase/ssr` browser/server clients, `proxy.ts` para renovação e proteção de `/estoque`.
- APIs validam sessão Supabase e consultam o papel Admin/Operador no PostgreSQL.
- Senhas são geridas pelo Supabase Auth; cadastro novo inicia como Operador.
- SQL das movimentações aplica CHECKs, bloqueio de saída acima do saldo e update atômico do produto.
- Modelagem e roteiro escolar estão em `docs/`; consultas estão em `supabase/consultas.sql`.

## Pendências de ambiente e validação

- `DATABASE_URL`/`DIRECT_URL` exigem a senha do banco do proprietário; ela não foi coletada nem gravada no Git. Copiar as duas URLs no `.env` local e na Vercel.
- Adicionar `http://localhost:3000/auth/callback` e domínio da Vercel em Supabase Auth > URL Configuration.
- Promover a conta escolhida para ADMIN com `supabase/bootstrap_admin.sql`.
- Testes ponta a ponta do site exigem as variáveis acima e uma conta de e-mail confirmada.
- Advisors ainda mostram alertas preexistentes do outro app na mesma instância e um INFO esperado de RLS ligado sem policy nas tabelas que não ficam expostas na Data API. Não alteramos tabelas ou funções daquele app.

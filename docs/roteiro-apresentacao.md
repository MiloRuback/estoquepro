# EstoquePro — roteiro da apresentação

## Sequência sugerida (5–7 minutos)

1. **Problema e objetivo** — explicar o controle manual e o objetivo de registrar produtos, categorias e movimentações.
2. **Modelo relacional** — abrir o DER em `requisitos-e-modelagem.md`; explicar Categoria 1:N Produto, Produto 1:N Movimentação e Usuário 1:N Movimentação.
3. **Integridade no PostgreSQL** — mostrar PK/FK, restrições `CHECK`, unicidade do SKU e trigger que recalcula o saldo.
4. **Autenticação e permissão** — criar/confirmar uma conta pelo Supabase Auth; mostrar a rota protegida e a diferença de papéis Admin/Operador.
5. **CRUD** — cadastrar uma categoria, cadastrar produto, consultar pelo nome/categoria, editar e arquivar.
6. **Entradas e saídas** — registrar uma entrada; registrar uma saída válida; tentar saída maior que o saldo e quantidade zero e mostrar o bloqueio.
7. **Consultas SQL** — executar pelo menos cinco consultas de `supabase/consultas.sql`: produtos/categorias, contagem por categoria, estoque baixo, totais de entradas/saídas e histórico com JOIN.
8. **Fechamento** — exibir o dashboard, os alertas e um relatório com dados do Supabase.

## Evidências a capturar antes da apresentação

- Login e tela protegida depois do login.
- Produtos filtrados por categoria.
- Saldo antes/depois de uma movimentação.
- Bloqueio de uma saída inválida.
- Resultados de cinco consultas SQL.
- Alertas e relatório exportado.

Capturas e resultados precisam ser coletados após configurar o projeto Supabase e executar a aplicação. Este roteiro não declara testes ainda não realizados.

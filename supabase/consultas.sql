-- Consultas para demonstrar SELECT, filtros, JOIN, agregação e ordenação.
-- Podem ser executadas no SQL Editor do Supabase depois de schema + seed.

-- 1. Produtos ativos com a categoria e o saldo atual.
SELECT p.id, p.nome, p.sku, c.nome AS categoria, p.quantidade
FROM public.produtos p
JOIN public.categorias c ON c.id = p.categoria_id
WHERE p.ativo = true
ORDER BY p.nome;

-- 2. Quantidade de produtos e unidades em estoque por categoria.
SELECT c.nome AS categoria,
       COUNT(p.id) AS total_produtos,
       COALESCE(SUM(p.quantidade), 0) AS unidades
FROM public.categorias c
LEFT JOIN public.produtos p ON p.categoria_id = c.id AND p.ativo = true
GROUP BY c.id, c.nome
ORDER BY unidades DESC, categoria;

-- 3. Produtos abaixo do mínimo, sem incluir itens zerados.
SELECT p.nome, p.sku, c.nome AS categoria, p.quantidade, p.estoque_minimo
FROM public.produtos p
JOIN public.categorias c ON c.id = p.categoria_id
WHERE p.ativo = true
  AND p.quantidade > 0
  AND p.estoque_minimo > 0
  AND p.quantidade <= p.estoque_minimo
ORDER BY p.quantidade, p.nome;

-- 4. Unidades recebidas e retiradas no período dos últimos 30 dias.
SELECT
  COALESCE(SUM(quantidade) FILTER (WHERE tipo = 'ENTRADA'), 0) AS total_entradas,
  COALESCE(SUM(quantidade) FILTER (WHERE tipo = 'SAIDA'), 0) AS total_saidas
FROM public.movimentacoes
WHERE criado_em >= now() - interval '30 days';

-- 5. Histórico detalhado com produto, categoria e usuário responsável.
SELECT m.id, m.criado_em, p.nome AS produto, c.nome AS categoria,
       m.tipo, m.quantidade, m.saldo_resultante, u.nome AS usuario
FROM public.movimentacoes m
JOIN public.produtos p ON p.id = m.produto_id
JOIN public.categorias c ON c.id = p.categoria_id
JOIN public.usuarios u ON u.id = m.usuario_id
ORDER BY m.criado_em DESC, m.id DESC;

-- 6. Valor estimado do estoque por categoria.
SELECT c.nome AS categoria,
       ROUND(SUM(p.quantidade * p.preco_custo)::numeric, 2) AS valor_custo
FROM public.categorias c
JOIN public.produtos p ON p.categoria_id = c.id
WHERE p.ativo = true
GROUP BY c.id, c.nome
ORDER BY valor_custo DESC;

-- 7. Produtos mais movimentados por unidades (entradas + saídas).
SELECT p.sku, p.nome,
       SUM(m.quantidade) AS unidades_movimentadas,
       COUNT(m.id) AS quantidade_de_operacoes
FROM public.produtos p
JOIN public.movimentacoes m ON m.produto_id = p.id
GROUP BY p.id, p.sku, p.nome
ORDER BY unidades_movimentadas DESC, quantidade_de_operacoes DESC
LIMIT 10;

-- Dados pequenos para demonstrar JOIN, filtros, relatórios e validações.
-- Perfis demonstrativos. As senhas são criadas exclusivamente no Supabase Auth.

INSERT INTO public.usuarios (nome, email, senha_hash, papel)
VALUES
  ('Ana Souza', 'admin@estoquepro.com', 'SUPABASE_AUTH', 'OPERADOR'),
  ('Carlos Lima', 'operador@estoquepro.com', 'SUPABASE_AUTH', 'OPERADOR')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.categorias (nome, descricao)
VALUES
  ('Bebidas', 'Águas, sucos e refrigerantes'),
  ('Alimentos', 'Alimentos não perecíveis'),
  ('Higiene e Limpeza', 'Produtos de limpeza e higiene'),
  ('Papelaria', 'Materiais escolares e de escritório'),
  ('Eletrônicos', 'Acessórios e periféricos'),
  ('Ferramentas', 'Ferramentas e materiais de manutenção')
ON CONFLICT DO NOTHING;

INSERT INTO public.produtos
  (nome, descricao, sku, categoria_id, quantidade, estoque_minimo, preco_custo, preco_venda)
SELECT dados.nome, dados.descricao, dados.sku, c.id, 0, dados.estoque_minimo,
       dados.preco_custo, dados.preco_venda
FROM (VALUES
  ('Água Mineral 500ml (fardo c/ 12)', 'Fardo com doze garrafas', 'BEB-0001', 'Bebidas', 12, 14.40::double precision, 21.90::double precision),
  ('Refrigerante Cola 2L', 'Garrafa de dois litros', 'BEB-0002', 'Bebidas', 10, 5.20::double precision, 8.90::double precision),
  ('Arroz Branco Tipo 1 - 5kg', 'Pacote de cinco quilos', 'ALI-0003', 'Alimentos', 10, 22.50::double precision, 29.90::double precision),
  ('Detergente Neutro 500ml', 'Detergente líquido', 'HIG-0002', 'Higiene e Limpeza', 18, 1.85::double precision, 3.49::double precision),
  ('Caderno Universitário 200 folhas', 'Capa dura', 'PAP-0001', 'Papelaria', 8, 11.00::double precision, 18.90::double precision)
) AS dados(nome, descricao, sku, categoria, estoque_minimo, preco_custo, preco_venda)
JOIN public.categorias c ON lower(c.nome) = lower(dados.categoria)
ON CONFLICT DO NOTHING;

-- O trigger calcula o saldo e atualiza produtos.quantidade em cada INSERT.
INSERT INTO public.movimentacoes
  (produto_id, tipo, quantidade, motivo, observacao, saldo_resultante, usuario_id, criado_em)
SELECT p.id, movimentos.tipo, movimentos.quantidade, movimentos.motivo,
       movimentos.observacao, 0, u.id, now() - movimentos.dias * interval '1 day'
FROM (VALUES
  ('BEB-0001', 'ENTRADA', 30, 'Compra fornecedor', 'Carga inicial para demonstração', 10),
  ('BEB-0002', 'ENTRADA', 20, 'Compra fornecedor', 'Carga inicial para demonstração', 8),
  ('ALI-0003', 'ENTRADA', 25, 'Compra fornecedor', 'Carga inicial para demonstração', 5),
  ('HIG-0002', 'ENTRADA', 12, 'Compra fornecedor', 'Carga inicial para demonstração', 4),
  ('PAP-0001', 'ENTRADA', 15, 'Compra fornecedor', 'Carga inicial para demonstração', 3)
) AS movimentos(sku, tipo, quantidade, motivo, observacao, dias)
JOIN public.produtos p ON p.sku = movimentos.sku
JOIN public.usuarios u ON u.email = 'admin@estoquepro.com'
WHERE NOT EXISTS (
  SELECT 1 FROM public.movimentacoes existente WHERE existente.produto_id = p.id
);

INSERT INTO public.movimentacoes
  (produto_id, tipo, quantidade, motivo, observacao, saldo_resultante, usuario_id)
SELECT p.id, 'SAIDA', saidas.quantidade, 'Venda balcão', 'Venda de demonstração', 0, u.id
FROM (VALUES ('BEB-0001', 3), ('BEB-0002', 11)) AS saidas(sku, quantidade)
JOIN public.produtos p ON p.sku = saidas.sku
JOIN public.usuarios u ON u.email = 'admin@estoquepro.com'
WHERE EXISTS (
  SELECT 1 FROM public.movimentacoes existente
  WHERE existente.produto_id = p.id AND existente.tipo = 'ENTRADA'
)
AND NOT EXISTS (
  SELECT 1 FROM public.movimentacoes existente
  WHERE existente.produto_id = p.id AND existente.tipo = 'SAIDA'
);

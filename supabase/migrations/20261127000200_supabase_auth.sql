-- Linka perfis do EstoquePro à identidade oficial do Supabase Auth.
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS auth_user_id uuid;
CREATE UNIQUE INDEX IF NOT EXISTS usuarios_auth_user_id_uq
  ON public.usuarios (auth_user_id);

-- As tabelas de negócio são acessadas pela API server-side via Prisma.
-- A API pública do Supabase não recebe acesso direto a elas.
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.usuarios, public.categorias, public.produtos, public.movimentacoes FROM anon, authenticated;

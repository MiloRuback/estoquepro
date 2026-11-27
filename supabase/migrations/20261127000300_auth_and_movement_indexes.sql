-- Full unique index is valid with nullable UUIDs in PostgreSQL (NULLs remain distinct).
DROP INDEX IF EXISTS public.usuarios_auth_user_id_uq;
CREATE UNIQUE INDEX usuarios_auth_user_id_uq ON public.usuarios (auth_user_id);
CREATE INDEX IF NOT EXISTS movimentacoes_usuario_id_idx ON public.movimentacoes (usuario_id);

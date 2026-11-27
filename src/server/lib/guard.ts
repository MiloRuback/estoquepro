/** Proteção das APIs com sessão verificada pelo Supabase Auth e papel lido do banco. */
import { db } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { ApiError } from './http'

export interface UsuarioAuth {
  id: number
  nome: string
  email: string
  papel: 'ADMIN' | 'OPERADOR'
}

export async function getUsuarioAuth(): Promise<UsuarioAuth> {
  let claims: Record<string, unknown> | undefined
  try {
    const supabase = await createClient()
    const result = await supabase.auth.getClaims()
    claims = result.data?.claims as Record<string, unknown> | undefined
  } catch {
    throw new ApiError(401, 'Sessão inválida ou expirada. Faça login novamente.', 'NAO_AUTENTICADO')
  }

  const authUserId = typeof claims?.sub === 'string' ? claims.sub : null
  const email = typeof claims?.email === 'string' ? claims.email.toLowerCase() : null
  if (!authUserId || !email) throw new ApiError(401, 'Autenticação necessária. Faça login para continuar.', 'NAO_AUTENTICADO')

  let usuario = await db.usuario.findUnique({
    where: { authUserId },
    select: { id: true, nome: true, email: true, papel: true, ativo: true },
  })

  // Liga perfis já criados e limita o provisionamento automático a novos cadastros do EstoquePro.
  if (!usuario) {
    await db.usuario.updateMany({ where: { email, authUserId: null }, data: { authUserId } })
    usuario = await db.usuario.findUnique({
      where: { authUserId },
      select: { id: true, nome: true, email: true, papel: true, ativo: true },
    })
  }

  if (!usuario && (claims.user_metadata as Record<string, unknown> | undefined)?.estoquepro === true) {
    try {
      usuario = await db.usuario.create({
        data: {
          authUserId,
          nome: String((claims.user_metadata as Record<string, unknown>).nome ?? email.split('@')[0]).trim().slice(0, 120),
          email,
          senhaHash: 'SUPABASE_AUTH',
          papel: 'OPERADOR',
        },
        select: { id: true, nome: true, email: true, papel: true, ativo: true },
      })
    } catch {
      // Uma requisição paralela pode ter provisionado o mesmo e-mail.
      usuario = await db.usuario.findUnique({
        where: { authUserId },
        select: { id: true, nome: true, email: true, papel: true, ativo: true },
      })
    }
  }

  if (!usuario || !usuario.ativo) throw new ApiError(403, 'Usuário inativo ou ainda não provisionado.', 'USUARIO_INATIVO')
  return { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel as UsuarioAuth['papel'] }
}

export async function requireAuth(_req: Request, papeisPermitidos?: Array<'ADMIN' | 'OPERADOR'>): Promise<UsuarioAuth> {
  const usuario = await getUsuarioAuth()
  if (papeisPermitidos && !papeisPermitidos.includes(usuario.papel)) {
    throw new ApiError(403, 'Você não tem permissão para executar esta operação.', 'SEM_PERMISSAO')
  }
  return usuario
}

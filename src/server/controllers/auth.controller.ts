/** Endpoints da identidade autenticada pelo Supabase Auth. */
import { ApiError, created, handle, ok } from '../lib/http'
import { requireAuth } from '../lib/guard'

export const authController = {
  async login(_req: Request) {
    return handle(async () => {
      throw new ApiError(410, 'Use o formulário de autenticação do Supabase.', 'LOGIN_SUPABASE')
    })
  },

  async me(req: Request) {
    return handle(async () => ok(await requireAuth(req)))
  },

  async logout(req: Request) {
    return handle(async () => {
      await requireAuth(req)
      return created({ mensagem: 'Encerre a sessão pelo Supabase Auth no navegador.' })
    })
  },
}

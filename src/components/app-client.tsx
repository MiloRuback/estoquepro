'use client'

import { AppShell, type UsuarioSessao } from '@/components/app-shell'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function EstoqueProApp({ usuario }: { usuario: UsuarioSessao }) {
  const sair = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.info('Sessão encerrada.')
    window.location.assign('/')
  }

  return <AppShell usuario={usuario} aoSair={sair} />
}

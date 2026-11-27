import { redirect } from 'next/navigation'
import { getUsuarioAuth } from '@/server/lib/guard'
import { EstoqueProApp } from '@/components/app-client'

export const dynamic = 'force-dynamic'

export default async function EstoquePage() {
  let usuario
  try {
    usuario = await getUsuarioAuth()
  } catch {
    redirect('/')
  }
  return <EstoqueProApp usuario={usuario} />
}

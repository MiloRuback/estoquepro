/**
 * EstoquePro — Tela de autenticação
 */
import { FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Logo } from '@/components/logo'
import { api, ApiClientError } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { BarChart3, Boxes, ShieldCheck, TriangleAlert } from 'lucide-react'
import type { UsuarioSessao } from '@/components/app-shell'

export function LoginView() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cadastro, setCadastro] = useState(false)
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState<string | null>(null)

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    setMensagem(null)
    if (!email.trim() || !senha || (cadastro && nome.trim().length < 2)) {
      setErro(cadastro ? 'Informe seu nome, e-mail e uma senha.' : 'Informe e-mail e senha.')
      return
    }
    setEnviando(true)
    try {
      const supabase = createClient()
      if (cadastro) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: senha,
          options: {
            data: { nome: nome.trim(), estoquepro: true },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        if (!data.session) {
          setMensagem('Conta criada. Confirme o e-mail enviado para ativar o acesso.')
          return
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: senha })
        if (error) throw error
      }

      const usuario = await api.get<UsuarioSessao>('/api/auth/me')
      toast.success(`Bem-vindo(a), ${usuario.nome.split(' ')[0]}!`)
      window.location.assign('/estoque')
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setErro(err.message)
      } else if (err instanceof Error) {
        setErro(err.message || 'Não foi possível autenticar. Verifique seus dados e tente novamente.')
      } else {
        setErro('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.')
      }
    } finally {
      setEnviando(false)
    }
  }


  return (
    <div className="flex min-h-screen">
      {/* painel da marca */}
      <div className="hidden lg:flex gradiente-marca flex-col justify-between p-10 w-[45%] relative overflow-hidden">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -right-10 bottom-24 h-56 w-56 rounded-full bg-white/10" aria-hidden />
        <div className="relative">
          <Logo claro tamanhoIcone={26} />
        </div>
        <div className="relative space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white leading-snug">
              Controle total do seu estoque,
              <br />
              com simplicidade profissional.
            </h1>
            <p className="mt-3 text-emerald-50/90 text-sm max-w-md leading-relaxed">
              Produtos, categorias, entradas e saídas, alertas automáticos e relatórios —
              tudo com banco de dados relacional e API segura.
            </p>
          </div>
          <ul className="space-y-4 text-sm text-white/95">
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <Boxes className="h-5 w-5" />
              </span>
              Movimentações atômicas com histórico permanente
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <TriangleAlert className="h-5 w-5" />
              </span>
              Alertas automáticos de estoque baixo e zerado
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <BarChart3 className="h-5 w-5" />
              </span>
              Dashboard e relatórios com dados reais
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <ShieldCheck className="h-5 w-5" />
              </span>
              Autenticação com senhas protegidas e permissões
            </li>
          </ul>
        </div>
        <p className="relative text-xs text-emerald-50/70">© 2026 EstoquePro · Sistema de gerenciamento de estoque</p>
      </div>

      {/* formulário */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Logo tamanhoIcone={26} />
          </div>
          <Card className="shadow-md border-slate-200 py-0">
            <CardContent className="p-7 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900">{cadastro ? 'Criar conta' : 'Acessar o sistema'}</h2>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                {cadastro ? 'Crie seu acesso ao EstoquePro.' : 'Entre com suas credenciais para continuar.'}
              </p>

              <form onSubmit={enviar} className="space-y-4" noValidate>
                {erro && (
                  <Alert variant="destructive">
                    <AlertDescription>{erro}</AlertDescription>
                  </Alert>
                )}
                {mensagem && <Alert><AlertDescription>{mensagem}</AlertDescription></Alert>}
                {cadastro && <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} className="h-11" required />
                </div>}
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="voce@empresa.com"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={enviando}>
                  {enviando ? 'Aguarde…' : cadastro ? 'Criar conta' : 'Entrar'}
                </Button>
              </form>

              <div className="mt-5 text-center text-sm text-slate-600">
                {cadastro ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}{' '}
                <button type="button" className="font-semibold text-emerald-700 hover:underline" onClick={() => { setCadastro(!cadastro); setErro(null); setMensagem(null) }}>
                  {cadastro ? 'Entrar' : 'Criar conta'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

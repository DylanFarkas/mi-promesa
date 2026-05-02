'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { Store, Mail } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
        shouldCreateUser: false,
      },
    })

    setLoading(false)

    if (authError) {
      setError(
        authError.message === 'Signups not allowed for otp'
          ? 'Este correo no está autorizado como administrador.'
          : 'Ocurrió un error al enviar el magic link. Intenta de nuevo.',
      )
      return
    }

    setSent(true)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
          {/* Top bar */}
          <div className="h-1.5 bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500" />

          <div className="px-8 py-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 mb-4">
                <Store className="text-white" size={26} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Mi Promesa</h1>
              <p className="mt-1 text-sm text-slate-500">Panel de administración</p>
            </div>

            {sent ? (
              <div className="space-y-4">
                <Alert
                  variant="success"
                  title="¡Enlace enviado!"
                  message={`Revisa tu correo ${email}. Haz clic en el enlace para ingresar al panel.`}
                />
                <p className="text-center text-sm text-slate-500">
                  ¿No recibiste el correo?{' '}
                  <button
                    onClick={() => setSent(false)}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Reenviar
                  </button>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Acceder al panel
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Ingresa tu correo y te enviaremos un enlace de acceso seguro.
                  </p>
                </div>

                {error && <Alert variant="error" message={error} />}

                <Input
                  id="email"
                  type="email"
                  label="Correo electrónico"
                  placeholder="admin@mipromesa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                />

                <Button
                  type="submit"
                  className="w-full justify-center"
                  loading={loading}
                  size="lg"
                >
                  <Mail size={18} />
                  Enviar magic link
                </Button>

                <p className="text-center text-xs text-slate-400">
                  Solo administradores autorizados pueden acceder.
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Mi Promesa — Acceso restringido
        </p>
      </div>
    </div>
  )
}

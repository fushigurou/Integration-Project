import { useState, type FormEvent } from 'react'
import { home, useApp } from '../context/AppContext'
import { Button } from '../components/ui/Button'
import { Field, Input } from '../components/ui/Field'
import { Logo } from '../components/layout/Logo'
import type { Session } from '../data/types'

export function Login() {
  const { login, go, authReady } = useApp()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const enter = (s: Session, to?: string) => {
    go(to ?? home(s))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr('')
    if (!email || !pw) {
      setErr('Veuillez saisir votre email et votre mot de passe.')
      return
    }
    setBusy(true)
    try {
      const res = await login(email, pw)
      if (typeof res === 'string') {
        setErr(res)
        return
      }
      enter(res)
    } finally {
      setBusy(false)
    }
  }

  const quickLogin = async (demoEmail: string) => {
    setBusy(true)
    setErr('')
    try {
      const res = await login(demoEmail, 'steg1234')
      if (typeof res === 'string') {
        setErr(res)
        return
      }
      enter(res)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-900 p-12 text-white lg:flex">
        <Logo light />
        <div>
          <h2 className="max-w-md text-4xl leading-tight font-bold">
            Gérez les directeurs régionaux STEG.
          </h2>
          <p className="mt-4 max-w-md text-brand-200">
            Authentification JWT sécurisée pour les directions régionales.
          </p>
          <div className="mt-8 h-1 w-24 rounded bg-amber-400" />
        </div>
        <p className="text-sm text-brand-300">Société Tunisienne de l’Électricité et du Gaz</p>
      </div>

      <div className="flex flex-col justify-center overflow-y-auto p-6 sm:p-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Connexion</h1>
          <p className="mt-1 mb-6 text-sm text-slate-600">
            Connectez-vous avec votre email STEG. La session est conservée via un jeton JWT.
          </p>

          {!authReady && (
            <p className="mb-4 text-sm text-slate-500">Vérification de la session…</p>
          )}

          <form className="space-y-4" onSubmit={submit} noValidate>
            <Field label="Adresse email" required>
              <Input
                type="email"
                placeholder="prenom.nom@steg.tn"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Mot de passe" required>
              <Input
                type="password"
                autoComplete="current-password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
            </Field>
            {err && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={busy || !authReady}>
              Se connecter
            </Button>
          </form>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Accès démo rapide</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => quickLogin('dg@steg.tn')}
                disabled={busy || !authReady}
              >
                Directeur Général
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => quickLogin('dr.tunis@steg.tn')}
                disabled={busy || !authReady}
              >
                Dir. Régional
              </Button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Mot de passe démo : <span className="font-semibold">steg1234</span> · JWT + MySQL
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

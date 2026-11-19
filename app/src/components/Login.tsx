import { useState } from 'react'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'

/**
 * Sign-in without passwords: Google, or e-mail + 6-digit code.
 * PREVIEW ONLY: nothing is checked here. The real app wires this to the server's auth.
 */
export function Login({ onDone }: { onDone: (email: string) => void }) {
  const [step, setStep] = useState<'start' | 'code'>('start')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const valid = /^\S+@\S+\.\S+$/.test(email)
  const field = 'w-full rounded-2xl border border-white/12 bg-white/[.06] px-4 py-4 text-[17px] text-white outline-none placeholder:text-white/35 focus:border-glow/60'

  return (
    <div className="anim-fade fixed inset-0 z-[80] overflow-y-auto text-white" style={{ background: 'radial-gradient(120% 60% at 50% 0%, #12352d 0%, #071311 60%)' }}>
      <div className="mx-auto flex min-h-full max-w-md flex-col px-6 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-[calc(env(safe-area-inset-top)+56px)]">
        <div className="flex justify-center"><div className="orb" data-state="idle" style={{ width: 96, height: 96 }} /></div>
        <h1 className="mt-8 text-center font-display text-[34px] font-semibold tracking-[-0.02em]">Jarvis</h1>
        <p className="mt-2 text-center text-[16px] text-white/60">Sua agenda, por voz. Em qualquer celular.</p>

        {step === 'start' ? (
          <div className="mt-10 space-y-3">
            <button
              onClick={() => onDone('apple')}
              className="flex w-full items-center justify-center gap-3 rounded-[20px] bg-black py-4 text-[17px] font-semibold text-white ring-1 ring-white/15 active:scale-[.99]"
            >
              <svg width="18" height="22" viewBox="0 0 814 1000" fill="currentColor" aria-hidden><path d="M788 340c-6 4-108 62-108 190 0 148 130 200 134 202-1 3-21 72-69 142-43 62-88 124-156 124s-86-40-165-40c-77 0-104 41-166 41s-106-57-156-127C44 790 0 671 0 557 0 375 118 279 235 279c62 0 114 41 153 41 37 0 95-43 166-43 27 0 124 2 188 64zM554 170c29-35 50-83 50-131 0-7-1-14-2-19-48 2-104 32-138 71-27 30-52 78-52 127 0 7 1 15 2 17 3 1 8 1 13 1 43 0 97-29 127-66z"/></svg>
              Continuar com a Apple
            </button>
            <button
              onClick={() => onDone('google')}
              className="flex w-full items-center justify-center gap-3 rounded-[20px] bg-white py-4 text-[17px] font-semibold text-[#1f1f1f] active:scale-[.99]"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
              Continuar com Google
            </button>
            <div className="flex items-center gap-3 py-2 text-[13px] text-white/40"><span className="h-px flex-1 bg-white/10" />ou<span className="h-px flex-1 bg-white/10" /></div>
            <form onSubmit={(e) => { e.preventDefault(); if (valid) setStep('code') }} className="space-y-3">
              <input id="login-email" type="email" inputMode="email" autoComplete="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu e-mail" />
              <button disabled={!valid} className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-glow py-4 text-[17px] font-semibold text-night transition disabled:opacity-40 active:scale-[.99]">
                <Mail size={19} /> Receber código por e-mail
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (code.length === 6) onDone(email) }} className="mt-10 space-y-4">
            <p className="text-center text-[16px] leading-relaxed text-white/70">
              Mandamos um código de 6 números para<br /><b className="text-white">{email}</b>
            </p>
            <input
              id="login-code"
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className={`${field} text-center font-display text-[30px] tracking-[.5em]`}
            />
            <button disabled={code.length !== 6} className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-glow py-4 text-[17px] font-semibold text-night transition disabled:opacity-40 active:scale-[.99]">
              Entrar <ArrowRight size={19} />
            </button>
            <button type="button" onClick={() => { setStep('start'); setCode('') }} className="flex w-full items-center justify-center gap-2 py-2 text-[15px] text-white/55">
              <ArrowLeft size={16} /> Usar outro e-mail
            </button>
          </form>
        )}

        <div className="flex-1" />
        <p className="mt-10 text-center text-[13px] leading-relaxed text-white/40">
          Só na primeira vez. Depois fica conectado, e no outro celular<br />é só entrar com a mesma conta.<br />Prévia: qualquer código de 6 números funciona.
        </p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { Settings } from '../lib/types'

/** First run: the assistant introduces itself and learns how to call him. */
export function Welcome({ settings, onDone }: { settings: Settings; onDone: (s: Settings) => void }) {
  const [name, setName] = useState(settings.name)
  const [city, setCity] = useState(settings.city)
  const [assistant, setAssistant] = useState(settings.assistant)
  const field = 'w-full rounded-2xl border border-white/12 bg-white/[.06] px-4 py-3.5 text-[17px] text-white outline-none placeholder:text-white/35 focus:border-glow/60'
  return (
    <div className="anim-fade fixed inset-0 z-[70] overflow-y-auto text-white" style={{ background: 'radial-gradient(120% 60% at 50% 0%, #12352d 0%, #071311 60%)' }}>
      <form
        onSubmit={(e) => { e.preventDefault(); onDone({ ...settings, name: name.trim(), city: city.trim() || settings.city, assistant: assistant.trim() || 'Jarvis' }) }}
        className="mx-auto flex min-h-full max-w-md flex-col px-6 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-[calc(env(safe-area-inset-top)+40px)]"
      >
        <div className="flex justify-center"><div className="orb" data-state="idle" style={{ width: 120, height: 120 }} /></div>
        <h1 className="mt-8 text-center font-display text-[30px] font-semibold leading-tight tracking-[-0.02em]">
          Olá! Eu sou o {assistant.trim() || 'Jarvis'}.
        </h1>
        <p className="mx-auto mt-3 max-w-[300px] text-center text-[16px] leading-relaxed text-white/65">
          Eu cuido da sua agenda. É só falar comigo, e eu te aviso antes de cada compromisso.
        </p>

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[14px] font-medium text-white/60">Como devo te chamar?</span>
            <input id="welcome-name" className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="ex.: Seu João" autoComplete="given-name" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[14px] font-medium text-white/60">Sua cidade (para o clima)</span>
            <input id="welcome-city" className={field} value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[14px] font-medium text-white/60">Nome do assistente</span>
            <input id="welcome-assistant" className={field} value={assistant} onChange={(e) => setAssistant(e.target.value)} />
          </label>
        </div>

        <div className="flex-1" />
        <button type="submit" className="mt-8 flex w-full items-center justify-center gap-2 rounded-[22px] bg-glow py-4 text-[18px] font-semibold text-night active:scale-[.99]">
          Começar <ArrowRight size={20} />
        </button>
      </form>
    </div>
  )
}

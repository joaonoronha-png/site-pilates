import { useEffect, useRef, useState } from 'react'
import { Keyboard, Mic, Send, Square, X } from 'lucide-react'
import { canListen, listen, needsGesture, speak, stopSpeaking } from '../lib/voice'
import type { BrainResult } from '../lib/brain'
import { EventItem, type Occ } from './EventItem'

type Turn = { who: 'me' | 'ai'; text: string; list?: Occ[] }

const EXAMPLES = [
  'Bom dia',
  'O que eu tenho amanhã?',
  'Marca dentista sexta às 10h',
  'Me lembra às 18h de ligar pro Carlos',
  'Muda o almoço para 13h',
  'Cancela a visita à obra',
]

export function VoiceSheet({ onClose, ask, now, onOpen, autoStart }: {
  onClose: () => void
  ask: (text: string) => BrainResult
  now: Date
  onOpen: (e: Occ) => void
  autoStart: boolean
}) {
  const [turns, setTurns] = useState<Turn[]>([])
  const [state, setState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle')
  const [partial, setPartial] = useState('')
  const [typing, setTyping] = useState(!canListen())
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const stopRef = useRef<() => void>(() => {})
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [turns, partial])
  useEffect(() => () => { stopRef.current(); stopSpeaking() }, [])
  useEffect(() => {
    if (autoStart && canListen() && !needsGesture()) start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handle(text: string) {
    setError('')
    setPartial('')
    setTurns((t) => [...t, { who: 'me', text }])
    setState('thinking')
    setTimeout(() => {
      const r = ask(text)
      setTurns((t) => [...t, { who: 'ai', text: r.reply, list: r.list as Occ[] | undefined }])
      setState('speaking')
      speak(r.reply, () => {
        setState('idle')
        // keep the conversation going if the assistant asked something
        if (r.pending && canListen() && !typing && !needsGesture()) start()
      })
    }, 350)
  }

  function start() {
    stopSpeaking()
    setError('')
    setPartial('')
    setState('listening')
    stopRef.current = listen({
      onPartial: setPartial,
      onFinal: handle,
      onError: (m) => { setError(m); setState('idle'); setPartial('') },
    })
  }

  const listening = state === 'listening'

  return (
    <div className="anim-fade fixed inset-0 z-50 flex flex-col bg-[#14201a] text-white">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden px-5 pt-[calc(env(safe-area-inset-top)+16px)]">
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase tracking-[.2em] text-white/50">Assistente</span>
          <button onClick={onClose} className="grid size-11 place-items-center rounded-full bg-white/10 active:scale-95" aria-label="Fechar">
            <X size={22} />
          </button>
        </div>

        <div className="mt-4 flex-1 space-y-4 overflow-y-auto pb-6">
          {turns.length === 0 && !partial && (
            <div className="pt-6">
              <p className="font-display text-[28px] leading-tight">Como posso ajudar?</p>
              <p className="mt-2 text-white/60">Fale naturalmente. Por exemplo:</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {EXAMPLES.map((x) => (
                  <button key={x} onClick={() => handle(x)} className="rounded-full border border-white/15 px-4 py-2 text-[15px] text-white/85 active:bg-white/10">
                    “{x}”
                  </button>
                ))}
              </div>
            </div>
          )}
          {turns.map((t, i) => t.who === 'me' ? (
            <p key={i} className="ml-10 rounded-3xl rounded-br-md bg-white/12 px-4 py-3 text-right text-[17px]">{t.text}</p>
          ) : (
            <div key={i} className="mr-6">
              <p className="font-display text-[22px] leading-snug">{t.text}</p>
              {t.list && t.list.length > 0 && (
                <div className="mt-3 rounded-2xl bg-paper text-ink">
                  {t.list.map((e) => <EventItem key={e.id + e.occ.toISOString()} e={e} now={now} onOpen={onOpen} />)}
                </div>
              )}
            </div>
          ))}
          {partial && <p className="ml-10 rounded-3xl rounded-br-md bg-white/8 px-4 py-3 text-right text-[17px] text-white/70">{partial}…</p>}
          {state === 'thinking' && <p className="text-white/50">pensando…</p>}
          <div ref={endRef} />
        </div>

        {error && <p className="mb-3 text-center text-sm text-[#f3b3a5]">{error}</p>}

        <div className="pb-[calc(env(safe-area-inset-bottom)+20px)]">
          {typing ? (
            <form
              onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { handle(draft.trim()); setDraft('') } }}
              className="flex items-center gap-2 rounded-full bg-white/10 p-1.5 pl-5"
            >
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Escreva ou use o microfone do teclado"
                className="min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-white/40"
              />
              {canListen() && (
                <button type="button" onClick={() => { setTyping(false); start() }} className="grid size-11 place-items-center rounded-full bg-white/10" aria-label="Falar">
                  <Mic size={20} />
                </button>
              )}
              <button type="submit" className="grid size-11 place-items-center rounded-full bg-warm" aria-label="Enviar">
                <Send size={19} />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-8">
              <button onClick={() => { stopRef.current(); setTyping(true) }} className="grid size-12 place-items-center rounded-full bg-white/10" aria-label="Digitar">
                <Keyboard size={20} />
              </button>
              <button
                onClick={() => (listening ? stopRef.current() : start())}
                className="relative grid size-[88px] place-items-center rounded-full bg-warm text-white shadow-[0_10px_40px_-8px_rgba(200,121,43,.7)] active:scale-95"
                aria-label={listening ? 'Parar' : 'Falar'}
              >
                {listening && <span className="anim-ring absolute inset-0 rounded-full bg-warm" />}
                {listening ? <Square size={30} className="relative fill-white" /> : <Mic size={36} className="relative" />}
              </button>
              <div className="size-12" />
            </div>
          )}
          <p className="mt-3 text-center text-sm text-white/45">
            {listening ? 'Ouvindo… fale e eu entendo quando você parar' : state === 'speaking' ? 'Respondendo…' : typing ? '' : 'Toque para falar'}
          </p>
        </div>
      </div>
    </div>
  )
}

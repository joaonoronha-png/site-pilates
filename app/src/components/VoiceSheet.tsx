import { useEffect, useRef, useState } from 'react'
import { Keyboard, Mic, Send, Square, Undo2, X } from 'lucide-react'
import { canListen, listen, needsGesture, speak, stopSpeaking } from '../lib/voice'
import type { BrainResult } from '../lib/brain'
import { EventItem, type Occ } from './EventItem'

type Turn = { text: string; list?: Occ[]; undoable?: boolean }

const EXAMPLES = [
  'Bom dia',
  'O que eu tenho amanhã?',
  'Marca visita ao apto 101 sexta às 10h',
  'Muda o almoço para 13h',
  'Estou livre amanhã às 15h?',
]

export function VoiceSheet({ onClose, ask, now, onOpen, autoStart, name, onUndo }: {
  name: string
  onUndo: () => boolean
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

  useEffect(() => { if (turns.length) endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [turns])
  useEffect(() => () => { stopRef.current(); stopSpeaking() }, [])
  useEffect(() => {
    if (autoStart && canListen() && !needsGesture()) start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handle(text: string) {
    setError('')
    setPartial('')
    setState('thinking')
    setTimeout(() => {
      const r = ask(text)
      setTurns((t) => [...t, { text: r.reply, list: r.list as Occ[] | undefined, undoable: r.effect.type !== 'none' }])
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
    <div className="anim-fade fixed inset-0 z-50 flex flex-col text-white" style={{ background: "radial-gradient(120% 60% at 50% 0%, #12352d 0%, #071311 60%)" }}>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden px-5 pt-[calc(env(safe-area-inset-top)+16px)]">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold uppercase tracking-[.22em] text-white/45">{name}</span>
          <button onClick={onClose} className="grid size-11 place-items-center rounded-full bg-white/10 active:scale-95" aria-label="Fechar">
            <X size={22} />
          </button>
        </div>

        <div className={`flex justify-center transition-all duration-500 ${turns.length ? 'h-[130px] pt-6' : 'h-[250px] pt-10'}`}>
            <div className="transition-transform duration-500" style={{ transform: `scale(${turns.length ? 0.55 : 1})`, transformOrigin: 'top center' }}>
              <div className="orb" data-state={state} />
            </div>
          </div>
        <div className="mt-2 flex-1 space-y-5 overflow-y-auto pb-6 [mask-image:linear-gradient(to_bottom,transparent,black_24px)]">
          {turns.length === 0 && (
            <div className="text-center">
              <p className="font-display text-[26px] font-semibold tracking-[-0.02em]">{listening ? 'Estou ouvindo…' : 'Como posso ajudar?'}</p>
              <p className="mt-2 text-[15px] text-white/55">Fale do seu jeito. Por exemplo:</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {EXAMPLES.map((x) => (
                  <button key={x} onClick={() => handle(x)} className="rounded-full border border-white/10 bg-white/[.05] px-3.5 py-2 text-[14px] text-white/80 active:bg-white/10">
                    “{x}”
                  </button>
                ))}
              </div>
            </div>
          )}
          {turns.map((t, i) => (
            <div key={i} className={`mr-6 ${i < turns.length - 1 ? 'opacity-45' : ''}`}>
              <p className="font-display text-[22px] font-medium leading-snug tracking-[-0.01em]">{t.text}</p>
              {t.undoable && i === turns.length - 1 && (
                <button
                  onClick={() => {
                    if (!onUndo()) return
                    const msg = 'Desfeito. Deixei como estava antes.'
                    setTurns((ts) => [...ts.map((x) => ({ ...x, undoable: false })), { text: msg }])
                    setState('speaking')
                    speak(msg, () => setState('idle'))
                  }}
                  className="mt-3 flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[14px] font-medium text-white/80 active:bg-white/10"
                >
                  <Undo2 size={16} /> Desfazer
                </button>
              )}
              {t.list && t.list.length > 0 && (
                <div className="mt-3 rounded-[24px] bg-paper p-2 text-ink">
                  {t.list.map((e) => <EventItem key={e.id + e.occ.toISOString()} e={e} now={now} onOpen={onOpen} />)}
                </div>
              )}
            </div>
          ))}
          
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
              <button type="submit" className="grid size-11 place-items-center rounded-full bg-glow text-night" aria-label="Enviar">
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
                className="relative grid size-[84px] place-items-center rounded-full text-white shadow-[0_10px_40px_-8px_rgba(53,201,166,.6)] active:scale-95" style={{ background: "radial-gradient(circle at 30% 25%, #4fe0bd 0%, #1d8a73 45%, #0f4a3f 100%)" }}
                aria-label={listening ? 'Parar' : 'Falar'}
              >
                {listening && <span className="anim-ring absolute inset-0 rounded-full bg-glow" />}
                {listening ? <Square size={30} className="relative fill-white" /> : <Mic size={36} className="relative" />}
              </button>
              <div className="size-12" />
            </div>
          )}
          <p className="mt-3 text-center text-sm text-white/45">
            {listening ? (partial ? 'Ouvindo…' : 'Pode falar') : state === 'speaking' ? 'Respondendo…' : typing ? '' : 'Toque para falar'}
          </p>
        </div>
      </div>
    </div>
  )
}

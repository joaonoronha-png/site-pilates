import { useEffect, useState } from 'react'
import { Check, Play } from 'lucide-react'
import { listVoices, playClip, setVoicePref, speak, type VoiceOption } from '../lib/voice'
import { SAMPLE_MP3 } from '../lib/jarvisClips'
import { sir } from '../lib/brain'
import { Card } from './ui'

export function VoicePicker({ value, onChange, name }: { value: string; onChange: (v: string) => void; name: string }) {
  const [voices, setVoices] = useState<VoiceOption[]>(() => listVoices())
  useEffect(() => {
    const refresh = () => setVoices(listVoices())
    const t = setTimeout(refresh, 800) // the Claude voice arrives a moment after load
    if ('speechSynthesis' in window) speechSynthesis.addEventListener?.('voiceschanged', refresh)
    return () => { clearTimeout(t); if ('speechSynthesis' in window) speechSynthesis.removeEventListener?.('voiceschanged', refresh) }
  }, [])

  function hear(id: string) {
    setVoicePref(id)
    speak(`Às suas ordens, ${sir(name)}. Eu sou o Jarvis, seu assistente pessoal.`)
    setVoicePref(value) // only a preview: keep the chosen voice for everything else
  }

  const options: VoiceOption[] = [{ id: '', label: 'Automática', hint: 'escolhe a masculina, se houver' }, ...voices]
  return (
    <Card className="divide-y divide-line">
      <div className="flex items-center gap-3 rounded-t-3xl bg-accent px-4 py-4 text-white">
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">Voz oficial do Jarvis · Faber</span>
          <span className="block text-sm text-white/70">Na prévia, só na apresentação. No app final, em tudo.</span>
        </span>
        <button onClick={() => playClip(SAMPLE_MP3)} className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-[14px] font-semibold text-accent" aria-label="Ouvir a voz oficial do Jarvis">
          <Play size={14} className="fill-accent" />Ouvir
        </button>
      </div>
      <p className="px-4 pt-3 text-[13px] font-semibold uppercase tracking-wider text-muted">Voz das respostas na prévia</p>
      {options.map((v) => (
        <div key={v.id || 'auto'} className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => onChange(v.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-pressed={value === v.id}>
            <span className={`grid size-6 shrink-0 place-items-center rounded-full border-2 ${value === v.id ? 'border-accent bg-accent text-white' : 'border-line'}`}>
              {value === v.id && <Check size={14} strokeWidth={3} />}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium">{v.label}</span>
              <span className="block text-sm text-muted">{v.hint}</span>
            </span>
          </button>
          <button onClick={() => hear(v.id)} className="flex items-center gap-1 rounded-full bg-paper px-3 py-2 text-[14px] font-semibold text-accent" aria-label={`Ouvir ${v.label}`}>
            <Play size={14} className="fill-accent" />Ouvir
          </button>
        </div>
      ))}
      <p className="px-4 py-3 text-sm leading-relaxed text-muted">
        No iPhone, a voz masculina é o <b>Felipe</b>. Se ela não aparecer, baixe em Ajustes › Acessibilidade › Conteúdo Falado › Vozes › Português (Brasil) › Felipe.
      </p>
    </Card>
  )
}

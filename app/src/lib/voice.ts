/* Browser voice: recognition (Safari/Chrome webkitSpeechRecognition) + speech synthesis. */

interface RecognitionLike {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

type Ctor = new () => RecognitionLike

function getCtor(): Ctor | null {
  const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/* Inside a claude.ai artifact the browser mic is locked; the viewer offers
   `dictation` and `tts` instead. Outside it (the real app) we use the browser APIs. */
interface Dictation {
  start(o?: { language?: string }): Promise<void>
  stop(): Promise<void>
  onPartial(h: (e: { text: string }) => void): () => void
  onFinal(h: (e: { text: string }) => void): () => void
  onState(h: (e: { state: string; reason?: string }) => void): () => void
}
interface Tts {
  speak(text: string, o?: { language?: string; rate?: number }): Promise<void>
  stop(): void
}
let dict: Dictation | null = null
let tts: Tts | null = null
const host = (window as unknown as { claude?: { use(n: string): Promise<unknown> } }).claude
if (host?.use) {
  host.use('dictation').then((d) => { dict = d as Dictation | null }).catch(() => {})
  host.use('tts').then((t) => { tts = t as Tts | null }).catch(() => {})
}

export const canListen = () => typeof window !== 'undefined' && (dict !== null || getCtor() !== null)
export const canSpeak = () => typeof window !== 'undefined' && (tts !== null || 'speechSynthesis' in window)

function listenWithDictation(d: Dictation, handlers: Parameters<typeof listen>[0]): () => void {
  let text = ''
  let silence: ReturnType<typeof setTimeout> | undefined
  let finished = false
  const offs: (() => void)[] = []
  const cleanup = () => { offs.forEach((f) => f()); clearTimeout(silence) }
  const finish = () => {
    if (finished) return
    finished = true
    cleanup()
    if (text.trim()) handlers.onFinal(text.trim())
    else handlers.onError('Não ouvi nada. Toque e fale de novo.')
  }
  const armSilence = () => { clearTimeout(silence); silence = setTimeout(() => { d.stop().catch(() => {}) }, 1600) }
  offs.push(d.onPartial(({ text: p }) => { handlers.onPartial((text ? text + ' ' : '') + p); armSilence() }))
  offs.push(d.onFinal(({ text: f }) => { text = (text ? text + ' ' : '') + f; handlers.onPartial(text); armSilence() }))
  offs.push(d.onState(({ state }) => { if (state === 'idle') finish() }))
  d.start({ language: 'pt-BR' }).catch((e: { code?: string }) => {
    finished = true
    cleanup()
    handlers.onError(e?.code === 'not_granted' ? 'O microfone não foi liberado. Você pode digitar.' : 'Toque no microfone para falar.')
  })
  return () => { d.stop().catch(() => {}) }
}

export function listen(handlers: {
  onPartial: (text: string) => void
  onFinal: (text: string) => void
  onError: (msg: string) => void
}): () => void {
  if (dict) return listenWithDictation(dict, handlers)
  const C = getCtor()
  if (!C) {
    handlers.onError('Este navegador não reconhece voz. Use o teclado ou o microfone do teclado.')
    return () => {}
  }
  const rec = new C()
  rec.lang = 'pt-BR'
  rec.interimResults = true
  rec.continuous = false
  let finalText = ''
  let done = false
  rec.onresult = (e) => {
    let text = ''
    for (let i = 0; i < e.results.length; i++) {
      text += e.results[i][0].transcript
      if (e.results[i].isFinal) finalText = text
    }
    handlers.onPartial(text)
  }
  rec.onerror = (e) => {
    if (e.error === 'no-speech' || e.error === 'aborted') return
    done = true
    handlers.onError(e.error === 'not-allowed' ? 'Preciso de permissão para usar o microfone.' : 'Não consegui ouvir. Tente de novo.')
  }
  rec.onend = () => {
    if (done) return
    done = true
    if (finalText.trim()) handlers.onFinal(finalText.trim())
    else handlers.onError('Não ouvi nada. Toque e fale de novo.')
  }
  rec.start()
  return () => rec.stop()
}

let voice: SpeechSynthesisVoice | null = null
let pref = ''
/** '' = automatic; 'tts:<voice>' = Claude voice; 'sys:<name>' = a voice installed on the device */
export function setVoicePref(id: string) { pref = id; voice = null }

export interface VoiceOption { id: string; label: string; hint: string }
const TTS_VOICES: [string, string][] = [['rounded', 'Rounded'], ['glassy', 'Glassy'], ['airy', 'Airy'], ['buttery', 'Buttery']]
export function listVoices(): VoiceOption[] {
  const out: VoiceOption[] = []
  if (tts) for (const [id, l] of TTS_VOICES) out.push({ id: `tts:${id}`, label: `Claude · ${l}`, hint: 'voz do app Claude' })
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    for (const v of speechSynthesis.getVoices()) {
      if (!v.lang.toLowerCase().startsWith('pt')) continue
      out.push({ id: `sys:${v.name}`, label: v.name.replace(/\s*\(.*\)\s*/, ''), hint: v.lang.replace('_', '-') === 'pt-BR' ? 'português do Brasil' : 'português' })
    }
  }
  return out
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (voice) return voice
  if (pref.startsWith('sys:')) {
    voice = speechSynthesis.getVoices().find((v) => v.name === pref.slice(4)) ?? null
    if (voice) return voice
  }
  const vs = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('pt'))
  // Jarvis style: prefer a male Brazilian voice (Felipe on iPhone/Mac), then any pt-BR one
  const br = vs.filter((v) => v.lang.replace('_', '-') === 'pt-BR')
  voice = br.find((v) => /felipe|daniel|ricardo|ant[oô]nio|male|masculin/i.test(v.name) && /premium|enhanced|aprimorad/i.test(v.name))
    ?? br.find((v) => /felipe|daniel|ricardo|ant[oô]nio|male|masculin/i.test(v.name))
    ?? br.find((v) => /premium|enhanced|google/i.test(v.name))
    ?? br[0] ?? vs[0] ?? null
  return voice
}

export function speak(text: string, onEnd?: () => void) {
  if (tts && !pref.startsWith('sys:')) {
    const v = pref.startsWith('tts:') ? pref.slice(4) : undefined
    ;(tts.speak as (t: string, o: object) => Promise<void>)(text, { language: 'pt-BR', rate: 0.95, ...(v ? { voice: v } : {}) }).then(() => onEnd?.(), () => onEnd?.())
    return
  }
  if (!canSpeak()) { onEnd?.(); return }
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'pt-BR'
  u.rate = 0.96
  u.pitch = 0.85 // a little deeper and calmer
  const v = pickVoice()
  if (v) u.voice = v
  u.onend = () => onEnd?.()
  u.onerror = () => onEnd?.()
  speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (canSpeak()) try { speechSynthesis.cancel() } catch { /* ignore */ }
  if (tts) { try { tts.stop() } catch { /* ignore */ } return }
  if (canSpeak()) speechSynthesis.cancel()
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  // voices load late on some browsers; re-pick when they arrive
  speechSynthesis.addEventListener?.('voiceschanged', () => { voice = null })
}
export const needsGesture = () => dict !== null

/** Short two-note chime before an alert is spoken. */
export function chime() {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AC()
    const notes = [[880, 0], [1318.5, 0.16]] as const
    for (const [f, t] of notes) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = f
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t)
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.5)
      o.connect(g).connect(ctx.destination)
      o.start(ctx.currentTime + t)
      o.stop(ctx.currentTime + t + 0.55)
    }
    setTimeout(() => ctx.close(), 1200)
  } catch { /* no audio */ }
}

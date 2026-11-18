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
function pickVoice(): SpeechSynthesisVoice | null {
  if (voice) return voice
  const vs = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('pt'))
  voice = vs.find((v) => v.lang === 'pt-BR' && /luciana|felipe|google|premium|enhanced/i.test(v.name))
    ?? vs.find((v) => v.lang === 'pt-BR') ?? vs[0] ?? null
  return voice
}

export function speak(text: string, onEnd?: () => void) {
  if (tts) {
    tts.speak(text, { language: 'pt-BR' }).then(() => onEnd?.(), () => onEnd?.())
    return
  }
  if (!canSpeak()) { onEnd?.(); return }
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'pt-BR'
  u.rate = 1.02
  const v = pickVoice()
  if (v) u.voice = v
  u.onend = () => onEnd?.()
  u.onerror = () => onEnd?.()
  speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (tts) { try { tts.stop() } catch { /* ignore */ } return }
  if (canSpeak()) speechSynthesis.cancel()
}
export const needsGesture = () => dict !== null

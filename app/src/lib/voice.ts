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

export const canListen = () => typeof window !== 'undefined' && getCtor() !== null
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

export function listen(handlers: {
  onPartial: (text: string) => void
  onFinal: (text: string) => void
  onError: (msg: string) => void
}): () => void {
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
  if (canSpeak()) speechSynthesis.cancel()
}

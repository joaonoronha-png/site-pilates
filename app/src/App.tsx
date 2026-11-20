import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, CloudRain, CloudSun, Home, Mic, Play, Plus, Settings as Cog, Square } from 'lucide-react'
import { useAgenda, occurrences, uid } from './lib/store'
import { addDays, hhmm, longDate, sameDay, startOfDay, relativeDay } from './lib/dates'
import { interpret, morningBrief, greeting, sir, type Pending } from './lib/brain'
import { fetchWeather, weatherSentence, type Weather } from './lib/weather'
import { chime, speak, stopSpeaking } from './lib/voice'
import { Welcome } from './components/Welcome'
import { Login } from './components/Login'
import { EventItem, isConfirmed, type Occ } from './components/EventItem'
import { EventSheet } from './components/EventSheet'
import { VoiceSheet } from './components/VoiceSheet'
import { AlertBanner, AlertScreen, alertText } from './components/Alert'
import { SettingsView } from './components/SettingsView'
import { AgendaView } from './components/AgendaView'

type Tab = 'today' | 'agenda' | 'settings'

function useNow(ms = 20000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

export default function App() {
  const { events, settings, setSettings, upsert, remove, reset, setEvents } = useAgenda()
  const now = useNow()
  const [tab, setTab] = useState<Tab>('today')
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [editing, setEditing] = useState<{ e: Occ; isNew: boolean } | null>(null)
  const [weather, setWeather] = useState<Weather | null>(null)
  const [banner, setBanner] = useState<Occ | null>(null)
  const [alertScreen, setAlertScreen] = useState<Occ | null>(null)
  const [briefPlaying, setBriefPlaying] = useState(false)
  const [toast, setToast] = useState<{ text: string; show: boolean }>({ text: '', show: false })
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  function notify(text: string) {
    clearTimeout(toastTimer.current)
    setToast({ text, show: true })
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200)
  }
  const pending = useRef<Pending | undefined>(undefined)
  const lastAlerted = useRef<string | undefined>(undefined)
  const lastEvent = useRef<string | undefined>(undefined)
  const alerted = useRef(new Set<string>())

  useEffect(() => { fetchWeather(settings.city).then(setWeather) }, [settings.city])

  const withDefault = (e: Occ): Occ => ({ ...e, alertBefore: e.alertBefore ?? settings.alertBefore })

  // ---- alert engine (in the real app this runs on the server and sends push / calls)
  useEffect(() => {
    const due = occurrences(events, addDays(now, -1), addDays(now, 1))
      .map(withDefault)
      .filter((e) => !isConfirmed(e))
      .filter((e) => {
        const at = e.occ.getTime() - (e.alertBefore ?? 30) * 60000
        return now.getTime() >= at && now.getTime() <= e.occ.getTime() + 5 * 60000
      })
      .find((e) => !alerted.current.has(e.id + e.occ.toISOString()))
    if (due) fire(due)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, events])

  function fire(e: Occ) {
    alerted.current.add(e.id + e.occ.toISOString())
    lastAlerted.current = e.id
    setBanner(e)
    chime()
    if (settings.speakAlerts) setTimeout(() => speak(alertText(e, new Date())), 700)
    setTimeout(() => setBanner((b) => (b?.id === e.id ? null : b)), 9000)
  }

  function confirm(id: string) {
    const ev = events.find((x) => x.id === id)
    if (ev) upsert({ ...ev, confirmedAt: new Date().toISOString() })
  }

  const ctx = () => ({ events, settings, now: new Date(), pending: pending.current, lastAlertedId: lastAlerted.current, lastEventId: lastEvent.current })

  const undoStack = useRef<typeof events | null>(null)
  function undo() {
    if (undoStack.current) setEvents(undoStack.current)
    undoStack.current = null
  }

  function ask(text: string) {
    const r = interpret(text, ctx(), weatherSentence(weather, settings.city))
    undoStack.current = r.effect.type === 'none' ? null : events
    pending.current = r.pending
    if (r.touchedId) lastEvent.current = r.touchedId
    const ef = r.effect
    if (ef.type === 'create') upsert(ef.event)
    else if (ef.type === 'update') setEvents((l) => l.map((e) => (e.id === ef.id ? { ...e, ...ef.patch } : e)))
    else if (ef.type === 'delete') remove(ef.id)
    else if (ef.type === 'confirm') confirm(ef.id)
    return r
  }

  function playBrief() {
    if (briefPlaying) { stopSpeaking(); setBriefPlaying(false); return }
    setBriefPlaying(true)
    speak(morningBrief(ctx(), weatherSentence(weather, settings.city)).reply, () => setBriefPlaying(false))
  }

  function newEvent(day: Date) {
    const d = new Date(day)
    const base = sameDay(day, now) ? new Date(now.getTime() + 3600000) : d
    d.setHours(base.getHours(), 0, 0, 0)
    setEditing({
      isNew: true,
      e: { id: uid(), title: '', start: d.toISOString(), occ: d, durationMin: 60, important: false, repeat: 'none', alertBefore: null, kind: 'event' },
    })
  }

  const today = useMemo(() => occurrences(events, startOfDay(now), addDays(startOfDay(now), 1)), [events, now])
  const next = useMemo(() => occurrences(events, now, addDays(now, 30))[0], [events, now])

  return (
    <div className="relative mx-auto min-h-full max-w-md px-4 pb-36 pt-[calc(env(safe-area-inset-top)+20px)]" style={settings.bigText ? { zoom: 1.12 } : undefined}>
      {!settings.account && <Login onDone={(account) => setSettings({ ...settings, account })} />}
      {settings.account && !settings.onboarded && <Welcome settings={settings} onDone={(s) => {
        setSettings({ ...s, onboarded: true })
        const who = `, ${sir(s.name)}`
        speak(`Olá${who}. Eu sou o ${s.assistant}, seu assistente pessoal. A partir de agora eu cuido da sua agenda. Quando precisar de mim, é só chamar.`)
      }} />}
      <div key={tab} className="anim-view">
      {tab === 'today' && (
        <TodayView
          now={now} name={settings.name} weather={weather} city={settings.city} today={today} next={next}
          briefPlaying={briefPlaying} onBrief={playBrief}
          onOpen={(e) => setEditing({ e, isNew: false })} onAdd={() => newEvent(now)}
        />
      )}
      {tab === 'agenda' && (
        <AgendaView events={events} now={now} onOpen={(e) => setEditing({ e, isNew: false })} onAdd={newEvent} />
      )}
      {tab === 'settings' && (
        <SettingsView
          s={settings} set={setSettings} onReset={reset}
          onSimulate={() => { const e = next ?? today[0]; if (e) { alerted.current.clear(); fire(withDefault(e)) } }}
        />
      )}
      </div>

      <button
        onClick={() => setTab(tab === 'settings' ? 'today' : 'settings')}
        className={`absolute right-4 top-[calc(env(safe-area-inset-top)+18px)] z-20 grid size-11 place-items-center rounded-full active:scale-95 ${tab === 'settings' ? 'bg-accent text-white' : tab === 'today' ? 'bg-white/12 text-white backdrop-blur' : 'bg-card text-muted shadow-sm'}`}
        aria-label="Ajustes"
      >
        <Cog size={21} />
      </button>

      {/* floating bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 px-5 pb-[calc(env(safe-area-inset-bottom)+14px)]">
        <div className="mx-auto flex max-w-[340px] items-center justify-between rounded-[30px] border border-white/60 bg-white/75 px-3 py-2 shadow-[0_18px_40px_-18px_rgba(12,25,22,.45)] backdrop-blur-xl">
          <NavBtn active={tab === 'today'} onClick={() => setTab('today')} icon={<Home size={22} />} label="Hoje" />
          <button
            onClick={() => { stopSpeaking(); setVoiceOpen(true) }}
            className="relative -my-6 grid size-[72px] place-items-center rounded-full text-white shadow-[0_14px_30px_-10px_rgba(15,74,63,.9)] active:scale-95"
            style={{ background: 'radial-gradient(circle at 30% 25%, #4fe0bd 0%, #1d8a73 45%, #0f4a3f 100%)' }}
            aria-label="Falar com o assistente"
          >
            <span className="mic-halo" aria-hidden />
            <span className="absolute inset-[-5px] rounded-full border-2 border-glow/35" />
            <Mic size={30} strokeWidth={2.2} />
          </button>
          <NavBtn active={tab === 'agenda'} onClick={() => setTab('agenda')} icon={<CalendarDays size={22} />} label="Agenda" />
        </div>
      </nav>

      {voiceOpen && (
        <VoiceSheet
          autoStart onClose={() => setVoiceOpen(false)} ask={ask} now={now} name={settings.assistant}
          onUndo={() => { const had = !!undoStack.current; undo(); return had }}
          onOpen={(e) => { setVoiceOpen(false); setEditing({ e, isNew: false }) }}
        />
      )}
      {editing && (
        <EventSheet
          key={editing.e.id} initial={editing.e} isNew={editing.isNew} settings={settings}
          onClose={() => setEditing(null)}
          onSave={(e) => { upsert(e); setEditing(null); notify(editing.isNew ? 'Compromisso marcado' : 'Alterações salvas') }}
          onDelete={(id) => { remove(id); setEditing(null); notify('Compromisso cancelado') }}
          onConfirm={(id) => { confirm(id); setEditing(null) }}
        />
      )}
      <div
        role="status"
        data-show={toast.show}
        className="toast pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+112px)] z-40 flex justify-center px-6"
      >
        <span className="flex items-center gap-2 rounded-full bg-ink/90 px-5 py-3 text-[15px] font-medium text-white shadow-lg backdrop-blur">
          <span className="size-2 rounded-full bg-glow" />{toast.text}
        </span>
      </div>
      {banner && <AlertBanner e={banner} now={now} onOpen={() => { setAlertScreen(banner); setBanner(null) }} />}
      {alertScreen && (
        <AlertScreen
          e={alertScreen} now={now}
          onConfirm={() => { confirm(alertScreen.id); stopSpeaking(); setAlertScreen(null) }}
          onLater={() => {
            const e = alertScreen
            setAlertScreen(null)
            setTimeout(() => fire(e), 5 * 60000)
          }}
        />
      )}
    </div>
  )
}


function NavBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`flex w-24 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[12px] font-semibold transition-colors ${active ? 'text-accent' : 'text-muted'}`}>
      {icon}
      {label}
      <span className={`mt-0.5 h-1 w-1 rounded-full ${active ? 'bg-accent' : 'bg-transparent'}`} />
    </button>
  )
}

function TodayView({ now, name, weather, city, today, next, briefPlaying, onBrief, onOpen, onAdd }: {
  now: Date; name: string; weather: Weather | null; city: string; today: Occ[]; next?: Occ
  briefPlaying: boolean; onBrief: () => void; onOpen: (e: Occ) => void; onAdd: () => void
}) {
  const mins = next ? Math.round((next.occ.getTime() - now.getTime()) / 60000) : 0
  const until = mins < 60 ? `em ${mins} min` : mins < 24 * 60 ? `em ${Math.floor(mins / 60)}h${mins % 60 ? String(mins % 60).padStart(2, '0') : ''}` : relativeDay(next!.occ, now)
  const remaining = today.filter((e) => e.occ.getTime() + e.durationMin * 60000 > now.getTime()).length
  const nowLineIdx = today.findIndex((e) => e.occ > now)
  return (
    <div>
      <section className="hero-glow relative isolate -mx-1 overflow-hidden rounded-[32px] px-6 pb-6 pt-6 text-white shadow-[0_24px_50px_-24px_rgba(15,74,63,.8)]">
        <span className="hero-ambient -z-10" aria-hidden />
        <span className="shine" aria-hidden />
        <p className="text-[14px] font-medium text-white/65">{longDate(now)}</p>
        <h1 className="mt-1 font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] [text-wrap:balance]">
          {greeting(now)}{name ? `, ${name}` : ''}
        </h1>
        <div className="mt-3 flex items-center gap-2 text-[15px] text-white/80">
          {weather ? (
            <>
              {weather.rain >= 50 ? <CloudRain size={18} /> : <CloudSun size={18} />}
              <span><b className="font-semibold text-white">{weather.now}°</b> em {city} · {weather.min}° a {weather.max}°</span>
            </>
          ) : (
            <span>{remaining === 0 ? 'Nada mais na agenda hoje' : `${remaining} compromisso${remaining > 1 ? 's' : ''} pela frente hoje`}</span>
          )}
        </div>
        <button onClick={onBrief} className="mt-5 flex w-full items-center gap-3 rounded-2xl bg-white/12 p-2 pr-4 text-left ring-1 ring-white/15 backdrop-blur active:scale-[.99]">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-accent">
            {briefPlaying ? <Square size={16} className="fill-accent" /> : <Play size={18} className="ml-0.5 fill-accent" />}
          </span>
          <span className="flex-1">
            <span className="block text-[16px] font-semibold">{briefPlaying ? 'Falando…' : 'Ouvir meu dia'}</span>
            <span className="block text-[13px] text-white/65">Agenda e clima, em voz alta</span>
          </span>
          {briefPlaying && (
            <span className="flex h-5 items-end gap-[3px]">
              {[0, 1, 2, 3].map((i) => <span key={i} className="anim-eq h-5 w-[3px] rounded-full bg-glow" style={{ animationDelay: `${i * 120}ms` }} />)}
            </span>
          )}
        </button>
      </section>

      {next && (
        <button onClick={() => onOpen(next)} className="lift anim-pop mt-4 w-full rounded-[28px] border border-line bg-card p-5 text-left shadow-[0_10px_30px_-22px_rgba(12,25,22,.5)]" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[.08em] text-muted">
              <span className="relative flex size-2.5"><span className="anim-ring absolute inset-0 rounded-full bg-warm" /><span className="relative size-2.5 rounded-full bg-warm" /></span>
              Próximo
            </span>
            <span className="rounded-full bg-warm-soft px-3 py-1 text-[13px] font-semibold text-[#a4620f]">{until}</span>
          </div>
          <div className="mt-3 font-display text-[24px] font-semibold leading-tight tracking-[-0.01em]">{next.title}</div>
          <div className="mt-1.5 flex items-center gap-3 text-[15px] text-muted">
            <span className="font-semibold tabular-nums text-ink">{hhmm(next.occ)}</span>
            {next.location && <span>· {next.location}</span>}
          </div>
        </button>
      )}

      <div className="mt-7 flex items-center justify-between px-1">
        <h2 className="font-display text-[20px] font-semibold tracking-[-0.01em]">Hoje</h2>
        <button onClick={onAdd} className="flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-[14px] font-semibold text-white active:scale-95"><Plus size={16} strokeWidth={2.5} />Novo</button>
      </div>
      <div className="mt-3">
        {today.length === 0
          ? <p className="rounded-[28px] border border-dashed border-line px-5 py-10 text-center text-muted">Nada marcado para hoje.<br />Toque no microfone e diga o que marcar.</p>
          : <Timeline items={today} now={now} onOpen={onOpen} nowLineIdx={nowLineIdx} />}
      </div>
    </div>
  )
}

function Timeline({ items, now, onOpen, nowLineIdx = -1 }: { items: Occ[]; now: Date; onOpen: (e: Occ) => void; nowLineIdx?: number }) {
  return (
    <ol className="stagger relative">
      <span className="absolute bottom-6 left-[15px] top-6 w-px bg-line" aria-hidden />
      {items.map((e, i) => (
        <li key={e.id + e.occ.toISOString()} style={{ '--i': i + 2 } as React.CSSProperties}>
          {i === nowLineIdx && (
            <div className="relative my-1 flex items-center gap-2 pl-[9px]" aria-label="Agora">
              <span className="size-[13px] rounded-full border-[3px] border-paper bg-warm shadow" />
              <span className="h-px flex-1 bg-warm/60" />
              <span className="text-[12px] font-semibold text-warm tabular-nums">{hhmm(now)}</span>
            </div>
          )}
          <EventItem e={e} now={now} onOpen={onOpen} />
        </li>
      ))}
    </ol>
  )
}

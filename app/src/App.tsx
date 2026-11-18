import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, CloudRain, CloudSun, Home, Mic, Play, Plus, Settings as Cog, Square } from 'lucide-react'
import { useAgenda, occurrences, uid } from './lib/store'
import { addDays, hhmm, longDate, sameDay, startOfDay, WEEKDAYS, relativeDay } from './lib/dates'
import { interpret, morningBrief, greeting, type Pending } from './lib/brain'
import { fetchWeather, weatherSentence, type Weather } from './lib/weather'
import { speak, stopSpeaking } from './lib/voice'
import { EventItem, isConfirmed, type Occ } from './components/EventItem'
import { EventSheet } from './components/EventSheet'
import { VoiceSheet } from './components/VoiceSheet'
import { AlertBanner, AlertScreen, alertText } from './components/Alert'
import { SettingsView } from './components/SettingsView'
import { Card } from './components/ui'

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
    if (settings.speakAlerts) speak(alertText(e, new Date()))
    setTimeout(() => setBanner((b) => (b?.id === e.id ? null : b)), 9000)
  }

  function confirm(id: string) {
    const ev = events.find((x) => x.id === id)
    if (ev) upsert({ ...ev, confirmedAt: new Date().toISOString() })
  }

  const ctx = () => ({ events, settings, now: new Date(), pending: pending.current, lastAlertedId: lastAlerted.current, lastEventId: lastEvent.current })

  function ask(text: string) {
    const r = interpret(text, ctx(), weatherSentence(weather, settings.city))
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
    <div className="relative mx-auto min-h-full max-w-md px-4 pb-36 pt-[calc(env(safe-area-inset-top)+20px)]">
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

      <button
        onClick={() => setTab(tab === 'settings' ? 'today' : 'settings')}
        className={`absolute right-4 top-[calc(env(safe-area-inset-top)+16px)] z-20 grid size-11 place-items-center rounded-full shadow-sm active:scale-95 ${tab === 'settings' ? 'bg-accent text-white' : 'bg-card text-muted'}`}
        aria-label="Ajustes"
      >
        <Cog size={21} />
      </button>

      {/* bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-paper/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg">
        <div className="mx-auto grid max-w-md grid-cols-3 items-end px-4">
          <NavBtn active={tab === 'today'} onClick={() => setTab('today')} icon={<Home size={24} />} label="Hoje" />
          <div className="flex justify-center">
            <button
              onClick={() => { stopSpeaking(); setVoiceOpen(true) }}
              className="-mt-8 mb-2 grid size-[76px] place-items-center rounded-full bg-warm text-white shadow-[0_12px_30px_-8px_rgba(200,121,43,.75)] ring-[6px] ring-paper active:scale-95"
              aria-label="Falar com o assistente"
            >
              <Mic size={34} />
            </button>
          </div>
          <NavBtn active={tab === 'agenda'} onClick={() => setTab('agenda')} icon={<CalendarDays size={24} />} label="Agenda" />
        </div>
      </nav>

      {voiceOpen && (
        <VoiceSheet
          autoStart onClose={() => setVoiceOpen(false)} ask={ask} now={now}
          onOpen={(e) => { setVoiceOpen(false); setEditing({ e, isNew: false }) }}
        />
      )}
      {editing && (
        <EventSheet
          key={editing.e.id} initial={editing.e} isNew={editing.isNew} settings={settings}
          onClose={() => setEditing(null)}
          onSave={(e) => { upsert(e); setEditing(null) }}
          onDelete={(id) => { remove(id); setEditing(null) }}
          onConfirm={(id) => { confirm(id); setEditing(null) }}
        />
      )}
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

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

function NavBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${active ? 'text-accent' : 'text-muted'}`}>
      {icon}
      {label}
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
  return (
    <div>
      <p className="text-[15px] text-muted">{longDate(now)}</p>
      <h1 className="mt-1 font-display text-[36px] leading-tight">{greeting(now)}{name ? `, ${name}` : ''}</h1>

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
        <button onClick={onBrief} className="flex items-center gap-3 rounded-3xl bg-accent p-4 text-left text-white active:scale-[.99]">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/15">
            {briefPlaying ? <Square size={18} className="fill-white" /> : <Play size={20} className="ml-0.5 fill-white" />}
          </span>
          <span>
            <span className="block text-[17px] font-semibold">Ouvir meu dia</span>
            <span className="block text-sm text-white/70">{remaining === 0 ? 'Nada mais hoje' : `${remaining} compromisso${remaining > 1 ? 's' : ''} pela frente`}</span>
          </span>
        </button>
        <div className="flex min-w-[104px] flex-col justify-center rounded-3xl bg-card p-4 text-center">
          {weather ? (
            <>
              <span className="mx-auto text-warm">{weather.rain >= 50 ? <CloudRain size={22} /> : <CloudSun size={22} />}</span>
              <span className="mt-1 text-2xl font-semibold tabular-nums">{weather.now}°</span>
              <span className="text-xs text-muted">{weather.min}° – {weather.max}°</span>
            </>
          ) : (
            <span className="text-xs text-muted">{city}</span>
          )}
        </div>
      </div>

      {next && (
        <Card className="mt-4 overflow-hidden">
          <button onClick={() => onOpen(next)} className="w-full p-5 text-left">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-warm-soft px-3 py-1 text-sm font-semibold text-warm">Próximo · {until}</span>
              <span className="text-[15px] font-semibold tabular-nums text-muted">{hhmm(next.occ)}</span>
            </div>
            <div className="mt-3 font-display text-[26px] leading-tight">{next.title}</div>
            {next.location && <div className="mt-1 text-muted">{next.location}</div>}
          </button>
        </Card>
      )}

      <div className="mt-7 flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold">Hoje</h2>
        <button onClick={onAdd} className="flex items-center gap-1 rounded-full bg-card px-3.5 py-2 text-[15px] font-medium text-accent active:scale-95"><Plus size={17} />Novo</button>
      </div>
      <Card className="mt-3 py-1">
        {today.length === 0
          ? <p className="px-5 py-8 text-center text-muted">Nada marcado para hoje.<br />Toque no microfone e diga o que marcar.</p>
          : today.map((e) => <EventItem key={e.id + e.occ.toISOString()} e={e} now={now} onOpen={onOpen} />)}
      </Card>
    </div>
  )
}

function AgendaView({ events, now, onOpen, onAdd }: { events: Parameters<typeof occurrences>[0]; now: Date; onOpen: (e: Occ) => void; onAdd: (d: Date) => void }) {
  const [sel, setSel] = useState(() => startOfDay(now))
  const days = Array.from({ length: 14 }, (_, i) => addDays(startOfDay(now), i))
  const span = occurrences(events, startOfDay(now), addDays(startOfDay(now), 14))
  const list = span.filter((e) => sameDay(e.occ, sel))
  const upcoming = days.slice(0, 8).filter((d) => !sameDay(d, sel)).slice(0, 7).map((d) => ({ d, items: span.filter((e) => sameDay(e.occ, d)) })).filter((x) => x.items.length)
  return (
    <div>
      <h1 className="font-display text-[34px]">Agenda</h1>
      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
        {days.map((d) => {
          const active = sameDay(d, sel)
          const has = span.some((e) => sameDay(e.occ, d))
          return (
            <button key={d.toISOString()} onClick={() => setSel(d)} className={`flex w-[54px] shrink-0 flex-col items-center rounded-2xl py-2.5 ${active ? 'bg-accent text-white' : 'bg-card'}`}>
              <span className={`text-xs uppercase ${active ? 'text-white/75' : 'text-muted'}`}>{WEEKDAYS[d.getDay()].slice(0, 3)}</span>
              <span className="text-xl font-semibold tabular-nums">{d.getDate()}</span>
              <span className={`mt-1 size-1.5 rounded-full ${has ? (active ? 'bg-white' : 'bg-warm') : 'bg-transparent'}`} />
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-center justify-between px-1">
        <p className="text-[15px] font-medium text-muted">{longDate(sel)}</p>
        <button onClick={() => onAdd(sel)} className="flex items-center gap-1 rounded-full bg-card px-3.5 py-2 text-[15px] font-medium text-accent active:scale-95"><Plus size={17} />Novo</button>
      </div>
      <Card className="mt-2 py-1">
        {list.length === 0
          ? <p className="px-5 py-8 text-center text-muted">Dia livre.</p>
          : list.map((e) => <EventItem key={e.id + e.occ.toISOString()} e={e} now={now} onOpen={onOpen} />)}
      </Card>

      <h2 className="mt-8 px-1 text-lg font-semibold">Próximos dias</h2>
      <div className="mt-2 space-y-4">
        {upcoming.map(({ d, items }) => (
          <div key={d.toISOString()}>
            <p className="px-1 pb-1.5 text-sm font-medium text-muted">{cap(relativeDay(d, now))}</p>
            <Card className="py-1">{items.map((e) => <EventItem key={e.id + e.occ.toISOString()} e={e} now={now} onOpen={onOpen} />)}</Card>
          </div>
        ))}
      </div>
    </div>
  )
}

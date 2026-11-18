import { useCallback, useEffect, useState } from 'react'
import { addDays, startOfDay } from './dates'
import { DEFAULT_SETTINGS, type AgendaEvent, type Settings } from './types'

const EVENTS_KEY = 'agenda.events.v1'
const SETTINGS_KEY = 'agenda.settings.v1'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode — keep in memory only */
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function at(dayOffset: number, h: number, m = 0): string {
  const d = addDays(startOfDay(new Date()), dayOffset)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

export function seedEvents(): AgendaEvent[] {
  const base = { durationMin: 60, important: false, repeat: 'none' as const, alertBefore: null, kind: 'event' as const }
  const now = new Date()
  // one event ~35 min from now so the alert demo shows up naturally
  const soon = new Date(now.getTime() + 35 * 60000)
  soon.setSeconds(0, 0)
  soon.setMinutes(Math.ceil(soon.getMinutes() / 5) * 5)
  return [
    { ...base, id: uid(), title: 'Reunião com o contador', start: soon.toISOString(), location: 'Escritório', important: true },
    { ...base, id: uid(), title: 'Almoço com o Carlos', start: at(0, 12, 30), location: 'Restaurante Dona Maria' },
    { ...base, id: uid(), title: 'Ligar para o fornecedor', start: at(0, 16), durationMin: 15, kind: 'reminder' },
    { ...base, id: uid(), title: 'Reunião de equipe', start: at(1, 9), repeat: 'weekly' },
    { ...base, id: uid(), title: 'Dentista', start: at(2, 10), location: 'Clínica Sorriso' },
    { ...base, id: uid(), title: 'Visita à obra', start: at(4, 14, 30), important: true },
  ]
}

export function useAgenda() {
  const [events, setEvents] = useState<AgendaEvent[]>(() => read(EVENTS_KEY, seedEvents()))
  const [settings, setSettings] = useState<Settings>(() => ({ ...DEFAULT_SETTINGS, ...read(SETTINGS_KEY, {}) }))

  useEffect(() => write(EVENTS_KEY, events), [events])
  useEffect(() => write(SETTINGS_KEY, settings), [settings])

  const upsert = useCallback((ev: AgendaEvent) => {
    setEvents((list) => {
      const i = list.findIndex((e) => e.id === ev.id)
      if (i === -1) return [...list, ev]
      const copy = [...list]
      copy[i] = ev
      return copy
    })
  }, [])

  const remove = useCallback((id: string) => setEvents((l) => l.filter((e) => e.id !== id)), [])

  const reset = useCallback(() => setEvents(seedEvents()), [])

  return { events, settings, setSettings, upsert, remove, reset, setEvents }
}

/** Expand repeating events into concrete occurrences between from and to. */
export function occurrences(events: AgendaEvent[], from: Date, to: Date): (AgendaEvent & { occ: Date })[] {
  const out: (AgendaEvent & { occ: Date })[] = []
  for (const ev of events) {
    const first = new Date(ev.start)
    if (ev.repeat === 'none') {
      if (first >= from && first < to) out.push({ ...ev, occ: first })
      continue
    }
    let d = new Date(first)
    let guard = 0
    while (d < to && guard++ < 400) {
      if (d >= from) out.push({ ...ev, occ: new Date(d) })
      if (ev.repeat === 'daily') d = addDays(d, 1)
      else if (ev.repeat === 'weekly') d = addDays(d, 7)
      else {
        d = new Date(d)
        d.setMonth(d.getMonth() + 1)
      }
    }
  }
  return out.sort((a, b) => a.occ.getTime() - b.occ.getTime())
}

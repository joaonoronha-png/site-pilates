import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, List, Plus, Rows3, Star } from 'lucide-react'
import { occurrences } from '../lib/store'
import { addDays, hhmm, longDate, MONTHS, relativeDay, sameDay, startOfDay } from '../lib/dates'
import type { AgendaEvent } from '../lib/types'
import { EventItem, isConfirmed, type Occ } from './EventItem'

const HOUR_PX = 64
const FIRST_HOUR = 6
const LAST_HOUR = 23
const WD = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function monthGrid(month: Date): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = addDays(first, -first.getDay())
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

export function AgendaView({ events, now, onOpen, onAdd }: {
  events: AgendaEvent[]; now: Date; onOpen: (e: Occ) => void; onAdd: (d: Date) => void
}) {
  const [sel, setSel] = useState(() => startOfDay(now))
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1))
  const [mode, setMode] = useState<'grade' | 'lista'>('grade')

  const grid = monthGrid(month)
  const monthOcc = useMemo(() => occurrences(events, grid[0], addDays(grid[41], 1)), [events, month]) // eslint-disable-line react-hooks/exhaustive-deps
  const countFor = (d: Date) => monthOcc.filter((e) => sameDay(e.occ, d))
  const day = countFor(sel)
  const weeksToShow = grid[35].getMonth() === month.getMonth() ? 6 : 5

  return (
    <div>
      <div className="flex items-end justify-between pr-14">
        <h1 className="font-display text-[32px] font-semibold tracking-[-0.02em]">Agenda</h1>
      </div>

      {/* month */}
      <section className="mt-4 rounded-[28px] border border-line bg-card p-4 shadow-[0_10px_30px_-24px_rgba(12,25,22,.5)]">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="grid size-9 place-items-center rounded-full bg-paper text-muted active:scale-95" aria-label="Mês anterior"><ChevronLeft size={18} /></button>
          <button
            onClick={() => { setMonth(new Date(now.getFullYear(), now.getMonth(), 1)); setSel(startOfDay(now)) }}
            className="font-display text-[17px] font-semibold capitalize"
          >
            {MONTHS[month.getMonth()]} <span className="text-muted">{month.getFullYear()}</span>
          </button>
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="grid size-9 place-items-center rounded-full bg-paper text-muted active:scale-95" aria-label="Próximo mês"><ChevronRight size={18} /></button>
        </div>
        <div className="grid grid-cols-7 text-center text-[12px] font-semibold text-muted">
          {WD.map((w, i) => <span key={i} className="py-1">{w}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {grid.slice(0, weeksToShow * 7).map((d) => {
            const inMonth = d.getMonth() === month.getMonth()
            const isSel = sameDay(d, sel)
            const isToday = sameDay(d, now)
            const items = countFor(d)
            return (
              <button
                key={d.toISOString()}
                onClick={() => { setSel(d); if (!inMonth) setMonth(new Date(d.getFullYear(), d.getMonth(), 1)) }}
                className="flex flex-col items-center py-0.5"
                aria-label={longDate(d)}
              >
                <span className={`grid size-9 place-items-center rounded-full text-[16px] tabular-nums transition ${
                  isSel ? 'bg-accent font-semibold text-white shadow-[0_8px_16px_-8px_rgba(15,74,63,.9)]'
                  : isToday ? 'font-semibold text-accent ring-2 ring-accent/25'
                  : inMonth ? 'text-ink' : 'text-muted/40'}`}>
                  {d.getDate()}
                </span>
                <span className="mt-0.5 flex h-1.5 gap-[3px]">
                  {items.slice(0, 3).map((e) => (
                    <span key={e.id + e.occ.toISOString()} className={`size-1.5 rounded-full ${e.important ? 'bg-warm' : 'bg-glow'}`} />
                  ))}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* day */}
      <div className="mt-6 flex items-center justify-between gap-2 px-1">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold uppercase tracking-[.08em] text-muted">{longDate(sel).split(',')[0]}{relativeDay(sel, now) === 'hoje' ? ' · hoje' : relativeDay(sel, now) === 'amanhã' ? ' · amanhã' : ''}</p>
          <p className="truncate font-display text-[20px] font-semibold tracking-[-0.01em]">{sel.getDate()} de {MONTHS[sel.getMonth()]}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex rounded-full bg-card p-1 ring-1 ring-line">
            <button onClick={() => setMode('grade')} className={`grid size-8 place-items-center rounded-full ${mode === 'grade' ? 'bg-accent text-white' : 'text-muted'}`} aria-label="Ver em grade de horários"><Rows3 size={16} /></button>
            <button onClick={() => setMode('lista')} className={`grid size-8 place-items-center rounded-full ${mode === 'lista' ? 'bg-accent text-white' : 'text-muted'}`} aria-label="Ver em lista"><List size={16} /></button>
          </div>
          <button onClick={() => onAdd(sel)} className="grid size-10 place-items-center rounded-full bg-accent text-white active:scale-95" aria-label="Novo compromisso"><Plus size={20} strokeWidth={2.5} /></button>
        </div>
      </div>

      <div className="mt-3">
        {mode === 'grade'
          ? <DayGrid day={sel} items={day} now={now} onOpen={onOpen} onAdd={onAdd} />
          : day.length === 0
            ? <p className="rounded-[28px] border border-dashed border-line px-5 py-10 text-center text-muted">Dia livre.</p>
            : day.map((e) => <EventItem key={e.id + e.occ.toISOString()} e={e} now={now} onOpen={onOpen} />)}
      </div>
    </div>
  )
}

/** Hour grid like a paper planner: each block is as tall as the appointment is long. */
function DayGrid({ day, items, now, onOpen, onAdd }: { day: Date; items: Occ[]; now: Date; onOpen: (e: Occ) => void; onAdd: (d: Date) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const first = Math.min(FIRST_HOUR, ...items.map((e) => e.occ.getHours()))
  const hours = Array.from({ length: LAST_HOUR - first + 1 }, (_, i) => first + i)
  const top = (d: Date) => (d.getHours() - first + d.getMinutes() / 60) * HOUR_PX
  const isToday = sameDay(day, now)

  // side-by-side columns for overlapping blocks
  const placed = items.map((e, i) => {
    const end = e.occ.getTime() + e.durationMin * 60000
    const overl = items.filter((o, j) => j !== i && o.occ.getTime() < end && o.occ.getTime() + o.durationMin * 60000 > e.occ.getTime())
    const col = overl.filter((o) => items.indexOf(o) < i).length
    return { e, col, cols: overl.length + 1 }
  })

  useEffect(() => {
    const target = isToday ? now : items[0]?.occ
    if (target && ref.current) ref.current.scrollTop = Math.max(0, top(target) - HOUR_PX)
  }, [day]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} className="relative max-h-[520px] overflow-y-auto rounded-[28px] border border-line bg-card">
      <div className="relative" style={{ height: hours.length * HOUR_PX }}>
        {hours.map((h) => (
          <button
            key={h}
            onClick={() => { const d = new Date(day); d.setHours(h, 0, 0, 0); onAdd(d) }}
            className="absolute inset-x-0 flex border-t border-line/70 text-left first:border-t-0"
            style={{ top: (h - first) * HOUR_PX, height: HOUR_PX }}
            aria-label={`Marcar às ${h} horas`}
          >
            <span className="w-14 shrink-0 -translate-y-2 pr-2 text-right text-[12px] font-medium tabular-nums text-muted">{h === first ? '' : `${String(h).padStart(2, '0')}:00`}</span>
          </button>
        ))}

        {placed.map(({ e, col, cols }) => {
          const h = Math.max(30, (e.durationMin / 60) * HOUR_PX - 4)
          const seen = isConfirmed(e)
          const past = e.occ.getTime() + e.durationMin * 60000 < now.getTime()
          return (
            <button
              key={e.id + e.occ.toISOString()}
              onClick={() => onOpen(e)}
              className={`absolute overflow-hidden rounded-2xl border-l-4 px-3 py-1.5 text-left shadow-sm transition active:scale-[.98] ${
                e.important ? 'border-warm bg-warm-soft' : 'border-accent bg-accent-soft'} ${past ? 'opacity-50' : ''}`}
              style={{
                top: top(e.occ) + 2,
                height: h,
                left: `calc(60px + (100% - 68px) * ${col / cols})`,
                width: `calc((100% - 68px) / ${cols} - 4px)`,
              }}
            >
              <span className="flex items-center gap-1 text-[14px] font-semibold leading-tight text-ink">
                <span className="truncate">{e.title}</span>
                {e.important && <Star size={12} className="shrink-0 fill-warm text-warm" />}
              </span>
              {h >= 44 && (
                <span className="block truncate text-[12px] text-muted">
                  {hhmm(e.occ)}{e.location ? ` · ${e.location}` : ''}{seen ? ' · visto' : ''}
                </span>
              )}
            </button>
          )
        })}

        {isToday && now.getHours() >= first && (
          <div className="pointer-events-none absolute inset-x-0 flex items-center" style={{ top: top(now) }}>
            <span className="ml-[52px] size-2.5 rounded-full bg-warm" />
            <span className="h-[2px] flex-1 bg-warm" />
          </div>
        )}
      </div>
    </div>
  )
}

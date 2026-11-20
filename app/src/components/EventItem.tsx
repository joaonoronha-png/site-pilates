import { Bell, CheckCircle2, MapPin, Repeat, Star } from 'lucide-react'
import { hhmm, sameDay } from '../lib/dates'
import type { AgendaEvent } from '../lib/types'

export type Occ = AgendaEvent & { occ: Date }

export function isConfirmed(e: Occ): boolean {
  return !!e.confirmedAt && sameDay(new Date(e.confirmedAt), e.occ)
}

function alertLabel(min: number | null) {
  const m = min ?? 30
  return m === 0 ? 'na hora' : m < 60 ? `${m} min antes` : `${m / 60}h antes`
}

/** One row of the day's timeline: a dot on the rail, then the card. */
export function EventItem({ e, onOpen, now }: { e: Occ; onOpen: (e: Occ) => void; now: Date }) {
  const past = e.occ.getTime() + e.durationMin * 60000 < now.getTime()
  const live = !past && e.occ <= now
  const seen = isConfirmed(e)
  return (
    <button onClick={() => onOpen(e)} className={`group flex w-full items-start gap-3 py-1.5 text-left ${past ? 'opacity-50' : ''}`}>
      <span className="relative z-[1] mt-[22px] grid w-[30px] shrink-0 place-items-center">
        <span className={`size-[13px] rounded-full border-[3px] border-paper ${seen ? 'bg-glow' : e.important ? 'bg-warm' : past ? 'bg-line' : 'bg-accent'} ${live ? 'ring-4 ring-warm/25' : ''}`} />
      </span>
      <span className={`lift min-w-0 flex-1 rounded-[22px] border bg-card px-4 py-3.5 ${live ? 'border-warm/50 shadow-[0_10px_24px_-16px_rgba(233,154,44,.9)]' : 'border-line'}`}>
        <span className="flex items-baseline justify-between gap-3">
          <span className="flex min-w-0 items-center gap-1.5 text-[17px] font-semibold leading-snug">
            <span className="truncate">{e.title}</span>
            {e.important && <Star size={14} className="shrink-0 fill-warm text-warm" />}
          </span>
          <span className="shrink-0 font-display text-[15px] font-semibold tabular-nums text-accent">{hhmm(e.occ)}</span>
        </span>
        <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] text-muted">
          {e.kind === 'reminder' && <span className="rounded-full bg-paper px-2 py-0.5 font-medium">lembrete</span>}
          {e.location && <span className="flex items-center gap-1"><MapPin size={13} />{e.location}</span>}
          {e.repeat !== 'none' && <span className="flex items-center gap-1"><Repeat size={13} />{e.repeat === 'daily' ? 'todo dia' : e.repeat === 'weekly' ? 'toda semana' : 'todo mês'}</span>}
          {seen
            ? <span className="flex items-center gap-1 font-medium text-accent"><CheckCircle2 size={13} />visto</span>
            : !past && <span className="flex items-center gap-1"><Bell size={13} />{alertLabel(e.alertBefore)}</span>}
        </span>
      </span>
    </button>
  )
}

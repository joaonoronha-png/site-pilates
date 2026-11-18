import { Bell, CheckCircle2, MapPin, Repeat, Star } from 'lucide-react'
import { hhmm, sameDay } from '../lib/dates'
import type { AgendaEvent } from '../lib/types'

export type Occ = AgendaEvent & { occ: Date }

export function isConfirmed(e: Occ): boolean {
  return !!e.confirmedAt && sameDay(new Date(e.confirmedAt), e.occ)
}

export function EventItem({ e, onOpen, now }: { e: Occ; onOpen: (e: Occ) => void; now: Date }) {
  const past = e.occ.getTime() + e.durationMin * 60000 < now.getTime()
  return (
    <button
      onClick={() => onOpen(e)}
      className={`flex w-full items-stretch gap-4 rounded-2xl px-4 py-3.5 text-left transition active:scale-[.99] active:bg-paper ${past ? 'opacity-45' : ''}`}
    >
      <div className="w-14 shrink-0 pt-0.5">
        <div className="text-[17px] font-semibold tabular-nums">{hhmm(e.occ)}</div>
        <div className="text-xs text-muted">{e.kind === 'reminder' ? 'lembrete' : `${e.durationMin} min`}</div>
      </div>
      <div className={`w-1 shrink-0 rounded-full ${e.important ? 'bg-warm' : 'bg-accent/70'}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[17px] font-medium leading-snug">
          <span className="truncate">{e.title}</span>
          {e.important && <Star size={14} className="shrink-0 fill-warm text-warm" />}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          {e.location && <span className="flex items-center gap-1"><MapPin size={13} />{e.location}</span>}
          {e.repeat !== 'none' && <span className="flex items-center gap-1"><Repeat size={13} />{e.repeat === 'daily' ? 'todo dia' : e.repeat === 'weekly' ? 'toda semana' : 'todo mês'}</span>}
          {isConfirmed(e)
            ? <span className="flex items-center gap-1 text-accent"><CheckCircle2 size={13} />visto</span>
            : !past && <span className="flex items-center gap-1"><Bell size={13} />aviso {e.alertBefore === 0 ? 'na hora' : `${e.alertBefore ?? 30} min antes`}</span>}
        </div>
      </div>
    </button>
  )
}

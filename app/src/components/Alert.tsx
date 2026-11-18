import { CalendarClock, CheckCircle2, MapPin } from 'lucide-react'
import { hhmm, relativeDay } from '../lib/dates'
import type { Occ } from './EventItem'

function minutesUntil(e: Occ, now: Date) {
  return Math.max(0, Math.round((e.occ.getTime() - now.getTime()) / 60000))
}

export function alertText(e: Occ, now: Date) {
  const m = minutesUntil(e, now)
  const when = m === 0 ? 'Agora' : m < 60 ? `Daqui a ${m} minutos` : `Às ${hhmm(e.occ)}`
  return `${when} você tem ${e.title}${e.location ? `, em ${e.location}` : ''}.`
}

/** iOS-style banner, as the notification will look on the lock screen. */
export function AlertBanner({ e, now, onOpen }: { e: Occ; now: Date; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="anim-banner fixed inset-x-3 top-[calc(env(safe-area-inset-top)+10px)] z-[60] mx-auto flex max-w-md items-start gap-3 rounded-[22px] bg-white/85 p-3.5 text-left shadow-[0_12px_40px_-10px_rgba(0,0,0,.35)] backdrop-blur-xl"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-accent text-white"><CalendarClock size={22} /></span>
      <span className="min-w-0 flex-1">
        <span className="flex justify-between text-[13px] text-muted"><b className="font-semibold text-ink">AGENDA</b>agora</span>
        <span className="block text-[15px] font-semibold leading-snug">{e.title} às {hhmm(e.occ)}</span>
        <span className="block text-[15px] leading-snug text-ink/80">{alertText(e, now)} Toque para confirmar.</span>
      </span>
    </button>
  )
}

/** Opens when he taps the notification: one big "Vi" button. */
export function AlertScreen({ e, now, onConfirm, onLater }: { e: Occ; now: Date; onConfirm: () => void; onLater: () => void }) {
  const m = minutesUntil(e, now)
  return (
    <div className="anim-fade fixed inset-0 z-[55] flex flex-col bg-accent text-white">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-[calc(env(safe-area-inset-top)+48px)]">
        <p className="text-lg text-white/70">{m === 0 ? 'Está na hora' : `Em ${m} minutos`}</p>
        <h1 className="mt-2 font-display text-[44px] leading-[1.05]">{e.title}</h1>
        <p className="mt-4 text-xl text-white/85">{relativeDay(e.occ, now)}, às {hhmm(e.occ)}</p>
        {e.location && <p className="mt-2 flex items-center gap-2 text-xl text-white/85"><MapPin size={20} />{e.location}</p>}
        <div className="flex-1" />
        <button onClick={onConfirm} className="flex w-full items-center justify-center gap-3 rounded-[28px] bg-white py-6 text-2xl font-semibold text-accent active:scale-[.98]">
          <CheckCircle2 size={30} /> Vi, obrigado
        </button>
        <button onClick={onLater} className="mt-4 w-full py-3 text-lg text-white/75">Lembrar de novo em 5 minutos</button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Bell, CheckCircle2, Phone, Smartphone, Trash2 } from 'lucide-react'
import { hhmm, longDate } from '../lib/dates'
import type { AgendaEvent, Repeat, Settings } from '../lib/types'
import { Sheet, Toggle } from './ui'
import { isConfirmed, type Occ } from './EventItem'

function toLocalInput(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0')
  return { date: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`, time: hhmm(d) }
}

export function EventSheet({ initial, isNew, settings, onSave, onDelete, onConfirm, onClose }: {
  initial: Occ
  isNew: boolean
  settings: Settings
  onSave: (e: AgendaEvent) => void
  onDelete: (id: string) => void
  onConfirm: (id: string) => void
  onClose: () => void
}) {
  const start = new Date(initial.start)
  const [title, setTitle] = useState(initial.title)
  const [date, setDate] = useState(toLocalInput(start).date)
  const [time, setTime] = useState(toLocalInput(start).time)
  const [location, setLocation] = useState(initial.location ?? '')
  const [important, setImportant] = useState(initial.important)
  const [repeat, setRepeat] = useState<Repeat>(initial.repeat)
  const [alertBefore, setAlertBefore] = useState(initial.alertBefore ?? settings.alertBefore)

  const alertAt = new Date(initial.occ.getTime() - alertBefore * 60000)
  const repeatAt = new Date(alertAt.getTime() + settings.repeatAfterMin * 60000)
  const callAt = new Date(repeatAt.getTime() + settings.callAfterMin * 60000)
  const confirmed = isConfirmed(initial)

  function save() {
    const [y, mo, d] = date.split('-').map(Number)
    const [h, mi] = time.split(':').map(Number)
    const s = new Date(y, mo - 1, d, h, mi)
    const changedTime = s.getTime() !== start.getTime()
    onSave({
      ...initial, title: title.trim() || 'Compromisso', start: s.toISOString(), location: location.trim() || undefined,
      important, repeat, alertBefore: alertBefore === settings.alertBefore && initial.alertBefore === null ? null : alertBefore,
      confirmedAt: changedTime ? undefined : initial.confirmedAt,
    })
  }

  const field = 'w-full rounded-2xl bg-card px-4 py-3.5 text-[17px] outline-none ring-accent/30 focus:ring-2'

  return (
    <Sheet onClose={onClose} title={isNew ? 'Novo compromisso' : 'Compromisso'}>
      {!isNew && (
        <div className={`mb-5 rounded-3xl p-4 ${confirmed ? 'bg-accent-soft' : 'bg-warm-soft'}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm text-muted">{longDate(initial.occ)}</div>
              <div className="text-lg font-semibold">{confirmed ? `Visto às ${hhmm(new Date(initial.confirmedAt!))}` : 'Aviso ainda não confirmado'}</div>
            </div>
            {!confirmed && (
              <button onClick={() => onConfirm(initial.id)} className="flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-[17px] font-semibold text-white active:scale-95">
                <CheckCircle2 size={20} /> Vi
              </button>
            )}
          </div>
          {!confirmed && (
            <ol className="mt-4 space-y-2 text-[15px]">
              <li className="flex items-center gap-3"><Bell size={16} className="text-accent" /><b className="w-12 tabular-nums">{hhmm(alertAt)}</b>Notificação no iPhone</li>
              <li className="flex items-center gap-3"><Smartphone size={16} className="text-accent" /><b className="w-12 tabular-nums">{hhmm(repeatAt)}</b>Repete se não confirmar</li>
              {settings.callEnabled && (
                <li className="flex items-center gap-3"><Phone size={16} className="text-warm" /><b className="w-12 tabular-nums">{hhmm(callAt)}</b>Ligação: “aperte 1 para confirmar”</li>
              )}
            </ol>
          )}
        </div>
      )}

      <div className="space-y-3">
        <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="O quê?" aria-label="Título" />
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <input className={field} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Data" />
          <input className={`${field} w-32`} type="time" value={time} onChange={(e) => setTime(e.target.value)} aria-label="Hora" />
        </div>
        <input className={field} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Onde? (opcional)" aria-label="Local" />

        <div className="divide-y divide-line rounded-2xl bg-card">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="font-medium">Importante</div>
              <div className="text-sm text-muted">Liga mesmo no horário de silêncio</div>
            </div>
            <Toggle checked={important} onChange={setImportant} label="Importante" />
          </div>
          <div className="px-4 py-3">
            <div className="mb-2 font-medium">Avisar</div>
            <div className="flex flex-wrap gap-2">
              {[0, 10, 15, 30, 60, 120].map((m) => (
                <button key={m} onClick={() => setAlertBefore(m)} className={`rounded-full px-3.5 py-2 text-[15px] ${alertBefore === m ? 'bg-accent text-white' : 'bg-paper'}`}>
                  {m === 0 ? 'Na hora' : m < 60 ? `${m} min` : `${m / 60}h`}
                </button>
              ))}
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="mb-2 font-medium">Repetir</div>
            <div className="flex flex-wrap gap-2">
              {([['none', 'Não'], ['daily', 'Todo dia'], ['weekly', 'Toda semana'], ['monthly', 'Todo mês']] as const).map(([v, l]) => (
                <button key={v} onClick={() => setRepeat(v)} className={`rounded-full px-3.5 py-2 text-[15px] ${repeat === v ? 'bg-accent text-white' : 'bg-paper'}`}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={save} className="mt-2 w-full rounded-2xl bg-ink py-4 text-[17px] font-semibold text-white active:scale-[.99]">Salvar</button>
        {!isNew && (
          <button onClick={() => onDelete(initial.id)} className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-[16px] font-medium text-danger active:bg-card">
            <Trash2 size={18} /> Cancelar compromisso
          </button>
        )}
      </div>
    </Sheet>
  )
}

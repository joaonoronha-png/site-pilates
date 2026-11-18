export const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
export const MONTHS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

export function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function hhmm(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** "10h", "13h30" — how a person says it */
export function spokenTime(d: Date): string {
  const h = d.getHours()
  const m = d.getMinutes()
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`
}

/** "hoje", "amanhã", "sexta, dia 21" */
export function relativeDay(d: Date, now = new Date()): string {
  const diff = Math.round((startOfDay(d).getTime() - startOfDay(now).getTime()) / 86400000)
  if (diff === 0) return 'hoje'
  if (diff === 1) return 'amanhã'
  if (diff === -1) return 'ontem'
  if (diff > 1 && diff < 7) return `${WEEKDAYS[d.getDay()]}, dia ${d.getDate()}`
  return `dia ${d.getDate()} de ${MONTHS[d.getMonth()]}`
}

export function longDate(d: Date): string {
  const wd = WEEKDAYS[d.getDay()]
  const full = ['domingo', 'sábado'].includes(wd) ? wd : `${wd}-feira`
  return `${full[0].toUpperCase()}${full.slice(1)}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`
}

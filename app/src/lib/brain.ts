/**
 * Demo "brain": understands common Portuguese agenda commands locally.
 * In the real product this is replaced by the Claude API with tools
 * (criar / mudar / cancelar / listar). Same inputs and outputs.
 */
import { addDays, relativeDay, sameDay, spokenTime, startOfDay, WEEKDAYS, MONTHS } from './dates'
import { occurrences, uid } from './store'
import type { AgendaEvent, Settings } from './types'

export type Effect =
  | { type: 'none' }
  | { type: 'create'; event: AgendaEvent }
  | { type: 'update'; id: string; patch: Partial<AgendaEvent> }
  | { type: 'delete'; id: string }
  | { type: 'confirm'; id: string }

export interface Pending {
  kind: 'need-time' | 'confirm-delete'
  draft?: AgendaEvent
  targetId?: string
}

export interface BrainResult {
  reply: string
  effect: Effect
  pending?: Pending
  /** show these events in the reply card */
  list?: (AgendaEvent & { occ: Date })[]
}

interface Ctx {
  events: AgendaEvent[]
  settings: Settings
  now: Date
  pending?: Pending
  lastAlertedId?: string
}

const BOUNDARY = String.raw`(?:(?<![\p{L}\d])(?=[\p{L}\d])|(?<=[\p{L}\d])(?![\p{L}\d]))`
/** Like the regex, but \\b understands accented letters (amanhã, sábado). */
function rx(re: RegExp): RegExp {
  return new RegExp(re.source.replaceAll(String.raw`\b`, BOUNDARY), re.flags + "u")
}

const NUM_WORDS: Record<string, number> = {
  uma: 1, um: 1, duas: 2, dois: 2, três: 3, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7,
  oito: 8, nove: 9, dez: 10, onze: 11, doze: 12, treze: 13, catorze: 14, quatorze: 14,
  quinze: 15, dezesseis: 16, dezessete: 17, dezoito: 18, dezenove: 19, vinte: 20,
}

function normCase(s: string): string {
  return s
    .replace(/[.,!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** The title is found in lowercased text; take the speaker's own capitals (names) back from the original. */
function restoreCase(title: string, original: string): string {
  if (!title) return title
  const i = original.toLowerCase().indexOf(title.toLowerCase())
  const t = i === -1 ? title : original.slice(i, i + title.length)
  return t[0].toUpperCase() + t.slice(1)
}

function wordsToDigits(s: string): string {
  return s.replace(rx(/\b(uma|um|duas|dois|tr[eê]s|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|q?u?atorze|catorze|quinze|dezesseis|dezessete|dezoito|dezenove|vinte)\b(?=\s*(h\b|horas?|da |e meia|e quinze))/gi),
    (w) => String(NUM_WORDS[w.toLowerCase()] ?? w))
}

interface TimeHit { h: number; m: number; match: string }

export function parseTime(t: string): TimeHit | null {
  if (rx(/\bmeio[- ]dia\b/).test(t)) return { h: 12, m: 0, match: t.match(/(às |as |ao )?meio[- ]dia( e meia)?/)![0] }
  if (rx(/\bmeia[- ]noite\b/).test(t)) return { h: 0, m: 0, match: t.match(/(à |a )?meia[- ]noite/)![0] }
  const re = rx(/(?:\b(?:às|as|a|pras|para as|pelas)\s+)?\b(\d{1,2})(?:\s*(?::|h|horas?)\s*(\d{2})?|\s*(?=da (?:manhã|tarde|noite)|e meia))(?:\s*e meia)?(?:\s*da (manhã|tarde|noite))?/)
  const m = t.match(re)
  if (!m) return null
  let h = Number(m[1])
  let min = m[2] ? Number(m[2]) : 0
  if (/e meia/.test(m[0])) min = 30
  const period = m[3]
  if (h > 23 || min > 59) return null
  if (period === 'tarde' || period === 'noite') { if (h < 12) h += 12 }
  else if (period !== 'manhã' && h >= 1 && h <= 6) h += 12 // "dia 20 à 1h" = 13h
  return { h, m: min, match: m[0] }
}

interface DateHit { date: Date; match: string }

export function parseDate(t: string, now: Date): DateHit | null {
  const today = startOfDay(now)
  let m: RegExpMatchArray | null
  if ((m = t.match(rx(/\bdepois de amanhã\b/)))) return { date: addDays(today, 2), match: m[0] }
  if ((m = t.match(rx(/\bamanhã\b/)))) return { date: addDays(today, 1), match: m[0] }
  if ((m = t.match(rx(/\bhoje\b/)))) return { date: today, match: m[0] }
  if ((m = t.match(rx(/\b(?:dia\s+)?(\d{1,2})\s*(?:\/|de\s+)(\d{1,2}|janeiro|fevereiro|março|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\b/)))) {
    const day = Number(m[1])
    const mon = /\d/.test(m[2]) ? Number(m[2]) - 1 : MONTHS.indexOf(m[2].replace('marco', 'março'))
    const d = new Date(today.getFullYear(), mon, day)
    if (d < today) d.setFullYear(d.getFullYear() + 1)
    return { date: d, match: m[0] }
  }
  if ((m = t.match(rx(/\bdia\s+(\d{1,2})\b/)))) {
    const day = Number(m[1])
    const d = new Date(today.getFullYear(), today.getMonth(), day)
    if (d < today) d.setMonth(d.getMonth() + 1)
    return { date: d, match: m[0] }
  }
  const wd = t.match(rx(/\b(?:na |no |nesta |neste |próxima |proxima |próximo |proximo )?(domingo|segunda|terça|terca|quarta|quinta|sexta|sábado|sabado)(?:-feira| feira)?\b/))
  if (wd) {
    const name = wd[1].replace('terca', 'terça').replace('sabado', 'sábado')
    const target = WEEKDAYS.indexOf(name)
    let diff = (target - today.getDay() + 7) % 7
    if (diff === 0) diff = 7
    return { date: addDays(today, diff), match: wd[0] }
  }
  return null
}

function combine(date: Date | null, time: TimeHit | null, now: Date): Date | null {
  if (!time) return null
  const d = new Date(date ?? startOfDay(now))
  d.setHours(time.h, time.m, 0, 0)
  if (!date && d < now) d.setDate(d.getDate() + 1) // "às 9h" já passou → amanhã
  return d
}

function cleanTitle(raw: string, remove: string[]): string {
  let t = ` ${raw} `
  for (const r of remove) if (r) t = t.replace(r, ' ')
  t = t
    .replace(rx(/\b(por favor|pra mim|para mim|na agenda|um compromisso|compromisso de|compromisso)\b/g), ' ')
    .replace(/^\s*(de|do|da|que|pra|para|uma?|o|a)\s+/, ' ')
    .replace(/\s+(de|do|da|no|na|em|às|as|para|pra)\s*$/, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return t ? t[0].toUpperCase() + t.slice(1) : ''
}

function describe(ev: { title: string }, when: Date, now: Date): string {
  return `${ev.title}, ${relativeDay(when, now)}, às ${spokenTime(when)}`
}

function findTarget(t: string, ctx: Ctx): (AgendaEvent & { occ: Date }) | null {
  const from = startOfDay(ctx.now)
  const occ = occurrences(ctx.events, addDays(from, -1), addDays(from, 60))
  const date = parseDate(t, ctx.now)
  const time = parseTime(t)
  let pool = occ
  if (date) pool = pool.filter((o) => sameDay(o.occ, date.date))
  if (time) pool = pool.filter((o) => o.occ.getHours() === time.h && o.occ.getMinutes() === time.m)
  const words = t.split(' ').filter((w) => w.length > 3 && !['compromisso', 'reunião', 'muda', 'mudar', 'cancela', 'cancelar', 'desmarca', 'remarca', 'para'].includes(w))
  const scored = pool
    .map((o) => ({ o, s: words.filter((w) => o.title.toLowerCase().includes(w)).length }))
    .sort((a, b) => b.s - a.s)
  if (scored.length && (scored[0].s > 0 || date || time)) return scored[0].o
  // title-only match across all
  const byTitle = occ
    .map((o) => ({ o, s: words.filter((w) => o.title.toLowerCase().includes(w)).length }))
    .filter((x) => x.s > 0 && x.o.occ >= ctx.now)
    .sort((a, b) => b.s - a.s)
  return byTitle[0]?.o ?? null
}

function dayList(ctx: Ctx, day: Date) {
  const from = startOfDay(day)
  return occurrences(ctx.events, from, addDays(from, 1))
}

function summarizeDay(list: (AgendaEvent & { occ: Date })[]): string {
  if (!list.length) return 'nenhum compromisso'
  const parts = list.map((e) => `${e.title} às ${spokenTime(e.occ)}`)
  if (parts.length === 1) return `um compromisso: ${parts[0]}`
  return `${list.length} compromissos: ${parts.slice(0, -1).join(', ')} e ${parts.at(-1)}`
}

export function greeting(now: Date): string {
  const h = now.getHours()
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
}

export function morningBrief(ctx: Ctx, weather?: string): BrainResult {
  const today = dayList(ctx, ctx.now).filter((e) => e.occ >= ctx.now)
  const tomorrow = dayList(ctx, addDays(ctx.now, 1))
  const name = ctx.settings.name ? `, ${ctx.settings.name}` : ''
  const w = weather ? ` ${weather}` : ''
  const reply = `${greeting(ctx.now)}${name}.${w} Hoje você ainda tem ${summarizeDay(today)}. Amanhã, ${summarizeDay(tomorrow)}.`
  return { reply, effect: { type: 'none' }, list: today }
}

export function interpret(input: string, ctx: Ctx, weather?: string): BrainResult {
  const original = wordsToDigits(normCase(input))
  const t = original.toLowerCase()
  const none: Effect = { type: 'none' }

  // ---- follow-ups to a pending question
  if (ctx.pending?.kind === 'need-time' && ctx.pending.draft) {
    const time = parseTime(t)
    if (time) {
      const date = parseDate(t, ctx.now)
      const base = date?.date ?? new Date(ctx.pending.draft.start)
      const when = combine(startOfDay(base), time, ctx.now)!
      const event = { ...ctx.pending.draft, start: when.toISOString() }
      return { reply: `Pronto. Marquei ${describe(event, when, ctx.now)}.`, effect: { type: 'create', event } }
    }
    if (rx(/\b(deixa|esquece|cancela|não)\b/).test(t)) return { reply: 'Tudo bem, não marquei nada.', effect: none }
  }
  if (ctx.pending?.kind === 'confirm-delete' && ctx.pending.targetId) {
    if (rx(/\b(sim|pode|isso|confirma|claro)\b/).test(t)) return { reply: 'Cancelado.', effect: { type: 'delete', id: ctx.pending.targetId } }
    if (rx(/\b(não|nao|deixa)\b/).test(t)) return { reply: 'Ok, mantive o compromisso.', effect: none }
  }

  // ---- confirm alert
  if (/^(ok |tá |ta )?(vi|já vi|ja vi|visto|confirmado|ok vi|entendi)$/.test(t) && ctx.lastAlertedId) {
    return { reply: 'Anotado, você confirmou o aviso.', effect: { type: 'confirm', id: ctx.lastAlertedId } }
  }

  // ---- greeting / brief
  if (rx(/\b(bom dia|boa tarde|boa noite|como (está|ta|tá) (o )?meu dia|resumo do dia)\b/).test(t)) {
    return morningBrief(ctx, weather)
  }

  // ---- query
  if (rx(/\b(o que|que) (eu )?(tenho|tem)\b|\bminha agenda\b|\bmeus compromissos\b|\bqual (é )?(o )?(meu )?próximo\b|\bpróximo compromisso\b/).test(t)) {
    if (/próximo/.test(t)) {
      const next = occurrences(ctx.events, ctx.now, addDays(ctx.now, 60))[0]
      if (!next) return { reply: 'Você não tem nenhum compromisso pela frente.', effect: none }
      return { reply: `O próximo é ${describe(next, next.occ, ctx.now)}.`, effect: none, list: [next] }
    }
    const date = parseDate(t, ctx.now)?.date ?? ctx.now
    const list = dayList(ctx, date)
    const label = relativeDay(date, ctx.now)
    const capital = label[0].toUpperCase() + label.slice(1)
    return { reply: `${capital} você tem ${summarizeDay(list)}.`, effect: none, list }
  }

  // ---- cancel
  if (rx(/\b(cancela|cancelar|desmarca|desmarcar|apaga|apagar|remove|tira)\b/).test(t)) {
    const target = findTarget(t, ctx)
    if (!target) return { reply: 'Não encontrei esse compromisso. Pode me dizer o dia e a hora?', effect: none }
    return {
      reply: `Quer mesmo cancelar ${describe(target, target.occ, ctx.now)}?`,
      effect: none,
      pending: { kind: 'confirm-delete', targetId: target.id },
      list: [target],
    }
  }

  // ---- change
  if (rx(/\b(muda|mudar|remarca|remarcar|altera|alterar|troca|trocar|passa|passar|adia|adiar|antecipa)\b/).test(t)) {
    const split = t.lastIndexOf(' para ') !== -1 ? t.lastIndexOf(' para ') : t.lastIndexOf(' pra ')
    const left = split > -1 ? t.slice(0, split) : t
    const right = split > -1 ? t.slice(split).replace(/^ (para|pra) /, '') : ''
    const target = findTarget(left, ctx)
    if (!target) return { reply: 'Não encontrei esse compromisso. Qual o dia e a hora dele?', effect: none }
    const nd = parseDate(right, ctx.now)
    const nt = parseTime(right)
    const old = new Date(target.start)
    const patch: Partial<AgendaEvent> = {}
    if (nd || nt) {
      const d = new Date(nd ? nd.date : old)
      d.setHours(nt ? nt.h : old.getHours(), nt ? nt.m : old.getMinutes(), 0, 0)
      patch.start = d.toISOString()
      patch.confirmedAt = undefined
    }
    const newTitle = restoreCase(cleanTitle(right, [nd?.match ?? '', nt?.match ?? '']), original)
    if (newTitle && !/^(as|às|o dia|dia)$/.test(newTitle.toLowerCase())) patch.title = newTitle
    if (!Object.keys(patch).length) return { reply: `Para quando você quer mudar ${target.title}?`, effect: none, list: [target] }
    const merged = { ...target, ...patch }
    const when = new Date(merged.start)
    return { reply: `Feito. Agora ficou ${describe(merged, when, ctx.now)}.`, effect: { type: 'update', id: target.id, patch } }
  }

  // ---- create / remind
  const isRemind = rx(/\b(me lembra|me lembre|lembrete|lembrar)\b/).test(t)
  if (isRemind || rx(/\b(marca|marcar|marque|agenda|agendar|coloca|colocar|anota|anotar|cria|criar|tenho)\b/).test(t)) {
    const date = parseDate(t, ctx.now)
    const time = parseTime(t)
    const repeat: AgendaEvent['repeat'] = rx(/\btodo dia\b|\btodos os dias\b/).test(t) ? 'daily'
      : rx(/\btoda (segunda|terça|quarta|quinta|sexta|semana)|todo (sábado|domingo)\b/).test(t) ? 'weekly'
      : rx(/\btodo mês\b|\btodo dia \d+\b/).test(t) ? 'monthly' : 'none'
    const important = rx(/\bimportante\b/).test(t)
    const title = restoreCase(cleanTitle(t, [
      date?.match ?? '', time?.match ?? '',
    ].concat(
      (t.match(rx(/\b(me lembra de|me lembra|me lembre de|me lembre|lembrete de|lembrete|marca uma?|marca|marcar|marque|agenda|agendar|coloca|colocar|anota|anotar|cria|criar|eu tenho|tenho)\b/g)) ?? []),
      ['todos os dias', 'todo dia', 'toda semana', 'todo mês', 'é importante', 'importante', 'toda', 'todo'],
    )), original)
    if (!title) return { reply: 'O que você quer que eu marque?', effect: none }
    const draft: AgendaEvent = {
      id: uid(), title, start: (date?.date ?? startOfDay(ctx.now)).toISOString(), durationMin: isRemind ? 15 : 60,
      important, repeat, alertBefore: isRemind ? 0 : null, kind: isRemind ? 'reminder' : 'event',
    }
    const when = combine(date?.date ?? null, time, ctx.now)
    if (!when) {
      return { reply: `${title}, ${date ? relativeDay(date.date, ctx.now) : 'hoje'}. Que horas?`, effect: none, pending: { kind: 'need-time', draft } }
    }
    const event = { ...draft, start: when.toISOString() }
    const rep = repeat === 'daily' ? ', todos os dias' : repeat === 'weekly' ? ', toda semana' : repeat === 'monthly' ? ', todo mês' : ''
    const verb = isRemind ? 'Vou te lembrar de' : 'Pronto. Marquei'
    const t2 = isRemind ? event.title.charAt(0).toLowerCase() + event.title.slice(1) : event.title
    return { reply: `${verb} ${t2}, ${relativeDay(when, ctx.now)}, às ${spokenTime(when)}${rep}.`, effect: { type: 'create', event } }
  }

  return {
    reply: 'Não entendi bem. Você pode dizer, por exemplo: "marca dentista sexta às 10h", ou "o que eu tenho amanhã?".',
    effect: none,
  }
}

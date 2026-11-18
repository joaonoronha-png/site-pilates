import { describe, expect, it } from 'vitest'
import { interpret, parseTime, parseDate } from './brain'
import { DEFAULT_SETTINGS, type AgendaEvent } from './types'

// Wednesday 18 Nov 2026, 08:00
const now = new Date(2026, 10, 18, 8, 0)
const ev = (title: string, d: Date): AgendaEvent => ({ id: title, title, start: d.toISOString(), durationMin: 60, important: false, repeat: 'none', alertBefore: null, kind: 'event' })
const ctx = (events: AgendaEvent[] = []) => ({ events, settings: DEFAULT_SETTINGS, now })

describe('time', () => {
  it.each([
    ['às 10h', 10, 0], ['10h30', 10, 30], ['às 13:15', 13, 15], ['às 3 da tarde', 15, 0],
    ['meio-dia', 12, 0], ['às 1h', 13, 0], ['às 7 da manhã', 7, 0], ['às 9 e meia', 9, 30],
  ])('%s', (s, h, m) => expect(parseTime(s)).toMatchObject({ h, m }))
})

describe('date', () => {
  it('amanhã', () => expect(parseDate('amanhã', now)!.date.getDate()).toBe(19))
  it('sexta', () => expect(parseDate('sexta', now)!.date.getDate()).toBe(20))
  it('dia 20', () => expect(parseDate('dia 20', now)!.date.getDate()).toBe(20))
  it('dia 5 → next month', () => expect(parseDate('dia 5', now)!.date.getMonth()).toBe(11))
  it('20 de dezembro', () => expect(parseDate('20 de dezembro', now)!.date.getMonth()).toBe(11))
})

describe('interpret', () => {
  it('creates', () => {
    const r = interpret('marca dentista sexta às 10h', ctx())
    expect(r.effect.type).toBe('create')
    if (r.effect.type !== 'create') return
    expect(r.effect.event.title).toBe('Dentista')
    expect(new Date(r.effect.event.start)).toEqual(new Date(2026, 10, 20, 10, 0))
    expect(r.reply).toContain('sexta')
  })
  it('keeps "com o Carlos"', () => {
    const r = interpret('marca reunião com o Carlos amanhã às 3 da tarde', ctx())
    expect(r.effect.type === 'create' && r.effect.event.title).toBe('Reunião com o Carlos')
  })
  it('asks time when missing, then fills', () => {
    const r = interpret('marca dentista sexta', ctx())
    expect(r.pending?.kind).toBe('need-time')
    const r2 = interpret('às 10h', { ...ctx(), pending: r.pending })
    expect(r2.effect.type === 'create' && new Date(r2.effect.event.start)).toEqual(new Date(2026, 10, 20, 10, 0))
  })
  it('reminder', () => {
    const r = interpret('me lembra às 18h de ligar pro Carlos', ctx())
    expect(r.effect.type === 'create' && r.effect.event.title).toBe('Ligar pro Carlos')
  })
  it('weekly repeat', () => {
    const r = interpret('marca reunião de equipe toda segunda às 9h', ctx())
    expect(r.effect.type === 'create' && r.effect.event.repeat).toBe('weekly')
  })
  it('changes time', () => {
    const e = ev('Reunião', new Date(2026, 10, 20, 13, 0))
    const r = interpret('muda o compromisso do dia 20 às 13h para as 15h', ctx([e]))
    expect(r.effect).toMatchObject({ type: 'update', id: 'Reunião' })
    if (r.effect.type === 'update') expect(new Date(r.effect.patch.start!).getHours()).toBe(15)
  })
  it('cancels with confirmation', () => {
    const e = ev('Dentista', new Date(2026, 10, 20, 10, 0))
    const r = interpret('cancela o dentista', ctx([e]))
    expect(r.pending?.kind).toBe('confirm-delete')
    expect(interpret('sim', { ...ctx([e]), pending: r.pending }).effect).toEqual({ type: 'delete', id: 'Dentista' })
  })
  it('lists tomorrow', () => {
    const r = interpret('o que eu tenho amanhã?', ctx([ev('Dentista', new Date(2026, 10, 19, 10, 0))]))
    expect(r.reply).toBe('Amanhã você tem um compromisso: Dentista às 10h.')
  })
})

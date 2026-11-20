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
    expect(r.reply).toBe('Amanhã você tem um compromisso: Dentista às 10 horas.')
  })
  it('clear reply with name', () => {
    const r = interpret('marca dentista sexta às 10h', { ...ctx(), settings: { ...DEFAULT_SETTINGS, name: 'João' } })
    expect(r.reply).toBe('Pronto, senhor João. Marquei Dentista para sexta, dia 20, às 10 horas. Vou te avisar 30 minutos antes.')
  })
  it('alert inside the command', () => {
    const r = interpret('marca dentista sexta às 10h e me avisa 10 minutos antes', ctx())
    expect(r.effect.type === 'create' && r.effect.event.alertBefore).toBe(10)
    expect(r.effect.type === 'create' && r.effect.event.title).toBe('Dentista')
    expect(r.effect.type === 'create' && new Date(r.effect.event.start).getHours()).toBe(10)
    expect(r.reply).toContain('Vou te avisar 10 minutos antes.')
  })
  it('alert of 1 hora does not become the time', () => {
    const r = interpret('marca reunião amanhã às 9h e me avisa 1 hora antes', ctx())
    expect(r.effect.type === 'create' && r.effect.event.alertBefore).toBe(60)
    expect(r.effect.type === 'create' && new Date(r.effect.event.start).getHours()).toBe(9)
  })
  it('alert as a follow-up', () => {
    const e = ev('Dentista', new Date(2026, 10, 20, 10, 0))
    const r = interpret('me avisa 10 minutos antes', { ...ctx([e]), lastEventId: 'Dentista' })
    expect(r.effect).toEqual({ type: 'update', id: 'Dentista', patch: { alertBefore: 10, confirmedAt: undefined } })
    expect(r.reply).toBe('Pronto, senhor. Vou te avisar 10 minutos antes de Dentista.')
  })
  it('change reply', () => {
    const e = ev('Reunião', new Date(2026, 10, 20, 13, 0))
    const r = interpret('muda a reunião do dia 20 para as 15h', ctx([e]))
    expect(r.reply).toBe('Pronto, senhor. Ajustei Reunião para sexta, dia 20, às 15 horas. Vou te avisar 30 minutos antes.')
  })
})

describe('reminder without "antes" is not an alert', () => {
  it('me lembra 18 horas de ligar', () => {
    const r = interpret('me lembra 18 horas de ligar pro Carlos', { events: [], settings: DEFAULT_SETTINGS, now: new Date(2026, 10, 18, 8, 0) })
    expect(r.effect.type === 'create' && new Date(r.effect.event.start).getHours()).toBe(18)
  })
})

describe('agenda smarts', () => {
  const now = new Date(2026, 10, 18, 8, 0)
  const mk = (title: string, d: Date): AgendaEvent => ({ id: title, title, start: d.toISOString(), durationMin: 60, important: false, repeat: 'none', alertBefore: null, kind: 'event' })
  const c = (events: AgendaEvent[]) => ({ events, settings: DEFAULT_SETTINGS, now })
  it('warns about a clash', () => {
    const r = interpret('marca reunião amanhã às 12h30', c([mk('Almoço com o Carlos', new Date(2026, 10, 19, 12, 0))]))
    expect(r.effect.type).toBe('create')
    expect(r.reply).toContain('Atenção: nesse horário você também tem Almoço com o Carlos, às 12 horas.')
  })
  it('no warning when free', () => {
    const r = interpret('marca reunião amanhã às 15h', c([mk('Almoço', new Date(2026, 10, 19, 12, 0))]))
    expect(r.reply).not.toContain('Atenção')
  })
  it('free at a time', () => {
    expect(interpret('estou livre amanhã às 15h?', c([])).reply).toBe('Sim, amanhã, às 15 horas você está livre.')
    expect(interpret('estou livre amanhã às 12h30?', c([mk('Almoço', new Date(2026, 10, 19, 12, 0))])).reply).toBe('Não. Amanhã, às 12 e 30 você tem Almoço.')
  })
  it('free day', () => {
    expect(interpret('tenho algo sexta?', c([])).reply).toBe('Sim, sexta, dia 20 você está com o dia livre.')
  })
})

import { LogOut, Type, Bell, Mic, Moon, Phone, RotateCcw, Sun, User, Volume2, MapPin, BellRing } from 'lucide-react'
import type { Settings } from '../lib/types'
import { Card, Row, Stepper, Toggle } from './ui'

export function SettingsView({ s, set, onSimulate, onReset }: {
  s: Settings
  set: (s: Settings) => void
  onSimulate: () => void
  onReset: () => void
}) {
  const up = <K extends keyof Settings>(k: K, v: Settings[K]) => set({ ...s, [k]: v })
  const label = 'px-4 pb-2 pt-6 text-sm font-medium uppercase tracking-wider text-muted'
  return (
    <div className="pb-8">
      <h1 className="font-display text-[32px] font-semibold tracking-[-0.02em]">Ajustes</h1>

      <div className={label}>Você</div>
      <Card className="divide-y divide-line">
        <Row icon={<User size={20} />} label="Como te chamo">
          <input value={s.name} onChange={(e) => up('name', e.target.value)} placeholder="ex.: Seu João" className="w-36 rounded-xl bg-paper px-3 py-2 text-right outline-none" />
        </Row>
        <Row icon={<Mic size={20} />} label="Nome do assistente">
          <input id="set-assistant" value={s.assistant} onChange={(e) => up('assistant', e.target.value)} className="w-36 rounded-xl bg-paper px-3 py-2 text-right outline-none" />
        </Row>
        <Row icon={<Type size={20} />} label="Letra grande" hint="Aumenta tudo na tela">
          <Toggle checked={s.bigText} onChange={(v) => up('bigText', v)} label="Letra grande" />
        </Row>
        <Row icon={<MapPin size={20} />} label="Cidade (clima)">
          <input value={s.city} onChange={(e) => up('city', e.target.value)} className="w-36 rounded-xl bg-paper px-3 py-2 text-right outline-none" />
        </Row>
      </Card>

      <div className={label}>Avisos</div>
      <Card className="divide-y divide-line">
        <Row icon={<Bell size={20} />} label="Avisar antes" hint="Padrão para novos compromissos">
          <Stepper value={s.alertBefore} onChange={(v) => up('alertBefore', v)} min={0} max={120} step={5} suffix=" min" />
        </Row>
        <Row icon={<BellRing size={20} />} label="Repetir se não confirmar" hint="Manda a notificação de novo">
          <Stepper value={s.repeatAfterMin} onChange={(v) => up('repeatAfterMin', v)} min={1} max={30} suffix=" min" />
        </Row>
        <Row icon={<Phone size={20} />} label="Ligar se ainda não confirmar" hint={s.callEnabled ? `${s.callAfterMin} min depois da repetição` : 'Desligado'}>
          <Toggle checked={s.callEnabled} onChange={(v) => up('callEnabled', v)} label="Ligação" />
        </Row>
        {s.callEnabled && (
          <Row label="Esperar antes de ligar">
            <Stepper value={s.callAfterMin} onChange={(v) => up('callAfterMin', v)} min={1} max={30} suffix=" min" />
          </Row>
        )}
        <Row icon={<Moon size={20} />} label="Silêncio (sem ligação)" hint="Compromissos importantes ligam mesmo assim">
          <span className="text-[15px] font-medium tabular-nums">{s.quietStart}h – {s.quietEnd}h</span>
        </Row>
        <Row icon={<Volume2 size={20} />} label="Falar o aviso em voz alta" hint="Com o app aberto, fone ou carro">
          <Toggle checked={s.speakAlerts} onChange={(v) => up('speakAlerts', v)} label="Falar aviso" />
        </Row>
      </Card>

      <div className={label}>Bom dia</div>
      <Card className="divide-y divide-line">
        <Row icon={<Sun size={20} />} label="Resumo do dia" hint="Agenda + clima, toda manhã">
          <Toggle checked={s.morningBrief} onChange={(v) => up('morningBrief', v)} label="Bom dia" />
        </Row>
        {s.morningBrief && (
          <Row label="Horário">
            <Stepper value={s.morningHour} onChange={(v) => up('morningHour', v)} min={5} max={11} suffix="h" />
          </Row>
        )}
      </Card>

      <div className={label}>Falar sem abrir o app</div>
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-[#5b6cff] via-[#c04cf0] to-[#ff5a6e] text-white"><Mic size={24} /></span>
          <div>
            <div className="text-lg font-semibold">“{s.assistant || 'Jarvis'}”</div>
            <div className="text-sm text-muted">Sem abrir o app, nem tocar no celular</div>
          </div>
        </div>
        <ol className="mt-4 space-y-2.5 text-[15px] leading-snug">
          <li><b>1.</b> Toque em <b>Instalar atalho</b> e depois em <b>Adicionar atalho</b>.</li>
          <li><b>2.</b> No iPhone: Ajustes › Acessibilidade › <b>Atalhos Vocais</b>. Escolha o atalho e grave <b>“{s.assistant || 'Jarvis'}”</b> três vezes.</li>
          <li><b>3.</b> Pronto: diga <b>“{s.assistant || 'Jarvis'}”</b> e fale o pedido. A resposta vem em voz alta.</li>
        </ol>
        <p className="mt-3 rounded-2xl bg-paper p-3 text-sm text-muted">Dica: no iPhone dá para ligar o atalho em <b>dois toquinhos atrás do celular</b> (Ajustes › Acessibilidade › Toque › Toque Atrás).</p>
        <button disabled className="mt-4 w-full rounded-2xl bg-ink/90 py-3.5 font-semibold text-white opacity-60">Instalar atalho (na versão final)</button>
      </Card>

      <div className={label}>Demonstração</div>
      <Card className="divide-y divide-line">
        <button onClick={onSimulate} className="flex w-full items-center gap-3 px-4 py-4 text-left font-medium text-accent"><BellRing size={20} />Simular um aviso agora</button>
        <button onClick={() => set({ ...s, account: '', onboarded: false })} className="flex w-full items-center gap-3 px-4 py-4 text-left font-medium text-danger"><LogOut size={20} />Sair da conta{s.account && s.account !== 'google' ? ` (${s.account})` : ''}</button>
        <button onClick={() => set({ ...s, onboarded: false })} className="flex w-full items-center gap-3 px-4 py-4 text-left font-medium text-accent"><Sun size={20} />Ver a apresentação de novo</button>
        <button onClick={onReset} className="flex w-full items-center gap-3 px-4 py-4 text-left font-medium text-muted"><RotateCcw size={20} />Restaurar agenda de exemplo</button>
      </Card>
    </div>
  )
}

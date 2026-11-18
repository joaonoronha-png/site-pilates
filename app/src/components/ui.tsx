import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export function Sheet({ onClose, children, title }: { onClose: () => void; children: ReactNode; title?: string }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <button aria-label="Fechar" className="anim-fade absolute inset-0 bg-ink/35" onClick={onClose} />
      <div className="anim-sheet relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-paper px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-3 shadow-2xl">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">{title}</h2>
          <button onClick={onClose} className="grid size-10 place-items-center rounded-full bg-card text-muted active:scale-95" aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-[52px] shrink-0 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-line'}`}
    >
      <span className={`absolute left-0 top-1 size-6 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[24px]' : 'translate-x-1'}`} />
    </button>
  )
}

export function Row({ icon, label, hint, children }: { icon?: ReactNode; label: string; hint?: string; children?: ReactNode }) {
  return (
    <div className="flex min-h-14 items-center gap-3 px-4 py-3">
      {icon && <span className="text-accent">{icon}</span>}
      <div className="min-w-0 flex-1">
        <div className="text-[16px] font-medium">{label}</div>
        {hint && <div className="text-sm text-muted">{hint}</div>}
      </div>
      {children}
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-card shadow-[0_1px_0_rgba(0,0,0,.04),0_8px_24px_-16px_rgba(0,0,0,.18)] ${className}`}>{children}</div>
}

export function Stepper({ value, onChange, min, max, step = 1, suffix }: { value: number; onChange: (v: number) => void; min: number; max: number; step?: number; suffix: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-paper p-1">
      <button className="grid size-8 place-items-center rounded-full bg-card text-lg active:scale-95" onClick={() => onChange(Math.max(min, value - step))} aria-label="Diminuir">−</button>
      <span className="min-w-14 text-center text-sm font-semibold tabular-nums">{value}{suffix}</span>
      <button className="grid size-8 place-items-center rounded-full bg-card text-lg active:scale-95" onClick={() => onChange(Math.min(max, value + step))} aria-label="Aumentar">+</button>
    </div>
  )
}

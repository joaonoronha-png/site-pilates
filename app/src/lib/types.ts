export type Repeat = 'none' | 'daily' | 'weekly' | 'monthly'

export type AlertChannel = 'notification' | 'call'

export interface AgendaEvent {
  id: string
  title: string
  /** ISO string */
  start: string
  durationMin: number
  location?: string
  important: boolean
  repeat: Repeat
  /** minutes before start to alert; null = use default */
  alertBefore: number | null
  /** ISO string of when he confirmed he saw the alert */
  confirmedAt?: string
  kind: 'event' | 'reminder'
}

export interface Settings {
  assistant: string
  onboarded: boolean
  bigText: boolean
  name: string
  city: string
  alertBefore: number
  repeatAfterMin: number
  callAfterMin: number
  callEnabled: boolean
  quietStart: number
  quietEnd: number
  morningBrief: boolean
  morningHour: number
  speakAlerts: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  assistant: 'Jarvis',
  onboarded: false,
  bigText: false,
  name: '',
  city: 'São Paulo',
  alertBefore: 30,
  repeatAfterMin: 5,
  callAfterMin: 10,
  callEnabled: true,
  quietStart: 22,
  quietEnd: 7,
  morningBrief: true,
  morningHour: 7,
  speakAlerts: true,
}

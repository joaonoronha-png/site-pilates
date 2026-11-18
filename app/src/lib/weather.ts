export interface Weather {
  now: number
  min: number
  max: number
  rain: number
  label: string
}

const CODES: [number[], string][] = [
  [[0], 'céu limpo'],
  [[1, 2], 'poucas nuvens'],
  [[3], 'nublado'],
  [[45, 48], 'neblina'],
  [[51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], 'chuva'],
  [[95, 96, 99], 'tempestade'],
]

/** Open-Meteo: free, no key. */
export async function fetchWeather(city: string): Promise<Weather | null> {
  try {
    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&country=BR`).then((r) => r.json())
    const p = geo?.results?.[0]
    if (!p) return null
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.latitude}&longitude=${p.longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FSao_Paulo&forecast_days=1`
    const f = await fetch(url).then((r) => r.json())
    const code: number = f.current.weather_code
    return {
      now: Math.round(f.current.temperature_2m),
      min: Math.round(f.daily.temperature_2m_min[0]),
      max: Math.round(f.daily.temperature_2m_max[0]),
      rain: f.daily.precipitation_probability_max[0] ?? 0,
      label: CODES.find(([c]) => c.includes(code))?.[1] ?? 'tempo variável',
    }
  } catch {
    return null
  }
}

export function weatherSentence(w: Weather | null, city: string): string | undefined {
  if (!w) return undefined
  return `Em ${city} agora faz ${w.now} graus, ${w.label}. Hoje vai de ${w.min} a ${w.max}, com ${w.rain}% de chance de chuva.`
}

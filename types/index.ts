export interface Mouse {
  radius: number
  x: number | null
  y: number | null
}

export interface EffectConfig {
  gap: number
  friction: number
  ease: number
  mouseRadius: number
}

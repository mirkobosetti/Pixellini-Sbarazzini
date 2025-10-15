import type { Effect } from './effect'

export class Particle {
  effect: Effect
  x: number
  y: number
  originX: number
  originY: number
  color: string
  size: number
  vx: number
  vy: number
  friction: number
  ease: number
  dx: number
  dy: number
  distance: number
  force: number
  angle: number

  constructor(effect: Effect, x: number, y: number, color: string) {
    this.effect = effect
    this.x = Math.random() * this.effect.width
    this.y = Math.random() * this.effect.height
    this.originX = Math.floor(x)
    this.originY = Math.floor(y)
    this.color = color
    this.size = this.effect.gap
    this.vx = 0
    this.vy = 0
    this.friction = this.effect.config.friction
    this.ease = this.effect.config.ease
    this.dx = 0
    this.dy = 0
    this.distance = 0
    this.force = 0
    this.angle = 0
  }

  updateConfig(): void {
    this.friction = this.effect.config.friction
    this.ease = this.effect.config.ease
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.size, this.size)
  }

  update(): void {
    this.dx = this.effect.mouse.x! - this.x
    this.dy = this.effect.mouse.y! - this.y
    this.distance = this.dx * this.dx + this.dy * this.dy
    this.force = -this.effect.mouse.radius / this.distance

    if (this.distance < this.effect.mouse.radius) {
      this.angle = Math.atan2(this.dy, this.dx)
      this.vx += this.force * Math.cos(this.angle)
      this.vy += this.force * Math.sin(this.angle)
    }

    this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease
    this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease
  }

  warp(): void {
    this.x = Math.random() * this.effect.width
    this.y = Math.random() * this.effect.height
  }
}

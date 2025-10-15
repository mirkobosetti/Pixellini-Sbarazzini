import type { Mouse } from '../types'
import { Particle } from './particle'

export class Effect {
  width: number
  height: number
  particles: Particle[]
  image: HTMLImageElement
  centerX: number
  centerY: number
  gap: number
  mouse: Mouse

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.particles = []
    this.image = document.getElementById('image1') as HTMLImageElement
    this.centerX = (this.width - this.image.width) / 2
    this.centerY = (this.height - this.image.height) / 2
    this.gap = 5
    this.mouse = {
      radius: 500,
      x: null,
      y: null
    }

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.x
      this.mouse.y = e.y
    })

    document.getElementById('inputMouseArea')!.addEventListener('change', ({ target }) => {
      this.mouse.radius = parseFloat((target as HTMLInputElement).value)
    })
  }

  init(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.centerX, this.centerY)
    const pixels = ctx.getImageData(0, 0, this.width, this.height).data

    for (let y = 0; y < this.width; y += this.gap) {
      for (let x = 0; x < this.height; x += this.gap) {
        const index = (y * this.width + x) * 4

        const red = pixels[index]
        const green = pixels[index + 1]
        const blue = pixels[index + 2]
        const alpha = pixels[index + 3]

        const color = `rgb(${red},${green},${blue})`

        if (alpha > 0) {
          this.particles.push(new Particle(this, x, y, color))
        }
      }
    }
  }

  update = (): void => this.particles.forEach((particle) => particle.update())
  draw = (ctx: CanvasRenderingContext2D): void =>
    this.particles.forEach((particle) => particle.draw(ctx))
  warp = (): void => this.particles.forEach((particle) => particle.warp())
}

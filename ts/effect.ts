import type { Mouse, EffectConfig } from '../types'
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
  config: EffectConfig
  controlsVisible: boolean

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.particles = []
    this.image = document.getElementById('image1') as HTMLImageElement
    this.controlsVisible = true
    this.centerX = this.calculateCenterX()
    this.centerY = this.calculateCenterY()
    this.gap = 5
    this.mouse = {
      radius: 5000,
      x: null,
      y: null
    }
    this.config = {
      gap: 5,
      friction: 0.95,
      ease: 0.02,
      mouseRadius: 5000,
      mouseForce: 1,
      mouseEnabled: true
    }

    // Mouse events for desktop
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.x
      this.mouse.y = e.y
    })

    // Touch events for mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX
        this.mouse.y = e.touches[0].clientY
      }
    })

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX
        this.mouse.y = e.touches[0].clientY
      }
    })

    window.addEventListener('touchend', () => {
      this.mouse.x = null
      this.mouse.y = null
    })
  }

  calculateCenterX(): number {
    const isMobile = window.innerWidth <= 1024
    const controlsWidth = 340

    // Su desktop o se i controlli sono nascosti, centra l'immagine
    if (!isMobile || !this.controlsVisible) {
      return Math.max(0, (this.width - this.image.width) / 2)
    }

    // Su mobile con controlli visibili
    const availableWidth = this.width - controlsWidth

    // Se l'immagine è più larga dello spazio disponibile, allineala a sinistra con padding
    if (this.image.width > availableWidth) {
      return 20
    }

    // Altrimenti centrala nello spazio disponibile a sinistra
    return Math.max(20, (availableWidth - this.image.width) / 2)
  }

  calculateCenterY(): number {
    // Centra verticalmente con un minimo di padding
    return Math.max(0, (this.height - this.image.height) / 2)
  }

  updateCenter(): void {
    this.centerX = this.calculateCenterX()
    this.centerY = this.calculateCenterY()
  }

  setControlsVisible(visible: boolean): void {
    this.controlsVisible = visible
    this.updateCenter()
  }

  updateConfig(key: keyof EffectConfig, value: number | boolean): void {
    ;(this.config as any)[key] = value

    if (key === 'mouseRadius') {
      this.mouse.radius = value as number
    } else if (key === 'friction' || key === 'ease') {
      this.particles.forEach((particle) => particle.updateConfig())
    } else if (key === 'gap') {
      this.particles.forEach((particle) => (particle.size = value as number))
    }
  }

  reinitialize(ctx: CanvasRenderingContext2D, newGap: number): void {
    this.gap = newGap
    this.config.gap = newGap
    this.particles = []
    this.init(ctx)
  }

  resetPositions(): void {
    this.particles.forEach((particle) => {
      particle.x = particle.originX
      particle.y = particle.originY
      particle.vx = 0
      particle.vy = 0
    })
  }

  init(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.drawImage(this.image, this.centerX, this.centerY)
    const pixels = ctx.getImageData(0, 0, this.width, this.height).data

    for (let y = 0; y < this.height; y += this.gap) {
      for (let x = 0; x < this.width; x += this.gap) {
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

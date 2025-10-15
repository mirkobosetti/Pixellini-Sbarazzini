import { Effect } from './js/effect'

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas1') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const effect = new Effect(canvas.width, canvas.height)
  effect.init(ctx)

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    effect.draw(ctx)
    effect.update()
    requestAnimationFrame(animate)
  }

  animate()

  const warpButton = document.getElementById('warpButton') as HTMLButtonElement
  warpButton.addEventListener('click', () => {
    effect.warp()
  })
})

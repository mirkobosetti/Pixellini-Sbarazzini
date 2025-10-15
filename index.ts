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

  // Button controls
  const warpButton = document.getElementById('warpButton') as HTMLButtonElement
  warpButton.addEventListener('click', () => {
    effect.warp()
  })

  const resetButton = document.getElementById('resetButton') as HTMLButtonElement
  resetButton.addEventListener('click', () => {
    effect.resetPositions()
  })

  const recalculateButton = document.getElementById('recalculateButton') as HTMLButtonElement
  recalculateButton.addEventListener('click', () => {
    const imageGapInput = document.getElementById('inputImageGap') as HTMLInputElement
    const newGap = parseInt(imageGapInput.value)
    effect.reinitialize(ctx, newGap)
  })

  // Mouse enabled toggle
  const mouseEnabledInput = document.getElementById('inputMouseEnabled') as HTMLInputElement
  mouseEnabledInput.addEventListener('change', (e) => {
    const enabled = (e.target as HTMLInputElement).checked
    effect.updateConfig('mouseEnabled', enabled)
  })

  // Range controls with live value display
  const setupRangeControl = (
    inputId: string,
    valueId: string,
    configKey: keyof typeof effect.config,
    formatter?: (value: number) => string
  ) => {
    const input = document.getElementById(inputId) as HTMLInputElement
    const valueDisplay = document.getElementById(valueId) as HTMLSpanElement

    input.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value)
      effect.updateConfig(configKey, value)
      valueDisplay.textContent = formatter ? formatter(value) : value.toString()
    })
  }

  setupRangeControl('inputMouseArea', 'valueMouseArea', 'mouseRadius', (v) => v.toFixed(0))
  setupRangeControl('inputMouseForce', 'valueMouseForce', 'mouseForce', (v) => v.toFixed(1))
  setupRangeControl('inputFriction', 'valueFriction', 'friction', (v) => v.toFixed(2))
  setupRangeControl('inputEase', 'valueEase', 'ease', (v) => v.toFixed(3))
  setupRangeControl('inputSize', 'valueSize', 'gap', (v) => v.toFixed(0))

  // Image gap slider (just for display, needs recalculate button)
  const imageGapInput = document.getElementById('inputImageGap') as HTMLInputElement
  const imageGapValue = document.getElementById('valueImageGap') as HTMLSpanElement
  imageGapInput.addEventListener('input', (e) => {
    const value = parseInt((e.target as HTMLInputElement).value)
    imageGapValue.textContent = value.toString()
  })

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    effect.width = canvas.width
    effect.height = canvas.height
  })
})

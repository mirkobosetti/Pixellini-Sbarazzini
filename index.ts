import { Effect } from './ts/effect'

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas1') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  const controlsPanel = document.getElementById('controls') as HTMLDivElement
  const toggleButton = document.getElementById('toggleControls') as HTMLButtonElement

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const effect = new Effect(canvas.width, canvas.height)
  effect.init(ctx)

  // Initialize controls visibility based on screen size
  const updateControlsVisibility = () => {
    const isMobile = window.innerWidth <= 1024
    if (isMobile) {
      controlsPanel.classList.add('hidden')
      effect.setControlsVisible(false)
      toggleButton.classList.remove('active')
    } else {
      controlsPanel.classList.remove('hidden')
      effect.setControlsVisible(true)
    }
  }

  updateControlsVisibility()

  // Toggle controls on mobile
  toggleButton.addEventListener('click', () => {
    const isHidden = controlsPanel.classList.contains('hidden')
    if (isHidden) {
      controlsPanel.classList.remove('hidden')
      toggleButton.classList.add('active')
      effect.setControlsVisible(true)
    } else {
      controlsPanel.classList.add('hidden')
      toggleButton.classList.remove('active')
      effect.setControlsVisible(false)
    }
    // Reinitialize particles with new center position
    effect.reinitialize(ctx, effect.gap)
  })

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    effect.draw(ctx)
    effect.update()
    requestAnimationFrame(animate)
  }

  animate()

  // Prevent scrolling on touch for canvas
  canvas.addEventListener(
    'touchstart',
    (e) => {
      e.preventDefault()
    },
    { passive: false }
  )

  canvas.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault()
    },
    { passive: false }
  )

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
  let resizeTimeout: number
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    effect.width = canvas.width
    effect.height = canvas.height

    // Update controls visibility on resize
    clearTimeout(resizeTimeout)
    resizeTimeout = window.setTimeout(() => {
      updateControlsVisibility()
      effect.reinitialize(ctx, effect.gap)
    }, 250)
  })
})

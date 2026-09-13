import type { SpraySettings } from '@/lib/spray-settings'

// Experimental mist synchronized to video time, so pausing and looping stay aligned.
export function createSprayParticles(video: HTMLVideoElement, moments: number[], settings: SpraySettings) {
  const hero = video.closest<HTMLElement>('.hero')
  const shell = video.closest<HTMLElement>('.site-shell')
  if (!hero || !shell) return { draw: (_time: number) => {}, destroy: () => {} }
  const canvas = document.createElement('canvas')
  canvas.className = 'hero-spray-particles'
  canvas.setAttribute('aria-hidden', 'true')
  // Keep the mist outside the hero's clipping area so it can rise above the video.
  shell.appendChild(canvas)
  const context = canvas.getContext('2d')
  const color = [1, 3, 5].map((offset) => parseInt(settings.particle_color.slice(offset, offset + 2), 16)).join(',')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let width = 0, height = 0, originX = 0, originY = 0, travel = 0, fall = 0, dirty = false
  let mobile = false
  let videoMask: Path2D | null = null
  const particles = Array.from({ length: settings.particle_count }, (_, index) => {
    const random = (seed: number) => {
      const value = Math.sin((index + 1) * seed) * 43758.5453
      return value - Math.floor(value)
    }
    return { delay: random(12.9898) * .24, life: 4 + random(78.233) * 1.5,
      speed: .65 + random(39.425) * .55, spread: random(93.12) - .5,
      lift: .42 + random(63.71) * .55,
      size: .45 + random(15.32) * .65, opacity: (settings.particle_opacity / 100) * (.82 + random(51.9) * .18) }
  })
  const measure = () => {
    const box = hero.getBoundingClientRect(), media = video.getBoundingClientRect(), shellBox = shell.getBoundingClientRect()
    const headroom = Math.min(140, Math.max(0, box.top - shellBox.top))
    width = box.width; height = box.height + headroom
    mobile = window.matchMedia('(max-width:700px)').matches
    canvas.style.left = `${box.left - shellBox.left}px`
    canvas.style.top = `${box.top - shellBox.top - headroom}px`
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio)
    context?.setTransform(ratio, 0, 0, ratio, 0, 0)
    const sourceWidth = video.videoWidth || 1080, sourceHeight = video.videoHeight || 1214
    const scale = Math.max(media.width / sourceWidth, media.height / sourceHeight)
    const position = getComputedStyle(video).objectPosition.split(' ').map(parseFloat)
    const offsetX = (media.width - sourceWidth * scale) * (position[0] / 100 || .5)
    const offsetY = (media.height - sourceHeight * scale) * (position[1] / 100 || .5)
    originX = media.left - box.left + offsetX + sourceWidth * scale * .755
    originY = headroom + media.top - box.top + offsetY + sourceHeight * scale * .218
    travel = Math.min(media.width * .48, 420)
    fall = media.height * .42
    if (mobile) {
      const title = hero.querySelector('h1')?.getBoundingClientRect()
      fall = title ? (headroom + title.bottom - box.top - originY + 45) * 1.25 : media.height * 1.4
    }
    // Hide the mist behind the video frame, including its rounded corners.
    // The original origin and trajectory remain unchanged underneath the frame.
    const frame = video.parentElement || video
    const frameBox = frame.getBoundingClientRect()
    const frameStyle = getComputedStyle(frame)
    const radius = (value: string) => {
      const parts = value.split(' ')
      const length = (part: string, size: number) => parseFloat(part) * (part.endsWith('%') ? size / 100 : 1)
      return { x: length(parts[0], frameBox.width), y: length(parts[1] || parts[0], frameBox.height) }
    }
    videoMask = new Path2D()
    videoMask.roundRect(frameBox.left - box.left, headroom + frameBox.top - box.top, frameBox.width, frameBox.height,
      [frameStyle.borderTopLeftRadius, frameStyle.borderTopRightRadius, frameStyle.borderBottomRightRadius, frameStyle.borderBottomLeftRadius].map(radius))
    dirty = false
  }
  const observer = new ResizeObserver(measure)
  observer.observe(hero); observer.observe(video)
  video.addEventListener('loadedmetadata', measure)
  measure()
  return {
    draw(time: number) {
      if (!context) return
      const active = !reducedMotion.matches && moments.some((moment) => time >= moment && time < moment + 5.8)
      if (!active) { if (dirty) context.clearRect(0, 0, width, height); dirty = false; return }
      context.clearRect(0, 0, width, height); dirty = true
      for (const moment of moments) for (const particle of particles) {
        const age = time - moment - particle.delay
        if (age < 0 || age > particle.life) continue
        const progress = age / particle.life
        // The initial jet slows horizontally while gravity bends it downward.
        const distance = (1 - (1 - progress) ** 3) * travel * particle.speed
        const drift = Math.sin(age * 1.8 + particle.spread * 6) * 9 * Math.sin(progress * Math.PI)
        const x = mobile
          ? originX + (width * .5 - originX) * progress + particle.spread * width * .65 * Math.sin(progress * Math.PI / 2) + drift
          : originX + distance + drift
        const y = mobile
          ? originY + fall * progress ** 1.55 + drift * .5
          : originY - distance * particle.lift + particle.spread * distance * .3 + fall * progress ** 2 + drift * .6
        const radius = particle.size * (1 - progress * .15)
        const opacity = particle.opacity * Math.min(age / .12, 1) * Math.min((1 - progress) / .3, 1)
        const glow = context.createRadialGradient(x, y, 0, x, y, radius)
        glow.addColorStop(0, `rgba(${color},${opacity})`)
        glow.addColorStop(.45, `rgba(${color},${opacity * .8})`)
        glow.addColorStop(1, `rgba(${color},0)`)
        context.fillStyle = glow
        context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.fill()
      }
      if (videoMask) {
        context.save()
        context.globalCompositeOperation = 'destination-out'
        context.fillStyle = '#000'
        context.fill(videoMask)
        context.restore()
      }
    },
    destroy() { observer.disconnect(); video.removeEventListener('loadedmetadata', measure); canvas.remove() },
  }
}

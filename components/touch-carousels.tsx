'use client'

import { useEffect } from 'react'

export function TouchCarousels() {
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 700px), (pointer: coarse)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let cleanups: (() => void)[] = []
    const setup = () => {
      cleanups.forEach(cleanup => cleanup())
      cleanups = []
      if (!mobile.matches) return
      document.querySelectorAll<HTMLElement>('.product-grid, .showcase-grid').forEach(viewport => {
        const track = viewport.firstElementChild as HTMLElement | null
        if (!track) return
        viewport.dataset.touchCarousel = 'true'
        let touching = false
        let resumeAt = 0
        let previousTime = 0
        let position = viewport.scrollLeft
        let frame = 0
        const pause = () => { touching = true }
        const resume = () => { touching = false; resumeAt = performance.now() + 3000 }
        const tick = (time: number) => {
          const elapsed = Math.min(time - previousTime, 50)
          previousTime = time
          const cycle = track.scrollWidth / 2
          if (touching || time < resumeAt || reducedMotion.matches || document.hidden) {
            position = viewport.scrollLeft
          } else if (cycle > 0) {
            position = (position + elapsed * 0.025) % cycle
            viewport.scrollLeft = position
          }
          frame = requestAnimationFrame(tick)
        }
        viewport.addEventListener('touchstart', pause, { passive: true })
        viewport.addEventListener('touchend', resume, { passive: true })
        viewport.addEventListener('touchcancel', resume, { passive: true })
        frame = requestAnimationFrame(tick)
        cleanups.push(() => {
          cancelAnimationFrame(frame)
          viewport.removeEventListener('touchstart', pause)
          viewport.removeEventListener('touchend', resume)
          viewport.removeEventListener('touchcancel', resume)
          delete viewport.dataset.touchCarousel
          viewport.scrollLeft = 0
        })
      })
    }
    setup()
    mobile.addEventListener('change', setup)
    return () => {
      mobile.removeEventListener('change', setup)
      cleanups.forEach(cleanup => cleanup())
    }
  }, [])
  return null
}

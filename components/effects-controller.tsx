'use client'

import { defaultSpraySettings, type SpraySettings } from '@/lib/spray-settings'

import { useEffect } from 'react'
import { createSprayParticles } from '@/lib/spray-particles'

export type FloralControl = { desktop: boolean; mobile: boolean; opacity: number; scale: number; rotation: number }
export type FloralEffects = { large: FloralControl; small: FloralControl }

export const defaultFloralEffects: FloralEffects = { large: { desktop:true, mobile:true, opacity:9, scale:100, rotation:0 }, small: { desktop:true, mobile:false, opacity:17, scale:100, rotation:0 } }
export const floralEffectsStorageKey = 'finessencia-floral-effects'

export const normalizeFloralEffects = (value: unknown): FloralEffects => {
  if (!value || typeof value !== 'object') return defaultFloralEffects
  const saved = value as Partial<FloralEffects> & { enabled?: boolean; opacity?: number; scale?: number }
  if (!saved.large || !saved.small) { const legacy = { desktop:saved.enabled ?? true, mobile:saved.enabled ?? true, opacity:saved.opacity ?? 17, scale:saved.scale ?? 100, rotation:0 }; return { large:{ ...defaultFloralEffects.large, ...legacy }, small:{ ...defaultFloralEffects.small, ...legacy, mobile:false } } }
  return { large:{ ...defaultFloralEffects.large, ...saved.large }, small:{ ...defaultFloralEffects.small, ...saved.small } }
}

export function applyFloralEffects(effects: FloralEffects) {
  const root = document.documentElement
  for (const [name, item] of Object.entries(effects) as [keyof FloralEffects, FloralControl][]) {
    root.style.setProperty(`--hero-floral-${name}-opacity`, String(item.opacity / 100))
    root.style.setProperty(`--hero-floral-${name}-scale`, String(item.scale / 100))
    root.style.setProperty(`--hero-floral-${name}-rotation`, `${item.rotation}deg`)
    root.style.setProperty(`--hero-floral-${name}-desktop-display`, item.desktop ? 'block' : 'none')
    root.style.setProperty(`--hero-floral-${name}-mobile-display`, item.mobile ? 'block' : 'none')
  }
}

export function EffectsController({ spraySettings = defaultSpraySettings }: { spraySettings?: SpraySettings }) {
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(floralEffectsStorageKey)
      if (saved) applyFloralEffects(normalizeFloralEffects(JSON.parse(saved)))
    } catch {
      applyFloralEffects(defaultFloralEffects)
    }
  }, [])

  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>('.hero-image video')
    const title = document.querySelector<HTMLElement>('.hero-copy h1')
    if (!video || !title) return
    const moments = [3.16, 6.56]
    const spray = spraySettings.spray_enabled ? createSprayParticles(video, moments, spraySettings) : null
    const videoContainer = video.parentElement
    let fired = [false, false], previous = 0, frame = 0, shimmer: Animation | null = null
    let cycleTimer = 0, initialTimer = 0
    let visible = true, running = false, resumeVideo = false
    const fire = () => {
      shimmer?.cancel()
      title.style.backgroundPosition = '100% 100%'
      shimmer = title.animate([{ backgroundPosition: '100% 100%' }, { backgroundPosition: '0% 0%' }], { duration: 3300, easing: 'cubic-bezier(.25,.1,.75,.9)', fill: 'none' })
      shimmer.onfinish = () => { title.style.backgroundPosition = '100% 100%' }
    }
    const onTimeUpdate = () => {
      const time = video.currentTime
      if (time < previous) fired = [false, false]
      moments.forEach((moment, index) => { if (!fired[index] && time >= moment) { fired[index] = true; fire() } })
      previous = time
    }
    const watch = () => {
      if (!running) return
      const time = video.currentTime
      spray?.draw(time)
      // Finish the 1.4s fade before the original ending begins around 15.5s.
      videoContainer?.classList.toggle('is-ending', time >= 14)
      onTimeUpdate()
      frame = requestAnimationFrame(watch)
    }
    const sync = () => {
      const active = visible && !document.hidden && !document.documentElement.classList.contains('customer-modal-open')
      if (!active) { running = false; cancelAnimationFrame(frame); if (!video.paused) { resumeVideo = true; video.pause() } }
      else { if (resumeVideo) { resumeVideo = false; void video.play().catch(() => {}) }; if (!running && !video.paused) { running = true; frame = requestAnimationFrame(watch) } }
    }
    const onPause = () => { running = false; cancelAnimationFrame(frame) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { rootMargin: '180px' })
    observer.observe(video.closest('.hero') || video)
    document.addEventListener('visibilitychange', sync)
    video.addEventListener('play', sync)
    video.addEventListener('pause', onPause)
    video.addEventListener('timeupdate', onTimeUpdate)
    initialTimer = window.setTimeout(fire, 1200)
    cycleTimer = window.setInterval(fire, 7750)
    sync()
    return () => { running = false; cancelAnimationFrame(frame); window.clearTimeout(initialTimer); window.clearInterval(cycleTimer); shimmer?.cancel(); observer.disconnect(); document.removeEventListener('visibilitychange', sync); video.removeEventListener('play', sync); video.removeEventListener('pause', onPause); video.removeEventListener('timeupdate', onTimeUpdate); spray?.destroy(); videoContainer?.classList.remove('is-ending') }
  }, [spraySettings])

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.hero,.arrivals,.showcase,.catalog,.about,.footer-brand-echo')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('motion-offscreen', !entry.isIntersecting)), { rootMargin: '120px' })
    sections.forEach(section => observer.observe(section))
    return () => { observer.disconnect(); sections.forEach(section => section.classList.remove('motion-offscreen')) }
  }, [])

  useEffect(() => {
    const welcome = document.querySelector<HTMLElement>('.welcome')
    const title = welcome?.querySelector<HTMLElement>('h2')
    if (!welcome || !title || !window.matchMedia('(min-width: 701px)').matches) return
    let frame = 0
    const update = () => {
      const top = welcome.getBoundingClientRect().top
      const progress = Math.max(0, Math.min(1, top / window.innerHeight))
      // Large as the welcome strip enters the first viewport, settling at its original size on arrival.
      title.style.setProperty('--welcome-title-scale', String(1 + progress * (spraySettings.welcome_title_scale / 100)))
      frame = 0
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    let fadeTimer = 0
    const trace = () => {
      window.clearTimeout(fadeTimer)
      welcome.classList.remove('is-fading')
      welcome.classList.remove('is-tracing')
      void welcome.offsetWidth
      welcome.classList.add('is-tracing')
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    welcome.addEventListener('mouseenter', trace)
    const untrace = () => {
      welcome.classList.remove('is-tracing')
      welcome.classList.add('is-fading')
      window.clearTimeout(fadeTimer)
      fadeTimer = window.setTimeout(() => welcome.classList.remove('is-fading'), 1100)
    }
    welcome.addEventListener('mouseleave', untrace)
    schedule()
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); welcome.removeEventListener('mouseenter', trace); welcome.removeEventListener('mouseleave', untrace); window.clearTimeout(fadeTimer); welcome.classList.remove('is-tracing','is-fading'); if (frame) cancelAnimationFrame(frame); title.style.removeProperty('--welcome-title-scale') }
  }, [spraySettings.welcome_title_scale])

  return null
}

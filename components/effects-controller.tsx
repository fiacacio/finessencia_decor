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
    let fired = [false, false], previous = 0, frame = 0
    let visible = true, running = false, resumeVideo = false
    const fire = () => { title.classList.remove('is-spraying'); void title.offsetWidth; title.classList.add('is-spraying') }
    const watch = () => {
      if (!running) return
      const time = video.currentTime
      spray?.draw(time)
      // Finish the 1.4s fade before the original ending begins around 15.5s.
      videoContainer?.classList.toggle('is-ending', time >= 14)
      if (time < previous) fired = [false, false]
      moments.forEach((moment, index) => { if (!fired[index] && time >= moment) { fired[index] = true; fire() } })
      previous = time
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
    sync()
    return () => { running = false; cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener('visibilitychange', sync); video.removeEventListener('play', sync); video.removeEventListener('pause', onPause); spray?.destroy(); videoContainer?.classList.remove('is-ending') }
  }, [spraySettings])

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.hero,.arrivals,.showcase,.catalog,.about,.footer-brand-echo')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('motion-offscreen', !entry.isIntersecting)), { rootMargin: '120px' })
    sections.forEach(section => observer.observe(section))
    return () => { observer.disconnect(); sections.forEach(section => section.classList.remove('motion-offscreen')) }
  }, [])

  return null
}

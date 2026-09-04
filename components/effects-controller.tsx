'use client'

import { useEffect } from 'react'

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

export function EffectsController() {
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(floralEffectsStorageKey)
      if (saved) applyFloralEffects(normalizeFloralEffects(JSON.parse(saved)))
    } catch {
      applyFloralEffects(defaultFloralEffects)
    }
  }, [])

  return null
}

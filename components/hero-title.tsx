'use client'

import { useEffect, useId, useRef } from 'react'
import type { SpraySettings } from '@/lib/spray-settings'

export function HeroTitle({ settings }: { settings: SpraySettings }) {
  const gradient = useRef<SVGLinearGradientElement>(null)
  const id = useId().replace(/:/g, '')
  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>('.hero-image video')
    let frame = 0
    const paint = () => {
      const time = video?.currentTime ?? -1
      const starts = [settings.hero_first_effect_time, settings.hero_second_effect_time]
      const start = starts.filter(value => time >= value && time < value + 2.3).at(-1)
      const progress = start === undefined ? 0 : Math.min(1, (time - start) / 2.3)
      // The center of the highlight moves left to right across the letters.
      const center = -230 + progress * 1220
      gradient.current?.setAttribute('x1', String(center - 750))
      gradient.current?.setAttribute('x2', String(center + 750))
      gradient.current?.setAttribute('y1', '-200')
      gradient.current?.setAttribute('y2', '200')
      frame = requestAnimationFrame(paint)
    }
    frame = requestAnimationFrame(paint)
    return () => cancelAnimationFrame(frame)
  }, [settings.hero_first_effect_time, settings.hero_second_effect_time])
  return <h1 className="hero-title-svg"><svg viewBox="0 0 760 235" role="img" aria-label="Acenda o momento" preserveAspectRatio="xMidYMid meet"><defs><linearGradient ref={gradient} id={`hero-shine-${id}`} gradientUnits="userSpaceOnUse" x1="-980" y1="-200" x2="520" y2="200"><stop offset="0" stopColor="#3a2419" /><stop offset=".43" stopColor="#3a2419" /><stop offset=".47" stopColor="#e4c28d" /><stop offset=".5" stopColor="#ca8a4a" /><stop offset=".54" stopColor="#e4c28d" /><stop offset=".58" stopColor="#3a2419" /><stop offset="1" stopColor="#3a2419" /></linearGradient></defs><text x="380" y="94" textAnchor="middle" fill={`url(#hero-shine-${id})`}><tspan x="380">ACENDA</tspan><tspan x="380" dy="105">O MOMENTO</tspan></text></svg></h1>
}

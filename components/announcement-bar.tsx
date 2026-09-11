'use client'

import { useEffect, useState } from 'react'
import { activeFairs, saoPauloDate, announcementTextColor, type Announcement } from '@/lib/announcement'

export function AnnouncementBar({ settings }: { settings: Announcement }) {
  const [today, setToday] = useState(saoPauloDate)
  useEffect(() => {
    const update = () => setToday(saoPauloDate())
    const timer = window.setInterval(update, 30000)
    window.addEventListener('focus', update)
    return () => { window.clearInterval(timer); window.removeEventListener('focus', update) }
  }, [])
  const fairs = activeFairs(settings.fairs, today)
  const text = settings.show_fairs ? fairs.length ? `Próximas feiras  ✦  ${fairs.map((fair) => fair.label).join('  ✦  ')}` : '' : settings.text
  if (!settings.visible || !text) return null
  return <div className={`shipping-bar${settings.marquee ? ' shipping-bar--marquee' : ''}`} style={{ backgroundColor: settings.color, color: announcementTextColor(settings.color) }}>
    {settings.marquee ? <>
      <span className="sr-only">{text}</span>
      <div className="shipping-marquee-window" aria-hidden="true"><div className="shipping-marquee-track" style={{ animationDuration: `${Math.max(25, text.length * .22)}s` }}>
        {[0, 1].map((copy) => <span key={copy}>{(settings.show_fairs ? ['Próximas feiras', ...fairs.map((fair) => fair.label)] : [text]).map((item, index) => <span key={index}>{item}<span className="shipping-marquee-separator">✦</span></span>)}</span>)}
      </div></div>
    </> : <><span aria-hidden="true">✦</span><span>{text}</span><span aria-hidden="true">✦</span></>}
  </div>
}

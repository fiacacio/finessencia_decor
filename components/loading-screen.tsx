'use client'

import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const [leaving, setLeaving] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setLeaving(true), 1000)
    const removeTimer = window.setTimeout(() => setVisible(false), 1420)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(removeTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`loading-screen${leaving ? ' is-leaving' : ''}`} role="status" aria-label="Carregando Finessência">
      <div className="loading-screen-content">
        <img src="/Logo PNG Caramelo.png" alt="Finessência decor aromático" />
        <span className="loading-screen-line" />
      </div>
    </div>
  )
}

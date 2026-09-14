'use client'

import { useEffect } from 'react'

export function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.isSecureContext) {
      window.addEventListener('load', () => { void navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then((registration) => registration.update()) }, { once: true })
    }
  }, [])
  return null
}

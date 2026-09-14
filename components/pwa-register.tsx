'use client'

import { useEffect } from 'react'

export function PwaRegister() {
  useEffect(() => {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      void navigator.serviceWorker?.getRegistrations().then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      return
    }
    if ('serviceWorker' in navigator && window.isSecureContext) {
      window.addEventListener('load', () => { void navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then((registration) => registration.update()) }, { once: true })
    }
  }, [])
  return null
}

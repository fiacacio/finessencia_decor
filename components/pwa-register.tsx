'use client'

import { useEffect } from 'react'

export function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.isSecureContext) {
      window.addEventListener('load', () => { void navigator.serviceWorker.register('/sw.js') }, { once: true })
    }
  }, [])
  return null
}

'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export function ProductImage({ src, name, children }: { src: string; name: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!open || !dialog.current) return
    const element = dialog.current
    const previousOverflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return <>
    <button type="button" className="catalog-media catalog-image-button" aria-label={`Ampliar foto de ${name}`} aria-haspopup="dialog" onClick={() => setOpen(true)}>
      {children}
    </button>
    <dialog ref={dialog} className="product-image-dialog" aria-label={`Foto ampliada de ${name}`} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={() => setOpen(false)}>
      <button type="button" className="product-image-close" aria-label="Fechar foto ampliada" onClick={() => setOpen(false)}>
        <span className="product-image-close-label">Fechar ×</span>
        <img src={src} alt={name} />
        <span className="product-image-hint">Toque na foto para fechar</span>
      </button>
    </dialog>
  </>
}

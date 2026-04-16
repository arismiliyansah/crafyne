'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

export default function HeroGlow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%')
    el.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%')
  }

  function handleMouseLeave() {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--gx', '50%')
    el.style.setProperty('--gy', '46%')
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ '--gx': '50%', '--gy': '46%' } as React.CSSProperties}
      className="relative min-h-svh flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden
        before:absolute before:inset-0 before:pointer-events-none before:z-[1]
        before:[background:radial-gradient(ellipse_72%_56%_at_var(--gx)_var(--gy),rgba(77,143,106,0.14)_0%,rgba(176,138,82,0.06)_45%,transparent_68%)]"
    >
      {/* Three.js 3D scene */}
      <HeroScene />

      {/* Content sits above the canvas */}
      <div className="relative z-10 flex flex-col items-center">
        {children}
      </div>
    </div>
  )
}

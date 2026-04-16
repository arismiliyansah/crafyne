'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
    camera.position.z = 7

    // ── Main icosahedron ──────────────────────────────────────
    const mainGeo = new THREE.IcosahedronGeometry(2.6, 1)
    const mainMat = new THREE.MeshBasicMaterial({
      color: 0x4d8f6a,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    })
    const mainMesh = new THREE.Mesh(mainGeo, mainMat)
    mainMesh.position.set(2.2, 0.2, -1)
    scene.add(mainMesh)

    // ── Small floating shapes ─────────────────────────────────
    const smallShapes: THREE.Mesh[] = []
    const configs = [
      { geo: new THREE.OctahedronGeometry(0.55, 0), pos: [-3.5, 1.8, -2],  speed: 0.7, color: 0xb08a52 },
      { geo: new THREE.IcosahedronGeometry(0.35, 0), pos: [3.8, -2.2, -1.5], speed: 0.5, color: 0x4d8f6a },
      { geo: new THREE.OctahedronGeometry(0.28, 0), pos: [-2.2, -2.4, -0.5], speed: 0.9, color: 0xb08a52 },
      { geo: new THREE.IcosahedronGeometry(0.22, 0), pos: [0.5, 2.8, -2],   speed: 0.6, color: 0x7ab898 },
    ]
    configs.forEach(cfg => {
      const mat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      })
      const mesh = new THREE.Mesh(cfg.geo, mat)
      mesh.position.set(...cfg.pos as [number, number, number])
      mesh.userData.speed = cfg.speed
      scene.add(mesh)
      smallShapes.push(mesh)
    })

    // ── Particles ─────────────────────────────────────────────
    const COUNT = 180
    const positions = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0x8a7f6a,
      size: 0.038,
      transparent: true,
      opacity: 0.65,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ── Resize ────────────────────────────────────────────────
    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // ── Mouse ─────────────────────────────────────────────────
    let targetX = 0, targetY = 0
    let currentX = 0, currentY = 0
    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth  - 0.5) * 2
      targetY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // ── Animate ───────────────────────────────────────────────
    const timer = new THREE.Timer()
    let rafId: number

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      timer.update()
      const t = timer.getElapsed()

      // Smooth mouse lerp
      currentX += (targetX - currentX) * 0.04
      currentY += (targetY - currentY) * 0.04

      // Main mesh: slow spin + subtle mouse parallax
      mainMesh.rotation.x = t * 0.07  + currentY * 0.15
      mainMesh.rotation.y = t * 0.11  + currentX * 0.15

      // Small shapes: individual speeds + gentle bob
      smallShapes.forEach((m, i) => {
        const s = m.userData.speed as number
        m.rotation.x = t * 0.09 * s
        m.rotation.y = t * 0.13 * s
        m.position.y = configs[i].pos[1] + Math.sin(t * 0.4 * s + i) * 0.18
      })

      // Particles: very slow drift
      particles.rotation.y = t * 0.012
      particles.rotation.x = t * 0.007

      // Camera: subtle mouse tilt
      camera.position.x += (currentX * 0.35 - camera.position.x) * 0.05
      camera.position.y += (-currentY * 0.25 - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    // ── Pause when hidden ─────────────────────────────────────
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafId)
      else animate()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)
      timer.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

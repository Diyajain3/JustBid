"use client"
import React, { useEffect, useRef, useState, useCallback } from "react"
import createGlobe from "cobe"
import { useSpring } from "framer-motion"
import { GlobeIntelCard } from "./globe-intel-card"

const MARKERS = [
  { location: [37.7595, -122.4367], size: 0.1, data: { location: "San Francisco", match: 92 } },
  { location: [40.7128, -74.006], size: 0.12, data: { location: "New York", match: 88 } },
  { location: [51.5074, -0.1278], size: 0.1, data: { location: "London", match: 95 } },
  { location: [48.8566, 2.3522], size: 0.08, data: { location: "Paris", match: 84 } },
  { location: [35.6762, 139.6503], size: 0.12, data: { location: "Tokyo", match: 91 } },
  { location: [-33.8688, 151.2093], size: 0.09, data: { location: "Sydney", match: 79 } },
  { location: [1.3521, 103.8198], size: 0.11, data: { location: "Singapore", match: 97 } },
  { location: [47.3769, 8.5417], size: 0.15, data: { location: "Zurich Node", match: 99 } },
]

export function GlobeComponent() {
  const canvasRef = useRef()
  const pointerInteracting = useRef(null)
  const pointerInteractionStart = useRef(0)
  const [width, setWidth] = useState(0)
  const [activeIntel, setActiveIntel] = useState(null)
  
  const r = useSpring(0, {
    stiffness: 280,
    damping: 40,
    mass: 1,
    restDelta: 0.01,
  })

  const phi = useRef(0)
  const isHovered = useRef(false)

  const updateWidth = useCallback(() => {
    if (canvasRef.current) {
      setWidth(canvasRef.current.offsetWidth)
    }
  }, [])

  useEffect(() => {
    window.addEventListener("resize", updateWidth)
    updateWidth()
    return () => window.removeEventListener("resize", updateWidth)
  }, [updateWidth])

  useEffect(() => {
    if (!width || !canvasRef.current) return

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 12,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.29, 0.87, 0.50],
      glowColor: [0.2, 0.2, 0.2],
      markers: MARKERS.map(m => ({ location: m.location, size: m.size })),
      onRender: (state) => {
        // Simple, constant auto-rotation
        if (!pointerInteracting.current) {
          phi.current += isHovered.current ? 0.02 : 0.008
        }
        state.phi = phi.current + r.get()
      }
    })

    const intelInterval = setInterval(() => {
      if (!pointerInteracting.current) {
        const randomMarker = MARKERS[Math.floor(Math.random() * MARKERS.length)]
        setActiveIntel(randomMarker.data)
        setTimeout(() => setActiveIntel(null), 3500)
      }
    }, 8000)

    return () => {
      globe.destroy()
      clearInterval(intelInterval)
    }
  }, [width, r])

  return (
    <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center m-auto">
      
      {/* High-fidelity Glow Layers */}
      <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl animate-pulse" />
      <div className="absolute inset-[-10%] rounded-full bg-[radial-gradient(circle_at_center,_rgba(74,222,128,0.08)_0%,_transparent_70%)] pointer-events-none" />
      
      <canvas
        ref={canvasRef}
        onMouseEnter={() => { isHovered.current = true }}
        onMouseLeave={() => { isHovered.current = false }}
        onPointerDown={(e) => {
          pointerInteractionStart.current = e.clientX
          pointerInteracting.current = e.clientX - r.get() * 200
          canvasRef.current.style.cursor = "grabbing"
        }}
        onPointerUp={() => {
          pointerInteracting.current = null
          canvasRef.current.style.cursor = "grab"
        }}
        onPointerOut={() => {
          pointerInteracting.current = null
          canvasRef.current.style.cursor = "grab"
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current
            r.set(delta / 200)
          }
        }}
        className="w-full h-full cursor-grab outline-none touch-none touch-pan-y"
        style={{ maxWidth: "100%", aspectRatio: "1" }}
      />

      <GlobeIntelCard active={!!activeIntel} data={activeIntel} />

      {/* Atmospheric Ring */}
      <div className="absolute inset-0 rounded-full border border-primary/10 pointer-events-none" />
      <div className="absolute inset-[-5%] rounded-full border border-primary/5 pointer-events-none" />
      
      {/* Heartbeat Pulse Overlay */}
      <div className="absolute inset-0 rounded-full bg-primary/2 opacity-0 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] pointer-events-none" />
    </div>
  )
}

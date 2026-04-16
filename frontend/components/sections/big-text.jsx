"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function BigText() {
  const containerRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textContainer = textRef.current
      if (!textContainer) return

      const lines = textContainer.querySelectorAll(".text-line")

      lines.forEach((line, lineIndex) => {
        const chars = line.querySelectorAll(".char")

        gsap.fromTo(
          chars,
          {
            opacity: 0,
            y: 100,
            rotateX: -90,
            skewX: 20,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            skewX: 0,
            stagger: 0.02,
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
              end: "top 40%",
              scrub: 1,
            },
          }
        )

        // Parallax effect - each line moves at different speed
        gsap.to(line, {
          x: lineIndex % 2 === 0 ? -50 : 50,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const splitText = (text) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ transformStyle: "preserve-3d" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))
  }

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 overflow-hidden bg-gradient-to-b from-background via-card/30 to-background"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6">
        <div
          ref={textRef}
          className="text-center space-y-4 md:space-y-8"
          style={{ perspective: "1000px" }}
        >
          <div
            className="text-line text-4xl md:text-7xl lg:text-8xl font-bold text-muted-foreground/50"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {splitText("Stop chasing")}
          </div>
          <div
            className="text-line text-5xl md:text-8xl lg:text-9xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {splitText("opportunities")}
          </div>
          <div
            className="text-line text-4xl md:text-7xl lg:text-8xl font-bold text-muted-foreground/50"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {splitText("Let them find")}
          </div>
          <div
            className="text-line text-5xl md:text-8xl lg:text-9xl font-bold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {splitText("you")}
          </div>
        </div>
      </div>
    </section>
  )
}

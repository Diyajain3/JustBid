"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: "01",
    title: "Fetch",
    description: "We continuously scan thousands of tender portals and databases worldwide.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    title: "Analyze",
    description: "AI processes documents, extracts requirements, and evaluates relevance to your business.",
    color: "from-primary to-accent",
  },
  {
    number: "03",
    title: "Recommend",
    description: "Receive personalized tender recommendations with match scores and insights.",
    color: "from-green-500 to-emerald-500",
  },
]

export function PinnedProcess() {
  const containerRef = useRef(null)
  const pinnedRef = useRef(null)
  const stepsRef = useRef([])
  const progressRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: pinnedRef.current,
          anticipatePin: 1,
        },
      })

      // Progress bar animation
      tl.to(progressRef.current, {
        scaleX: 1,
        duration: 3,
        ease: "none",
      }, 0)

      // Animate each step in sequence
      stepsRef.current.forEach((step, i) => {
        if (!step) return

        const content = step.querySelector(".step-content")
        const number = step.querySelector(".step-number")
        const icon = step.querySelector(".step-icon")

        // Initial state
        gsap.set(step, { opacity: 0, scale: 0.8, y: 50 })
        gsap.set(content, { opacity: 0, x: 50 })
        gsap.set(number, { opacity: 0, scale: 0.5 })

        // Step reveal
        tl.to(step, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        }, i * 1)

        tl.to(number, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
        }, i * 1 + 0.2)

        tl.to(content, {
          opacity: 1,
          x: 0,
          duration: 0.4,
        }, i * 1 + 0.3)

        // Icon pulse
        if (icon) {
          tl.to(icon, {
            scale: 1.2,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
          }, i * 1 + 0.5)
        }

        // Fade out previous step
        if (i < stepsRef.current.length - 1) {
          tl.to(step, {
            opacity: 0.3,
            scale: 0.9,
            y: -30,
            duration: 0.3,
          }, (i + 1) * 1 - 0.1)
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative">
      <div ref={pinnedRef} className="min-h-screen flex items-center justify-center bg-background">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_70%)] opacity-5" />
        
        <div className="relative z-10 container mx-auto px-6">
          {/* Section title */}
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-7xl font-bold mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              How it works
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Three simple steps to transform your tender discovery process.
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-2xl mx-auto mb-16 h-1 bg-border rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-gradient-to-r from-primary to-accent origin-left scale-x-0"
            />
          </div>

          {/* Steps container */}
          <div className="relative max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => { stepsRef.current[i] = el }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: steps.length - i }}
              >
                <div className="w-full bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Number */}
                    <div className="step-number relative">
                      <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                        <span className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                          {step.number}
                        </span>
                      </div>
                      {/* Animated ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping" />
                    </div>

                    {/* Content */}
                    <div className="step-content flex-1 text-center md:text-left">
                      <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                        <div className="step-icon">
                          <StepIcon step={i} />
                        </div>
                        <h3
                          className="text-3xl md:text-4xl font-bold"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground text-sm">
            Keep scrolling
          </div>
        </div>
      </div>
    </section>
  )
}

function StepIcon({ step }) {
  const iconClass = "w-8 h-8 text-primary"

  switch (step) {
    case 0:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )
    case 1:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    case 2:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    default:
      return null
  }
}

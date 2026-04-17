"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: "01",
    title: "Global Data Ingestion",
    description: "Our AI constantly scrapes and processes thousands of worldwide tender portals, standardizing chaotic data into a clean, searchable index.",
    color: "from-blue-500 to-cyan-500",
    shadow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]"
  },
  {
    number: "02",
    title: "Neural Analysis",
    description: "Natural Language Processing (NLP) models read the underlying tender requirements, scoring them instantly against your distinct business capabilities.",
    color: "from-primary to-accent",
    shadow: "shadow-[0_0_30px_rgba(var(--primary),0.3)]"
  },
  {
    number: "03",
    title: "Prescriptive Alignment",
    description: "Receive high-probability tender matches delivered directly to your dashboard, completely eliminating the manual search process.",
    color: "from-green-500 to-emerald-500",
    shadow: "shadow-[0_0_30px_rgba(34,197,94,0.3)]"
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

      // Background rotation
      tl.to(".bg-spinning-ring", {
        rotation: 360,
        duration: 3,
        ease: "none",
      }, 0)

      // Animate each step in sequence
      stepsRef.current.forEach((step, i) => {
        if (!step) return

        const content = step.querySelector(".step-content")
        const number = step.querySelector(".step-number")
        const borderGlow = step.querySelector(".border-glow")

        // Initial state
        gsap.set(step, { opacity: 0, scale: 0.85, y: 100 })
        gsap.set(content, { opacity: 0, x: 40 })
        gsap.set(number, { opacity: 0, scale: 0.5, rotateY: -90 })
        gsap.set(borderGlow, { opacity: 0 })

        // Step reveal
        tl.to(step, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "power4.out",
        }, i * 1)

        tl.to(borderGlow, {
          opacity: 1,
          duration: 0.4
        }, i * 1 + 0.2)

        tl.to(number, {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 0.5,
          ease: "back.out(1.5)",
        }, i * 1 + 0.2)

        tl.to(content, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        }, i * 1 + 0.3)

        // Fade out previous step
        if (i < stepsRef.current.length - 1) {
          tl.to(step, {
            opacity: 0,
            scale: 0.95,
            y: -50,
            duration: 0.4,
            ease: "power2.in",
          }, (i + 1) * 1 - 0.2)
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative">
      <div ref={pinnedRef} className="min-h-screen flex items-center justify-center bg-background overflow-hidden relative">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
           <div className="bg-spinning-ring absolute w-[600px] h-[600px] rounded-full border border-primary/20 border-dashed" />
           <div className="bg-spinning-ring absolute w-[800px] h-[800px] rounded-full border border-accent/10 border-t-accent/40" style={{ animationDirection: 'reverse', animationDuration: '40s' }} />
           <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_transparent_20%,_var(--background)_70%)]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 w-full max-w-5xl">
          {/* Section title */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-bold tracking-widest uppercase bg-primary/10 text-primary border border-primary/30 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              The Engine
            </span>
            <h2
              className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50"
              style={{ fontFamily: "var(--font-display)" }}
            >
              How It Works
            </h2>
          </div>

          {/* Progress bar */}
          <div className="w-full mx-auto mb-16 h-1.5 bg-secondary rounded-full overflow-hidden relative shadow-inner">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-accent to-primary origin-left scale-x-0 w-full"
            />
          </div>

          {/* Steps container */}
          <div className="relative max-w-4xl mx-auto h-[400px] md:h-[350px]">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => { stepsRef.current[i] = el }}
                className="absolute inset-0 flex items-center justify-center w-full"
                style={{ zIndex: steps.length - i }}
              >
                <div className="relative w-full bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 overflow-hidden group">
                  {/* Glowing Border Background */}
                  <div className={`border-glow absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 transition-opacity duration-500`} style={{ mixBlendMode: 'overlay' }} />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    {/* Number Display */}
                    <div className={`step-number relative shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center ${step.shadow}`}>
                      <span className="text-5xl md:text-6xl font-black text-white drop-shadow-xl" style={{ fontFamily: "var(--font-display)", perspective: 1000 }}>
                        {step.number}
                      </span>
                      {/* Pulse rings */}
                      <div className="absolute inset-[-10px] rounded-full border border-white/20 animate-[ping_3s_linear_infinite]" />
                      <div className="absolute inset-[-20px] rounded-full border border-white/10 animate-[ping_3s_linear_infinite_1s]" />
                    </div>

                    {/* Content */}
                    <div className="step-content flex-1 text-center md:text-left">
                      <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                        <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shadow-inner`}>
                          <StepIcon step={i} />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Keep Scrolling</span>
            <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}

function StepIcon({ step }) {
  const iconClass = "w-6 h-6 text-foreground"

  switch (step) {
    case 0:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )
    case 1:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    case 2:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
      )
    default:
      return null
  }
}

"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"

gsap.registerPlugin(ScrollTrigger)

export function FinalCTA() {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const buttonRef = useRef(null)
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation with glitch
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
              end: "top 30%",
              scrub: 1,
              onEnter: () => {
                setIsGlitching(true)
                setTimeout(() => setIsGlitching(false), 500)
              },
            },
          }
        )
      }

      // Background pulse animation
      gsap.to(".cta-bg-pulse", {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power2.out",
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Magnetic button effect
  const handleMouseMove = (e) => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(button, {
      x: x * 0.4,
      y: y * 0.4,
      duration: 0.3,
      ease: "power2.out",
    })
  }

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    })
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
        
        {/* Animated circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="cta-bg-pulse absolute w-[600px] h-[600px] rounded-full border border-primary/30" />
          <div className="cta-bg-pulse absolute w-[400px] h-[400px] rounded-full border border-primary/40 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" style={{ animationDelay: "0.5s" }} />
          <div className="cta-bg-pulse absolute w-[200px] h-[200px] rounded-full border border-primary/50 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" style={{ animationDelay: "1s" }} />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Glitch title */}
        <h2
          ref={titleRef}
          data-text="Ready to win?"
          className={`text-6xl md:text-8xl lg:text-9xl font-bold mb-8 ${isGlitching ? "glitch-text" : ""}`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ready to{" "}
          <span className="text-primary">win</span>?
        </h2>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Join thousands of businesses that have transformed their tender discovery process.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <motion.button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileTap={{ scale: 0.95 }}
            className="relative px-12 py-6 text-xl font-bold bg-primary text-primary-foreground rounded-full overflow-hidden group"
          >
            <span className="absolute inset-0 bg-accent scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
            <span className="relative z-10 flex items-center gap-3">
              Start Free Trial
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, borderColor: "var(--primary)" }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 text-lg font-medium border-2 border-border rounded-full hover:bg-card/50 transition-colors"
          >
            Schedule Demo
          </motion.button>
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 py-8 border-t border-border">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
              JustBid
            </span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
            <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
          <div className="text-sm text-muted-foreground">
            2024 JustBid. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  )
}

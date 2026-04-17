"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const shapesRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split title into characters
      const title = titleRef.current
      if (title) {
        const text = title.textContent || ""
        title.innerHTML = text
          .split("")
          .map((char) =>
            char === " "
              ? " "
              : `<span class="split-char">${char}</span>`
          )
          .join("")

        const chars = title.querySelectorAll(".split-char")

        // Initial animation - letters fly in
        gsap.fromTo(
          chars,
          {
            opacity: 0,
            y: 100,
            rotateX: -90,
            scale: 0.5,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            stagger: 0.03,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 0.3,
          }
        )

        // Scroll animation - title compresses and scales
        gsap.to(chars, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          y: -50,
          opacity: 0.3,
          scale: 0.8,
          stagger: 0.01,
        })
      }

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 1.2,
          ease: "power3.out",
        }
      )

      // Floating shapes animation
      const shapes = shapesRef.current?.children
      if (shapes) {
        Array.from(shapes).forEach((shape, i) => {
          gsap.to(shape, {
            y: "random(-30, 30)",
            x: "random(-20, 20)",
            rotation: "random(-15, 15)",
            duration: "random(3, 5)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2,
          })
        })
      }

      // Hero compression on scroll
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        scale: 0.9,
        opacity: 0.5,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background shapes */}
      <div
        ref={shapesRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-[30%] right-[10%] w-96 h-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute bottom-[20%] left-[20%] w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-[50%] right-[30%] w-48 h-48 rounded-full bg-accent/20 blur-2xl" />
        
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
            AI-Powered Tender Platform
          </span>
        </motion.div>

        <h1
          ref={titleRef}
          className="text-[clamp(3rem,12vw,12rem)] font-bold leading-[0.9] tracking-tighter mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          JustBid
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Stop searching. Start winning.
          <br />
          <span className="text-primary">AI finds your perfect tenders.</span>
        </p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <div onClick={() => {
            if (localStorage.getItem('token')) navigate('/dashboard')
            else navigate('/auth')
          }}>
            <MagneticButton>
              <span className="relative z-10">Start Winning</span>
            </MagneticButton>
          </div>
          <motion.button
            onClick={() => navigate('/explore')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 text-lg font-medium text-foreground border border-border rounded-full hover:border-primary/50 transition-colors"
          >
            Browse Tenders
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-primary rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function MagneticButton({ children }) {
  const buttonRef = useRef(null)

  const handleMouseMove = (e) => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(button, {
      x: x * 0.3,
      y: y * 0.3,
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
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      className="magnetic-btn relative px-10 py-4 text-lg font-bold bg-primary text-primary-foreground rounded-full overflow-hidden group"
    >
      <span className="absolute inset-0 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      {children}
    </motion.button>
  )
}

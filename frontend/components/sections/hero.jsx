"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ShieldCheck, TrendingUp, Cpu } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const navigate = useNavigate()

  // Spotlight Coordinates
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  const [bounds, setBounds] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBounds({ width: window.innerWidth, height: window.innerHeight })
      const handleResize = () => setBounds({ width: window.innerWidth, height: window.innerHeight })
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleMouseMove = (e) => {
    const x = e.clientX - bounds.width / 2
    const y = e.clientY - bounds.height / 2
    mouseX.set(x * 0.3)
    mouseY.set(y * 0.3)
  }

  // Parallax transforms
  const card1X = useTransform(smoothMouseX, [-1000, 1000], [40, -40])
  const card1Y = useTransform(smoothMouseY, [-1000, 1000], [40, -40])
  const card1RotateX = useTransform(smoothMouseY, [-1000, 1000], [-10, 10])
  const card1RotateY = useTransform(smoothMouseX, [-1000, 1000], [10, -10])

  const card2X = useTransform(smoothMouseX, [-1000, 1000], [-60, 60])
  const card2Y = useTransform(smoothMouseY, [-1000, 1000], [-20, 20])
  const card2RotateX = useTransform(smoothMouseY, [-1000, 1000], [10, -10])
  const card2RotateY = useTransform(smoothMouseX, [-1000, 1000], [-10, 10])

  const card3X = useTransform(smoothMouseX, [-1000, 1000], [30, -30])
  const card3Y = useTransform(smoothMouseY, [-1000, 1000], [-40, 40])
  const card3RotateX = useTransform(smoothMouseY, [-1000, 1000], [-8, 8])
  const card3RotateY = useTransform(smoothMouseX, [-1000, 1000], [15, -15])

useEffect(() => {
  const ctx = gsap.context(() => {
    const title = titleRef.current
    if (title) {
      const text = title.textContent || ""
      title.innerHTML = text
        .split("")
        .map((char) =>
          char === " "
            ? " "
            : `<span class="split-char inline-block" style="will-change: transform, opacity;">${char}</span>`
        )
        .join("")

      const chars = title.querySelectorAll(".split-char")

      // 1. Entrance animation
      gsap.fromTo(
        chars,
        { opacity: 0, y: 100, rotateX: -90, scale: 0.5 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          stagger: 0.05,
          duration: 1.2,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      )

      // 2. Scroll - title goes up and fades, return on scroll up
      gsap.to(titleRef.current, {
        y: -120,
        opacity: 0,
        ease: "power1.inOut",
        immediateRender: false,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=700",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
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
  }, containerRef)

  return () => ctx.revert()
}, [])

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background [perspective:1000px]"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          background: useTransform(
            [smoothMouseX, smoothMouseY],
            ([x, y]) =>
              `radial-gradient(circle 500px at ${x + bounds.width / 2}px ${
                y + bounds.height / 2
              }px, rgba(74, 222, 128, 0.08), transparent 80%)`
          ),
        }}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
        <div className="absolute top-[30%] right-[10%] w-96 h-96 rounded-full bg-accent/20 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-[20%] left-[20%] w-80 h-80 rounded-full bg-primary/10 blur-[100px] animate-pulse" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-0 mask-radial-fade">
          <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-10 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, x: -100, rotateZ: -10 }}
          animate={{ opacity: 0.5, x: 0, rotateZ: 0 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.33, 1, 0.68, 1] }}
          style={{ x: card1X, y: card1Y, rotateX: card1RotateX, rotateY: card1RotateY }}
          className="absolute -left-20 md:left-[10%] top-[25%] w-64 bg-card/20 backdrop-blur-md border border-primary/10 rounded-2xl p-4 shadow-xl opacity-30 md:opacity-50"
        >
          <div className="flex items-center gap-2 mb-3">
             <ShieldCheck size={16} className="text-primary"/> 
             <span className="text-xs font-bold text-muted-foreground uppercase">Protected Bid</span>
          </div>
          <div className="h-2 w-3/4 bg-primary/20 rounded-full mb-2" />
          <div className="h-2 w-1/2 bg-muted/20 rounded-full mb-6" />
          <div className="flex justify-between items-center border-t border-border/50 pt-3">
             <span className="text-xs text-muted-foreground">ID: #99402</span>
             <span className="text-sm font-bold text-green-400">$2.1M</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100, rotateZ: 10 }}
          animate={{ opacity: 0.5, x: 0, rotateZ: 0 }}
          transition={{ duration: 1.5, delay: 1, ease: [0.33, 1, 0.68, 1] }}
          style={{ x: card2X, y: card2Y, rotateX: card2RotateX, rotateY: card2RotateY }}
          className="absolute -right-10 md:right-[15%] top-[10%] md:top-[20%] w-72 bg-card/20 backdrop-blur-md border border-accent/10 rounded-2xl p-4 shadow-xl opacity-30 md:opacity-50"
        >
          <div className="flex items-center gap-2 mb-3">
             <TrendingUp size={16} className="text-accent"/> 
             <span className="text-xs font-bold text-muted-foreground uppercase">99% Match Score</span>
          </div>
          <div className="h-2 w-full bg-accent/20 rounded-full mb-2" />
          <div className="h-2 w-2/3 bg-muted/20 rounded-full mb-6" />
          <div className="flex justify-between items-center border-t border-border/50 pt-3">
             <span className="text-xs text-muted-foreground">Tech Infra</span>
             <span className="text-sm font-bold text-foreground">Pending</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 1.5, delay: 1.2, ease: [0.33, 1, 0.68, 1] }}
          style={{ x: card3X, y: card3Y, rotateX: card3RotateX, rotateY: card3RotateY }}
          className="absolute left-[30%] bottom-[15%] w-56 bg-primary/5 backdrop-blur-md border border-primary/20 rounded-2xl p-4 shadow-xl hidden md:block opacity-40"
        >
          <div className="flex items-center gap-2 mb-3">
             <Cpu size={16} className="text-primary"/> 
             <span className="text-xs font-bold text-primary uppercase">AI Analyzer</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
             <span className="text-xs text-muted-foreground">Monitoring feeds...</span>
          </div>
        </motion.div>
      </div>

      <div className="relative z-20 container mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mb-8">
          <span className="inline-block px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
            AI-Powered Tender Platform
          </span>
        </motion.div>

        <div className="perspective-1000 relative">
           <h1 ref={titleRef} className="text-[clamp(3.5rem,12vw,12rem)] font-bold leading-[1] tracking-tighter mb-8 liquid-gradient-text drop-shadow-2xl" style={{ fontFamily: "var(--font-display)" }}>
             JustBid
           </h1>
        </div>

        <p ref={subtitleRef} className="text-xl md:text-3xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          Stop searching. Start winning. <br />
          <span className="text-primary font-medium">Our Neural AI finds your perfect tenders.</span>
        </p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <div onClick={() => navigate('/auth')}>
            <MagneticButton>
              <span className="relative z-10 font-bold tracking-wide">Start Winning</span>
            </MagneticButton>
          </div>
          <motion.button onClick={() => navigate('/explore')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 text-lg font-medium text-foreground bg-card/50 backdrop-blur-md border border-border/50 rounded-full hover:border-primary/50 transition-all">
            Browse Public Tenders
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center backdrop-blur-sm">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-3 bg-primary rounded-full mt-2" />
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
    gsap.to(button, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" })
  }
  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" })
  }
  return (
    <motion.button ref={buttonRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} whileTap={{ scale: 0.95 }} className="relative px-12 py-4 text-lg font-bold bg-primary text-primary-foreground rounded-full overflow-hidden group shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-shadow">
      <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient" />
      {children}
    </motion.button>
  )
}
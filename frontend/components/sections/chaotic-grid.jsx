"use client"

import { useRef, useEffect, useState, forwardRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    title: "Smart Matching",
    description: "AI analyzes your business profile and matches you with relevant tenders automatically.",
    icon: "match",
    rotation: -3,
    scale: 1,
  },
  {
    title: "Real-time Alerts",
    description: "Get notified instantly when new opportunities match your criteria.",
    icon: "alert",
    rotation: 2,
    scale: 1.05,
  },
  {
    title: "Document Analysis",
    description: "Automatically extract key requirements and deadlines from tender documents.",
    icon: "doc",
    rotation: -2,
    scale: 0.95,
  },
  {
    title: "Bid Tracking",
    description: "Track all your active bids in one place with status updates.",
    icon: "track",
    rotation: 4,
    scale: 1,
  },
  {
    title: "Win Analytics",
    description: "Learn from your wins and losses to improve your success rate.",
    icon: "analytics",
    rotation: -4,
    scale: 1.02,
  },
  {
    title: "Team Collaboration",
    description: "Work together with your team on proposals and share insights.",
    icon: "team",
    rotation: 1,
    scale: 0.98,
  },
]

export function ChaoticGrid() {
  const containerRef = useRef(null)
  const cardsRef = useRef([])
  const titleRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        const text = titleRef.current.textContent || ""
        titleRef.current.innerHTML = text
          .split(" ")
          .map((word) => `<span class="split-word">${word}</span>`)
          .join(" ")

        gsap.fromTo(
          titleRef.current.querySelectorAll(".split-word"),
          { opacity: 0, y: 50, skewY: 5 },
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            stagger: 0.1,
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              end: "top 50%",
              scrub: 1,
            },
          }
        )
      }

      // Cards animation on scroll
      cardsRef.current.forEach((card, i) => {
        if (!card) return

        // Initial scroll reveal
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 100,
            scale: 0.8,
            rotation: gsap.utils.random(-10, 10),
          },
          {
            opacity: 1,
            y: 0,
            scale: features[i].scale,
            rotation: features[i].rotation,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
            },
          }
        )

        // Continuous floating effect
        gsap.to(card, {
          y: "random(-10, 10)",
          rotation: features[i].rotation + gsap.utils.random(-2, 2),
          duration: gsap.utils.random(3, 5),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.3,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Skewed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-card -skew-y-3 scale-110" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-20">
          <h2
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Features that win
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to discover, analyze, and win more tenders.
          </p>
        </div>

        {/* Chaotic grid - intentionally misaligned */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, i) => (
            <TiltCard
              key={i}
              ref={(el) => { cardsRef.current[i] = el }}
              feature={feature}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const TiltCard = forwardRef(function TiltCard({ feature, index }, ref) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / 10
    const y = (e.clientY - rect.top - rect.height / 2) / 10
    setTilt({ x: -y, y: x })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  // Offset positions for chaos effect
  const offsets = [
    "md:translate-y-0",
    "md:translate-y-8",
    "md:translate-y-4",
    "md:translate-y-6",
    "md:translate-y-2",
    "md:translate-y-10",
  ]

  return (
    <motion.div
      ref={(el) => {
        cardRef.current = el
        if (typeof ref === "function") {
          ref(el)
        } else if (ref) {
          ref.current = el
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: "preserve-3d",
      }}
      className={`relative group ${offsets[index]}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-8 hover:border-primary/50 transition-colors duration-300">
        <div className="mb-6">
          <FeatureIcon type={feature.icon} />
        </div>
        <h3
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
})

function FeatureIcon({ type }) {
  const iconClass = "w-12 h-12 text-primary"

  switch (type) {
    case "match":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M8 11h6" />
          <path d="M11 8v6" />
        </svg>
      )
    case "alert":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          <circle cx="18" cy="4" r="3" fill="currentColor" className="text-accent" />
        </svg>
      )
    case "doc":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    case "track":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    case "analytics":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <circle cx="18" cy="8" r="2" fill="currentColor" className="text-accent" />
          <circle cx="12" cy="2" r="2" fill="currentColor" className="text-primary" />
          <circle cx="6" cy="12" r="2" fill="currentColor" className="text-accent" />
        </svg>
      )
    case "team":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    default:
      return null
  }
}

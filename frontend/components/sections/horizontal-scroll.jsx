"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    quote: "JustBid transformed how we find government contracts. Our win rate increased by 40%.",
    author: "Sarah Chen",
    role: "CEO, TechVentures Inc.",
    metric: "40%",
    metricLabel: "Win Rate Increase",
  },
  {
    quote: "The AI matching is incredibly accurate. We no longer waste time on irrelevant tenders.",
    author: "Marcus Johnson",
    role: "Bid Manager, BuildRight Co.",
    metric: "10hrs",
    metricLabel: "Saved Weekly",
  },
  {
    quote: "From discovery to submission, JustBid streamlines our entire bidding process.",
    author: "Elena Rodriguez",
    role: "Director, Global Services Ltd.",
    metric: "3x",
    metricLabel: "More Bids Submitted",
  },
  {
    quote: "The document analysis feature alone is worth the subscription. Game changer.",
    author: "David Kim",
    role: "Operations Lead, NexGen Solutions",
    metric: "85%",
    metricLabel: "Time Saved on Analysis",
  },
  {
    quote: "We discovered opportunities we never knew existed. Expanded to new markets.",
    author: "Amanda Foster",
    role: "Founder, GreenTech Innovations",
    metric: "5",
    metricLabel: "New Markets Entered",
  },
]

export function HorizontalScroll() {
  const containerRef = useRef(null)
  const scrollRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollContainer = scrollRef.current
      const cards = scrollContainer?.children

      if (!scrollContainer || !cards) return

      // Calculate total scroll width
      const totalWidth = scrollContainer.scrollWidth - window.innerWidth

      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "top 50%",
              scrub: 1,
            },
          }
        )
      }

      // Horizontal scroll animation
      gsap.to(scrollContainer, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // Individual card animations
      Array.from(cards).forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0.5,
            scale: 0.9,
            rotateY: 15,
          },
          {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            scrollTrigger: {
              trigger: card,
              containerAnimation: gsap.to(scrollContainer, { x: -totalWidth }),
              start: "left 80%",
              end: "left 50%",
              scrub: 1,
            },
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative bg-gradient-to-b from-background via-card/50 to-background"
    >
      {/* Section title */}
      <div
        ref={titleRef}
        className="absolute top-16 left-1/2 -translate-x-1/2 z-20 text-center"
      >
        <h2
          className="text-4xl md:text-6xl font-bold mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Loved by winners
        </h2>
        <p className="text-muted-foreground">Scroll to explore stories</p>
      </div>

      {/* Horizontal scroll container */}
      <div className="h-screen flex items-center overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-8 pl-[10vw] pr-[50vw] pt-24"
          style={{ perspective: "1000px" }}
        >
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={i} testimonial={testimonial} index={i} />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground">
        <svg className="w-5 h-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span className="text-sm">Keep scrolling</span>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial, index }) {
  const colors = [
    "from-blue-500/20 to-cyan-500/20",
    "from-primary/20 to-accent/20",
    "from-green-500/20 to-emerald-500/20",
    "from-pink-500/20 to-rose-500/20",
    "from-indigo-500/20 to-purple-500/20",
  ]

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: -5 }}
      className="relative flex-shrink-0 w-[80vw] md:w-[50vw] lg:w-[35vw]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[index]} rounded-3xl blur-xl opacity-50`} />
      <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-12 h-full">
        {/* Metric highlight */}
        <div className="mb-8 text-center">
          <div
            className="text-6xl md:text-7xl font-bold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {testimonial.metric}
          </div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">
            {testimonial.metricLabel}
          </div>
        </div>

        {/* Quote */}
        <blockquote className="relative mb-8">
          <svg
            className="absolute -top-4 -left-2 w-8 h-8 text-primary/20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-xl md:text-2xl leading-relaxed pl-6">
            {testimonial.quote}
          </p>
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
            {testimonial.author.charAt(0)}
          </div>
          <div>
            <div className="font-semibold">{testimonial.author}</div>
            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const storyContent = [
  {
    text: "Finding tenders is broken.",
    highlight: "broken",
  },
  {
    text: "Hours wasted searching multiple portals.",
    highlight: "wasted",
  },
  {
    text: "Opportunities missed due to information overload.",
    highlight: "missed",
  },
  {
    text: "What if AI could do the heavy lifting?",
    highlight: "AI",
  },
]

export function Story() {
  const containerRef = useRef(null)
  const textRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Immersive transition from hero
      gsap.fromTo(
        containerRef.current,
        { y: 100, opacity: 0.5 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "top center",
            scrub: 1,
          },
        }
      )

      // Animate each story text
      textRefs.current.forEach((textRef, i) => {
        if (!textRef) return

        const words = textRef.querySelectorAll(".word")
        const highlight = textRef.querySelector(".highlight-word")
        const image = textRef.querySelector(".story-image")

        // Words fade in with stagger
        gsap.fromTo(
          words,
          {
            opacity: 0,
            y: 50,
            rotateX: -45,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.05,
            scrollTrigger: {
              trigger: textRef,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          }
        )

        // Highlight word pulses
        if (highlight) {
          gsap.to(highlight, {
            scale: 1.1,
            color: "var(--primary)",
            scrollTrigger: {
              trigger: textRef,
              start: "top 50%",
              end: "top 30%",
              scrub: 1,
            },
          })
        }

        // Image slides in diagonally
        if (image) {
          gsap.fromTo(
            image,
            {
              x: i % 2 === 0 ? 200 : -200,
              y: 100,
              opacity: 0,
              rotation: i % 2 === 0 ? 15 : -15,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              rotation: i % 2 === 0 ? 5 : -5,
              scrollTrigger: {
                trigger: textRef,
                start: "top 70%",
                end: "top 30%",
                scrub: 1,
              },
            }
          )
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const splitIntoWords = (text, highlightWord) => {
    return text.split(" ").map((word, i) => {
      const isHighlight = word.toLowerCase().includes(highlightWord.toLowerCase())
      return (
        <span
          key={i}
          className={`word inline-block mr-[0.25em] ${
            isHighlight ? "highlight-word text-primary font-bold" : ""
          }`}
        >
          {word}
        </span>
      )
    })
  }

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 bg-gradient-to-b from-background via-card to-background"
    >
      {/* Parallax background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="container mx-auto px-6">
        {storyContent.map((story, i) => (
          <div
            key={i}
            ref={(el) => { textRefs.current[i] = el }}
            className="relative min-h-[50vh] flex items-center mb-24 last:mb-0"
          >
            <div
              className={`flex flex-col md:flex-row items-center gap-12 w-full ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Text content */}
              <div className="flex-1 text-center md:text-left">
                <h2
                  className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {splitIntoWords(story.text, story.highlight)}
                </h2>
              </div>

              {/* Decorative image/element */}
              <div className="flex-1 flex justify-center">
                <div className="story-image relative w-64 h-64 md:w-80 md:h-80">
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${
                      i === 0
                        ? "from-red-500/20 to-orange-500/20 border-red-500/30"
                        : i === 1
                        ? "from-yellow-500/20 to-amber-500/20 border-yellow-500/30"
                        : i === 2
                        ? "from-blue-500/20 to-cyan-500/20 border-blue-500/30"
                        : "from-primary/20 to-accent/20 border-primary/30"
                    } border backdrop-blur-sm`}
                  >
                    <div className="absolute inset-4 flex items-center justify-center">
                      {i === 0 && <BrokenIcon />}
                      {i === 1 && <TimeIcon />}
                      {i === 2 && <OverloadIcon />}
                      {i === 3 && <AIIcon />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function BrokenIcon() {
  return (
    <svg className="w-32 h-32 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <line x1="4" y1="4" x2="20" y2="20" strokeWidth="2" className="text-red-500" />
    </svg>
  )
}

function TimeIcon() {
  return (
    <svg className="w-32 h-32 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
      <path d="M22 22l-4-4" strokeWidth="2" />
    </svg>
  )
}

function OverloadIcon() {
  return (
    <svg className="w-32 h-32 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <circle cx="12" cy="12" r="3" className="text-blue-500" fill="currentColor" />
    </svg>
  )
}

function AIIcon() {
  return (
    <svg className="w-32 h-32 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 12l6-6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M20 4v4h-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

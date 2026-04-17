

import { useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Link, useNavigate } from "react-router-dom"

import { Hero } from "@/components/sections/hero"
import { Story } from "@/components/sections/story"
import { BentoFeatures } from "@/components/sections/bento-features"
import { ChaoticGrid } from "@/components/sections/chaotic-grid"
import { PinnedProcess } from "@/components/sections/pinned-process"
import { HorizontalScroll } from "@/components/sections/horizontal-scroll"
import { BigText } from "@/components/sections/big-text"
import { DashboardPreview } from "@/components/sections/dashboard-preview"
import { FinalCTA } from "@/components/sections/final-cta"
import { Navbar } from "@/components/ui/navbar"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
  // ScrollSmoother requires GSAP membership, so we'll use native smooth scrolling
}

export default function Home() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Refresh ScrollTrigger on page load
    ScrollTrigger.refresh()

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth"

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <main className="relative min-h-screen bg-background selection:bg-primary/30">
      <div className="grain-overlay" />
      <Navbar />

      {/* Hero Section - Funky entry with big typography */}
      <Hero />

      {/* Immersive transition with story narrative */}
      <Story />

      {/* Bento Grid - World Class Features */}
      <BentoFeatures />

      {/* Chaotic Grid - Features with intentional misalignment */}
      <section id="features">
        <ChaoticGrid />
      </section>

      {/* Pinned Section - Step by step process */}
      <section id="how-it-works">
        <PinnedProcess />
      </section>

      {/* Horizontal Scroll - Testimonials */}
      <section id="testimonials">
        <HorizontalScroll />
      </section>

      {/* Big Text Animation */}
      <BigText />

      {/* Dashboard Preview with animated stats */}
      <DashboardPreview />

      {/* Final CTA with glitch effect */}
      <FinalCTA />
    </main>
  )
}

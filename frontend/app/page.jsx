

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Link } from "react-router-dom"

import { Hero } from "@/components/sections/hero"
import { Story } from "@/components/sections/story"
import { ChaoticGrid } from "@/components/sections/chaotic-grid"
import { PinnedProcess } from "@/components/sections/pinned-process"
import { HorizontalScroll } from "@/components/sections/horizontal-scroll"
import { BigText } from "@/components/sections/big-text"
import { DashboardPreview } from "@/components/sections/dashboard-preview"
import { FinalCTA } from "@/components/sections/final-cta"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
  // ScrollSmoother requires GSAP membership, so we'll use native smooth scrolling
}

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger on page load
    ScrollTrigger.refresh()

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth"

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <main className="relative">


      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <a 
            href="#" 
            className="text-2xl font-bold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            JustBid
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Stories
            </a>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/auth" className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
              Get Started
            </Link>
          </div>
          <button className="md:hidden text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section - Funky entry with big typography */}
      <Hero />

      {/* Immersive transition with story narrative */}
      <Story />

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

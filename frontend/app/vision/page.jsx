"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Navbar } from "@/components/ui/navbar"
import {
  Cpu,
  Globe,
  MessageSquareCode,
  Rocket,
  Orbit,
  Binary
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const milestones = [
  {
    year: "2026",
    phase: "Alpha_Node",
    title: "Global Ingestion Protocol",
    description: "Standardizing chaotic procurement data at scale. Our spider-agents will index 1,000+ sources per second, establishing the first unified global procurement index.",
    icon: <Globe size={20} />,
    color: "from-primary/40 to-transparent",
    tech: ["Web-Sockets", "L-0 Node", "Elastic-Search"]
  },
  {
    year: "2027",
    phase: "Beta_Synapse",
    title: "NLP Synthesis Layer",
    description: "Moving from search to understanding. Neural engines that automatically cross-reference tender requirements with business capabilities to draft 90% of compliant documentation.",
    icon: <MessageSquareCode size={20} />,
    color: "from-accent/40 to-transparent",
    tech: ["Transformer-v4", "Vector-DB", "LLAMA-9"]
  },
  {
    year: "2028",
    phase: "Delta_Oracle",
    title: "Predictive Game Theory",
    description: "Algorithmic determination of competitor behavior. Predicting optimal bid thresholds and contract award probabilities using historical pricing anomalies.",
    icon: <Cpu size={20} />,
    color: "from-green-500/40 to-transparent",
    tech: ["Monte-Carlo", "Game-AI", "HFT-Logic"]
  },
  {
    year: "2029",
    phase: "Omega_Agent",
    title: "Autonomous Agentic Flow",
    description: "The singularity of procurement. Fully autonomous bid cycles—from identification to final verification—requiring only institutional confirmation to execute.",
    icon: <Rocket size={20} />,
    color: "from-purple-500/40 to-transparent",
    tech: ["Autonomous-Agents", "ZK-Proofs", "Smart-Contracts"]
  }
]

export default function VisionPage() {
  const containerRef = useRef(null)
  const milestoneRefs = useRef([])

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      // Milestone reveals - Asymmetrical and Raw
      milestoneRefs.current.forEach((ref, index) => {
        gsap.fromTo(ref,
          {
            opacity: 0,
            y: 100,
            skewY: 5
          },
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 1.2,
            scrollTrigger: {
              trigger: ref,
              start: "top 90%",
              end: "top 60%",
              scrub: 1,
            }
          }
        )
      })

      // Background Line Animation
      gsap.to(".bg-grid-line", {
        scaleY: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={containerRef} className="bg-[#050508] text-[#e0e0e6] min-h-screen relative overflow-hidden font-mono selection:bg-primary/40 selection:text-white">

      {/* Premium Overlays */}
      <div className="grain-overlay" />
      <div className="scanline" />

      <Navbar />

      {/* Side HUD Elements */}
      <div className="fixed top-1/2 left-6 -translate-y-1/2 z-20 flex-col gap-8 hidden lg:flex opacity-20 hover:opacity-100 transition-opacity">
        <div className="text-[8px] vertical-text tracking-[0.6em] uppercase">Coord: 34.0522 // 118.2437</div>
        <div className="w-px h-20 bg-primary/40 mx-auto" />
        <div className="text-[8px] vertical-text tracking-[0.6em] uppercase">Status: Indexing_Live</div>
      </div>

      <div className="fixed top-1/2 right-6 -translate-y-1/2 z-20 flex-col gap-8 hidden lg:flex opacity-20">
        <div className="text-[10px] font-bold text-primary">0%</div>
        <div className="w-px h-20 bg-white/10 mx-auto" />
        <div className="text-[10px] font-bold">100%</div>
      </div>

      {/* Corner Crosshairs */}
      <div className="fixed top-0 left-0 w-12 h-12 border-t border-l border-white/10 z-0 m-4" />
      <div className="fixed bottom-0 right-0 w-12 h-12 border-b border-r border-white/10 z-0 m-4" />

      {/* Hero Header - Engineering Schematic Style */}
      <div className="relative z-10 pt-48 pb-32 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-12">
        <div className="text-left flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6 text-primary"
          >
            <Binary size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">SYSTEM://JB_VISION_CORE_2K26</span>
          </motion.div>

          <h1 className="text-7xl md:text-9xl font-bold monolithic-text mb-8 tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
            Engineered <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary/20">Outcome</span>
          </h1>

          <p className="text-lg text-muted-foreground/60 max-w-lg leading-relaxed lowercase">
            [INTERNAL_PROTOCOL]: eradicating manual discovery. deploying distributed neural nodes to capture every circulate in the global supply chain.
          </p>
        </div>

        <div className="hidden lg:block w-px h-96 bg-white/5 relative">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/20 animate-pulse" />
        </div>

        <div className="text-right hidden md:block">
          <div className="mb-6">
            <div className="text-[10px] text-primary mb-1 uppercase tracking-widest">Active_Clusters</div>
            <div className="text-3xl font-bold font-mono">1,024</div>
          </div>
          <Orbit size={100} className="text-white/5 animate-spin p-4 border border-white/5 rounded-full" style={{ animationDuration: '60s' }} />
          <div className="text-[10px] text-white/20 mt-4 uppercase tracking-[0.5em]">Terminal_Active</div>
        </div>
      </div>

      {/* Roadmap Section - Engineering Grid */}
      <div className="relative z-10 container mx-auto px-6 pb-60">

        {/* Asymmetrical Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-32">
          {milestones.map((st, i) => (
            <div
              key={i}
              ref={el => milestoneRefs.current[i] = el}
              className={`md:col-span-12 lg:col-span-10 ${i % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-3 text-right'}`}
            >
              <div className={`flex flex-col md:flex-row gap-8 md:items-start group ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>

                {/* Phase Label */}
                <div className="shrink-0 pt-2">
                  <div className="px-5 py-1.5 border border-white/10 rounded-full text-[10px] font-bold text-primary bg-primary/5 uppercase tracking-[0.2em] shadow-lg shadow-primary/5">
                    {st.phase}
                  </div>
                </div>

                {/* Main Content Card */}
                <div className={`flex-1 border-white/5 group-hover:border-primary/20 transition-all ${i % 2 === 0 ? 'border-l-2 pl-8 lg:pl-16' : 'border-r-2 pr-8 lg:pr-16'}`}>
                  <div className="text-sm font-bold text-white/10 mb-3 font-mono">{st.year} // NODE_ID: {Math.floor(Math.random() * 1000)}</div>
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tighter text-white uppercase" style={{ fontFamily: "var(--font-display)" }}>
                    {st.title}
                  </h2>
                  <p className={`max-w-2xl text-xl text-muted-foreground/80 lowercase leading-relaxed mb-10 ${i % 2 === 0 ? '' : 'ml-auto'}`}>
                    {st.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className={`flex flex-wrap gap-3 ${i % 2 === 0 ? '' : 'justify-end'}`}>
                    {st.tech.map(t => (
                      <span key={t} className="text-[10px] font-bold border border-white/10 px-3 py-1 rounded bg-white/5 uppercase opacity-30 hover:opacity-100 transition-opacity">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Data Feed Simulation - New Technical Section */}
      <div className="relative z-10 bg-black/40 border-t border-white/5 py-4 overflow-hidden whitespace-nowrap">
        <div className="flex gap-12 animate-marquee opacity-20 font-mono text-[10px] uppercase">
          {[...Array(20)].map((_, i) => (
            <span key={i}>
              &lt;LOG&gt;: Fetching_Node_{Math.floor(Math.random() * 100)}... STATUS: OK ... DATA: {Math.random().toString(16).substring(2, 10)} ...
            </span>
          ))}
        </div>
      </div>

      {/* Footer Closing */}
      <div className="relative z-10 py-60 text-center border-t border-white/5 bg-black/60 backdrop-blur-3xl">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex justify-center">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center animate-bounce">
              <Binary className="text-primary" />
            </div>
          </div>
          <h2 className="text-5xl md:text-8xl font-black monolithic-text mb-12" style={{ fontFamily: "var(--font-display)" }}>
            The Future is <br /> <span className="text-primary">Programmable.</span>
          </h2>
          <Link to="/auth" className="cyber-border px-12 py-6 text-sm font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
            Initialize_Access
          </Link>
        </div>
      </div>

      {/* Visual Schematics - Pure aesthetic background layers */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[200px] pointer-events-none" />

    </main>
  )
}

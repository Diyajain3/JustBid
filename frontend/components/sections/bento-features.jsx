"use client"

import { useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { GlobeComponent } from "@/components/ui/globe-component"
import { Zap, ShieldCheck, Database, SearchCode } from "lucide-react"

export function BentoFeatures() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="mb-16 md:mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            A Complete Neural Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Not just another search tool. JustBid is a multi-agent system designed to completely automate your revenue pipeline.
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          
          {/* Main Globe Cell - spans 2 columns on desktop */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
            }}
            className="md:col-span-2 bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:border-primary/40 transition-colors"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] group-hover:bg-accent/20 transition-colors" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-primary/20 rounded-xl">
                   <Zap size={24} className="text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Global Real-Time Scraping</h3>
              </div>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">
                Our lightweight python nodes continuously monitor global tender boards such as SAM.gov, TED Europe, and regional APIs in real-time.
              </p>
              <div className="mt-auto h-[300px] md:h-[400px] w-full relative flex items-center justify-center">
                 {/* The Interactive Globe */}
                 <div className="absolute inset-x-0 bottom-[-100px] h-[500px] pointer-events-auto">
                    <GlobeComponent />
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Typing Terminal Cell */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
            }}
            className="bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-8 relative overflow-hidden group hover:border-accent/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-accent/20 rounded-xl">
                   <SearchCode size={24} className="text-accent" />
                </div>
                <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>NLP Match Engine</h3>
            </div>
            <p className="text-muted-foreground mb-8">
              Every document is parsed using state-of-the-art Natural Language Processing to find hidden requirements.
            </p>
            
            {/* Simplified Strategic Identity Visual - Static and non-distracting */}
            <div className="relative w-full h-[220px] bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 grid grid-cols-6 gap-px">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="border-[0.5px] border-white/10 w-full h-full" />
                  ))}
                </div>
              </div>

              <div className="relative z-10 text-center space-y-4">
                <div className="text-4xl font-bold text-primary/80" style={{ fontFamily: "var(--font-display)" }}>
                  94.2%
                </div>
                <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary font-bold uppercase tracking-widest">
                  Neural Match Verified
                </div>
              </div>

              <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center opacity-30">
                 <div className="text-[8px] font-mono text-white/40 uppercase tracking-[0.2em]">PROC_NODE: A9-02</div>
                 <div className="text-[8px] font-mono text-white/40 uppercase tracking-[0.2em]">VECTOR_SPACE_01</div>
              </div>
            </div>
          </motion.div>

          {/* Analytics Cell */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
            }}
            className="bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-8 relative overflow-hidden group hover:border-green-500/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-green-500/20 rounded-xl">
                     <Database size={24} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Instant Architecture</h3>
              </div>
              <p className="text-muted-foreground">
                Tired of messy data? We centralize millions of data points into beautiful, standard JSON structures.
              </p>
            </div>
            
            {/* Mock Chart Animation */}
            <div className="mt-8 flex items-end justify-between h-32 gap-3 px-4">
               {[40, 70, 55, 90, 65, 100].map((height, i) => (
                 <motion.div 
                   key={i}
                   initial={{ height: 0 }}
                   whileInView={{ height: `${height}%` }}
                   transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                   viewport={{ once: true }}
                   className={`w-full rounded-t-md ${i === 5 ? 'bg-primary' : 'bg-primary/20'}`}
                 />
               ))}
            </div>
          </motion.div>

          {/* Security Card - spans 2 columns on mostly wide screens */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } }
            }}
            className="md:col-span-2 bg-gradient-to-br from-card/40 to-primary/5 backdrop-blur-md border border-border/50 rounded-3xl p-8 relative overflow-hidden group hover:border-primary/40 transition-colors flex flex-col md:flex-row items-center gap-8 justify-between"
          >
             <div className="flex-1">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-foreground/10 rounded-xl">
                     <ShieldCheck size={24} className="text-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Secure API Integration</h3>
               </div>
               <p className="text-muted-foreground text-lg mb-0 max-w-md">
                 Need data natively? Authenticate via JWT and pass data streams perfectly directly into your internal infrastructure.
               </p>
             </div>
             
             <div className="w-full md:w-1/2 p-6 bg-background/50 rounded-2xl border border-white/5 relative overflow-hidden backdrop-blur-md flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="text-center">
                   <div className="text-4xl px-4 py-2 bg-secondary/80 rounded-full font-mono text-primary animate-pulse tracking-widest shadow-inner inline-block">
                     ***** *********
                   </div>
                   <p className="text-xs text-muted-foreground font-mono mt-4 uppercase tracking-widest">Encrypted Tunnel</p>
                </div>
             </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { FileSearch, Sparkles, ChevronRight, Binary } from "lucide-react"
import { Link } from "react-router-dom"

export function DocumentAnalysisCard() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <Link to="/analysis">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02 }}
        className="relative group h-[200px] w-full rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 overflow-hidden cursor-pointer backdrop-blur-xl"
      >
        {/* Dynamic Glare */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-radial from-primary/20 via-transparent to-transparent -translate-x-1/2 -translate-y-1/2" style={{ pointerEvents: "none" }} />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity" />

        <div className="relative z-10 p-8 h-full flex flex-col justify-between" style={{ transform: "translateZ(50px)" }}>
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(var(--primary),0.2)] group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <FileSearch size={24} />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
              <Sparkles size={10} className="animate-pulse" />
              AI Activated
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">
              <Binary size={12} />
              Strategic Extraction
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">Document Analysis</h3>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground group-hover:text-white/70 transition-colors">Extract requirements & deadlines instantly.</p>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Scan Line Animation */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent -translate-y-full group-hover:animate-scan-line" />
      </motion.div>
    </Link>
  )
}

import { useRef, useState } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { Globe, ArrowRight, ChevronDown, ChevronUp, BrainCircuit } from "lucide-react"
import { CircularGauge } from "./circular-gauge"

export function TenderCard3D({ tender, onMatchClick, index }) {
  const ref = useRef(null)
  const [isExpanded, setIsExpanded] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const glareOpacity = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)

  // Add smooth spring physics
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useMotionTemplate`${mouseYSpring}deg`
  const rotateY = useMotionTemplate`${mouseXSpring}deg`
  const glareXSpring = useSpring(glareX, { stiffness: 300, damping: 30 })
  const glareYSpring = useSpring(glareY, { stiffness: 300, damping: 30 })
  
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareXSpring}% ${glareYSpring}%, rgba(255,255,255,0.12) 0%, transparent 60%)`

  const handleMouseMove = (e) => {
    if (!ref.current || isExpanded) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const rX = ((mouseY / height) - 0.5) * -12
    const rY = ((mouseX / width) - 0.5) * 12
    
    x.set(rY)
    y.set(rX)
    glareX.set((mouseX / width) * 100)
    glareY.set((mouseY / height) * 100)
    glareOpacity.set(1)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    glareOpacity.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsExpanded(!isExpanded)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(0.5, index * 0.05), duration: 0.4 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-white/5 transition-all duration-500 hover:border-primary/40 group shadow-2xl cursor-pointer ${isExpanded ? 'ring-1 ring-primary/30 shadow-primary/10' : ''}`}
    >
      {/* Dynamic Glare */}
      <motion.div 
        style={{ background: glareBackground, opacity: glareOpacity }}
        className="absolute inset-0 z-30 pointer-events-none rounded-2xl"
      />

      <div className="flex flex-col md:flex-row gap-6 p-7 relative z-20" style={{ transform: "translateZ(40px)" }}>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px] font-black text-primary px-2.5 py-1 bg-primary/10 rounded-lg uppercase tracking-[0.2em] border border-primary/20 backdrop-blur-md">
                <Globe size={12} /> {tender.location}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/40 tracking-wider">REF: {tender.externalId?.substring(0, 8)}</span>
            </div>
            
            {tender.matchScore && (
              <div className="md:hidden">
                 <CircularGauge size={40} percentage={tender.matchScore} strokeWidth={4} />
              </div>
            )}
          </div>

          <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors pr-10" style={{ fontFamily: "var(--font-display)" }}>
            {tender.title}
          </h3>
          
          <div className="relative mb-4">
            <motion.div
              animate={{ height: isExpanded ? "auto" : "56px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div 
                className={`text-muted-foreground/80 text-[13px] leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}
                dangerouslySetInnerHTML={{ __html: tender.description || "In-depth intelligence analysis pending final ingestion..." }}
              />
              
              <AnimatePresence>
                {isExpanded && tender.matchReasons && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10"
                  >
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-3">
                      <BrainCircuit size={14} /> AI Resonance Logs
                    </h4>
                    <ul className="space-y-2">
                       {tender.matchReasons.map((reason, i) => (
                         <li key={i} className="text-xs text-foreground/70 flex items-start gap-2">
                            <span className="text-primary mt-1">●</span> {reason}
                         </li>
                       ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent pointer-events-none" />
            )}
          </div>

          <div className="flex items-center gap-2 text-primary/50 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
            {isExpanded ? "Collapse Protocol" : "Deep Scan Intelligence"} 
            <motion.div animate={{ y: isExpanded ? -2 : 2 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}>
              <ChevronDown size={14} className={isExpanded ? "rotate-180" : ""} />
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-2 mt-auto pt-6">
            {tender.cpvCodes?.slice(0, 3).map((code, idx) => (
              <span key={idx} className="text-[9px] font-bold bg-white/5 text-muted-foreground px-2 py-0.5 rounded-md border border-white/5 uppercase tracking-wider">
                {code}
              </span>
            )}
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 min-w-[240px] flex flex-col justify-between items-end">
          <div className="w-full relative">
            {tender.matchScore && (
              <div className="hidden md:flex absolute -top-2 -right-2">
                 <div className="relative group/gauge">
                    <CircularGauge size={64} percentage={tender.matchScore} strokeWidth={6} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/gauge:opacity-100 transition-opacity bg-background/80 rounded-full">
                       <span className="text-[8px] font-black uppercase">Alpha</span>
                       <span className="text-xs font-bold">{tender.matchScore}%</span>
                    </div>
                 </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-1 font-black">Capital Target</p>
                <p className="text-3xl font-bold tracking-tighter text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {tender.budget ? `$${tender.budget.toLocaleString()}` : "Confidential"}
                </p>
                <div className="w-full h-1 bg-white/5 mt-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: tender.budget ? "100%" : "30%" }}
                    className={`h-full ${tender.budget ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} 
                  />
                </div>
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-1 font-black">Extraction Limit</p>
                <p className="text-lg font-bold text-red-400 tabular-nums">
                  {tender.deadline ? new Date(tender.deadline).toLocaleDateString() : "Pending"}
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation()
              onMatchClick()
            }} 
            className="w-full mt-10 bg-white text-black hover:bg-primary hover:text-white px-5 py-4 rounded-xl transition-all duration-300 font-black text-xs uppercase tracking-[0.2em] flex justify-between items-center shadow-xl hover:shadow-primary/40 active:scale-95"
          >
            Initiate Bid <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
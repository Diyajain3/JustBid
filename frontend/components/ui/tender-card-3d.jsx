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

  // Add smooth spring physics for buttery smooth motion
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 })

  const rotateX = useMotionTemplate`${mouseYSpring}deg`
  const rotateY = useMotionTemplate`${mouseXSpring}deg`
  const glareXSpring = useSpring(glareX, { stiffness: 150, damping: 20 })
  const glareYSpring = useSpring(glareY, { stiffness: 150, damping: 20 })

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareXSpring}% ${glareYSpring}%, rgba(var(--primary), 0.15) 0%, transparent 65%)`

  const handleMouseMove = (e) => {
    if (!ref.current || isExpanded) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const rX = ((mouseY / height) - 0.5) * -10 // Increased tilt slightly for more depth
    const rY = ((mouseX / width) - 0.5) * 10

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform"
      }}
      className={`relative w-full rounded-3xl bg-gradient-to-br from-card/90 to-card/40 border border-white/5 backdrop-blur-xl transition-all duration-500 hover:border-primary/40 group shadow-2xl cursor-pointer ${isExpanded ? 'ring-2 ring-primary/20 shadow-primary/5' : ''}`}
    >
      {/* Dynamic Glare - Now using primary color for premium feel */}
      <motion.div
        style={{ background: glareBackground, opacity: glareOpacity }}
        className="absolute inset-0 z-30 pointer-events-none rounded-3xl"
      />

      <div className="flex flex-col md:flex-row gap-8 p-8 relative z-20" style={{ transform: "translateZ(50px)" }}></div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[10px] font-black text-primary px-3 py-1.5 bg-primary/10 rounded-full uppercase tracking-[0.3em] border border-primary/20 backdrop-blur-md">
              <Globe size={12} className="animate-pulse" /> {tender.location || "Global Region"}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Operational Status: Active</span>
          </div>

          {tender.matchScore && (
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black uppercase text-primary/40 tracking-widest">Neural Resonance</span>
                <span className="text-[12px] font-black text-primary tracking-tighter">{tender.matchScore}%</span>
              </div>
              <CircularGauge size={40} percentage={tender.matchScore} strokeWidth={4} />
            </div>
          )}
        </div>

        <h3 className="text-3xl font-bold mb-5 leading-[1.1] group-hover:text-primary transition-colors pr-12 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          {tender.title}
        </h3>

        <div className="relative mb-6">
          <div
            className="text-muted-foreground/70 text-[14px] leading-relaxed line-clamp-3 mb-6 whitespace-pre-wrap italic opacity-80"
            dangerouslySetInnerHTML={{ __html: tender.description || "Synthesizing intelligence protocols..." }}
          />

          {tender.matchReasons && (
            <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 backdrop-blur-md relative overflow-hidden group/intel shadow-inner">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.6)]" />
              <h4 className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">
                <BrainCircuit size={16} className="animate-pulse text-primary" /> Intelligence Vector Analysis
              </h4>
              <ul className="space-y-2">
                {tender.matchReasons.slice(0, 2).map((reason, i) => (
                  <li key={i} className="text-[12px] text-foreground/80 flex items-start gap-3 leading-tight font-medium">
                    <span className="text-primary mt-1 shrink-0 text-[8px]">▶</span> {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-primary/40 text-[11px] font-black uppercase tracking-[0.3em] group-hover:text-primary transition-all duration-300">
          {isExpanded ? "Collapse Intel" : "Expand Full Intelligence"}
          <motion.div animate={{ y: isExpanded ? -3 : 3 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}>
            <ChevronDown size={14} className={`transition-transform duration-500 ${isExpanded ? "rotate-180 text-primary" : ""}`} />
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-8 text-sm text-muted-foreground border-t border-white/5 mt-6 space-y-6">
                <p className="leading-relaxed opacity-90 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: tender.description }} />
                {tender.matchReasons && tender.matchReasons.length > 2 && (
                  <div className="space-y-2.5 p-4 rounded-2xl bg-white/5">
                    {tender.matchReasons.slice(2).map((reason, i) => (
                      <p key={i} className="text-xs flex items-start gap-3 opacity-70">
                        <span className="text-primary/40 mt-1 shrink-0">▶</span> {reason}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-2.5 mt-auto pt-8">
          {tender.cpvCodes?.slice(0, 3).map((code, idx) => (
            <span
              key={idx}
              className="text-[10px] font-black bg-white/5 text-muted-foreground/60 px-3 py-1 rounded-xl border border-white/5 uppercase tracking-widest hover:border-primary/20 hover:text-primary transition-colors"
            >
              {code}
            </span>
          ))}
        </div>

        <div className="border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-10 min-w-[260px] flex flex-col justify-between items-end">
          <div className="w-full relative">

            <div className="space-y-8">
              <div className="group/budget">
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-2 font-black opacity-50 group-hover/budget:opacity-100 transition-opacity">Fiscal Allocation</p>
                <p className="text-4xl font-bold tracking-tighter text-white group-hover/budget:text-primary transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                  {tender.budget ? `${typeof tender.budget === 'number' ? '$' + tender.budget.toLocaleString() : tender.budget}` : "Confidential"}
                </p>
                <div className="w-full h-1.5 bg-white/5 mt-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: tender.budget ? "100%" : "20%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full ${tender.budget ? 'bg-primary shadow-[0_0_15px_rgba(var(--primary),0.4)]' : 'bg-red-500/50'}`}
                  />
                </div>
              </div>

              <div className="group/deadline">
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-2 font-black opacity-50 group-hover/deadline:opacity-100 transition-opacity">Temporal Limit</p>
                <p className="text-xl font-black text-red-400 tabular-nums tracking-tight">
                  {tender.deadline ? new Date(tender.deadline).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : "Authorization Pending"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onMatchClick()
            }}
            className="w-full mt-12 bg-white text-black hover:bg-primary hover:text-white px-6 py-4.5 rounded-2xl transition-all duration-500 font-black text-xs uppercase tracking-[0.3em] flex justify-between items-center shadow-2xl hover:shadow-primary/50 active:scale-95 group/btn overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 -translate-x-full group-hover/btn:animate-shimmer" />
            <span className="relative z-10">Initiate Strategy</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

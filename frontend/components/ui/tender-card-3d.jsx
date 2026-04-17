import { useRef, useState } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { Globe, ArrowRight } from "lucide-react"

export function TenderCard3D({ tender, onMatchClick, index }) {
  const ref = useRef(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Add smooth spring physics
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })

  const rotateX = useMotionTemplate`${mouseYSpring}deg`
  const rotateY = useMotionTemplate`${mouseXSpring}deg`
  const glareX = useMotionTemplate`${useSpring(useMotionValue(50), { stiffness: 200, damping: 20 })}%`
  const glareY = useMotionTemplate`${useSpring(useMotionValue(50), { stiffness: 200, damping: 20 })}%`

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    
    // Calculate mouse position relative to the card's center
    const width = rect.width
    const height = rect.height
    
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    // Calculate rotation (-15 to +15 degrees)
    const rX = ((mouseY / height) - 0.5) * -15
    const rY = ((mouseX / width) - 0.5) * 15
    
    x.set(rY)
    y.set(rX)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(0.5, index * 0.1), duration: 0.5 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full rounded-2xl bg-card border border-border transition-colors hover:border-primary/50 group shadow-lg cursor-pointer"
    >
      {/* Glare effect */}
      <div 
        className="absolute inset-0 z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />

      <div className="flex flex-col md:flex-row gap-6 p-6 relative z-20" style={{ transform: "translateZ(30px)" }}>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center gap-1 text-xs font-bold text-accent px-2 py-1 bg-accent/10 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-[0_0_10px_rgba(var(--accent),0.2)]">
              <Globe size={12} /> {tender.location}
            </span>
            <span className="text-xs text-muted-foreground">ID: {tender.externalId}</span>
          </div>
          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{tender.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-3 mb-4">
            {tender.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {tender.cpvCodes?.map((code, idx) => (
              <span key={idx} className="text-xs bg-secondary text-foreground/70 px-2 py-1 rounded">
                {code}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6 min-w-[200px] flex flex-col justify-between items-end text-right">
          <div className="w-full">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Budget Setup</p>
            <p className="text-2xl font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.2)]">
              {tender.budget ? `$${tender.budget.toLocaleString()}` : "Confidential"}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-4 mb-1">Deadline Date</p>
            <p className="font-medium text-sm text-red-400">{new Date(tender.deadline).toLocaleDateString()}</p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              onMatchClick()
            }} 
            className="w-full mt-6 bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground px-4 py-3 rounded-xl transition-all duration-300 font-medium flex justify-between items-center hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:-translate-y-1"
          >
            Match With AI <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

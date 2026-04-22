import { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { Users, ArrowRight } from "lucide-react"

export function TeamCollaborationCard({ onClick }) {
  const ref = useRef(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const glareOpacity = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)

  // Smooth spring physics for rotation
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useMotionTemplate`${mouseYSpring}deg`
  const rotateY = useMotionTemplate`${mouseXSpring}deg`
  
  // Glare effect background
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(212, 175, 55, 0.15) 0%, transparent 60%)`

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    // Calculate rotation based on mouse position (max 10 degrees)
    const rX = ((mouseY / height) - 0.5) * -10
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
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      className="relative w-full max-w-md aspect-[1.4/1] rounded-3xl bg-black/40 border border-primary/20 backdrop-blur-2xl group cursor-pointer overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-colors hover:border-primary/40"
    >
      {/* Dynamic Glare Layer */}
      <motion.div 
        style={{ background: glareBackground, opacity: glareOpacity }}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      <div className="p-8 h-full flex flex-col justify-between relative z-20" style={{ transform: "translateZ(60px)" }}>
        <div>
          {/* Icon Container */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <Users size={28} className="text-primary" />
          </div>
          
          <h3 className="text-3xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Team Collaboration
          </h3>
          
          <p className="text-muted-foreground leading-relaxed text-base opacity-70 max-w-[280px]">
            Work together with your team on proposals and share insights.
          </p>
        </div>

        <div className="flex items-center gap-3 text-primary/80 font-bold text-xs uppercase tracking-[0.2em] group-hover:text-primary group-hover:gap-5 transition-all">
          <span>Initialize Hub</span>
          <ArrowRight size={16} />
        </div>
      </div>

      {/* Background Decorative Glow */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-primary/10 transition-colors" />
      
      {/* Border Glow Pulse */}
      <div className="absolute inset-0 rounded-3xl border border-primary/0 group-hover:border-primary/20 transition-all duration-700" />
    </motion.div>
  )
}

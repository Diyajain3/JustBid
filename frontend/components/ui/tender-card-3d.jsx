import { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { Globe, ArrowRight } from "lucide-react"

export function TenderCard3D({ tender, onMatchClick, index }) {
  const ref = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })

  const rotateX = useMotionTemplate`${mouseYSpring}deg`
  const rotateY = useMotionTemplate`${mouseXSpring}deg`

  // ✅ Safe Date Formatter
  const formatDate = (date) => {
    if (!date) return "Not specified"
    const d = new Date(date)
    if (isNaN(d.getTime())) return "Not specified"

    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handleMouseMove = (e) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const rX = ((mouseY / height) - 0.5) * -12
    const rY = ((mouseX / width) - 0.5) * 12

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
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full min-h-[220px] rounded-2xl bg-card border border-border 
      hover:border-primary/50 group shadow-lg cursor-pointer flex"
    >

      {/* Glare Effect */}
      <div className="absolute inset-0 z-10 rounded-2xl opacity-0 group-hover:opacity-100 
      transition-opacity duration-500 pointer-events-none 
      bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent)]" />

      <div
        className="flex flex-col md:flex-row gap-6 p-6 relative z-20 w-full h-full"
        style={{ transform: "translateZ(30px)" }}
      >

        {/* LEFT SIDE */}
        <div className="flex-1 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center gap-1 text-xs font-bold text-accent px-2 py-1 bg-accent/10 rounded-full uppercase tracking-wider">
                <Globe size={12} /> {tender.location || "Global"}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-primary transition-colors">
              {tender.title || "Untitled Tender"}
            </h3>

            {/* ✅ FIXED HTML RENDER */}
            <div
              className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: tender.description || "No description available.",
              }}
            />
          </div>

          {/* CPV Codes */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {tender.cpvCodes?.length > 0 ? (
              tender.cpvCodes.map((code, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-secondary text-foreground/70 px-2 py-1 rounded-md"
                >
                  {code}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">
                No CPV Codes
              </span>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="border-t md:border-t-0 md:border-l border-border/50 
        pt-4 md:pt-0 md:pl-6 min-w-[220px] flex flex-col justify-between">

          <div className="w-full flex flex-col items-end text-right">
            
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Budget
            </p>

            <p className="text-2xl font-bold text-green-400">
              {tender.budget
                ? `$${tender.budget.toLocaleString()}`
                : "Confidential"}
            </p>

            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-4 mb-1">
              Deadline
            </p>

            <p className="font-medium text-sm text-red-400">
              {formatDate(tender.deadline)}
            </p>
          </div>

          {/* BUTTON FIX */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMatchClick()
            }}
            className="mt-6 w-fit self-end bg-secondary hover:bg-primary 
            hover:text-primary-foreground text-foreground px-4 py-2.5 
            rounded-xl transition-all duration-300 font-medium flex items-center gap-2"
          >
            Match With AI
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
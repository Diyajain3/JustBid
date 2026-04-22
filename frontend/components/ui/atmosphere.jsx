import { motion } from "framer-motion"

export function Atmosphere() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0a0a0b]">
      {/* Static Refined Grid - Very Subtle */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Drifting Atmosphere Orbs */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[80px] will-change-transform"
      />
      
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1e1e20]/20 blur-[70px] will-change-transform"
      />

      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-primary/3 blur-[60px] will-change-transform"
      />

      {/* Optimized Grainy Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
           style={{ 
             backgroundImage: `url("https://res.cloudinary.com/dpgu7rvob/image/upload/v1602341014/noise_fpxr5a.png")`,
             backgroundRepeat: 'repeat'
           }} />
    </div>
  )
}

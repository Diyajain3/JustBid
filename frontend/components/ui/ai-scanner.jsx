import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScanFace, Fingerprint, Lock, ShieldCheck } from "lucide-react"

export function AiScanner({ active, onComplete }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!active) {
      setStep(0)
      return
    }

    const sequence = async () => {
      await new Promise((r) => setTimeout(r, 800))
      setStep(1) // Scanning network
      await new Promise((r) => setTimeout(r, 1200))
      setStep(2) // Validating identity
      await new Promise((r) => setTimeout(r, 1000))
      setStep(3) // Match found!
      await new Promise((r) => setTimeout(r, 800))
      onComplete()
    }

    sequence()
  }, [active, onComplete])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl"
        >
          {/* Scanning Line */}
          <motion.div
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-1 bg-primary/50 shadow-[0_0_20px_var(--primary)] z-0"
            style={{ pointerEvents: 'none' }}
          />

          <div className="relative z-10 flex flex-col items-center max-w-md w-full p-8 text-center">
            {/* Icon Container */}
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40"
              />
              <motion.div 
                animate={{ rotate: -360 }} 
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-accent/40"
              />
              
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="1" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    <ScanFace className="w-12 h-12 text-primary" />
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div key="2" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    <Fingerprint className="w-12 h-12 text-accent" />
                  </motion.div>
                )}
                {step >= 2 && (
                  <motion.div key="3" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    <ShieldCheck className="w-12 h-12 text-green-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <h2 className="text-2xl font-bold mb-4 font-display">JustBid AI Engine</h2>
            
            <div className="h-20 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.p key="msg1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-muted-foreground">
                    Initializing neural matching sequence...
                  </motion.p>
                )}
                {step === 1 && (
                  <motion.p key="msg2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-muted-foreground">
                    Cross-referencing global SIMAP network...
                  </motion.p>
                )}
                {step >= 2 && (
                  <motion.p key="msg3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-green-500 font-medium tracking-wider">
                    SUCCESS: OPTIMAL MATCHES IDENTIFIED
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            
            <div className="w-full bg-secondary h-1 rounded-full mt-4 overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: step === 0 ? "30%" : step === 1 ? "70%" : "100%" }}
                  className={`h-full ${step >= 2 ? 'bg-green-500' : 'bg-primary'}`}
                  transition={{ duration: 0.5 }}
                />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

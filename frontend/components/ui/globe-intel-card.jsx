import { motion, AnimatePresence } from "framer-motion"
import { DecryptionText } from "./decryption-text"
import { Sparkles, MapPin } from "lucide-react"

export function GlobeIntelCard({ active, data }) {
  if (!active || !data) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="absolute z-[100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-[180%] w-[240px] pointer-events-none"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(var(--primary),0.2)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-primary/20 rounded-lg">
              <Sparkles size={14} className="text-primary" />
            </div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] font-mono">
              Signal Detected
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-muted-foreground" />
              <DecryptionText 
                text={data.location} 
                className="text-sm font-bold text-foreground" 
                speed={30}
              />
            </div>
            
            <div className="pt-2 border-t border-white/5 flex justify-between items-end">
              <div className="space-y-0.5">
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Match Score</p>
                <p className="text-sm font-mono font-bold text-green-400">
                  {data.match}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Status</p>
                <p className="text-[10px] font-bold text-primary/80 uppercase">Active</p>
              </div>
            </div>
          </div>

          {/* Glitch Overlay */}
          <div className="absolute inset-0 bg-primary/5 opacity-20 pointer-events-none" />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

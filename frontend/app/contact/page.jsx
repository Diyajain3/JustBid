"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MessageSquare, Send, Globe, Phone } from "lucide-react"
import { Navbar } from "@/components/ui/navbar"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSent(true)
    setTimeout(() => setIsSent(false), 3000)
    setFormState({ name: "", email: "", message: "" })
  }

  return (
    <main className="bg-[#050508] text-[#e0e0e6] min-h-screen relative overflow-hidden font-sans selection:bg-primary/40 selection:text-white">
      
      {/* Visual Overlays */}
      <div className="grain-overlay" />
      <div className="scanline" />
      
      <Navbar />

      <div className="relative z-10 container mx-auto px-6 pt-48 pb-32 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-8 text-primary"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] font-mono">Channel_Init_01</span>
          </motion.div>
          
          <h1 
            className="text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.9] tracking-tighter mb-8 monolithic-text" 
            style={{ fontFamily: "var(--font-display)" }}
          >
            Protocol <br/> <span className="text-primary">Engagement</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 max-w-lg leading-relaxed lowercase font-sans font-medium">
            [SYS_REPORT]: bridging the gap between automation and advisory. deploy a transmission below for priority synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">
          
          {/* Form Side */}
          <div className="lg:col-span-7">
            <motion.form 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    staggerChildren: 0.1
                  }
                }
              }}
              onSubmit={handleSubmit}
              className="space-y-8 bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 md:p-14 rounded-[2rem] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/90 font-mono pl-1">Identity_Key</label>
                  <input 
                    type="text" 
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    placeholder="ENTER FULL NAME"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-sm outline-none focus:border-primary/60 focus:bg-black/60 transition-all font-sans placeholder:text-white/20 text-white font-medium"
                  />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, x: 10 }, visible: { opacity: 1, x: 0 } }} className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/90 font-mono pl-1">Sync_Portal</label>
                  <input 
                    type="email" 
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    placeholder="ADDRESS@NETWORK.IO"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-sm outline-none focus:border-primary/60 focus:bg-black/60 transition-all font-sans placeholder:text-white/20 text-white font-medium"
                  />
                </motion.div>
              </div>

              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/90 font-mono pl-1">Transmission_Body</label>
                <textarea 
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                  placeholder="DRAFT YOUR REQUIREMENTS HERE..."
                  rows={6}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-sm outline-none focus:border-primary/60 focus:bg-black/60 transition-all font-sans resize-none placeholder:text-white/20 text-white font-medium"
                />
              </motion.div>

              <motion.button 
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                type="submit" 
                className={`w-full py-6 rounded-2xl font-bold uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 relative shadow-[0_0_30px_rgba(var(--primary),0.2)] ${
                  isSent ? "bg-green-500 text-white" : "bg-primary text-black hover:bg-white hover:scale-[1.01] active:scale-[0.99]"
                }`}
              >
                {isSent ? (
                  <span className="font-mono">LINK_VERIFIED // SENT</span>
                ) : (
                  <>
                    <Send size={14} className="opacity-80" />
                    <span>Execute_Sync</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          </div>

          {/* Details Side */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15, delayChildren: 0.4 }
                }
              }}
              className="space-y-14"
            >
              
              <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="group">
                <div className="flex items-center gap-5 mb-5">
                   <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:border-primary/60 group-hover:bg-primary/10 transition-all duration-500">
                    <Mail size={18} className="text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight uppercase text-white" style={{ fontFamily: "var(--font-display)" }}>Direct_Inquiry</h3>
                </div>
                <p className="text-white/80 font-sans text-lg pl-[4.2rem] hover:text-primary transition-colors cursor-pointer font-medium">ops@justbid.ai</p>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="group">
                <div className="flex items-center gap-5 mb-5">
                   <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:border-primary/60 group-hover:bg-primary/10 transition-all duration-500">
                    <Globe size={18} className="text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight uppercase text-white" style={{ fontFamily: "var(--font-display)" }}>Operations_Hub</h3>
                </div>
                <p className="text-white/70 font-sans text-lg pl-[4.2rem] leading-relaxed font-medium">
                  Level_14, Neural_Tower 02<br/>
                  Singapore_South_Harbor
                </p>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="group">
                <div className="flex items-center gap-5 mb-5">
                   <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:border-primary/60 group-hover:bg-primary/10 transition-all duration-500">
                    <MessageSquare size={18} className="text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight uppercase text-white" style={{ fontFamily: "var(--font-display)" }}>Data_Stream</h3>
                </div>
                <div className="pl-[4.2rem] flex gap-5">
                   <div className="w-11 h-11 rounded-xl border border-white/20 bg-white/[0.02] flex items-center justify-center hover:bg-primary hover:text-black hover:border-primary transition-all cursor-pointer font-bold text-sm text-white">X</div>
                   <div className="w-11 h-11 rounded-xl border border-white/20 bg-white/[0.02] flex items-center justify-center hover:bg-primary hover:text-black hover:border-primary transition-all cursor-pointer font-bold text-sm text-white">IN</div>
                   <div className="w-11 h-11 rounded-xl border border-white/20 bg-white/[0.02] flex items-center justify-center hover:bg-primary hover:text-black hover:border-primary transition-all cursor-pointer font-bold text-sm text-white">GIT</div>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* Decorative Grids */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[2px] h-full bg-white/5 hidden lg:block" />
      
    </main>
  )
}

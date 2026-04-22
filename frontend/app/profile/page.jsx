import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Settings, 
  BarChart3, 
  LayoutDashboard, 
  Bookmark, 
  LogOut, 
  User as UserIcon,
  Search,
  ChevronRight,
  Shield,
  Activity,
  Cpu,
  BrainCircuit
} from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { toast } from "sonner"
import { Atmosphere } from "@/components/ui/atmosphere"
import { DecryptionText } from "@/components/ui/decryption-text"
import Magnetic from "@/components/ui/magnetic"

export default function ProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [user, setUser] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    minBudget: "",
    maxBudget: "",
    cpvCodes: "",
    keywords: ""
  })

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (!token) return navigate("/auth")
    if (storedUser) setUser(JSON.parse(storedUser))

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/company/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setFormData({
            name: data.name || "",
            industry: data.industry || "",
            location: data.location || "",
            minBudget: data.minBudget || "",
            maxBudget: data.maxBudget || "",
            cpvCodes: data.cpvCodes?.join(", ") || "",
            keywords: data.keywords?.join(", ") || ""
          })
        }
      } catch (err) {
        console.error("No profile yet.")
      }
    }
    fetchProfile()
  }, [navigate, API_URL])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const token = localStorage.getItem("token")
      const payload = {
        ...formData,
        cpvCodes: formData.cpvCodes.split(",").map(s => s.trim()).filter(Boolean),
        keywords: formData.keywords.split(",").map(s => s.trim()).filter(Boolean),
      }

      const res = await fetch(`${API_URL}/api/company/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success("CALIBRATION_COMPLETE", {
          description: "Neural match engine has synchronized with your profile."
        })
        setTimeout(() => navigate("/dashboard"), 1200)
      } else {
        toast.error("CALIBRATION_FAILED")
      }
    } catch (err) {
      toast.error("ERROR: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Neural Infrastructure */}
      <div className="fixed inset-0 z-0">
        <Atmosphere />
        <div className="neural-grid" />
        <div className="scanline-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-80 pointer-events-none" />
      </div>

      {/* Global Background Spotlight */}
      <div 
        className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(1000px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.03), transparent 80%)`
        }}
      />

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-black/40 backdrop-blur-3xl border-r border-border/20 hidden md:flex flex-col z-20">
        <div className="p-6">
          <Link to="/dashboard" className="text-2xl font-bold text-primary flex items-center gap-2 group" style={{ fontFamily: "var(--font-display)" }}>
            <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]">J</span>
            <DecryptionText text="JustBid" delay={0.1} />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-4 mt-6">
          <Magnetic strength={0.2}>
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-white/5 hover:text-foreground rounded-xl transition-all duration-300">
              <LayoutDashboard size={20} />
              Matches Feed
            </Link>
          </Magnetic>
          
          <Magnetic strength={0.3}>
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 bg-primary/15 text-primary border border-primary/20 rounded-xl font-bold shadow-[0_0_20px_rgba(var(--primary),0.05)] transition-all">
              <Settings size={20} />
              AI Matrix Profile
            </Link>
          </Magnetic>

          <Magnetic strength={0.2}>
            <Link to="/saved-bids" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-white/5 hover:text-foreground rounded-xl transition-all duration-300">
              <Bookmark size={20} />
              Inbox & Saved Bids
            </Link>
          </Magnetic>

          <Magnetic strength={0.2}>
            <Link to="/analytics" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-white/5 hover:text-foreground rounded-xl transition-all duration-300">
              <BarChart3 size={20} />
              Insights & Analytics
            </Link>
          </Magnetic>
        </nav>

        <div className="p-4 border-t border-border/20 mt-auto bg-black/20">
          <Magnetic strength={0.1}>
            <button 
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                navigate('/')
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-500/70 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
            >
              <LogOut size={16} />
              Terminate
            </button>
          </Magnetic>
        </div>
      </aside>

      {/* Main Configuration Console */}
      <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
        <div className="max-w-4xl mx-auto p-12">
          
          <header className="mb-12">
            <div className="flex items-center gap-2 text-primary/60 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <Cpu size={14} className="animate-pulse" />
              <span>Neural Calibration Console</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Strategy <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]">Resonance Vector</span>
            </h1>
            <p className="text-muted-foreground/80 max-w-xl text-sm leading-relaxed">
              Calibrate your operational identity to synchronize with our market intelligence engine. These parameters define your match probability across the SIMAP neural net.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Tabs Navigation */}
            <div className="lg:col-span-1 space-y-3">
              {[
                { id: "general", label: "General Node" },
                { id: "logic", label: "Match Logic" },
                { id: "budget", label: "Capacity Limit" }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)} 
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-black shadow-[0_0_20px_rgba(var(--primary),0.2)]' : 'text-muted-foreground/60 hover:bg-white/5 hover:text-foreground'}`}
                >
                  {tab.label} {activeTab === tab.id && <ChevronRight size={14} />}
                </button>
              ))}
            </div>

            {/* Form Area using Custom Glass UI */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 md:p-10 border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <AnimatePresence mode="wait">
                  {activeTab === "general" && (
                    <motion.div 
                      key="general"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-8"
                    >
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] pl-1">Entity ID</label>
                            <input value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} type="text" placeholder="e.g. Acme Systems" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:ring-1 focus:ring-primary/40 transition-all outline-none text-sm font-medium" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] pl-1">Sector Node</label>
                            <input value={formData.industry} onChange={e=>setFormData({...formData, industry: e.target.value})} type="text" placeholder="e.g. Defense Tech" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:ring-1 focus:ring-primary/40 transition-all outline-none text-sm font-medium" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] pl-1">Geographic Anchor</label>
                          <input value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} type="text" placeholder="e.g. Zurich CH" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:ring-1 focus:ring-primary/40 transition-all outline-none text-sm font-medium" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "logic" && (
                    <motion.div 
                      key="logic"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-8"
                    >
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                            <BrainCircuit size={12} /> Strategic CPV Stack
                          </label>
                          <textarea rows={3} value={formData.cpvCodes} onChange={e=>setFormData({...formData, cpvCodes: e.target.value})} placeholder="e.g. 09331200, 45231000" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:ring-1 focus:ring-primary/40 transition-all outline-none resize-none font-mono text-xs" />
                          <p className="text-[9px] text-muted-foreground/40 italic">Industrial procurement codes separated by comma delimiters.</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                            <Activity size={12} /> Semantic Keywords
                          </label>
                          <textarea rows={3} value={formData.keywords} onChange={e=>setFormData({...formData, keywords: e.target.value})} placeholder="e.g. Stealth, Cyber, Infrastructure" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:ring-1 focus:ring-primary/40 transition-all outline-none resize-none font-mono text-xs" />
                          <p className="text-[9px] text-muted-foreground/40 italic">Neural net will prioritize assets containing these distinct markers.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "budget" && (
                    <motion.div 
                      key="budget"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-8"
                    >
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] pl-1">Min Capital ($)</label>
                            <input value={formData.minBudget} onChange={e=>setFormData({...formData, minBudget: e.target.value})} type="number" placeholder="50k" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:ring-1 focus:ring-primary/40 transition-all outline-none text-sm font-medium" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] pl-1">Max Capital ($)</label>
                            <input value={formData.maxBudget} onChange={e=>setFormData({...formData, maxBudget: e.target.value})} type="number" placeholder="25M" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:ring-1 focus:ring-primary/40 transition-all outline-none text-sm font-medium" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between mt-10">
                  <div className="flex items-center gap-3">
                     <span className={`w-2 h-2 rounded-full ${loading ? 'bg-primary animate-ping' : 'bg-green-500'} shadow-[0_0_8px_currentColor]`} />
                     <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">
                       {loading ? "CALIBRATING ENGINE..." : "CORE READY"}
                     </p>
                  </div>
                  
                  <Magnetic strength={0.3}>
                    <button 
                      type="submit"
                      disabled={loading} 
                      className="bg-primary text-black px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(var(--primary),0.4)] disabled:opacity-50 group"
                    >
                      {loading ? "Synchronizing..." : "Update Engine"}
                      <ChevronRight size={16} className="inline-block ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Magnetic>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Console Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-10 border-t border-white/5 bg-black/60 backdrop-blur-md px-6 flex items-center justify-between z-30">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                 <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Calibration Secure</p>
              </div>
              <div className="flex items-center gap-2">
                 <Shield size={10} className="text-primary/60" />
                 <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Latency: 12ms</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40">Unit: JustBid OS v2.4.1</p>
           </div>
        </footer>
    </div>
  )
}

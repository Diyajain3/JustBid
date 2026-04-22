import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Settings, BarChart3, LayoutDashboard, Bookmark, LogOut, TrendingUp, Search, CheckCircle2, Shield, Activity, Wifi, Cpu, Users } from "lucide-react"
import confetti from "canvas-confetti"
import { CircularGauge } from "@/components/ui/circular-gauge"
import { TenderCard3D } from "@/components/ui/tender-card-3d"
import { TeamCollaborationCard } from "@/components/ui/team-collaboration-card"
import { DocumentAnalysisCard } from "@/components/ui/document-analysis-card"
import { Atmosphere } from "@/components/ui/atmosphere"
import { DecryptionText } from "@/components/ui/decryption-text"
import Magnetic from "@/components/ui/magnetic"

export default function DashboardPage() {
  const navigate = useNavigate()
  const [tenders, setTenders] = useState([])
  const [filteredTenders, setFilteredTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [appliedTenders, setAppliedTenders] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [systemLogs, setSystemLogs] = useState([
    "INITIALIZING NEURAL INTERFACE...",
    "HANDSHAKE WITH SIMAP COMPLETE",
    "MATCH ENGINE ACTIVE",
    "UPDATING OPPORTUNITY MATRIX",
    "SECURITY ENCRYPTION: SHIELD ON"
  ])

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Auto-scroll logs
  useEffect(() => {
    const interval = setInterval(() => {
      const logs = [
        "PARSING NODE " + Math.floor(Math.random() * 1000),
        "SENTIMENT SCANNED: POSITIVE",
        "NEW TENDER ID " + Math.floor(Math.random() * 99999) + " INGESTED",
        "NEURAL FILTER: APPLIED",
        "SIGNAL STRENGTH: OPTIMAL"
      ]
      setSystemLogs(prev => [...prev.slice(-15), logs[Math.floor(Math.random() * logs.length)]])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (!token) {
      navigate("/auth")
      return
    }

    setUser(JSON.parse(storedUser))

    const fetchTenders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tenders/feed`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) {
           if (res.status === 400) {
              navigate("/profile")
           }
           throw new Error("Failed to fetch feed")
        }

        const data = await res.json()
        setTenders(data)
        setFilteredTenders(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTenders()
  }, [navigate, API_URL])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTenders(tenders)
      return
    }

    const q = searchQuery.toLowerCase()
    const filtered = tenders.filter(t => 
      t.title?.toLowerCase().includes(q) || 
      t.description?.toLowerCase().includes(q) ||
      t.location?.toLowerCase().includes(q) ||
      t.matchReasons?.some(r => r.toLowerCase().includes(q))
    )
    setFilteredTenders(filtered)
  }, [searchQuery, tenders])

  const handleApply = async (e, tenderId) => {
    const rect = e.target.getBoundingClientRect?.() || { left: 0.5, top: 0.5, width: 0, height: 0 }
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x, y },
      colors: ['#D4AF37', '#ffffff', '#4ade80']
    })

    setAppliedTenders(prev => ({ ...prev, [tenderId]: true }))

    const token = localStorage.getItem('token')
    try {
      await fetch(`${API_URL}/api/tenders/save/${tenderId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
    } catch (err) {
      console.error("Failed to save bid:", err)
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative selection:bg-primary/30">
      {/* Infrastructure Layers */}
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

      {/* Sidebar (Left) */}
      <aside className="w-64 bg-black/40 backdrop-blur-2xl border-r border-border/20 hidden md:flex flex-col z-20 transition-all duration-500">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2 group" style={{ fontFamily: "var(--font-display)" }}>
            <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)] group-hover:scale-110 transition-transform">J</span>
            <DecryptionText text="JustBid" delay={0.1} />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-4 mt-6">
          <Magnetic strength={0.3}>
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary/15 text-primary border border-primary/20 rounded-xl font-bold shadow-[0_0_20px_rgba(var(--primary),0.05)] transition-all">
              <LayoutDashboard size={20} />
              Matches Feed
            </Link>
          </Magnetic>
          
          <Magnetic strength={0.2}>
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-white/5 hover:text-foreground rounded-xl transition-all duration-300 group">
              <Settings size={20} className="group-hover:rotate-45 transition-transform" />
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

          <Magnetic strength={0.2}>
            <Link to="/team" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-white/5 hover:text-foreground rounded-xl transition-all duration-300 group">
              <Users size={20} className="group-hover:scale-110 transition-transform" />
              Team Hub
            </Link>
          </Magnetic>
        </nav>

        {/* Sidebar Mini-Widgets */}
        <div className="px-5 mb-8 space-y-4">
           <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Sync Protocol</p>
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
              </div>
              <div className="flex items-center gap-2">
                 <Activity size={12} className="text-green-500" />
                 <p className="text-xs font-mono">SIMAP CONNECTED</p>
              </div>
           </div>

           <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 mb-2">Neural Efficiency</p>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} transition={{ duration: 2 }} className="h-full bg-primary" />
              </div>
              <p className="text-[10px] text-right mt-1 font-mono text-primary">94.2%</p>
           </div>
        </div>

        <div className="p-4 border-t border-border/20 mt-auto bg-black/20">
          <button 
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              navigate('/')
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
          >
            <LogOut size={16} />
            Terminate
          </button>
        </div>
      </aside>

      {/* Main Container: Feed + Intelligence Panel */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/40 backdrop-blur-3xl border-b border-border/20 p-6 flex justify-between items-center transition-all">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              <DecryptionText text="Active Opportunities" delay={0.2} />
            </h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-[0.2em] opacity-60">Status: Filtering Real Time Assets</p>
          </div>

          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Query matrix..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all w-80 hover:bg-white/10"
            />
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto flex">
          
          {/* Main Feed */}
          <main className="flex-1 min-w-0 p-6 md:p-8 max-w-4xl mx-auto scroll-smooth">
            
            {/* Top Stat row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <TeamCollaborationCard />
                <DocumentAnalysisCard />
                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-[0.3em] font-bold opacity-70">Neural Matches</p>
                  <div className="flex items-baseline gap-4">
                    <p className="text-6xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{filteredTenders.length}</p>
                    <div className="p-2 bg-primary/10 rounded-lg text-primary text-xs font-black">LIVE</div>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border-primary/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-primary font-bold mb-1 uppercase tracking-[0.3em]">Alpha Priority</p>
                      <p className="text-muted-foreground text-xs leading-relaxed max-w-[200px]">Optimal alignment detected with target industry node.</p>
                    </div>
                    <div className="relative drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                      <CircularGauge value={filteredTenders.length > 0 ? filteredTenders[0].matchScore : 0} size={100} strokeWidth={8} delay={0.5} />
                    </div>
                  </div>
                </div>
            </div>

            {/* Neural Feed Content */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-bold flex items-center gap-3 uppercase tracking-[0.4em] text-muted-foreground">
                  Neural Intelligence Feed 
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                </h2>
                <div className="h-px w-32 bg-gradient-to-r from-primary/40 to-transparent" />
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 glass-panel rounded-3xl border-dashed border-border/40">
                  <div className="relative w-12 h-12 mb-6">
                    <div className="absolute inset-0 border-2 border-primary/10 rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <DecryptionText text="Deciphering SIMAP Stream" className="text-sm font-mono" />
                </div>
              ) : (
                <div className="space-y-10">
                  <AnimatePresence mode="popLayout">
                    {filteredTenders.map((tender, i) => (
                      <TenderCard3D 
                        key={tender.id}
                        tender={tender}
                        index={i}
                        onMatchClick={(e) => handleApply(e || { target: {} }, tender.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </main>

          {/* Intelligence Panel (Right Sidebar - Space Filler) */}
          <aside className="w-80 hidden xl:flex flex-col bg-black/20 border-l border-border/10 p-6 z-20">
             <div className="space-y-8">
                {/* AI Insights Card */}
                <div className="glass-panel p-5 rounded-2xl border-white/5 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                      <Shield size={16} className="text-primary" />
                   </div>
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-primary">Neural Insights</h3>
                   <div className="space-y-4">
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5 border-l-primary/40 border-l-2">
                         <p className="text-[10px] text-muted-foreground font-mono mb-1">PROBABILITY SCAN</p>
                         <p className="text-xs font-bold font-mono">HIGH SUCCESS DETECTED</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5 border-l-accent/40 border-l-2">
                         <p className="text-[10px] text-muted-foreground font-mono mb-1">MARKET SENTIMENT</p>
                         <p className="text-xs font-bold font-mono">UPWARD TREND 0.42%</p>
                      </div>
                   </div>
                </div>

                {/* System Activity Log */}
                <div>
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Cpu size={14} className="text-muted-foreground" />
                      Live Network Logs
                   </h3>
                   <div className="space-y-2 max-h-[400px] overflow-hidden">
                      {systemLogs.map((log, i) => (
                        <motion.div 
                          key={i+log}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 0.6, x: 0 }}
                          className="text-[10px] font-mono text-muted-foreground leading-tight hover:text-primary hover:bg-white/5 p-1 rounded transition-colors"
                        >
                           <span className="text-primary/40">[{new Date().toLocaleTimeString([], { hour12: false })}]</span> {log}
                        </motion.div>
                      ))}
                      <div className="h-20 bg-gradient-to-t from-background to-transparent absolute bottom-6 w-[calc(100%-48px)] pointer-events-none" />
                   </div>
                </div>
             </div>
          </aside>
        </div>

        {/* Command Center Footer (Fixed) */}
        <footer className="h-10 border-t border-border/10 bg-black/40 backdrop-blur-md px-6 flex items-center justify-between z-30">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                 <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Neural Secure: OK</p>
              </div>
              <div className="flex items-center gap-2">
                 <Wifi size={10} className="text-muted-foreground" />
                 <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Gateway: 24ms</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <p className="text-[9px] font-mono uppercase tracking-widest text-primary/60">Session Auth: PRM USER</p>
              <div className="h-4 w-px bg-white/10" />
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">JustBid OS v2.4.1</p>
           </div>
        </footer>
      </div>
    </div>
  )
}

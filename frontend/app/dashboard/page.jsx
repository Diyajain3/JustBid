import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Settings, BarChart3, LayoutDashboard, Bookmark, LogOut, TrendingUp, Search, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"
import { CircularGauge } from "@/components/ui/circular-gauge"

export default function DashboardPage() {
  const navigate = useNavigate()
  const [tenders, setTenders] = useState([])
  const [filteredTenders, setFilteredTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [appliedTenders, setAppliedTenders] = useState({})
  const [searchQuery, setSearchQuery] = useState("")

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

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

  // Live Search Logic for Dashboard Feed
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
    const rect = e.target.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x, y },
      colors: ['#4ade80', '#ffffff', '#22c55e']
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
    <div className="flex h-screen bg-background overflow-hidden relative">
      
      {/* Sidebar */}
      <aside className="w-64 bg-card/50 border-r border-border hidden md:flex flex-col z-10">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
            JustBid
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium">
            <LayoutDashboard size={20} />
            Matches Feed
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 hover:text-foreground rounded-xl transition-colors">
            <Settings size={20} />
            AI Matrix Profile
          </Link>
          <Link to="/saved-bids" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 hover:text-foreground rounded-xl transition-colors">
            <Bookmark size={20} />
            Inbox & Saved Bids
          </Link>
          <Link to="/analytics" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 hover:text-foreground rounded-xl transition-colors">
            <BarChart3 size={20} />
            Insights & Analytics
          </Link>
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || "Member"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              navigate('/')
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Active Opportunities</h1>
            <p className="text-sm text-muted-foreground">Tailored exactly to your scale and industry.</p>
          </div>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search specific tenders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary/50 border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-64"
            />
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-5xl mx-auto">
          
          {/* Top Stat row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-center">
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-widest">Algorithm Matches</p>
                <div className="flex items-baseline gap-4">
                  <p className="text-5xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{filteredTenders.length}</p>
                  <p className="text-sm text-primary flex items-center gap-1"><TrendingUp size={14}/> +12 this week</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-6 shadow-sm flex items-center justify-between overflow-hidden relative">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <p className="text-sm text-primary/80 font-medium mb-1 uppercase tracking-widest">Highest Scoring Tender</p>
                  <p className="text-muted-foreground text-sm max-w-[200px]">The platform found an extremely high probability match.</p>
                </div>
                <div className="relative z-10 flex shrink-0 justify-center min-w-[120px]">
                  <CircularGauge value={filteredTenders.length > 0 ? filteredTenders[0].matchScore : 0} size={100} strokeWidth={8} delay={0.5} />
                </div>
              </div>
            </div>

          {/* Feed */}
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            Your Custom Feed <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse ml-2" />
          </h2>
          
          {loading ? (
             <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl bg-card/20">
               <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
               Crunching multi-dimensional arrays...
             </div>
          ) : filteredTenders.length === 0 ? (
             <div className="text-center py-20 bg-secondary/30 rounded-2xl border border-dashed border-border">
               <p className="text-lg font-medium mb-2">{searchQuery ? "No search results." : "No active matches found."}</p>
               <p className="text-muted-foreground mb-6">{searchQuery ? `We couldn't find any matches for "${searchQuery}"` : "Your criteria might be too strict, or the Python worker hasn't ingested new data."}</p>
               {!searchQuery && (
                 <Link to="/profile" className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
                    Loosen Criteria
                 </Link>
               )}
             </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {filteredTenders.map((tender, i) => (
                  <motion.div 
                    key={tender.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                    className={`bg-card border rounded-2xl p-6 transition-all group relative overflow-hidden ${appliedTenders[tender.id] ? 'border-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]' : 'border-border hover:shadow-xl hover:border-primary/40'}`}
                  >
                    {appliedTenders[tender.id] && (
                      <div className="absolute inset-0 bg-green-500/5 pointer-events-none z-0" />
                    )}

                    <div className="flex flex-col md:flex-row gap-8 justify-between relative z-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                            tender.matchScore >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            tender.matchScore >= 50 ? 'bg-primary/20 text-primary border border-primary/30' :
                            'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                          }`}>
                            {tender.matchScore}% Neural Match
                          </span>
                          <span className="text-xs text-muted-foreground font-mono bg-secondary px-2 py-1 rounded">ID: {tender.externalId}</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{tender.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-5 leading-relaxed">
                          {tender.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-5">
                          {tender.cpvCodes?.map(code => (
                            <span key={code} className="text-xs bg-secondary px-2.5 py-1 rounded-md text-foreground/80 font-medium">
                              CPV: {code}
                            </span>
                          ))}
                        </div>

                        {/* AI Reasoning Tags */}
                        <div className="space-y-1.5 p-3 rounded-lg bg-secondary/50 border border-border/50">
                          <p className="text-xs text-primary/80 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <SparklesIcon /> Analysis
                          </p>
                          {tender.matchReasons?.map((reason, idx) => (
                            <p key={idx} className="text-xs text-foreground/80 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block mt-1 shrink-0 shadow-[0_0_5px_rgba(var(--primary),1)]"></span>
                              <span>{reason}</span>
                            </p>
                          ))}
                        </div>

                      </div>

                      <div className="flex flex-col justify-between items-end min-w-[220px] border-t md:border-t-0 md:border-l border-border pt-5 md:pt-0 md:pl-8">
                        <div className="text-right w-full mb-6">
                           <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5">Budget Allocation</p>
                           <p className="text-3xl font-bold text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.2)]">
                             {tender.budget ? `$${tender.budget.toLocaleString()}` : "Confidential"}
                           </p>
                           
                           <p className="text-xs text-muted-foreground uppercase tracking-widest mt-5 mb-1.5">Deployment Location</p>
                           <p className="font-medium text-sm text-foreground bg-secondary/80 inline-block px-2 py-1 rounded">{tender.location}</p>

                           <p className="text-xs text-muted-foreground uppercase tracking-widest mt-5 mb-1.5">Deadline</p>
                           <p className="font-medium text-sm text-red-400 flex items-center justify-end gap-1.5">
                             <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                                                           {tender.deadline ? new Date(tender.deadline).toLocaleDateString() : "No Deadline Set"}

                           </p>
                        </div>
                        
                        <AnimatePresence mode="wait">
                          {appliedTenders[tender.id] ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="w-full bg-green-500/20 text-green-500 border border-green-500/50 font-bold py-3 rounded-xl flex justify-center items-center gap-2"
                            >
                              <CheckCircle2 size={20} /> Bid Fast-Tracked
                            </motion.div>
                          ) : (
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => handleApply(e, tender.id)}
                              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] flex justify-center items-center gap-2 group"
                            >
                              Fast-Track Bid
                              <motion.span className="group-hover:translate-x-1 transition-transform inline-block">→</motion.span>
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  )
}

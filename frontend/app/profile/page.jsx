import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Settings, 
  BarChart3, 
  LayoutDashboard, 
  Bookmark, 
  LogOut, 
  Building2, 
  MapPin, 
  Tags, 
  Navigation, 
  DollarSign, 
  Bell,
  User as UserIcon,
  Search,
  ChevronRight
} from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { toast } from "sonner"

export default function ProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState("")
  const [activeTab, setActiveTab] = useState("general")
  const [user, setUser] = useState(null)

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
        toast.success("Strategy Matrix Updated", {
          description: "Match engine is re-synchronizing with live data."
        })
        setTimeout(() => navigate("/dashboard"), 1000)
      } else {
        toast.error("Update Failed")
      }
    } catch (err) {
      toast.error("Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const SidebarLink = ({ to, icon: Icon, label, active }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
        active 
          ? "bg-primary/10 text-primary font-semibold" 
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      }`}
    >
      <Icon size={18} />
      <span className="text-sm">{label}</span>
      {active && <motion.div layoutId="sidebar-accent" className="ml-auto w-1 h-4 bg-primary rounded-full" />}
    </Link>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      
      {/* Dashboard Sidebar Navigation */}
      <aside className="w-64 bg-card/30 border-r border-border hidden md:flex flex-col z-10 backdrop-blur-xl">
        <div className="p-8">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-primary">JustBid</Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Command Center</p>
            <div className="space-y-1">
              <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Matches Feed" active={location.pathname === "/dashboard"} />
              <SidebarLink to="/saved-bids" icon={Bookmark} label="Bidding Inbox" active={location.pathname === "/saved-bids"} />
              <SidebarLink to="/analytics" icon={BarChart3} label="Insights & Growth" active={location.pathname === "/analytics"} />
            </div>
          </div>

          <div className="px-4 mt-8">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Global Network</p>
            <div className="space-y-1">
              <SidebarLink to="/explore" icon={Search} label="Search Market" active={location.pathname === "/explore"} />
              <SidebarLink to="/vision" icon={Bell} label="Opportunities" active={location.pathname === "/vision"} />
            </div>
          </div>

          <div className="px-4 mt-8">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Settings</p>
            <div className="space-y-1">
              <SidebarLink to="/profile" icon={Settings} label="Company Matrix" active={location.pathname === "/profile"} />
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-border mt-auto bg-background/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
              {user?.email?.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">{user?.name || "Strategist"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              navigate('/')
            }}
            className="w-full h-9 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-400/80 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
          >
            <LogOut size={12} />
            Detach Session
          </button>
        </div>
      </aside>

      {/* Main Settings Panel */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-secondary/5 h-screen">
        <div className="max-w-4xl mx-auto p-12">
          
          <header className="mb-12">
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Settings size={14} />
              <span>Configuration Console</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Identity & <span className="text-primary">Match Vectors</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Configure your operational profile to calibrate our AI matching engine. 
              These parameters define which tenders appear in your primary matches feed.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Tabs Navigation */}
            <div className="lg:col-span-1 space-y-2">
              <button onClick={() => setActiveTab("general")} className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'general' ? 'bg-primary text-black font-bold' : 'text-muted-foreground hover:bg-white/5'}`}>
                General <ChevronRight size={14} className={activeTab === 'general' ? 'opacity-100' : 'opacity-0'} />
              </button>
              <button onClick={() => setActiveTab("logic")} className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'logic' ? 'bg-primary text-black font-bold' : 'text-muted-foreground hover:bg-white/5'}`}>
                Match Logic <ChevronRight size={14} className={activeTab === 'logic' ? 'opacity-100' : 'opacity-0'} />
              </button>
              <button onClick={() => setActiveTab("budget")} className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'budget' ? 'bg-primary text-black font-bold' : 'text-muted-foreground hover:bg-white/5'}`}>
                Capacity <ChevronRight size={14} className={activeTab === 'budget' ? 'opacity-100' : 'opacity-0'} />
              </button>
            </div>

            {/* Form Area */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-8 bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl">
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
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Entity Name</label>
                            <input value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} type="text" placeholder="e.g. Acme Construction" className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Primary Industry</label>
                            <input value={formData.industry} onChange={e=>setFormData({...formData, industry: e.target.value})} type="text" placeholder="e.g. Smart Infrastructure" className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Operational HQ</label>
                          <input value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} type="text" placeholder="e.g. Zurich, Switzerland" className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" />
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
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Strategic CPV Codes</label>
                          <textarea rows={3} value={formData.cpvCodes} onChange={e=>setFormData({...formData, cpvCodes: e.target.value})} placeholder="e.g. 09331200, 45231000" className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-none" />
                          <p className="text-[10px] text-muted-foreground/50 italic">List industrial procurement codes separated by commas.</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Semantic Keywords</label>
                          <textarea rows={3} value={formData.keywords} onChange={e=>setFormData({...formData, keywords: e.target.value})} placeholder="e.g. Solar, Infrastructure, Pipeline" className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-none" />
                          <p className="text-[10px] text-muted-foreground/50 italic">AI will prioritize tenders containing these unique terms.</p>
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
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Min Capacity ($)</label>
                            <input value={formData.minBudget} onChange={e=>setFormData({...formData, minBudget: e.target.value})} type="number" placeholder="50000" className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Max Capacity ($)</label>
                            <input value={formData.maxBudget} onChange={e=>setFormData({...formData, maxBudget: e.target.value})} type="number" placeholder="25000000" className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    {loading ? "Re-matching..." : "Configuration active"}
                  </p>
                  <button 
                    disabled={loading} 
                    className="bg-primary text-black px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] disabled:opacity-50"
                  >
                    {loading ? "Synchronizing..." : "Update Engine"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

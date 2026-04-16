import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Settings, BarChart3, LayoutDashboard, Bookmark, LogOut, TrendingUp, Search } from "lucide-react"

export default function DashboardPage() {
  const navigate = useNavigate()
  const [tenders, setTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

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
        // Calling the custom algorithm feed which processes Min/Max budgets and CPV!
        const res = await fetch("http://localhost:5000/api/tenders/feed", {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) {
           if (res.status === 400) {
              // They haven't created a profile yet
              navigate("/profile")
           }
           throw new Error("Failed to fetch feed")
        }

        const data = await res.json()
        setTenders(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTenders()
  }, [navigate])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-card/50 border-r border-border hidden md:flex flex-col">
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
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 hover:text-foreground rounded-xl transition-colors">
            <Bookmark size={20} />
            Saved Bids
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/50 hover:text-foreground rounded-xl transition-colors">
            <BarChart3 size={20} />
            Analytics
          </a>
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
              className="bg-secondary/50 border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-64"
            />
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-5xl mx-auto">
          
          {/* Top Stat row */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <p className="text-sm text-muted-foreground mb-2">Algorithm Matches</p>
                <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{tenders.length}</p>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-primary/80 font-medium mb-1">Highest Score</p>
                    <p className="text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
                      {tenders.length > 0 ? tenders[0].matchScore : 0}%
                    </p>
                  </div>
                  <TrendingUp className="text-primary" />
                </div>
              </div>
            </div>

          {/* Feed */}
          <h2 className="text-lg font-semibold mb-4">Your Custom Feed</h2>
          
          {loading ? (
             <div className="text-center py-20 text-muted-foreground">
               <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
               Crunching multi-dimensional arrays...
             </div>
          ) : tenders.length === 0 ? (
             <div className="text-center py-20 bg-secondary/30 rounded-2xl border border-dashed border-border">
               <p className="text-lg font-medium mb-2">No active matches found.</p>
               <p className="text-muted-foreground mb-6">Your criteria might be too strict, or the Python worker hasn't ingested new data.</p>
               <Link to="/profile" className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
                  Loosen Criteria
               </Link>
             </div>
          ) : (
            <div className="space-y-4">
              {tenders.map((tender, i) => (
                <motion.div 
                  key={tender.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/50 transition-all group"
                >
                  <div className="flex flex-col md:flex-row gap-6 justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          tender.matchScore >= 80 ? 'bg-green-500/20 text-green-400' :
                          tender.matchScore >= 50 ? 'bg-primary/20 text-primary' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {tender.matchScore}% Match
                        </span>
                        <span className="text-xs text-muted-foreground">ID: {tender.externalId}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{tender.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {tender.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tender.cpvCodes?.map(code => (
                          <span key={code} className="text-xs bg-secondary px-2 py-1 rounded text-foreground/70">
                            CPV: {code}
                          </span>
                        ))}
                      </div>

                      {/* AI Reasoning Tags */}
                      <div className="space-y-1">
                        {tender.matchReasons?.map((reason, idx) => (
                          <p key={idx} className="text-xs text-primary/80 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-primary inline-block"></span>
                            {reason}
                          </p>
                        ))}
                      </div>

                    </div>

                    <div className="flex flex-col justify-between items-end min-w-[200px] border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                      <div className="text-right w-full mb-4">
                         <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Budget</p>
                         <p className="text-2xl font-bold text-green-400">${tender.budget?.toLocaleString()}</p>
                         
                         <p className="text-xs text-muted-foreground uppercase tracking-wider mt-4 mb-1">Location</p>
                         <p className="font-medium text-sm">{tender.location}</p>

                         <p className="text-xs text-muted-foreground uppercase tracking-wider mt-4 mb-1">Deadline</p>
                         <p className="font-medium text-sm text-red-400">{new Date(tender.deadline).toLocaleDateString()}</p>
                      </div>
                      
                      <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-xl transition-colors shadow-lg hover:shadow-primary/20">
                        View Full Tender
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

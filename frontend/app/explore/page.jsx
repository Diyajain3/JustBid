import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Globe, Search, ArrowRight, Home } from "lucide-react"

export default function ExplorePage() {
  const [tenders, setTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tenders")
        if (res.ok) {
          const data = await res.json()
          setTenders(data.tenders) // The backend returns { tenders: [], pagination: {} }
        }
      } catch (err) {
        console.error("Failed to load generic tenders", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTenders()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border p-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
          <Home size={20} />
          JustBid
        </Link>
        <div className="flex gap-4">
          <Link to="/auth" className="px-6 py-2 bg-primary/10 text-primary rounded-full font-medium hover:bg-primary/20 transition-colors">
            Login
          </Link>
          <Link to="/auth" className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors hidden sm:block">
            Start Free Trial
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-card border-b border-border py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Public Global <span className="text-primary">SIMAP Network</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
          Browse all active government opportunities circulating across Europe right now. Creating a free account lets our AI instantly match you with exactly the ones you can win!
        </p>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input 
            type="text" 
            placeholder="Search keywords, locations, or CPV codes manually..." 
            className="w-full bg-background border border-border shadow-xl rounded-full py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 transition-all text-lg"
          />
        </div>
      </section>

      {/* Feed */}
      <main className="max-w-5xl mx-auto p-6 md:p-8 mt-4">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">
             <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
             Connecting to SIMAP Server...
          </div>
        ) : tenders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No public tenders available right now. 
          </div>
        ) : (
          <div className="grid gap-6">
             {tenders.map((tender, i) => (
                <motion.div 
                  key={tender.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(0.5, i * 0.05) }}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group flex flex-col md:flex-row gap-6 shadow-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="flex items-center gap-1 text-xs font-bold text-accent px-2 py-1 bg-accent/10 rounded-full uppercase tracking-wider">
                         <Globe size={12} /> {tender.location}
                       </span>
                       <span className="text-xs text-muted-foreground">ID: {tender.externalId}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{tender.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-3 mb-4">
                      {tender.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tender.cpvCodes?.map((code, idx) => (
                        <span key={idx} className="text-xs bg-secondary text-foreground/70 px-2 py-1 rounded">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 min-w-[200px] flex flex-col justify-between items-end text-right">
                    <div className="w-full">
                       <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Budget Setup</p>
                       <p className="text-2xl font-bold text-green-400">
                          {tender.budget ? `$${tender.budget.toLocaleString()}` : "Confidential"}
                       </p>
                       <p className="text-xs text-muted-foreground uppercase tracking-widest mt-4 mb-1">Deadline Date</p>
                       <p className="font-medium text-sm text-red-400">{new Date(tender.deadline).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => navigate('/auth')} className="w-full mt-6 bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground px-4 py-3 rounded-xl transition-colors font-medium flex justify-between items-center group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                       Match With AI <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
             ))}
          </div>
        )}
      </main>
    </div>
  )
}

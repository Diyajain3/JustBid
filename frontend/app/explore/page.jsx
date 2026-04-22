import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { TenderCard3D } from "@/components/ui/tender-card-3d"
import { AiScanner } from "@/components/ui/ai-scanner"
import { Navbar } from "@/components/ui/navbar"

export default function ExplorePage() {
  const [tenders, setTenders] = useState([])
  const [filteredTenders, setFilteredTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [scannerActive, setScannerActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tenders`)
        if (res.ok) {
          const data = await res.json()
          setTenders(data.tenders) // The backend returns { tenders: [], pagination: {} }
          setFilteredTenders(data.tenders)
        }
      } catch (err) {
        console.error("Failed to load generic tenders", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTenders()
  }, [API_URL])

  // Live Search Logic
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
      t.cpvCodes?.some(c => c.toLowerCase().includes(q))
    )
    setFilteredTenders(filtered)
  }, [searchQuery, tenders])

  const handleMatchClick = () => {
    setScannerActive(true)
  }

  const handleScannerComplete = () => {
    setScannerActive(false)
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard')
    } else {
      navigate('/auth')
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground pb-12 selection:bg-primary/30">
        <div className="grain-overlay" />
        <Navbar />

        {/* Hero */}
        <section className="bg-card border-b border-border pt-32 pb-16 px-6 text-center">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border shadow-xl rounded-full py-4 pl-12 pr-32 focus:ring-2 focus:ring-primary/50 transition-all text-lg"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold hover:scale-105 transition-all shadow-lg">
              Search
            </button>
          </div>
        </section>

        {/* Feed */}
        <main className="max-w-5xl mx-auto p-6 md:p-8 mt-4" style={{ perspective: "1000px" }}>
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">
               <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
               Connecting to SIMAP Server...
            </div>
          ) : filteredTenders.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              {searchQuery ? `No tenders matching "${searchQuery}" found.` : "No public tenders available right now."}
            </div>
          ) : (
            <div className="grid gap-6">
               {filteredTenders.map((tender, i) => (
                  <TenderCard3D 
                    key={tender.id} 
                    tender={tender} 
                    index={i} 
                    onMatchClick={handleMatchClick} 
                  />
               ))}
            </div>
          )}
        </main>
      </div>

      <AiScanner active={scannerActive} onComplete={handleScannerComplete} />
    </>
  )
}

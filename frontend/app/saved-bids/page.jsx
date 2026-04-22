import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/ui/navbar"
import { TenderCard3D } from "@/components/ui/tender-card-3d"
import { Bookmark, Inbox, Search, Trash2, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function SavedBidsPage() {
  const navigate = useNavigate()
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/auth")
      return
    }

    const fetchBids = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tenders/saved`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          // Map to feed format
          const formatted = data.map(b => ({
            ...b.tender,
            bidId: b.id,
            bidStatus: b.status
          }))
          setBids(formatted)
        }
      } catch (err) {
        console.error("Failed to fetch bids:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBids()
  }, [navigate, API_URL])

  const handleDelete = async (tenderId) => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/api/tenders/save/${tenderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setBids(prev => prev.filter(b => b.id !== tenderId))
      }
    } catch (err) {
      console.error("Failed to delete bid:", err)
    }
  }

  const filteredBids = bids.filter(b => 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link to="/dashboard" className="flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-bold uppercase tracking-widest mb-4">
              <ArrowLeft size={16} /> Back to Command Console
            </Link>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-bold tracking-tight mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Strategic <span className="text-primary italic">Inbox</span>
            </motion.h1>
            <p className="text-muted-foreground text-lg">
              Manage your prioritized opportunities and tracked submissions.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input 
              type="text"
              placeholder="Search your inbox..."
              className="w-full bg-card/40 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all backdrop-blur-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-card/40 animate-pulse rounded-3xl border border-border" />
            ))}
          </div>
        ) : filteredBids.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredBids.map((tender, i) => (
                <motion.div 
                  key={tender.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, x: -50 }}
                  className="relative"
                >
                  <TenderCard3D 
                    tender={tender} 
                    index={i} 
                    onMatchClick={() => navigate(`/explore?id=${tender.id}`)}
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(tender.id)
                    }}
                    className="absolute top-6 right-6 z-40 p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Remove from Inbox"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="absolute top-6 right-16 z-30 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md">
                    {tender.bidStatus}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-card border border-border rounded-3xl flex items-center justify-center text-muted-foreground mb-6">
              <Inbox size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Inbox Empty</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Your strategic queue is currently empty. Bookmark tenders from the main feed to start tracking them.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-105 transition-all"
            >
              Browse Opportunities
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

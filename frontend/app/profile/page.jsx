import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Building2, MapPin, Tags, Navigation, DollarSign, ChevronLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function ProfilePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    minBudget: "",
    maxBudget: "",
    cpvCodes: "",
    keywords: ""
  })

  // Load existing profile from MongoDB if aviailable
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) return navigate("/auth")

      try {
        const res = await fetch("http://localhost:5000/api/company/profile", {
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
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus("Saving AI Profile Matrix...")

    try {
      const token = localStorage.getItem("token")
      const payload = {
        ...formData,
        cpvCodes: formData.cpvCodes.split(",").map(s => s.trim()).filter(Boolean),
        keywords: formData.keywords.split(",").map(s => s.trim()).filter(Boolean),
      }

      const res = await fetch("http://localhost:5000/api/company/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setStatus("Your Autonomous Bidding Profile is Live! Navigating...")
        setTimeout(() => navigate("/dashboard"), 1500)
      } else {
        setStatus("Error updating profile. Check database connection.")
      }
    } catch (err) {
      setStatus("Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
          <ChevronLeft size={20} />
          <span>Back home</span>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Tune your <span className="text-primary">Match Engine</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell our AI exactly what size and type of government contracts you are capable of handling.
            We will actively score and filter Europe's SIMAP database against these exact thresholds.
          </p>
        </div>

        {/* Profile Editor Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* General Settings */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold border-b border-border/50 pb-2">Business Identity</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                    <Building2 size={16} className="text-primary"/> Company Legal Name
                  </label>
                  <input value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                     Industry Sector
                  </label>
                  <input value={formData.industry} onChange={e=>setFormData({...formData, industry: e.target.value})} placeholder="e.g. Construction, SaaS" type="text" className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
              </div>
            </div>

            {/* AI Matching Criteria */}
            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-semibold border-b border-border/50 pb-2">Scoring Matrix Variables</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                  <Navigation size={16} className="text-primary"/> CPV Codes (Comma separated)
                </label>
                <input value={formData.cpvCodes} onChange={e=>setFormData({...formData, cpvCodes: e.target.value})} placeholder="09331200, 45231000" type="text" className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all" />
                <p className="text-xs text-muted-foreground mt-1">If a tender matches these Common Procurement Vocabulary codes, you get 40 points!</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                  <Tags size={16} className="text-primary"/> NLP Keywords
                </label>
                <input value={formData.keywords} onChange={e=>setFormData({...formData, keywords: e.target.value})} placeholder="Solar panels, Node.js, Pipeline" type="text" className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all" />
                <p className="text-xs text-muted-foreground mt-1">We literally read the entire Tender description! If these keywords appear, you get a massive boost.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                  <MapPin size={16} className="text-primary"/> Operational HQ
                </label>
                <input value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} placeholder="e.g. Berlin, Germany" type="text" className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
            </div>

            {/* Scale Restrictions */}
            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-semibold border-b border-border/50 pb-2">Financial Scale Thresholds</h3>
              <p className="text-sm text-muted-foreground mb-4">Any tenders completely outside this budget range will aggressively drop your match score so you aren't overwhelmed by massive (or tiny) bids.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                    <DollarSign size={16} className="text-primary"/> Minimum Tender Size
                  </label>
                  <input value={formData.minBudget} onChange={e=>setFormData({...formData, minBudget: e.target.value})} type="number" placeholder="50000" className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                    <DollarSign size={16} className="text-primary"/> Maximum Tender Capacity
                  </label>
                  <input value={formData.maxBudget} onChange={e=>setFormData({...formData, maxBudget: e.target.value})} type="number" placeholder="250000000" className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
              </div>
            </div>

            {status && (
              <div className="p-4 bg-primary/20 text-primary rounded-xl text-center font-medium">
                {status}
              </div>
            )}

            <button disabled={loading} className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
              {loading ? "Re-syncing AI Vector Database..." : "Save Configuration & Launch AI"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

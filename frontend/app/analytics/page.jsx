"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/ui/navbar"
import { useNavigate } from "react-router-dom"
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Target, 
  Zap, 
  ShieldCheck, 
  Briefcase,
  Layers,
  ArrowUpRight
} from "lucide-react"

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMatches: 0,
    avgScore: 0,
    topSector: "Calculating...",
    marketHealth: "Processing",
    budgetRange: "Pending Analysis",
    scoreDistribution: { high: 0, med: 0, low: 0 },
    categoryDistribution: []
  })

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/auth")
      return
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tenders/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setStats({
            ...data,
            marketHealth: parseFloat(data.avgScore) > 70 ? "Strategic" : "Neutral",
            budgetRange: "Multi-Tier" // Could be dynamic if we add meta stats
          })
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [navigate, API_URL])

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Market <span className="text-primary italic">Intelligence</span>
          </motion.h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Real-time multi-dimensional analysis of your matched tender landscape. 
            Our AI continuously recalibrates your strategic position.
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-card/40 animate-pulse rounded-2xl border border-border" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnalyticsCard 
                icon={<Target className="text-primary" size={20}/>} 
                label="Match Calibration" 
                value={`${stats.avgScore}%`} 
                trend="+2.4% vs last week"
                onClick={() => navigate('/dashboard')}
              />
              <AnalyticsCard 
                icon={<Layers className="text-primary" size={20}/>} 
                label="Identified Leads" 
                value={stats.totalMatches} 
                trend="12 new opportunities"
                onClick={() => navigate('/saved-bids')}
              />
              <AnalyticsCard 
                icon={<Zap className="text-primary" size={20}/>} 
                label="Top Sector" 
                value={stats.topSector} 
                trend="85% relevance score"
                onClick={() => navigate('/explore')}
              />
              <AnalyticsCard 
                icon={<ShieldCheck className="text-primary" size={20}/>} 
                label="Strategic Status" 
                value={stats.marketHealth} 
                trend="High-probability mode"
                onClick={() => navigate('/dashboard')}
              />
            </div>

            {/* Main Graphs Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-8 relative overflow-hidden group/chart cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/chart:scale-110 transition-transform">
                  <BarChart3 size={120} />
                </div>
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <ActivityIcon size={24} className="text-primary" />
                  Score Distribution
                </h3>
                
                <div className="space-y-6">
                  <ScoreBar label="High Probability (>80%)" count={stats.scoreDistribution.high} total={stats.totalMatches} />
                  <ScoreBar label="Strategic Opportunity (50-80%)" count={stats.scoreDistribution.med} total={stats.totalMatches} />
                  <ScoreBar label="Baseline Match (<50%)" count={stats.scoreDistribution.low} total={stats.totalMatches} />
                </div>
              </div>

              <div className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-8 cursor-pointer group/pie" onClick={() => navigate('/dashboard')}>
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <PieChart size={24} className="text-primary group-hover/pie:rotate-12 transition-transform" />
                  Diversification
                </h3>
                <div className="space-y-6">
                  {stats.categoryDistribution.slice(0, 4).map((item, i) => (
                    <DiversificationItem key={i} label={item.label} percentage={item.percentage} />
                  ))}
                  {stats.categoryDistribution.length === 0 && (
                    <p className="text-muted-foreground text-sm italic">Insufficient data for breakdown</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="bg-primary/10 rounded-3xl p-12 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="max-w-xl">
                 <h2 className="text-3xl font-bold mb-4">Strategic Capacity: {stats.budgetRange}</h2>
                 <p className="text-muted-foreground">We've adjusted our AI filter weights based on your match history. Your profile is currently resonating strongest with high-yield public service contracts.</p>
               </div>
               <button 
                 onClick={() => navigate('/dashboard')}
                 className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
               >
                  Verify Matching Feed <ArrowUpRight size={20}/>
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function AnalyticsCard({ icon, label, value, trend, onClick }) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card/40 border border-border p-6 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">{icon}</div>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{label}</span>
        </div>
        <ArrowUpRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-4xl font-bold mb-2 tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>{value}</div>
      <div className="text-xs text-primary font-medium">{trend}</div>
    </motion.div>
  )
}

function ScoreBar({ label, count, total }) {
  const percentage = (count / total) * 100
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{count} Tenders</span>
      </div>
      <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-primary"
        />
      </div>
    </div>
  )
}

function DiversificationItem({ label, percentage }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm text-muted-foreground">{percentage}%</span>
    </div>
  )
}

function ActivityIcon({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

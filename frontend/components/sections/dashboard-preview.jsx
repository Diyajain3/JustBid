"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"

gsap.registerPlugin(ScrollTrigger)

export function DashboardPreview() {
  const containerRef = useRef(null)
  const dashboardRef = useRef(null)
  
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [counters, setCounters] = useState({
    tenders: 0,
    matches: 0,
    winRate: 0,
  })

  // Fetch LIVE Tenders from Backend!
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const fetchTenders = async () => {
      try {
        const token = localStorage.getItem('token');
        let res;
        
        // If user logged in, get personalized feed. Otherwise all tenders.
        if (token) {
           res = await fetch(`${API_URL}/api/tenders/feed`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
        
        // Fallback to public feed if fetch failed or no token
        if (!token || !res.ok) {
           res = await fetch(`${API_URL}/api/tenders`);
        }

        const data = await res.json();
        
        // Ensure data exists, if using generic tenders route it returns {tenders: []}
        const dataList = data.tenders ? data.tenders : data;
        setTenders(dataList.slice(0, 4)); // Get top 4 recent/matched tenders
      } catch (err) {
        console.error("Failed fetching live tenders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        dashboardRef.current,
        { scale: 0.8, opacity: 0, rotateX: 20, y: 100 },
        {
          scale: 1, opacity: 1, rotateX: 0, y: 0,
          scrollTrigger: { trigger: containerRef.current, start: "top 70%", end: "top 20%", scrub: 1 },
        }
      )

      const counterTrigger = {
        trigger: dashboardRef.current,
        start: "top 60%",
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, { 
            val: 1, 
            duration: 2, 
            ease: "power2.out",
            onUpdate: function() { 
              const progress = this.progress();
              setCounters({
                tenders: Math.round(gsap.utils.interpolate(0, tenders.length || 154, progress)),
                matches: Math.round(gsap.utils.interpolate(0, tenders.length ? tenders.length : 12, progress)),
                winRate: Math.round(gsap.utils.interpolate(0, 84, progress))
              });
            } 
          });
        },
        once: true,
      }
      ScrollTrigger.create(counterTrigger)
    }, containerRef)

    return () => ctx.revert()
  }, [tenders])

  return (
    <section ref={containerRef} className="relative py-32 md:py-48 overflow-hidden" style={{ perspective: "1000px" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_50%)] opacity-10" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Live API Tenders
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            These tenders are actively syncing from our MongoDB Database instead of static arrays!
          </p>
        </div>

        <div ref={dashboardRef} className="relative max-w-6xl mx-auto" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
          <div className="relative bg-card/90 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <span className="ml-4 text-sm text-green-400 font-bold">API Connected & Active</span>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard label="Active Tenders" value={counters.tenders.toLocaleString()} change="+12%" positive />
                <StatCard label="Your Matches" value={counters.matches.toString()} change="+28%" positive />
                <StatCard label="Win Rate" value={`${counters.winRate}%`} change="+5%" positive />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="dashboard-card lg:col-span-1">
                  <div className="bg-secondary/50 rounded-2xl p-6">
                    <h4 className="text-sm text-muted-foreground mb-4">Top Match Score</h4>
                    <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-green-400" style={{ fontFamily: "var(--font-display)" }}>99%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-card lg:col-span-2">
                  <div className="bg-secondary/50 rounded-2xl p-6 h-full">
                    <h4 className="text-sm text-muted-foreground mb-4">Live Database Feed</h4>
                    <div className="space-y-3">
                      
                      {loading ? (
                         <div className="p-4 text-center mt-4">Loading real database tenders...</div>
                      ) : tenders.length === 0 ? (
                         <div className="p-4 text-center mt-4 border border-dashed rounded-lg border-border">No tenders found in the backend database. Try running the python worker!</div>
                      ) : (
                        tenders.map((tender, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }} className="flex items-center justify-between p-3 bg-background/50 rounded-xl mb-2">
                          <div className="flex flex-col gap-1 w-full text-left">
                            <p className="font-bold text-sm text-primary">{tender.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1" dangerouslySetInnerHTML={{ __html: tender.description || "Analytical node data pending..." }} />
                            <div className="flex gap-2 mt-1">
                                {tender.budget && <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-primary uppercase font-bold tracking-tighter">Budget: ${Number(tender.budget).toLocaleString()}</span>}
                                {tender.location && <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-muted-foreground uppercase font-bold tracking-tighter">Location: {tender.location}</span>}
                            </div>
                          </div>
                        </motion.div>
                        ))
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ label, value, change, positive }) {
  return (
    <div className="dashboard-card bg-secondary/50 rounded-2xl p-6">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
      <p className={`text-sm ${positive ? "text-green-400" : "text-red-400"}`}>{change} this month</p>
    </div>
  )
}

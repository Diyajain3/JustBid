"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"

gsap.registerPlugin(ScrollTrigger)

export function DashboardPreview() {
  const containerRef = useRef(null)
  const dashboardRef = useRef(null)
  const [counters, setCounters] = useState({
    tenders: 0,
    matches: 0,
    winRate: 0,
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Dashboard scale and reveal animation
      gsap.fromTo(
        dashboardRef.current,
        {
          scale: 0.8,
          opacity: 0,
          rotateX: 20,
          y: 100,
        },
        {
          scale: 1,
          opacity: 1,
          rotateX: 0,
          y: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "top 20%",
            scrub: 1,
          },
        }
      )

      // Counter animations
      const counterTrigger = {
        trigger: dashboardRef.current,
        start: "top 60%",
        onEnter: () => {
          // Animate tenders count
          gsap.to({}, {
            duration: 2,
            onUpdate: function() {
              setCounters(prev => ({
                ...prev,
                tenders: Math.round(gsap.utils.interpolate(0, 12847, this.progress()))
              }))
            }
          })
          // Animate matches count
          gsap.to({}, {
            duration: 2.2,
            onUpdate: function() {
              setCounters(prev => ({
                ...prev,
                matches: Math.round(gsap.utils.interpolate(0, 342, this.progress()))
              }))
            }
          })
          // Animate win rate
          gsap.to({}, {
            duration: 2.5,
            onUpdate: function() {
              setCounters(prev => ({
                ...prev,
                winRate: Math.round(gsap.utils.interpolate(0, 73, this.progress()))
              }))
            }
          })
        },
        once: true,
      }

      ScrollTrigger.create(counterTrigger)

      // Animate dashboard elements
      const cards = dashboardRef.current?.querySelectorAll(".dashboard-card")
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            scrollTrigger: {
              trigger: dashboardRef.current,
              start: "top 50%",
              end: "top 20%",
              scrub: 1,
            },
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_50%)] opacity-10" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-7xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your command center
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            All your tenders, analytics, and insights in one powerful dashboard.
          </p>
        </div>

        {/* Mock Dashboard */}
        <div
          ref={dashboardRef}
          className="relative max-w-6xl mx-auto"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Dashboard frame */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
          <div className="relative bg-card/90 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-2xl">
            {/* Dashboard header */}
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-sm text-muted-foreground">JustBid Dashboard</span>
            </div>

            {/* Dashboard content */}
            <div className="p-6 md:p-8">
              {/* Stats row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard
                  label="Active Tenders"
                  value={counters.tenders.toLocaleString()}
                  change="+12%"
                  positive
                />
                <StatCard
                  label="Your Matches"
                  value={counters.matches.toString()}
                  change="+28%"
                  positive
                />
                <StatCard
                  label="Win Rate"
                  value={`${counters.winRate}%`}
                  change="+5%"
                  positive
                />
              </div>

              {/* Main content area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Match score card */}
                <div className="dashboard-card lg:col-span-1">
                  <div className="bg-secondary/50 rounded-2xl p-6">
                    <h4 className="text-sm text-muted-foreground mb-4">Top Match Score</h4>
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-border"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeLinecap="round"
                          className="text-primary"
                          initial={{ strokeDasharray: "0 283" }}
                          whileInView={{ strokeDasharray: "255 283" }}
                          transition={{ duration: 2, ease: "easeOut" }}
                          viewport={{ once: true }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                          92%
                        </span>
                      </div>
                    </div>
                    <p className="text-center mt-4 text-sm text-muted-foreground">
                      Highway Construction - Mumbai
                    </p>
                  </div>
                </div>

                {/* Recent tenders list */}
                <div className="dashboard-card lg:col-span-2">
                  <div className="bg-secondary/50 rounded-2xl p-6">
                    <h4 className="text-sm text-muted-foreground mb-4">Recent Matches</h4>
                    <div className="space-y-3">
                      {[
                        { title: "IT Infrastructure Upgrade", match: 92, value: "$2.4M" },
                        { title: "Smart City Development", match: 87, value: "$5.1M" },
                        { title: "Healthcare Equipment Supply", match: 84, value: "$890K" },
                        { title: "Renewable Energy Project", match: 79, value: "$3.2M" },
                      ].map((tender, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          viewport={{ once: true }}
                          className="flex items-center justify-between p-3 bg-background/50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                              tender.match >= 90 ? "bg-green-500/20 text-green-400" :
                              tender.match >= 80 ? "bg-primary/20 text-primary" :
                              "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {tender.match}%
                            </div>
                            <div>
                              <p className="font-medium text-sm">{tender.title}</p>
                              <p className="text-xs text-muted-foreground">{tender.value}</p>
                            </div>
                          </div>
                          <button className="text-primary text-sm hover:underline">View</button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity graph placeholder */}
              <div className="dashboard-card mt-6">
                <div className="bg-secondary/50 rounded-2xl p-6">
                  <h4 className="text-sm text-muted-foreground mb-4">Bid Activity</h4>
                  <div className="flex items-end gap-2 h-32">
                    {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95, 70, 88].map((height, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        viewport={{ once: true }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Jan</span>
                    <span>Dec</span>
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
      <p className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      <p className={`text-sm ${positive ? "text-green-400" : "text-red-400"}`}>
        {change} this month
      </p>
    </div>
  )
}

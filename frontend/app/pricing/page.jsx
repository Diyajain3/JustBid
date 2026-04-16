import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { Check, X, Zap, ChevronLeft, Building2, Crown } from "lucide-react"
import { Link } from "react-router-dom"

export default function PricingPage() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animations
      gsap.from(".pricing-header", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out"
      })
      
      gsap.from(".pricing-card", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.3
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-background text-foreground overflow-hidden relative py-20 px-6"
    >
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Navigation */}
      <div className="max-w-6xl mx-auto mb-16 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center pricing-header max-w-2xl mx-auto mb-20">
          <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Transparent pricing for <span className="text-primary">every bidder</span>.
          </h1>
          <p className="text-lg text-muted-foreground">
            Whether you're just exploring the market or representing a major enterprise, we have a plan suited for your tender acquisition needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* FREE TIER */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="pricing-card h-full bg-card/40 border border-border/50 rounded-3xl p-8 lg:p-10 flex flex-col relative overflow-hidden backdrop-blur-sm shadow-xl"
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Free Access</h3>
                <div className="bg-secondary p-2 rounded-lg text-foreground/80">
                  <Building2 size={24} />
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6 h-10">
                Perfect for newcomers exploring the JustBid ecosystem.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">$0</span>
                <span className="text-muted-foreground">/ forever</span>
              </div>
            </div>

            <div className="space-y-4 mb-10 flex-grow">
              <div className="flex items-start gap-3">
                <Check className="text-primary mt-0.5 shrink-0" size={18} />
                <span className="text-foreground/80 text-sm">Limited time daily platform access</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-primary mt-0.5 shrink-0" size={18} />
                <span className="text-foreground/80 text-sm">Access to standard tenders</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-primary mt-0.5 shrink-0" size={18} />
                <span className="text-foreground/80 text-sm">Basic bidding capabilities</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="text-foreground/40 mt-0.5 shrink-0" size={18} />
                <span className="text-foreground/50 text-sm line-through">First priority tender notifications</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="text-foreground/40 mt-0.5 shrink-0" size={18} />
                <span className="text-foreground/50 text-sm line-through">Advanced analytics & insights</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="text-foreground/40 mt-0.5 shrink-0" size={18} />
                <span className="text-foreground/50 text-sm line-through">Dedicated account manager</span>
              </div>
            </div>

            <Link 
              to="/auth" 
              className="w-full py-4 rounded-xl border border-border text-center font-medium hover:bg-secondary transition-colors"
            >
              Get Started for Free
            </Link>
          </motion.div>


          {/* PRO TIER */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="pricing-card h-full bg-gradient-to-b from-card/80 to-card/40 border border-primary/50 flex flex-col rounded-3xl p-8 lg:p-10 relative overflow-hidden backdrop-blur-sm shadow-2xl shadow-primary/10"
          >
            {/* Glow accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] pointer-events-none rounded-full" />
            
            <div className="absolute top-0 right-8 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-b-lg tracking-wider uppercase">
              Most Popular
            </div>

            <div className="mb-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-foreground">Pro Access</h3>
                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                  <Crown size={24} />
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6 h-10">
                For serious entities who need the competitive edge.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">$299</span>
                <span className="text-muted-foreground">/ month</span>
              </div>
            </div>

            <div className="space-y-4 mb-10 flex-grow relative z-10">
              <div className="flex items-start gap-3">
                <Check className="text-primary mt-0.5 shrink-0" size={18} />
                <span className="text-foreground/90 font-medium text-sm">Unlimited 24/7 platform access</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-primary mt-0.5 shrink-0" size={18} />
                <span className="text-foreground/90 font-medium text-sm">Full access to ALL premium tenders</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-primary mt-0.5 shrink-0" size={18} />
                <span className="text-foreground/90 font-medium text-sm">First priority instant notifications</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-primary mt-0.5 shrink-0" size={18} />
                <span className="text-foreground/80 text-sm">Advanced market analytics & insights</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-primary mt-0.5 shrink-0" size={18} />
                <span className="text-foreground/80 text-sm">Premium automation API tools</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-primary mt-0.5 shrink-0" size={18} />
                <span className="text-foreground/80 text-sm">Dedicated VIP account manager</span>
              </div>
            </div>

            <Link 
              to="/auth" 
              className="relative z-10 w-full py-4 rounded-xl bg-primary text-primary-foreground text-center font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Upgrade to Pro
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

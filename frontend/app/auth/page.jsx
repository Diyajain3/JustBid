import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { Mail, Lock, User, ArrowRight, ShieldCheck, Zap, TrendingUp, ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const leftSideRef = useRef(null)

  useEffect(() => {
    // GSAP Animation for the advantages list
    const ctx = gsap.context(() => {
      gsap.from(".advantage-item", {
        opacity: 0,
        x: -40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.3
      })
      
      gsap.from(".auth-brand", {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.out"
      })
    }, leftSideRef)

    return () => ctx.revert()
  }, [])

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev)
  }

  // Common variants for form transitions
  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  }

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden">
      
      {/* LEFT SIDE - Advantages */}
      <div 
        ref={leftSideRef}
        className="hidden lg:flex flex-col w-1/2 relative overflow-hidden bg-card/30"
      >
        {/* Abstract animated background element */}
        <motion.div 
          className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Inner centered container */}
        <div className="relative z-10 flex flex-col justify-between h-full w-full max-w-xl mx-auto p-12 lg:px-20 lg:py-16">
          <Link to="/" className="auth-brand inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors w-fit">
            <ChevronLeft size={20} />
            <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>JustBid</span>
          </Link>

          <div className="my-auto py-12">
            <h1 className="text-4xl font-bold mb-6 !leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Join the elite circle of <span className="text-primary glitch-text" data-text="exclusive">exclusive</span> bidding.
            </h1>
            <p className="text-foreground/70 text-lg mb-12">
              Experience the next generation of auctions. Transparent, secure, and lightning fast.
            </p>

            <div className="space-y-10">
              <div className="advantage-item flex items-start gap-5">
                <div className="bg-primary/10 p-3.5 rounded-xl text-primary mt-1">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Real-time Action</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    Experience millisecond-precise bidding with our websocket-powered live auction engine.
                  </p>
                </div>
              </div>

              <div className="advantage-item flex items-start gap-5">
                <div className="bg-primary/10 p-3.5 rounded-xl text-primary mt-1">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Bank-grade Security</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    Your data and transactions are protected by industry-leading encryption and escrow services.
                  </p>
                </div>
              </div>

              <div className="advantage-item flex items-start gap-5">
                <div className="bg-primary/10 p-3.5 rounded-xl text-primary mt-1">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Premium Analytics</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    Get deep insights into bidding trends, asset valuations, and market momentum.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-foreground/40 mt-auto">
            © {new Date().getFullYear()} JustBid Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 border-l border-border/50 relative">
        {/* Abstract animated background element for right side */}
         <motion.div 
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, -40, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        />

        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-12">
            <ChevronLeft size={20} />
            <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>JustBid</span>
          </Link>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <motion.div variants={childVariants} className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                  <p className="text-muted-foreground">Enter your credentials to access your account.</p>
                </motion.div>

                <motion.div variants={childVariants} className="space-y-4 mb-6">
                  <button className="w-full flex items-center justify-center gap-3 bg-secondary hover:bg-secondary/80 text-foreground py-3 px-4 rounded-xl transition-all border border-border/50 hover:border-border font-medium">
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                  </button>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="px-3 text-xs text-muted-foreground uppercase tracking-wider">Or continue with</span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>

                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/90">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input 
                          type="email" 
                          placeholder="name@example.com" 
                          className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-foreground/90">Password</label>
                        <a href="#" className="text-xs text-primary hover:text-primary/80">Forgot password?</a>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input 
                          type="password" 
                          placeholder="••••••••" 
                          className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors mt-2 flex justify-center items-center gap-2 group">
                      Sign In
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </motion.div>

                <motion.p variants={childVariants} className="text-center text-sm text-muted-foreground mt-8">
                  Don't have an account?{" "}
                  <button onClick={toggleAuthMode} className="text-primary font-medium hover:underline focus:outline-none">
                    Create one now
                  </button>
                </motion.p>
              </motion.div>

            ) : (

              <motion.div
                key="register-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <motion.div variants={childVariants} className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
                  <p className="text-muted-foreground">Join JustBid and start bidding today.</p>
                </motion.div>

                <motion.div variants={childVariants} className="space-y-4 mb-6">
                  <button className="w-full flex items-center justify-center gap-3 bg-secondary hover:bg-secondary/80 text-foreground py-3 px-4 rounded-xl transition-all border border-border/50 hover:border-border font-medium">
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign up with Google
                  </button>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="px-3 text-xs text-muted-foreground uppercase tracking-wider">Or register with</span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>

                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/90">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input 
                          type="text" 
                          placeholder="John Doe" 
                          className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/90">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input 
                          type="email" 
                          placeholder="name@example.com" 
                          className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/90">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input 
                          type="password" 
                          placeholder="Create a strong password" 
                          className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors mt-2 flex justify-center items-center gap-2 group">
                      Create Account
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </motion.div>

                <motion.p variants={childVariants} className="text-center text-sm text-muted-foreground mt-8">
                  Already have an account?{" "}
                  <button onClick={toggleAuthMode} className="text-primary font-medium hover:underline focus:outline-none">
                    Sign in instead
                  </button>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

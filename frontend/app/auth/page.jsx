import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { Mail, Lock, User, ArrowRight, ShieldCheck, Zap, TrendingUp, ChevronLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Atmosphere } from "@/components/ui/atmosphere"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgot, setIsForgot] = useState(false)
  const leftSideRef = useRef(null)
  const navigate = useNavigate()

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
    setIsForgot(false)
    setError(null)
  }

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      alert(`Simulation Success: Check your Backend Node Terminal right now! Since we don't have an email provider configured, the secure reset link has been printed to your node console.`);
      setIsForgot(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Store JWT token and session data locally
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({id: data.id, email: data.email, role: data.role, name: data.name}));
      if (data.company) {
        localStorage.setItem('company', JSON.stringify(data.company));
      }
      
      // Redirect to home/dashboard
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        className="hidden lg:flex flex-col w-1/2 relative overflow-hidden bg-[rgb(10,10,13)]"
      >
        <Atmosphere />
        
        {/* subtle gradient overlay over the particles so text is more readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/40 to-transparent pointer-events-none" />
        
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
                    Experience millisecond-precise bidding with our backend-powered live auction engine.
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
                    Protected by industry-leading JSON Web Tokens and robust encrypted cluster storage layers.
                  </p>
                </div>
              </div>

              <div className="advantage-item flex items-start gap-5">
                <div className="bg-primary/10 p-3.5 rounded-xl text-primary mt-1">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Based Tenders</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    Instantly get matched to the best fitting CPV construction contracts dynamically.
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 border-l border-white/5 relative bg-[#0a0a0b]">
         <motion.div 
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="w-full max-w-md relative z-10">
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
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                  <p className="text-muted-foreground">Enter your credentials to connect to our secure strategic server.</p>
                </div>

                {error && <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-3 rounded">{error}</div>}

                <div className="space-y-4 mb-6">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/90">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com" 
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-foreground/90">Password</label>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••" 
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/30"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-1">
                      <button type="button" onClick={() => { setIsForgot(true); setError(null); }} className="text-sm font-medium text-primary hover:underline ml-auto block">Forgot password?</button>
                    </div>

                    <button disabled={loading} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                      {loading ? 'INITIATING...' : 'ESTABLISH CONNECTION'}
                    </button>
                  </form>
                </div>

                <div className="text-center text-sm text-muted-foreground mt-8">
                  Don't have an account?{" "}
                  <button onClick={toggleAuthMode} className="text-primary font-medium hover:underline focus:outline-none">
                    Create one now
                  </button>
                </div>
              </motion.div>

            ) : isForgot ? (
              <motion.div
                key="forgot-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
                  <p className="text-muted-foreground">Enter your email and we'll send you a rescue link.</p>
                </div>

                {error && <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-3 rounded">{error}</div>}

                <div className="space-y-4 mb-6">
                  <form className="space-y-4" onSubmit={handleForgotSubmit}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/90">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com" 
                          required
                          className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors mt-2 flex justify-center items-center gap-2 group">
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                </div>

                <div className="text-center text-sm text-muted-foreground mt-8">
                  Remember your password?{" "}
                  <button onClick={() => setIsForgot(false)} className="text-primary font-medium hover:underline focus:outline-none">
                    Back to login
                  </button>
                </div>
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
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
                  <p className="text-muted-foreground">Join JustBid and start fetching real API data today.</p>
                </div>

                {error && <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-3 rounded">{error}</div>}

                <div className="space-y-4 mb-6">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/90">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe" 
                          required
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com" 
                          required
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
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a strong password" 
                          required
                          className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors mt-2 flex justify-center items-center gap-2 group">
                      {loading ? 'Creating...' : 'Create Account'}
                    </button>
                  </form>
                </div>

                <div className="text-center text-sm text-muted-foreground mt-8">
                  Already have an account?{" "}
                  <button onClick={toggleAuthMode} className="text-primary font-medium hover:underline focus:outline-none">
                    Sign in instead
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

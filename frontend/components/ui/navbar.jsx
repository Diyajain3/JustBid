"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Circle, User, LayoutDashboard, Telescope, Send, Activity } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const navRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    // Scroll logic
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-6">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`flex items-center gap-4 px-6 py-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-2xl transition-all duration-500 ease-in-out shadow-2xl ${
          isScrolled ? "scale-95 bg-black/80 py-2 border-white/20" : "scale-100"
        }`}
      >
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group mr-6 pl-2">
          <Activity size={18} className="text-primary animate-pulse" />
          <span className="text-lg font-bold tracking-tight uppercase" style={{ fontFamily: "var(--font-display)" }}>
            JustBid
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" label="Home" active={location.pathname === "/"} />
          <NavLink to="/explore" label="Explore" active={location.pathname === "/explore"} />
          <NavLink to="/dashboard" label="Console" active={location.pathname === "/dashboard"} />
          <NavLink to="/saved-bids" label="Inbox" active={location.pathname === "/saved-bids"} />
          <NavLink to="/analytics" label="Insights" active={location.pathname === "/analytics"} />
          <NavLink to="/vision" label="Vision" active={location.pathname === "/vision"} />
        </div>

        {/* User / Auth */}
        <div className="flex items-center gap-2 ml-4 pr-1">
          {localStorage.getItem('token') ? (
            <button 
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                window.location.href = "/"
              }}
              className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              Terminate
            </button>
          ) : (
            <Link 
              to="/auth" 
              className="hidden lg:block px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all shadow-[0_0_15px_rgba(var(--primary),0.1)]"
            >
              Sign In
            </Link>
          )}
          <Link 
            to={localStorage.getItem('token') ? "/profile" : "/auth"} 
            className={`flex items-center justify-center p-2 rounded-xl transition-all ${
              location.pathname === "/profile" || location.pathname === "/auth"
                ? "bg-primary/20 text-primary border border-primary/20" 
                : "text-muted-foreground hover:text-primary hover:bg-white/5"
            }`}
          >
            <User size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </motion.nav>
    </div>
  )
}

function NavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`relative px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-white flex items-center gap-2 group ${
        active ? "text-white" : "text-muted-foreground"
      }`}
    >
      {active && <div className="w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />}
      {label}
    </Link>
  )
}

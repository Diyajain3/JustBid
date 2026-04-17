"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Circle, User, LayoutDashboard, Telescope, Send, Activity } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [tenderCount, setTenderCount] = useState(12430)
  const navRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    // Ticker logic
    const interval = setInterval(() => {
      setTenderCount(prev => prev + Math.floor(Math.random() * 3))
    }, 5000)

    // Scroll logic
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      clearInterval(interval)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-6">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`flex items-center gap-4 px-4 py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl transition-all duration-500 shadow-2xl ${
          isScrolled ? "scale-95" : "scale-100"
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
          <NavLink to="/vision" label="Vision" active={location.pathname === "/vision"} />
          <NavLink to="/contact" label="Contact" active={location.pathname === "/contact"} />
          <NavLink to="/dashboard" label="Console" active={location.pathname === "/dashboard"} />
        </div>

        {/* User / Auth */}
        <div className="ml-4 pr-1">
          <Link to="/auth" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all">
            <User size={14} />
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

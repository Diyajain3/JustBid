import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import Home from '@/app/page'
import AuthPage from '@/app/auth/page'
import PricingPage from '@/app/pricing/page'
import ContactPage from '@/app/contact/page'
import ProfilePage from '@/app/profile/page'
import DashboardPage from '@/app/dashboard/page'
import ExplorePage from '@/app/explore/page'
import ResetPasswordPage from '@/app/auth/reset/page'
import VisionPage from '@/app/vision/page'
import AnalyticsPage from '@/app/analytics/page'
import AnalysisPage from '@/app/analysis/page'
import SavedBidsPage from '@/app/saved-bids/page'
import TeamPage from '@/app/team/page'
import { AiBroker } from '@/components/ui/ai-broker'
import { AiChatbot } from '@/components/ui/ai-chatbot'
import { FloatingDock } from '@/components/ui/floating-dock'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))
  const location = useLocation()

  useEffect(() => {
    // Initialize Lenis for buttery smooth scroll
    const lenis = new Lenis()
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
    
    return () => lenis.destroy()
  }, [location.pathname])

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/saved-bids" element={<SavedBidsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/auth/reset/:token" element={<ResetPasswordPage />} />
            <Route path="/vision" element={<VisionPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* Neural Interface Features - Only for authenticated operatives */}
      {isLoggedIn && (
        <>
          <AiBroker />
          <AiChatbot />
          <FloatingDock />
        </>
      )}
    </>
  )
}

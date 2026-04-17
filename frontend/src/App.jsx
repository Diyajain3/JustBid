import { Routes, Route } from 'react-router-dom'
import Home from '@/app/page'
import AuthPage from '@/app/auth/page'
import PricingPage from '@/app/pricing/page'
import ContactPage from '@/app/contact/page'
import ProfilePage from '@/app/profile/page'
import DashboardPage from '@/app/dashboard/page'
import ExplorePage from '@/app/explore/page'
import ResetPasswordPage from '@/app/auth/reset/page'
import VisionPage from '@/app/vision/page'
import { AiBroker } from '@/components/ui/ai-broker'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/auth/reset/:token" element={<ResetPasswordPage />} />
        <Route path="/vision" element={<VisionPage />} />
      </Routes>
      <AiBroker />
    </>
  )
}

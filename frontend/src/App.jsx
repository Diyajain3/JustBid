import { Routes, Route } from 'react-router-dom'
import Home from '@/app/page'
import AuthPage from '@/app/auth/page'
import PricingPage from '@/app/pricing/page'
import ContactPage from '@/app/contact/page'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      {/* Add more routes here as we migrate them */}
    </Routes>
  )
}

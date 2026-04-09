import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl shadow-black/50" : "bg-transparent"} text-slate-200`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          <Logo/>

          <div className="hidden md:flex items-center gap-10">
            <a href="#solution" className="text-slate-400 hover:text-white transition-colors duration-300 font-medium text-sm tracking-wide">Features</a>
            <a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors duration-300 font-medium text-sm tracking-wide">Methodology</a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition-colors duration-300 font-medium text-sm tracking-wide">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/login" className="text-slate-400 hover:text-white font-medium text-sm transition-colors duration-300">
              Sign In
            </Link>
            <Link to="/register" className="bg-white hover:bg-slate-100 text-slate-950 px-7 py-2.5 rounded-full font-bold text-sm transition-all duration-300 active:scale-95 shadow-lg shadow-white/5">
              Get Started
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800">
          <div className="px-6 pt-4 pb-10 space-y-6">
            <a href="#solution" className="block text-lg font-medium text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-lg font-medium text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Methodology</a>
            <a href="#pricing" className="block text-lg font-medium text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
            <div className="pt-4 space-y-4">
              <Link to="/login" className="block w-full text-center py-3 text-slate-400 hover:text-white font-medium border border-slate-800 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="block w-full text-center py-3 bg-white text-slate-950 font-bold rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
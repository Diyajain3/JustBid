import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll effect (blur navbar)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 Smooth scroll with offset (fix for fixed navbar)
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const yOffset = -90;
    const y =
      el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 
      ${
        isScrolled
          ? "bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-purple-100 dark:border-purple-900/30 shadow-md shadow-purple-100/40 dark:shadow-purple-900/10"
          : "bg-transparent"
      } text-slate-700 dark:text-slate-300`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">

          {/* Logo */}
          <Logo />

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">

            <button
              onClick={() => scrollToSection("hero")}
              className="text-slate-500 hover:text-purple-600 transition font-medium text-sm"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("solution")}
              className="text-slate-500 hover:text-purple-600 transition font-medium text-sm"
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-slate-500 hover:text-purple-600 transition font-medium text-sm"
            >
              Methodology
            </button>

            <button
              onClick={() => scrollToSection("pricing")}
              className="text-slate-500 hover:text-purple-600 transition font-medium text-sm"
            >
              Pricing
            </button>

            {/* 🆕 Contact */}
            <button
              onClick={() => scrollToSection("contact")}
              className="text-slate-500 hover:text-purple-600 transition font-medium text-sm"
            >
              Contact
            </button>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/login"
              className="text-slate-500 hover:text-purple-600 font-medium text-sm transition"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-white px-7 py-2.5 rounded-full font-bold text-sm transition active:scale-95 shadow-md shadow-purple-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-purple-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-purple-100">
          <div className="px-6 pt-4 pb-10 space-y-6">

            <button
              onClick={() => scrollToSection("solution")}
              className="block w-full text-left text-lg text-slate-600 hover:text-purple-600"
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left text-lg text-slate-600 hover:text-purple-600"
            >
              Methodology
            </button>

            <button
              onClick={() => scrollToSection("pricing")}
              className="block w-full text-left text-lg text-slate-600 hover:text-purple-600"
            >
              Pricing
            </button>

            {/* 🆕 Contact */}
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left text-lg text-slate-600 hover:text-purple-600"
            >
              Contact
            </button>

            <div className="pt-4 space-y-4">
              <Link
                to="/login"
                className="block w-full text-center py-3 border border-purple-100 rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="block w-full text-center py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-xl font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
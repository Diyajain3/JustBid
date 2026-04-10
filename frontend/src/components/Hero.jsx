import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".hero-badge", { opacity: 0, y: -20, duration: 0.8, ease: "power3.out" });
      gsap.from(".hero-title", { opacity: 0, y: 30, duration: 1, delay: 0.2, ease: "power3.out" });
      gsap.from(".hero-subtitle", { opacity: 0, y: 30, duration: 1, delay: 0.4, ease: "power3.out" });
      gsap.from(".hero-actions", { opacity: 0, y: 30, duration: 1, delay: 0.6, ease: "power3.out" });
      gsap.from(".hero-note", { opacity: 0, duration: 1, delay: 0.8, ease: "power3.out" });

      gsap.from(".stat-card", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        delay: 1,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative pt-20 pb-12 lg:pt-28 lg:pb-24 overflow-hidden text-center z-10 bg-white"
    >
      {/* Soft purple background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-200/60 via-white to-white -z-10"></div>

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center">

          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/70 border border-purple-200 text-purple-700 font-medium text-xs mb-6 backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
            Intelligence 2.0 is live
          </div>

          {/* Title */}
          <h1 className="hero-title text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Capture every <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-400 text-5xl lg:text-6xl">
              public contract
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Automate your tender discovery. Our AI-driven engine monitors thousands of sources to deliver only the opportunities that matter to your business.
          </p>

          {/* Buttons */}
          <div className="hero-actions flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">

            <button className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-lg shadow-purple-200 active:scale-95 flex items-center justify-center gap-3">
              Start Free Trial
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-10 py-4 bg-white text-slate-800 rounded-full font-bold text-lg border border-purple-200 hover:border-purple-300 shadow-sm transition-all duration-300 active:scale-95"
            >
              Watch Demo
            </a>
          </div>

          {/* Note */}
          <div className="hero-note flex items-center justify-center gap-3 text-sm text-slate-500 font-medium">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border border-purple-200 bg-white flex items-center justify-center"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              ))}
            </div>
            <span>Trusted by 500+ small businesses</span>
          </div>

        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-purple-100 border-t border-b border-purple-100 py-12">

          <div className="stat-card pb-10 md:pb-0 md:px-10">
            <div className="text-4xl font-bold text-slate-900 mb-2">$40B+</div>
            <div className="text-slate-500 text-sm font-semibold uppercase tracking-widest">
              Market Size
            </div>
          </div>

          <div className="stat-card py-10 md:py-0 md:px-10">
            <div className="text-4xl font-bold text-slate-900 mb-2">2,400+</div>
            <div className="text-slate-500 text-sm font-semibold uppercase tracking-widest">
              Daily Tenders
            </div>
          </div>

          <div className="stat-card pt-10 md:pt-0 md:px-10">
            <div className="text-4xl font-bold text-slate-900 mb-2">12hr</div>
            <div className="text-slate-500 text-sm font-semibold uppercase tracking-widest">
              Time Saved/wk
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
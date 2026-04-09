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
        ease: "power3.out"
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative pt-56 pb-24 lg:pt-64 lg:pb-40 bg-slate-950 overflow-hidden text-center z-10">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 -z-10 pointer-events-none opacity-50"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-slate-300 font-medium text-xs mb-10 backdrop-blur-sm cursor-default hover:border-slate-700 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            Intelligence 2.0 is live
          </div>
          
          <h1 className="hero-title text-4xl md:text-7xl lg:text-[5.5rem] font-bold text-white tracking-tight leading-[1.1] mb-10">
            Capture every<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200">
              public contract
            </span>
          </h1>
          
          <p className="hero-subtitle text-lg md:text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed font-normal">
            Automate your tender discovery. Our AI-driven engine monitors thousands of sources to deliver only the opportunities that matter to your business.
          </p>
          
          <div className="hero-actions flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <button className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-slate-100 text-slate-950 rounded-full font-bold text-lg transition-all duration-300 shadow-2xl shadow-white/5 active:scale-95 flex items-center justify-center gap-3">
              Start Free Trial
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <a href="#how-it-works" className="w-full sm:w-auto px-10 py-4 bg-slate-900/50 hover:bg-slate-800 text-white rounded-full font-bold text-lg transition-all duration-300 border border-slate-800 hover:border-slate-700 backdrop-blur-md active:scale-95">
              Watch Demo
            </a>
          </div>
          
          <div className="hero-note flex items-center justify-center gap-3 text-sm text-slate-500 font-medium">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              ))}
            </div>
            <span>Trusted by 500+ small businesses</span>
          </div>
        </div>
      </div>

      {/* Stats Section with sleek borders */}
      <div className="max-w-6xl mx-auto px-6 mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800 border-t border-b border-slate-800 py-12">
          <div className="stat-card pb-10 md:pb-0 md:px-10">
            <div className="text-4xl font-bold text-white mb-2">$40B+</div>
            <div className="text-slate-500 text-sm font-semibold uppercase tracking-widest">Market Size</div>
          </div>
          <div className="stat-card py-10 md:py-0 md:px-10">
            <div className="text-4xl font-bold text-white mb-2">2,400+</div>
            <div className="text-slate-500 text-sm font-semibold uppercase tracking-widest">Daily Tenders</div>
          </div>
          <div className="stat-card pt-10 md:pt-0 md:px-10">
            <div className="text-4xl font-bold text-white mb-2">12hr</div>
            <div className="text-slate-500 text-sm font-semibold uppercase tracking-widest">Time Saved/wk</div>
          </div>
        </div>
      </div>
    </div>
  );
}

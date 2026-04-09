import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {

      // Problem Cards - animate individually
      gsap.utils.toArray(".problem-card").forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 0.7,
          ease: "power3.out",
        });
      });

      // Solution Cards - animate individually
      gsap.utils.toArray(".solution-card").forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 0.7,
          ease: "power3.out",
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-slate-950 text-slate-200 py-32 pb-40">
      
      {/* ================= PROBLEM ================= */}
      <section id="problem" className="relative mb-48">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Heading */}
          <div className="text-left max-w-2xl mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight text-white leading-tight">
              Traditional procurement is{" "}
              <span className="text-slate-500 italic">inefficient</span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Manual searching across fragmented databases leads to missed deadlines and lost revenue.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-800 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Card 1 */}
            <div className="problem-card bg-slate-950 p-12 hover:bg-slate-900/50 transition-all duration-500 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mb-10 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                🔍
              </div>
              <h3 className="text-xl font-bold mb-5 text-white">Scattered Sources</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Opportunities are spread across hundreds of platforms. We centralize everything into one feed.
              </p>
            </div>

            {/* Card 2 */}
            <div className="problem-card bg-slate-950 p-12 hover:bg-slate-900/50 transition-all duration-500 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mb-10 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                ⚠️
              </div>
              <h3 className="text-xl font-bold mb-5 text-white">High Noise</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Relevant contracts get buried in irrelevant data. We filter the noise.
              </p>
            </div>

            {/* Card 3 */}
            <div className="problem-card bg-slate-950 p-12 hover:bg-slate-900/50 transition-all duration-500 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mb-10 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                ⏰
              </div>
              <h3 className="text-xl font-bold mb-5 text-white">Deadlines</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Late discovery means less prep time. We give real-time alerts.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SOLUTION ================= */}
      <section id="solution" className="relative group">
        
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] -z-10 group-hover:bg-blue-600/10 transition-all duration-1000"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Heading */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-2xl">
              <span className="text-blue-500 text-xs tracking-widest uppercase">
                The Solution
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-6">
                AI-Native tender <br /> discovery platform
              </h2>
            </div>

            <p className="text-slate-400 max-w-sm">
              Built for modern enterprises. Faster discovery, better decisions.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="solution-card bg-slate-900/30 border border-slate-800 p-10 rounded-3xl hover:-translate-y-1 transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-4">Smart Profiling</h3>
              <p className="text-slate-400 text-sm">
                AI understands your business capabilities automatically.
              </p>
            </div>

            <div className="solution-card bg-slate-900/30 border border-slate-800 p-10 rounded-3xl hover:-translate-y-1 transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-4">Semantic Search</h3>
              <p className="text-slate-400 text-sm">
                Context-aware search, not just keywords.
              </p>
            </div>

            <div className="solution-card bg-slate-900/30 border border-slate-800 p-10 rounded-3xl hover:-translate-y-1 transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-4">Winning Insights</h3>
              <p className="text-slate-400 text-sm">
                Analyze competition & success probability.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
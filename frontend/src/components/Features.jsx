import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".fade-title", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.utils.toArray(".feature-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          opacity: 0,
          y: 60,
          scale: 0.96,
          duration: 0.7,
          delay: i * 0.05,
          ease: "power3.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-purple-50 to-white dark:from-black dark:via-slate-900/20 dark:to-black py-16 text-purple-900 dark:text-purple-100"
    >
      {/* 🌈 Background Glow Blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-purple-200/20 dark:bg-purple-900/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-indigo-200/20 dark:bg-purple-900/10 blur-[120px] rounded-full"></div>

      <div className="max-w-6xl mx-auto px-6">

        {/* ================= PROBLEM ================= */}
        <section className="mb-16">

          <div className="max-w-2xl mb-10 fade-title">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-slate-100">
              Traditional procurement is{" "}
              <span className="text-purple-500 italic">broken</span>
            </h2>

            <p className="text-lg text-purple-600 dark:text-purple-400 mt-5">
              Fragmented systems, slow discovery, and missed opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="feature-card group bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-purple-800/20 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(124,58,237,0.35)] dark:hover:shadow-[0_20px_60px_-15px_rgba(124,58,237,0.2)]">
              <div className="text-2xl mb-4 group-hover:scale-110 transition">🔍</div>
              <h3 className="font-bold mb-2">Scattered Sources</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Data spread across dozens of portals.
              </p>
            </div>

            <div className="feature-card group bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-purple-800/20 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(124,58,237,0.35)] dark:hover:shadow-[0_20px_60px_-15px_rgba(124,58,237,0.2)]">
              <div className="text-2xl mb-4 group-hover:scale-110 transition">⚠️</div>
              <h3 className="font-bold mb-2">High Noise</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Irrelevant tenders hide real opportunities.
              </p>
            </div>

            <div className="feature-card group bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-purple-800/20 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(124,58,237,0.35)] dark:hover:shadow-[0_20px_60px_-15px_rgba(124,58,237,0.2)]">
              <div className="text-2xl mb-4 group-hover:scale-110 transition">⏰</div>
              <h3 className="font-bold mb-2">Late Discovery</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                You lose time before even starting.
              </p>
            </div>

          </div>
        </section>

        {/* ================= SOLUTION ================= */}
        <section>

          <div className="mb-14">
            <span className="text-purple-500 text-xs tracking-widest uppercase">
              Solution
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mt-3 fade-title text-slate-900 dark:text-slate-100">
              AI-native procurement intelligence
            </h2>

            <p className="text-purple-600 dark:text-purple-400 mt-4 max-w-xl">
              Faster discovery. Better matches. Higher win rate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="feature-card group bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-purple-100 dark:border-purple-800/20 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_70px_-20px_rgba(99,102,241,0.4)] dark:hover:shadow-[0_25px_70px_-20px_rgba(99,102,241,0.2)]">
              <div className="text-2xl mb-4 group-hover:rotate-6 transition">🧠</div>
              <h3 className="font-bold mb-2">Smart Profiling</h3>
              <p className="text-x text-purple-800 dark:text-purple-300">
                AI understands your business automatically.
              </p>
            </div>

            <div className="feature-card group bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-purple-100 dark:border-purple-800/20 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_70px_-20px_rgba(99,102,241,0.4)] dark:hover:shadow-[0_25px_70px_-20px_rgba(99,102,241,0.2)]">
              <div className="text-2xl mb-4 group-hover:rotate-6 transition">⚡</div>
              <h3 className="font-bold mb-2">Semantic Search</h3>
              <p className="text-x text-purple-800 dark:text-purple-300">
                Understands meaning, not just keywords.
              </p>
            </div>

            <div className="feature-card group bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-purple-100 dark:border-purple-800/20 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_70px_-20px_rgba(99,102,241,0.4)] dark:hover:shadow-[0_25px_70px_-20px_rgba(99,102,241,0.2)]">
              <div className="text-2xl mb-4 group-hover:scale-110 transition">📊</div>
              <h3 className="font-bold mb-2">Winning Insights</h3>
              <p className="text-x text-purple-800 dark:text-purple-300">
                Predicts success probability using data.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
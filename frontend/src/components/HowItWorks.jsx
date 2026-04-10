import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.utils.toArray(".step-card").forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 40,
          scale: 0.95,
          duration: 0.7,
          ease: "power3.out",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="py-20 bg-gradient-to-b from-white via-purple-50 to-white dark:from-black dark:via-slate-900/20 dark:to-black relative overflow-hidden border-t border-purple-200 dark:border-purple-900/30"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-400/10 dark:bg-purple-900/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-200/50 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-800/30 text-purple-700 dark:text-purple-300 font-bold text-[10px] uppercase tracking-widest mb-8">
            The Process
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight text-purple-900 dark:text-slate-100 leading-tight">
            Three steps to dominance
          </h2>

          <p className="text-xl text-purple-600 dark:text-slate-400 font-normal">
            Our engine does the heavy lifting while you focus on the bid.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">

          {/* Connector Line */}
          <div className="hidden md:block absolute top-[2.25rem] left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-800/30 to-transparent -z-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">

            {/* Step 1 */}
            <div className="step-card relative text-center group transition-transform duration-500 hover:-translate-y-2">

              <div className="w-12 h-12 mx-auto bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/30 rounded-xl flex items-center justify-center text-lg font-bold text-purple-600 dark:text-purple-400 mb-12 shadow-sm group-hover:border-purple-400/60 transition-all duration-500">
                01
              </div>

              <h3 className="text-2xl font-bold text-purple-900 dark:text-slate-100 mb-6">
                Identify
              </h3>

              <p className="text-purple-800 dark:text-slate-400 leading-relaxed text-sm max-w-[280px] mx-auto font-normal">
                Connect your business profile. Our AI instantly indexes your core competencies and past successes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="step-card relative text-center group transition-transform duration-500 hover:-translate-y-2">

              <div className="w-12 h-12 mx-auto bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/30 rounded-xl flex items-center justify-center text-lg font-bold text-purple-600 dark:text-purple-400 mb-12 shadow-sm group-hover:border-purple-400/60 transition-all duration-500">
                02
              </div>

              <h3 className="text-2xl font-bold text-purple-900 dark:text-slate-100 mb-6">
                Analyze
              </h3>

              <p className="text-purple-800 dark:text-slate-400 leading-relaxed text-sm max-w-[280px] mx-auto font-normal">
                We scan 27+ global and local databases daily, using semantic analysis to find your perfect matches.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step-card relative text-center group transition-transform duration-500 hover:-translate-y-2">

              <div className="w-12 h-12 mx-auto bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/30 rounded-xl flex items-center justify-center text-lg font-bold text-purple-600 dark:text-purple-400 mb-12 shadow-sm group-hover:border-purple-400/60 transition-all duration-500">
                03
              </div>

              <h3 className="text-2xl font-bold text-purple-900 dark:text-slate-100 mb-6">
                Execute
              </h3>

              <p className="text-purple-800 dark:text-slate-400 leading-relaxed text-sm max-w-[280px] mx-auto font-normal">
                Receive highly targeted alerts with pre-analyzed tender summaries and win-probability scores.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
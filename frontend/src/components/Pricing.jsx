import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Pricing() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.utils.toArray(".pricing-card").forEach((card) => {
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pricing"
      ref={containerRef}
      className="py-32 bg-slate-950 relative border-t border-slate-900"
    >
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-32">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
            Scale your <span className="text-blue-500">acquisition</span>
          </h2>
          <p className="text-xl text-slate-400">
            Simple, transparent pricing for growing teams.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* Starter */}
          <div className="pricing-card bg-slate-950 border border-slate-800 rounded-[2.5rem] p-12 flex flex-col transition-all duration-500 hover:border-slate-700 hover:-translate-y-1">
            
            <div className="mb-12">
              <h3 className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-3">
                Starter
              </h3>
              <p className="text-slate-400 text-sm">
                Ideal for startups and non-profits.
              </p>
            </div>

            <div className="mb-12 flex items-end gap-2">
              <span className="text-6xl font-extrabold text-white">$0</span>
              <span className="text-slate-500 text-sm">/ month</span>
            </div>

            <ul className="space-y-5 mb-14 flex-grow">
              {[
                "1 search profile",
                "Weekly updates",
                "Tender listings",
                "AI matching",
                "Email notifications",
              ].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300 text-sm">
                  <span className="w-5 h-5 mr-3 flex items-center justify-center text-blue-500">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() =>
                navigate("/register", { state: { plan: "starter" } })
              }
              className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition active:scale-95"
            >
              Start Free
            </button>
          </div>

          {/* Pro */}
          <div className="pricing-card bg-slate-900/40 border-2 border-blue-500/50 rounded-[2.5rem] p-12 flex flex-col relative shadow-2xl transition-all duration-500 hover:-translate-y-2">
            
            {/* Badge */}
            <div className="absolute -top-4 right-8">
              <span className="bg-blue-600 text-white text-xs px-4 py-1 rounded-full font-bold">
                Recommended
              </span>
            </div>

            <div className="mb-12">
              <h3 className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-3">
                Professional
              </h3>
              <p className="text-slate-400 text-sm">
                For high-growth scaleups.
              </p>
            </div>

            <div className="mb-12 flex items-end gap-2">
              <span className="text-6xl font-extrabold text-white">$49</span>
              <span className="text-slate-500 text-sm">/ month</span>
            </div>

            <ul className="space-y-5 mb-14 flex-grow">
              {[
                "Unlimited search profiles",
                "Daily updates",
                "AI matching & analysis",
                "All global sources",
                "Priority support",
              ].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300 text-sm">
                  <span className="w-5 h-5 mr-3 flex items-center justify-center text-blue-400">
                    ✓
                  </span>
                  <span
                    className={
                      i === 0 || i === 3
                        ? "font-semibold text-white"
                        : ""
                    }
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() =>
                navigate("/register", { state: { plan: "pro" } })
              }
              className="w-full py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold transition active:scale-95"
            >
              Get Started
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
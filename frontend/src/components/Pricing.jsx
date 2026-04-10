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
      className="py-20 bg-gradient-to-b from-white via-purple-50 to-purple-100 relative border-t border-purple-200"
    >
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-purple-900">
            Scale your <span className="text-purple-600">acquisition</span>
          </h2>

          <p className="text-xl text-purple-600">
            Simple, transparent pricing for growing teams.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* Starter */}
          <div className="pricing-card bg-white border border-purple-200 rounded-[2.5rem] p-12 flex flex-col transition-all duration-500 hover:border-purple-300 hover:-translate-y-1 shadow-sm">

            <div className="mb-12">
              <h3 className="text-purple-600 text-xs font-bold uppercase tracking-widest mb-3">
                Starter
              </h3>
              <p className="text-purple-500 text-sm">
                Ideal for startups and non-profits.
              </p>
            </div>

            <div className="mb-12 flex items-end gap-2">
              <span className="text-6xl font-extrabold text-purple-900">$0</span>
              <span className="text-purple-500 text-sm">/ month</span>
            </div>

            <ul className="space-y-5 mb-14 flex-grow">
              {[
                "1 search profile",
                "Weekly updates",
                "Tender listings",
                "AI matching",
                "Email notifications",
              ].map((item, i) => (
                <li key={i} className="flex items-center text-purple-600 text-sm">
                  <span className="w-5 h-5 mr-3 flex items-center justify-center text-purple-600">
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
              className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition active:scale-95"
            >
              Start Free
            </button>
          </div>

          {/* Pro */}
          <div className="pricing-card bg-white/70 backdrop-blur-xl border-2 border-purple-400/60 rounded-[2.5rem] p-12 flex flex-col relative shadow-xl transition-all duration-500 hover:-translate-y-2">

            {/* Badge */}
            <div className="absolute -top-4 right-8">
              <span className="bg-purple-500 text-white text-xs px-4 py-1 rounded-full font-bold">
                Recommended
              </span>
            </div>

            <div className="mb-12">
              <h3 className="text-purple-600 text-xs font-bold uppercase tracking-widest mb-3">
                Professional
              </h3>
              <p className="text-purple-500 text-sm">
                For high-growth scaleups.
              </p>
            </div>

            <div className="mb-12 flex items-end gap-2">
              <span className="text-6xl font-extrabold text-purple-900">$49</span>
              <span className="text-purple-500 text-sm">/ month</span>
            </div>

            <ul className="space-y-5 mb-14 flex-grow">
              {[
                "Unlimited search profiles",
                "Daily updates",
                "AI matching & analysis",
                "All global sources",
                "Priority support",
              ].map((item, i) => (
                <li key={i} className="flex items-center text-purple-600 text-sm">
                  <span className="w-5 h-5 mr-3 flex items-center justify-center text-purple-500">
                    ✓
                  </span>
                  <span className={i === 0 || i === 3 ? "font-semibold text-purple-900" : ""}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() =>
                navigate("/register", { state: { plan: "pro" } })
              }
              className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition active:scale-95"
            >
              Get Started
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <div className="flex items-center">
  <Link to="/" className="flex items-center gap-4 group shrink-0">
    {/* Minimalist Icon Architecture */}
    <div className="relative group">
      {/* Outer Rotating Glow (Subtle) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
        {/* Abstract "B" / Gavel SVG */}
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vertical Pillar (The Handle) */}
          <rect x="5" y="14" width="3" height="7" rx="1" className="fill-blue-500 group-hover:translate-y-[-2px] transition-transform duration-300" />
          
          {/* The "Bid" Action - Middle Bar */}
          <rect x="10" y="9" width="3" height="12" rx="1" className="fill-blue-400 group-hover:translate-y-[-4px] transition-transform duration-500" />
          
          {/* The "Winning" Bar - Highest */}
          <rect x="15" y="4" width="3" height="17" rx="1" className="fill-blue-300 group-hover:translate-y-[-6px] transition-transform duration-700" />
          
          {/* Decorative Sparkle (The "Just" moment) */}
          <circle cx="19" cy="5" r="1.5" className="fill-white animate-pulse" />
        </svg>

        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      </div>
    </div>

    {/* Brand Identity */}
    <div className="flex flex-col justify-center">
      <div className="flex items-baseline gap-0.5">
        <span className="text-2xl font-black tracking-tighter text-white uppercase">
          Just
        </span>
        <span className="text-2xl font-light tracking-tighter text-blue-400 uppercase">
          Bid
        </span>
      </div>
      
      {/* Progress Bar (Visual Anchor) */}
      <div className="h-0.5 w-full bg-slate-800 mt-1 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-blue-500 group-hover:w-full transition-all duration-700 ease-out" />
      </div>
    </div>
  </Link>
</div>
  );
}
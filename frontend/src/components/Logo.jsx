import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center gap-4 group shrink-0">

        {/* Icon */}
        <div className="relative group">

          {/* Soft purple glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-fuchsia-400 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>

          {/* Main box */}
          <div className="relative w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl flex items-center justify-center border border-purple-100 dark:border-purple-800/30 shadow-sm overflow-hidden">

            {/* Minimal premium SVG */}
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Bars (elegant growth style) */}
              <rect x="5" y="13" width="3" height="7" rx="1"
                className="fill-purple-400 group-hover:translate-y-[-2px] transition-transform duration-300"
              />
              <rect x="10" y="9" width="3" height="11" rx="1"
                className="fill-purple-500 group-hover:translate-y-[-4px] transition-transform duration-500"
              />
              <rect x="15" y="5" width="3" height="15" rx="1"
                className="fill-fuchsia-400 group-hover:translate-y-[-6px] transition-transform duration-700"
              />

              {/* Soft sparkle */}
              <circle cx="19" cy="6" r="1.5" className="fill-purple-300 animate-pulse" />
            </svg>

            {/* glass highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-white/10 pointer-events-none" />
          </div>
        </div>

        {/* Brand text */}
        <div className="flex flex-col justify-center leading-tight">

          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">
              Just
            </span>
            <span className="text-2xl font-light tracking-tight text-purple-500 uppercase">
              Bid
            </span>
          </div>

          {/* subtle underline */}
          <div className="h-0.5 w-full bg-purple-100 dark:bg-purple-900/30 mt-1 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-purple-400 to-fuchsia-400 group-hover:w-full transition-all duration-700 ease-out" />
          </div>

        </div>

      </Link>
    </div>
  );
}
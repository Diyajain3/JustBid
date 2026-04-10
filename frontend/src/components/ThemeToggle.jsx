import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import gsap from "gsap";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    // Soft animation on theme change
    gsap.fromTo(
      iconRef.current,
      { rotate: -90, opacity: 0, scale: 0.5 },
      { rotate: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
  }, [theme]);

  const handleMouseEnter = () => {
    gsap.to(buttonRef.current, { scale: 1.1, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed top-5 right-20 md:top-6 md:right-8 z-[9999] p-2.5 md:p-3 rounded-full shadow-lg backdrop-blur-md border transition-all duration-500
        ${
          theme === "dark"
            ? "bg-black/80 border-purple-500/30 text-purple-400 hover:shadow-purple-500/20"
            : "bg-white/80 border-purple-200 text-purple-600 hover:shadow-purple-200"
        }`}
      aria-label="Toggle Theme"
    >
      <div ref={iconRef}>
        {theme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;

import { motion } from "framer-motion"

export function CircularGauge({ value, size = 120, strokeWidth = 10, delay = 0 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let color = "rgb(59, 130, 246)"; // Blue (Neural Default)
  let glowColor = "rgba(59, 130, 246, 0.5)";
  
  if (value >= 80) {
    color = "rgb(74, 222, 128)"; // Green
    glowColor = "rgba(74, 222, 128, 0.5)";
  } else if (value < 50) {
    color = "rgb(239, 68, 68)"; // Red
    glowColor = "rgba(239, 68, 68, 0.5)";
  } else if (value < 80) {
    color = "rgb(234, 179, 8)"; // Yellow
    glowColor = "rgba(234, 179, 8, 0.5)";
  }

  return (
    <div className="relative flex items-center justify-center font-mono" style={{ width: size, height: size }}>
      
      {/* Outer Glow Ring */}
      <div 
        className="absolute inset-0 rounded-full blur-md opacity-20 transition-all duration-1000"
        style={{ backgroundColor: color }}
      />

      {/* Background Track */}
      <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
        <circle
          className="text-white/5"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        
        {/* Animated Progress */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, delay, ease: "circOut" }}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ 
            strokeDasharray: circumference,
            filter: `drop-shadow(0px 0px 6px ${glowColor})`
          }}
        />
      </svg>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.5, duration: 0.5 }}
        className="flex flex-col items-center justify-center z-10"
      >
        <span className="text-sm font-black tracking-tighter" style={{ color }}>{value}%</span>
      </motion.div>

      {/* Inner Decorative Ring */}
      <div className="absolute inset-2 border border-white/5 rounded-full pointer-events-none" />
    </div>
  );
}


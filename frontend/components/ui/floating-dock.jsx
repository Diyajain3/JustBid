"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { Home, Search, LayoutDashboard, Settings, User, Bell } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const items = [
  { title: "Home", icon: <Home className="h-full w-full" />, href: "/" },
  { title: "Explore", icon: <Search className="h-full w-full" />, href: "/explore" },
  { title: "Dashboard", icon: <LayoutDashboard className="h-full w-full" />, href: "/dashboard" },
  { title: "Profile", icon: <User className="h-full w-full" />, href: "/profile" },
  { title: "Notifications", icon: <Bell className="h-full w-full" />, href: "/notifications" },
]

export function FloatingDock() {
  let mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex h-16 items-end gap-4 rounded-2xl bg-card/30 border border-white/10 backdrop-blur-md px-4 pb-3"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  )
}

function IconContainer({ mouseX, title, icon, href }) {
  let ref = useRef(null)
  const location = useLocation()
  const isActive = location.pathname === href

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40])

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  const [hovered, setHovered] = useState(false)

  return (
    <Link to={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex items-center justify-center rounded-full transition-colors",
          isActive ? "bg-primary text-primary-foreground" : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-12 left-1/2 w-fit px-2 py-0.5 rounded-md bg-card border border-white/10 text-white text-xs whitespace-pre"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div className="flex h-6 w-6 items-center justify-center">
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  )
}

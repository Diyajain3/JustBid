import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Command } from "cmdk"
import { Search, Sparkles, Moon, Sun, Monitor, Tent, Home, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "next-themes"

export function AiBroker() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-2xl hover:shadow-[0_0_20px_rgba(var(--primary),0.5)] transition-all group overflow-hidden"
      >
        <span className="absolute inset-0 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        <Sparkles className="relative z-10 w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <Command.Dialog 
            open={open} 
            onOpenChange={setOpen}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden cmdk-dialog"
            >
              <div className="flex items-center border-b border-border px-3 cmdk-input-wrapper">
                <Search className="w-5 h-5 text-muted-foreground mr-2" />
                <Command.Input 
                  placeholder="Ask JustBid AI or search commands..." 
                  className="w-full bg-transparent p-4 text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto p-2 cmdk-list">
                <Command.Empty className="p-4 text-sm text-center text-muted-foreground">
                  No results found. AI is learning...
                </Command.Empty>

                <Command.Group heading="Navigation" className="p-1 px-2 text-xs font-medium text-muted-foreground">
                  <Command.Item onSelect={() => runCommand(() => navigate('/'))} className="flex items-center gap-2 p-2 text-sm text-foreground rounded-md cursor-pointer data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground">
                    <Home className="w-4 h-4" /> Home
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => navigate('/explore'))} className="flex items-center gap-2 p-2 text-sm text-foreground rounded-md cursor-pointer data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground">
                    <Tent className="w-4 h-4" /> Browse Tenders
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Theme" className="p-1 px-2 mt-2 text-xs font-medium text-muted-foreground">
                  <Command.Item onSelect={() => runCommand(() => setTheme('light'))} className="flex items-center gap-2 p-2 text-sm text-foreground rounded-md cursor-pointer data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground">
                    <Sun className="w-4 h-4" /> Light Mode
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => setTheme('dark'))} className="flex items-center gap-2 p-2 text-sm text-foreground rounded-md cursor-pointer data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground">
                    <Moon className="w-4 h-4" /> Dark Mode
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => setTheme('system'))} className="flex items-center gap-2 p-2 text-sm text-foreground rounded-md cursor-pointer data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground">
                    <Monitor className="w-4 h-4" /> System
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="AI Actions" className="p-1 px-2 mt-2 text-xs font-medium text-muted-foreground">
                  <Command.Item onSelect={() => runCommand(() => navigate('/auth'))} className="flex items-center gap-2 p-2 text-sm text-foreground rounded-md cursor-pointer data-[selected='true']:bg-green-500/20 data-[selected='true']:text-green-500 font-medium">
                    <Sparkles className="w-4 h-4" /> Match With Best Tenders
                  </Command.Item>
                </Command.Group>
              </Command.List>
              
              <div className="border-t border-border p-3 flex justify-between items-center text-xs text-muted-foreground bg-muted/30">
                <div className="flex gap-1 items-center">
                  <span className="font-semibold bg-background border border-border px-1.5 py-0.5 rounded">⌘</span>
                  <span className="font-semibold bg-background border border-border px-1.5 py-0.5 rounded">K</span>
                  <span>to toggle</span>
                </div>
                <span>JustBid AI Broker v1.0</span>
              </div>
            </motion.div>
          </Command.Dialog>
        )}
      </AnimatePresence>
    </>
  )
}

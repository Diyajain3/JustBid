import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trophy, Target, Timer } from "lucide-react"

export function BiddingBlitz({ isOpen, onClose }) {
  const [gameState, setGameState] = useState('idle') // idle, playing, won, lost
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [targets, setTargets] = useState([])
  const containerRef = useRef(null)
  const timerRef = useRef(null)

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setTimeLeft(15)
    setTargets([])
    spawnTarget()
  }

  const spawnTarget = () => {
    if (gameState !== 'playing' && gameState !== 'idle') return
    
    const id = Math.random().toString(36).substr(2, 9)
    const newTarget = {
      id,
      x: Math.random() * 80 + 10, // 10% to 90%
      y: Math.random() * 80 + 10,
      size: Math.random() * 40 + 40, // 40px to 80px
    }
    
    setTargets(prev => [...prev, newTarget])
    
    // Auto-remove target after 2 seconds if not clicked
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== id))
    }, 2000)
  }

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setGameState('lost')
            return 0
          }
          return prev - 1
        })
        
        // Spawn targets more frequently as time goes on
        if (Math.random() > 0.4) spawnTarget()
      }, 1000)
    }
    
    return () => clearInterval(timerRef.current)
  }, [gameState])

  // Win condition
  useEffect(() => {
    if (score >= 10 && gameState === 'playing') {
      clearInterval(timerRef.current)
      setGameState('won')
    }
  }, [score, gameState])

  const handleTargetClick = (id) => {
    setScore(prev => prev + 1)
    setTargets(prev => prev.filter(t => t.id !== id))
    spawnTarget()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="relative w-full max-w-2xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Bidding Blitz</h3>
                <p className="text-sm text-muted-foreground">Capture 10 tenders to win a Premium Demo</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Game Area */}
          <div 
            ref={containerRef}
            className="relative h-[400px] bg-background/50 overflow-hidden cursor-crosshair"
          >
            {gameState === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                  <Target size={48} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-2">Ready for the Auction?</h4>
                  <p className="text-muted-foreground max-w-sm">
                    Tenders will appear randomly. Click 10 of them before the 15-second timer runs out!
                  </p>
                </div>
                <button 
                  onClick={startGame}
                  className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-105 transition-transform"
                >
                  Start Bidding
                </button>
              </div>
            )}

            {gameState === 'playing' && (
              <>
                {/* Stats Overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                  <div className="bg-background/80 backdrop-blur border border-border px-4 py-2 rounded-full flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-500" />
                    <span className="font-bold">Score: {score}/10</span>
                  </div>
                  <div className={`bg-background/80 backdrop-blur border border-border px-4 py-2 rounded-full flex items-center gap-2 ${timeLeft < 5 ? 'text-red-500 animate-pulse' : ''}`}>
                    <Timer size={16} />
                    <span className="font-mono font-bold">{timeLeft}s</span>
                  </div>
                </div>

                {/* Targets */}
                {targets.map(target => (
                  <motion.button
                    key={target.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => handleTargetClick(target.id)}
                    className="absolute z-20 group"
                    style={{ 
                      left: `${target.x}%`, 
                      top: `${target.y}%`,
                      width: target.size,
                      height: target.size
                    }}
                  >
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping group-hover:bg-primary/40" />
                    <div className="relative w-full h-full bg-primary border-4 border-primary-foreground/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.5)]">
                      <Target size={target.size * 0.5} className="text-primary-foreground" />
                    </div>
                  </motion.button>
                ))}
              </>
            )}

            {gameState === 'won' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center bg-green-500/10 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/40"
                >
                  <Trophy size={48} />
                </motion.div>
                <div>
                  <h4 className="text-3xl font-bold text-green-500 mb-2">High Bidder!</h4>
                  <p className="text-muted-foreground max-w-sm">
                    Amazing speed! You've unlocked the VIP Demo Session. Our team will contact you shortly.
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:scale-105 transition-transform"
                >
                  Claim My Demo
                </button>
              </div>
            )}

            {gameState === 'lost' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center bg-red-500/10 backdrop-blur-sm">
                <div className="w-24 h-24 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center">
                  <Timer size={48} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-2">Outbid by Time!</h4>
                  <p className="text-muted-foreground">
                    You got {score} tenders. Don't let the best deals slip away!
                  </p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={startGame}
                    className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-105 transition-transform"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={onClose}
                    className="px-6 py-3 bg-muted font-bold rounded-xl hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tips Footer */}
          <div className="p-4 bg-muted/20 text-center text-xs text-muted-foreground italic">
            Tip: Be fast! Tenders disappear in 2 seconds.
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

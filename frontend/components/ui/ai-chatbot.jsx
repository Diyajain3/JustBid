import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Sparkles, Send, X, MessageSquare, Bot, User, Loader2 } from "lucide-react"
import Groq from "groq-sdk"
import ReactMarkdown from "react-markdown"

// Initialize Groq API
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true 
})

export function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your JustBid Senior Broker. Let's talk strategy. How can we optimize your next trade or tender today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    const availableModels = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]
    let lastError = null;

    for (const modelName of availableModels) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `You are the JustBid Senior Strategic Broker. 
              Persona: Professional, tactical, and expert.
              Tone: High-end, human-like, and direct.
              Strategy: 
              - Acknowledge greetings naturally. 
              - Avoid robotic lists.
              - Focus on increasing the user's "Win Rate".
              - Use markdown for key business terms.`
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: input }
          ],
          model: modelName,
          temperature: 0.6,
          max_tokens: 1024,
        })

        const responseText = chatCompletion.choices[0]?.message?.content || "No response received."
        setMessages((prev) => [...prev, { role: "assistant", content: responseText }])
        setIsLoading(false);
        return;
      } catch (error) {
        console.error(`Error with model ${modelName}:`, error);
        lastError = error;
        continue;
      }
    }

    setMessages((prev) => [...prev, { role: "assistant", content: `System Error: ${lastError?.message || "Connection failed."}` }])
    setIsLoading(false);
  }

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[1001]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 blur-xl opacity-50 scale-150"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative z-10 p-4 bg-primary text-primary-foreground rounded-full shadow-[0_0_20px_rgba(var(--primary),0.3)] border border-primary/20 flex items-center justify-center animate-chatbot-glow overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <MessageSquare className="w-6 h-6 rotate-0 group-hover:rotate-12 transition-transform duration-300" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" 
          />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, x: -100 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100, x: -100 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-24 left-6 z-[1000] w-[400px] h-[600px] bg-background/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
            <div className="relative p-4 bg-gradient-to-b from-primary/10 to-transparent border-b border-white/5">
              <div className="scan-line-overlay" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-foreground tracking-tight">JustBid AI Broker</h3>
                    <div className="flex items-center gap-1">
                      <motion.div 
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-green-500 rounded-full" 
                      />
                      <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Encrypted Connection</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-all hover:rotate-90"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              <LayoutGroup>
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-accent" : "bg-card border border-white/10"}`}>
                          {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user" 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10 rounded-tr-none" 
                            : "bg-card/50 text-foreground border border-white/10 backdrop-blur-md rounded-tl-none"
                        }`}>
                          <div className="chatbot-markdown">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-start pl-11"
                  >
                    <div className="flex gap-1.5 p-3 rounded-2xl bg-white/5 items-center">
                      <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                    </div>
                  </motion.div>
                )}
              </LayoutGroup>
            </div>

            <div className="p-6 border-t border-white/5 bg-background/40 backdrop-blur-md">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask for Strategic Data..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all pr-14 text-foreground placeholder:text-muted-foreground/50 group-hover:border-white/20"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-primary-foreground rounded-xl disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-4 text-[10px] text-center text-muted-foreground font-medium uppercase tracking-[0.1em] opacity-40">Tactical Intelligence v2.0</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

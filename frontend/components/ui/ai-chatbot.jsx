import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Send, X, MessageSquare } from "lucide-react"
import Groq from "groq-sdk"
import ReactMarkdown from "react-markdown"

// ✅ Groq API
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true
})

// ✅ Relevance filter
const isRelevant = (text) => {
  const keywords = [
    "tender", "bid", "bidding", "contract",
    "procurement", "rfp", "quotation",
    "government", "vendor", "pricing"
  ]
  return keywords.some(k => text.toLowerCase().includes(k))
}

export function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your JustBid Senior Broker. How can we improve your **bid strategy** today?"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)

  // ✅ Smooth auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")

    // ❌ Block unrelated
    if (!isRelevant(input)) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "I specialize in **tender strategy and bidding intelligence**. Ask something related to winning contracts."
        }
      ])
      return
    }

    setIsLoading(true)

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
You are the JustBid Senior Strategic Broker.

Only answer about:
- tenders
- bidding
- procurement
- contracts

If unrelated say:
"I specialize in tender strategy and bidding intelligence."

Tone: Professional, human-like.
`
          },
          ...messages,
          { role: "user", content: input }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.6
      })

      const response =
        chatCompletion.choices[0]?.message?.content || "No response"

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: response }
      ])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Error. Try again." }
      ])
    }

    setIsLoading(false)
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 left-6 z-[1001]">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="p-4 bg-primary text-primary-foreground rounded-full shadow-lg"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            
            // ✅ FIXED CONTAINER (NO OVERFLOW)
            className="fixed left-6 bottom-24 top-4 z-[1000]
            w-[400px]
            bg-background/80 backdrop-blur-2xl border border-white/10
            rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]
            flex flex-col overflow-hidden"
          >

            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold">JustBid AI Broker</h3>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex w-full ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card text-foreground border border-white/10 rounded-bl-none"
                    }`}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 bg-card rounded-xl border border-white/10">
                    Typing...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 shrink-0">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSend()
                  }
                  placeholder="Ask about tenders..."
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 outline-none"
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-primary text-primary-foreground rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
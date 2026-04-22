"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FileText, 
  Upload, 
  Shield, 
  Zap, 
  Clock, 
  Target, 
  Search, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  Cpu,
  BrainCircuit,
  Binary
} from "lucide-react"
import { toast } from "sonner"
import { Navbar } from "@/components/ui/navbar"

export default function AnalysisPage() {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/document/reports`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      const data = await res.json()
      if (data.success) setHistory(data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    if (!selectedFile.type.includes("pdf")) {
      toast.error("Security Protocol: Only PDF documents are currently supported.")
      return
    }

    setFile(selectedFile)
    setIsUploading(true)
    setAnalysisResult(null)

    const formData = new FormData()
    formData.append("document", selectedFile)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/document/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setAnalysisResult(data.data)
        toast.success("Intelligence Extraction Complete")
        fetchHistory()
      } else {
        toast.error(data.message || "Extraction Failed")
      }
    } catch (err) {
      toast.error("Neural Network Timeout")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-primary"
            >
              <Cpu size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Strategic Module 04</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter"
              style={{ fontFamily: "var(--font-display)" }}
            >
              INTELLIGENCE <span className="text-primary">LAB</span>
            </motion.h1>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              Upload complex tender documents. Our neural network will decrypt requirements, deadlines, and fiscal parameters with 99.8% accuracy.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            <div className="flex items-center gap-2">
              <Shield size={12} /> SECURE CHANNEL
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2">
              <Binary size={12} /> ENCRYPTED DATA
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Upload & History */}
          <div className="lg:col-span-5 space-y-8">
            {/* Upload Zone */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="relative group"
            >
              <input 
                type="file" 
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                disabled={isUploading}
              />
              <div className={`p-12 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center text-center gap-6 bg-white/[0.02] backdrop-blur-xl ${
                isUploading ? "border-primary animate-pulse" : "border-white/10 group-hover:border-primary/50 group-hover:bg-primary/[0.02]"
              }`}>
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${
                  isUploading ? "bg-primary shadow-[0_0_30px_rgba(var(--primary),0.4)]" : "bg-white/5 group-hover:bg-primary/20"
                }`}>
                  {isUploading ? (
                    <BrainCircuit className="w-10 h-10 animate-spin text-white" />
                  ) : (
                    <Upload className="w-10 h-10 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Initialize Upload</h3>
                  <p className="text-sm text-muted-foreground">Drop your PDF here or click to browse</p>
                </div>
                <div className="flex gap-2">
                  {["Technical", "Fiscal", "Temporal"].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* History List */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground pl-2">Archived Analyses</h4>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {history.map((report) => (
                  <button 
                    key={report.id}
                    onClick={() => setAnalysisResult(report)}
                    className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                      analysisResult?.id === report.id 
                        ? "bg-primary/10 border-primary/30" 
                        : "bg-white/[0.02] border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-[200px]">{report.filename}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Analysis Results */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {analysisResult ? (
                <motion.div 
                  key={analysisResult.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                  {/* Result Header */}
                  <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-transparent to-transparent border border-primary/20 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <CheckCircle2 size={120} />
                    </div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest">Validated</div>
                        <span className="text-xs text-muted-foreground">{analysisResult.filename}</span>
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight">Executive Summary</h2>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {analysisResult.summary}
                      </p>
                    </div>
                  </div>

                  {/* Requirements & Deadlines */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Requirements */}
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-md space-y-6">
                      <div className="flex items-center gap-3 text-primary">
                        <Target size={20} />
                        <h3 className="font-bold uppercase tracking-widest text-xs">Core Requirements</h3>
                      </div>
                      <div className="space-y-4">
                        {analysisResult.requirements.map((req, i) => (
                          <div key={i} className="flex gap-3 text-sm group">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 group-hover:scale-150 transition-transform" />
                            <span className="text-muted-foreground group-hover:text-white transition-colors">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deadlines */}
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-md space-y-6">
                      <div className="flex items-center gap-3 text-accent">
                        <Clock size={20} />
                        <h3 className="font-bold uppercase tracking-widest text-xs">Critical Timeline</h3>
                      </div>
                      <div className="space-y-4">
                        {analysisResult.deadlines.map((deadline, i) => (
                          <div key={i} className="flex gap-3 text-sm group">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 group-hover:scale-150 transition-transform" />
                            <span className="text-muted-foreground group-hover:text-white transition-colors">{deadline}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Fiscal Parameters */}
                  <div className="p-8 rounded-[2.5rem] bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                        <Zap size={24} />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Estimated Resource Value</h4>
                        <p className="text-2xl font-bold">{analysisResult.budget || "Confidential"}</p>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl"
                    >
                      Draft Strategy
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[600px] rounded-[3rem] border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12 border-dashed">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 relative">
                    <Search className="w-10 h-10 text-muted-foreground/20" />
                    <div className="absolute inset-0 rounded-full border border-white/5 animate-ping" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Neural Buffer Empty</h2>
                  <p className="text-muted-foreground max-w-sm text-sm">
                    Awaiting document synchronization. Select a previously analyzed file or initialize a new sequence from the upload terminal.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* OS Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 z-50 flex justify-between items-center mix-blend-difference pointer-events-none opacity-40">
        <div className="flex items-center gap-4 text-[9px] font-bold tracking-[0.3em] uppercase">
          <span className="text-primary">Operational Status</span>
          <span className="text-white">Analysis Core v2.4.1</span>
        </div>
        <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-white">
          JustBid Neural Laboratory © 2026
        </div>
      </footer>
    </div>
  )
}

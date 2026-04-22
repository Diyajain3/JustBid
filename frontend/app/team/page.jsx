import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, 
  Plus, 
  UserPlus, 
  Trash2, 
  Mail, 
  LayoutDashboard, 
  Settings, 
  Bookmark, 
  BarChart3, 
  LogOut,
  Activity,
  Cpu
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Atmosphere } from "@/components/ui/atmosphere"
import { DecryptionText } from "@/components/ui/decryption-text"
import { TeamCollaborationCard } from "@/components/ui/team-collaboration-card"
import Magnetic from "@/components/ui/magnetic"

export default function TeamPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/team`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setTeams(data)
        if (data.length > 0 && !selectedTeam) {
          setSelectedTeam(data[0])
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return navigate("/auth")
    fetchTeams()
  }, [])

  const handleCreateTeam = async (e) => {
    e.preventDefault()
    if (!newTeamName) return
    
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newTeamName })
      })

      if (res.ok) {
        toast.success("TEAM_ESTABLISHED", { description: "New neural node active." })
        setNewTeamName("")
        setIsCreateModalOpen(false)
        fetchTeams()
      } else {
        toast.error("INITIALIZATION_FAILED")
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!inviteEmail || !selectedTeam) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/team/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ teamId: selectedTeam.id, email: inviteEmail })
      })

      if (res.ok) {
        toast.success("INVITATION_TRANSMITTED", { description: "Signal sent to target operative." })
        setInviteEmail("")
        setIsInviteModalOpen(false)
        fetchTeams()
      } else {
        const error = await res.json()
        toast.error(error.message || "INVITE_FAILED")
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleRemoveMember = async (userId) => {
    if (!selectedTeam) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/team/${selectedTeam.id}/members/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        toast.success("MEMBER_DECOUPLED")
        fetchTeams()
      } else {
        toast.error("ACTION_DENIED")
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return
    if (!window.confirm("CONFIRM_NODE_TERMINATION: Are you sure you want to permanently delete this team?")) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/team/${selectedTeam.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        toast.success("NODE_TERMINATED", { description: "The strategic node has been wiped." })
        setSelectedTeam(null)
        fetchTeams()
      } else {
        toast.error("TERMINATION_FAILED")
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <div className="fixed inset-0 z-0">
        <Atmosphere />
        <div className="neural-grid" />
        <div className="scanline-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-80 pointer-events-none" />
      </div>

      <div 
        className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(1000px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.03), transparent 80%)`
        }}
      />

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-black/40 backdrop-blur-3xl border-r border-border/20 hidden md:flex flex-col z-20">
        <div className="p-6">
          <Link to="/dashboard" className="text-2xl font-bold text-primary flex items-center gap-2 group" style={{ fontFamily: "var(--font-display)" }}>
            <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]">J</span>
            <DecryptionText text="JustBid" delay={0.1} />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-4 mt-6">
          <Magnetic strength={0.2}>
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-white/5 hover:text-foreground rounded-xl transition-all duration-300">
              <LayoutDashboard size={20} />
              Matches Feed
            </Link>
          </Magnetic>
          
          <Magnetic strength={0.2}>
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-white/5 hover:text-foreground rounded-xl transition-all duration-300">
              <Settings size={20} />
              AI Matrix Profile
            </Link>
          </Magnetic>

          <Magnetic strength={0.2}>
            <Link to="/saved-bids" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-white/5 hover:text-foreground rounded-xl transition-all duration-300">
              <Bookmark size={20} />
              Inbox & Saved Bids
            </Link>
          </Magnetic>

          <Magnetic strength={0.2}>
            <Link to="/analytics" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-white/5 hover:text-foreground rounded-xl transition-all duration-300">
              <BarChart3 size={20} />
              Insights & Analytics
            </Link>
          </Magnetic>

          <Magnetic strength={0.3}>
            <Link to="/team" className="flex items-center gap-3 px-4 py-3 bg-primary/15 text-primary border border-primary/20 rounded-xl font-bold shadow-[0_0_20px_rgba(var(--primary),0.05)] transition-all">
              <Users size={20} />
              Team Hub
            </Link>
          </Magnetic>
        </nav>

        <div className="p-4 border-t border-border/20 mt-auto bg-black/20">
          <button 
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              navigate('/')
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-500/70 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
          >
            <LogOut size={16} />
            Terminate
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
        <div className="max-w-6xl mx-auto p-12">
          
          <header className="mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-8">
            <div>
              <div className="flex items-center gap-2 text-primary/60 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                <Users size={14} className="animate-pulse" />
                <span>Collaborative Network Interface</span>
              </div>
              <h1 className="text-5xl font-black tracking-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Team <span className="text-primary drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">Intelligence Hub</span>
              </h1>
              <p className="text-muted-foreground/80 max-w-xl text-base leading-relaxed" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                Connect with other operatives to share tender insights, coordinate bid strategies, and amplify your success rate through collective intelligence.
              </p>
            </div>
            
            <Magnetic strength={0.2}>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all"
              >
                <Plus size={16} /> Create New Node
              </button>
            </Magnetic>
          </header>

          {!teams.length && !loading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <TeamCollaborationCard onClick={() => setIsCreateModalOpen(true)} />
               <p className="mt-8 text-muted-foreground/40 font-mono text-[10px] uppercase tracking-widest animate-pulse">Awaiting team initialization...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Teams List (Left) */}
              <div className="lg:col-span-4 space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-6 pl-2">Active Strategic Nodes</h2>
                {teams.map(team => (
                  <motion.div 
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    whileHover={{ x: 5 }}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedTeam?.id === team.id ? 'bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                  >
                    <div className="flex items-center justify-between">
                       <h3 className="font-bold text-sm text-foreground">{team.name}</h3>
                       <span className="text-[8px] font-black uppercase text-primary/60 tracking-tighter">
                         {team.currentUserRole === 'owner' ? 'ROOT' : 'OP'}
                       </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-primary/40 font-bold uppercase tracking-widest text-[9px]">
                       <Users size={12} />
                       <span>{team.members?.length || 0} OPS ACTIVE</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Team Management (Right) */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  {selectedTeam ? (
                    <motion.div 
                      key={selectedTeam.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="glass-panel rounded-3xl p-8 border-white/5 shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Users size={120} className="text-primary" />
                      </div>

                      <div className="flex justify-between items-center mb-8 relative z-10">
                        <div>
                          <h2 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{selectedTeam.name}</h2>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Status: Operational</p>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                          {selectedTeam.currentUserRole === 'owner' && (
                            <button 
                              onClick={handleDeleteTeam}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-5 py-2 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all"
                            >
                              <Trash2 size={14} /> Terminate Node
                            </button>
                          )}
                          
                          <Magnetic strength={0.2}>
                            {(selectedTeam.currentUserRole === 'owner' || selectedTeam.currentUserRole === 'admin') && (
                              <button 
                                onClick={() => setIsInviteModalOpen(true)}
                                className="bg-primary text-black px-5 py-2 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                              >
                                <UserPlus size={14} /> Invite OP
                              </button>
                            )}
                          </Magnetic>
                        </div>
                      </div>

                      <div className="space-y-4 relative z-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-4 border-b border-white/5 pb-2">Member Log</h3>
                        {selectedTeam.members?.map(member => (
                          <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 flex items-center justify-center font-bold text-primary">
                                {member.user?.name?.[0] || member.user?.email?.[0]?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">{member.user?.name || "Anonymous Operative"}</p>
                                <p className="text-xs text-muted-foreground/60">{member.user?.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="flex flex-col items-end">
                                <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${member.role === 'owner' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-muted-foreground'}`}>
                                  {member.role}
                                </span>
                              </div>
                              {(selectedTeam.currentUserRole === 'owner' || selectedTeam.currentUserRole === 'admin') && member.role !== 'owner' && member.userId !== selectedTeam.ownerId && (
                                <button 
                                  onClick={() => handleRemoveMember(member.userId)}
                                  className="text-muted-foreground/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl p-20 text-center">
                       <p className="text-muted-foreground/20 font-black uppercase tracking-widest text-sm">Select a node to access collective intelligence</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCreateModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-black border border-primary/30 rounded-3xl p-10 shadow-[0_0_50px_rgba(212,175,55,0.2)]"
            >
              <h2 className="text-2xl font-black mb-2" style={{ fontFamily: "var(--font-display)" }}>Initialize Team Node</h2>
              <p className="text-xs text-muted-foreground mb-8">Establish a new encrypted workspace for collective operations.</p>
              
              <form onSubmit={handleCreateTeam} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-1">Node Designation</label>
                  <input 
                    autoFocus
                    value={newTeamName} 
                    onChange={e => setNewTeamName(e.target.value)} 
                    placeholder="e.g. Strategic Alpha" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:ring-1 focus:ring-primary/40 transition-all outline-none text-white"
                  />
                </div>
                <button type="submit" className="w-full bg-primary text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                  Initialize Node
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsInviteModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-black border border-primary/30 rounded-3xl p-10 shadow-[0_0_50px_rgba(212,175,55,0.2)]"
            >
              <h2 className="text-2xl font-black mb-2" style={{ fontFamily: "var(--font-display)" }}>Recruit Operative</h2>
              <p className="text-xs text-muted-foreground mb-8">Synchronize a new user with this strategic node.</p>
              
              <form onSubmit={handleInvite} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-1">Operative Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
                    <input 
                      autoFocus
                      type="email"
                      value={inviteEmail} 
                      onChange={e => setInviteEmail(e.target.value)} 
                      placeholder="operative@justbid.ai" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-primary/40 transition-all outline-none text-white"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-primary text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                  Transmit Invite
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-0 left-0 right-0 h-10 border-t border-white/5 bg-black/60 backdrop-blur-md px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
            <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Network Link: STABLE</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40">Secure Collaboration Layer v1.0</p>
        </div>
      </footer>
    </div>
  )
}

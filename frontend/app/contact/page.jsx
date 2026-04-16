import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Mail, MapPin, Phone, MessageSquare, ChevronLeft, Send } from "lucide-react"
import { Link } from "react-router-dom"

export default function ContactPage() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-header", {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power3.out"
      })
      
      gsap.from(".contact-info-item", {
        opacity: 0,
        x: -30,
        stagger: 0.2,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.2
      })

      gsap.from(".contact-form", {
        opacity: 0,
        x: 30,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.4
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-background text-foreground overflow-hidden relative py-20 px-6"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Navigation */}
      <div className="max-w-6xl mx-auto mb-16 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="contact-header mb-16 max-w-2xl">
          <h1 className="text-5xl font-bold mb-6 !leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Let's get in <span className="text-primary italic">touch</span>.
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions about a tender, pricing, or the platform? Our expert team is ready to help you navigate the bidding landscape.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Side: Contact Info */}
          <div className="w-full lg:w-1/3 space-y-12">
            <div className="contact-info-item">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <Mail size={24} />
                </div>
                <h3 className="text-xl font-bold">Email Us</h3>
              </div>
              <p className="text-muted-foreground ml-16">
                Support: help@justbid.com<br/>
                Sales: sales@justbid.com
              </p>
            </div>

            <div className="contact-info-item">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <Phone size={24} />
                </div>
                <h3 className="text-xl font-bold">Call Us</h3>
              </div>
              <p className="text-muted-foreground ml-16">
                +1 (800) 123-4567<br/>
                Mon-Fri, 9am - 6pm EST
              </p>
            </div>

            <div className="contact-info-item">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <MapPin size={24} />
                </div>
                <h3 className="text-xl font-bold">Headquarters</h3>
              </div>
              <p className="text-muted-foreground ml-16 leading-relaxed">
                100 Innovation Drive<br/>
                Suite 400<br/>
                San Francisco, CA 94111
              </p>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="w-full lg:w-2/3 contact-form">
            <div className="bg-card/30 border border-border/50 p-8 lg:p-12 rounded-3xl backdrop-blur-md">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <MessageSquare className="text-primary" />
                Send a Message
              </h2>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">First Name</label>
                    <input 
                      type="text" 
                      placeholder="Jane" 
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe" 
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Work Email</label>
                  <input 
                    type="email" 
                    placeholder="jane@company.com" 
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Subject</label>
                  <select className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none text-foreground/80">
                    <option value="" disabled selected>Select an inquiry type</option>
                    <option value="sales">Sales & Upgrades</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing & Invoices</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Message</label>
                  <textarea 
                    rows={5}
                    placeholder="How can we help you?" 
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  />
                </div>

                <button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-10 rounded-xl transition-all mt-4 flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-primary/20">
                  Send Message
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

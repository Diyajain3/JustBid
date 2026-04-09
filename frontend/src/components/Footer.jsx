import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">JustBid</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              We democratise access to public contracts for small businesses in Switzerland.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Product</h4>
            <div className="flex flex-col space-y-4">
              <a href="#solution" className="text-slate-400 hover:text-indigo-400 transition-colors">Features</a>
              <a href="#pricing" className="text-slate-400 hover:text-indigo-400 transition-colors">Pricing</a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Roadmap</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Resources</h4>
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Blog</a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Support</a>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Contact</a>
              <Link to="/login" className="text-slate-400 hover:text-indigo-400 transition-colors">Sign In</Link>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-slate-500 text-sm">&copy; 2026 JustBid. All rights reserved.</span>
          <div className="flex gap-6 text-sm">
            <Link to="/legal" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/legal" className="text-slate-500 hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <Link to="/legal" className="text-slate-500 hover:text-white transition-colors">Imprint</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

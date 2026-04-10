import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white via-purple-50 to-purple-100 dark:from-black dark:via-slate-900/20 dark:to-black border-t border-purple-200 dark:border-purple-900/40 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          <div className="md:col-span-2">
            <Logo className="mb-2"/>

            <p className="text-purple-600 dark:text-slate-400 max-w-sm">
              We democratise access to public contracts for small businesses in Switzerland.
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="font-semibold text-purple-900 dark:text-slate-100 mb-6 uppercase tracking-wider text-sm">
              Product
            </h4>
            <div className="flex flex-col space-y-4">
              <a href="#solution" className="text-purple-600 dark:text-slate-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors">Features</a>
              <a href="#pricing" className="text-purple-600 dark:text-slate-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors">Pricing</a>
              <a href="#" className="text-purple-600 dark:text-slate-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors">Roadmap</a>
            </div>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="font-semibold text-purple-900 dark:text-slate-100 mb-6 uppercase tracking-wider text-sm">
              Resources
            </h4>
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-purple-600 dark:text-slate-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors">Blog</a>
              <a href="#" className="text-purple-600 dark:text-slate-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors">Support</a>
              <a href="#" className="text-purple-600 dark:text-slate-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors">Contact</a>
              <Link to="/login" className="text-purple-600 dark:text-slate-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors">
                Sign In
              </Link>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-purple-200 dark:border-purple-900/40 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <span className="text-purple-500 dark:text-slate-500 text-sm">
            © 2026 JustBid. All rights reserved.
          </span>

          <div className="flex gap-6 text-sm">
            <Link to="/legal" className="text-purple-500 dark:text-slate-500 hover:text-purple-800 dark:hover:text-purple-200 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/legal" className="text-purple-500 dark:text-slate-500 hover:text-purple-800 dark:hover:text-purple-200 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/legal" className="text-purple-500 dark:text-slate-500 hover:text-purple-800 dark:hover:text-purple-200 transition-colors">
              Imprint
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
"use client";

import Link from 'next/link';
import { Camera, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-4 z-50 w-full max-w-5xl mx-auto px-6"
    >
      <div className="glass-panel rounded-2xl flex items-center justify-between px-6 py-4 mt-4 border border-slate-700/50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-600 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.6)]">
            <Camera className="h-4.5 w-4.5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:glow-text transition-all duration-300">
            CivLens AI
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-sm font-semibold text-slate-400 transition-colors hover:text-sky-400"
          >
            Report Issue
          </Link>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 rounded-xl bg-sky-500/10 border border-sky-500/30 px-5 py-2.5 text-sm font-semibold text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.1)] transition-all hover:bg-sky-500/20 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(56,189,248,0.3)]"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

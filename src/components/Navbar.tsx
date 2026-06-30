"use client";

import Link from 'next/link';
import { Camera, LayoutDashboard, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase/client';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const { user, civicScore, role } = useAuth();

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
        <div className="flex items-center gap-4 sm:gap-6">
          {role === 'official' && (
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 rounded-xl bg-sky-500/10 border border-sky-500/30 px-4 py-2 text-sm font-semibold text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.1)] transition-all hover:bg-sky-500/20 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(56,189,248,0.3)]"
            >
              <LayoutDashboard className="h-4 w-4 hidden sm:block" />
              Dashboard
            </Link>
          )}

          {user && (
            <Link 
              href="/profile" 
              className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-sm font-semibold text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)] transition-all hover:bg-emerald-500/20 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(52,211,153,0.3)]"
            >
              <UserCircle className="h-4 w-4 hidden sm:block" />
              Profile
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right hidden sm:flex">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs font-bold text-white">{user.displayName || "Citizen"}</span>
                  <span className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded border ${role === 'official' ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' : 'bg-slate-700/50 text-slate-300 border-slate-600'}`}>
                    {role === 'official' ? 'MAYOR' : 'CITIZEN'}
                  </span>
                </div>
                <span className="text-[10px] text-amber-400 font-bold tracking-widest">{civicScore} PTS</span>
              </div>
              {user.photoURL && (
                <img src={user.photoURL} alt="Avatar" className="h-9 w-9 rounded-full border-2 border-slate-700" />
              )}
              <button 
                onClick={() => signOut(auth)}
                className="text-xs font-bold text-slate-400 hover:text-rose-400 transition ml-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="text-sm font-semibold text-slate-300 transition-colors hover:text-white bg-slate-800 px-4 py-2 rounded-xl border border-slate-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

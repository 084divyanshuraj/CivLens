"use client";

import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase/client";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Camera, CheckCircle, Shield, TrendingUp, UserCircle, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("@/components/LiveMap"), { 
  ssr: false, 
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-700">
      <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
    </div>
  )
});
import Image from "next/image";

export default function ProfilePage() {
  const { user, civicScore, role, loading, refreshScore } = useAuth();
  const router = useRouter();
  const [isSwitching, setIsSwitching] = useState(false);
  const [issues, setIssues] = useState<any[]>([]);
  const [isFetchingIssues, setIsFetchingIssues] = useState(true);

  const handleBecomeOfficial = async () => {
    if (!user) return;
    setIsSwitching(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        role: "official"
      });
      // Force a hard reload to completely re-fetch the AuthContext and layout
      window.location.reload();
    } catch (error) {
      console.error("Failed to upgrade role:", error);
      setIsSwitching(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      fetchIssues();
    }
  }, [user, loading, router]);

  const fetchIssues = async () => {
    try {
      const res = await fetch("/api/issues");
      const data = await res.json();
      if (data.success) {
        setIssues(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    } finally {
      setIsFetchingIssues(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mb-4"></div>
        <p className="text-sky-400 font-semibold tracking-widest uppercase text-sm animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  // Calculate Gamification Rank
  let rank = "Observer";
  let rankColor = "text-slate-400";
  let progress = (civicScore / 100) * 100;
  let nextTier = 100;

  if (civicScore >= 500) {
    rank = "Community Hero";
    rankColor = "text-amber-400";
    progress = 100;
    nextTier = civicScore; // Max rank achieved
  } else if (civicScore >= 100) {
    rank = "Active Citizen";
    rankColor = "text-emerald-400";
    progress = ((civicScore - 100) / 400) * 100;
    nextTier = 500;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-10 mt-6"
    >
      {/* Profile Header */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden shadow-2xl border border-slate-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          {/* Avatar */}
          <div className="relative">
            <div className="h-32 w-32 rounded-full border-4 border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <UserCircle className="h-20 w-20 text-slate-500" />
              )}
            </div>
            {role === 'official' && (
              <div className="absolute -bottom-3 -right-3 bg-sky-500 rounded-full p-2 border-4 border-[#0B1120] shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left mt-2">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h1 className="text-4xl font-extrabold text-white tracking-tight">{user.displayName || "Citizen"}</h1>
              <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase border ${role === 'official' ? 'bg-sky-500/20 text-sky-400 border-sky-500/50 shadow-[0_0_10px_rgba(56,189,248,0.3)]' : 'bg-slate-800 text-slate-300 border-slate-600'}`}>
                {role === 'official' ? 'Municipal Official' : 'Citizen'}
              </span>
            </div>
            <p className="text-slate-400 font-medium mb-6">{user.email}</p>
            
            {/* Rank display */}
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Award className={`h-6 w-6 ${rankColor}`} />
              <span className={`text-xl font-bold tracking-wide ${rankColor}`}>{rank}</span>
            </div>

            {/* Hackathon Demo Toggle */}
            {role === 'citizen' && (
              <button 
                onClick={handleBecomeOfficial}
                disabled={isSwitching}
                className="flex items-center gap-2 justify-center md:justify-start mx-auto md:mx-0 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/50 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              >
                {isSwitching ? (
                  <div className="h-4 w-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                ) : (
                  <Shield className="h-4 w-4 text-indigo-400" />
                )}
                <span className="text-xs font-bold text-indigo-300 tracking-widest uppercase">
                  {isSwitching ? "Authenticating..." : "Judge Demo: Switch to Municipal View"}
                </span>
              </button>
            )}
          </div>

          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded-3xl p-6 border border-slate-700/50 shadow-inner min-w-[160px]">
            <span className="text-slate-400 text-sm font-semibold tracking-widest uppercase mb-2">Civic Points</span>
            <span className="text-5xl font-extrabold text-white glow-text">{civicScore}</span>
          </div>
        </div>
      </div>

      {/* Gamification Progress */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/50 relative overflow-hidden">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          Rank Progress
        </h2>
        
        <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden mb-2 border border-slate-700">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className={`absolute top-0 left-0 h-full ${civicScore >= 500 ? 'bg-amber-500' : 'bg-emerald-500'} shadow-[0_0_10px_rgba(52,211,153,0.5)]`}
          />
        </div>
        
        <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-widest">
          <span>{rank}</span>
          {civicScore < 500 ? (
            <span>{civicScore} / {nextTier} PTS</span>
          ) : (
            <span className="text-amber-400">MAX RANK ACHIEVED</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/"
          className="group glass-panel p-8 rounded-3xl border border-slate-700/50 hover:border-sky-500/50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] flex flex-col items-center justify-center gap-4 cursor-pointer"
        >
          <div className="bg-sky-500/10 p-4 rounded-2xl group-hover:bg-sky-500/20 transition-colors">
            <Camera className="h-10 w-10 text-sky-400" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-1">Report New Issue</h3>
            <p className="text-slate-400 text-sm font-medium">Earn +50 Points</p>
          </div>
        </Link>
        
        <Link 
          href="/"
          className="group glass-panel p-8 rounded-3xl border border-slate-700/50 hover:border-emerald-500/50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_0_25px_rgba(52,211,153,0.2)] flex flex-col items-center justify-center gap-4 cursor-pointer"
        >
          <div className="bg-emerald-500/10 p-4 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-1">Verify Community Reports</h3>
            <p className="text-slate-400 text-sm font-medium">Earn +10 Points</p>
          </div>
        </Link>
      </div>

      {/* Citizen Live Map */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/50 shadow-xl mt-4 relative overflow-hidden">
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <MapPin className="h-6 w-6 text-sky-400" />
              Neighborhood Watch Map
            </h2>
            <p className="text-slate-400 text-sm mt-1">Explore all reported civic issues in your city in real-time.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-xl text-sm font-semibold text-slate-300">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
            Live Tracker
          </div>
        </div>
        
        <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-[0_0_30px_rgba(2,132,199,0.15)] relative">
          {isFetchingIssues ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
            </div>
          ) : (
            <LiveMap issues={issues} />
          )}
        </div>
      </div>

    </motion.div>
  );
}

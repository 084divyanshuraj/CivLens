"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, ArrowUpRight, Crown } from "lucide-react";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="relative">
          <Trophy className="h-12 w-12 text-amber-500 animate-pulse mb-4 mx-auto" />
          <div className="text-amber-500 font-bold tracking-widest uppercase text-sm animate-pulse">Loading Heroes...</div>
        </div>
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  // Helper to determine rank colors
  const getRankStyle = (index: number) => {
    if (index === 0) return { bg: "bg-gradient-to-t from-amber-600 to-yellow-400", border: "border-yellow-300", text: "text-yellow-400", shadow: "shadow-[0_0_40px_rgba(250,204,21,0.4)]", icon: <Crown className="h-6 w-6 text-yellow-100" /> };
    if (index === 1) return { bg: "bg-gradient-to-t from-slate-400 to-slate-200", border: "border-slate-300", text: "text-slate-300", shadow: "shadow-[0_0_30px_rgba(203,213,225,0.3)]", icon: <Medal className="h-5 w-5 text-slate-100" /> };
    if (index === 2) return { bg: "bg-gradient-to-t from-amber-800 to-amber-600", border: "border-amber-700", text: "text-amber-600", shadow: "shadow-[0_0_20px_rgba(217,119,6,0.3)]", icon: <Medal className="h-5 w-5 text-amber-200" /> };
    return { bg: "bg-slate-800", border: "border-slate-700", text: "text-slate-400", shadow: "", icon: null };
  };

  return (
    <div className="w-full max-w-5xl mx-auto pt-6 pb-20 relative">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
          <Star className="h-4 w-4" /> Hall of Fame
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Civic <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">Leaderboard</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Top contributors making our city safer and better. Earn points by reporting verified issues and validating community reports.</p>
      </motion.div>

      {/* PODIUM SECTION */}
      {top3.length > 0 && (
        <div className="flex flex-row items-end justify-center gap-2 sm:gap-6 h-72 mb-20 relative z-10 px-2">
          
          {/* 2nd Place (Silver) */}
          {top3.length > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center w-1/3 max-w-[140px]"
            >
              <div className="text-center mb-3">
                <p className="font-bold text-white truncate w-24">{top3[1].displayName || "Citizen"}</p>
                <p className="text-sm text-slate-400 font-bold">{top3[1].civicScore} pts</p>
              </div>
              <div className={`w-full h-32 sm:h-40 ${getRankStyle(1).bg} rounded-t-xl ${getRankStyle(1).border} border-t border-l border-r relative flex justify-center items-start pt-4 shadow-lg`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl pointer-events-none" />
                <div className="h-10 w-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <span className="font-black text-xl text-white">2</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 1st Place (Gold) */}
          {top3.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.4 }}
              className="flex flex-col items-center w-1/3 max-w-[160px] z-20"
            >
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mb-2"
              >
                {getRankStyle(0).icon}
              </motion.div>
              <div className="text-center mb-3">
                <p className="font-black text-lg text-white truncate w-28 drop-shadow-md">{top3[0].displayName || "Citizen"}</p>
                <p className="text-amber-400 font-black">{top3[0].civicScore} pts</p>
              </div>
              <div className={`w-full h-44 sm:h-52 ${getRankStyle(0).bg} rounded-t-2xl ${getRankStyle(0).border} border-t-2 border-l-2 border-r-2 relative flex justify-center items-start pt-4 ${getRankStyle(0).shadow}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-t-2xl pointer-events-none" />
                <div className="h-12 w-12 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm border-2 border-white/30 shadow-inner">
                  <span className="font-black text-2xl text-white drop-shadow-md">1</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3rd Place (Bronze) */}
          {top3.length > 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center w-1/3 max-w-[140px]"
            >
              <div className="text-center mb-3">
                <p className="font-bold text-white truncate w-24">{top3[2].displayName || "Citizen"}</p>
                <p className="text-sm text-slate-400 font-bold">{top3[2].civicScore} pts</p>
              </div>
              <div className={`w-full h-24 sm:h-32 ${getRankStyle(2).bg} rounded-t-xl ${getRankStyle(2).border} border-t border-l border-r relative flex justify-center items-start pt-4 shadow-lg`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-t-xl pointer-events-none" />
                <div className="h-10 w-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <span className="font-black text-xl text-white">3</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* FULL LIST SECTION */}
      {remaining.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-panel rounded-3xl p-2 sm:p-4 border border-slate-700/50 shadow-xl z-10 relative"
        >
          <div className="overflow-hidden rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Rank</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Citizen</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Civic Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {remaining.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-slate-500 font-bold text-lg w-8 inline-block">#{idx + 4}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Avatar" className="h-8 w-8 rounded-full border border-slate-700" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                            <span className="text-slate-400 font-bold text-xs">{user.displayName?.charAt(0) || "C"}</span>
                          </div>
                        )}
                        <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">{user.displayName || "Anonymous Citizen"}</span>
                        {user.role === 'official' && (
                          <span className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40">MAYOR</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
                        {user.civicScore} PTS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, AlertCircle, CheckCircle2, Clock, 
  MapPin, Loader2, RefreshCw, AlertTriangle, Cpu, Globe2,
  X, Briefcase, Megaphone, Activity, Send
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import map and charts to avoid Next.js SSR window errors
const LiveMap = dynamic(() => import("@/components/LiveMap"), { ssr: false, loading: () => (
  <div className="h-full w-full flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-700">
    <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
  </div>
)});
const AnalyticsCharts = dynamic(() => import("@/components/AnalyticsCharts"), { ssr: false });

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const fetchData = async (isBackgroundSync = false) => {
    if (!isBackgroundSync) setLoading(true);
    try {
      const [statsRes, issuesRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/issues")
      ]);
      
      const statsData = await statsRes.json();
      const issuesData = await issuesRes.json();
      
      if (statsData.success) setStats(statsData.data);
      if (issuesData.success) setIssues(issuesData.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      if (!isBackgroundSync) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false); // Initial fetch shows loading spinner
    
    // Set up Real-Time Sync Polling (every 3 seconds) for Hackathon Demo
    // Passes true to indicate it's a background sync (no loading spinner)
    const interval = setInterval(() => {
      fetchData(true);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleExecuteResolution = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setSelectedIssue(null);
      // In a real app, this would hit an API to update status and send emails
      alert("Resolution Executed: Emails dispatched, public advisory tweeted, and crew assigned!");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[60vh]">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-sky-500 mb-6" />
          <div className="absolute inset-0 h-12 w-12 rounded-full animate-ping bg-sky-500/20" />
        </div>
        <p className="text-sky-400 font-semibold tracking-widest uppercase text-sm animate-pulse">Initializing AI Core...</p>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full flex flex-col gap-8 pb-10 relative"
      >
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl relative overflow-hidden border-sky-500/20 shadow-[0_0_30px_rgba(2,132,199,0.1)]">
          <div className="absolute right-0 top-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Cpu className="h-8 w-8 text-sky-400" />
              Admin <span className="glow-text">Dashboard</span>
            </h1>
            <p className="text-slate-400 mt-1 font-medium">Real-time AI overview of civic infrastructure.</p>
          </div>
          <button 
            onClick={() => fetchData(false)}
            className="relative z-10 flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-sky-400 hover:bg-slate-800 hover:text-sky-300 hover:border-sky-500/50 shadow-[0_0_15px_rgba(56,189,248,0.1)] transition-all active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Sync Data
          </button>
        </div>

        {/* KPI Cards */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <StatCard 
            title="Total Reports" 
            value={stats?.totalIssues || 0} 
            icon={<BarChart3 className="h-5 w-5 text-blue-400" />} 
            colorClass="blue"
          />
          <StatCard 
            title="Pending Review" 
            value={stats?.pendingIssues || 0} 
            icon={<Clock className="h-5 w-5 text-amber-400" />} 
            colorClass="amber"
          />
          <StatCard 
            title="Critical Issues" 
            value={stats?.criticalIssues || 0} 
            icon={<AlertCircle className="h-5 w-5 text-rose-400" />} 
            isCritical={(stats?.criticalIssues || 0) > 0}
            colorClass="rose"
          />
          <StatCard 
            title="Resolved" 
            value={stats?.resolvedIssues || 0} 
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />} 
            colorClass="emerald"
          />
        </motion.div>

        {/* Analytics Charts Section (Option 3 Feature) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <AnalyticsCharts roiData={stats?.roiData} categoryData={stats?.categoryDistribution} />
        </motion.div>

        {/* Interactive 3D Map Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full h-80 glass-panel rounded-3xl p-2 relative shadow-[0_0_20px_rgba(2,132,199,0.15)] z-0"
        >
          <div className="absolute top-6 left-6 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
            <Globe2 className="h-4 w-4 text-sky-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">Live Civic Map</span>
          </div>
          <LiveMap issues={issues} />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Issues List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white ml-1">Actionable Intelligence</h2>
            <div className="glass-panel rounded-3xl overflow-hidden shadow-lg">
              {issues.length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-medium">Awaiting civic data...</div>
              ) : (
                <ul className="divide-y divide-slate-800">
                  {issues.map((issue) => (
                    <motion.li 
                      key={issue.id} 
                      onClick={() => setSelectedIssue(issue)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ backgroundColor: 'rgba(30,41,59,0.8)' }}
                      className="p-6 transition-colors flex flex-col sm:flex-row gap-5 cursor-pointer group"
                    >
                      {/* Tiny Image Preview */}
                      <div className="relative h-24 w-32 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-900 shadow-sm hidden sm:block">
                        {issue.imageUrl && (
                          <Image src={issue.imageUrl} alt={issue.vision?.issueType || "Civic Issue Image"} fill className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                        )}
                        <div className="absolute inset-0 border border-sky-500/20 rounded-xl pointer-events-none mix-blend-overlay"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-md text-[11px] font-bold tracking-widest uppercase border ${getPriorityColor(issue.vision?.severity || '')}`}>
                            {(issue.vision?.severity || 'UNKNOWN')} ({issue.priority?.score || 0})
                          </span>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            {issue.vision?.issueType || 'Unknown Issue'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 truncate mb-1 group-hover:text-sky-400 transition-colors">
                          {issue.executiveSummary?.summary || "Untitled Issue"}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                          <MapPin className="h-4 w-4 shrink-0 text-slate-600" />
                          <span className="truncate">{issue.location?.address || 'Location not provided'}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between shrink-0 py-1">
                        <span className="text-xs text-slate-500 font-semibold tracking-widest uppercase">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg tracking-widest uppercase border ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white ml-1 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              AI Intelligence
            </h2>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel rounded-3xl p-8 border-t-2 border-t-amber-500/50 shadow-xl relative overflow-hidden h-full"
            >
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              {stats?.aiInsights && stats.aiInsights.length > 0 ? (
                <ul className="space-y-6 relative z-10">
                  {stats.aiInsights.map((insight: string, idx: number) => (
                    <motion.li 
                      key={idx} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (idx * 0.1) }}
                      className="flex gap-4 text-sm text-slate-300 leading-relaxed font-medium"
                    >
                      <div className="h-2 w-2 rounded-full bg-amber-400 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
                      {insight}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 text-center py-6 font-medium relative z-10">Analyzing civic patterns...</p>
              )}
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* Action Center Modal */}
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIssue(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0B1120] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <Cpu className="h-6 w-6 text-sky-400" />
                  <h2 className="text-xl font-bold text-white">AI Action Center</h2>
                </div>
                <button onClick={() => setSelectedIssue(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                
                {/* Hero section with image and summary */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  <div className="relative w-full md:w-1/3 h-48 md:h-auto rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
                    {selectedIssue.imageUrl && (
                      <Image src={selectedIssue.imageUrl} alt="Issue" fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className={`self-start px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase border mb-3 ${getPriorityColor(selectedIssue.vision?.severity || '')}`}>
                      PRIORITY SCORE: {selectedIssue.priority?.score || 0}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedIssue.executiveSummary?.summary}</h3>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {selectedIssue.location?.address}
                    </p>
                  </div>
                </div>

                {/* 3 Agents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Agent 1: Vision */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-600 transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-sky-500/50" />
                    <h4 className="flex items-center gap-2 text-sky-400 font-bold mb-4">
                      <Activity className="h-5 w-5" /> Agent 1: Vision
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-slate-500 block mb-0.5">Probable Cause</span>
                        <span className="text-slate-200">{selectedIssue.vision?.probableCause || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Citizen Impact</span>
                        <span className="text-slate-200">{selectedIssue.context?.citizenImpact || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Long-Term Risk</span>
                        <span className="text-slate-200">{selectedIssue.context?.longTermRisk || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Agent 2: Municipal Planner */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-600 transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50" />
                    <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
                      <Briefcase className="h-5 w-5" /> Agent 2: Logistics
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-slate-500 block mb-0.5">Assigned Department</span>
                        <span className="text-slate-200 font-semibold">{selectedIssue.recommendation?.department || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Temporary Solution</span>
                        <span className="text-slate-200">{selectedIssue.recommendation?.temporarySolution || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Estimated Budget</span>
                        <span className="text-emerald-300 font-bold bg-emerald-950/30 px-2 py-0.5 rounded">
                          {selectedIssue.recommendation?.estimatedBudgetRange?.replace(/\$/g, '₹') || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Agent 3: Comms Lead */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-600 transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50" />
                    <h4 className="flex items-center gap-2 text-amber-400 font-bold mb-4">
                      <Megaphone className="h-5 w-5" /> Agent 3: Comms
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-slate-500 block mb-1">Public Advisory Draft (Twitter)</span>
                        <div className="bg-[#15202b] p-3 rounded-lg border border-slate-700 text-slate-300 italic">
                          "{selectedIssue.communications?.tweetDraft || "Advisory warning... Avoid area."}"
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">Dispatch Email Draft</span>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-700 text-slate-400 text-xs">
                          {selectedIssue.communications?.emailDraft || "Dispatching team immediately..."}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-900/80 border-t border-slate-800 flex justify-end">
                <button 
                  onClick={handleExecuteResolution}
                  disabled={isExecuting}
                  className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(2,132,199,0.3)] transition-all overflow-hidden disabled:opacity-50"
                >
                  {isExecuting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1s_infinite]" />
                  )}
                  {isExecuting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  Execute Municipal Resolution
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// Subcomponents & Helpers

function StatCard({ title, value, icon, colorClass, isCritical = false }: { title: string, value: number, icon: any, colorClass: string, isCritical?: boolean }) {
  const getGlow = () => {
    if (colorClass === 'blue') return 'shadow-[0_0_15px_rgba(96,165,250,0.15)] bg-blue-500/10 border-blue-500/20';
    if (colorClass === 'amber') return 'shadow-[0_0_15px_rgba(251,191,36,0.15)] bg-amber-500/10 border-amber-500/20';
    if (colorClass === 'rose') return 'shadow-[0_0_15px_rgba(244,63,94,0.15)] bg-rose-500/10 border-rose-500/20';
    if (colorClass === 'emerald') return 'shadow-[0_0_15px_rgba(52,211,153,0.15)] bg-emerald-500/10 border-emerald-500/20';
    return '';
  };

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`glass-panel rounded-3xl p-6 shadow-md flex flex-col justify-between transition-all duration-300 border ${isCritical ? 'border-rose-500/50 bg-rose-950/30 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'border-slate-700/50 hover:border-slate-600'}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase">{title}</h3>
        <div className={`p-2.5 rounded-xl border ${getGlow()}`}>
          {icon}
        </div>
      </div>
      <p className="text-4xl font-extrabold tracking-tight text-white">{value}</p>
    </motion.div>
  );
}

function getPriorityColor(level: string) {
  if (!level) return 'bg-slate-900/50 text-slate-400 border-slate-700';
  switch (level.toLowerCase()) {
    case 'critical': return 'bg-rose-950/50 text-rose-400 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
    case 'high': return 'bg-orange-950/50 text-orange-400 border-orange-500/50';
    case 'medium': return 'bg-amber-950/50 text-amber-400 border-amber-500/50';
    default: return 'bg-slate-900/50 text-slate-400 border-slate-700';
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'resolved': return 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30';
    case 'in_progress': return 'bg-sky-950/50 text-sky-400 border-sky-500/30';
    default: return 'bg-slate-900/50 text-slate-400 border-slate-700';
  }
}

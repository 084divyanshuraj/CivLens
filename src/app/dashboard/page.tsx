"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, AlertCircle, CheckCircle2, Clock, 
  MapPin, Loader2, RefreshCw, AlertTriangle
} from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400 mb-4" />
        <p className="text-zinc-500 font-medium">Loading civic intelligence...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Admin Dashboard</h1>
          <p className="text-zinc-500 mt-1">Real-time overview of civic infrastructure issues.</p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Reports" 
          value={stats?.totalIssues || 0} 
          icon={<BarChart3 className="h-5 w-5 text-blue-500" />} 
        />
        <StatCard 
          title="Pending Review" 
          value={stats?.pendingIssues || 0} 
          icon={<Clock className="h-5 w-5 text-amber-500" />} 
        />
        <StatCard 
          title="Critical Issues" 
          value={stats?.criticalIssues || 0} 
          icon={<AlertCircle className="h-5 w-5 text-red-500" />} 
          isCritical={(stats?.criticalIssues || 0) > 0}
        />
        <StatCard 
          title="Resolved" 
          value={stats?.resolvedIssues || 0} 
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Issues List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-black">Recent Reports</h2>
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            {issues.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">No issues reported yet.</div>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {issues.map((issue) => (
                  <li key={issue.id} className="p-5 hover:bg-zinc-50 transition-colors flex flex-col sm:flex-row gap-4">
                    {/* Tiny Image Preview */}
                    <div className="relative h-20 w-28 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-zinc-100 hidden sm:block">
                      {issue.imageUrl && (
                        <Image src={issue.imageUrl} alt={issue.category} fill className="object-cover" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(issue.vision?.severity || '')}`}>
                          {(issue.vision?.severity || 'UNKNOWN').toUpperCase()} ({issue.priority?.score || 0}/100)
                        </span>
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          {issue.vision?.issueType || 'Unknown Issue'}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-black truncate mb-1">
                        {issue.executiveSummary?.summary || "Untitled Issue"}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{issue.location?.address || 'Location not provided'}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <span className="text-xs text-zinc-400 font-medium">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-md ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-black flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            AI Insights
          </h2>
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6">
            {stats?.aiInsights && stats.aiInsights.length > 0 ? (
              <ul className="space-y-4">
                {stats.aiInsights.map((insight: string, idx: number) => (
                  <li key={idx} className="flex gap-3 text-sm text-zinc-700 leading-relaxed">
                    <div className="h-1.5 w-1.5 rounded-full bg-black mt-2 shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500 text-center py-4">Not enough data for AI insights yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponents & Helpers

function StatCard({ title, value, icon, isCritical = false }: { title: string, value: number, icon: any, isCritical?: boolean }) {
  return (
    <div className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between ${isCritical ? 'border-red-200 bg-red-50/30' : 'border-zinc-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-500">{title}</h3>
        <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold tracking-tight text-black">{value}</p>
    </div>
  );
}

function getPriorityColor(level: string) {
  if (!level) return 'bg-zinc-100 text-zinc-700 border border-zinc-200';
  switch (level.toLowerCase()) {
    case 'critical': return 'bg-red-100 text-red-700 border border-red-200';
    case 'high': return 'bg-orange-100 text-orange-700 border border-orange-200';
    case 'medium': return 'bg-amber-100 text-amber-700 border border-amber-200';
    default: return 'bg-zinc-100 text-zinc-700 border border-zinc-200';
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'resolved': return 'bg-green-50 text-green-700 border border-green-100';
    case 'in_progress': return 'bg-blue-50 text-blue-700 border border-blue-100';
    default: return 'bg-zinc-100 text-zinc-600 border border-zinc-200';
  }
}

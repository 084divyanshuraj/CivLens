"use client";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function AnalyticsCharts({ roiData, categoryData }: { roiData: any, categoryData: any }) {
  if (!roiData) return null;

  // Format category data for the bar chart
  const formattedCategoryData = Object.keys(categoryData || {}).map(key => ({
    name: key.length > 10 ? key.substring(0, 10) + '...' : key,
    value: categoryData[key]
  }));

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Predictive Savings Chart */}
      <div className="lg:col-span-2 glass-panel rounded-3xl p-6 relative overflow-hidden border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Projected Municipal Savings
            </h2>
            <p className="text-sm text-slate-400 mt-1">Estimated budget saved by preventing critical infrastructure failure.</p>
          </div>
          <div className="bg-emerald-950/40 border border-emerald-500/30 px-4 py-2 rounded-xl text-right">
            <span className="block text-xs font-bold tracking-widest text-emerald-500 uppercase mb-0.5">Total Saved</span>
            <span className="text-xl font-black text-emerald-400">{formatCurrency(roiData.totalBudgetSaved)}</span>
          </div>
        </div>

        <div className="h-64 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={roiData.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
                formatter={(value: number) => [formatCurrency(value), 'Savings']}
              />
              <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden border border-sky-500/20 shadow-[0_0_20px_rgba(2,132,199,0.05)]">
        <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="mb-6 relative z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Issue Demographics
          </h2>
          <p className="text-sm text-slate-400 mt-1">Frequency by category.</p>
        </div>

        <div className="h-64 w-full relative z-10">
          {formattedCategoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedCategoryData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="#38bdf8" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-500 font-medium">
              Not enough data.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

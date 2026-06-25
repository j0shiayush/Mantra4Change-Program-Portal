"use client";

import { useState, useEffect } from "react";
import { Users, School, CheckCircle, FileText, Activity, AlertCircle, TrendingUp, Moon, Sun } from "lucide-react";

export default function CombinedDashboard() {
  const [activeTab, setActiveTab] = useState<"intelligence" | "grant">("intelligence");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Tab 1: PBL Program Intelligence State
  const [month, setMonth] = useState("2025-08");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Tab 2: AI Grant Assistant State
  const [selectedGrant, setSelectedGrant] = useState("GRANT_AA_2025");
  const [grantMonth, setGrantMonth] = useState("2025-09");
  const [grantFacts, setGrantFacts] = useState<any>(null);
  const [generatedReport, setGeneratedReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);

  // Effect for Tab 1 (Dashboard API)
  useEffect(() => {
    async function fetchDashboardData() {
      setLoadingDashboard(true);
      try {
        const response = await fetch(`/api/dashboard?month=${month}`);
        const result = await response.json();
        setDashboardData(result);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
      setLoadingDashboard(false);
    }
    fetchDashboardData();
  }, [month]);

  // Effect for Tab 2 (Grant Fact API)
  useEffect(() => {
    if (activeTab === "grant") {
      setGrantFacts(null);
      setGeneratedReport("");
      fetch(`/api/grant?grantId=${selectedGrant}&month=${grantMonth}`)
        .then((res) => res.json())
        .then((data) => setGrantFacts(data))
        .catch((err) => console.error("Error loading grant facts:", err));
    }
  }, [selectedGrant, grantMonth, activeTab]);

  // Call Gemini Prompt Engine
  const handleGenerateReport = async () => {
    if (!grantFacts) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grantFacts),
      });
      const data = await res.json();
      setGeneratedReport(data.generatedReport || data.error);
    } catch (err) {
      setGeneratedReport("Failed to generate report. Fact summaries remain fully operational.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] p-6 md:p-12 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 transition-colors duration-300 text-slate-900 dark:text-slate-100">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Main Top Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                Mantra4Change Program Portal
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium ml-12">
                Unified Analytical Monitoring & Grant Intelligence
              </p>
            </div>
            
            <div className="mt-6 md:mt-0 flex items-center gap-4">
              {/* Dark/Light mode toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>

              {/* Tab Navigation Switches */}
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
                <button
                  onClick={() => setActiveTab("intelligence")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === "intelligence" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab("grant")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === "grant" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Grant AI
                </button>
              </div>
            </div>
          </header>

          {/* ============================== TAB 1: ANALYTICS ============================== */}
          {activeTab === "intelligence" && (
            <div className="space-y-8">
              {/* Dropdown Filters */}
              <div className="flex justify-end bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reporting Month:</span>
                  <select 
                    value={month} 
                    onChange={(e) => setMonth(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-bold text-sm rounded-lg p-2"
                  >
                    <option value="All">All Months</option>
                    <option value="2025-07">July 2025</option>
                    <option value="2025-08">August 2025</option>
                    <option value="2025-09">September 2025</option>
                  </select>
                </div>
              </div>

              {loadingDashboard || !dashboardData ? (
                <div className="text-center py-12 text-slate-500">Recalculating core analytics metrics...</div>
              ) : (
                <>
                  {/* KPI Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard title="Total Active Schools" value={dashboardData.summary.totalSchools} icon={<School />} color="indigo" />
                    <MetricCard title="Program Participation" value={`${dashboardData.summary.participationRate}%`} subtitle={`${dashboardData.summary.participatingSchools} schools active`} icon={<TrendingUp />} color="emerald" />
                    <MetricCard title="Evidence Submission" value={`${dashboardData.summary.evidenceRate}%`} subtitle="Verified attachments" icon={<FileText />} color="blue" />
                    <MetricCard title="Average Attendance" value={`${dashboardData.summary.attendanceRate}%`} subtitle="Student index level" icon={<Users />} color="amber" />
                  </div>

                  {/* Regional Table */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                      <h2 className="font-bold text-slate-800 dark:text-white">Geographic Risk Distribution</h2>
                    </div>
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="px-8 py-4 font-bold uppercase tracking-wider text-xs">District Name</th>
                          <th className="px-8 py-4 font-bold uppercase tracking-wider text-xs text-center">Schools</th>
                          <th className="px-8 py-4 font-bold uppercase tracking-wider text-xs">Attendance Health</th>
                          <th className="px-8 py-4 font-bold uppercase tracking-wider text-xs text-right">System Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {dashboardData.geography.map((dist: any) => (
                          <tr key={dist.district} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="px-8 py-5 font-semibold">{dist.district}</td>
                            <td className="px-8 py-5 text-center font-medium text-slate-500">{dist.schools}</td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <span className="font-bold w-12">{dist.attendanceRate.toFixed(1)}%</span>
                                <div className="w-32 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      dist.attendanceRate >= 75 ? "bg-emerald-500" : dist.attendanceRate >= 60 ? "bg-amber-500" : "bg-rose-500"
                                    }`}
                                    style={{ width: `${Math.min(dist.attendanceRate, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                                dist.riskStatus === "On Track" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200" : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200"
                              }`}>
                                {dist.riskStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ============================== TAB 2: AI GRANT REPORTING ============================== */}
          {activeTab === "grant" && (
            <div className="space-y-6">
              {/* Configuration Panel */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-6 items-center justify-between shadow-sm">
                <div className="flex gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Grant Frame</label>
                    <select value={selectedGrant} onChange={(e) => setSelectedGrant(e.target.value)} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold rounded-lg p-2">
                      <option value="GRANT_AA_2025">Learning Support Grant AA (Donor AA)</option>
                      <option value="GRANT_BB_2025">Learning Support Grant BB (Donor BB)</option>
                      <option value="GRANT_CC_2025">Learning Support Grant CC (Donor CC)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reporting Cycle</label>
                    <select value={grantMonth} onChange={(e) => setGrantMonth(e.target.value)} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold rounded-lg p-2">
                      <option value="2025-07">July 2025</option>
                      <option value="2025-08">August 2025</option>
                      <option value="2025-09">September 2025</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">AI Narrative Layer</span>
                    <span className="text-[10px] text-slate-400">Allows verification testing fallback</span>
                  </div>
                  <input type="checkbox" checked={aiEnabled} onChange={(e) => setAiEnabled(e.target.checked)} className="w-4 h-4 text-indigo-600" />
                </div>
              </div>

              {/* Layout Content Grid splits */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Left Side: Deterministic Fact summary viewports */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">Grounded Database Facts</h3>
                    
                    {grantFacts?.performance ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completion Rate</div>
                            <div className="text-lg font-bold mt-1">{(grantFacts.performance.pblCompletionRate * 100).toFixed(1)}%</div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attendance</div>
                            <div className="text-lg font-bold mt-1">{(grantFacts.performance.attendanceRate * 100).toFixed(1)}%</div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Risk Profile</div>
                            <div className="text-lg font-bold mt-1 text-emerald-500">{grantFacts.performance.riskStatus}</div>
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-bold text-slate-400 block mb-1">Internal Milestones Matrix</span>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{grantFacts.performance.milestoneSummary}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">Loading ground facts records...</p>
                    )}
                  </div>

                  {/* Financial Budgets utilization records */}
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold mb-3">Budget Utilization Ledgers</h3>
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-bold uppercase">
                          <th className="pb-2">Line Item</th>
                          <th className="pb-2 text-right">Approved</th>
                          <th className="pb-2 text-right">Monthly</th>
                          <th className="pb-2 text-right">Burn Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {grantFacts?.finance?.map((item: any) => (
                          <tr key={item.id}>
                            <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{item.budgetLine}</td>
                            <td className="py-3 text-right font-mono">{item.approvedUnits}</td>
                            <td className="py-3 text-right font-mono text-indigo-600 dark:text-indigo-400">{item.monthlyUtilized}</td>
                            <td className="py-3 text-right font-mono font-bold">{(item.utilizationRate * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Evidence Media Index files render */}
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold mb-4">Field Evidence & Media Index</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {grantFacts?.media?.map((item: any) => (
                        <div key={item.id} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-col justify-between">
                          <div>
                            <img src={`/${item.relativePath}`} alt={item.title} className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-700 mb-3" />
                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{item.recordType}</span>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{item.title}</h4>
                            <p className="text-xs text-slate-400 mt-1">{item.summary}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: AI Synthesis Engine Terminal */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm sticky top-6 flex flex-col justify-between min-h-[450px]">
                    <div>
                      <h3 className="font-bold border-b border-slate-100 dark:border-slate-700 pb-3 mb-4 flex justify-between items-center">
                        AI Narrative Engine
                        {aiEnabled && <span className="text-xs text-emerald-500 animate-pulse font-medium">● Gemini Active</span>}
                      </h3>

                      {!aiEnabled ? (
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-sm text-slate-500">
                          <p>AI Generation Layer has been disabled via control switches fallback testing.</p>
                          <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                            <span className="text-xs font-bold block mb-1 uppercase tracking-wider text-slate-400">Baseline Draft Fallback:</span>
                            <p className="italic bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 text-xs">
                              {grantFacts?.performance?.draftReportText}
                            </p>
                          </div>
                        </div>
                      ) : generatedReport ? (
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide block">Synthesized Narrative Draft:</span>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{generatedReport}</p>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-400 text-sm">
                          Click the synthesis action trigger below to compile the grounded data matrices.
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleGenerateReport}
                      disabled={isGenerating || !aiEnabled || !grantFacts}
                      className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all shadow-md mt-6 ${
                        !aiEnabled || !grantFacts ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-400" : "bg-indigo-600 hover:bg-indigo-500"
                      }`}
                    >
                      {isGenerating ? "Analyzing Data Matrices..." : "Synthesize Report Narrative"}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Simple internal sub-component helper
function MetricCard({ title, value, subtitle, icon, color }: any) {
  const bgClasses = {
    indigo: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
  }[color as 'indigo' | 'emerald' | 'blue' | 'amber'];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bgClasses}`}>{icon}</div>
      </div>
      <div>
        <h3 className="text-3xl font-black tracking-tight">{value}</h3>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-2">{title}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}
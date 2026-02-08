
import React, { useState, useMemo, useEffect } from 'react';
import { RepoStatus, Diagnosis, AutopsyReport, Framework } from './types';
import { FLEET_SUMMARY, MOCK_HEALTH_REPORT, MOCK_GENOME, MOCK_AUTOPSY, MOCK_IMMUNIZER, MOCK_VITALS, MOCK_BLACKBOX, MOCK_FIREWALL, SYSTEM_VERSION } from './constants';
import RepoCard from './components/RepoCard';
import SmartBrainTerminal from './components/SmartBrainTerminal';
import HealthReportModal from './components/HealthReportModal';
import GenomeModal from './components/GenomeModal';
import AutopsyModal from './components/AutopsyModal';
import ImmunizerModal from './components/ImmunizerModal';
import DocumentationModal from './components/DocumentationModal';
import VitalsModal from './components/VitalsModal';
import BlackboxModal from './components/BlackboxModal';
import FirewallModal from './components/FirewallModal';
import ActionWorkflowModal from './components/ActionWorkflowModal';
import ScanBox from './components/ScanBox';
import { RepoBrainAI } from './services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const App: React.FC = () => {
  const [fleet, setFleet] = useState(FLEET_SUMMARY.repos);
  const [statusFilter, setStatusFilter] = useState<RepoStatus | 'ALL'>('ALL');
  const [frameworkFilter, setFrameworkFilter] = useState<Framework | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [fleetStrategy, setFleetStrategy] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[] | null>(null);
  const [selectedAutopsy, setSelectedAutopsy] = useState<AutopsyReport | null>(null);
  const [selectedActionRepo, setSelectedActionRepo] = useState<Diagnosis | null>(null);
  const [tickerMsg, setTickerMsg] = useState(`Signal stabilized. REPO BRAIN HOSPITAL ${SYSTEM_VERSION} active.`);

  const [modals, setModals] = useState({
    health: false,
    genome: false,
    autopsy: false,
    immunizer: false,
    docs: false,
    vitals: false,
    blackbox: false,
    firewall: false,
    workflow: false
  });

  useEffect(() => {
    const events = [
      "🛡️ Oracle: Critical Pattern blocked in 'vault-service'.",
      "💉 Neural Bridge Grafting: Restoring GITHUB_TOKEN feedback loop.",
      "⚙️ Motor Function: Hardhat compilation cycle verified.",
      "🧬 Greenlock: SHA-256 seal maintained on 142 nodes.",
      "🚀 Admission: 'contracts-core' successfully hospitalized.",
      "💉 Bot Surgeon: Parallel repair thread #4 terminated successfully.",
      "🐙 Oracle: Strategic PR wired for infrastructure drift sync.",
      "🧪 Test Suite: Phase 18 validation successful in 42 nodes."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setTickerMsg(events[i % events.length]);
      i++;
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const counts = useMemo(() => ({
    [RepoStatus.GREEN]: fleet.filter(r => r.status === RepoStatus.GREEN).length,
    [RepoStatus.AUTO_FIXABLE]: fleet.filter(r => r.status === RepoStatus.AUTO_FIXABLE).length,
    [RepoStatus.RED]: fleet.filter(r => r.status === RepoStatus.RED).length,
  }), [fleet]);

  const chartData = useMemo(() => [
    { name: 'GREEN', value: counts[RepoStatus.GREEN], color: '#10b981' },
    { name: 'AUTO_FIXABLE', value: counts[RepoStatus.AUTO_FIXABLE], color: '#f59e0b' },
    { name: 'RED', value: counts[RepoStatus.RED], color: '#f43f5e' },
  ].filter(d => d.value > 0), [counts]);

  const filteredRepos = useMemo(() => {
    return fleet.filter(r => {
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const matchesFramework = frameworkFilter === 'ALL' || r.framework === frameworkFilter;
      const matchesSearch = r.repo.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesFramework && matchesSearch;
    });
  }, [fleet, statusFilter, frameworkFilter, search]);

  const stats = useMemo(() => [
    { label: 'Critical', count: counts[RepoStatus.RED], color: 'text-rose-500', val: RepoStatus.RED },
    { label: 'Drift', count: counts[RepoStatus.AUTO_FIXABLE], color: 'text-amber-500', val: RepoStatus.AUTO_FIXABLE },
    { label: 'Nominal', count: counts[RepoStatus.GREEN], color: 'text-emerald-500', val: RepoStatus.GREEN }
  ], [counts]);

  const handleFleetAnalysis = async () => {
    setIsAnalyzing(true);
    const ai = new RepoBrainAI();
    const strategy = await ai.getFleetHealthOverview(fleet);
    setFleetStrategy(strategy);
    setIsAnalyzing(false);
  };

  const handlePRCreated = (repoName: string, prUrl: string) => {
    setFleet(prev => prev.map(r => 
      r.repo === repoName ? { ...r, prStatus: 'OPEN', prUrl } : r
    ));
  };

  const toggleModal = (key: keyof typeof modals) => setModals(m => ({ ...m, [key]: !m[key] }));

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 py-6 lg:py-16 bg-slate-950 min-h-screen text-slate-100 font-inter">
      {/* Overlays */}
      {activeLogs && <SmartBrainTerminal logs={activeLogs} onClose={() => setActiveLogs(null)} />}
      {modals.health && <HealthReportModal report={MOCK_HEALTH_REPORT} onClose={() => toggleModal('health')} />}
      {modals.genome && <GenomeModal report={MOCK_GENOME} onClose={() => toggleModal('genome')} />}
      {modals.autopsy && <AutopsyModal report={selectedAutopsy || MOCK_AUTOPSY} onClose={() => { toggleModal('autopsy'); setSelectedAutopsy(null); }} />}
      {modals.immunizer && <ImmunizerModal report={MOCK_IMMUNIZER} onClose={() => toggleModal('immunizer')} />}
      {modals.docs && <DocumentationModal onClose={() => toggleModal('docs')} />}
      {modals.vitals && <VitalsModal vitals={MOCK_VITALS} onClose={() => toggleModal('vitals')} />}
      {modals.blackbox && <BlackboxModal recording={MOCK_BLACKBOX} onClose={() => toggleModal('blackbox')} />}
      {modals.firewall && <FirewallModal report={MOCK_FIREWALL} onClose={() => toggleModal('firewall')} />}
      {modals.workflow && selectedActionRepo && <ActionWorkflowModal repo={selectedActionRepo} onClose={() => toggleModal('workflow')} />}

      <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 border-b border-slate-900 pb-8 md:pb-10">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8">
          <div className="relative group cursor-pointer shrink-0" onClick={() => toggleModal('docs')}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-gradient-to-br from-indigo-600 via-blue-600 to-emerald-600 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] flex items-center justify-center text-3xl sm:text-4xl md:text-6xl shadow-2xl group-hover:scale-105 transition-all duration-500">
              🧠
            </div>
            <div className="absolute -top-1 -right-1 w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 bg-emerald-500 rounded-full border-4 border-slate-950 animate-pulse"></div>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">HOSPITAL <span className="text-blue-600">V2.2</span></h1>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-3 mt-3 sm:mt-4 text-[8px] sm:text-[10px] md:text-xs text-slate-500 font-mono tracking-widest font-bold uppercase">
              <span className="text-blue-500">CyberAI Oracle</span>
              <span className="opacity-20 hidden sm:inline">/</span>
              <span className="text-emerald-400">MERMEDA {SYSTEM_VERSION}</span>
              <span className="opacity-20 hidden sm:inline">/</span>
              <span className="text-rose-500 px-2 py-0.5 bg-rose-500/10 rounded-full border border-rose-500/20">LIVE</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-3 w-full md:w-auto">
          <button onClick={() => toggleModal('docs')} className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-xl sm:rounded-2xl px-6 md:px-10 py-3 md:py-5 flex items-center justify-center gap-2 transition-all active:scale-95 text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">
            System Spec
          </button>
          <button onClick={handleFleetAnalysis} disabled={isAnalyzing} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl sm:rounded-2xl px-6 md:px-10 py-3 md:py-5 transition-all active:scale-95 text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/30">
            {isAnalyzing ? 'Processing...' : 'Oracle Audit'}
          </button>
        </div>
      </header>

      {/* Ticker System */}
      <div className="mb-8 md:mb-12 glass border border-slate-800/60 rounded-xl md:rounded-[2.5rem] py-3 md:py-6 px-4 md:px-10 overflow-hidden flex items-center gap-3 sm:gap-6 shadow-2xl relative">
        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
        <span className="shrink-0 bg-blue-500/10 text-blue-400 text-[8px] sm:text-[9px] md:text-xs font-black uppercase border border-blue-500/30 px-2 md:px-3 py-1 md:py-1.5 rounded-full animate-pulse tracking-widest relative z-10">Oracle Feed</span>
        <div className="flex-1 font-mono text-[10px] sm:text-sm md:text-lg text-slate-400 italic truncate relative z-10">
          {tickerMsg}
        </div>
      </div>

      {/* Analytics Dashboard Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-10 mb-12 md:mb-24">
        {/* Fleet Distribution Chart */}
        <div className="xl:col-span-4 bg-slate-900/40 border border-slate-800 p-6 sm:p-8 lg:p-12 rounded-2xl md:rounded-[4rem] flex flex-col items-center justify-center shadow-2xl backdrop-blur-md min-h-[300px] md:min-h-[350px]">
          <div className="h-40 sm:h-48 md:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius="65%" outerRadius="85%" paddingAngle={10} dataKey="value" stroke="none">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[8px] sm:text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.4em] mt-6 md:mt-8">Fleet Integrity Distribution</span>
        </div>
        
        {/* Telemetry Stats */}
        <div className="xl:col-span-8 bg-slate-900/40 border border-slate-800 p-6 sm:p-8 lg:p-16 rounded-2xl md:rounded-[4rem] flex flex-col justify-center shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] select-none pointer-events-none hidden lg:block">
            <span className="text-[15rem] xl:text-[20rem] font-black italic">PULSE</span>
          </div>
          <h2 className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.6em] text-slate-500 mb-6 md:mb-12 flex items-center gap-3 relative z-10">
             Mission Control Realtime
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-10 relative z-10">
            {stats.map(s => (
              <button 
                key={s.label} 
                onClick={() => setStatusFilter(s.val as any)}
                className={`p-4 sm:p-6 lg:p-10 bg-slate-950 rounded-xl sm:rounded-[2rem] lg:rounded-[3rem] border border-slate-800 flex flex-col text-left hover:border-blue-500/40 transition-all active:scale-95 group shadow-inner ${statusFilter === s.val ? 'border-blue-500/60 bg-blue-500/5 ring-4 ring-blue-500/5' : ''}`}
              >
                <span className={`text-4xl sm:text-5xl lg:text-7xl font-black mb-1 md:mb-2 group-hover:scale-105 transition-transform ${s.color}`}>{s.count}</span>
                <span className="text-[8px] sm:text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest leading-none">{s.label}</span>
                <div className="flex gap-1.5 sm:gap-2 mt-4 md:mt-6">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className={`h-1 flex-1 rounded-full ${statusFilter === s.val ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
                  ))}
                </div>
              </button>
            ))}
          </div>
          {fleetStrategy && (
            <div className="mt-6 md:mt-10 p-4 sm:p-6 lg:p-10 bg-blue-600/5 border border-blue-500/20 rounded-xl sm:rounded-[2.5rem] text-xs sm:text-sm md:text-lg text-blue-300 italic font-medium animate-in fade-in slide-in-from-bottom-4 shadow-inner relative">
               <div className="absolute -top-2.5 sm:-top-3 left-4 sm:left-8 px-2 sm:px-4 py-0.5 sm:py-1 bg-blue-600 rounded-full text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-white">Strategic Strategy</div>
               {fleetStrategy}
            </div>
          )}
        </div>
      </section>

      {/* Grid Controller - Dynamic High-Density Filters */}
      <section className="mb-16 md:mb-24">
        <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-[4rem] mb-8 md:mb-12 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch lg:items-end">
            <div className="flex-1">
              <label className="text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-600 mb-2 md:mb-3 block ml-2 md:ml-4 italic">Repo Admission Search</label>
              <div className="relative group">
                <span className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-slate-500 text-lg md:text-3xl transition-colors group-focus-within:text-blue-500">🔍</span>
                <input 
                  type="text" 
                  placeholder="Query fleet registry..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="w-full bg-slate-950/80 border-2 border-slate-800 rounded-xl md:rounded-[3rem] py-3.5 md:py-10 pl-12 md:pl-28 pr-4 md:pr-8 outline-none focus:border-blue-500/50 transition-all font-bold text-sm md:text-3xl placeholder:text-slate-800 shadow-inner" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 shrink-0">
              <div className="flex flex-col">
                <label className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2 md:mb-3 block ml-1 md:ml-2">Framework</label>
                <select 
                  value={frameworkFilter} 
                  onChange={(e) => setFrameworkFilter(e.target.value as any)}
                  className="bg-slate-950 border-2 border-slate-800 rounded-lg md:rounded-3xl px-3 md:px-6 py-2.5 md:py-8 text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest outline-none focus:border-blue-500/50 appearance-none min-w-[120px] md:min-w-[150px] text-center cursor-pointer shadow-inner"
                >
                  <option value="ALL">ALL STACKS</option>
                  {Object.values(Framework).map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-600 mb-2 md:mb-3 block ml-1 md:ml-2">Health</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-950 border-2 border-slate-800 rounded-lg md:rounded-3xl px-3 md:px-6 py-2.5 md:py-8 text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest outline-none focus:border-blue-500/50 appearance-none min-w-[120px] md:min-w-[150px] text-center cursor-pointer shadow-inner"
                >
                  <option value="ALL">ALL STATES</option>
                  {Object.values(RepoStatus).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>

              <div className="flex items-end col-span-2 md:col-span-1">
                <button 
                  onClick={() => { setStatusFilter('ALL'); setFrameworkFilter('ALL'); setSearch(''); }}
                  className="w-full px-4 md:px-6 py-2.5 md:py-8 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest rounded-lg md:rounded-3xl transition-all active:scale-95 shadow-lg border border-white/5"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-10 xl:gap-12">
            {filteredRepos.map(repo => (
              <RepoCard 
                key={repo.repo} 
                repo={repo} 
                onViewLogs={(logs) => setActiveLogs(logs)} 
                onViewAutopsy={(report) => { setSelectedAutopsy(report); toggleModal('autopsy'); }}
                onOpenActionModal={(repo) => { setSelectedActionRepo(repo); toggleModal('workflow'); }}
                onPRCreated={handlePRCreated}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 md:py-64 bg-slate-900/20 rounded-2xl md:rounded-[3rem] border-4 border-dashed border-slate-800/60 flex flex-col items-center gap-6 md:gap-8">
            <span className="text-5xl md:text-9xl grayscale opacity-30">📡</span>
            <p className="text-slate-600 font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-lg md:text-4xl italic">Zero Signals Detected</p>
          </div>
        )}
      </section>

      {/* Control Station Dashboard */}
      <section className="mb-16 md:mb-24 bg-slate-900/40 border border-slate-800 rounded-2xl md:rounded-[5rem] p-6 sm:p-10 md:p-20 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 md:mb-16 gap-6 md:gap-10">
           <div className="flex items-center gap-4 md:gap-6">
              <div className="w-5 h-5 md:w-8 md:h-8 bg-blue-500 rounded-full animate-pulse shadow-[0_0_40px_rgba(59,130,246,1)]"></div>
              <h2 className="text-2xl sm:text-3xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                Surgery Station
              </h2>
           </div>
           <button onClick={() => setActiveLogs(['💉 Initializing Bot Surgeon...', '🛡️ Pattern matching fleet genome...', '✅ Phase 18 normal.'])} className="w-full lg:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 md:px-20 py-4 md:py-10 rounded-xl md:rounded-[3rem] text-[10px] sm:text-xs md:text-lg font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all shadow-2xl active:scale-95 border border-blue-400/30">
              Trigger Global Normalization
           </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-10">
          {[
            { label: 'Brain Doctor', icon: '🩺', action: () => toggleModal('health') },
            { label: 'Safety Wall', icon: '🔥', action: () => toggleModal('firewall') },
            { label: 'Blackbox', icon: '📼', action: () => toggleModal('blackbox') },
            { label: 'Stack Vitals', icon: '📊', action: () => toggleModal('vitals') },
            { label: 'Autopsy', icon: '🔪', action: () => { setSelectedAutopsy(MOCK_AUTOPSY); toggleModal('autopsy'); } },
            { label: 'Genome Map', icon: '🧬', action: () => toggleModal('genome') },
            { label: 'Integrity', icon: '🛡️', action: () => toggleModal('immunizer') },
            { label: 'Admission', icon: '🎟️', action: () => document.getElementById('admission-scan')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Protocol', icon: '📜', action: () => toggleModal('docs') },
            { label: 'Bot Surgeon', icon: '💉', action: () => setActiveLogs(['💉 Starting Bot Surgeon Sequence...']) }
          ].map((op) => (
            <button
              key={op.label}
              onClick={op.action}
              className="flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-8 p-4 sm:p-6 lg:p-12 bg-slate-950/70 border-2 border-slate-800 rounded-xl md:rounded-[3rem] hover:border-blue-500/60 transition-all group active:scale-95 shadow-inner hover:bg-slate-900"
            >
              <span className="text-3xl sm:text-4xl lg:text-7xl group-hover:scale-125 transition-transform duration-500">{op.icon}</span>
              <span className="block text-[7px] sm:text-[8px] lg:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-100">{op.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="admission-scan" className="mb-24 md:mb-32">
        <ScanBox onScanTrigger={(logs) => setActiveLogs(logs)} />
      </section>

      <footer className="pt-16 md:pt-24 pb-24 md:pb-48 border-t border-slate-900 text-center flex flex-col items-center">
        <div className="flex flex-wrap gap-4 sm:gap-8 lg:gap-16 justify-center opacity-40 grayscale hover:grayscale-0 transition-all mb-8 md:mb-12">
           <div className="px-5 md:px-10 py-2.5 md:py-5 border border-slate-800 rounded-full font-black text-[8px] md:text-sm tracking-[0.3em] md:tracking-[0.5em] uppercase">CyberAI Protocol</div>
           <div className="px-5 md:px-10 py-2.5 md:py-5 border border-slate-800 rounded-full font-black text-[8px] md:text-sm tracking-[0.3em] md:tracking-[0.5em] uppercase">Parallel Repair</div>
           <div className="px-5 md:px-10 py-2.5 md:py-5 border border-slate-800 rounded-full font-black text-[8px] md:text-sm tracking-[0.3em] md:tracking-[0.5em] uppercase">Oracle Network</div>
        </div>
        <p className="text-slate-800 text-xs sm:text-sm md:text-2xl font-mono font-bold uppercase tracking-[0.4em] md:tracking-[0.8em] mb-4 md:mb-6 italic">REPO BRAIN HOSPITAL • {SYSTEM_VERSION} • CYBERAI NETWORK</p>
        <p className="text-slate-900 text-[8px] sm:text-[9px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em] max-w-4xl leading-relaxed opacity-60 px-4">
          Definitive autonomous repository governance for mission-critical fleets. Optimized for Web3, Cloud-Native, and Decentralized architectures. All signals monitored by CyberAI Oracle.
          <br/>
          <span className="text-blue-500/50 block mt-3 md:mt-4 font-mono">copyrights@ www.CyberAi.network by Repo Brain Hospital app</span>
        </p>
      </footer>
    </div>
  );
};

export default App;

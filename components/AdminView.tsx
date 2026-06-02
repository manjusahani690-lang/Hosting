'use client';

import React, { useState } from 'react';
import { 
  Users, TrendingUp, Shield, Activity, Database, Lock, Settings, 
  AlertCircle, CheckCircle, RefreshCw, Search, Power, Terminal, 
  Globe, DollarSign, Check, Cpu, Trash2, Edit3, ArrowRight, Sparkles 
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'active' | 'suspended';
  domain: string;
  cpuUsed: number;
}

export default function AdminView({ setActivePage }: { setActivePage: (page: string) => void }) {
  // System configurations & live controls
  const [ddosWall, setDdosWall] = useState<boolean>(true);
  const [backupSystem, setBackupSystem] = useState<'hourly' | 'daily' | 'weekly'>('daily');
  const [googleSsoEnforced, setGoogleSsoEnforced] = useState<boolean>(true);
  
  // Clients state
  const [clients, setClients] = useState<Client[]>([
    { id: 'usr-101', name: 'Raj Sahani', email: 'rajsahani.RgcS@gmail.com', plan: 'AI Premium Cloud', status: 'active', domain: 'rajsahani.in', cpuUsed: 12 },
    { id: 'usr-102', name: 'Gaurav Kumar', email: 'gaurav.k@enterprise.org', plan: 'VPS Pro Kernel', status: 'active', domain: 'gauravai.com', cpuUsed: 44 },
    { id: 'usr-103', name: 'Abhishek Roy', email: 'abhishek.roy@outlook.com', plan: 'Elite Shared Vibe', status: 'suspended', domain: 'roycloud.ai', cpuUsed: 0 },
    { id: 'usr-104', name: 'Vibe Developer', email: 'developer.cloudvibe@gmail.com', plan: 'Developer Playground v3', status: 'active', domain: 'vibe-dev.net', cpuUsed: 8 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    'Secure TLS handshake verified on Dallas server nodes',
    'Google Single Sign-On (SSO) credential token synced successfully',
    'Automated SOC2 compliant audit log compiled at UTC index',
    'ICANN DNS API returned code 200 (Success)',
    'Enterprise mitigation deflected 34 network latency spoofing nodes',
  ]);

  const [newLogText, setNewLogText] = useState('');
  const [editPlanName, setEditPlanName] = useState('');
  const [isUpdatingState, setIsUpdatingState] = useState<string | null>(null);

  // Stats Counters
  const totalRevenue = 15420;
  const activeServersCount = 28;
  const activeDomainsCount = 142;

  // Filter client listings
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (clientId: string) => {
    setIsUpdatingState(clientId);
    setTimeout(() => {
      setClients(prev => prev.map(c => {
        if (c.id === clientId) {
          const newStatus = c.status === 'active' ? 'suspended' : 'active';
          // Append log
          addLog(`Client ${c.name} (${c.id}) system status changed to: ${newStatus.toUpperCase()}`);
          return { ...c, status: newStatus };
        }
        return c;
      }));
      setIsUpdatingState(null);
    }, 450);
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSystemLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const handleAddLiveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim()) return;
    addLog(newLogText.trim());
    setNewLogText('');
  };

  const handleSavePlanUpdate = (clientId: string) => {
    if (!editPlanName.trim()) return;
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        addLog(`Upgraded plan tier for ${c.name} to: ${editPlanName}`);
        return { ...c, plan: editPlanName };
      }
      return c;
    }));
    setSelectedClient(null);
    setEditPlanName('');
  };

  return (
    <div id="admin-view" className="bg-[#0b0518] text-slate-100 min-h-screen pb-24 antialiased font-sans">
      
      {/* Dynamic Grid Background Header banner */}
      <div className="relative bg-gradient-to-r from-[#120a2a] via-[#1b103e] to-[#0a0517] border-b border-[#25154f] py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-25" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-brand-purple/20 border border-brand-purple/40 rounded-full px-3.5 py-1 text-xs text-brand-purple tracking-widest font-mono uppercase font-black">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              GLOBAL hPanel ADMIN ROOT AUTHORITY
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight leading-none">
              A to Z System Control Center
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Server state diagnostics, client accounts metadata, Google Login Single-Sign-On sync & GDPR data audits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('dashboard')}
              className="bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-brand-purple/30"
            >
              <span>Back to customer hPanel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Widgets Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#140b2a] border border-[#231548] rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-1 text-left">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Verified Monthly Recurring Revenue</span>
              <p className="text-2xl font-black text-white">${totalRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                <TrendingUp className="w-3 h-3" />
                <span>+18.4% this quarter</span>
              </div>
            </div>
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#140b2a] border border-[#231548] rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-1 text-left">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Active Node Clusters</span>
              <p className="text-2xl font-black text-white">{activeServersCount}</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                <CheckCircle className="w-3 h-3" />
                <span>99.998% SLA Uptime metric</span>
              </div>
            </div>
            <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#140b2a] border border-[#231548] rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-1 text-left">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Secured Domain Handles</span>
              <p className="text-2xl font-black text-white">{activeDomainsCount}</p>
              <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold">
                <Globe className="w-3 h-3" />
                <span>ICANN Real-time Lookup online</span>
              </div>
            </div>
            <div className="p-3.5 bg-purple-500/10 text-purple-400 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#140b2a] border border-[#231548] rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-1 text-left">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">DDoS Firewall Intercepts</span>
              <p className="text-2xl font-black text-[#f43f5e]">12,842</p>
              <div className="flex items-center gap-1 text-[10px] text-[#f43f5e] font-bold">
                <Shield className="w-3 h-3" />
                <span>Dynamic flood mitigating layer active</span>
              </div>
            </div>
            <div className="p-3.5 bg-rose-500/10 text-rose-400 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Management Table + Config Sidebar */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left pane: User grid and customer listings */}
        <div className="lg:col-span-8 bg-[#120a22] border border-[#211444] rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-left">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  Client & Enterprise Domain Management
                </h3>
                <p className="text-xs text-slate-400">Suspend, reset passwords, change tiers, and configure customer parameters.</p>
              </div>

              {/* Instant customer search bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search user, domain, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#1b1034] text-xs text-slate-200 pl-8 pr-4 py-2 border border-[#2d1c5a] rounded-xl focus:outline-none focus:border-brand-purple min-w-[200px]"
                />
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Simulated interactive Client listing table */}
            <div className="overflow-x-auto rounded-xl border border-[#231548]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#180e30] text-slate-400 font-mono tracking-wider border-b border-[#231548]">
                    <th className="p-3.5 font-bold">Client / Status</th>
                    <th className="p-3.5 font-bold">User Email</th>
                    <th className="p-3.5 font-bold">Active Subscribed Plan</th>
                    <th className="p-3.5 font-bold">Domain Handle</th>
                    <th className="p-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#231548] font-medium">
                  {filteredClients.map((client) => (
                    <tr 
                      key={client.id}
                      className={`hover:bg-white/2 transition-colors ${client.status === 'suspended' ? 'bg-rose-950/10' : ''}`}
                    >
                      <td className="p-3.5 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-bold">{client.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">({client.id})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {client.status === 'active' ? (
                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-400 font-mono font-bold uppercase tracking-wider">
                              ACTIVE
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-rose-500/10 text-rose-400 font-mono font-bold uppercase tracking-wider">
                              SUSPENDED
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 flex items-center font-mono">
                            &bull; CPU utilization: {client.cpuUsed}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-350">{client.email}</td>
                      <td className="p-3.5 text-indigo-300 font-semibold">{client.plan}</td>
                      <td className="p-3.5 font-mono text-indigo-400">{client.domain}</td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedClient(client);
                            setEditPlanName(client.plan);
                          }}
                          className="bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple text-[10px] px-2.5 py-1.5 rounded-lg transition-colors font-bold cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Alter Tier</span>
                        </button>
                        <button
                          disabled={isUpdatingState === client.id}
                          onClick={() => handleToggleStatus(client.id)}
                          className={`text-[10px] px-2.5 py-1.5 rounded-lg transition-colors font-bold cursor-pointer inline-flex items-center gap-1 ${
                            client.status === 'active' 
                              ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400' 
                              : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{client.status === 'active' ? 'Suspend' : 'Activate'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredClients.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-mono">
                        No clients matching filter query found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Custom Interactive overlay to alter plans */}
            {selectedClient && (
              <div className="bg-[#190f33] border border-brand-purple/40 rounded-2xl p-5 text-left space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#2d1c5a] pb-3">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-purple" />
                    Configure Plan Limits: {selectedClient.name}
                  </h4>
                  <button 
                    onClick={() => setSelectedClient(null)} 
                    className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
                  >
                    Dismiss [X]
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Plan Branding Description</label>
                    <input
                      type="text"
                      className="w-full bg-[#110926] border border-[#2d1c5a] rounded-lg px-3 py-1.5 text-xs text-white"
                      value={editPlanName}
                      onChange={(e) => setEditPlanName(e.target.value)}
                      placeholder="e.g. Ultra VPS Kernel Extreme"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Preset Tiers</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {['Elite Shared Vibe', 'AI Premium Cloud', 'VPS Pro Kernel', 'Developer Playground v3'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setEditPlanName(preset)}
                          className="px-2.5 py-1 rounded bg-[#20133f] hover:bg-brand-purple text-[9px] font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedClient(null)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#3b2772] text-[10px] text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSavePlanUpdate(selectedClient.id)}
                    className="px-4 py-1.5 bg-brand-purple hover:bg-indigo-600 rounded-lg text-[10px] font-bold text-white cursor-pointer"
                  >
                    Commit Configuration Change
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#231548] pt-4 text-[10.5px] text-slate-400 font-mono text-left">
            <span>Total Simulated database storage index is fully synchronized live with client components.</span>
          </div>
        </div>

        {/* Right pane: Core Network Toggles & Security Audit logs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Security controls card */}
          <div className="bg-[#120a22] border border-[#211444] rounded-3xl p-6 space-y-5 text-left">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Shield className="w-4.5 h-4.5 text-indigo-400" />
                DDoS & Single-Sign-On Controls
              </h3>
              <p className="text-[10px] text-slate-400">Dynamically scale back-end protection parameters in real time</p>
            </div>

            <div className="space-y-3.5 pt-2">
              
              <div className="flex items-center justify-between bg-[#190f33] p-3 rounded-xl border border-[#2d1c5a]/60">
                <div className="space-y-0.5 max-w-[70%]">
                  <p className="text-xs font-bold text-white">Google SSO Authentication</p>
                  <p className="text-[9px] text-slate-400">Compel OAuth verified tokens on customer portal logins</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !googleSsoEnforced;
                    setGoogleSsoEnforced(nextVal);
                    addLog(`Google OAuth Secure Single-Sign-On requirement: ${nextVal ? 'ENFORCED' : 'OPTIONAL'}`);
                  }}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${googleSsoEnforced ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${googleSsoEnforced ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between bg-[#190f33] p-3 rounded-xl border border-[#2d1c5a]/60">
                <div className="space-y-0.5 max-w-[70%]">
                  <p className="text-xs font-bold text-white">Enterprise DDoS Floodwall</p>
                  <p className="text-[9px] text-slate-400">Trigger active rate filters to trap malicious DNS crawler hits</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !ddosWall;
                    setDdosWall(nextVal);
                    addLog(`Enterprise DDoS Floodwall Protection shield initialized: ${nextVal ? 'ACTIVE' : 'STANDBY'}`);
                  }}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${ddosWall ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${ddosWall ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="bg-[#190f33] p-3 rounded-xl border border-[#2d1c5a]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white">Automated Snapshots Archive</p>
                  <span className="text-[10px] uppercase font-mono font-bold text-indigo-400">{backupSystem.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1.5">
                  {(['hourly', 'daily', 'weekly'] as const).map((cycle) => (
                    <button
                      key={cycle}
                      type="button"
                      onClick={() => {
                        setBackupSystem(cycle);
                        addLog(`Automated core database snapshot timing altered to: ${cycle.toUpperCase()}`);
                      }}
                      className={`py-1 rounded text-[9px] font-mono font-bold uppercase transition-all tracking-wider ${
                        backupSystem === cycle 
                          ? 'bg-brand-purple text-white shadow' 
                          : 'bg-[#120a22] text-slate-400 hover:text-slate-200 border border-[#2d1c5a]/40'
                      }`}
                    >
                      {cycle}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Audit Logs terminal client */}
          <div className="bg-[#0f071e] border border-[#231548] rounded-3xl p-5 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-400" />
                Live Audit Logs (A to Z Trace)
              </h3>
              <button 
                onClick={() => setSystemLogs([])} 
                className="text-[9px] font-mono text-slate-500 hover:text-slate-350 cursor-pointer"
              >
                Clear output
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto font-mono text-[9.5px] leading-relaxed text-slate-300 pr-1 select-none">
              {systemLogs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-indigo-400 shrink-0">&raquo;</span>
                  <span>{log}</span>
                </div>
              ))}
              {systemLogs.length === 0 && (
                <p className="text-slate-500 p-2 italic">Standard terminal output is fully cleared.</p>
              )}
            </div>

            <form onSubmit={handleAddLiveLog} className="flex gap-1.5 border-t border-[#231548] pt-3">
              <input
                type="text"
                value={newLogText}
                onChange={(e) => setNewLogText(e.target.value)}
                placeholder="Simulate action command..."
                className="flex-grow bg-[#150a29] text-[10px] text-slate-200 px-3 py-1.5 border border-[#2b1749] rounded-lg focus:outline-none focus:border-brand-purple"
              />
              <button
                type="submit"
                className="bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white px-3 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
              >
                Log Info
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Shield, Activity, Database, Lock, Settings, 
  AlertCircle, CheckCircle, RefreshCw, Search, Power, Terminal, 
  Globe, DollarSign, Check, Cpu, Trash2, Edit3, ArrowRight, Sparkles,
  Plus, Tag, Percent, RefreshCcw
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'active' | 'suspended';
  domain: string;
  cpuUsed: number;
  vibeCredits: number;
}

interface CouponOffer {
  code: string;
  discount: number; // e.g. 10 for 10%
  description: string;
}

interface PriceRate {
  '1month': number;
  '6months': number;
  '12months': number;
  '24months': number;
  '48months': number;
}

interface PlanRate {
  id: string;
  name: string;
  desc: string;
  percentageOff: string;
  regPrice: {
    usd: number;
    inr: number;
  };
  notes: {
    usd: string;
    inr: string;
  };
  features: string[];
  prices: {
    usd: PriceRate;
    inr: PriceRate;
  };
  popular: boolean;
}

export default function AdminView({ setActivePage }: { setActivePage: (page: string) => void }) {
  // Active Admin Sub-Tab
  const [activeTab, setActiveTab] = useState<'users' | 'offers' | 'rates' | 'system'>('users');

  // System configurations & live controls
  const [ddosWall, setDdosWall] = useState<boolean>(true);
  const [backupSystem, setBackupSystem] = useState<'hourly' | 'daily' | 'weekly'>('daily');
  const [googleSsoEnforced, setGoogleSsoEnforced] = useState<boolean>(true);
  
  // Clients state with synchronous local storage initializer
  const [clients, setClients] = useState<Client[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vibe_customers');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [
      { id: 'usr-101', name: 'Raj Sahani', email: 'rajsahani.RgcS@gmail.com', plan: 'AI Premium Cloud', status: 'active', domain: 'rajsahani.in', cpuUsed: 12, vibeCredits: 10 },
      { id: 'usr-102', name: 'Gaurav Kumar', email: 'gaurav.k@enterprise.org', plan: 'VPS Pro Kernel', status: 'active', domain: 'gauravai.com', cpuUsed: 44, vibeCredits: 10 },
      { id: 'usr-103', name: 'Abhishek Roy', email: 'abhishek.roy@outlook.com', plan: 'Elite Shared Vibe', status: 'suspended', domain: 'roycloud.ai', cpuUsed: 0, vibeCredits: 5 },
      { id: 'usr-104', name: 'Vibe Developer', email: 'developer.cloudvibe@gmail.com', plan: 'Developer Playground v3', status: 'active', domain: 'vibe-dev.net', cpuUsed: 8, vibeCredits: 15 },
    ];
  });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Add Customer Form Modal state
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustDomain, setNewCustDomain] = useState('');
  const [newCustPlan, setNewCustPlan] = useState('AI Premium Cloud');
  const [newCustCredits, setNewCustCredits] = useState(10);

  // Edit Customer Form state (when selectedClient !== null)
  const [editCustName, setEditCustName] = useState('');
  const [editCustEmail, setEditCustEmail] = useState('');
  const [editCustDomain, setEditCustDomain] = useState('');
  const [editCustPlan, setEditCustPlan] = useState('');
  const [editCustCredits, setEditCustCredits] = useState(10);
  const [editCustStatus, setEditCustStatus] = useState<'active' | 'suspended'>('active');

  // Coupon Offers state with synchronous local storage initializer
  const [coupons, setCoupons] = useState<CouponOffer[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vibe_coupons_offers');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [
      { code: 'sasta10', discount: 10, description: '10% Extra Sasta Discount coupon' },
      { code: 'hostinger10', discount: 10, description: '10% Hostinger challenger coup' },
      { code: 'rajsahani', discount: 10, description: 'Special creator authority discount' }
    ];
  });
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [editingCoupon, setEditingCoupon] = useState<CouponOffer | null>(null);

  // Plan Rates state with synchronous local storage initializer
  const [plansList, setPlansList] = useState<PlanRate[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vibe_plans_rates_v2');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [
      {
        id: 'single',
        name: 'Single',
        desc: 'Unmatched entry-level WordPress performance',
        percentageOff: '88% off',
        regPrice: { usd: 3.49, inr: 279 },
        notes: {
          usd: 'Get 48 months for $26.40 (regular price $167.52). Renews at $4.19/mo.',
          inr: 'Get 48 months for ₹2,304 (regular price ₹13,392). Renews at ₹199/mo.'
        },
        features: [
          'Create 1 website',
          '5 vibe coding credits',
          '10 GB of storage for your files (SSD)',
          '1 mailbox per website - free for 1 year',
          'WordPress sites maintained for you',
          'Drag-and-drop website builder',
          'Keep every site safe with free SSL',
          'Weekly auto backups for easy data recovery',
          'Migrate your site for free and with no downtime'
        ],
        prices: {
          usd: { '1month': 3.49, '6months': 2.44, '12months': 1.74, '24months': 1.04, '48months': 0.55 },
          inr: { '1month': 279, '6months': 209, '12months': 139, '24months': 90, '48months': 48 }
        },
        popular: false
      },
      {
        id: 'premium',
        name: 'Premium',
        desc: 'Most popular customer-ready environment',
        percentageOff: '82% off',
        regPrice: { usd: 4.89, inr: 419 },
        notes: {
          usd: 'Get 48 months for $49.92 (regular price $234.72). Renews at $6.29/mo.',
          inr: 'Get 48 months for ₹4,992 (regular price ₹20,112). Renews at ₹314/mo.'
        },
        features: [
          'Create up to 3 websites',
          '5 vibe coding credits',
          '20 GB of storage for your files (SSD)',
          '2 mailboxes per website - free for 1 year',
          'All the benefits of Single, plus:',
          'Free domain for 1 year',
          'Free Email marketing for 1 year'
        ],
        prices: {
          usd: { '1month': 4.89, '6months': 3.49, '12months': 2.44, '24months': 1.74, '48months': 1.04 },
          inr: { '1month': 419, '6months': 314, '12months': 209, '24months': 139, '48months': 104 }
        },
        popular: true
      },
      {
        id: 'business',
        name: 'Business',
        desc: 'Power and high concurrency for stores',
        percentageOff: '75% off',
        regPrice: { usd: 6.99, inr: 489 },
        notes: {
          usd: 'Get 48 months for $83.52 (regular price $335.52). Renews at $9.09/mo.',
          inr: 'Get 48 months for ₹8,352 (regular price ₹23,472). Renews at ₹454/mo.'
        },
        features: [
          'Create up to 50 websites',
          '5 vibe coding credits',
          '50 GB of world’s fastest NVMe storage',
          '5 mailboxes per website - free for 1 year',
          'Everything in Premium, plus:',
          '5 Managed Node.js web apps NEW',
          'Daily and on-demand backups to prevent any data loss',
          'Build an ecommerce site with AI',
          'AI Agent for WordPress FREE',
          'Create ready-to-go WordPress sites in minutes with AI',
          'Enjoy maximum website speed with free CDN',
          'Manage sites easier with WordPress Multisite'
        ],
        prices: {
          usd: { '1month': 6.99, '6months': 5.24, '12months': 3.84, '24months': 2.79, '48months': 1.74 },
          inr: { '1month': 489, '6months': 384, '12months': 314, '24months': 244, '48months': 174 }
        },
        popular: false
      },
      {
        id: 'vps',
        name: 'VPS Cyber Nodes',
        desc: 'Isolated Virtual Private Server with full root SSH configuration.',
        percentageOff: '65% off',
        regPrice: { usd: 17.49, inr: 1049 },
        notes: {
          usd: 'Includes Dedicated IP and blazing SSD speeds with KVM isolated hypervisors.',
          inr: 'KVM virtualized resource stack with fully redundant backup nodes, dedicated CPU slices.'
        },
        features: [
          '1 Dedicated IP Allocation',
          '8 GB Ram Buffer Nodes',
          '100 GB Gen-4 NVMe Enterprise Raid Arrays',
          'Root SSH system credentials with secure firewall parameters',
          'DDoS mitigation active globally'
        ],
        prices: {
          usd: { '1month': 13.99, '6months': 10.49, '12months': 6.99, '24months': 5.59, '48months': 3.49 },
          inr: { '1month': 1049, '6months': 839, '12months': 699, '24months': 559, '48months': 279 }
        },
        popular: false
      }
    ];
  });
  const [selectedPlanToEdit, setSelectedPlanToEdit] = useState<PlanRate | null>(null);

  // System Logs Trace list
  const [systemLogs, setSystemLogs] = useState<string[]>([
    'hPanel Admin system initialized successfully',
    'Root authority connection established securely',
    'Local storage synchronize handlers mounted online',
  ]);
  const [newLogText, setNewLogText] = useState('');

  // Initial Load & Writeback effect from LocalStorage (Does not call any setState synchronously)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('vibe_customers')) {
        localStorage.setItem('vibe_customers', JSON.stringify(clients));
      }
      if (!localStorage.getItem('vibe_coupons_offers')) {
        localStorage.setItem('vibe_coupons_offers', JSON.stringify(coupons));
      }
      if (!localStorage.getItem('vibe_plans_rates_v2')) {
        localStorage.setItem('vibe_plans_rates_v2', JSON.stringify(plansList));
      }
    }
  }, []);

  const saveClientsToLocal = (newClientsList: Client[]) => {
    setClients(newClientsList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibe_customers', JSON.stringify(newClientsList));
      // Trigger a local storage changes update event so all views update
      window.dispatchEvent(new Event('storage'));
    }
  };

  const saveCouponsToLocal = (newCouponsList: CouponOffer[]) => {
    setCoupons(newCouponsList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibe_coupons_offers', JSON.stringify(newCouponsList));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const savePlansToLocal = (newPlansList: PlanRate[]) => {
    setPlansList(newPlansList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibe_plans_rates_v2', JSON.stringify(newPlansList));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSystemLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  // ----- CUSTOMER MANAGEMENT ACTIONS -----
  const handleAddNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustEmail.trim()) {
      alert("Please fill name and email fields.");
      return;
    }

    const newId = `usr-${101 + clients.length}`;
    const newClientObj: Client = {
      id: newId,
      name: newCustName.trim(),
      email: newCustEmail.trim(),
      domain: newCustDomain.trim() || `${newCustName.toLowerCase().replace(/\s+/g, '')}.com`,
      plan: newCustPlan,
      status: 'active',
      cpuUsed: Math.floor(Math.random() * 25) + 3,
      vibeCredits: Number(newCustCredits) || 10
    };

    const updatedList = [...clients, newClientObj];
    saveClientsToLocal(updatedList);
    addLog(`➕ Created new customer: ${newClientObj.name} (${newClientObj.email}) with ${newClientObj.vibeCredits} credits.`);
    
    // Reset fields
    setNewCustName('');
    setNewCustEmail('');
    setNewCustDomain('');
    setNewCustCredits(10);
    setShowAddCustomer(false);
  };

  const handleEditCustomerClick = (client: Client) => {
    setSelectedClient(client);
    setEditCustName(client.name);
    setEditCustEmail(client.email);
    setEditCustDomain(client.domain);
    setEditCustPlan(client.plan);
    setEditCustCredits(client.vibeCredits);
    setEditCustStatus(client.status);
  };

  const handleSaveCustomerChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    const updatedList: Client[] = clients.map(c => {
      if (c.id === selectedClient.id) {
        addLog(`📝 Updated customer profile parameters for ${editCustName}`);
        return {
          ...c,
          name: editCustName.trim(),
          email: editCustEmail.trim(),
          domain: editCustDomain.trim(),
          plan: editCustPlan,
          vibeCredits: Number(editCustCredits) || 0,
          status: editCustStatus
        };
      }
      return c;
    });

    saveClientsToLocal(updatedList);
    setSelectedClient(null);
  };

  const handleToggleStatus = (clientId: string) => {
    const updatedList: Client[] = clients.map(c => {
      if (c.id === clientId) {
        const nextStatus: 'active' | 'suspended' = c.status === 'active' ? 'suspended' : 'active';
        addLog(`🛡️ Switched customer status for ${c.name} (${c.id}) to ${nextStatus.toUpperCase()}`);
        return { ...c, status: nextStatus };
      }
      return c;
    });
    saveClientsToLocal(updatedList);
  };

  const handleDeleteClient = (clientId: string, clientName: string) => {
    if (confirm(`Are you sure you want to delete customer account: ${clientName}? This action is irreversible.`)) {
      const updatedList = clients.filter(c => c.id !== clientId);
      saveClientsToLocal(updatedList);
      addLog(`❌ Deleted customer profile: ${clientName} (${clientId})`);
      if (selectedClient?.id === clientId) {
        setSelectedClient(null);
      }
    }
  };

  // ----- COUPON OFFERS MANAGEMENT ACTIONS -----
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponDiscount) {
      alert("Please fill code and specified percentage discount details.");
      return;
    }

    const codeClean = newCouponCode.trim().toLowerCase();
    
    // Check duplicate
    if (coupons.some(c => c.code.toLowerCase() === codeClean)) {
      alert(`Coupon code "${newCouponCode.trim()}" already exists!`);
      return;
    }

    const newCoupon: CouponOffer = {
      code: codeClean,
      discount: Number(newCouponDiscount),
      description: newCouponDesc.trim() || `${newCouponDiscount}% Discount Voucher`
    };

    const updatedList = [...coupons, newCoupon];
    saveCouponsToLocal(updatedList);
    addLog(`🏷️ Added promotional offer voucher: ${newCouponCode.trim().toUpperCase()} (${newCouponDiscount}% Off)`);

    // Reset
    setNewCouponCode('');
    setNewCouponDiscount(10);
    setNewCouponDesc('');
  };

  const handleDeleteCoupon = (code: string) => {
    if (confirm(`Delete promo coupon code "${code.toUpperCase()}"?`)) {
      const updatedList = coupons.filter(c => c.code !== code);
      saveCouponsToLocal(updatedList);
      addLog(`❌ Expired and removed promo code coupon: ${code.toUpperCase()}`);
    }
  };

  // ----- PLAN RATES AND FEATURES PARAMETERS ACTIONS -----
  const handleSavePlanRates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanToEdit) return;

    const updatedList = plansList.map(p => {
      if (p.id === selectedPlanToEdit.id) {
        addLog(`⚡ Updated pricing rates & specifications for ${p.name} plan`);
        return selectedPlanToEdit;
      }
      return p;
    });

    savePlansToLocal(updatedList);
    setSelectedPlanToEdit(null);
  };

  const handleUpdatePriceField = (period: keyof PriceRate, value: string, currency: 'inr' | 'usd') => {
    if (!selectedPlanToEdit) return;
    const numericVal = parseFloat(value) || 0;

    setSelectedPlanToEdit({
      ...selectedPlanToEdit,
      prices: {
        ...selectedPlanToEdit.prices,
        [currency]: {
          ...selectedPlanToEdit.prices[currency],
          [period]: numericVal
        }
      }
    });
  };

  const handleAddPlanFeature = (featText: string) => {
    if (!selectedPlanToEdit || !featText.trim()) return;
    setSelectedPlanToEdit({
      ...selectedPlanToEdit,
      features: [...selectedPlanToEdit.features, featText.trim()]
    });
  };

  const handleRemovePlanFeature = (index: number) => {
    if (!selectedPlanToEdit) return;
    const filteredFeatures = selectedPlanToEdit.features.filter((_, i) => i !== index);
    setSelectedPlanToEdit({
      ...selectedPlanToEdit,
      features: filteredFeatures
    });
  };

  // System Live Log manual simulation
  const handleAddLiveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim()) return;
    addLog(newLogText.trim());
    setNewLogText('');
  };

  const filteredClientsList = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="admin-view" className="bg-[#0b0518] text-slate-100 min-h-screen pb-24 antialiased font-sans">
      
      {/* 1. Header Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#120a2a] via-[#1b103e] to-[#0a0517] border-b border-[#25154f] py-12 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-brand-purple/20 border border-brand-purple/40 rounded-full px-3.5 py-1 text-[10px] sm:text-xs text-purple-300 tracking-widest font-mono uppercase font-black">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              GLOBAL hPanel ADMIN ROOT AUTHORITY
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight leading-none">
              Super AI Site Builder Dashboard Center
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Instantly adjust pricing plans, customize active coupon offers, and authorize client credentials globally.
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

      {/* 2. Admin Sub-Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#231548] pb-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold font-mono tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'users' 
                ? 'bg-[#1e1140] text-indigo-300 border-b-2 border-brand-purple' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👥 Customer List ({clients.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold font-mono tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'offers' 
                ? 'bg-[#1e1140] text-indigo-300 border-b-2 border-brand-purple' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>🏷️ Coupon Codes &amp; Offers</span>
          </button>
          
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold font-mono tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'rates' 
                ? 'bg-[#1e1140] text-indigo-300 border-b-2 border-brand-purple' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>⚙️ Pricing Rates &amp; Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold font-mono tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'system' 
                ? 'bg-[#1e1140] text-indigo-300 border-b-2 border-brand-purple' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>🛡️ Global Firewall &amp; Logs</span>
          </button>
        </div>
      </div>

      {/* 3. Main Operational Content Viewport */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* TAB 1: USER / CUSTOMER MANAGEMENT PANEL */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Customers list and search index */}
            <div className="lg:col-span-8 bg-[#120a22] border border-[#211444] rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 text-left">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-400" />
                      Client &amp; Enterprise Member Base
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Edit attributes, allocate vibe credits, and customize pointings instantly.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Add Customer button */}
                    <button
                      onClick={() => setShowAddCustomer(true)}
                      className="bg-brand-purple hover:bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Customer</span>
                    </button>

                    {/* Quick Search */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users/domains..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#1b1034] text-xs text-slate-200 pl-8 pr-4 py-2 border border-[#2d1c5a] rounded-xl focus:outline-none focus:border-brand-purple min-w-[150px] sm:min-w-[180px]"
                      />
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Table implementation */}
                <div className="overflow-x-auto rounded-xl border border-[#231548]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#180e30] text-slate-400 font-mono tracking-wider border-b border-[#231548]">
                        <th className="p-3.5 font-black uppercase text-[10px]">Customer / ID</th>
                        <th className="p-3.5 font-black uppercase text-[10px]">Email</th>
                        <th className="p-3.5 font-black uppercase text-[10px]">Domain Linked</th>
                        <th className="p-3.5 font-black uppercase text-[10px]">Tier Plan</th>
                        <th className="p-3.5 font-black uppercase text-[10px]">Vibe Balance</th>
                        <th className="p-3.5 font-black uppercase text-[10px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#231548] font-medium text-slate-200">
                      {filteredClientsList.map((client) => (
                        <tr 
                          key={client.id}
                          className={`hover:bg-white/5 transition-colors ${client.status === 'suspended' ? 'bg-rose-950/15' : ''}`}
                        >
                          <td className="p-3.5 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-white font-bold">{client.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">({client.id})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {client.status === 'active' ? (
                                <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-400 font-mono font-bold uppercase tracking-wider border border-emerald-500/20">
                                  Online
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded text-[8px] bg-rose-500/10 text-rose-400 font-mono font-bold uppercase tracking-wider border border-rose-500/20">
                                  Disabled
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500 font-mono">
                                Core load: {client.cpuUsed}%
                              </span>
                            </div>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-300">{client.email}</td>
                          <td className="p-3.5 font-mono text-indigo-400">{client.domain}</td>
                          <td className="p-3.5 text-indigo-300 font-semibold">{client.plan}</td>
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-center bg-purple-950/40 text-purple-300 px-2.5 py-0.5 rounded border border-purple-900/40 text-[11px]">
                              ⚡ {client.vibeCredits} Cr
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleEditCustomerClick(client)}
                              className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-[10px] px-2.5 py-1.5 rounded-lg transition-colors font-bold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Modifier</span>
                            </button>
                            <button
                              onClick={() => handleToggleStatus(client.id)}
                              className={`text-[10px] px-2.5 py-1.5 rounded-lg transition-colors font-bold cursor-pointer inline-flex items-center gap-1 ${
                                client.status === 'active' 
                                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300' 
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300'
                              }`}
                            >
                              <Power className="w-3.5 h-3.5" />
                              <span>{client.status === 'active' ? 'Disable' : 'Enable'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.id, client.name)}
                              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 hover:text-rose-400 text-[10px] px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Delete Client Account Profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredClientsList.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-10 text-center text-slate-400 font-mono">
                            ✕ No customers matched the active filter query parameters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-[10.5px] text-slate-500 italic mt-4">
                ℹ️ Synchronized globally: any credits or plan shifts configured below are immediately active inside hPanel upon customer logins.
              </p>
            </div>

            {/* sidebar configurations pane: Add / Edit clients */}
            <div className="lg:col-span-4 text-left space-y-6">
              
              {/* Add Customer Modal Overlay in sidebar */}
              {showAddCustomer && (
                <div className="bg-[#190f33] border-2 border-brand-purple/50 rounded-3xl p-6 space-y-4 shadow-xl animate-fade-in">
                  <div className="flex items-center justify-between border-b border-[#2d1c5a] pb-3">
                    <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-brand-purple" />
                      Add New Customer Node
                    </h4>
                    <button 
                      onClick={() => setShowAddCustomer(false)} 
                      className="text-slate-400 hover:text-white font-mono text-[11px] cursor-pointer"
                    >
                      [X] Dismiss
                    </button>
                  </div>

                  <form onSubmit={handleAddNewCustomer} className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-slate-400">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        placeholder="e.g. Gaurav Kumar"
                        className="w-full bg-[#110926] border border-[#2d1c5a] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-purple font-semibold"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-slate-400">Email Destination</label>
                      <input 
                        type="email" 
                        required 
                        value={newCustEmail}
                        onChange={(e) => setNewCustEmail(e.target.value)}
                        placeholder="e.g. customer@gmail.com"
                        className="w-full bg-[#110926] border border-[#2d1c5a] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-purple font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-slate-400">Main pointed custom domain</label>
                      <input 
                        type="text" 
                        value={newCustDomain}
                        onChange={(e) => setNewCustDomain(e.target.value)}
                        placeholder="e.g. gauravdev.in"
                        className="w-full bg-[#110926] border border-[#2d1c5a] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-purple font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono font-bold text-slate-400">allocated plan</label>
                        <select
                          value={newCustPlan}
                          onChange={(e) => setNewCustPlan(e.target.value)}
                          className="w-full bg-[#110926] border border-[#2d1c5a] rounded-xl px-2 py-2 text-slate-200 focus:outline-none focus:border-brand-purple"
                        >
                          <option value="Single">Single</option>
                          <option value="Premium">Premium</option>
                          <option value="Business">Business</option>
                          <option value="AI Premium Cloud">AI Premium Cloud</option>
                          <option value="VPS Pro Kernel">VPS Pro Kernel</option>
                          <option value="Elite Shared Vibe">Elite Shared Vibe</option>
                          <option value="Developer Playground v3">Developer Playground v3</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono font-bold text-slate-400">Vibe credits</label>
                        <input 
                          type="number" 
                          min={0}
                          max={500}
                          value={newCustCredits}
                          onChange={(e) => setNewCustCredits(Number(e.target.value))}
                          className="w-full bg-[#110926] border border-[#2d1c5a] rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-purple font-semibold font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddCustomer(false)}
                        className="w-1/2 border border-[#3c2578] text-slate-300 py-2 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 bg-brand-purple text-white py-2 rounded-xl font-bold font-mono tracking-wider"
                      >
                        Add Node
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Edit Selected Customer Pane */}
              {selectedClient ? (
                <div className="bg-[#120a22] border border-indigo-500/40 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2d1c5a] pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Edit3 className="w-4 h-4 text-indigo-400" />
                      Modifier Node: {selectedClient.id}
                    </h3>
                    <button 
                      onClick={() => setSelectedClient(null)}
                      className="text-slate-400 hover:text-white font-mono text-[11px] cursor-pointer"
                    >
                      [Dismiss]
                    </button>
                  </div>

                  <form onSubmit={handleSaveCustomerChanges} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase font-mono font-bold text-slate-400">Customer Display Name</label>
                      <input 
                        type="text" 
                        required 
                        value={editCustName}
                        onChange={(e) => setEditCustName(e.target.value)}
                        className="w-full bg-[#190f33] border border-[#2d1c5a] rounded-xl px-3 py-2 text-white font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase font-mono font-bold text-slate-400">Email Sync</label>
                      <input 
                        type="email" 
                        required 
                        value={editCustEmail}
                        onChange={(e) => setEditCustEmail(e.target.value)}
                        className="w-full bg-[#190f33] border border-[#2d1c5a] rounded-xl px-3 py-2 text-white font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase font-mono font-bold text-slate-400">Assigned pointed domain</label>
                      <input 
                        type="text" 
                        required 
                        value={editCustDomain}
                        onChange={(e) => setEditCustDomain(e.target.value)}
                        className="w-full bg-[#190f33] border border-[#2d1c5a] rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10.5px] uppercase font-mono font-bold text-slate-400">Current active plan</label>
                        <select
                          value={editCustPlan}
                          onChange={(e) => setEditCustPlan(e.target.value)}
                          className="w-full bg-[#190f33] border border-[#2d1c5a] rounded-xl px-2 py-2 text-white"
                        >
                          <option value="Single">Single</option>
                          <option value="Premium">Premium</option>
                          <option value="Business">Business</option>
                          <option value="AI Premium Cloud">AI Premium Cloud</option>
                          <option value="VPS Pro Kernel">VPS Pro Kernel</option>
                          <option value="Elite Shared Vibe">Elite Shared Vibe</option>
                          <option value="Developer Playground v3">Developer Playground v3</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10.5px] uppercase font-mono font-bold text-slate-400">Vibe Coding Balance</label>
                        <input 
                          type="number" 
                          min={0}
                          value={editCustCredits}
                          onChange={(e) => setEditCustCredits(Number(e.target.value))}
                          className="w-full bg-[#190f33] border border-[#2d1c5a] rounded-xl px-3 py-2 text-white font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase font-mono font-bold text-slate-400">Account status</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditCustStatus('active')}
                          className={`w-1/2 py-2 rounded-xl text-xs font-bold transition-all ${
                            editCustStatus === 'active' 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-[#190f33] text-slate-400 border border-[#2d1c5a]'
                          }`}
                        >
                          Active
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditCustStatus('suspended')}
                          className={`w-1/2 py-2 rounded-xl text-xs font-bold transition-all ${
                            editCustStatus === 'suspended' 
                              ? 'bg-rose-600 text-white' 
                              : 'bg-[#190f33] text-slate-400 border border-[#2d1c5a]'
                          }`}
                        >
                          Suspended
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedClient(null)}
                        className="px-4 py-2 bg-[#20133f] text-slate-300 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-brand-purple text-white hover:bg-indigo-600 rounded-xl font-bold"
                      >
                        Save Shifts
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-[#120a22]/50 border border-[#211444] rounded-3xl p-6 text-center text-slate-400 space-y-2">
                  <Cpu className="w-10 h-10 text-brand-purple/40 mx-auto" />
                  <h4 className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold"> hPanel Smart Controller </h4>
                  <p className="text-[11px] text-slate-500"> Select any client from the registry list to alter pointed domains, upgrade database profiles, or modify performance parameters instantly. </p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: PROMOTIONAL OFFERS & COUPONS */}
        {activeTab === 'offers' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
            
            {/* Create Coupon Card */}
            <div className="md:col-span-5 bg-[#120a22] border border-[#211444] rounded-3xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-indigo-400" />
                  Issue New Coupon Code
                </h3>
                <p className="text-[11px] text-slate-400">Configure promotional vouchers to deduct plan prices during checkout instantly</p>
              </div>

              <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-400">Promo Code String (Caps Auto)</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. DISCOUNT50"
                    className="w-full bg-[#190f33] border border-[#2d1c5a] rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-400">percentage deduction amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={1}
                      max={99}
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                      className="w-full bg-[#190f33] border border-[#2d1c5a] rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-brand-purple"
                    />
                    <span className="absolute right-3.5 top-2 text-[#ccc] font-bold font-mono">% OFF</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-400">Voucher branding description</label>
                  <input
                    type="text"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    placeholder="e.g. 10% Extra Creator Coupon Code"
                    className="w-full bg-[#190f33] border border-[#2d1c5a] rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-purple hover:bg-brand-purple/95 py-2.5 rounded-xl font-bold font-mono tracking-wider text-xs shadow-lg transition-transform active:scale-98"
                >
                  🚀 Activate Promo Offer Code
                </button>
              </form>
            </div>

            {/* Active Coupons Registry */}
            <div className="md:col-span-7 bg-[#120a22] border border-[#211444] rounded-3xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Active Super AI Site Builder Promotional Registry ({coupons.length})
                </h3>
                <p className="text-[11px] text-slate-400">These coupon codes are live and verified. Customers can enter them at checkout for immediate discounts.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coupons.map((c, index) => (
                  <div 
                    key={index}
                    className="bg-[#190f33] border border-[#2d1c5a] rounded-2xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden"
                  >
                    <div className="absolute right-[-14px] bottom-[-14px] opacity-5 text-indigo-400 text-6xl font-black font-mono select-none">
                      %
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-brand-purple/20 text-indigo-300 font-mono font-extrabold text-[12px] px-3 py-1 rounded-lg border border-brand-purple/40">
                          {c.code.toUpperCase()}
                        </span>
                        <p className="text-[9.5px] text-slate-400 font-mono mt-1 leading-normal">{c.description}</p>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-black px-2 py-0.5 rounded">
                        -{c.discount}%
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#2d1c5a]/40 flex justify-end">
                      <button
                        onClick={() => handleDeleteCoupon(c.code)}
                        className="text-[10px] text-rose-400 hover:text-rose-300 bg-rose-950/20 px-2.5 py-1 rounded-lg hover:bg-rose-950/40 transition-colors font-bold cursor-pointer"
                      >
                        Deactivate [X]
                      </button>
                    </div>
                  </div>
                ))}
                {coupons.length === 0 && (
                  <p className="text-slate-500 col-span-2 text-center py-10 font-mono text-xs">✕ No active promo coupon codes loaded.</p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PLAN RATES AND PRICE SPECIFICATIONS */}
        {activeTab === 'rates' && (
          <div className="space-y-6 text-left">
            <div className="bg-[#120a22] border border-[#211444] rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    <Percent className="w-5 h-5 text-indigo-450" />
                    Super AI Site Builder Subscription Packages Pricing &amp; Rates Manager
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Edit monthly pricing curves, feature lists, and descriptions live globally.</p>
                </div>
                <div className="text-[10px] bg-emerald-500/20 text-emerald-350 px-3 py-1.5 rounded font-mono font-bold uppercase tracking-wider animate-pulse border border-emerald-500/20 select-none">
                  Instant Update Active
                </div>
              </div>

              {/* Editor panel overlay */}
              {selectedPlanToEdit && (
                <div className="bg-[#180e30] border-2 border-brand-purple rounded-2xl p-5 md:p-6 space-y-4 animate-fade-in my-6">
                  <div className="flex justify-between items-center border-b border-[#2d1c5a]/65 pb-3">
                    <span className="font-mono text-white text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-purple" />
                      Dynamic Rate Editor: &quot;{selectedPlanToEdit.name}&quot; Plan
                    </span>
                    <button 
                      onClick={() => setSelectedPlanToEdit(null)}
                      className="text-slate-400 hover:text-white font-mono text-[11px]"
                    >
                      [Minimize editor X]
                    </button>
                  </div>

                  <form onSubmit={handleSavePlanRates} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Name and desc */}
                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono font-bold text-slate-350">Plan Display Name</label>
                          <input
                            type="text"
                            required
                            value={selectedPlanToEdit.name}
                            onChange={(e) => setSelectedPlanToEdit({ ...selectedPlanToEdit, name: e.target.value })}
                            className="w-full bg-[#110926] border border-[#2d1c5a] rounded-xl px-3 py-2 text-white font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono font-bold text-slate-350">Marketing tagline description</label>
                          <input
                            type="text"
                            required
                            value={selectedPlanToEdit.desc}
                            onChange={(e) => setSelectedPlanToEdit({ ...selectedPlanToEdit, desc: e.target.value })}
                            className="w-full bg-[#110926] border border-[#2d1c5a] rounded-xl px-3 py-2 text-white font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-mono font-bold text-slate-350">Save percentage string</label>
                            <input
                              type="text"
                              value={selectedPlanToEdit.percentageOff}
                              onChange={(e) => setSelectedPlanToEdit({ ...selectedPlanToEdit, percentageOff: e.target.value })}
                              className="w-full bg-[#110926] border border-[#2d1c5a] rounded-xl px-3 py-2 text-white font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-mono font-bold text-slate-350">Card layout highlight</label>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedPlanToEdit({ ...selectedPlanToEdit, popular: true })}
                                className={`w-1/2 py-2 rounded-xl text-[10px] font-bold ${selectedPlanToEdit.popular ? 'bg-brand-purple text-white' : 'bg-[#110926] text-slate-400'}`}
                              >
                                Popular
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedPlanToEdit({ ...selectedPlanToEdit, popular: false })}
                                className={`w-1/2 py-2 rounded-xl text-[10px] font-bold ${!selectedPlanToEdit.popular ? 'bg-brand-purple text-white' : 'bg-[#110926] text-slate-400'}`}
                              >
                                Standard
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Features Editor */}
                        <div className="space-y-2 pt-2 border-t border-[#2d1c5a]/40">
                          <label className="text-[10px] uppercase font-mono font-bold text-slate-350 block">Features index (Hostinger-Challenging features)</label>
                          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                            {selectedPlanToEdit.features.map((feat, fidx) => (
                              <div key={fidx} className="flex items-center justify-between bg-[#110926] p-2 rounded-lg border border-[#2d1c5a]/40 text-[10.5px]">
                                <span className="font-semibold text-slate-300">{feat}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePlanFeature(fidx)}
                                  className="text-rose-450 hover:text-rose-400 font-bold px-1 text-[10px]"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex gap-1.5 mt-2">
                            <input
                              type="text"
                              id="new-feat-input"
                              placeholder="Add feature, e.g. Unlimited Free SSL wildcard"
                              className="flex-grow bg-[#110926] border border-[#2d1c5a] rounded-lg px-2.5 py-1.5 text-xs text-white"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const text = (e.currentTarget as HTMLInputElement).value;
                                  handleAddPlanFeature(text);
                                  (e.currentTarget as HTMLInputElement).value = '';
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const el = document.getElementById('new-feat-input') as HTMLInputElement;
                                if (el) {
                                  handleAddPlanFeature(el.value);
                                  el.value = '';
                                }
                              }}
                              className="bg-brand-purple px-3.5 rounded-lg text-white font-bold"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Currency and Billing cycle matrix rates */}
                      <div className="space-y-4">
                        <div className="bg-[#110926] p-4 rounded-xl border border-[#2d1c5a] space-y-3">
                          <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 block border-b border-[#2d1c5a] pb-1.5">Indian Rupee (INR ₹ / Month) Rates</span>
                          <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                            <div className="space-y-1">
                              <label className="text-slate-400 block text-[9px] uppercase font-mono">1 month pricing rate</label>
                              <input 
                                type="number" 
                                value={selectedPlanToEdit.prices.inr['1month']}
                                onChange={(e) => handleUpdatePriceField('1month', e.target.value, 'inr')}
                                className="w-full bg-[#180e30] border border-[#2d1c5a] rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400 block text-[9px] uppercase font-mono">6 months / mo rate</label>
                              <input 
                                type="number" 
                                value={selectedPlanToEdit.prices.inr['6months']}
                                onChange={(e) => handleUpdatePriceField('6months', e.target.value, 'inr')}
                                className="w-full bg-[#180e30] border border-[#2d1c5a] rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400 block text-[9px] uppercase font-mono">12 months / mo rate</label>
                              <input 
                                type="number" 
                                value={selectedPlanToEdit.prices.inr['12months']}
                                onChange={(e) => handleUpdatePriceField('12months', e.target.value, 'inr')}
                                className="w-full bg-[#180e30] border border-[#2d1c5a] rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400 block text-[9px] uppercase font-mono">24 months / mo rate</label>
                              <input 
                                type="number" 
                                value={selectedPlanToEdit.prices.inr['24months']}
                                onChange={(e) => handleUpdatePriceField('24months', e.target.value, 'inr')}
                                className="w-full bg-[#180e30] border border-[#2d1c5a] rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1 col-span-2">
                              <label className="text-purple-300 block text-[9.5px] uppercase font-mono font-bold">48 months / mo flagship rate</label>
                              <input 
                                type="number" 
                                value={selectedPlanToEdit.prices.inr['48months']}
                                onChange={(e) => handleUpdatePriceField('48months', e.target.value, 'inr')}
                                className="w-full bg-[#180e30] border border-brand-purple rounded-lg px-3 py-2 text-xs text-white font-bold"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#110926] p-4 rounded-xl border border-[#2d1c5a] space-y-3">
                          <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 block border-b border-[#2d1c5a] pb-1.5">United States Dollar (USD $ / Month) Rates</span>
                          <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                            <div className="space-y-1">
                              <label className="text-slate-400 block text-[9px] uppercase font-mono">1 month rate</label>
                              <input 
                                type="number" 
                                step="0.01"
                                value={selectedPlanToEdit.prices.usd['1month']}
                                onChange={(e) => handleUpdatePriceField('1month', e.target.value, 'usd')}
                                className="w-full bg-[#180e30] border border-[#2d1c5a] rounded-lg px-2 py-1 text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400 block text-[9px] uppercase font-mono">48 months rate</label>
                              <input 
                                type="number" 
                                step="0.01"
                                value={selectedPlanToEdit.prices.usd['48months']}
                                onChange={(e) => handleUpdatePriceField('48months', e.target.value, 'usd')}
                                className="w-full bg-[#180e30] border border-brand-purple rounded-lg px-2 py-1 text-white font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#2d1c5a]/45">
                      <button
                        type="button"
                        onClick={() => setSelectedPlanToEdit(null)}
                        className="px-4 py-2 bg-[#20133f] text-slate-300 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-brand-purple text-white hover:bg-indigo-600 rounded-xl font-bold font-mono text-xs uppercase tracking-wider"
                      >
                        Commit Catalog Changes live
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Grid of active plans */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plansList.map((p, pidx) => (
                  <div 
                    key={p.id}
                    className={`rounded-2xl p-5 border flex flex-col justify-between ${
                      p.popular 
                        ? 'bg-[#180c35] border-brand-purple border-2' 
                        : 'bg-[#120a22] border-[#25154f]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-display font-black text-white text-base truncate">{p.name}</h4>
                        <span className="bg-red-500/20 text-red-300 text-[8.5px] font-bold py-0.5 px-2 rounded-full uppercase font-mono tracking-widest">{p.percentageOff}</span>
                      </div>
                      
                      <p className="text-[11px] text-slate-450 leading-normal line-clamp-2 min-h-[33px]">{p.desc}</p>
                      
                      <div className="bg-[#1b1034] p-3 rounded-xl border border-[#2d1c5a]/50 text-xs">
                        <div className="flex justify-between font-mono text-slate-400">
                          <span>48m (INR):</span>
                          <strong className="text-emerald-400">₹{p.prices.inr['48months']}/mo</strong>
                        </div>
                        <div className="flex justify-between font-mono text-slate-400 mt-1">
                          <span>1m (INR):</span>
                          <strong className="text-slate-300">₹{p.prices.inr['1month']}/mo</strong>
                        </div>
                        <div className="flex justify-between font-mono text-slate-400 mt-1">
                          <span>48m (USD):</span>
                          <strong className="text-slate-300">${p.prices.usd['48months']}/mo</strong>
                        </div>
                      </div>

                      <div className="text-[10px] space-y-1 border-t border-[#2d1c5a]/30 pt-2 max-h-[80px] overflow-y-auto pr-1">
                        {p.features.slice(0, 3).map((feat, f_idx) => (
                          <div key={f_idx} className="text-slate-400 flex items-start gap-1">
                            <span className="text-emerald-500">&bull;</span>
                            <span className="line-clamp-1">{feat}</span>
                          </div>
                        ))}
                        {p.features.length > 3 && (
                          <span className="text-[9px] text-purple-300 font-bold font-mono">+{p.features.length - 3} features configured</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 mt-2">
                      <button
                        onClick={() => setSelectedPlanToEdit(JSON.parse(JSON.stringify(p)))} // Clone deep
                        className="w-full bg-[#20133f] hover:bg-brand-purple text-indigo-300 hover:text-white py-2 rounded-xl text-[10.5px] font-mono uppercase font-black tracking-widest transition-all cursor-pointer text-center"
                      >
                        ⚡ Edit Rates &amp; Feat
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM FIREWALL AND SIMULATED Terminal */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Toggles */}
            <div className="lg:col-span-5 bg-[#120a22] border border-[#211444] rounded-3xl p-6 space-y-5 text-left">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-4.5 h-4.5 text-indigo-400" />
                  Live hPanel Network Security Configuration
                </h3>
                <p className="text-[10px] text-slate-400">Manage real-time back-end protection parameters on nodes instantly</p>
              </div>

              <div className="space-y-3.5 pt-2 text-xs">
                
                <div className="flex items-center justify-between bg-[#190f33] p-3 rounded-xl border border-[#2d1c5a]/60">
                  <div className="space-y-0.5 max-w-[70%] text-left">
                    <p className="text-xs font-bold text-white">Google SSO Authentication</p>
                    <p className="text-[10px] text-slate-400 italic">Compel verified accounts on customer portal logins</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !googleSsoEnforced;
                      setGoogleSsoEnforced(nextVal);
                      addLog(`Google OAuth enforcement rules updated to: ${nextVal ? 'STRICT' : 'OPTIONAL'}`);
                    }}
                    className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${googleSsoEnforced ? 'bg-indigo-600' : 'bg-slate-700'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${googleSsoEnforced ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-[#190f33] p-3 rounded-xl border border-[#2d1c5a]/60">
                  <div className="space-y-0.5 max-w-[70%] text-left">
                    <p className="text-xs font-bold text-white">Enterprise DDoS Floodwall</p>
                    <p className="text-[10px] text-slate-400 italic">Trigger rate filters to mitigate custom DNS crawler blocks</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !ddosWall;
                      setDdosWall(nextVal);
                      addLog(`DDoS rate limits protection system turned: ${nextVal ? 'ON' : 'OFF'}`);
                    }}
                    className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${ddosWall ? 'bg-indigo-600' : 'bg-slate-700'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${ddosWall ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="bg-[#190f33] p-3 rounded-xl border border-[#2d1c5a]/60 space-y-2 text-left">
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
                          addLog(`Automated snapshot timing altered to: ${cycle.toUpperCase()}`);
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

            {/* Simulated Live logs */}
            <div className="lg:col-span-7 bg-[#0f071e] border border-[#231548] rounded-3xl p-6 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  Live Audit Logs &amp; Event Stream
                </h3>
                <button 
                  onClick={() => setSystemLogs([])} 
                  className="text-[9px] font-mono text-slate-500 hover:text-slate-350 cursor-pointer"
                >
                  Clear stream
                </button>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto font-mono text-[10px] leading-relaxed text-slate-300 pr-1 select-none bg-[#110926]/40 p-3.5 rounded-xl border border-[#2d1c5a]/40 min-h-[180px]">
                {systemLogs.map((log, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-indigo-400 shrink-0">&raquo;</span>
                    <span>{log}</span>
                  </div>
                ))}
                {systemLogs.length === 0 && (
                  <p className="text-slate-500 p-2 italic font-sans text-xs">Standard terminal log trace is fully cleared.</p>
                )}
              </div>

              <form onSubmit={handleAddLiveLog} className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={newLogText}
                  onChange={(e) => setNewLogText(e.target.value)}
                  placeholder="Simulate action command..."
                  className="flex-grow bg-[#150a29] text-[11px] text-slate-200 px-3 py-2 border border-[#2b1749] rounded-lg focus:outline-none focus:border-brand-purple"
                />
                <button
                  type="submit"
                  className="bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white px-4 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Simulate
                </button>
              </form>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

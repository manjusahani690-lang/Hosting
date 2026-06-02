'use client';

import React from 'react';
import { Globe, Check, Zap, Server, ShieldCheck, Compass, HelpCircle } from 'lucide-react';

interface CloudViewProps {
  setActivePage: (page: string) => void;
  setSelectedPlan?: (plan: any) => void;
}

export default function CloudView({ setActivePage, setSelectedPlan }: CloudViewProps) {
  
  const handleSelectCloud = (name: string, price: number) => {
    if (setSelectedPlan) {
      setSelectedPlan({
        name,
        priceYearly: price,
        priceMonthly: price + 10,
        cycle: 'yearly',
        finalPrice: price,
        features: [
          'Isolated compute resources with up to 12 GB RAM',
          'Free Dedicated IP address assignment',
          'Free Cloudflare global API caching CDN',
          'Automated daily snapshots and cloud replicas'
        ]
      });
    }
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50 py-12 md:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-brand-purple border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Enterprise Scale
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 tracking-tight">
            Fully Managed Cloud Hosting Ecosystems
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Run your applications with the power of fully dedicated server instances but modeled inside an simplified control hPanel. No console programming required.
          </p>
        </div>

        {/* Cloud Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Cloud Startup */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <span className="text-[10px] bg-brand-purple/10 text-brand-purple font-extrabold px-2.5 py-1 rounded">Scale 1x</span>
              <h3 className="font-display font-extrabold text-xl text-slate-950">Cloud Startup</h3>
              <p className="text-xs text-slate-500">Perfect entry pack for expanding software subscription models.</p>
              
              <div className="pt-2">
                <span className="text-3xl font-display font-black text-slate-950">$8.99</span>
                <span className="text-xs text-slate-400">/ mo</span>
              </div>

              <ul className="space-y-3.5 pt-4 text-xs font-medium text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 300 Websites space limit</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 200 GB Solid NVMe Storage</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 3 GB Dedicated RAM</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 2 Core High-Compute Intel cores</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Free Dedicated IP address</li>
              </ul>
            </div>
            
            <button 
              onClick={() => handleSelectCloud('Cloud Startup', 8.99)}
              className="w-full mt-10 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs rounded-xl tracking-wide cursor-pointer block text-center"
            >
              Configure Cloud Startup
            </button>
          </div>

          {/* Cloud Professional */}
          <div className="bg-[#120a2a] text-white p-8 rounded-3xl border-2 border-brand-purple flex flex-col justify-between shadow-xl relative scale-102 z-10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-purple text-white text-[9px] font-extrabold tracking-widest px-4 py-1.5 rounded-full uppercase">RECOMMENDED DEPLOY</div>
            
            <div className="space-y-4">
              <span className="text-[10px] bg-brand-purple/20 text-brand-purple font-extrabold px-2.5 py-1 rounded">Scale 2x</span>
              <h3 className="font-display font-extrabold text-xl">Cloud Professional</h3>
              <p className="text-xs text-slate-400">Formulated for active e-commerce storefronts and databases.</p>
              
              <div className="pt-2">
                <span className="text-3xl font-display font-black text-white">$17.99</span>
                <span className="text-xs text-slate-400">/ mo</span>
              </div>

              <ul className="space-y-3.5 pt-4 text-xs font-medium text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 300 Websites space limit</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 250 GB Solid NVMe Storage</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 6 GB Dedicated RAM</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 4 Core High-Compute Intel cores</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Intel Xeon compute optimization</li>
              </ul>
            </div>
            
            <button 
              onClick={() => handleSelectCloud('Cloud Professional', 17.99)}
              className="w-full mt-10 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs rounded-xl tracking-wide cursor-pointer block text-center"
            >
              Configure Cloud Professional
            </button>
          </div>

          {/* Cloud Global Enterprise */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <span className="text-[10px] bg-brand-purple/10 text-brand-purple font-extrabold px-2.5 py-1 rounded">Scale 4x</span>
              <h3 className="font-display font-extrabold text-xl text-slate-105">Cloud Global</h3>
              <p className="text-xs text-slate-500">Peak infrastructure for large catalogs survival during flash deals.</p>
              
              <div className="pt-2">
                <span className="text-3xl font-display font-black text-slate-950">$34.99</span>
                <span className="text-xs text-slate-400">/ mo</span>
              </div>

              <ul className="space-y-3.5 pt-4 text-xs font-medium text-slate-600">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 300 Websites space limit</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 300 GB Solid NVMe Storage</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 12 GB Dedicated RAM</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 8 Core High-Compute Intel cores</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Custom kernel prioritization SLAs</li>
              </ul>
            </div>
            
            <button 
              onClick={() => handleSelectCloud('Cloud Global', 34.99)}
              className="w-full mt-10 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs rounded-xl tracking-wide cursor-pointer block text-center"
            >
              Configure Cloud Global
            </button>
          </div>

        </div>

        {/* Global Cloud Network Features detail */}
        <div className="mt-20 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-2xl border border-slate-200">
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-lg text-slate-900">Globally Distributed Replication Network</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              When launching a Cloud plan, CloudVibe maps replication slots across three distinct geography centers immediately. If a regional network fails, our DNS routers redirect active visitor routes in 14ms automatically, avoiding downtime or database dropouts. Full Cloudflare Edge caching is integrated standard.
            </p>
          </div>
          <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center p-4">
            {/* Minimal SVG decoration representing web networks */}
            <div className="absolute inset-0 bg-radial-gradient from-brand-purple/20 to-transparent block pointer-events-none" />
            <Globe className="w-16 h-16 text-brand-purple animate-pulse" />
            <div className="absolute bottom-3 left-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest">WAF Network map: Active</div>
          </div>
        </div>

      </div>
    </div>
  );
}

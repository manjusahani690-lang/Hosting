'use client';

import React, { useState } from 'react';
import { Server, Check, HelpCircle, HardDrive, ShieldCheck, Zap, ArrowRight, Gauge, Cpu, CloudLightning } from 'lucide-react';

interface HostingViewProps {
  setActivePage: (page: string) => void;
  setSelectedPlan?: (plan: any) => void;
}

export default function HostingView({ setActivePage, setSelectedPlan }: HostingViewProps) {
  const [activeTab, setActiveTab] = useState<'standards' | 'wordpress' | 'business'>('standards');
  const [selectedCycle, setSelectedCycle] = useState<'1month' | '6months' | '12months' | '24months' | '48months'>('48months');

  const getHostingPrice = (basePrice: number, cycle: '1month' | '6months' | '12months' | '24months' | '48months') => {
    if (cycle === '1month') return parseFloat((basePrice * 1.8).toFixed(2));
    if (cycle === '6months') return parseFloat((basePrice * 1.4).toFixed(2));
    if (cycle === '12months') return basePrice;
    if (cycle === '24months') return parseFloat((basePrice * 0.85).toFixed(2));
    return parseFloat((basePrice * 0.65).toFixed(2)); // High discount for 4-years subscription
  };

  const handleSelectPlan = (name: string, price: number) => {
    const activePrice = getHostingPrice(price, selectedCycle);
    if (setSelectedPlan) {
      setSelectedPlan({
        name,
        priceYearly: price,
        priceMonthly: price + 4,
        cycle: selectedCycle,
        finalPrice: activePrice,
        features: ['Full NVMe Accelerated Stacks', 'DDoS Protection WAF', 'Free DNS Transfer', 'SSL Safeguard Core']
      });
    }
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const planTypes = [
    { id: 'standards', label: 'Ecosystem Hosting', desc: 'Standard solutions for small projects' },
    { id: 'wordpress', label: 'WordPress Pro', desc: 'Optimized speed for WP block publishers' },
    { id: 'business', label: 'Business Web Host', desc: 'Accelerated nodes for SaaS startups' }
  ];

  return (
    <div className="font-sans text-slate-800 bg-slate-50 py-12 md:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 tracking-tight">
            High Density Shared Web Hosting Configurations
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            All nodes feature standard enterprise NVMe storage arrays, isolated kernel environments to block noisy neighbors, and global content cache pipelines.
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8 max-w-4xl mx-auto">
          {planTypes.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full sm:w-auto px-6 py-4 rounded-xl text-left transition-all border outline-none cursor-pointer flex items-center space-x-3 ${
                activeTab === tab.id 
                  ? 'bg-[#120a2a] text-white border-brand-purple shadow-lg' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Server className="w-5 h-5 text-brand-purple shrink-0" />
              <div>
                <p className="text-xs font-bold font-display uppercase tracking-wider">{tab.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 mt-0.5 line-clamp-1">{tab.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Period Agreement Term Selector */}
        <div className="bg-white border border-slate-205 p-5 rounded-2xl max-w-2xl mx-auto mb-16 shadow-xs text-center space-y-3.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">Select Billing Subscription Term Duration</span>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => setSelectedCycle('1month')}
              className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${selectedCycle === '1month' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-white text-slate-600 border-slate-205 hover:bg-slate-100'}`}
            >
              1 Month <span className="block text-[8px] font-medium text-amber-600 font-mono mt-0.5">+80% premium</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCycle('6months')}
              className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${selectedCycle === '6months' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-white text-slate-600 border-slate-205 hover:bg-slate-100'}`}
            >
              6 Months <span className="block text-[8px] font-medium text-indigo-600 font-mono mt-0.5">Save 25%</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCycle('12months')}
              className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${selectedCycle === '12months' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-white text-slate-600 border-slate-205 hover:bg-slate-100'}`}
            >
              12 Months <span className="block text-[8px] font-medium text-emerald-600 font-mono mt-0.5">Standard Base</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCycle('24months')}
              className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${selectedCycle === '24months' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-white text-slate-600 border-slate-205 hover:bg-slate-100'}`}
            >
              24 Months <span className="block text-[8px] font-medium text-emerald-500 font-mono mt-0.5">Save 15%</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCycle('48months')}
              className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${selectedCycle === '48months' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-white text-slate-600 border-slate-205 hover:bg-slate-100'}`}
            >
              48 Months <span className="block text-[8px] font-medium text-violet-500 font-mono mt-0.5">Save 35%</span>
            </button>
          </div>
        </div>

        {/* Dynamic Spec Grids depending on activeTab */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {activeTab === 'standards' && (
            <>
              {/* Starter Pack */}
              <div className="bg-white p-7 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <span className="text-[10px] bg-brand-purple/10 text-brand-purple font-extrabold uppercase px-2 py-1 rounded">Single Web</span>
                  <h3 className="font-display font-extrabold text-xl">Cloud Core Lite</h3>
                  <p className="text-xs text-slate-500">Perfect entry point for lightweight landing pages.</p>
                  <div className="pt-2">
                    <span className="text-3xl font-display font-black">${getHostingPrice(2.99, selectedCycle)}</span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-3 pt-4 text-xs font-medium text-slate-600">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1 Dynamic Website</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 50 GB NVMe Storage</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Free SSL</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> LiteSpeed Cache Core</li>
                  </ul>
                </div>
                <button onClick={() => handleSelectPlan('Cloud Core Lite', 2.99)} className="w-full mt-8 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-xs font-bold cursor-pointer text-center">SELECT PROMO</button>
              </div>

              {/* Pro Pack */}
              <div className="bg-[#120a2a] text-white p-7 rounded-2xl border-2 border-brand-purple flex flex-col justify-between shadow-xl relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-purple text-white text-[9px] font-extrabold tracking-widest px-3 py-1 rounded-full uppercase">BEST SELLER</div>
                <div className="space-y-4">
                  <span className="text-[10px] bg-brand-purple/20 text-brand-purple font-extrabold uppercase px-2 py-1 rounded">Multi-Site</span>
                  <h3 className="font-display font-extrabold text-xl">Cloud Vibe Pro</h3>
                  <p className="text-xs text-slate-400">Formulated for scalable developer startup backends.</p>
                  <div className="pt-2">
                    <span className="text-3xl font-display font-black">${getHostingPrice(6.99, selectedCycle)}</span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-3 pt-4 text-xs font-medium text-slate-300">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 100 Websites</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 200 GB NVMe Storage</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Free Domain Claim ($15 value)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Advanced DDoS WAF</li>
                  </ul>
                </div>
                <button onClick={() => handleSelectPlan('Cloud Vibe Pro', 6.99)} className="w-full mt-8 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-xs font-bold cursor-pointer text-center">SELECT PROMO</button>
              </div>

              {/* Business Elite */}
              <div className="bg-white p-7 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <span className="text-[10px] bg-brand-purple/10 text-brand-purple font-extrabold uppercase px-2 py-1 rounded">Unlimited</span>
                  <h3 className="font-display font-extrabold text-xl">Ecosystem Business</h3>
                  <p className="text-xs text-slate-500">Dedicated compute core buffers for continuous checkouts.</p>
                  <div className="pt-2">
                    <span className="text-3xl font-display font-black">${getHostingPrice(14.99, selectedCycle)}</span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-3 pt-4 text-xs font-medium text-slate-600">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Websites</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 400 GB NVMe Storage</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Isolated IP Mask Address</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Daily automated offsite backups</li>
                  </ul>
                </div>
                <button onClick={() => handleSelectPlan('Ecosystem Business', 14.99)} className="w-full mt-8 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-xs font-bold cursor-pointer text-center">SELECT PROMO</button>
              </div>
            </>
          )}

          {activeTab === 'wordpress' && (
            <>
              {/* WP Solo */}
              <div className="bg-white p-7 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <span className="text-[10px] bg-[#21759b]/10 text-[#21759b] font-extrabold uppercase px-2 py-1 rounded">WP Lite</span>
                  <h3 className="font-display font-extrabold text-xl">WordPress Basic</h3>
                  <p className="text-xs text-slate-500">Optimized for blogs and editorial portfolios.</p>
                  <div className="pt-2">
                    <span className="text-3xl font-display font-black">${getHostingPrice(3.99, selectedCycle)}</span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-3 pt-4 text-xs font-medium text-slate-600">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1 Optimized WP Install</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> WP-CLI & SSH developer access</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Auto core security updates</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Jetpack plugin integration</li>
                  </ul>
                </div>
                <button onClick={() => handleSelectPlan('WordPress Basic', 3.99)} className="w-full mt-8 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-xs font-bold cursor-pointer text-center">SELECT WP PLAN</button>
              </div>

              {/* WP Custom Pro */}
              <div className="bg-white p-7 rounded-2xl border-2 border-[#21759b] flex flex-col justify-between shadow-md relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#21759b] text-white text-[9px] font-extrabold tracking-widest px-3 py-1 rounded-full uppercase">RECOMMENDED</div>
                <div className="space-y-4">
                  <span className="text-[10px] bg-[#21759b]/20 text-[#21759b] font-extrabold uppercase px-2 py-1 rounded">WP Multi</span>
                  <h3 className="font-display font-extrabold text-xl">WP Developer Pro</h3>
                  <p className="text-xs text-slate-500">Formulated for agencies handling standard WP clients.</p>
                  <div className="pt-2">
                    <span className="text-3xl font-display font-black">${getHostingPrice(8.99, selectedCycle)}</span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-3 pt-4 text-xs font-medium text-slate-600">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 100 WP Installs</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Object Cache Pro tool ($95 value)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Free custom staging sandboxes</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> VIP ticket service support</li>
                  </ul>
                </div>
                <button onClick={() => handleSelectPlan('WP Developer Pro', 8.99)} className="w-full mt-8 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-xs font-bold cursor-pointer text-center">SELECT WP PLAN</button>
              </div>

              {/* WP Cloud */}
              <div className="bg-white p-7 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <span className="text-[10px] bg-[#21759b]/10 text-[#21759b] font-extrabold uppercase px-2 py-1 rounded">Enterprise</span>
                  <h3 className="font-display font-extrabold text-xl">WP Cloud Enterprise</h3>
                  <p className="text-xs text-slate-500">Maximum isolated resources, built for heavy Woo commerce checkouts.</p>
                  <div className="pt-2">
                    <span className="text-3xl font-display font-black">${getHostingPrice(19.99, selectedCycle)}</span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-3 pt-4 text-xs font-medium text-slate-600">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited WP Installs</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Daily automated offsite backups</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dedicated database resource cores</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Continuous DKIM/DMARC mail safety</li>
                  </ul>
                </div>
                <button onClick={() => handleSelectPlan('WP Cloud Enterprise', 19.99)} className="w-full mt-8 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-xs font-bold cursor-pointer text-center">SELECT WP PLAN</button>
              </div>
            </>
          )}

          {activeTab === 'business' && (
            <>
              {/* SaaS Starter */}
              <div className="bg-white p-7 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <span className="text-[10px] bg-indigo-600/10 text-indigo-600 font-extrabold uppercase px-2 py-1 rounded">SaaS Base</span>
                  <h3 className="font-display font-extrabold text-xl">SaaS Accelerator</h3>
                  <p className="text-xs text-slate-500">Perfect computed limits for new software subscriptions.</p>
                  <div className="pt-2">
                    <span className="text-3xl font-display font-black">${getHostingPrice(11.99, selectedCycle)}</span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-3 pt-4 text-xs font-medium text-slate-600">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 10 Sites Deploy Limit</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Docker containment active</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Cloudflare global API controls</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Weekly backup storage nodes</li>
                  </ul>
                </div>
                <button onClick={() => handleSelectPlan('SaaS Accelerator', 11.99)} className="w-full mt-8 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-xs font-bold cursor-pointer text-center">SELECT ACCELERATOR</button>
              </div>

              {/* SaaS Professional */}
              <div className="bg-white p-7 rounded-2xl border-2 border-indigo-600 flex flex-col justify-between shadow-md relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-extrabold tracking-widest px-3 py-1 rounded-full uppercase">HIGH PERFORMANCE</div>
                <div className="space-y-4">
                  <span className="text-[10px] bg-indigo-600/20 text-indigo-600 font-extrabold uppercase px-2 py-1 rounded">SaaS Scale</span>
                  <h3 className="font-display font-extrabold text-xl">SaaS Professional</h3>
                  <p className="text-xs text-slate-500">Double core CPU buffers that easily handles high API queries.</p>
                  <div className="pt-2">
                    <span className="text-3xl font-display font-black">${getHostingPrice(24.99, selectedCycle)}</span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-3 pt-4 text-xs font-medium text-slate-600">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 50 Sites Deploy Limit</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 4 CPU cores isolated computing</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Free Redis/Memcached databases</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Priority SLAs response guarantee</li>
                  </ul>
                </div>
                <button onClick={() => handleSelectPlan('SaaS Professional', 24.99)} className="w-full mt-8 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-xs font-bold cursor-pointer text-center">SELECT ACCELERATOR</button>
              </div>

              {/* SaaS Enterprise */}
              <div className="bg-white p-7 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <span className="text-[10px] bg-indigo-600/10 text-indigo-600 font-extrabold uppercase px-2 py-1 rounded">Enterprise Block</span>
                  <h3 className="font-display font-extrabold text-xl">Global SaaS Core</h3>
                  <p className="text-xs text-slate-500">Maximum speed potential, custom isolated ports, and 100% root DNS nodes.</p>
                  <div className="pt-2">
                    <span className="text-3xl font-display font-black">${getHostingPrice(49.99, selectedCycle)}</span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-3 pt-4 text-xs font-medium text-slate-600">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Sites Deploy Limit</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Enterprise-grade custom backup</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1 Gbps port network pipeline</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Absolute premium chat support priorities</li>
                  </ul>
                </div>
                <button onClick={() => handleSelectPlan('Global SaaS Core', 49.99)} className="w-full mt-8 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-xs font-bold cursor-pointer text-center">SELECT ACCELERATOR</button>
              </div>
            </>
          )}
        </div>

        {/* Global technical comparisons row */}
        <div className="mt-20 max-w-4xl mx-auto rounded-2xl bg-white p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-2">
            <Gauge className="w-6 h-6 text-brand-purple" />
            <h3 className="font-display font-extrabold text-base text-slate-900">Ecosystem Infrastructure Technical Matrix</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="space-y-2">
              <p className="font-bold text-slate-900 flex items-center gap-1.5"><Cpu className="w-4 h-4 text-brand-purple" /> High Limit PHP Memory</p>
              <p className="text-[11px] leading-relaxed">Default configured limit of 512MB memory allocations, fully capable of driving rich plugins effortlessly.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-slate-900 flex items-center gap-1.5"><CloudLightning className="w-4 h-4 text-brand-purple" /> LiteSpeed Cache Plugin</p>
              <p className="text-[11px] leading-relaxed">Includes integrated LSCache utilities, reducing server loading stress on database inquiries by 80% automatically.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-slate-900 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-brand-purple" /> Safe Isolated Sandboxes</p>
              <p className="text-[11px] leading-relaxed">Your databases are strictly isolated on server coordinates, meaning noisy neighbors won&apos;t impact speed.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

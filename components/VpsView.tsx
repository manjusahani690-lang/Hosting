'use client';

import React, { useState } from 'react';
import { Cpu, HardDrive, ShieldAlert, Check, CircleAlert, HelpCircle, Terminal, Eye } from 'lucide-react';

interface VpsViewProps {
  setActivePage: (page: string) => void;
  setSelectedPlan?: (plan: any) => void;
}

const vpsPlans = [
  { cores: 2, ram: '8 GB', ssd: '100 GB', bandwidth: '2 TB IP Transit', price: 9.99, name: 'Cyber Shell KVM 1' },
  { cores: 4, ram: '16 GB', ssd: '200 GB', bandwidth: '4 TB IP Transit', price: 18.99, name: 'Cyber Shell KVM 2' },
  { cores: 6, ram: '24 GB', ssd: '350 GB', bandwidth: '8 TB IP Transit', price: 29.99, name: 'Cyber Shell KVM 4' },
  { cores: 8, ram: '32 GB', ssd: '500 GB', bandwidth: '12 TB IP Transit', price: 49.99, name: 'Cyber Shell KVM 8' }
];

export default function VpsView({ setActivePage, setSelectedPlan }: VpsViewProps) {
  const [sliderIndex, setSliderIndex] = useState(1);
  const [selectedCycle, setSelectedCycle] = useState<'1month' | '6months' | '12months' | '24months' | '48months'>('48months');
  const activePlan = vpsPlans[sliderIndex];

  const getVpsPrice = (basePrice: number, cycle: '1month' | '6months' | '12months' | '24months' | '48months') => {
    if (cycle === '1month') return parseFloat((basePrice * 1.8).toFixed(2)); // Short-term premium
    if (cycle === '6months') return parseFloat((basePrice * 1.4).toFixed(2)); // Mid-term rate
    if (cycle === '12months') return basePrice;
    if (cycle === '24months') return parseFloat((basePrice * 0.85).toFixed(2));
    return parseFloat((basePrice * 0.65).toFixed(2)); // Best value 48-month rate
  };

  const activePrice = getVpsPrice(activePlan.price, selectedCycle);

  const handleSelectVps = () => {
    if (setSelectedPlan) {
      setSelectedPlan({
        name: activePlan.name,
        priceYearly: activePlan.price,
        priceMonthly: activePlan.price + 5,
        cycle: selectedCycle,
        finalPrice: activePrice,
        features: [
          `Root SSH terminal access with Dedicated IP`,
          `KVM virtualization with isolated kernel blocks`,
          `NVMe storage arrays optimized for database speed`,
          `Highly redundant DDoS cyber firewall protections`
        ]
      });
    }
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50 py-12 md:py-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-brand-purple border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Root SSH Console Included
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 tracking-tight">
            Isolated Virtual Private Server Nodes (KVM)
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed font-sans">
            Guaranteed CPU cycles, ECC RAM blocks, and absolute kernel isolated containers. Fully customizable with custom OS distributions (Ubuntu, Debian, AlmaLinux).
          </p>
        </div>

        {/* Dynamic VPS Estimator Card Slider UI */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-3xl mx-auto">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8 border-b border-slate-100 pb-8 text-center md:text-left">
            <div>
              <p className="text-xs uppercase text-slate-400 font-mono tracking-widest">Active Core Selection</p>
              <h2 className="text-2xl font-black font-display text-slate-900 mt-1">{activePlan.name}</h2>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold italic">
                *Prices vary with selected subscription duration
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-1.5 shrink-0">
              <div className="bg-[#120a2a] text-white py-3 px-5 rounded-2xl border border-white/5 flex items-baseline gap-1.5 shadow-md">
                <span className="text-3xl font-display font-black text-white">${activePrice}</span>
                <span className="text-xs text-slate-400 font-mono">/ mo</span>
              </div>
              <span className="text-[9.5px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {selectedCycle === '1month' ? '1 Mo Plan' : selectedCycle === '6months' ? '6 Mo Plan' : '1 Year Plan (Best Price)'}
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {/* Slide input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Starter KVM Node</span>
                <span className="text-brand-purple">Configure Core Allocation</span>
                <span>Hyper Cloud Node</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={vpsPlans.length - 1} 
                value={sliderIndex}
                onChange={(e) => setSliderIndex(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-purple"
              />
            </div>

            {/* Cycle Selector */}
            <div className="bg-slate-50 border border-slate-150 p-4.5 rounded-2xl space-y-2.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block text-center md:text-left">Select Contract Term Duration</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCycle('1month')}
                  className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${selectedCycle === '1month' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                >
                  1 Mo <span className="block text-[8px] font-medium text-amber-600 font-mono mt-0.5">+80%</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCycle('6months')}
                  className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${selectedCycle === '6months' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                >
                  6 Mo <span className="block text-[8px] font-medium text-indigo-600 font-mono mt-0.5">Save 25%</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCycle('12months')}
                  className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${selectedCycle === '12months' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                >
                  1 Year <span className="block text-[8px] font-medium text-emerald-600 font-mono mt-0.5">Base</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCycle('24months')}
                  className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${selectedCycle === '24months' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                >
                  2 Years <span className="block text-[8px] font-medium text-emerald-500 font-mono mt-0.5">Save 15%</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCycle('48months')}
                  className={`flex-1 min-w-[85px] py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${selectedCycle === '48months' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                >
                  4 Years <span className="block text-[8px] font-medium text-violet-500 font-mono mt-0.5">Save 35%</span>
                </button>
              </div>
            </div>

            {/* Spec breakdown visualization */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-slate-50 p-4.5 rounded-xl text-center border border-slate-100">
                <Cpu className="w-5 h-5 text-brand-purple mx-auto mb-2" />
                <p className="text-[10px] text-slate-400 uppercase font-mono">CPU Compute</p>
                <p className="font-display font-extrabold text-slate-900 text-sm mt-1">{activePlan.cores} Dedicated Cores</p>
              </div>

              <div className="bg-slate-50 p-4.5 rounded-xl text-center border border-slate-100">
                <HardDrive className="w-5 h-5 text-brand-purple mx-auto mb-2" />
                <p className="text-[10px] text-slate-400 uppercase font-mono">RAM Capacity</p>
                <p className="font-display font-extrabold text-slate-900 text-sm mt-1">{activePlan.ram} ECC RAM</p>
              </div>

              <div className="bg-slate-50 p-4.5 rounded-xl text-center border border-slate-100">
                <Terminal className="w-5 h-5 text-brand-purple mx-auto mb-2" />
                <p className="text-[10px] text-slate-400 uppercase font-mono">NVMe Hard Drive</p>
                <p className="font-display font-extrabold text-slate-900 text-sm mt-1">{activePlan.ssd} Solid Storage</p>
              </div>

              <div className="bg-slate-50 p-4.5 rounded-xl text-center border border-slate-100">
                <Eye className="w-5 h-5 text-brand-purple mx-auto mb-2" />
                <p className="text-[10px] text-slate-400 uppercase font-mono">Bandwidth Port</p>
                <p className="font-display font-extrabold text-slate-900 text-sm mt-1">{activePlan.bandwidth}</p>
              </div>
            </div>

            {/* Highlighted core features */}
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4 pt-2 text-xs font-medium text-slate-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Full root SSH console permissions enabled</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Fast OS replacement in 30 seconds</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> KVM dynamic kernel layer block</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Dedicated IP with rDNS records</li>
            </ul>

            {/* CTA action button */}
            <button
              onClick={handleSelectVps}
              className="w-full py-4.5 bg-brand-purple hover:bg-brand-purple/95 text-white font-bold text-sm tracking-wide rounded-2xl shadow-lg shadow-brand-purple/20 transition-all cursor-pointer block text-center"
            >
              Order Cyber Node Now
            </button>
          </div>

        </div>

        {/* Console warning banner */}
        <div className="mt-12 bg-amber-50 p-5 rounded-2xl border border-amber-100 max-w-3xl mx-auto flex gap-3 text-amber-800 text-xs leading-relaxed">
          <CircleAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Important Developer SLA Notice</p>
            <p className="text-amber-700 mt-1">
              VPS hosting represents an unmanaged resource. Root access is fully unlocked, making you responsible for server setups, safety policies, and package installations. If you prefer a fully automated control hPanel, explore our <span className="underline font-bold cursor-pointer" onClick={() => setActivePage('cloud')}>Managed Cloud Server Hosting plans</span> instead.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

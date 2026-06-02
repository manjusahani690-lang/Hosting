'use client';

import React from 'react';
import { Check, X, Shield, Cpu, HelpCircle } from 'lucide-react';

interface PricingViewProps {
  setActivePage: (page: string) => void;
  setSelectedPlan?: (plan: any) => void;
}

export default function PricingView({ setActivePage, setSelectedPlan }: PricingViewProps) {
  
  const handleSelectPlan = (name: string, price: number) => {
    if (setSelectedPlan) {
      setSelectedPlan({
        name,
        priceYearly: price,
        priceMonthly: price + 4,
        cycle: 'yearly',
        finalPrice: price,
        features: ['Full Stack SSD speed optimization', 'SSL encryption claim', 'Weekly offline cloud syncing']
      });
    }
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const matrix = [
    { feature: 'Websites Limit', starter: '1 Site', pro: '100 Sites', business: 'Unlimited', vps: 'Unlimited' },
    { feature: 'NVMe Solid Storage', starter: '50 GB', pro: '200 GB', business: '400 GB', vps: '1 TB' },
    { feature: 'DKIM Pro Business Mail', starter: '1 Mailbox', pro: 'Unlimited', business: 'Unlimited', vps: 'Unlimited' },
    { feature: 'Let\'s Encrypt SSL', starter: 'Included', pro: 'Included', business: 'Included', vps: 'Included' },
    { feature: 'Free Domain registration', starter: 'X', pro: 'Included', business: 'Included', vps: 'Included' },
    { feature: 'Weekly Offsite Snapshots', starter: 'Included', pro: 'Included', business: 'Included', vps: 'Included' },
    { feature: 'Daily Offsite Backups', starter: 'X', pro: 'X', business: 'Included', vps: 'Included' },
    { feature: 'Isolated Static IP Mask', starter: 'X', pro: 'X', business: 'Included', vps: 'Included' },
    { feature: 'Full SSH Console Terminal', starter: 'X', pro: 'Included', business: 'Included', vps: 'Included' },
    { feature: 'KVM Virtualization Core', starter: 'X', pro: 'X', business: 'X', vps: 'Included' }
  ];

  return (
    <div className="font-sans text-slate-800 bg-slate-50 py-12 md:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 tracking-tight">
            Comprehensive Hosting Matrix & Specs
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Review detailed capabilities and server resources before buying. Upgrade or downscale at any point instantly inside the control hPanel.
          </p>
        </div>

        {/* Matrix Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200/85 shadow-xl overflow-x-auto max-w-5xl mx-auto">
          <table className="w-full text-left font-sans text-xs sm:text-sm border-collapse min-w-[700px]">
            
            <thead>
              <tr className="bg-[#120a2a] text-white font-display border-b border-slate-700">
                <th className="p-6 font-bold text-sm">Specification / Resource</th>
                <th className="p-6 text-center font-bold text-sm">Starter Pack</th>
                <th className="p-6 text-center font-bold text-sm">Vibe Pro</th>
                <th className="p-6 text-center font-bold text-sm">Business Pro</th>
                <th className="p-6 text-center font-bold text-sm">VPS Node 8</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              
              <tr className="bg-slate-50">
                <td className="p-5 font-bold text-slate-900">Estimated Cost</td>
                <td className="p-5 text-center font-extrabold text-brand-purple text-base">$2.99 /mo</td>
                <td className="p-5 text-center font-extrabold text-brand-purple text-base">$6.99 /mo</td>
                <td className="p-5 text-center font-extrabold text-brand-purple text-base">$14.99 /mo</td>
                <td className="p-5 text-center font-extrabold text-brand-purple text-base">$29.99 /mo</td>
              </tr>

              {matrix.map((row) => (
                <tr key={row.feature} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 font-semibold text-slate-800">{row.feature}</td>
                  
                  <td className="p-5 text-center text-slate-600 font-mono">
                    {row.starter === 'Included' ? (
                      <Check className="w-4.5 h-4.5 text-emerald-500 mx-auto" />
                    ) : row.starter === 'X' ? (
                      <X className="w-4.5 h-4.5 text-slate-300 mx-auto" />
                    ) : (
                      row.starter
                    )}
                  </td>

                  <td className="p-5 text-center text-slate-600 font-mono">
                    {row.pro === 'Included' ? (
                      <Check className="w-4.5 h-4.5 text-emerald-500 mx-auto" />
                    ) : row.pro === 'X' ? (
                      <X className="w-4.5 h-4.5 text-slate-300 mx-auto" />
                    ) : (
                      row.pro
                    )}
                  </td>

                  <td className="p-5 text-center text-slate-600 font-mono">
                    {row.business === 'Included' ? (
                      <Check className="w-4.5 h-4.5 text-emerald-500 mx-auto" />
                    ) : row.business === 'X' ? (
                      <X className="w-4.5 h-4.5 text-slate-300 mx-auto" />
                    ) : (
                      row.business
                    )}
                  </td>

                  <td className="p-5 text-center text-slate-600 font-mono">
                    {row.vps === 'Included' ? (
                      <Check className="w-4.5 h-4.5 text-emerald-500 mx-auto" />
                    ) : row.vps === 'X' ? (
                      <X className="w-4.5 h-4.5 text-slate-300 mx-auto" />
                    ) : (
                      row.vps
                    )}
                  </td>
                </tr>
              ))}

              <tr className="bg-slate-50">
                <td className="p-5 font-bold text-slate-900">Get Started</td>
                <td className="p-5 text-center">
                  <button onClick={() => handleSelectPlan('Starter Pack', 2.99)} className="px-4 py-2 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all">Order Pack</button>
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => handleSelectPlan('Vibe Pro', 6.99)} className="px-4 py-2 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all">Order Pack</button>
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => handleSelectPlan('Business Pro', 14.99)} className="px-4 py-2 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all">Order Pack</button>
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => handleSelectPlan('VPS Node 8', 29.99)} className="px-4 py-2 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all">Order Node</button>
                </td>
              </tr>

            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}

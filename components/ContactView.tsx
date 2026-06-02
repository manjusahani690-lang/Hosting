'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, ShieldCheck, Check } from 'lucide-react';

export default function ContactView() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50 py-12 md:py-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 tracking-tight">
            Consult our Server Engineers
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Need customized architecture setups, database scale plans, or support migrating 20+ WordPress sites? Talk directly to our specialists today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto">
          
          {/* Quick contact channels info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
              <h3 className="font-display font-black text-base text-slate-900">Ecosystem Channels</h3>
              
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="p-2.5 rounded-xl bg-brand-purple/10 text-brand-purple shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">General Support</p>
                  <p className="text-slate-500 text-xs mt-0.5">support@cloudvibe-saas.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="p-2.5 rounded-xl bg-brand-purple/10 text-brand-purple shrink-0">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Enterprise Line</p>
                  <p className="text-slate-500 text-xs mt-0.5">+1 (888) 124-CLOUD</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <div className="p-2.5 rounded-xl bg-brand-purple/10 text-brand-purple shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">ServerCoordinates</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">Dallas-TX Edge Server Center Block 4C</p>
                </div>
              </div>

            </div>

            {/* SLA support pledge */}
            <div className="p-5.5 bg-brand-purple text-white rounded-2xl space-y-3 shadow-md">
              <p className="font-bold text-xs uppercase tracking-widest font-mono">Support Pledge</p>
              <p className="text-[11.5px] leading-relaxed text-brand-light/90">
                All tickets submitted are assigned to a certified software architect immediately. Our median SLA response timeline stands at exactly 11 minutes.
              </p>
            </div>
          </div>

          {/* Electronic Contact Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6.5 md:p-8 border border-slate-200 shadow-sm text-left">
            
            {submitted ? (
              <div className="py-16 text-center space-y-4 animate-fade-in bg-slate-50 rounded-2xl border border-slate-100 p-6">
                <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-display font-black text-slate-950 text-lg">Message Synced Successfully</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  We have mapped your general question to support slot #442. An engineer will message you back inside your hPanel dashboard shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-display font-black text-slate-950 text-base mb-6">Inquiry parameters</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-semibold uppercase font-mono">Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Rachel Adams" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-semibold uppercase font-mono">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="e.g. rachel@saas.com" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-semibold uppercase font-mono">Subject Of Conversation</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="e.g. Migration of 14 Laravel applications" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-semibold uppercase font-mono">Detailed Request</label>
                  <textarea 
                    rows={4} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Please specify environment details, database sizes, and desired SLA support speeds." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-semibold resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4.5 bg-[#120a2a] hover:bg-brand-purple text-white text-xs font-bold tracking-wider rounded-xl transition-all cursor-pointer text-center"
                >
                  TRANSMIT FORM
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

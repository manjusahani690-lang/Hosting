'use client';

import React, { useState } from 'react';
import { ArrowUp, Server, ShieldCheck, Mail, Percent, ArrowRight } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: string) => void;
}

export default function Footer({ setActivePage }: FooterProps) {
  const [emailValue, setEmailValue] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailValue.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmailValue('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-dark text-slate-400 font-sans border-t border-brand-purple/20">
      
      {/* Banner / Newsletter */}
      <div className="border-b border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <h3 className="font-display text-white text-xl font-bold tracking-tight">
              Secure an extra 10% off of your cloud plan today
            </h3>
            <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
              Join 40,000+ developers, startups, and agencies. Get immediate alerts on deals, custom speed stacks, and AI web benchmarks.
            </p>
          </div>
          <div className="lg:col-span-7">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="Enter your work email address"
                required
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
              />
              <button 
                type="submit" 
                className="bg-brand-purple hover:bg-brand-purple/90 text-white px-7 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-brand-purple/20 flex items-center justify-center space-x-2 transition-all cursor-pointer whitespace-nowrap"
              >
                {subscribed ? (
                  <span>Check Your Inbox!</span>
                ) : (
                  <>
                    <span>Get Exclusive Code</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Link Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          
          {/* Brand Col */}
          <div className="col-span-2 space-y-5">
            <div 
              onClick={() => setActivePage('home')} 
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="h-8 w-8 rounded-lg bg-brand-purple flex items-center justify-center text-white">
                <Server className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-display font-bold tracking-tight text-white">
                CloudVibe
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              We provide world-class web hosting services, VPS containers, and dedicated infrastructure optimized of speed, active security, and intuitive user experiences.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold uppercase px-2 py-1 rounded-sm border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                99.99% Uptime Verified
              </span>
            </div>
          </div>

          {/* Hosting Links */}
          <div>
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-4">Hosting Solutions</h4>
            <ul className="space-y-3.5 text-sm">
              <li><button onClick={() => setActivePage('hosting')} className="hover:text-white transition-colors cursor-pointer">SaaS Web Hosting</button></li>
              <li><button onClick={() => setActivePage('cloud')} className="hover:text-white transition-colors cursor-pointer">Managed Cloud Hosting</button></li>
              <li><button onClick={() => setActivePage('vps')} className="hover:text-white transition-colors cursor-pointer">Isolated VPS Nodes</button></li>
              <li><button onClick={() => setActivePage('hosting')} className="hover:text-white transition-colors cursor-pointer">WordPress Pro Stacks</button></li>
              <li><button onClick={() => setActivePage('builder')} className="hover:text-white text-indigo-400 transition-colors cursor-pointer flex items-center gap-1">AI Website Builder <span className="text-[9px] bg-brand-purple text-white px-1 rounded">HOT</span></button></li>
            </ul>
          </div>

          {/* Domains Links */}
          <div>
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-4">Domains</h4>
            <ul className="space-y-3.5 text-sm">
              <li><button onClick={() => setActivePage('domain')} className="hover:text-white transition-colors cursor-pointer">Secure New TLDs</button></li>
              <li><button onClick={() => setActivePage('domain')} className="hover:text-white transition-colors cursor-pointer">Free Domain Migration</button></li>
              <li><button onClick={() => setActivePage('domain')} className="hover:text-white transition-colors cursor-pointer">WHOIS Privacy Guard</button></li>
              <li><button onClick={() => setActivePage('domain')} className="hover:text-white transition-colors cursor-pointer">AI Name Generator</button></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3.5 text-sm">
              <li><button onClick={() => setActivePage('blog')} className="hover:text-white transition-colors cursor-pointer">Our Tech Dev Blog</button></li>
              <li><button onClick={() => setActivePage('contact')} className="hover:text-white transition-colors cursor-pointer">Press & Resources</button></li>
              <li><button onClick={() => setActivePage('contact')} className="hover:text-white transition-colors cursor-pointer">Career Positions</button></li>
              <li><button onClick={() => setActivePage('contact')} className="hover:text-white transition-colors cursor-pointer">Contact Support</button></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-4">Security & Trust</h4>
            <ul className="space-y-3.5 text-sm">
              <li><button onClick={() => setActivePage('contact')} className="hover:text-white transition-colors cursor-pointer">SLA Core Guarantee</button></li>
              <li><button onClick={() => setActivePage('contact')} className="hover:text-white transition-colors cursor-pointer">IP Transit Logs</button></li>
              <li><button onClick={() => setActivePage('contact')} className="hover:text-white transition-colors cursor-pointer">End-User SLA Policy</button></li>
              <li><button onClick={() => setActivePage('contact')} className="hover:text-white transition-colors cursor-pointer">GDPR Cybersecurity</button></li>
            </ul>
          </div>

        </div>

        {/* Corporate Trust Badges & Payments */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs text-slate-500 leading-relaxed">
            © {new Date().getFullYear()} CloudVibe Solutions Inc. All intellectual assets and rights reserved. CloudVibe is not affiliated with Hostinger, this demo is a representation of high performance.
          </div>
          
          {/* Payment Badges & Trust Seals */}
          <div className="flex flex-col md:flex-row items-center md:space-x-6 gap-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 text-[10px] text-slate-300 font-semibold font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AES-256 SSL CONNECTIVITY SECURED</span>
            </div>
            
            <div className="flex items-center space-x-3.5 filter grayscale hover:grayscale-0 transition-opacity opacity-75">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Secure Payments:</span>
              <div className="h-6 px-2 bg-slate-800 rounded flex items-center text-[10px] text-white font-bold border border-white/5 select-none">VISA</div>
              <div className="h-6 px-2 bg-slate-800 rounded flex items-center text-[10px] text-white font-bold border border-white/5 select-none">MASTERCARD</div>
              <div className="h-6 px-2 bg-slate-800 rounded flex items-center text-[10px] text-white font-bold border border-white/5 select-none font-mono">STRIPE</div>
              <div className="h-6 px-2 bg-slate-800 rounded flex items-center text-[10px] text-white font-bold border border-white/5 select-none font-sans">Paypal</div>
              <button 
                onClick={scrollToTop}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-brand-purple hover:text-white text-slate-400 transition-colors cursor-pointer"
                title="Return to peak"
              >
                <ArrowUp className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

'use client';

import React, { useState } from 'react';
import { Menu, X, ChevronDown, Server, Cpu, Globe, Zap, ArrowRight, ShieldCheck, Mail, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: any) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  userRole?: 'customer' | 'admin';
}

export default function Header({ activePage, setActivePage, isLoggedIn, setIsLoggedIn, userRole }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems = [
    {
      label: 'Choose a service',
      isMegamenu: true,
      dropdown: [
        { name: 'Web hosting', desc: 'Secure reliable hosting', icon: Server, page: 'hosting' },
        { name: 'Vibe code websites', desc: 'Instant premium coding nodes', icon: Sparkles, page: 'builder' },
        { name: 'Drag-and-drop builder', desc: 'No-code visual creator', icon: Zap, page: 'builder' },
        { name: 'VPS hosting', desc: 'High performance dedicated kernel', icon: Cpu, page: 'vps' },
        { name: 'VPS hosting for n8n', desc: 'Workflow automation nodes', icon: Server, page: 'vps' },
        { name: '1-Click OpenClaw', desc: 'Instant chatbot control center', icon: Sparkles, page: 'vps' },
        { name: 'Domains', desc: 'Personal secure domain registers', icon: Globe, page: 'domain' },
        { name: 'Business email', desc: 'Professional mailbox formats', icon: Mail, page: 'domain' },
        { name: 'Email Marketing', desc: 'High conversion newsletters', icon: Mail, page: 'domain' },
      ]
    },
    { label: 'AI Builder', page: 'builder' },
    { label: 'Hosting', page: 'hosting' },
    { label: 'VPS Servers', page: 'vps' },
    { label: 'Register Domains', page: 'domain' },
    { label: 'Pricing Matrix', page: 'pricing' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: string) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cloudvibe_session_user');
    }
    setIsLoggedIn(false);
    setActivePage('home');
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Topmost Trust Claims Banner */}
      <div className="bg-[#120a2a] text-slate-350 text-[10.5px] py-2 px-4 flex flex-wrap justify-center items-center gap-x-5 gap-y-1 font-mono border-b border-white/5 tracking-wider uppercase font-extrabold antialiased">
        <span className="flex items-center gap-1.5 text-slate-200">
          <span className="w-1.5 h-1.5 bg-brand-purple rounded-full animate-ping shrink-0" />
          ✓ 30-day money-back guarantee
        </span>
        <span className="hidden sm:inline-block text-slate-700">|</span>
        <span className="flex items-center gap-1.5 text-slate-200">
          ✓ 24/7 Support Included
        </span>
        <span className="hidden sm:inline-block text-slate-700">|</span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold tracking-tight">
          ✓ Cancel Anytime
        </span>
      </div>

      <header className="bg-white/90 backdrop-blur-md border-b border-brand-purple/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div 
              onClick={() => handleNavClick('home')} 
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="h-10 w-10 rounded-xl bg-[#673ab7] flex items-center justify-center text-white shadow-lg shadow-[#673ab7]/20 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5 text-amber-200" />
              </div>
              <span className="text-xl font-display font-medium tracking-tight text-brand-dark flex items-center gap-1.5">
                Super AI Site Builder
              </span>
            </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div 
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <button className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeDropdown === item.label ? 'text-brand-purple bg-brand-purple/5' : 'text-slate-600 hover:text-brand-purple'
                  }`}>
                    <span>{item.label}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.page!)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      activePage === item.page ? 'text-brand-purple bg-brand-purple/5 font-semibold' : 'text-slate-600 hover:text-brand-purple'
                    }`}
                  >
                    {item.label}
                  </button>
                )}

                {/* Dropdown Card */}
                {item.dropdown && activeDropdown === item.label && (
                  <div className={`absolute top-full left-0 mt-1.5 rounded-2xl bg-white p-4.5 shadow-2xl border border-slate-205/60 animate-fade-in z-50 ${
                    item.isMegamenu ? 'w-[520px] grid grid-cols-2 gap-x-4 gap-y-2' : 'w-80 grid gap-2'
                  }`}>
                    {item.isMegamenu && (
                      <div className="col-span-2 pb-2 border-b border-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono flex items-center justify-between">
                        <span>Get Online Today &bull; Choose a service</span>
                        <span className="text-indigo-600 font-sans tracking-normal capitalize flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                          Promo Active
                        </span>
                      </div>
                    )}
                    {item.dropdown.map((sub, idx) => {
                      const Icon = sub.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleNavClick(sub.page)}
                          className="flex items-start space-x-3 p-2 rounded-xl hover:bg-brand-purple/5 cursor-pointer group transition-all"
                        >
                          <div className="p-2 rounded-lg bg-brand-purple/5 text-brand-[#120a2a] group-hover:bg-[#120a2a] group-hover:text-white transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-brand-purple transition-colors">
                              {sub.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 line-clamp-1">
                              {sub.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => {
                const toggle = document.getElementById('btn-chatbot-toggle');
                if (toggle) toggle.click();
              }}
              className="flex items-center space-x-1.5 bg-[#120a2a] hover:bg-[#1c1040]/90 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-[#120a2a]/10 cursor-pointer hover:shadow-lg hover:scale-[1.02] border border-white/10 transition-all uppercase tracking-wider"
              title="Speak with AI Help Agent support"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              <span>Ask AI</span>
            </button>

            {isLoggedIn ? (
              <>
                {userRole === 'admin' && (
                  <button 
                    onClick={() => handleNavClick('admin')}
                    className="flex items-center space-x-1.5 border border-rose-200/50 hover:bg-rose-50/50 bg-rose-500/5 text-rose-700 px-3.5 py-2 rounded-xl text-xs font-black shadow-sm cursor-pointer transition-all uppercase tracking-wider"
                  >
                    <ShieldCheck className="h-4 w-4 text-rose-605 animate-pulse" />
                    <span>Admin Panel</span>
                  </button>
                )}
                <button 
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-brand-purple cursor-pointer"
                >
                  <User className="h-4 w-4 text-brand-purple" />
                  <span>Control hPanel</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-all"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-brand-purple cursor-pointer transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => handleNavClick('pricing')}
                  className="flex items-center space-x-1 bg-brand-purple hover:bg-brand-purple/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-brand-purple/20 cursor-pointer hover:shadow-xl transition-all"
                >
                  <span>Start Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex lg:hidden items-center space-x-3">
            {isLoggedIn && (
              <button 
                onClick={() => handleNavClick('dashboard')}
                className="p-2.5 rounded-xl bg-brand-purple/5 text-brand-purple cursor-pointer"
              >
                <User className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 cursor-pointer transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (with AnimatePresence) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-100 bg-white shadow-lg overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="font-display font-semibold text-sm text-slate-400 uppercase tracking-wider px-3">
                    {item.label}
                  </div>
                  {item.dropdown ? (
                    <div className="grid grid-cols-1 gap-1 pl-3">
                      {item.dropdown.map((sub, sidx) => (
                        <button
                          key={sidx}
                          onClick={() => handleNavClick(sub.page)}
                          className="flex items-center space-x-2 w-full text-left p-2.5 rounded-xl text-slate-700 hover:bg-brand-purple/5 hover:text-brand-purple cursor-pointer text-sm"
                        >
                          <sub.icon className="h-4 w-4 text-brand-purple/70" />
                          <span>{sub.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item.page!)}
                      className="block w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-brand-purple/5 hover:text-brand-purple font-medium text-sm cursor-pointer"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="flex items-center justify-center space-x-2 bg-brand-purple/5 hover:bg-brand-purple/10 text-brand-purple py-3 rounded-xl font-semibold text-sm cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      <span>Manage Hosting (hPanel)</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-center py-3 rounded-xl border border-rose-100 text-rose-600 hover:bg-rose-50 cursor-pointer font-semibold text-sm"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavClick('login')}
                      className="text-center py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer font-semibold text-sm"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => handleNavClick('pricing')}
                      className="text-center bg-brand-purple hover:bg-brand-purple/90 text-white py-3 rounded-xl font-semibold text-sm shadow-md cursor-pointer"
                    >
                      Start Web Hosting
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Check, ShieldCheck, Sparkles, Server, Cpu, Globe, Mail, 
  HelpCircle, ChevronDown, Award, Star, Activity, Plus, HardDrive, Lock 
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  setActivePage: (page: string) => void;
  setSelectedPlan?: (plan: any) => void;
  setSharedSearchQuery?: (query: string) => void;
}

const companyLogos = [
  { name: 'Y Combinator', font: 'font-sans font-extrabold text-orange-500' },
  { name: 'vercel', font: 'font-sans font-bold tracking-widest text-black dark:text-white uppercase' },
  { name: 'Stripe', font: 'font-sans font-black text-indigo-600 italic' },
  { name: 'ProductHunt', font: 'font-display font-medium text-orange-600' },
  { name: 'Figma', font: 'font-sans font-semibold tracking-tight text-slate-800' },
  { name: 'GitHub', font: 'font-mono font-bold text-slate-900' }
];

const features = [
  {
    icon: Server,
    title: 'Elite Web Hosting',
    desc: 'Powered by highly optimized NVMe storage stacks and Cloudflare routing for 300% faster payload responses.',
    badge: 'Standard'
  },
  {
    icon: Sparkles,
    title: 'Gemini AI Site Builder',
    desc: 'Describe your vision in simple text, and our integrated Gemini engine will render a custom layout structure with styled Tailwind grids.',
    badge: 'Exclusive'
  },
  {
    icon: Globe,
    title: 'Domain & SLA Privacy',
    desc: 'Manage free DNS routing, continuous WHOIS masking, and instant custom email forwards inside a single glass interface.',
    badge: 'Popular'
  },
  {
    icon: Mail,
    title: 'Professional Business Mail',
    desc: 'Robust customized DKIM records and spam firewalls. Fully branded mailboxes synced seamlessly with outlook/apple devices.',
    badge: 'New Pack'
  },
  {
    icon: ShieldCheck,
    title: 'Absolute Cyber Security',
    desc: 'Includes fully redundant DDoS mitigation firewalls, automatic weekly offline cloud backups, and Let\'s Encrypt SSL certificates.',
    badge: 'Standard'
  }
];

const plans = [
  {
    id: 'single',
    name: 'Single',
    desc: 'A great solution for beginners',
    percentageOff: '83% off',
    regPrice: {
      usd: 4.99,
      inr: 399
    },
    notes: {
      usd: 'Get 48 months for $37.92 (regular price $239.52). Renews at $5.99/mo.',
      inr: 'Get 48 months for ₹3,312 (regular price ₹19,152). Renews at ₹289/mo.'
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
      usd: { '1month': 4.99, '6months': 3.49, '12months': 2.49, '24months': 1.49, '48months': 0.79 },
      inr: { '1month': 399, '6months': 299, '12months': 199, '24months': 129, '48months': 69 }
    },
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    desc: 'Everything you need to get started',
    percentageOff: '75% off',
    regPrice: {
      usd: 6.99,
      inr: 599
    },
    notes: {
      usd: 'Get 48 months for $71.52 (regular price $335.52). Renews at $8.99/mo.',
      inr: 'Get 48 months for ₹7,152 (regular price ₹28,752). Renews at ₹449/mo.'
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
      usd: { '1month': 6.99, '6months': 4.99, '12months': 3.49, '24months': 2.49, '48months': 1.49 },
      inr: { '1month': 599, '6months': 449, '12months': 299, '24months': 199, '48months': 149 }
    },
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    desc: 'More tools and power for growth',
    percentageOff: '64% off',
    regPrice: {
      usd: 9.99,
      inr: 699
    },
    notes: {
      usd: 'Get 48 months for $119.52 (regular price $479.52). Renews at $12.99/mo.',
      inr: 'Get 48 months for ₹11,952 (regular price ₹33,552). Renews at ₹649/mo.'
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
      usd: { '1month': 9.99, '6months': 7.49, '12months': 5.49, '24months': 3.99, '48months': 2.49 },
      inr: { '1month': 699, '6months': 549, '12months': 449, '24months': 349, '48months': 249 }
    },
    popular: false
  },
  {
    id: 'vps',
    name: 'VPS Cyber Nodes',
    desc: 'Isolated Virtual Private Server with full root SSH configuration.',
    percentageOff: '50% off',
    regPrice: {
      usd: 24.99,
      inr: 1499
    },
    notes: {
      usd: 'Includes Dedicated IP and blazing SSD speeds with KVM isolated hypervisors.',
      inr: 'Includes Dedicated IP and blazing SSD speeds with KVM isolated hypervisors.'
    },
    features: [
      '1 Dedicated IP Block',
      'Full root SSH terminal control panel',
      '100 GB NVMe SSD space',
      '2 TB High-speed data transit networks',
      '2 Cores Hyper Dedicated Compute',
      '8 GB Premium RAM block memory',
      'Instant standard OS deployment profiles'
    ],
    prices: {
      usd: { '1month': 19.99, '6months': 14.99, '12months': 9.99, '24months': 7.99, '48months': 4.99 },
      inr: { '1month': 1499, '6months': 1199, '12months': 999, '24months': 799, '48months': 399 }
    },
    popular: false
  }
];

const FAQs = [
  {
    q: 'How does CloudVibe compared hosting with others?',
    a: 'CloudVibe runs on a dedicated high-density server framework. Unlike crowded traditional hosting, we limit resource density and use NVMe SSD storage paired with server-level LiteSpeed caching engines, bringing page load speeds down to absolute micro-seconds.'
  },
  {
    q: 'Is a free custom registration domain included?',
    a: 'Absolutely! Our Premium Cloud, Business Pro, and VPS Cyber plans all include a free custom domain registration (.com, .net, .io, .co, or .online) for the entire initial year of service registration.'
  },
  {
    q: 'Can the Gemini AI Website tool generate full business layouts?',
    a: 'Yes. Our AI Website Builder handles prompt instructions on the fly. It suggests color palettes, selects matched typography, writes highly compelling humanized marketing copy, and outputs a clean Tailwind grid UI which can be deployed to your live server in the hPanel.'
  },
  {
    q: 'Do you assist with free hosting transfers?',
    a: 'We sure do. Once registered, simply click the "Migration Request" icon in your CloudVibe hPanel. Our certified engineers will move your databases, archives, and DNS fully securely with zero downtime.'
  }
];

const testimonials = [
  {
    quote: "Moving to CloudVibe literally cut our First Contentful Paint by 60%. The custom hPanel dashboard is infinitely cleaner than legacy cPanel controllers.",
    name: "Alex Rivera",
    role: "Lead Platform Engineer, DevFlow",
    rating: 5
  },
  {
    quote: "The prompt-driven AI builder generated a fully functional landing page for my dental business in forty seconds. Absolute game changer.",
    name: "Dr. Linda Kapoor",
    role: "Owner, SmileDesigns",
    rating: 5
  },
  {
    quote: "Security specs are high-end. Our store survived a major DDoS attack last Black Friday without a single page lag or checkout glitch.",
    name: "Stefan Müller",
    role: "Founder, ChronoLux Goods",
    rating: 5
  }
];

export default function HomeView({ setActivePage, setSelectedPlan, setSharedSearchQuery }: HomeViewProps) {
  const [billingCycle, setBillingCycle] = useState<'1month' | '6months' | '12months' | '24months' | '48months'>('48months');
  const [currency, setCurrency] = useState<'inr' | 'usd'>('inr');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Dashboard Interactive Preview State
  const [currentCpu, setCurrentCpu] = useState(38);
  const [activeTab, setActiveTab] = useState('databases');

  // Cybersecurity Vault & Trust diagnostics state
  const [sslInputUrl, setSslInputUrl] = useState('');
  const [sslStatus, setSslStatus] = useState<'idle' | 'testing' | 'secured' | 'not_found'>('idle');
  const [sslProgress, setSslProgress] = useState(0);
  const [sslVerifiedDetails, setSslVerifiedDetails] = useState<any | null>(null);

  const runSslDiagnosticTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sslInputUrl.trim()) return;

    setSslStatus('testing');
    setSslProgress(10);
    setSslVerifiedDetails(null);

    // Simulate progress check sequences
    let currentVal = 10;
    const interval = setInterval(() => {
      currentVal += Math.floor(Math.random() * 20) + 15;
      if (currentVal >= 100) {
        clearInterval(interval);
        setSslProgress(100);
        
        // Conclude test successfully
        const cleanDomain = sslInputUrl.trim()
          .replace(/^(https?:\/\/)?(www\.)?/, '')
          .split('/')[0];

        setSslVerifiedDetails({
          domain: cleanDomain,
          issuer: "CloudVibe Security Authority Root R4 CA",
          encryption: "TLS 1.3 AES_256_GCM (Military-Grade)",
          keySize: "ECDSA 384-bit Elliptic Curve (NIST P-384)",
          compliance: "SOC2 Type II / ICANN Standard compliant / PCI-DSS Enforced",
          issuedAt: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
          expiryAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
          wafStatus: "Active Enterprise WAF DDoS Mitigation Active on Dallas Nodes"
        });
        setSslStatus('secured');
      } else {
        setSslProgress(currentVal);
      }
    }, 200);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCpu(prev => {
        const rand = Math.floor(Math.random() * 14) - 7;
        const next = prev + rand;
        return next < 15 ? 15 : next > 85 ? 85 : next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectPlan = (plan: any) => {
    const unitPrice = plan.prices[currency][billingCycle];
    const currencySymbol = currency === 'inr' ? '₹' : '$';
    if (setSelectedPlan) {
      setSelectedPlan({
        ...plan,
        name: plan.name,
        finalPrice: unitPrice,
        cycle: billingCycle,
        currency: currencySymbol,
        features: plan.features
      });
    }
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-brand-light via-white to-slate-50 overflow-hidden">
        
        {/* Subtle Backdrop Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-purple/5 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-indigo-500/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Call To Action Hero Text */}
            <div className="lg:col-span-6 space-y-8 text-center lg:text-left relative z-10">
              
              <div className="inline-flex items-center space-x-2 bg-brand-purple/10 border border-brand-purple/20 px-3.5 py-1.5 rounded-full">
                <Sparkles className="h-4 w-4 text-brand-purple" />
                <span className="text-xs font-semibold text-brand-purple uppercase tracking-wider">
                  Next-Gen Hosting has Arrived
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-slate-900 tracking-tight leading-[1.1]">
                Everything you need to <span className="text-brand-purple relative inline-block">scale online<span className="absolute bottom-1 left-0 w-full h-1 bg-brand-purple/20 rounded"></span></span> fast.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Experience ultra-fast cloud speeds, a built-in Gemini-powered AI web generator, free registrations, and hPanel controls engineered to maximize your conversion rates.
              </p>

              {/* Conversion Metrics */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 py-2">
                <div className="text-center lg:text-left">
                  <div className="font-display font-extrabold text-2xl text-slate-900">140k+</div>
                  <div className="text-xs text-slate-500 mt-1">Sites Powered</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-display font-extrabold text-2xl text-slate-900">0.42s</div>
                  <div className="text-xs text-slate-500 mt-1">First Byte Time</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-display font-extrabold text-2xl text-slate-900">4.9★</div>
                  <div className="text-xs text-slate-500 mt-1">Trustpilot score</div>
                </div>
              </div>

              {/* Dynamic Quick Domain Search Form */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-md max-w-lg mx-auto lg:mx-0">
                <p className="text-[10px] text-brand-purple uppercase font-bold tracking-widest mb-2 font-mono text-left">PROMPT DOMAIN DOMICILE REGISTER (.COM / .IN / .AI)</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const query = form.elements.namedItem('domainSearchInput') as HTMLInputElement;
                    const value = query ? query.value.trim() : '';
                    if (value) {
                      if (setSharedSearchQuery) {
                        setSharedSearchQuery(value);
                      }
                      setActivePage('domain');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="flex gap-2"
                >
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Globe className="h-4 w-4" />
                    </div>
                    <input
                      name="domainSearchInput"
                      type="text"
                      placeholder="Type your ideal domain e.g. rajsahani"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-sm text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#120a2a] hover:bg-brand-purple text-white px-5 rounded-xl font-bold tracking-wide transition-colors flex items-center gap-1.5 shrink-0 text-xs cursor-pointer"
                  >
                    <span>Search</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </form>
              </div>

              {/* Action and Trial Promise */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setActivePage('pricing')}
                  className="w-full sm:w-auto bg-brand-purple hover:bg-brand-purple/95 text-white px-8 py-4 rounded-xl font-bold tracking-wide shadow-xl shadow-brand-purple/20 hover:scale-102 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Select Hosting Plan</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setActivePage('builder')}
                  className="w-full sm:w-auto border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-4 rounded-xl transition-all cursor-pointer text-center"
                >
                  Try AI Builder Demo
                </button>
              </div>

              {/* Bullet Points */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" /> Free Domain & SSL Included
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" /> 30-Day Money-back Guaranteed
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" /> 24/7 Engineers Chat Support
                </span>
              </div>

            </div>

            {/* Interactive Preview Element */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                
                {/* Visual Glow behind container */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/20 to-indigo-500/10 rounded-2xl filter blur-2xl transform rotate-2 pointer-events-none" />

                {/* Dashboard Window Mockup  */}
                <div className="relative rounded-2xl bg-[#0e072b] border border-white/10 shadow-2xl overflow-hidden font-mono text-xs text-slate-300">
                  
                  {/* Window Bar */}
                  <div className="bg-[#09041a] px-4 py-3 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <span className="text-slate-400 font-sans text-[10px] uppercase tracking-wider pl-4">
                        hPanel v2.5 // Active Session
                      </span>
                    </div>
                    <div className="text-[10px] bg-brand-purple/20 text-brand-purple px-2 py-0.5 rounded font-sans border border-brand-purple/30">
                      LIVE SERVER STACK
                    </div>
                  </div>

                  {/* Dashboard Content Grid */}
                  <div className="grid grid-cols-12 md:divide-x md:divide-white/5 h-[340px]">
                    
                    {/* Left Sidebar Menu */}
                    <div className="col-span-4 p-4 space-y-1.5 hidden md:block">
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-sans font-semibold mb-3 px-2">Core Hub</div>
                      <button 
                        onClick={() => setActiveTab('websites')} 
                        className={`w-full text-left p-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'websites' ? 'bg-brand-purple text-white' : 'hover:bg-white/5'}`}
                      >
                        <Globe className="w-3.5 h-3.5 text-[#a855f7]" />
                        <span className="font-sans">My Websites</span>
                      </button>
                      <button 
                        onClick={() => {
                          setActivePage('domain');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                        className="w-full text-left p-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer hover:bg-white/5"
                      >
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-sans font-semibold text-emerald-300">Domain Domicile</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('databases')} 
                        className={`w-full text-left p-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'databases' ? 'bg-brand-purple text-white' : 'hover:bg-white/5'}`}
                      >
                        <HardDrive className="w-3.5 h-3.5" />
                        <span className="font-sans">Database Log</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('security')} 
                        className={`w-full text-left p-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'security' ? 'bg-brand-purple text-white' : 'hover:bg-white/5'}`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span className="font-sans">SSL & Cyber</span>
                      </button>
                      
                      <div className="pt-6">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-sans">
                          <p className="text-[10px] text-slate-400">Memory Pressure</p>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-brand-purple h-full rounded-full" style={{ width: '42%' }} />
                          </div>
                          <p className="text-[9px] text-slate-500 mt-1">42% (3.36 GB / 8 GB)</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Dynamic Terminal Screen */}
                    <div className="col-span-12 md:col-span-8 p-6 flex flex-col justify-between">
                      
                      {/* Interactive Section Panel */}
                      {activeTab === 'databases' && (
                        <div className="space-y-4 font-sans text-xs">
                          <div>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-400/20 uppercase tracking-widest font-mono">
                              Operational
                            </span>
                          </div>
                          <div>
                            <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">PRIMARY CONTAINER INFRASTRUCTURE</div>
                            <div className="text-white text-base font-bold font-display tracking-tight mt-1">Dallas-TX Edge Server</div>
                          </div>
                          
                          {/* Live Telemetry CPU */}
                          <div className="grid grid-cols-2 gap-4 py-1">
                            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                              <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-ping"></span>
                                CPU Core Usage
                              </p>
                              <p className="text-lg font-bold text-white mt-1">{currentCpu}%</p>
                            </div>
                            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                              <p className="text-[10px] text-slate-500 font-mono">Bandwidth (24h)</p>
                              <p className="text-lg font-bold text-white mt-1">842.1 GB</p>
                            </div>
                          </div>

                          {/* Console log snippet */}
                          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-slate-400 space-y-1">
                            <div>$ pstack check status... <span className="text-emerald-400">OK</span></div>
                            <div className="truncate">SSL Verification check passed: TLS 1.3 Active</div>
                            <div className="text-[9px] text-brand-purple">CloudVibe edge network optimized.</div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'websites' && (
                        <div className="space-y-4 font-sans text-xs">
                          <div className="flex items-center justify-between">
                            <div className="text-[10px] text-slate-400 font-semibold uppercase">ACTIVE ECOSYSTEM SITES</div>
                            <span className="text-[9px] text-brand-purple font-mono">100 slots remaining</span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400"><Check className="w-3.5 h-3.5" /></div>
                                <div>
                                  <p className="text-white font-bold text-xs">mycafeshop.com</p>
                                  <p className="text-[10px] text-slate-500">LiteSpeed Cache active</p>
                                </div>
                              </div>
                              <span className="text-xs font-mono text-emerald-400">0.24s</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-amber-500/10 text-amber-400"><Activity className="w-3.5 h-3.5 animate-pulse" /></div>
                                <div>
                                  <p className="text-white font-bold text-xs">brandagency.net</p>
                                  <p className="text-[10px] text-slate-500">Gemini Builder template draft</p>
                                </div>
                              </div>
                              <span className="text-xs font-mono text-amber-400">DNS Config</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => setActivePage('builder')}
                            className="w-full py-2 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl text-center text-xs font-semibold cursor-pointer transition-colors"
                          >
                            + Launch New Website
                          </button>
                        </div>
                      )}

                      {activeTab === 'security' && (
                        <div className="space-y-4 font-sans text-xs">
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">SECURITY CORE</div>
                          
                          <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 space-y-2">
                            <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4" />
                              Active Security Engine Live
                            </p>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              Weekly malware scanners and dynamic Web Application Firewalls (WAF) are fully armed. Zero alerts recorded in last 30 days.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">Cloud Backups</span>
                              <span className="text-emerald-400 font-semibold font-mono">Daily / Synced</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">DDoS Mitigation Stack</span>
                              <span className="text-emerald-400 font-semibold font-mono">Armed (10 Gbps)</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Micro interaction selector */}
                      <div className="font-sans text-[10px] text-slate-500 flex justify-between border-t border-white/5 pt-4">
                        <span>Database Node: Cloud-TX-1</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Connected Securely</span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUSTED BY SECTION */}
      <section className="bg-white border-y border-slate-100 py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
            Trusted by developers and fast growing platforms worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-70">
            {companyLogos.map((logo) => (
              <span key={logo.name} className={`${logo.font} text-base sm:text-lg cursor-pointer hover:opacity-100 transition-opacity`}>
                {logo.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-brand-purple border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Superior Infrastructure
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight">
            Designed for Absolute Conversion and Velocity
          </h2>
          
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base mt-2.5">
            Forget outdated hosting configurations. We deploy customizable server cores fueled by modern web technology.
          </p>

          {/* Grid Layout of Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white hover:bg-brand-purple/5 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group duration-300 relative text-left"
                >
                  <div className="absolute top-4 right-4 text-[9px] font-bold text-brand-purple uppercase bg-brand-purple/15 px-2 py-0.5 rounded">
                    {feat.badge}
                  </div>
                  <div className="p-3 w-12 h-12 rounded-xl bg-brand-purple/5 text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all shadow-md flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 group-hover:text-brand-purple text-lg mt-6 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-brand-purple border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Cheaper & Better Plans &bull; Sasta Aur Acha
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight mb-4">
            Select Your Subscription Billing Cycle
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
            Choose longer plans for maximum savings. All plans include automated sandbox containment, premium speed optimization, and secure databases.
          </p>

          {/* Currency Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setCurrency('inr')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${currency === 'inr' ? 'bg-white text-[#120a2a] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <span>🇮🇳</span> <span>₹ INR (Rupees)</span>
              </button>
              <button
                onClick={() => setCurrency('usd')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${currency === 'usd' ? 'bg-white text-[#120a2a] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <span>🇺🇸</span> <span>$ USD (Dollars)</span>
              </button>
            </div>
          </div>

          {/* Billing Cycle Period Selection Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-16 max-w-4xl mx-auto bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setBillingCycle('1month')}
              className={`flex-1 min-w-[110px] px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${billingCycle === '1month' ? 'bg-[#120a2a] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              1 Month
            </button>
            <button 
              onClick={() => setBillingCycle('6months')}
              className={`flex-1 min-w-[110px] px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${billingCycle === '6months' ? 'bg-[#120a2a] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              6 Months
              <span className="block text-[8px] text-amber-500 font-black uppercase mt-0.5">Save ~25%</span>
            </button>
            <button 
              onClick={() => setBillingCycle('12months')}
              className={`flex-1 min-w-[110px] px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${billingCycle === '12months' ? 'bg-[#120a2a] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              12 Months (1 Year)
              <span className="block text-[8px] text-emerald-500 font-black uppercase mt-0.5">Save ~40%</span>
            </button>
            <button 
              onClick={() => setBillingCycle('24months')}
              className={`flex-1 min-w-[110px] px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${billingCycle === '24months' ? 'bg-[#120a2a] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              24 Months (2 Years)
              <span className="block text-[8px] text-emerald-500 font-black uppercase mt-0.5">Save ~60%</span>
            </button>
            <button 
              onClick={() => setBillingCycle('48months')}
              className={`flex-1 min-w-[130px] px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer relative ${billingCycle === '48months' ? 'bg-[#120a2a] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
            >
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-[8px] leading-none text-white font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">BEST VALUE</span>
              48 Months (4 Years)
              <span className="block text-[8px] text-indigo-500 font-black uppercase mt-0.5">Best Sasta Rate</span>
            </button>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {plans.map((p, pidx) => {
              const unitPrice = p.prices[currency][billingCycle];
              const symbol = currency === 'inr' ? '₹' : '$';
              const monthsCount = billingCycle === '1month' ? 1 : billingCycle === '6months' ? 6 : billingCycle === '12months' ? 12 : billingCycle === '24months' ? 24 : 48;
              const totalPrice = parseFloat((unitPrice * monthsCount).toFixed(2));
              
              const regPrice = p.regPrice[currency];
              let discountText = null;
              if (billingCycle === '6months') discountText = '25% off';
              else if (billingCycle === '12months') discountText = '40% off';
              else if (billingCycle === '24months') discountText = '60% off';
              else if (billingCycle === '48months') discountText = p.percentageOff;

              return (
                <div 
                  key={pidx} 
                  className={`rounded-2xl p-6 text-left transition-all relative flex flex-col justify-between overflow-hidden border ${
                    p.popular 
                      ? 'bg-[#120a2a] text-white border-2 border-brand-purple shadow-2xl scale-102 z-10' 
                      : 'bg-white text-slate-800 border-slate-200 shadow-sm hover:border-indigo-200'
                  }`}
                >
                  {p.popular && (
                    <div className="absolute top-0 right-0 bg-brand-purple text-white text-[8px] font-black uppercase py-1 px-3 rounded-bl-xl tracking-wider">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-display font-extrabold text-lg tracking-tight">{p.name}</h3>
                      {discountText && (
                        <span className="bg-red-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider shadow-xs animate-pulse">
                          {discountText}
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-xs ${p.popular ? 'text-slate-400' : 'text-slate-500'} leading-relaxed min-h-[32px] font-medium`}>
                      {p.desc}
                    </p>
                    
                    {/* Digital Price */}
                    <div className="pt-2">
                      <div className="flex items-center gap-1.5 h-4 mb-0.5">
                        {discountText && (
                          <span className={`text-[9.5px] font-mono ${p.popular ? 'text-slate-400' : 'text-slate-400'} line-through`}>
                            {symbol}{regPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-display font-black tracking-tight">
                          {symbol}{unitPrice}
                        </span>
                        <span className={`text-xs ${p.popular ? 'text-slate-400' : 'text-slate-500'} font-bold`}>
                          /mo
                        </span>
                      </div>
                      
                      <div className={`mt-3 text-[10px] leading-relaxed p-2.5 rounded-xl border ${
                        p.popular 
                          ? 'bg-indigo-950/50 text-indigo-300 border-indigo-900' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      } font-extrabold`}>
                        {billingCycle === '48months' ? p.notes[currency] : (
                          <span>Get {monthsCount} months for {symbol}{totalPrice.toLocaleString()} (renews at {symbol}{Math.round(unitPrice * 1.35)}/mo).</span>
                        )}
                      </div>
                    </div>

                    <p className={`text-[9.5px] font-mono ${p.popular ? 'text-brand-purple' : 'text-[#120a2a]'} font-extrabold py-1 border-b border-slate-100 uppercase tracking-widest`}>
                      Guaranteed SLA Performance
                    </p>

                    {/* Feature Lists */}
                    <ul className="space-y-3 py-1 text-xs font-medium">
                      {p.features.map((feat, fidx) => {
                        const isPremiumHighlight = feat.includes("FREE") || feat.includes("NEW");
                        return (
                          <li key={fidx} className="flex items-start gap-2.5">
                            <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className={`leading-normal ${isPremiumHighlight ? 'text-emerald-500 font-extrabold' : ''}`}>
                              {feat}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="pt-5">
                    <button
                      onClick={() => handleSelectPlan(p)}
                      className={`w-full py-3.5 rounded-xl text-center text-xs font-black tracking-wider cursor-pointer transform hover:scale-[1.01] active:scale-95 transition-all uppercase ${
                        p.popular 
                          ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20 hover:bg-brand-purple/90' 
                          : 'bg-slate-900 text-white hover:bg-[#120a2a] shadow-sm'
                      }`}
                    >
                      CHOOSE PLAN
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-brand-purple border border-indigo-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Customer feedback
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight mb-12">
            Why 40,000+ Teams Love CloudVibe
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, tidx) => (
              <div key={tidx} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-left relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm italic leading-relaxed">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6">
                  <h4 className="font-display font-bold text-slate-900 text-sm">{test.name}</h4>
                  <p className="text-xs text-slate-500">{test.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5.5 CUSTOMER SECURITY & TRUST CYBERSECURITY VAULT */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] bg-indigo-50 text-[#5b36ff] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest font-mono">
              100% Secure & Compliant Hosting
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight">
              Enterprise CyberSecurity & Global Trust Safeguards
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We protect your digital sovereignty with active firewalls, transparent military-grade encryption, and refund compliance guarantees. Try our Live Trust Diagnostic below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Interactive SSL diagnostic tool */}
            <div className="lg:col-span-7 bg-white border border-indigo-100/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 text-[#5b36ff]">
                  <ShieldCheck className="w-5 h-5 shrink-0 animate-pulse" />
                  <span className="font-mono text-xs uppercase font-black tracking-widest">Interactive SSL & WAF Trust Diagnostic</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter any domain name or website URL (e.g. yourcompany.com) to simulate a deep security transaction diagnostic against our CloudVibe defensive clusters.
                </p>

                <form onSubmit={runSslDiagnosticTest} className="flex gap-2">
                  <input
                    type="text"
                    value={sslInputUrl}
                    onChange={(e) => setSslInputUrl(e.target.value)}
                    placeholder="Enter domain name e.g. mysite.com"
                    required
                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#5b36ff]"
                  />
                  <button
                    type="submit"
                    disabled={sslStatus === 'testing'}
                    className="bg-[#120a2a] hover:bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-colors whitespace-nowrap"
                  >
                    {sslStatus === 'testing' ? 'Querying TLS...' : 'Query SSL Security'}
                  </button>
                </form>

                {/* Progress bar */}
                {sslStatus === 'testing' && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-550 font-bold">
                      <span>Simulating Handshake & SSL verification...</span>
                      <span>{sslProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 transition-all duration-150" style={{ width: `${sslProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Results Screen */}
                {sslStatus === 'secured' && sslVerifiedDetails && (
                  <div className="p-4 bg-slate-900 text-slate-350 rounded-2xl font-mono text-[10.5px] space-y-2 border border-white/5 animate-fade-in text-left">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-emerald-400 font-black flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        ✓ CONNECTION SECURED & VERIFIED
                      </span>
                      <span className="text-slate-500 select-none text-[8.5px]">TLSv1.3 ACTIVE</span>
                    </div>
                    <div><span className="text-indigo-400 font-bold">DNS Target Key:</span> {sslVerifiedDetails.domain}</div>
                    <div><span className="text-indigo-400 font-bold">Trusted CA:</span> {sslVerifiedDetails.issuer}</div>
                    <div><span className="text-indigo-400 font-bold">Encryption Stack:</span> {sslVerifiedDetails.encryption}</div>
                    <div><span className="text-indigo-400 font-bold">Algorithm Strength:</span> {sslVerifiedDetails.keySize}</div>
                    <div><span className="text-indigo-400 font-bold">SLA Audit Standards:</span> {sslVerifiedDetails.compliance}</div>
                    <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-white/5 text-[9.5px]">
                      <div><span className="text-slate-400">Issued:</span> {sslVerifiedDetails.issuedAt}</div>
                      <div><span className="text-slate-400">Expiry:</span> {sslVerifiedDetails.expiryAt}</div>
                    </div>
                    <div className="text-[9.5px] text-emerald-450 font-extrabold pt-1">
                      🛡️ {sslVerifiedDetails.wafStatus}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Diagnostic Authority: Comodo Sec & Let&apos;s Encrypt</span>
                <span className="text-slate-950 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Active Defence Status
                </span>
              </div>
            </div>

            {/* Shield and Guarantee Highlights Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              
              <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-6 flex items-start gap-4 text-left">
                <div className="p-3 bg-emerald-500/15 rounded-2xl text-emerald-600 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-display font-black text-slate-900">30-Day Happiness Guarantee</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Zero risk checkout policy standard. If our server speeds, latency scores, or AI builder do not satisfy your corporate expectations, get a complete refund inside 30 days. No inquiries asked.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-3xl p-6 flex items-start gap-4 text-left">
                <div className="p-3 bg-indigo-500/15 rounded-2xl text-indigo-600 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-display font-black text-slate-900">End-to-End Payment Tokenisation</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We fully protect card transactions via Stripe and UPI Razorpay gateway layers. We do not persist actual credentials on our hosting servers, staying compliant with PCI-DSS.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-3xl p-6 flex items-start gap-4 text-left">
                <div className="p-3 bg-purple-500/15 rounded-2xl text-purple-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-display font-black text-slate-900">ICANN Accredited Registrar proxy</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    All searched domains check the official ICANN dns zones in real-time. Free WHOIS Privacy shield is mapped to block third-party marketing trackers and spam harvesters.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. STATISTICS COUNTER */}
      <section className="bg-brand-purple py-16 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display font-black text-4xl sm:text-5xl">99.99%</div>
              <p className="text-sm text-brand-light/80 uppercase tracking-widest font-mono mt-1.5">GUARANTEED UP-TIME</p>
            </div>
            <div>
              <div className="font-display font-black text-4xl sm:text-5xl">&lt; 0.24s</div>
              <p className="text-sm text-brand-light/80 uppercase tracking-widest font-mono mt-1.5">GLOBAL SERVER RESPONSE</p>
            </div>
            <div>
              <div className="font-display font-black text-4xl sm:text-5xl">40k+</div>
              <p className="text-sm text-brand-light/80 uppercase tracking-widest font-mono mt-1.5">ACTIVE BUSINESS CUSTOMERS</p>
            </div>
            <div>
              <div className="font-display font-black text-4xl sm:text-5xl">20+</div>
              <p className="text-sm text-brand-light/80 uppercase tracking-widest font-mono mt-1.5">GLOBAL EDGE EDGE LOCATIONS</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="py-20 bg-white relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 mb-12">
            Have questions about hosting, registration pricing, or scaling database memories? Find answers instantly below.
          </p>

          <div className="text-left space-y-4">
            {FAQs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left font-semibold text-slate-800 hover:text-brand-purple cursor-pointer transition-colors outline-none"
                >
                  <span className="text-sm sm:text-base font-display">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-brand-purple' : ''}`} />
                </button>
                
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-200/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="bg-[#120a2a] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex p-3 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple mb-2">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-tight">
            Deploy Your Brand Ecosystem On Ultra Speed Servers
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Take advantage of active cybersecurity DDoS firewalls, standard premium caching, DNS control tools, and our advanced Gemini AI generator at zero extra cost. Guaranteed support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActivePage('pricing')}
              className="w-full sm:w-auto bg-brand-purple hover:bg-brand-purple/90 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-brand-purple/20 transition-all cursor-pointer text-center text-sm"
            >
              Get Your Cloud Plan Now
            </button>
            <button
              onClick={() => setActivePage('contact')}
              className="w-full sm:w-auto border border-white/20 hover:bg-white/5 text-white font-semibold px-8 py-4 rounded-xl transition-all cursor-pointer text-center text-sm"
            >
              Consult Server Engineer
            </button>
          </div>
          <p className="text-xs text-slate-500 font-mono">
            * 30-Day Money back satisfaction guarantee standard on all hosting packages.
          </p>
        </div>
      </section>

    </div>
  );
}

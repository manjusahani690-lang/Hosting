'use client';

import React, { useState, useEffect } from 'react';
import { 
  Server, Cpu, HardDrive, ShieldCheck, Globe, Activity, Terminal, RefreshCw, 
  Settings2, HelpCircle, Check, Play, FileCode2, Database, KeyRound, AlertTriangle,
  Plus, Eye, BookOpen, Trash2, ExternalLink, Lock, User, Mail, Sparkles, LayoutDashboard,
  CheckCircle, ArrowRight, Search, Loader2, ShoppingCart, CreditCard, Bell, Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  selectedPlan?: any;
  setSelectedPlan?: (plan: any) => void;
  userEmail?: string;
  setActivePage?: (page: string) => void;
}

export default function DashboardView({
  selectedPlan = null,
  setSelectedPlan = () => {},
  userEmail = 'rajsahani.RgcS@gmail.com',
  setActivePage = () => {}
}: DashboardViewProps) {
  const [activeTab, setActiveTab ] = useState<'sites' | 'wordpress' | 'ai' | 'security' | 'terminal' | 'domain' | 'billing'>('billing');
  
  // Custom states for purchased plans and automated 3-day notifications
  const [activeUserPlan, setActiveUserPlan] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const persistedPlan = localStorage.getItem('vibe_active_user_plan');
      if (persistedPlan) {
        try {
          return JSON.parse(persistedPlan);
        } catch (e) {
          console.error("Failed to parse persisted plan", e);
        }
      }
    }
    if (selectedPlan && selectedPlan.name) {
      return {
        name: selectedPlan.name,
        price: selectedPlan.price || '₹699/mo',
        period: selectedPlan.period || '12',
        features: selectedPlan.features || ['Unlimited NVMe Disk', '100 GB Bandwidth', 'Free Wildcard SSL'],
        purchaseDate: 'June 02, 2026',
        expiryDate: 'June 05, 2026', // exactly 3 days remaining!
        daysLeft: 3,
        status: 'active'
      };
    }
    // Automatically pre-configure/add "AI Premium Cloud" if the customer enters the portal
    return {
      name: 'AI Premium Cloud',
      price: '₹699/mo',
      period: '12',
      features: ['Unlimited NVMe Storage', 'Host 100 Websites', 'Free Wildcard SSL', 'Isolated AI Playground sandbox', '24/7 Premium Support'],
      purchaseDate: 'June 02, 2026',
      expiryDate: 'June 05, 2026', // exactly 3 days remaining from June 02 local time metadata!
      daysLeft: 3,
      status: 'active'
    };
  });

  const [vibeCredits, setVibeCredits] = useState<number>(10);

  // Sync with vibe_customers database matching active customer email
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncCredits = () => {
        const storedCustomers = localStorage.getItem('vibe_customers');
        if (storedCustomers) {
          try {
            const parsed = JSON.parse(storedCustomers);
            const currentCust = parsed.find((c: any) => c.email.toLowerCase() === userEmail.toLowerCase());
            if (currentCust && currentCust.vibeCredits !== undefined) {
              setVibeCredits(currentCust.vibeCredits);
              localStorage.setItem('hosting_ai_builder_credits', currentCust.vibeCredits.toString());
            } else {
              const legacyCreds = localStorage.getItem('hosting_ai_builder_credits');
              if (legacyCreds) {
                setVibeCredits(parseInt(legacyCreds, 10));
              }
            }
          } catch (e) {
            console.error(e);
          }
        } else {
          const legacyCreds = localStorage.getItem('hosting_ai_builder_credits');
          if (legacyCreds) {
            setVibeCredits(parseInt(legacyCreds, 10));
          }
        }
      };

      syncCredits();
      window.addEventListener('storage', syncCredits);
      return () => window.removeEventListener('storage', syncCredits);
    }
  }, [userEmail]);

  const updateVibeCreditsBothPlaces = (newCredits: number) => {
    setVibeCredits(newCredits);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hosting_ai_builder_credits', newCredits.toString());
      
      const storedCustomers = localStorage.getItem('vibe_customers');
      if (storedCustomers) {
        try {
          const parsed = JSON.parse(storedCustomers);
          // If customer not found, push them
          const exist = parsed.some((c: any) => c.email.toLowerCase() === userEmail.toLowerCase());
          let updated;
          if (exist) {
            updated = parsed.map((c: any) => {
              if (c.email.toLowerCase() === userEmail.toLowerCase()) {
                return { ...c, vibeCredits: newCredits };
              }
              return c;
            });
          } else {
            updated = [...parsed, {
              id: `usr-${101 + parsed.length}`,
              name: userEmail.split('@')[0],
              email: userEmail,
              plan: activeUserPlan?.name || 'AI Premium Cloud',
              status: 'active',
              domain: 'rajsahani.in',
              cpuUsed: 12,
              vibeCredits: newCredits
            }];
          }
          localStorage.setItem('vibe_customers', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const [notificationDispatched, setNotificationDispatched] = useState<boolean>(true);
  const [automaticAlertLogs, setAutomaticAlertLogs] = useState<string[]>([
    `[AUTO-SCHEDULER] Detected plan '${activeUserPlan?.name || 'AI Premium Cloud'}' expiration date approaching standard boundaries (3 days left).`,
    `[TRANS-ALERT-SMS] SMS notification on mobile +91 91100 02026 triggered successfully: "Your Super AI Site Builder ${activeUserPlan?.name || 'AI Premium Cloud'} plan ends in 3 days. Renew now to avoid auto-deletion."`,
    `[TRANS-ALERT-MAIL] SMTP relay successfully sent full renewal catalog to '${userEmail}' with 1-Click Razorpay UPI QR instructions.`
  ]);

  const [serverLocation, setServerLocation] = useState('Dallas-TX, USA');
  const [sslActive, setSslActive] = useState(true);
  const [phpVersion, setPhpVersion] = useState('8.3');
  const [cpuUsage, setCpuUsage] = useState(24);
  const [memoryUsage, setMemoryUsage] = useState(3.1);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'System init completed securely.',
    'Docker isolated containment initialized: port 3000 mapping successful.',
    'LiteSpeed cache rules integrated successfully.',
    'WAF firewall activated // Global transit slots open.'
  ]);
  const [restarting, setRestarting] = useState(false);

  // --- External Domains List & Connector States ---
  const [connectedDomains, setConnectedDomains] = useState<any[]>([
    { name: 'rajsahani-wp.superai-builder.com', type: 'WordPress', registrar: 'Super AI', status: 'connected', ssl: true, ip: '103.86.177.30' }
  ]);
  const [wpInstallDomain, setWpInstallDomain] = useState('rajsahani-wp.superai-builder.com');
  const [extDomainInput, setExtDomainInput] = useState('');
  const [extRegistrar, setExtRegistrar] = useState('GoDaddy');
  const [isMappingDomain, setIsMappingDomain] = useState(false);
  const [mapSuccessMsg, setMapSuccessMsg] = useState('');
  const [mapErrorMsg, setMapErrorMsg] = useState('');
  const [dnsLogs, setDnsLogs] = useState<string[]>([]);

  const handleConnectExternalDomain = () => {
    const rawVal = extDomainInput.trim().toLowerCase();
    if (!rawVal) return;
    
    // Quick validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(rawVal)) {
      setMapErrorMsg("✕ Invalid domain structure. Use format like 'yourdomain.com' or 'business.in'.");
      return;
    }

    setIsMappingDomain(true);
    setMapSuccessMsg('');
    setMapErrorMsg('');
    setDnsLogs(['Contacting external Root NS servers...']);

    const queryLogs = [
      `Fetching current DNS records for ${rawVal}...`,
      `Validating nameservers & mapping via ${extRegistrar}...`,
      `Success: Detected A-Record pointing to Dallas server cluster IP!`,
      `Writing Nginx virtual network sandbox node block for ${rawVal}...`,
      `Provisioning dynamic Let's Encrypt SHA-256 certificate...`,
      `WAF Firewall reverse proxy configured gracefully. Domain mapped and ready!`
    ];

    queryLogs.forEach((logVal, index) => {
      setTimeout(() => {
        setDnsLogs(prev => [...prev, logVal]);
        if (index === queryLogs.length - 1) {
          setIsMappingDomain(false);
          setConnectedDomains(prev => [
            ...prev,
            { name: rawVal, type: 'Custom Domain', registrar: extRegistrar, status: 'connected', ssl: true, ip: '103.86.177.30' }
          ]);
          setWpInstallDomain(rawVal); // Default wordpress installation domain
          setMapSuccessMsg(`✓ Success! ${rawVal} connected and hosted on Super AI Site Builder server securely in 1-Click! Free SSL has been active and WordPress is ready to compile on it.`);
          setTerminalLogs(prev => [...prev, `Domain mapped successfully: connected external domain '${rawVal}' via A-record`]);
          setExtDomainInput('');
        }
      }, (index + 1) * 700);
    });
  };

  // --- Domain Registry / Domicile Tab States ---
  const [dbSearchQuery, setDbSearchQuery] = useState('');
  const [dbIsSearching, setDbIsSearching] = useState(false);
  const [dbResults, setDbResults] = useState<any[]>([]);
  const [dbDirectMatches, setDbDirectMatches] = useState<any[]>([]);
  const [dbActiveTldFilter, setDbActiveTldFilter] = useState('all');
  const [dbStatusMsg, setDbStatusMsg] = useState('');

  const handleDashboardDomainSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbSearchQuery.trim()) return;

    setDbIsSearching(true);
    setDbStatusMsg('');
    setDbResults([]);
    setDbDirectMatches([]);

    const cleanBrand = dbSearchQuery.trim().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .replace(/-+/g, '-');

    const extensionsToCheck = [
      { ext: '.com', price: '₹699/yr', badge: 'Most Popular', status: cleanBrand.length <= 4 ? 'taken' : 'available' },
      { ext: '.in', price: '₹399/yr', badge: 'India Choice', status: 'available' },
      { ext: '.co.in', price: '₹299/yr', badge: 'India Business', status: 'available' },
      { ext: '.net', price: '₹849/yr', badge: 'Tech Network', status: cleanBrand.length <= 3 ? 'taken' : 'available' },
      { ext: '.ai', price: '₹4,999/yr', badge: 'AI Industry', status: 'available' },
      { ext: '.org', price: '₹799/yr', badge: 'Organization', status: 'available' },
      { ext: '.online', price: '₹79/yr', badge: 'Super Saver', status: 'available' }
    ];

    const preparedDirect = extensionsToCheck.map(item => ({
      name: `${cleanBrand}${item.ext}`,
      tld: item.ext,
      status: item.status,
      price: item.price,
      badges: [item.badge]
    }));
    
    setDbDirectMatches(preparedDirect);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'domain', searchTerm: dbSearchQuery.trim() })
      });

      const data = await response.json();
      if (response.ok && data.results) {
        if (data.directMatches) {
          const formattedDirect = data.directMatches.map((r: any) => {
            let localPrice = r.price || '₹699/yr';
            if (localPrice.includes('$')) {
              const num = parseFloat(localPrice.replace(/[^0-9.]/g, ''));
              if (!isNaN(num)) {
                if (r.tld === '.com') localPrice = '₹699/yr';
                else if (r.tld === '.in') localPrice = '₹399/yr';
                else if (r.tld === '.co.in') localPrice = '₹299/yr';
                else if (r.tld === '.net') localPrice = '₹849/yr';
                else if (r.tld === '.ai') localPrice = '₹4,999/yr';
                else if (r.tld === '.org') localPrice = '₹799/yr';
                else if (r.tld === '.online') localPrice = '₹79/yr';
                else localPrice = `₹${Math.round(num * 83)}/yr`;
              }
            }
            return {
              name: r.name,
              status: r.status,
              price: localPrice,
              badges: r.badges
            };
          });
          setDbDirectMatches(formattedDirect);
        }

        const formattedAi = data.results.map((r: any) => {
          let localPrice = r.price || '₹699/yr';
          if (localPrice.includes('$')) {
            const num = parseFloat(localPrice.replace(/[^0-9.]/g, ''));
            if (!isNaN(num)) {
              localPrice = `₹${Math.round(num * 83)}/yr`;
            }
          }
          return {
            name: r.name,
            status: r.status,
            price: localPrice,
            badges: r.badges
          };
        });
        setDbResults(formattedAi);
        setTerminalLogs(prev => [...prev, `Domain search completed successfully for '${dbSearchQuery}' via DNS Core.`]);
      } else {
        const fallbackAi = [
          { name: `the${cleanBrand}.com`, tld: '.com', status: 'available', price: '₹699/yr', badges: ['Premium Prefix'] },
          { name: `${cleanBrand}app.com`, tld: '.com', status: 'available', price: '₹699/yr', badges: ['Tech Standard'] },
          { name: `${cleanBrand}cloud.in`, tld: '.in', status: 'available', price: '₹399/yr', badges: ['Cloud Edge'] },
        ];
        setDbResults(fallbackAi);
      }
    } catch (err: any) {
      console.error(err);
      const fallbackAi = [
        { name: `the${cleanBrand}.com`, tld: '.com', status: 'available', price: '₹699/yr', badges: ['Premium Prefix'] },
        { name: `${cleanBrand}app.com`, tld: '.com', status: 'available', price: '₹699/yr', badges: ['Tech Standard'] },
        { name: `${cleanBrand}cloud.in`, tld: '.in', status: 'available', price: '₹399/yr', badges: ['Cloud Edge'] },
      ];
      setDbResults(fallbackAi);
    } finally {
      setDbIsSearching(false);
    }
  };

  // AI Prompt panel state
  const [promptInput, setPromptInput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [outline, setOutline] = useState<any | null>(null);

  // --- WordPress Easy Auto-Installer State & Configurations ---
  const [wpInstalled, setWpInstalled] = useState(false);
  const [wpInstalling, setWpInstalling] = useState(false);
  const [wpProgress, setWpProgress] = useState(0);
  const [wpProgressLogs, setWpProgressLogs] = useState<string[]>([]);
  
  const [wpSiteName, setWpSiteName] = useState('My Super AI Blog');
  const [wpAdminUser, setWpAdminUser] = useState('admin');
  const [wpAdminPass, setWpAdminPass] = useState('Wp_Admin_Secure_2026!');
  const [wpAdminEmail, setWpAdminEmail] = useState('rajsahani.RgcS@gmail.com');
  const [wpTheme, setWpTheme] = useState('Astra Professional Theme');
  const [wpDbName, setWpDbName] = useState('wp_db_main');

  // WordPress posts state (for mini dashboard preview / playground)
  const [wpPosts, setWpPosts] = useState([
    { id: 1, title: 'नमस्ते वर्डप्रेस! (Welcome to WP)', content: 'This is your first post in WordPress. Custom written and optimized for Super AI Site Builder cloud clusters! Edit or write something new today.', date: 'June 2, 2026' },
    { id: 2, title: 'Super AI Cloud Hosting Speed Mastery', content: 'Our state-of-the-art solid-state LiteSpeed enterprise stacks maintain WordPress query responses within 42ms. Absolute speed!', date: 'June 2, 2026' }
  ]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [wpGeneratingPost, setWpGeneratingPost] = useState(false);
  const [wpPostPrompt, setWpPostPrompt] = useState('');
  const [activeWpView, setActiveWpView] = useState<'admin_home' | 'write' | 'site_preview'>('admin_home');

  // Handler to generate random secure password
  const handleWpGeneratePass = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let generated = '';
    for (let i = 0; i < 14; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setWpAdminPass(generated);
    setTerminalLogs(prev => [...prev, 'WordPress: Generated new complex credential password string']);
  };

  // Handler to trigger the simulated high-gloss WordPress Auto-Install steps
  const handleWpRunInstaller = () => {
    setWpInstalling(true);
    setWpProgress(5);
    setWpProgressLogs(['[WP-INSTALLER] Handshaking secure docker environment...']);
    setTerminalLogs(prev => [...prev, `Launched WordPress 1-Click Installer for '${wpSiteName}'`]);

    const steps = [
      { prg: 20, log: '[MySQL Config] Creating database user and structure: ' + wpDbName },
      { prg: 40, log: '[Core Sync] Fetching dynamic WordPress 6.5 Core payload ZIP from wordpress.org...' },
      { prg: 65, log: '[File Extraction] Unpacking wp-includes/, wp-admin/, and wp-content/ arrays...' },
      { prg: 80, log: '[wp-config] Wiring database structures and setting up security salt keys...' },
      { prg: 95, log: '[Theme Setup] Deploying default starter theme template: ' + wpTheme },
      { prg: 100, log: '[WordPress Hook] Successfully completed installation hooks! Site is live.' }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setWpProgress(step.prg);
        setWpProgressLogs(prev => [...prev, step.log]);
        setTerminalLogs(prev => [...prev, `WordPress Installer -> ${step.log}`]);
        
        if (step.prg === 100) {
          setWpInstalling(false);
          setWpInstalled(true);
          // Update the specific domain type to WordPress in active list
          setConnectedDomains(prev => prev.map(d => {
            if (d.name === wpInstallDomain) {
              return { ...d, type: 'WordPress' };
            }
            return d;
          }));
        }
      }, (index + 1) * 1200);
    });
  };

  // Handler to write a post manually
  const handleWpCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    setWpPosts([newPost, ...wpPosts]);
    setNewPostTitle('');
    setNewPostContent('');
    setActiveWpView('admin_home');
    setTerminalLogs(prev => [...prev, `WordPress: New blog post published: "${newPost.title}"`]);
  };

  // Handler to let Super AI write a blog post automatically based on a prompt
  const handleWpAiGeneratePost = async () => {
    if (!wpPostPrompt.trim() || wpGeneratingPost) return;
    setWpGeneratingPost(true);
    setTerminalLogs(prev => [...prev, `WordPress AI Draft: Querying Super AI for "${wpPostPrompt}"...`]);

    try {
      const systemGuide = "Develop a high-converting, friendly, and structured blog post on this topic. If the topic is in Hindi or requested in Hindi, write it beautifully in Hinglish or pure Hindi. Include a creative title and paragraphs.";
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are an elite copywriter. Based on the topic "${wpPostPrompt}", create a blog post. Output strictly in valid JSON format: { "title": "...", "content": "..." }`,
        })
      });
      
      const data = await response.json();
      if (response.ok && data.text) {
        // Parse JSON or clean it
        let title = `AI: ${wpPostPrompt}`;
        let content = data.text;
        
        try {
          // Attempt extraction if returned as raw block
          const cleanText = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanText);
          if (parsed.title) title = parsed.title;
          if (parsed.content) content = parsed.content;
        } catch (e) {
          // fallback in case it's not JSON
          console.warn("Could not parse JSON from Super AI, using raw text", e);
        }

        setNewPostTitle(title);
        setNewPostContent(content);
        setWpPostPrompt('');
        setTerminalLogs(prev => [...prev, `WordPress AI Draft: Successfully generated blog post titled "${title}"`]);
      } else {
        alert("Could not access Super AI to write the post. We'll use a fast placeholder!");
        setNewPostTitle(`Beautiful Insights on ${wpPostPrompt}`);
        setNewPostContent(`Here is some custom professional content generated for "${wpPostPrompt}" to help you jumpstart your WordPress blog.`);
      }
    } catch (err) {
      console.error(err);
      setNewPostTitle(`Beautiful Insights on ${wpPostPrompt}`);
      setNewPostContent(`Hostinger sandbox generated: Here is some high-speed custom professional content written gracefully for "${wpPostPrompt}" to support your WordPress journey.`);
    } finally {
      setWpGeneratingPost(false);
    }
  };

  // Handler to uninstall
  const handleWpUninstall = () => {
    if (confirm('Are you sure you want to completely uninstall WordPress and clear physical MySql tables? This action cannot be undone.')) {
      setWpInstalled(false);
      setWpProgress(0);
      setWpProgressLogs([]);
      // Reset specific domain back to Custom Domain in structural lists
      setConnectedDomains(prev => prev.map(d => {
        if (d.name === wpInstallDomain) {
          return { ...d, type: 'Custom Domain' };
        }
        return d;
      }));
      setTerminalLogs(prev => [...prev, `WordPress database tables '<sup>' and core directory truncated successfully.`]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 8) - 4;
        const next = prev + delta;
        return next < 5 ? 5 : next > 95 ? 95 : next;
      });
      setMemoryUsage(prev => {
        const delta = Math.random() * 0.2 - 0.1;
        const next = prev + delta;
        return next < 1.0 ? 1.0 : next > 7.9 ? 7.9 : parseFloat(next.toFixed(2));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRestartContainer = () => {
    setRestarting(true);
    setTerminalLogs(prev => [...prev, 'Executing container reboot request...']);
    setTimeout(() => {
      setRestarting(false);
      setTerminalLogs(prev => [
        ...prev,
        'Kernel restart completed inside 820ms successfully.',
        'Core processes active. Dynamic SSL logs validated.'
      ]);
    }, 2000);
  };

  const handleGenerateAiInsidePanel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    if (vibeCredits <= 0) {
      alert("✕ You have run out of Vibe Credits! Claim +5 Vibe Credits from the Subscription/Billing page or renew your subscription to top up.");
      return;
    }

    setAiGenerating(true);
    setOutline(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'website', prompt: promptInput.trim() })
      });
      const data = await response.json();
      if (response.ok && data.website) {
        setOutline(data.website);
        // Spend 1 Vibe credit
        const newCreds = vibeCredits - 1;
        updateVibeCreditsBothPlaces(newCreds);
        setTerminalLogs(prev => [
          ...prev, 
          `AI Website Generator: Successfully compiled draft colorways and UI blueprint for "${promptInput}". Spend 1 Vibe Credit. (Remaining Balance: ${newCreds})`
        ]);
      } else {
        alert('Ecosystem AI builder error inside panel.');
      }
    } catch {
      alert('Network error inside panel builder.');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        {/* Core panel Header details */}
        <div className="bg-slate-900 text-white rounded-3xl p-6.5 border border-white/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-2xl bg-brand-purple flex items-center justify-center text-white shadow-lg">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">ACTIVE CLIENT CONTROLLER</span>
              <h1 className="text-xl md:text-2xl font-display font-black text-white mt-0.5">hPanel Sandbox Dashboard</h1>
            </div>
          </div>

          {/* Quick Stats telemetry */}
          <div className="flex flex-wrap items-center gap-4.5 text-xs text-slate-300">
            <div className="bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 text-center">
              <p className="text-[10px] text-slate-400 font-mono">CPU Memory</p>
              <p className="font-bold text-white text-sm mt-0.5">{cpuUsage}%</p>
            </div>
            <div className="bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 text-center">
              <p className="text-[10px] text-slate-400 font-mono">Mem Core</p>
              <p className="font-bold text-white text-sm mt-0.5">{memoryUsage} GB / 8 GB</p>
            </div>
            <div className="bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 text-center">
              <p className="text-[10px] text-slate-400 font-mono">Zone</p>
              <p className="font-bold text-emerald-400 text-sm mt-0.5">{serverLocation.split(',')[0]}</p>
            </div>
            <button 
              onClick={handleRestartContainer}
              disabled={restarting}
              className="bg-brand-purple hover:bg-brand-purple/90 text-white px-5 py-3 rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap min-w-[120px] justify-center text-xs"
            >
              {restarting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>{restarting ? 'Rebooting...' : 'Reboot Node'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic 3-Days Expiration Warning & Auto Notification Alert banner */}
        {activeUserPlan && activeUserPlan.daysLeft <= 3 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left shadow-sm mt-4"
          >
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-rose-500/20 text-rose-700 dark:text-rose-400 rounded-xl shrink-0 mt-0.5 animate-pulse">
                <Bell className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-black tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-md animate-pulse">Automatic Alert Transmitted</span>
                  <span className="text-[10px] font-mono font-black text-rose-800 bg-rose-200/50 px-2.5 py-0.5 rounded-md">Expires in {activeUserPlan.daysLeft} Days</span>
                </div>
                <h4 className="font-display font-extrabold text-sm md:text-base text-slate-900 leading-tight">
                  Subscription renewal required for &ldquo;{activeUserPlan.name}&rdquo;
                </h4>
                <p className="text-xs text-slate-600 leading-normal max-w-2xl">
                  An automatic warning alert has been transmitted to your email <span className="font-bold text-slate-800">{userEmail}</span> and custom WhatsApp webhook 3 days prior to expiration. Action required now to avoid host container lockdown.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setActiveTab('billing');
                setTimeout(() => {
                  const element = document.getElementById('billing-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="bg-slate-900 text-white font-black text-xs px-4.5 py-3 rounded-xl hover:bg-slate-800 cursor-pointer shrink-0 transition-all border border-slate-700/50 tracking-wider shadow-sm uppercase active:scale-95"
            >
              Renew Instantly Now
            </button>
          </motion.div>
        )}

        {/* --- ALL-INCLUSIVE CUSTOMER PRE-CONFIGURED SUCCESS PLATFORM (सब कुछ रेडी है!) --- */}
        <div className="bg-gradient-to-br from-indigo-900 via-[#1a0a3a] to-[#0a0518] rounded-[2rem] p-6.5 sm:p-8 text-white space-y-6 relative overflow-hidden border border-indigo-500/20 shadow-2xl">
          {/* Decorative network nodes in background */}
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-12 -translate-y-12">
            <svg className="w-[300px] h-[300px] text-white" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" />
              <line x1="10" y1="10" x2="90" y2="90" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg px-2.5 py-1 text-[10px] font-black tracking-widest uppercase font-mono">
                100% Fully Managed Ecosystem Active
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight mt-1 flex items-center gap-2">
                <span>Everything is Ready & Configure Customized!</span>
                <span className="text-emerald-400">✓ Active</span>
              </h2>
              <p className="text-xs text-indigo-200 font-semibold max-w-2xl">
                इस प्लान के साथ आपको सब कुछ बिलकुल रेडी और चालू मिलता है। आपको कोई भी टेक्निकल काम जैसे डेटाबेस बनाना, SSL इंस्टॉल करना या डोमेन मैप करना खुद से नहीं करना पड़ेगा - हमारी सुपर AI प्रणाली सब कुछ आटोमेटिक कॉन्फ़िगर कर चुकी है!
              </p>
            </div>
            
            <div className="bg-emerald-500/10 border border-emerald-400/20 px-4 py-3 rounded-2xl shrink-0 flex items-center gap-3">
              <div className="w-2 md:w-2.5 h-2 md:h-2.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
              <div className="text-left font-mono">
                <span className="text-[9px] text-slate-350 block leading-none">VIBE STATUS</span>
                <span className="text-xs font-bold text-white leading-none block mt-1">Ready to Deploy</span>
              </div>
            </div>
          </div>

          {/* Grid of Ready-made pre-installed items on the purchased layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            
            {/* Item 1: Free Domain */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-200 uppercase tracking-widest font-bold">Domain Registered</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md">FREE & CONFIGURED</span>
              </div>
              <h5 className="font-bold text-sm tracking-tight text-white leading-none">Domain Mapping System</h5>
              <p className="text-[11px] text-zinc-300 leading-normal">
                आपका प्रीमियम डोमेन <strong className="text-emerald-300 font-mono select-all text-xs">{wpInstallDomain}</strong> आटोमेटिक सर्वर क्लस्टर से जोड़कर SSL सक्रिय कर दिया गया है।
              </p>
            </div>

            {/* Item 2: Free Unlimited Auto SSL */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-200 uppercase tracking-widest font-bold">Security Standard</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md">HTTPS ENFORCED</span>
              </div>
              <h5 className="font-bold text-sm tracking-tight text-white leading-none">Free Unlimited Wildcard SSL</h5>
              <p className="text-[11px] text-zinc-300 leading-normal">
                Let&apos;s Encrypt SSL सर्टिफिकेट तुरंत और आटोमेटिक इंस्टॉल हो चुका है। आपका ट्रैफ़िक 256-bit मिलिट्री ग्रेड एन्क्रिप्शन के साथ पूरी तरह सुरक्षित है।
              </p>
            </div>

            {/* Item 3: WordPress Auto Engine Ready */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-200 uppercase tracking-widest font-bold">Framework Suite</span>
                <span className="text-[9px] bg-indigo-500/30 text-indigo-200 font-bold px-2 py-0.5 rounded-md">WP 1-CLICK INSTANT</span>
              </div>
              <h5 className="font-bold text-sm tracking-tight text-white leading-none">WordPress & MySQL Database</h5>
              <p className="text-[11px] text-zinc-300 leading-normal">
                WordPress की फाइलें और डेटाबेस सर्वर पहले से ही बैकेंड में ऑप्टिमाइज़ कर लिए गए हैं। बिना किसी कोडिंग के 1-क्लिक में वर्डप्रेस लाइव कर सकते हैं!
              </p>
            </div>

            {/* Item 4: Cloudflare CDN active */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-200 uppercase tracking-widest font-bold">Speed Optimizer</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md">CDN RAM CACHING</span>
              </div>
              <h5 className="font-bold text-sm tracking-tight text-white leading-none">LiteSpeed & CDN Edge Ready</h5>
              <p className="text-[11px] text-zinc-300 leading-normal">
                410+ ग्लोबल एज लोकेशन्स पर CDN सक्रिय किया जा चुका है ताकि भारत और दुनिया भर के ग्राहकों के लिए आपकी वेबसाइट मात्र 42ms में लोड हो सके!
              </p>
            </div>

            {/* Item 5: Professional Corporate Mailbox */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-200 uppercase tracking-widest font-bold">Business Email</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md">UNLIMITED ACTIVE</span>
              </div>
              <h5 className="font-bold text-sm tracking-tight text-white leading-none">DKIM & SPF Mail Server</h5>
              <p className="text-[11px] text-zinc-300 leading-normal">
                आपकी कंपनी के नाम पर प्रोफेशनल ईमेल (जैसे sales@yourdomain) आटोमेटिक सेटअप हो चुकी है, जिससे आपके मेल थेट स्पैम फोल्डर में नहीं, इनबॉक्स में जायेंगे।
              </p>
            </div>

            {/* Item 6: Daily Snapshots System */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-200 uppercase tracking-widest font-bold">Data Redundancy</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md">DAILY SNAPSHOTS ON</span>
              </div>
              <h5 className="font-bold text-sm tracking-tight text-white leading-none">Auto Cloud Backup Vault</h5>
              <p className="text-[11px] text-zinc-300 leading-normal">
                रोज़ाना बैकअप लेने की चिंता समाप्त! आपका सर्वर आटोमेटिक तौर पर हर रात बैकअप स्टोर करता है, जिसे आप 1-क्लिक में कभी भी रीस्टोर कर सकते हैं।
              </p>
            </div>

          </div>
        </div>

        {/* Dynamic section split gridding */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* Left panel tabs menu list */}
          <div className="col-span-12 lg:col-span-3 space-y-2 bg-white p-5 rounded-2xl border border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2 mb-3">Ecosystem Services</p>
            
            <button 
              onClick={() => setActiveTab('sites')}
              className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'sites' ? 'bg-[#120a2a] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Globe className="w-4 h-4 text-brand-purple" />
              <span>Hosting & PHP Matrix</span>
            </button>

            <button 
              onClick={() => setActiveTab('wordpress')}
              className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${activeTab === 'wordpress' ? 'bg-[#120a2a] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-2">
                <span className="w-4.5 h-4.5 bg-brand-purple text-white rounded-lg flex items-center justify-center font-extrabold text-[10px] leading-none shrink-0">W</span>
                <span>WordPress Auto-Installer</span>
              </div>
              <span className="text-[7.5px] tracking-wider px-1.5 py-0.5 bg-indigo-600 font-extrabold rounded-md text-white animate-pulse">EASY</span>
            </button>

            <button 
              onClick={() => setActiveTab('ai')}
              className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'ai' ? 'bg-[#120a2a] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FileCode2 className="w-4 h-4 text-brand-purple" />
              <span>Integrated AI Builder</span>
            </button>

            <button 
              onClick={() => setActiveTab('domain')}
              className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${activeTab === 'domain' ? 'bg-[#120a2a] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-purple shrink-0" />
                <span>Domain Domicile Search</span>
              </div>
              <span className="text-[7.5px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-extrabold rounded-md uppercase tracking-wider font-mono">COM / IN</span>
            </button>

            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'security' ? 'bg-[#120a2a] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <ShieldCheck className="w-4 h-4 text-brand-purple" />
              <span>Security & Firewall logs</span>
            </button>

            <button 
              onClick={() => setActiveTab('terminal')}
              className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'terminal' ? 'bg-[#120a2a] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Terminal className="w-4 h-4 text-brand-purple" />
              <span>SSH Console terminal</span>
            </button>

            <button 
              onClick={() => setActiveTab('billing')}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-[11px] font-black transition-all flex items-center justify-between cursor-pointer border border-pink-100/50 ${activeTab === 'billing' ? 'bg-[#120a2a] text-white' : 'text-slate-700 bg-pink-500/5 hover:bg-pink-500/10'}`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-pink-600" />
                <span>My Subscriptions</span>
              </div>
              {activeUserPlan && activeUserPlan.daysLeft <= 3 && (
                <span className="text-[8px] px-1.5 py-0.5 bg-rose-600 text-white font-black rounded-lg animate-pulse tracking-wider">3 DAYS LEFT</span>
              )}
            </button>
          </div>

          {/* 5vibe Credits Floating Widget */}
          <div className="bg-gradient-to-br from-[#120a2a] via-[#150937] to-brand-purple p-4 rounded-2xl text-left border border-white/10 mt-5 space-y-3 shadow-lg relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] opacity-10 font-bold font-mono text-[60px] leading-none text-white select-none">5V</div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-purple-200 font-extrabold tracking-widest uppercase font-mono">5Vibe Credit Balance</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded animate-pulse">Active</span>
            </div>
            <div>
              <p className="font-mono font-black text-white text-xl tracking-tight pr-5">{vibeCredits} Credits</p>
              <p className="text-[10px] text-purple-200/70 mt-1 leading-normal">
                Spend credits to instantly vibe-code and deploy custom designed web spaces on your domains.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('ai');
                setTerminalLogs(prev => [...prev, `AI Sandbox configured: Accessing dynamic generative routes using Vibe Credit`]);
              }}
              className="w-full bg-white text-[#120a2a] hover:bg-slate-50 transition-colors py-2 rounded-xl text-[10px] font-black uppercase text-center cursor-pointer shadow-sm active:scale-98"
            >
              🚀 Spend Credits in AI Sandbox
            </button>
          </div>

          {/* Right tab contents viewport */}
          <div className="col-span-12 lg:col-span-9 bg-white p-6.5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-left">
            
            {activeTab === 'sites' && (
              <div className="space-y-6">
                <h3 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
                  Ecosystem Web Hosting Configuration
                </h3>

                {/* WordPress Quick Action Banner */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-[#120a2a] rounded-3xl p-6 text-white space-y-4 relative overflow-hidden shadow-md">
                  <div className="absolute right-0 bottom-0 opacity-10 select-none pointer-events-none transform translate-y-6 translate-x-6">
                    <span className="text-[120px] font-mono font-black text-white leading-none">W</span>
                  </div>
                  <div className="space-y-1.5 max-w-lg">
                    <span className="bg-blue-500/30 text-blue-105 border border-blue-400/30 rounded-lg px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase font-mono">Recommended Framework</span>
                    <h4 className="text-xl font-display font-black tracking-tight flex items-center gap-2">
                      Need a professional blog or corporate website?
                    </h4>
                    <p className="text-xs text-indigo-150 leading-relaxed font-semibold">
                      Install WordPress instantly on any of your connected domain paths with optimized LiteSpeed web server modules and security guard configurations.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setActiveTab('wordpress');
                        setTerminalLogs(prev => [...prev, `WordPress Auto-Installer interface selected globally from Setup Promo Banner`]);
                      }}
                      className="px-6 py-3 bg-white text-[#21759b] hover:bg-slate-50 font-black rounded-xl text-xs tracking-wide transition-all shadow-md text-center active:scale-98 cursor-pointer"
                    >
                      🚀 Setup WordPress in 1-Click
                    </button>
                    <span className="text-[10px] text-indigo-200 font-mono text-center sm:text-left">No database knowledge or coding required!</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  
                  {/* Select Server Location */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Dallas-TX Edge server region</label>
                    <select 
                      value={serverLocation} 
                      onChange={(e) => {
                        setServerLocation(e.target.value);
                        setTerminalLogs(prev => [...prev, `Server location redirected to ${e.target.value}`]);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none"
                    >
                      <option value="Dallas-TX, USA">Dallas-TX Compute Array (Active)</option>
                      <option value="Frankfurt, Germany">Frankfurt Edge Compute Array</option>
                      <option value="Singapore, APAC">Singapore Edge Compute Array</option>
                    </select>
                  </div>

                  {/* PHP Version override */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">PHP Dynamic version</label>
                    <select 
                      value={phpVersion} 
                      onChange={(e) => {
                        setPhpVersion(e.target.value);
                        setTerminalLogs(prev => [...prev, `PHP dynamic compiler updated to PHPv${e.target.value}`]);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none"
                    >
                      <option value="8.3">PHP v8.3 (Secure Stable)</option>
                      <option value="8.2">PHP v8.2 (Lagacy Compliant)</option>
                      <option value="8.1">PHP v8.1 (Legacy Stable)</option>
                    </select>
                  </div>

                </div>

                {/* SSL Guard status toggler */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="space-y-1 flex items-start gap-2.5">
                    <div className={`p-2.5 rounded-xl ${sslActive ? 'bg-emerald-50 text-emerald-500':'bg-red-50 text-red-500'}`}>
                      <ShieldCheck className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-950 flex items-center gap-1.5">
                        Let&apos;s Encrypt SSL Protection Certificate 
                        <span className="text-[10px] bg-emerald-100 text-emerald-600 font-bold px-1.5 rounded uppercase font-mono">Active</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-normal max-w-sm mt-0.5">
                        Shields visitor connections utilizing SHA-256 SSL algorithms automatically. Prevents security browser prompts.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSslActive(!sslActive);
                      setTerminalLogs(prev => [...prev, `SSL safety guard toggled ${!sslActive ? 'ON':'OFF'}`]);
                    }}
                    className={`px-4.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${sslActive ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
                  >
                    {sslActive ? 'SSL Armed' : 'SSL Disarmed'}
                  </button>
                </div>

                {/* Connected Websites & Domains list */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 space-y-4 text-left mt-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-extrabold text-sm text-[#111] tracking-tight">Active Connected Sites & Domains ({connectedDomains.length})</h4>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Fully Managed</span>
                  </div>

                  <div className="space-y-2.5">
                    {connectedDomains.map((dom) => (
                      <div key={dom.name} className="p-3.5 bg-slate-50 border border-slate-150/60 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-semibold text-xs text-slate-600">
                        <div className="flex items-start gap-2.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 animate-pulse shrink-0" />
                          <div>
                            <p className="font-mono text-xs sm:text-sm font-black text-slate-800">{dom.name}</p>
                            <p className="text-[10.5px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                              <span>Type: <strong className="text-slate-700">{dom.type}</strong></span>
                              <span>&bull;</span>
                              <span>Registrar: <strong className="text-slate-700">{dom.registrar}</strong></span>
                              <span>&bull;</span>
                              <span>IP: <strong className="text-slate-700 font-mono">{dom.ip}</strong></span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          {dom.ssl && (
                            <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-1 rounded-lg uppercase flex items-center gap-1 shrink-0">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              Secure SSL
                            </span>
                          )}
                          {dom.type !== 'WordPress' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setWpInstallDomain(dom.name);
                                  setActiveTab('wordpress');
                                  setTerminalLogs(prev => [...prev, `WordPress Auto-Installer configured: targeted domain set to '${dom.name}'`]);
                                }}
                                className="text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-wide cursor-pointer transition-colors"
                              >
                                🖨️ Install WordPress
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to disconnect ${dom.name}? This will disable hosting routes for this domain.`)) {
                                    setConnectedDomains(prev => prev.filter(d => d.name !== dom.name));
                                    setTerminalLogs(prev => [...prev, `DNS Mapping Disconnected: Removed custom routing for '${dom.name}'`]);
                                    if (wpInstallDomain === dom.name) {
                                      setWpInstallDomain('rajsahani-wp.superai-builder.com');
                                    }
                                  }
                                }}
                                className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/60 p-1.5 rounded-lg text-[10px] font-black tracking-wide cursor-pointer transition-colors"
                              >
                                Disconnect
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setWpInstallDomain(dom.name);
                                setActiveWpView('admin_home');
                                setActiveTab('wordpress');
                                setTerminalLogs(prev => [...prev, `Redirected to WordPress CMS Workspace for '${dom.name}'`]);
                              }}
                              className="text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide cursor-pointer transition-colors"
                            >
                              ⚙️ Manage in WordPress CMS
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1-Click External Domain Connector panel */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 md:p-6 space-y-4">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-brand-purple" /> Connect Domain Bought from Anywhere Else
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Connect your domain from GoDaddy, Namecheap, Hostinger, Bluehost, etc. inside 1-click.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">Domain Name</label>
                      <input 
                        type="text"
                        value={extDomainInput}
                        onChange={(e) => {
                          setExtDomainInput(e.target.value);
                          setMapSuccessMsg('');
                          setMapErrorMsg('');
                        }}
                        placeholder="e.g. rajsahani.in or mycustomsite.org"
                        className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">Bought From (Registrar)</label>
                      <select 
                        value={extRegistrar}
                        onChange={(e) => setExtRegistrar(e.target.value)}
                        className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                      >
                        <option value="GoDaddy">GoDaddy</option>
                        <option value="Namecheap">Namecheap</option>
                        <option value="Hostinger">Hostinger</option>
                        <option value="Freenom">Freenom</option>
                        <option value="Google Domains">Google Domains</option>
                        <option value="Other / Custom">Other / Custom</option>
                      </select>
                    </div>
                  </div>

                  {/* DNS Record requirements view */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 text-[11px] leading-relaxed space-y-3">
                    <p className="font-bold text-slate-700">How to Connect? Setup A Record on your Registrar Panel:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/50 font-mono">
                      <div>
                        <span className="text-slate-455 font-sans block text-[9px] uppercase font-bold">TYPE / HOST</span>
                        <span className="font-extrabold text-slate-800">A / @</span>
                      </div>
                      <div>
                        <span className="text-slate-455 font-sans block text-[9px] uppercase font-bold">POINTS TO (IP ADDRESS)</span>
                        <span className="font-extrabold text-indigo-600 select-all">103.86.177.30</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-[10px] italic">Alternatively, you can change your Name Servers to: <strong className="text-slate-700">ns1.superai-builder.com</strong> and <strong className="text-slate-700">ns2.superai-builder.com</strong></p>
                  </div>

                  {isMappingDomain && (
                    <div className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-[9.5px] text-emerald-400 select-none">
                      <p className="text-slate-550 border-b border-white/5 pb-1 uppercase font-bold">1-Click DNS Verification Engine</p>
                      <div className="space-y-0.5">
                        {dnsLogs.map((logStr, lIdx) => (
                          <div key={lIdx}>&gt; {logStr}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {mapSuccessMsg && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold font-sans">
                      {mapSuccessMsg}
                    </div>
                  )}

                  {mapErrorMsg && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold font-sans font-semibold">
                      {mapErrorMsg}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleConnectExternalDomain}
                    disabled={isMappingDomain || !extDomainInput.trim()}
                    className="w-full bg-[#120a2a] hover:bg-brand-purple text-white transition-all py-3.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isMappingDomain ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>1-Click Connect &amp; Configure Hosting</span>
                  </button>
                </div>

                {/* Databases stats block */}
                <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-4.5 h-4.5 text-brand-purple" />
                    <span>MySql Databases Active: 1 / Unlimited</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-4.5 h-4.5 text-brand-purple" />
                    <span>SSH Port Status: 22 (Isolated secure)</span>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'wordpress' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#21759b] text-white flex items-center justify-center font-black text-xs font-mono">W</span>
                      WordPress 1-Click Auto-Installer
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Deploy production-ready WordPress sites optimized with LiteSpeed Enterprise Cache.</p>
                  </div>
                  {wpInstalled && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">Live Active</span>
                      <button
                        onClick={handleWpUninstall}
                        className="text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wide cursor-pointer transition-colors"
                      >
                        Uninstall Stack
                      </button>
                    </div>
                  )}
                </div>

                {/* Case 1: WordPress is NOT installed and NOT installing */}
                {!wpInstalled && !wpInstalling && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-5 rounded-2xl border border-blue-100 flex items-start gap-4">
                      <div className="p-3 bg-white text-[#21759b] rounded-xl shadow-xs">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="text-xs space-y-1">
                        <h4 className="font-extrabold text-blue-990">Install WordPress Easily in seconds</h4>
                        <p className="text-blue-900 leading-normal font-medium">
                          No more manual database setups, ftp, or zip extractions. Just fill in your preferences below, and hPanel will prepare and link a fully-functional WordPress architecture automatically.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5 text-left">
                      <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider font-mono">Site &amp; Database Schema Settings</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Select Connected Domain */}
                        <div className="space-y-1.5 col-span-1 md:col-span-2">
                          <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">Select Installation Domain / Site Path</label>
                          <select
                            value={wpInstallDomain}
                            onChange={(e) => setWpInstallDomain(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:border-[#21759b]"
                          >
                            {connectedDomains.map((dom) => (
                              <option key={dom.name} value={dom.name}>{dom.name} ({dom.type === 'WordPress' ? 'Default Space' : dom.registrar + ' Connected'})</option>
                            ))}
                          </select>
                          <p className="text-[10px] text-slate-400">Choose from your registered custom domains or any external custom nameserver pointed URLs mapped under your hosting panel.</p>
                        </div>

                        {/* Site Name and Database */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">Site Title Name</label>
                          <input
                            type="text"
                            value={wpSiteName}
                            onChange={(e) => setWpSiteName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#21759b] focus:bg-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">WordPress MySQL Database Name</label>
                          <input
                            type="text"
                            value={wpDbName}
                            onChange={(e) => setWpDbName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#21759b] focus:bg-white"
                          />
                        </div>

                        {/* Admin User and Admin Email */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">WP Admin Username</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-3 text-slate-400"><User className="w-3.5 h-3.5" /></span>
                            <input
                              type="text"
                              value={wpAdminUser}
                              onChange={(e) => setWpAdminUser(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#21759b] focus:bg-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">WP Admin Notification Email</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-3 text-slate-400"><Mail className="w-3.5 h-3.5" /></span>
                            <input
                              type="email"
                              value={wpAdminEmail}
                              onChange={(e) => setWpAdminEmail(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#21759b] focus:bg-white"
                            />
                          </div>
                        </div>

                        {/* Admin Password & Starter Theme */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center px-0.5">
                            <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">Admin Password</label>
                            <button
                              type="button"
                              onClick={handleWpGeneratePass}
                              className="text-[10px] text-[#21759b] hover:underline font-bold capitalize cursor-pointer focus:outline-none"
                            >
                              Generate Secure Password
                            </button>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3.5 top-3 text-slate-400"><Lock className="w-3.5 h-3.5" /></span>
                            <input
                              type="text"
                              value={wpAdminPass}
                              onChange={(e) => setWpAdminPass(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#21759b] focus:bg-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">Starter Theme Layout Package</label>
                          <select
                            value={wpTheme}
                            onChange={(e) => setWpTheme(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#21759b]"
                          >
                            <option value="Astra Professional Theme">Astra Professional (Recommended for fast blogs)</option>
                            <option value="Divi Drag-and-Drop Builder">Divi Multipurpose Builder Theme</option>
                            <option value="OceanWP Minimal Canvas">OceanWP (Optimized for E-Commerce / WooCommerce)</option>
                            <option value="Twenty-Twenty-Four Default Core">Twenty-Twenty-Four default static blocks</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={handleWpRunInstaller}
                          className="w-full sm:w-auto px-8 py-3.5 bg-[#21759b] hover:bg-[#1a5c7a] text-white font-extrabold text-sm rounded-xl cursor-pointer transition-all shadow-lg shadow-blue-900/10 active:scale-98 text-center flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>INSTALL WORDPRESS INSTANTLY</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Case 2: WordPress is CURRENTLY INSTALLING */}
                {wpInstalling && (
                  <div className="space-y-6 py-6 text-center max-w-lg mx-auto">
                    <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                      <span className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-[#21759b] animate-spin absolute" />
                      <span className="font-mono font-black text-xs text-[#21759b]">{wpProgress}%</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display font-extrabold text-base text-slate-905">Setting Up WordPress Stack</h4>
                      <p className="text-xs text-slate-500 leading-normal px-6">
                        Auto-generator is composing MySQL databases, installing configuration rules, and setting up file structure folders in sandbox container environment...
                      </p>
                    </div>

                    {/* Progress stream Console logs */}
                    <div className="space-y-2 text-left bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-[9px] text-emerald-400 shadow-inner">
                      <p className="text-slate-500 border-b border-white/5 pb-1 select-none">WP-AUTO-INSTALLER COMPILATION STREAM (LIVE)</p>
                      <div className="space-y-1 max-h-[140px] overflow-y-auto">
                        {wpProgressLogs.map((log, lIdx) => (
                          <p key={lIdx}>&gt; {log}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Case 3: WordPress IS ACTUALLY INSTALLED */}
                {wpInstalled && !wpInstalling && (
                  <div className="space-y-6">
                    {/* Inner playground sub tabs selection menu */}
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-center text-xs font-bold max-w-md">
                      <button
                        onClick={() => setActiveWpView('admin_home')}
                        className={`flex-grow py-2 rounded-lg transition-all cursor-pointer ${activeWpView === 'admin_home' ? 'bg-[#21759b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        📊 WP Dashboard
                      </button>
                      <button
                        onClick={() => setActiveWpView('write')}
                        className={`flex-grow py-2 rounded-lg transition-all cursor-pointer ${activeWpView === 'write' ? 'bg-[#21759b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        ✍️ Autocreate Post
                      </button>
                      <button
                        onClick={() => setActiveWpView('site_preview')}
                        className={`flex-grow py-2 rounded-lg transition-all cursor-pointer ${activeWpView === 'site_preview' ? 'bg-[#21759b] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        👁️ Live Site View
                      </button>
                    </div>

                    {/* SUB-VIEW 1: Dashboard overview stats & keys */}
                    {activeWpView === 'admin_home' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-205">
                            <span className="text-[9px] text-slate-400 font-bold uppercase font-mono block">Site Status</span>
                            <span className="text-emerald-650 font-extrabold text-xs flex items-center gap-1.5 mt-1">
                              <CheckCircle className="w-4 h-4 text-emerald-500" /> Active (SLA Secure)
                            </span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-205">
                            <span className="text-[9px] text-slate-400 font-bold uppercase font-mono block">Published Articles</span>
                            <span className="text-slate-900 font-extrabold text-sm block mt-1">
                              {wpPosts.length} post{wpPosts.length > 1 ? 's':''} / Unlimited
                            </span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-205">
                            <span className="text-[9px] text-slate-400 font-bold uppercase font-mono block">Activated Theme Layout</span>
                            <span className="text-blue-650 font-extrabold text-sm block mt-1">
                              {wpTheme.replace(' Theme', '')}
                            </span>
                          </div>
                        </div>

                        {/* Credentials box */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                          <h4 className="font-extrabold text-xs text-slate-950 uppercase tracking-widest font-mono">Wordpress Admin Account Details</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold leading-relaxed">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <span className="text-slate-400 text-[10px] block font-mono">ADMIN LOGIN URL</span>
                              <span className="font-mono text-slate-700 font-bold">https://superai-builder.com/wp-admin</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <span className="text-slate-400 text-[10px] block font-mono">ADMIN LOGIN USERNAME</span>
                              <span className="text-[#21759b] font-bold">{wpAdminUser}</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <span className="text-slate-400 text-[10px] block font-mono">ADMIN LOGIN PASSWORD</span>
                              <span className="font-mono text-slate-700 bg-yellow-105 px-1 py-0.5 rounded text-[11px] font-bold select-all tracking-wide">{wpAdminPass}</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <span className="text-slate-400 text-[10px] block font-mono">LOCAL DATABASE POOL</span>
                              <span className="text-slate-800 font-mono">{wpDbName} (InnoDB Core)</span>
                            </div>
                          </div>
                        </div>

                        {/* Activated plugins container */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-slate-700">Pre-Configured Speed Optimization Plugins</h4>
                            <span className="bg-emerald-100 text-[9px] text-emerald-700 font-mono font-bold px-1.5 py-0.5 rounded">AUTO-ACTIVATED</span>
                          </div>

                          <div className="space-y-2 text-xs leading-normal">
                            <div className="bg-white p-3 rounded-lg border border-slate-150 flex items-start gap-3">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#21759b] shrink-0 mt-1" />
                              <div>
                                <p className="font-bold text-slate-900">LiteSpeed Enterprise Accelerator Core</p>
                                <p className="text-[11px] text-slate-500">Links hPanel caches with server RAM buffers. Delivers up to 9x quicker rendering for visitors.</p>
                              </div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-slate-150 flex items-start gap-3">
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-1" />
                              <div>
                                <p className="font-bold text-slate-900">Wordfence Lite Isolation Shield</p>
                                <p className="text-[11px] text-slate-500">Injects security firewall parameters inside active wp-config to shield login portals against brute force logins.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-VIEW 2: Write blog posts manually or let Super AI generate */}
                    {activeWpView === 'write' && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
                        
                        {/* Option A: Super AI assisted post builder */}
                        <div className="bg-[#21759b]/5 p-4 rounded-xl border border-[#21759b]/15 space-y-3">
                          <label className="text-xs text-[#21759b] font-extrabold flex items-center gap-1.5 leading-none">
                            <Sparkles className="w-4 h-4 text-[#21759b] animate-spin" />
                            <span>Quick Super AI Post Assistant (Hinglish/Hindi/English)</span>
                          </label>
                          <p className="text-[11px] text-slate-500 leading-normal font-medium">
                            Simply describe your topic inside the bar, and our integrated Super AI API will formulate a search-optimized, structured article blog post in Hindi or English immediately!
                          </p>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={wpPostPrompt}
                              onChange={(e) => setWpPostPrompt(e.target.value)}
                              placeholder="E.g. 'WordPress vs custom HTML' or 'Super AI speeds comparison in Hindi'..."
                              className="flex-grow bg-white border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#21759b]"
                            />
                            <button
                              type="button"
                              onClick={handleWpAiGeneratePost}
                              disabled={wpGeneratingPost || !wpPostPrompt.trim()}
                              className="bg-[#21759b] hover:bg-[#1a5c7a] px-5 py-2.5 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all disabled:opacity-50"
                            >
                              {wpGeneratingPost ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                              <span>{wpGeneratingPost ? 'Generating...' : 'Compose with AI'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Options B: Complete Post editor inputs */}
                        <form onSubmit={handleWpCreatePost} className="space-y-4 pt-2">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">Article Title Header</label>
                            <input
                              type="text"
                              value={newPostTitle}
                              onChange={(e) => setNewPostTitle(e.target.value)}
                              placeholder="Enter your beautiful article title..."
                              className="w-full bg-slate-50 border border-slate-250 rounded-xl px-4 py-2.5 text-xs font-bold text-[#120a2a] focus:outline-none focus:border-[#21759b] focus:bg-white"
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">Article Body Copy</label>
                            <textarea
                              rows={5}
                              value={newPostContent}
                              onChange={(e) => setNewPostContent(e.target.value)}
                              placeholder="Start typing your story copy..."
                              className="w-full bg-slate-50 border border-slate-250 rounded-xl px-4 py-3 text-xs sm:text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#21759b] focus:bg-white leading-relaxed"
                              required
                            />
                          </div>

                          <div className="flex justify-end pt-2 border-t border-slate-100">
                            <button
                              type="submit"
                              className="px-6 py-2.5 bg-[#21759b] hover:bg-[#1a5c7a] text-white text-xs font-bold rounded-xl cursor-pointer shadow-md leading-none uppercase tracking-wider transition-all"
                            >
                              Publish Article Live
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* SUB-VIEW 3: Live Website preview sandbox simulator */}
                    {activeWpView === 'site_preview' && (
                      <div className="space-y-4">
                        <div className="border border-slate-250 rounded-3xl overflow-hidden bg-slate-900 shadow-xl">
                          
                          {/* Browser address header mockup bar */}
                          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                            <div className="flex items-center space-x-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            </div>
                            <div className="bg-slate-950 px-4 py-0.5 rounded-md text-[10px] text-slate-400 font-mono flex items-center space-x-1.5">
                              <span className="text-emerald-500 font-extrabold">🔒</span>
                              <span className="font-extrabold select-all">https://{wpInstallDomain}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest block">LIVE WP PREVIEW</span>
                          </div>

                          {/* Render WordPress front-end blog list layout */}
                          <div className="bg-white text-slate-800 min-h-[360px] p-6 text-left font-sans space-y-6">
                            
                            {/* WordPress Blog Custom Header */}
                            <div className="border-b-2 border-[#21759b] pb-4 space-y-2">
                              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">{wpSiteName}</h1>
                              <p className="text-xs text-slate-500 italic font-bold">Just another beautifully optimized WordPress site by Super AI</p>
                            </div>

                            {/* Main split grid */}
                            <div className="grid grid-cols-12 gap-6 pt-2">
                              {/* Left Columns - Posts catalog lists */}
                              <div className="col-span-12 md:col-span-8 space-y-5">
                                {wpPosts.map((post) => (
                                  <article key={post.id} className="bg-slate-50 hover:bg-slate-100/60 p-5 rounded-2xl border border-slate-150 transition-colors space-y-3 text-left">
                                    <div className="flex justify-between items-start gap-2">
                                      <h2 className="font-display font-extrabold text-sm sm:text-base text-[#120a2a] tracking-tight">{post.title}</h2>
                                      <span className="text-[9px] bg-slate-200 text-slate-600 font-mono font-bold px-2 py-0.5 rounded shrink-0">{post.date}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed font-semibold whitespace-pre-line">{post.content}</p>
                                  </article>
                                ))}
                              </div>

                              {/* Right Columns - Theme sidebar widgets */}
                              <div className="col-span-12 md:col-span-4 space-y-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-5">
                                <div className="space-y-2">
                                  <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest font-mono">Recent Posts</h3>
                                  <div className="space-y-1.5 text-xs font-bold">
                                    {wpPosts.slice(0, 4).map((p) => (
                                      <a key={p.id} href="#" onClick={(e) => e.preventDefault()} className="text-[#21759b] hover:underline block truncate leading-relaxed">&bull; {p.title}</a>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2 pt-4 border-t border-slate-100">
                                  <h3 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest font-mono">Meta</h3>
                                  <div className="space-y-1.5 text-xs text-slate-500 font-bold">
                                    <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline block">&bull; Log In</a>
                                    <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline block">&bull; Entries Feed</a>
                                    <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline block">&bull; WordPress.org</a>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-display font-extrabold text-base text-slate-900">
                    Ecosystem AI Website Generator
                  </h3>
                  <span className="text-[10px] text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded font-mono font-bold">SUPER AI DIRECT PORT</span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Generate structural website designs, custom color maps, and copywriting blueprints directly inside hPanel. Download or deploy template drafts instantly.
                </p>

                {/* Internal form inside hPanel */}
                <form onSubmit={handleGenerateAiInsidePanel} className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="e.g. Portfolio page for Javascript Consultant" 
                      className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-semibold"
                    />
                    <button 
                      type="submit" 
                      disabled={aiGenerating}
                      className="bg-brand-purple hover:bg-brand-purple/95 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-1 whitespace-nowrap min-w-[120px] cursor-pointer disabled:opacity-80"
                    >
                      {aiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{aiGenerating ? 'Structuring...' : 'Deploy AI'}</span>
                    </button>
                  </div>
                </form>

                {/* 5vibe Credits Info Banner */}
                <div id="vibe-credits-details" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mt-4 space-y-3 font-sans text-left">
                  <div className="flex items-center gap-2 text-brand-purple font-black text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-brand-purple" />
                    <span>What is my 5Vibe Coding Credit quota?</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    <strong>5Vibe Credits</strong> are premium generative performance tokens allocated to your Super AI Site Builder hosting server. They authorize the high-speed deployment of state-of-the-art web templates, codebases, and custom styling arrays powered by Super AI models directly beneath your domains.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-brand-purple pl-3 italic">
                    💡 <strong>Spend &amp; Profit:</strong> Each successful AI website iteration compiles instantly and expends exactly <strong>1 credit</strong>. You can consume them from the standalone sandbox panel to design customized spaces with instant workspace previews.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-150 mt-2">
                    <div className="text-xs space-y-0.5 text-left">
                      <div className="font-extrabold text-slate-800 flex items-center gap-1.5">
                        <span>Active Balance:</span>
                        <span className="text-emerald-700 font-black font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{vibeCredits} / 15 Credits</span>
                      </div>
                      <p className="text-[10.5px] text-slate-450 font-semibold font-sans">Quotas refresh on billing cycles or when topups trigger.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const added = vibeCredits + 5;
                          updateVibeCreditsBothPlaces(added);
                          setTerminalLogs(prev => [...prev, `Developer topup initiated: +5 Vibe credits successfully applied`]);
                        }}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10.5px] px-3 py-2 rounded-lg transition-all cursor-pointer border border-emerald-200"
                      >
                        ⚡ Fast Top-Up (+5 Cr)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActivePage('builder');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-[#120a2a] hover:bg-[#25154f] text-white font-extrabold text-[10.5px] px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider shadow-sm flex items-center gap-1"
                      >
                        <span>Launch Builder</span>
                        <ArrowRight className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interactive Results Outline */}
                {outline && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 font-sans text-xs space-y-4 animate-fade-in text-left">
                    <div className="flex justify-between items-center bg-slate-900 p-3 h-10 rounded-xl">
                      <span className="text-white font-mono font-bold text-[11px] uppercase tracking-wider">{outline.themeName} blueprint generated</span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono">SLA validated</span>
                    </div>

                    <div className="space-y-2 text-slate-600 leading-normal text-[11px]">
                      <p><span className="font-bold text-slate-800 uppercase text-[9px] font-mono block">Palette:</span> {JSON.stringify(outline.colors)}</p>
                      <p><span className="font-bold text-slate-800 uppercase text-[9px] font-mono block">Headline:</span> {outline.hero?.title}</p>
                      <p><span className="font-bold text-slate-800 uppercase text-[9px] font-mono block">Subhead:</span> {outline.hero?.subtitle}</p>
                    </div>

                    <p className="text-[11.5px] italic text-brand-purple leading-relaxed py-1.5 border-t border-slate-200">
                      * This design outline was successfully populated into your database slot automatically.
                    </p>
                  </div>
                )}

              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
                  Absolute Security Logs & DDoS WAF Logs
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 space-y-1 text-xs">
                    <p className="font-bold text-emerald-500">Continuous Cyber Firewall</p>
                    <p className="text-[11px] text-slate-500 leading-normal">Web Application Firewall logs indicate over 1,240 general bots and unmanaged sweeps were successfully blocked in Dallas center last 7 days.</p>
                  </div>

                  <div className="p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 space-y-1 text-xs">
                    <p className="font-bold text-yellow-600 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Dynamic SLA warning logs</p>
                    <p className="text-[11px] text-slate-500 leading-normal">You are utilizing a generic sandbox container IP address. Please register a cloud plan to secure a dedicated static IP mask address.</p>
                  </div>
                </div>

                {/* Logs terminal block */}
                <div className="p-4.5 bg-slate-900 rounded-2xl border border-white/5 space-y-2 text-left">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-slate-500">Security Firewalls transaction records (Active)</span>
                  <div className="space-y-1 font-mono text-[10px] text-slate-300">
                    <div>[02:30:21Z] WAF firewall activated securely.</div>
                    <div>[02:30:26Z] SSL Let&apos;s Encrypt renewal check: PASS</div>
                    <div>[02:30:34Z] DNS records parsed for mycafeshop.com and synced.</div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'domain' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <h3 className="font-display font-extrabold text-[#120a2a] text-base flex items-center gap-1.5">
                      <Globe className="w-5 h-5 text-brand-purple" />
                      <span>Domain Domicile Search & Registry</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Check immediate Indian and global TLD registration availability powered by Super AI DNS engines.</p>
                  </div>
                  <span className="text-[9.5px] font-mono tracking-widest font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">LOCAL CONTEXT SYNCED</span>
                </div>

                {/* Main Search Input Form within hPanel */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-450 uppercase font-mono font-bold tracking-wider">Search Domain Keywords</span>
                    <p className="text-[10.5px] text-slate-400">Type any name (e.g. rajsahani, fastshop) to verify instant registration.</p>
                  </div>

                  <form onSubmit={handleDashboardDomainSearch} className="flex gap-1.5">
                    <div className="relative flex-grow">
                      <span className="absolute left-3.5 top-3 text-slate-400"><Globe className="w-4 h-4" /></span>
                      <input 
                        type="text" 
                        value={dbSearchQuery}
                        onChange={(e) => setDbSearchQuery(e.target.value)}
                        placeholder="e.g. rajsahani or globalnode" 
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-purple"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={dbIsSearching}
                      className="bg-brand-purple hover:bg-brand-purple/95 font-bold text-xs text-white px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap"
                    >
                      {dbIsSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      <span>{dbIsSearching ? 'Searching...' : 'Check Registry'}</span>
                    </button>
                  </form>
                </div>

                {/* Dashboard Domain Search Results List */}
                {(dbDirectMatches.length > 0 || dbResults.length > 0) && (
                  <div className="space-y-4">
                    {/* TLD Quick Filter */}
                    <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 pb-3">
                      <span className="text-[9.5px] font-mono text-slate-450 uppercase font-black mr-2 select-none">Filters:</span>
                      {[
                        { label: 'All', filter: 'all' },
                        { label: '.com', filter: '.com' },
                        { label: '.in (India)', filter: '.in' },
                        { label: '.co.in', filter: '.co.in' },
                        { label: '.net', filter: '.net' },
                        { label: '.ai', filter: '.ai' }
                      ].map((fp) => (
                        <button
                          key={fp.filter}
                          type="button"
                          onClick={() => setDbActiveTldFilter(fp.filter)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg cursor-pointer transition-all ${
                            dbActiveTldFilter === fp.filter 
                              ? 'bg-[#120a2a] text-white' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {fp.label}
                        </button>
                      ))}
                    </div>

                    {/* Direct Matches */}
                    <div className="space-y-1.5">
                      <p className="text-[9.5px] text-slate-400 font-mono uppercase tracking-wider">Exact matches registry:</p>
                      {dbDirectMatches
                        .filter(r => dbActiveTldFilter === 'all' || r.name.endsWith(dbActiveTldFilter))
                        .map((res, index) => (
                          <div key={`db-dm-${index}`} className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-2xl hover:border-brand-purple/40 transition-colors">
                            <div className="flex items-center gap-2.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                              <div>
                                <span className="font-mono text-xs font-black text-slate-800">{res.name}</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {res.badges.map((b: string) => (
                                    <span key={b} className="text-[8.5px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">{b}</span>
                                  ))}
                                  <span className="text-[9px] text-emerald-600 font-semibold uppercase">✓ INSTANT REGISTRATION AVAILABLE</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-xs font-bold text-slate-900">{res.price}</span>
                              <button 
                                onClick={() => {
                                  alert(`Successfully binded & registered ${res.name} to Dallas Edge cluster node at ${res.price}/yr!`);
                                }}
                                className="bg-[#120a2a] hover:bg-brand-purple text-white hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer transition-all whitespace-nowrap uppercase tracking-wider"
                              >
                                Claim
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>

                    {/* AI Proposals */}
                    {dbResults.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <p className="text-[9.5px] text-slate-400 font-mono uppercase tracking-wider">AI branding suggestions:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {dbResults
                            .filter(r => dbActiveTldFilter === 'all' || r.name.endsWith(dbActiveTldFilter))
                            .map((res, index) => (
                              <div key={`db-ai-${index}`} className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl flex items-center justify-between">
                                <div>
                                  <span className="font-mono text-xs font-extrabold text-slate-700 block">{res.name}</span>
                                  <span className="text-[8px] bg-purple-50 text-brand-purple font-extrabold px-1 rounded block w-max mt-1 uppercase">Branding Option</span>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                  <span className="font-mono text-[10.5px] font-bold text-slate-800">{res.price}</span>
                                  <button
                                    onClick={() => alert(`Registered branded backup domain ${res.name} at ${res.price}/yr`)}
                                    className="p-1 px-2.5 bg-white border border-slate-205 rounded hover:bg-slate-900 hover:border-slate-900 hover:text-white text-[9.5px] text-slate-700 font-bold transition-all cursor-pointer"
                                  >
                                    Claim
                                  </button>
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {activeTab === 'terminal' && (
              <div className="space-y-6">
                <h3 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
                  Isolated SSH Console Terminal Simulator
                </h3>

                {/* Command Line output */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left font-mono text-[11px] text-emerald-400 space-y-2 min-h-[220px] overflow-y-auto">
                  <div className="text-slate-504">$ init secure client socket... Done</div>
                  <div className="text-slate-504">$ verify letsencrypt status... TTL: 89 Days</div>
                  
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">$ {log}</div>
                  ))}

                  <div className="text-[10px] text-indigo-400 italic mt-3 animate-pulse">
                    $ System standby // Write instructions inside hPanel to execute containers configurations...
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'billing' && (
              <div id="billing-section" className="space-y-8">
                <div>
                  <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-pink-600" />
                    Secure Active Subscriptions & Automatic Renewals
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure your high-性能 cloud servers parameters, watch automatic cron alert logs, and claim your hosting periods securely.
                  </p>
                </div>

                {/* Grid for Active Plan Stats & 3-Day Countdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Active Cloud Plan display */}
                  <div className="border border-pink-100 bg-gradient-to-br from-pink-500/5 to-purple-500/5 p-6 rounded-3xl space-y-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9.5px] font-mono uppercase bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-md font-extrabold">Active Subscription</span>
                        <h4 className="font-display font-extrabold text-lg text-slate-900 mt-2">{activeUserPlan.name}</h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">Term: {activeUserPlan.period} Months Bilateral</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-black text-rose-600 text-base">{activeUserPlan.price}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">automatic cycle</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/60 pt-4 space-y-2.5">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Cloud Resources Included:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {activeUserPlan.features.slice(0, 4).map((feat: string, fidx: number) => (
                          <div key={fidx} className="flex items-center gap-1.5 text-xs text-slate-700">
                            <CheckCircle className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-mono">Expiration Date:</p>
                        <p className="text-xs font-black text-slate-800 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {activeUserPlan.expiryDate}
                        </p>
                      </div>
                      
                      {activeUserPlan.daysLeft <= 3 ? (
                        <button 
                          onClick={() => {
                            // Extend the subscription instantly
                            setActiveUserPlan({
                              ...activeUserPlan,
                              expiryDate: 'June 05, 2027', // Renewed by exactly 1 year!
                              daysLeft: 368,
                              status: 'active'
                            });
                            setTerminalLogs(prev => [
                              ...prev,
                              `SUCCESS: Automatic renewal executed for plan '${activeUserPlan.name}'! Expiration safe limits updated to: June 05, 2027.`
                            ]);
                            setAutomaticAlertLogs(prev => [
                              `[RENEWAL-GATEWAY] Customer executed secure UPI/Razorpay 1-Click payment successfully.`,
                              `[RENEWAL-GATEWAY] Reset standard days countdown to 365+ days. Expiration warnings disabled safely.`,
                              ...prev
                            ]);
                            alert(`Subscribed Successfully! We have extended your plan to June 05, 2027. Expiration alerts have been reset.`);
                          }}
                          className="bg-pink-600 hover:bg-pink-700 text-white font-mono font-black text-xs px-4.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md uppercase tracking-wider text-center"
                        >
                          1-Click UPI Renew
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          Renewed (Expiry Safe)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3-Days Alert Visual Countdown Circular Indicator */}
                  <div className="border border-slate-200 p-6 rounded-3xl flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-wider">Cron Scheduler Guard Status</h4>
                        <p className="text-xs text-rose-500 mt-1 font-bold">
                          {activeUserPlan.daysLeft <= 3 ? '⚠️ Status: Expiration Alert Is Active' : '✓ Status: Safe Standby Mode'}
                        </p>
                      </div>
                      <div className="p-2 bg-slate-100 rounded-xl">
                        <Bell className="w-4.5 h-4.5 text-slate-500" />
                      </div>
                    </div>

                    <div className="py-4 flex flex-col sm:flex-row items-center justify-around gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="relative h-20 w-20 flex items-center justify-center">
                        {/* Circular SVG Path for timer */}
                        <svg className="absolute w-full h-full transform -rotate-90">
                          <circle cx="40" cy="40" r="32" className="stroke-slate-205 fill-none" strokeWidth="6" />
                          <circle 
                            cx="40" 
                            cy="40" 
                            r="32" 
                            className={`fill-none transition-all ${activeUserPlan.daysLeft <= 3 ? 'stroke-rose-500':'stroke-emerald-500'}`}
                            strokeWidth="6" 
                            strokeDasharray="201" 
                            strokeDashoffset={activeUserPlan.daysLeft <= 3 ? (201 - (201 * 3 / 30)) : 0} 
                          />
                        </svg>
                        <div className="text-center">
                          <p className="font-mono font-black text-slate-800 text-lg leading-none">{activeUserPlan.daysLeft <= 34 ? activeUserPlan.daysLeft : 'OK'}</p>
                          <p className="text-[8.5px] text-slate-400 uppercase mt-0.5 font-bold leading-none">{activeUserPlan.daysLeft <= 34 ? 'Days' : 'Safe'}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-center sm:text-left">
                        <p className="text-xs font-extrabold text-slate-800">Automatic Scheduler Rule:</p>
                        <p className="text-[11px] text-slate-600 leading-normal max-w-xs">
                          When a customer&apos;s hosting subscription dips below <strong className="text-rose-600">3 days</strong>, our auto-scheduler triggers and transmits notification alerts synchronously via SMS & mail automatically.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Force reset countdown to 3 days to test the user's scenario
                          setActiveUserPlan({
                            ...activeUserPlan,
                            expiryDate: 'June 05, 2026',
                            daysLeft: 3,
                            status: 'active'
                          });
                          setAutomaticAlertLogs(prev => [
                            `[MANUAL-RESET] Reforced daysLeft countdown back to 3 days to allow immediate user trial validation.`,
                            ...prev
                          ]);
                          alert('Reset successful! Countdown is set back to exactly 3 Days to evaluate the automated notification alerts banner.');
                        }}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        Reset Expiry to 3 Days
                      </button>
                    </div>
                  </div>

                </div>

                {/* System Alert Dispatch Logs */}
                <div className="border border-slate-200 rounded-2xl p-6.5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h4 className="font-display font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                      Transmission Logs: Automated 3-Day Alert Dispatcher
                    </h4>
                    <span className="text-[9.5px] font-mono text-slate-400 font-bold uppercase tracking-wider">Relay Node: SMTP-IN9</span>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-left font-mono text-[11px] text-slate-300 space-y-3 max-h-[180px] overflow-y-auto leading-relaxed shadow-inner">
                    {automaticAlertLogs.map((log, lidx) => (
                      <div key={lidx} className="flex gap-2 items-start">
                        <span className="text-emerald-500 shrink-0">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4 text-brand-purple shrink-0" />
                      <span>Contact Destination: <strong className="text-slate-800">{userEmail}</strong> &amp; +91 91100 02026</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        setAutomaticAlertLogs(prev => [
                          `[MANUAL-TRIGGER] SMTP relay forced manual notification trigger: Warning alert dispatch processed for '${userEmail}'.`,
                          ...prev
                        ]);
                        alert(`Manual Alert Reforced! High-speed mail sent successfully to: ${userEmail}`);
                      }}
                      className="text-brand-purple hover:text-brand-purple/80 font-black text-xs cursor-pointer bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg shadow-sm"
                    >
                      Trigger Test Alert Message
                    </button>
                  </div>
                </div>

                {/* Quick Switch & Auto-Activation Catalog */}
                <div className="border border-slate-200 rounded-3xl p-6 space-y-4">
                  <div>
                    <h4 className="font-display font-black text-sm text-slate-900">Alternate Plan Quick-Activator</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Select any server plan below to instantly activate on your active profile. It adds the purchased benefits to your account automatically with zero downtime.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 Pt-2">
                    {[
                      { name: 'AI Premium Cloud', price: '₹699/mo', features: ['Unlimited NVMe Storage', 'Host 100 Websites', 'Free Wildcard SSL'] },
                      { name: 'Elite Shared Vibe', price: '₹249/mo', features: ['10 GB SSD Storage', 'Host 1 Website', 'Standard Shared SSL'] },
                      { name: 'VPS Kernel Dynamic', price: '₹1,299/mo', features: ['80 GB NVMe Storage', 'Dedicated Static IP', 'Full Root Access'] }
                    ].map((planCatalog, cidx) => (
                      <div key={cidx} className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${activeUserPlan.name === planCatalog.name ? 'border-brand-purple bg-gradient-to-br from-brand-purple/5 to-purple-500/5 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-display font-black text-xs text-slate-800">{planCatalog.name}</span>
                            {activeUserPlan.name === planCatalog.name && (
                              <span className="text-[7.5px] font-mono tracking-widest bg-brand-purple text-white px-1.5 py-0.5 rounded uppercase font-bold">Active</span>
                            )}
                          </div>
                          <p className="font-mono font-black text-[11px] text-pink-600">{planCatalog.price}</p>
                          <ul className="text-[10.5px] text-slate-500 space-y-1 pt-2 border-t border-slate-100/50 mt-2">
                            {planCatalog.features.map((f, fi) => (
                              <li key={fi} className="flex items-center gap-1">
                                <Check className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => {
                            setActiveUserPlan({
                              name: planCatalog.name,
                              price: planCatalog.price,
                              period: '12',
                              features: planCatalog.features,
                              purchaseDate: 'June 02, 2026',
                              expiryDate: 'June 05, 2026', // Keep 3-day window for consistency so user can test alerts
                              daysLeft: 3,
                              status: 'active'
                            });
                            setTerminalLogs(prev => [
                              ...prev,
                              `Ecosystem Active Plan switched securely to: '${planCatalog.name}'! Configuration successfully updated.`
                            ]);
                            setAutomaticAlertLogs(prev => [
                              `[PLAN-AUTO-ACTIVATOR] Customer upgraded/selected alternative plan: ${planCatalog.name}.`,
                              `[PLAN-AUTO-ACTIVATOR] Initialized automatic parameters matching rules. Expiry countdown set to 3 days right away.`,
                              ...prev
                            ]);
                            alert(`Plan switched successfully! No hassle automatic add process completed for '${planCatalog.name}'.`);
                          }}
                          disabled={activeUserPlan.name === planCatalog.name}
                          className={`w-full text-center py-2 rounded-xl text-[10px] font-black tracking-normal uppercase transition-all mt-4 cursor-pointer ${activeUserPlan.name === planCatalog.name ? 'bg-slate-120 text-slate-400 cursor-not-allowed border border-slate-100' : 'bg-[#120a2a] hover:bg-brand-purple text-white hover:shadow-md'}`}
                        >
                          {activeUserPlan.name === planCatalog.name ? 'Already Active' : 'Activate & Sync'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

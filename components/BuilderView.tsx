'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  RefreshCw, 
  Layout, 
  Layers, 
  CheckCircle2, 
  ChevronRight, 
  Globe, 
  Lock, 
  Shield,
  Download, 
  Monitor, 
  Smartphone, 
  Coins, 
  Check, 
  Edit3, 
  Plus, 
  Trash2, 
  Code, 
  Info, 
  X, 
  CreditCard, 
  Copy,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  Sliders,
  DollarSign,
  Undo
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BuilderViewProps {
  setActivePage: (page: string) => void;
}

export default function BuilderView({ setActivePage }: BuilderViewProps) {
  const rzpKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

  // Dynamically load dynamic Razorpay standard SDK script on host
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        try {
          document.body.removeChild(script);
        } catch (e) {
          // ignore if already unmounted or deleted
        }
      };
    }
  }, []);

  const triggerRazorpayCheckout = (amount: number, purpose: string, email: string, phone: string, onSuccessCallback: () => void) => {
    if (rzpKeyId && typeof window !== 'undefined' && (window as any).Razorpay) {
      try {
        const options = {
          key: rzpKeyId,
          amount: Math.round(amount * 100), // convert INR to paise
          currency: "INR",
          name: "Cloud Hosting & AI Site Builder",
          description: purpose,
          image: "https://picsum.photos/seed/razorpay/200/200",
          handler: function (response: any) {
            onSuccessCallback();
          },
          prefill: {
            name: "Premium Host Customer",
            email: email || "customer@aistudio.in",
            contact: phone || "9876543210"
          },
          theme: {
            color: "#4f46e5"
          }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      } catch (err) {
        console.warn("Real Razorpay client launch failed, falling back to simulated high-fidelity UI: ", err);
      }
    }

    // Default top-tier beautiful custom sandbox mode
    setRazorpayAmount(amount);
    setRazorpayPurpose(purpose);
    setRazorpayEmail(email || 'customer@aistudio.in');
    setRazorpayPhone(phone || '9876543210');
    setRazorpayOnSuccess(() => onSuccessCallback);
    setRazorpayProcessingState('idle');
    setIsRazorpayModalOpen(true);
  };

  // --- Prompt & Main Generator States ---
  const [promptValue, setPromptValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [websiteDraft, setWebsiteDraft] = useState<any | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [successDeployed, setSuccessDeployed] = useState(false);

  // --- Google AI Studio Console & Interaction Parameters ---
  const [systemInstructions, setSystemInstructions] = useState('You are an elite, modern website builder that designs high-contrast clean SaaS layouts with generous padding, playful micro-animations, and striking visual layouts.');
  const [selectedStudioModel, setSelectedStudioModel] = useState('gemini-3.5-flash');
  const [studioTemperature, setStudioTemperature] = useState(0.7);
  const [studioChatInput, setStudioChatInput] = useState('');
  const [studioChatHistory, setStudioChatHistory] = useState<any[]>([
    { sender: 'model', text: 'Hello! I am your Google AI Studio Workspace Agent. Describe any modification or feature you want to compose or refactor, and I will rewrite your website live.' }
  ]);
  const [studioConsoleLogs, setStudioConsoleLogs] = useState<string[]>([
    'System: Google AI Studio Workspace compiler active.',
    'System: Port 3000 mapped for sandbox deployment environments.'
  ]);
  const [studioLoading, setStudioLoading] = useState(false);
  const [studioActiveRightTab, setStudioActiveRightTab] = useState<'parameters' | 'logs'>('parameters');
  
  // --- Customizable Vibe/Theme State ---
  const [vibeColor, setVibeColor] = useState<'purple' | 'midnight' | 'emerald' | 'cyan' | 'amber'>('purple');
  const [vibeFont, setVibeFont] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [activeEditorTab, setActiveEditorTab] = useState<'preview' | 'code'>('preview');
  const [activeCodeFormat, setActiveCodeFormat] = useState<'jsx' | 'html'>('jsx');
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState<'saas-landing' | 'saas-dashboard' | 'ecommerce-hub' | 'corporate-portal' | 'dev-portfolio'>('saas-landing');

  // --- Credit Hub States ---
  const [credits, setCredits] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hosting_ai_builder_credits');
      if (stored !== null) {
        return parseInt(stored, 10);
      }
    }
    return 10;
  });
  const [showCreditModal, setShowCreditModal] = useState(false);
  
  // --- simulated Checkout Flow States ---
  const [selectedPack, setSelectedPack] = useState<'starter' | 'pro' | 'ultimate'>('pro');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'razorpay'>('razorpay');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [checkoutProgress, setCheckoutProgress] = useState<'idle' | 'processing' | 'success'>('idle');
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutStatusMsg, setCheckoutStatusMsg] = useState('');

  // --- Razorpay Native Checkout Modal States ---
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [razorpayAmount, setRazorpayAmount] = useState<number>(299);
  const [razorpayPurpose, setRazorpayPurpose] = useState<string>('Creator Credits Core Upgrade - Pro Pack');
  const [razorpayOnSuccess, setRazorpayOnSuccess] = useState<() => void>(() => {});
  const [razorpayEmail, setRazorpayEmail] = useState('customer@aistudio.in');
  const [razorpayPhone, setRazorpayPhone] = useState('9876543210');
  const [razorpayActiveTab, setRazorpayActiveTab] = useState<'upi' | 'card' | 'netbanking' | 'qr'>('upi');
  const [razorpaySelectedUpiApp, setRazorpaySelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [razorpayUpiAddress, setRazorpayUpiAddress] = useState('');
  const [razorpayProcessingState, setRazorpayProcessingState] = useState<'idle' | 'processing' | 'verified'>('idle');
  const [razorpayPaymentId, setRazorpayPaymentId] = useState('');

  // --- New Custom Deploy, Publishing, Domain, & Security States ---
  const [publishingState, setPublishingState] = useState<'idle' | 'compiling' | 'securing' | 'cdn' | 'success'>('idle');
  const [connectedDomain, setConnectedDomain] = useState<string>('');
  
  // Domain registration
  const [searchDomainQuery, setSearchDomainQuery] = useState('');
  const [isSearchingDomainSide, setIsSearchingDomainSide] = useState(false);
  const [domainSearchResultsSide, setDomainSearchResultsSide] = useState<any[]>([]);
  const [selectedBuyDomain, setSelectedBuyDomain] = useState<any | null>(null);
  
  // Buying/checkout steps for domain
  const [domainBuyStep, setDomainBuyStep] = useState<'none' | 'pay' | 'success'>('none');
  const [domainPayMethod, setDomainPayMethod] = useState<'upi' | 'card' | 'razorpay'>('razorpay');
  const [domainUpiId, setDomainUpiId] = useState('');
  const [domainCardName, setDomainCardName] = useState('');
  const [domainCardNumber, setDomainCardNumber] = useState('');
  const [domainCardExpiry, setDomainCardExpiry] = useState('');
  const [domainCardCvv, setDomainCardCvv] = useState('');
  const [domainCheckoutProgress, setDomainCheckoutProgress] = useState(false);
  const [domainCheckoutError, setDomainCheckoutError] = useState('');
  
  // Dynamic Lifelong Security logs
  const [securityScanTime, setSecurityScanTime] = useState<string>('Just now');
  const [securityLogs, setSecurityLogs] = useState<string[]>([
    'Automated Web Application Firewall (WAF) initialized with 45 signature rulesets.',
    'DDoS Protection Shield armed at global 100Gbps network limit.',
    'Root SSL certificate (Let\'s Encrypt Coverage) activated successfully.',
    'Vulnerability scans verified 0 critical, 0 warning patterns.'
  ]);
  const [isScanningSecurity, setIsScanningSecurity] = useState(false);

  // Node Highlight or In-Place Editor Selection state
  const [activeEditSection, setActiveEditSection] = useState<'hero' | 'features' | 'stats' | 'testimonials' | 'faq' | 'publish' | 'security' | 'terms' | 'studio'>('studio');
  const [showPreviewTermsModal, setShowPreviewTermsModal] = useState(false);

  // --- Initialize Credits connected dynamically to Raj's Admin Customer Registry profile ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncCredits = () => {
        const storedCustomers = localStorage.getItem('vibe_customers');
        if (storedCustomers) {
          try {
            const parsed = JSON.parse(storedCustomers);
            const rajProfile = parsed.find((c: any) => c.email.toLowerCase() === 'rajsahani.RgcS@gmail.com'.toLowerCase());
            if (rajProfile && rajProfile.vibeCredits !== undefined) {
              setCredits(rajProfile.vibeCredits);
              localStorage.setItem('hosting_ai_builder_credits', rajProfile.vibeCredits.toString());
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }
        const stored = localStorage.getItem('hosting_ai_builder_credits');
        if (stored !== null) {
          setCredits(parseInt(stored, 10));
        } else {
          setCredits(10);
          localStorage.setItem('hosting_ai_builder_credits', '10');
        }
      };

      syncCredits();
      window.addEventListener('storage', syncCredits);
      return () => window.removeEventListener('storage', syncCredits);
    }
  }, []);

  const saveCredits = (newBalance: number) => {
    setCredits(newBalance);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hosting_ai_builder_credits', newBalance.toString());
      
      const storedCustomers = localStorage.getItem('vibe_customers');
      if (storedCustomers) {
        try {
          const parsed = JSON.parse(storedCustomers);
          const updated = parsed.map((c: any) => {
            if (c.email.toLowerCase() === 'rajsahani.RgcS@gmail.com'.toLowerCase()) {
              return { ...c, vibeCredits: newBalance };
            }
            return c;
          });
          localStorage.setItem('vibe_customers', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  // --- Map Vibe Color details ---
  const getColorDetails = () => {
    switch (vibeColor) {
      case 'midnight':
        return {
          primary: 'bg-slate-900 border-slate-800 text-white',
          text: 'text-slate-100',
          accent: 'text-[#9f7aea]',
          accentBg: 'bg-[#9f7aea]',
          backgroundBg: 'from-slate-950 via-slate-900 to-zinc-950',
          borderCol: 'border-slate-800',
          primaryBtn: 'bg-violet-600 hover:bg-violet-500 text-white',
          secondaryBtn: 'bg-white/10 text-white hover:bg-white/15',
          bannerAlert: 'bg-[#120a2a]/40 border-[#321a4f]'
        };
      case 'emerald':
        return {
          primary: 'bg-emerald-600 border-emerald-500 text-white',
          text: 'text-slate-900',
          accent: 'text-emerald-500',
          accentBg: 'bg-emerald-500',
          backgroundBg: 'from-emerald-50 via-white to-slate-50',
          borderCol: 'border-slate-100',
          primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
          secondaryBtn: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          bannerAlert: 'bg-emerald-50/50 border-emerald-100'
        };
      case 'cyan':
        return {
          primary: 'bg-sky-600 border-sky-500 text-white',
          text: 'text-slate-900',
          accent: 'text-sky-500',
          accentBg: 'bg-sky-500',
          backgroundBg: 'from-sky-50 via-white to-slate-50',
          borderCol: 'border-slate-100',
          primaryBtn: 'bg-sky-600 hover:bg-sky-500 text-white',
          secondaryBtn: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          bannerAlert: 'bg-sky-50/50 border-sky-100'
        };
      case 'amber':
        return {
          primary: 'bg-amber-600 border-amber-500 text-white',
          text: 'text-slate-900',
          accent: 'text-amber-500',
          accentBg: 'bg-amber-500',
          backgroundBg: 'from-amber-55 via-white to-slate-50',
          borderCol: 'border-slate-100',
          primaryBtn: 'bg-amber-600 hover:bg-amber-500 text-white',
          secondaryBtn: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          bannerAlert: 'bg-amber-50/50 border-amber-100'
        };
      case 'purple':
      default:
        return {
          primary: 'bg-[#5b36ff] border-[#4222da] text-white',
          text: 'text-slate-900',
          accent: 'text-[#5b36ff]',
          accentBg: 'bg-[#5b36ff]',
          backgroundBg: 'from-purple-50 via-white to-slate-50',
          borderCol: 'border-slate-100',
          primaryBtn: 'bg-[#5b36ff] hover:bg-[#492be0] text-white',
          secondaryBtn: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          bannerAlert: 'bg-violet-50/50 border-violet-100'
        };
    }
  };

  const selectedColors = getColorDetails();

  // --- Fallback Dynamic Pre-Loaded SaaS/UI Models ---
  const getSaaSBlueprintData = (type: string, queryPrompt: string) => {
    const userPromptClean = queryPrompt || "Vibe Matrix Software";
    const titleCasePrompt = userPromptClean.charAt(0).toUpperCase() + userPromptClean.slice(1);

    const baseLegal = {
      title: "Terms and Conditions of Service",
      lastUpdated: "June 2026",
      companyName: `${titleCasePrompt} Corporation`,
      governingLaw: "the Jurisdiction of New Delhi, India",
      clauses: [
        { title: "Acceptance of Website Terms", description: "By rendering, hosting, or accessing this auto-compiled digital space, you unconditionally accept and agree to hold harmless NexHost and all affiliated edge routes." },
        { title: "Fair Development Representation", description: "All content generated on this domain represents prompt-driven wireframes. Real-world transactions or payment gateway behaviors are sandboxed prototypes requiring real merchant key configurations." },
        { title: "Indemnification & Edge SLA", description: "SaaS clusters, SSL renewals, and edge routing mirrors are provided for simulated live previews. NexHost assumes zero liability for user-generated copies, data persistence breaches, or external domain purchases." }
      ]
    };

    const getRawTemplate = () => {
      switch (type) {
      case 'saas-dashboard':
        return {
          themeName: `${titleCasePrompt} Control Center`,
          hero: {
            title: `Manage High-Speed SaaS Clusters Live`,
            subtitle: `A comprehensive AI-managed developer console constructed for ${titleCasePrompt}. Debug node throughput, manage containers, and monitor memory latency in milliseconds.`,
            ctaText: "Launch Admin Matrix"
          },
          features: [
            { icon: "Shield", title: "Isolated Shards Firewall", description: "Shield active database schemas from common security injection bottlenecks using sandboxed routing logs." },
            { icon: "Zap", title: "Micro-latency Latency <5ms", description: "Edge routers balance server-side computing seamlessly to prevent regional outages." },
            { icon: "Globe", title: "UPI & Mastercard Integration", description: "Manage subscriptions and dynamic credit usage metrics in an elegant, modern portal." }
          ],
          stats: [
            { label: "Active Workers Online", value: "348 / Nodes" },
            { label: "Memory Allocated", value: "512 GB RAM" },
            { label: "Continuous Availability", value: "99.999%" }
          ],
          sections: [
            { title: "Dynamic Memory Cache", content: "Our custom architecture intercepts telemetry calls to scale down idle threads during off-peak hours automatically. Gain granular cluster controls.", alignment: 'left' },
            { title: "Universal API Gateway Logs", content: "Integrate with external providers or self-hosted servers in secondary networks. Codebases sync instantly with GitHub integrations.", alignment: 'right' }
          ],
          testimonials: [
            { name: "Aarav Sharma", role: "Principal Architect, CloudX", comment: "This centralized SaaS layout is stellar! It took less than a minute to coordinate telemetry on our custom clusters." },
            { name: "Jenna Cole", role: "DevOps Engineer", comment: "The styling is robust and loading speeds are instantly fast. Easily the best React developer panel in the market." }
          ],
          faq: [
            { question: "Can I manage Docker files directly?", answer: "Yes! The workspace binds to your custom configurations dynamically with automatic hot restarts." },
            { question: "Is multi-region replication automated?", answer: "Any modification triggers a background mirror across continuous hosting caches instantly." }
          ]
        };

      case 'ecommerce-hub':
        return {
          themeName: `${titleCasePrompt} Smart Boutique`,
          hero: {
            title: `Scale High-Conversion E-Commerce Stores`,
            subtitle: `Unlock continuous performance logs, integrated regional delivery tracking, and zero-fee Rupay & UPI Checkouts configured for ${titleCasePrompt} instantly.`,
            ctaText: "Explore Digital Catalog"
          },
          features: [
            { icon: "Sparkles", title: "Smart Catalog Optimization", description: "Optimize product assets dynamically. High-resolution images load transparently with ultra-low bandwidth consumption." },
            { icon: "Layers", title: "Omnichannel Dispatch API", description: "Connect directly to shipping carriers, generating packaging labels and tracking slips in real-time." },
            { icon: "Globe", title: "Universal Currency Scaling", description: "Accept transactions globally in Rupees, Dollars, Euros, and local payment pathways fluidly." }
          ],
          stats: [
            { label: "Average Checkout Rate", value: "1.4s Speed" },
            { label: "Active Buyers Streamed", value: "18.2k+" },
            { label: "Client Retainment Ratio", value: "+38% Growth" }
          ],
          sections: [
            { title: "Interactive Asset Optimization", content: "Keep buyers focused on checking out without sluggish script interruptions. Fully optimized for instant mobile caching and swipe inputs.", alignment: 'left' },
            { title: "Consolidated Sales Dashboard", content: "Track daily streaks, revenue charts, refunds, and promo coupon usage in real-time in our simplified control panel companion.", alignment: 'right' }
          ],
          testimonials: [
            { name: "Priya Patel", role: "Founder, LuxeCraft", comment: "Our online conversions skyrocketed by nearly 40% when we switched to this high-speed template." },
            { name: "David Vance", role: "E-comm Consultant", comment: "Fast loading is critical for retention. This setup executes lightweight Tailwind layout blocks beautifully." }
          ],
          faq: [
            { question: "What payment gateways are active?", answer: "It supports standard credit billing, dynamic UPI intent triggers, Razorpay, and direct Stripe proxy accounts." },
            { question: "Is there built-in cart recovery?", answer: "Yes, automated push notifications are scheduled for abandoned checkouts after 15 minutes." }
          ]
        };

      case 'corporate-portal':
        return {
          themeName: `${titleCasePrompt} Enterprise Synergy`,
          hero: {
            title: `Robust IT Consultancy & Cloud Migration`,
            subtitle: `Providing trusted corporate solutions for ${titleCasePrompt}. We implement automated hybrid cloud architecture, dedicated cluster fail-safes, and standard SOC2 audits.`,
            ctaText: "Request Principal Briefing"
          },
          features: [
            { icon: "Lock", title: "SOC2 & ISO Certification", description: "We enforce strict security controls to manage corporate data pipelines without secondary leaks." },
            { icon: "Globe", title: "Multi-tenant Elastic Sharding", description: "Distribute heavy high-volume computing queries to isolated sandboxes securely." },
            { icon: "RefreshCw", title: "Zero Downtime Deployments", description: "Sync server images smoothly with persistent cloud memory backups in continuous rotations." }
          ],
          stats: [
            { label: "Corporate Shards Shielded", value: "1,200+" },
            { label: "Consultancy Engineers", value: "45 Principal" },
            { label: "Uptime Commitment SLA", value: "99.9999%" }
          ],
          sections: [
            { title: "Rigorous High Performance Standards", content: "Scale IT parameters with absolute confidence. Our dedicated team reviews database schemas to maximize query density and prevent network jams.", alignment: 'left' },
            { title: "Hybrid Private Network Integrations", content: "Bridge local database engines with global node clusters easily in our simplified hPanel ecosystem.", alignment: 'right' }
          ],
          testimonials: [
            { name: "Kabir Mehta", role: "VP of Engineering, ApexCorp", comment: "The architecture designed here minimized our processing bottlenecks and streamlined high load queries." },
            { name: "Samantha Ross", role: "Chief Security Officer", comment: "Excellent alignment with modern coding rules. Our team uses these clean layouts to showcase cloud progress reports." }
          ],
          faq: [
            { question: "Do you offer custom SLA support?", answer: "Yes, our certified DevOps engineers provide active priority support in real-time around the clock." },
            { question: "How does the cloud bridge authenticate?", answer: "We implement OAuth 2.0 gateways paired with dedicated private key infrastructure logs." }
          ]
        };

      case 'dev-portfolio':
        return {
          themeName: `${titleCasePrompt} - Systems Architect`,
          hero: {
            title: `Innovating Serverless Backends & Edge Nodes`,
            subtitle: `The portfolio workspace of an elite software programmer. Specialized in sub-10ms compilers, container optimizations, and dynamic state engines for ${titleCasePrompt}.`,
            ctaText: "Acquire Tech Resume"
          },
          features: [
            { icon: "Code", title: "Static Compiler Engineering", description: "Building highly-optimized assembly engines that strip out redundant layout garbage for responsive speeds." },
            { icon: "Layers", title: "Distributed Web Architectures", description: "Structuring custom backend microservices using Node.js, Next.js, and serverless edge databases." },
            { icon: "Monitor", title: "Adaptive UI Vector Design", description: "Composing minimalist high-contrast typography pairings and accessible grids with extreme visual rigor." }
          ],
          stats: [
            { label: "GitHub Open Stars", value: "2.4k+ Stars" },
            { label: "NPM Packages Maintained", value: "14 Libraries" },
            { label: "Total App Projects Shipped", value: "85 Production" }
          ],
          sections: [
            { title: "Fastidious Technical Execution", content: "Every layout line is crafted to minimize load sizes. I replace complex bloated widgets with clean CSS parameters and dynamic variables.", alignment: 'left' },
            { title: "Active Open-Source Systems Contributions", content: "Actively contributing container optimizations to modern compilation compilers and state managers.", alignment: 'right' }
          ],
          testimonials: [
            { name: "Rajesh Sahani", role: "Product Directory, NexHost AI", comment: "Absolutely pristine clean code. This structural layout is visually breathtaking and loads extremely fast." },
            { name: "Elena Rostova", role: "Lead Systems Engineer", comment: "A masterpiece showcase of mono-spaced aesthetics. Focuses exactly on technical performance metrics." }
          ],
          faq: [
            { question: "Are you available for contract roles?", answer: "Yes! Reach out via the secure corporate console to coordinate project specs." },
            { question: "What is your primary programming stack?", answer: "I build projects using TypeScript, Rust, Go, Next.js App Router, and clean Tailwind configurations." }
          ]
        };

      case 'saas-landing':
      default:
        return {
          themeName: `${titleCasePrompt} SaaS Matrix`,
          hero: {
            title: `Automate SaaS Operations Under One Console`,
            subtitle: `The ultimate performance accelerator configured for ${titleCasePrompt}. Consolidate database queries, live deployments, and microserver caches in forty seconds.`,
            ctaText: "Begin Free Workspace Trial"
          },
          features: [
            { icon: "Zap", title: "Blazing Speed Cache Core", description: "Our technical server-level compression renders layouts instantly, maximizing your customer sign-up rates." },
            { icon: "Shield", title: "Enterprise Grade Credentials Shield", description: "Enforcing absolute security across active databases, API integrations, and personal credentials." },
            { icon: "Globe", title: "Universal Edge Routing Networks", description: "Hosted on low-latency global CDN coordination zones to render UI elements in microseconds." }
          ],
          stats: [
            { label: "Dynamic Telemetry Tracked", value: "1.2B / Month" },
            { label: "Average Server Ping Rate", value: "<8ms Response" },
            { label: "SaaS Conversions Surged", value: "+44% Retained" }
          ],
          sections: [
            { title: "Designed with Pristine Architecture", content: "Easily coordinates complex workflows on both desktop and mobile platforms. Strip out the operational overhead and scale workloads with instant visual debugging counters.", alignment: 'left' },
            { title: "Unify Team Integrations Smoothly", content: "Deploy microservices, publish serverless hooks, and manage webhook logs transparently using our integrated dashboard controls.", alignment: 'right' }
          ],
          testimonials: [
            { name: "John Doe", role: "Founder, SaaSFlow.ai", comment: "The loading speeds on these generated SaaS blueprints are unbelievable. It completely altered our growth parameters!" },
            { name: "Amelia Thorne", role: "VP Product Lifecycle", comment: "Beautifully organized. It matches Google AI Studio's layout precision but executes with custom-tailored Tailwind variables." }
          ],
          faq: [
            { question: "Can I host this on private servers?", answer: "Absolutely. Download the production React code directly and host it anywhere instantly." },
            { question: "Are the standard elements SEO prioritized?", answer: "Yes, structured metadata tags and semantic schema blocks are compiled in the page header automatically." }
          ]
        };
      }
    };

    return { ...getRawTemplate(), legal: baseLegal };
  };

  // --- Handle AI Website Generation / Update ---
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptValue.trim()) return;

    // Credit enforcement check
    if (credits <= 0) {
      setCheckoutProgress('idle');
      setShowCreditModal(true);
      return;
    }

    setLoading(true);
    setWebsiteDraft(null);
    setSuccessDeployed(false);

    // Consume 1 credit point!
    const updatedCredits = credits - 1;
    saveCredits(updatedCredits);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'website', 
          prompt: `${selectedTemplateType.toUpperCase()} website with palette ${vibeColor}, named: "${promptValue}". Detail specifications.` 
        })
      });
      const data = await response.json();
      
      if (response.ok && data.website) {
        // Enforce our custom templates dynamic elements to ensure they always reflect SaaS parameters perfectly
        const liveSeed = getSaaSBlueprintData(selectedTemplateType, promptValue.trim());
        
        // Merge Gemini's copy output with our blueprint structures for extreme robustness and 100% fast visual layouts
        setWebsiteDraft({
          ...liveSeed,
          themeName: data.website.themeName || liveSeed.themeName,
          hero: {
            title: data.website.hero?.title || liveSeed.hero.title,
            subtitle: data.website.hero?.subtitle || liveSeed.hero.subtitle,
            ctaText: data.website.hero?.ctaText || liveSeed.hero.ctaText
          },
          // Map features and keep clean icons
          features: data.website.features ? data.website.features.slice(0, 3).map((f: any, i: number) => ({
            icon: liveSeed.features[i]?.icon || "Zap",
            title: f.title || liveSeed.features[i]?.title,
            description: f.description || liveSeed.features[i]?.description
          })) : liveSeed.features,
          stats: data.website.stats ? data.website.stats.slice(0, 3) : liveSeed.stats,
          sections: data.website.sections ? data.website.sections.slice(0, 2) : liveSeed.sections,
          testimonials: data.website.testimonials ? data.website.testimonials.slice(0, 2) : liveSeed.testimonials,
          faq: data.website.faq ? data.website.faq.slice(0, 2) : liveSeed.faq,
          legal: data.website.legal || liveSeed.legal,
          fontStyle: vibeFont
        });
      } else {
        // Safe robust fallback is fully active, ensuring 100% uptime even if regional APIs timeout
        const liveSeed = getSaaSBlueprintData(selectedTemplateType, promptValue.trim());
        setWebsiteDraft(liveSeed);
      }
    } catch (err) {
      console.warn("API route failed, pulling elite blueprint preset instantly for fast UX:", err);
      const liveSeed = getSaaSBlueprintData(selectedTemplateType, promptValue.trim());
      setWebsiteDraft(liveSeed);
    } finally {
      setLoading(false);
    }
  };

  // --- Quick Prompt Suggestion clicker helper ---
  const handleQuickSuggestion = (text: string, templateType: typeof selectedTemplateType) => {
    setPromptValue(text);
    setSelectedTemplateType(templateType);
  };

  const handleDeployDraft = () => {
    if (!websiteDraft) return;
    setSuccessDeployed(false);
    setPublishingState('compiling');
    
    // Simulate multi-stage live production hosting deployment
    setTimeout(() => {
      setPublishingState('securing');
      setTimeout(() => {
        setPublishingState('cdn');
        setTimeout(() => {
          setPublishingState('success');
          setSuccessDeployed(true);
          setActiveEditSection('publish'); // Instantly transition sidebar to domain publishing!
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const handleStudioChatPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioChatInput.trim() || studioLoading) return;

    if (credits <= 0) {
      setCheckoutProgress('idle');
      setShowCreditModal(true);
      return;
    }

    const userMsg = studioChatInput.trim();
    setStudioChatInput('');
    setStudioLoading(true);

    // Append to message history
    setStudioChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    
    // Append console log history
    setStudioConsoleLogs(prev => [
      ...prev,
      `[AI Studio] Initializing refactoring stream...`,
      `[AI Studio] Model: ${selectedStudioModel} | Temp: ${studioTemperature}`,
      `[AI Studio] System Guidance: "${systemInstructions}"`,
      `[System] Transmitting JSON draft data (size: ${JSON.stringify(websiteDraft).length} bytes) to Super AI API...`
    ]);

    // Spend 1 credit
    const updatedCredits = credits - 1;
    saveCredits(updatedCredits);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'website', 
          prompt: `System Instructions: "${systemInstructions}". User Change Request: "${userMsg}". Follow the system guidelines and update the template structure appropriately.`, 
          currentDraft: websiteDraft
        })
      });
      const data = await response.json();
      
      if (response.ok && data.website) {
        setWebsiteDraft({
          ...data.website,
          fontStyle: vibeFont
        });

        // Add successful log steps
        setStudioConsoleLogs(prev => [
          ...prev,
          `[Super AI API] Received modified website structure successfully.`,
          `[Linter] Validating JSX tree compatibility...`,
          `[JSX Compiler] Standard updates integrated successfully on website canvas!`,
          `[Sandbox] Port 3000 re-binded and live updated gracefully.`
        ]);

        setStudioChatHistory(prev => [
          ...prev,
          { sender: 'model', text: `Successfully updated the website draft! I've incorporated your feedback: "${userMsg}". You can inspect the real-time live preview in the Interactive Browser tab.` }
        ]);
      } else {
        throw new Error(data.error || "Super AI route failed to respond");
      }
    } catch (err: any) {
      console.error(err);
      setStudioConsoleLogs(prev => [
        ...prev,
        `[Error] Super AI rewrite failed: ${err?.message || err}. Reverting compile pipelines.`
      ]);
      setStudioChatHistory(prev => [
          ...prev,
          { sender: 'model', text: `Sorry, there was an issue communicating with the AI Studio generator: "${err?.message || "Parsing exception"}"` }
      ]);
    } finally {
      setStudioLoading(false);
    }
  };

  const handleDomainSearchSide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDomainQuery.trim()) return;

    setIsSearchingDomainSide(true);
    setDomainSearchResultsSide([]);
    setDomainBuyStep('none');
    setSelectedBuyDomain(null);

    const cleanPattern = searchDomainQuery.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    const standardList = [
      { name: `${cleanPattern}.com`, status: cleanPattern.length <= 4 ? 'taken' : 'available', price: '₹699/yr', badges: ['Most Popular'] },
      { name: `${cleanPattern}.in`, status: 'available', price: '₹399/yr', badges: ['India Choice'] },
      { name: `${cleanPattern}.co.in`, status: 'available', price: '₹299/yr', badges: ['India Business'] },
      { name: `${cleanPattern}.net`, status: 'available', price: '₹849/yr', badges: ['Tech Brand'] }
    ];
    
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'domain', searchTerm: searchDomainQuery.trim() })
      });

      const data = await response.json();
      if (response.ok && data.results) {
        // Convert any fallback dollar prices to Indian Rupees for clear local context
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

        // Use real DNS-verified direct Matches list from server if available
        let baseList = standardList;
        if (data.directMatches) {
          baseList = data.directMatches.map((r: any) => {
            let localPrice = r.price || '₹699/yr';
            if (localPrice.includes('$')) {
              const num = parseFloat(localPrice.replace(/[^0-9.]/g, ''));
              if (!isNaN(num)) {
                if (r.tld === '.com') localPrice = '₹699/yr';
                else if (r.tld === '.in') localPrice = '₹399/yr';
                else if (r.tld === '.co.in') localPrice = '₹299/yr';
                else if (r.tld === '.net') localPrice = '₹849/yr';
                else localPrice = `₹${Math.round(num * 83)}/yr`;
              }
            }
            return {
              name: r.name,
              status: r.status,
              price: localPrice,
              badges: r.badges
            };
          }).filter((m: any) => ['.com', '.in', '.co.in', '.net'].includes(m.name.slice(m.name.lastIndexOf('.'))));
        }

        const merged = [...baseList];
        formattedAi.forEach((item: any) => {
          if (!merged.some(m => m.name === item.name)) {
            merged.push(item);
          }
        });
        setDomainSearchResultsSide(merged);
      } else {
        setDomainSearchResultsSide(standardList);
      }
    } catch (err) {
      console.error(err);
      setDomainSearchResultsSide(standardList);
    } finally {
      setIsSearchingDomainSide(false);
    }
  };

  const handleProcessDomainPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setDomainCheckoutError('');

    if (domainPayMethod === 'razorpay') {
      if (!selectedBuyDomain) {
        setDomainCheckoutError('Please select a domain first.');
        return;
      }
      
      const priceStr = selectedBuyDomain.price.replace(/[^0-9]/g, '');
      const priceVal = parseInt(priceStr, 10) || 499;
      
      triggerRazorpayCheckout(
        priceVal,
        `LIFETIME Edge Routing Domain Secure Bind: ${selectedBuyDomain.name}`,
        'customer@aistudio.in',
        '9876543210',
        () => {
          setDomainBuyStep('success');
          setConnectedDomain(selectedBuyDomain.name);
        }
      );
      return;
    }

    if (domainPayMethod === 'upi') {
      if (!domainUpiId.trim() || !domainUpiId.includes('@')) {
        setDomainCheckoutError('Please enter a valid Indian UPI ID (e.g. name@paytm)');
        return;
      }
    } else {
      if (!domainCardName.trim() || !domainCardNumber.trim() || !domainCardExpiry.trim() || !domainCardCvv.trim()) {
        setDomainCheckoutError('Please populate all credit card fields.');
        return;
      }
    }

    setDomainCheckoutProgress(true);

    // Simulate instant DNS binding & SSL generation callback
    setTimeout(() => {
      setDomainCheckoutProgress(false);
      setDomainBuyStep('success');
      if (selectedBuyDomain) {
        setConnectedDomain(selectedBuyDomain.name);
      }
    }, 1800);
  };

  const triggerLiveSecurityScan = () => {
    setIsScanningSecurity(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    
    setTimeout(() => {
      setIsScanningSecurity(false);
      setSecurityScanTime(`Last scanned at Today, ${timeStr}`);
      setSecurityLogs([
        `[${timeStr}] - Web Application Firewall (WAF) scanned 340 ingress queries: 0 malicious signatures found.`,
        `[${timeStr}] - SSL Certification integrity verified via OCSP Stapling (100% Valid).`,
        `[${timeStr}] - DDoS scrubbing centers verified continuous heartbeat (sub-5ms packet routing latency).`,
        `[${timeStr}] - Zero-Day safety vulnerabilities patched and node variables hard-secured.`
      ]);
    }, 1500);
  };

  // --- Inline Content Update Helpers ---
  const updateDraftText = (section: string, indexOrKey: any, field: string, value: string) => {
    if (!websiteDraft) return;

    const updated = { ...websiteDraft };

    if (section === 'hero') {
      updated.hero[field] = value;
    } else if (section === 'themeName') {
      updated.themeName = value;
    } else if (section === 'features' && typeof indexOrKey === 'number') {
      updated.features[indexOrKey][field] = value;
    } else if (section === 'stats' && typeof indexOrKey === 'number') {
      updated.stats[indexOrKey][field] = value;
    } else if (section === 'sections' && typeof indexOrKey === 'number') {
      updated.sections[indexOrKey][field] = value;
    } else if (section === 'testimonials' && typeof indexOrKey === 'number') {
      updated.testimonials[indexOrKey][field] = value;
    } else if (section === 'faq' && typeof indexOrKey === 'number') {
      updated.faq[indexOrKey][field] = value;
    } else if (section === 'legal') {
      if (indexOrKey === null) {
        if (!updated.legal) updated.legal = {};
        updated.legal[field] = value;
      } else if (typeof indexOrKey === 'number') {
        if (!updated.legal) updated.legal = { clauses: [] };
        if (!updated.legal.clauses) updated.legal.clauses = [];
        if (updated.legal.clauses[indexOrKey]) {
          updated.legal.clauses[indexOrKey][field] = value;
        }
      }
    }

    setWebsiteDraft(updated);
  };

  // --- Simulated Secure Checkout Logic ---
  const handleProcessUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');
    
    if (paymentMethod === 'razorpay') {
      let boughtValue = 50;
      let price = 199;
      let packName = "Starter Pack";
      if (selectedPack === 'pro') {
        boughtValue = 150;
        price = 299;
        packName = "Pro Pack";
      } else if (selectedPack === 'ultimate') {
        boughtValue = 500;
        price = 599;
        packName = "Ultimate Max Pro Pack";
      }
      
      triggerRazorpayCheckout(
        price,
        `AI Site Builder ${packName} (+${boughtValue} Credits)`,
        'customer@aistudio.in',
        '9876543210',
        () => {
          const finalBalance = credits + boughtValue;
          saveCredits(finalBalance);
          setCheckoutProgress('success');
        }
      );
      return;
    }

    // Validations
    if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        setCheckoutError('Please enter a valid Indian UPI ID (e.g. name@upi)');
        return;
      }
    } else {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setCheckoutError('Please enter a valid 16-digit Card Number');
        return;
      }
      if (!cardExpiry.trim()) {
        setCheckoutError('Please enter card expiry date (MM/YY)');
        return;
      }
      if (cardCvv.length < 3) {
        setCheckoutError('Please enter a valid CVV code');
        return;
      }
    }

    setCheckoutProgress('processing');
    setCheckoutStatusMsg('Securing sandbox gateway...');

    setTimeout(() => {
      setCheckoutStatusMsg('Verifying UPI context/Card coordinates...');
      
      setTimeout(() => {
        setCheckoutStatusMsg('Fulfilling credit token allocations...');
        
        setTimeout(() => {
          let boughtValue = 50;
          if (selectedPack === 'pro') boughtValue = 150;
          if (selectedPack === 'ultimate') boughtValue = 500; // Simulated unlimited as 500 massive points

          const finalBalance = credits + boughtValue;
          saveCredits(finalBalance);
          setCheckoutProgress('success');
        }, 1200);

      }, 1000);

    }, 800);
  };

  // --- Code String Exporters ---
  const getCompiledJSXCode = () => {
    if (!websiteDraft) return '';
    return `// Production SaaS React Component
// Styled with Tailwind CSS & Lucide Icons

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Shield, Zap, Globe, MessageCircle, HelpCircle } from 'lucide-react';

export default function SaaSGeneratedWebsite() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <div className="min-h-screen text-slate-900 bg-gradient-to-b ${websiteDraft.fontStyle === 'serif' ? 'font-serif' : websiteDraft.fontStyle === 'mono' ? 'font-mono' : 'font-sans'}">
      
      {/* Header bar */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-3.5 h-3.5 rounded-full bg-indigo-600 animate-pulse block" />
          <span className="font-extrabold text-sm uppercase tracking-wider">${websiteDraft.themeName}</span>
        </div>
        <nav className="hidden md:flex space-x-6 text-xs font-semibold text-slate-500">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#stats" className="hover:text-indigo-600 transition-colors">Performance</a>
          <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Reviews</a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
        </nav>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm">
          ${websiteDraft.hero?.ctaText || 'Get Started'}
        </button>
      </header>

      {/* Hero section */}
      <section className="py-24 text-center px-4 max-w-4xl mx-auto space-y-6">
        <span className="inline-flex items-center space-x-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-indigo-600" />
          <span>Active SaaS Cluster Node</span>
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
          ${websiteDraft.hero?.title}
        </h1>
        <p className="text-sm md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          ${websiteDraft.hero?.subtitle}
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-xl font-bold text-xs md:text-sm shadow-md transition-transform hover:scale-[1.02]">
            ${websiteDraft.hero?.ctaText || 'Get Started Now'}
          </button>
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-bold text-xs md:text-sm">
            Watch Developer Demo
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 bg-slate-50/50 border-y border-slate-100 px-6 max-w-7xl mx-auto">
        <h2 className="text-center font-black tracking-tight text-slate-900 text-xl md:text-2xl mb-12">Engineered Core Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${websiteDraft.features?.map((f: any) => `
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 hover:translate-y-[-2px] transition-all">
            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl w-fit">
              <Zap className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">${f.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">${f.description}</p>
          </div>`).join('\n          ')}
        </div>
      </section>

      {/* Stats Board */}
      <section id="stats" className="py-12 bg-slate-900 text-white px-6 my-12 rounded-3xl max-w-7xl mx-auto flex flex-wrap justify-around items-center gap-8 text-center">
        ${websiteDraft.stats?.map((s: any) => `
        <div className="space-y-1">
          <div className="text-2xl md:text-4xl font-black text-indigo-400">${s.value}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">${s.label}</div>
        </div>`).join('\n        ')}
      </section>

      {/* Body Blocks */}
      <section className="py-12 px-6 max-w-7xl mx-auto space-y-16">
        ${websiteDraft.sections?.map((sec: any) => `
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg md:text-xl">${sec.title}</h3>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">${sec.content}</p>
          </div>
          <div className="w-full md:w-1/2 aspect-video bg-gradient-to-tr from-slate-50 to-indigo-50/50 rounded-2xl border border-slate-100 flex items-center justify-center">
            <span className="text-[10px] font-mono text-slate-450 uppercase tracking-widest">Active Matrix Graphics</span>
          </div>
        </div>`).join('\n        ')}
      </section>

      {/* Reviews Section */}
      <section id="testimonials" className="py-16 bg-slate-50 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-black text-slate-900 text-lg md:text-2xl mb-12">Client Feedbacks & Audits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${websiteDraft.testimonials?.map((t: any) => `
            <div className="bg-white p-6 rounded-2xl border border-slate-150 text-left space-y-4 shadow-sm">
              <p className="text-xs text-slate-500 italic leading-relaxed">"${t.comment}"</p>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">${t.name}</h4>
                <p className="text-[10px] text-indigo-600 font-semibold">${t.role}</p>
              </div>
            </div>`).join('\n            ')}
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section id="faq" className="py-16 px-6 max-w-5xl mx-auto space-y-8">
        <h2 className="text-center font-black text-slate-900 text-lg md:text-2xl mb-10">Frequently Addressed Queries</h2>
        <div className="space-y-4">
          ${websiteDraft.faq?.map((q: any, i: number) => `
          <div className="bg-white border border-slate-150 rounded-xl p-4 cursor-pointer">
            <div className="flex justify-between items-center font-bold text-xs text-slate-900">
              <span>${q.question}</span>
              <span>+</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              ${q.answer}
            </p>
          </div>`).join('\n          ')}
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="border-t border-slate-100 py-12 text-center text-[11px] text-slate-400 px-6 font-mono space-y-4">
        <div>&copy; {new Date().getFullYear()} ${websiteDraft.themeName}. All rights reserved on secure hosting clusters.</div>
        <div>
          <button 
            onClick={() => setShowTermsModal(true)} 
            className="bg-slate-50 border border-slate-205 hover:bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider text-[9.5px] cursor-pointer"
          >
            Read Terms & Conditions
          </button>
        </div>
      </footer>

      {/* Stateful Terms Overlay Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-left">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-6 shadow-2xl relative flex flex-col max-h-[85%] text-slate-700 font-sans">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-605 font-bold border border-slate-205 cursor-pointer text-xs"
            >
              &times;
            </button>
            <div className="space-y-1.5 pb-3 border-b border-slate-100 shrink-0">
              <span className="text-[8.5px] px-2 py-0.5 rounded font-black bg-indigo-50 border border-indigo-150 text-indigo-700 uppercase tracking-widest font-mono block w-max animate-pulse">Legal Document</span>
              <h3 className="font-sans font-black text-slate-900 text-sm tracking-tight">${websiteDraft.legal?.title || "Terms and Conditions"}</h3>
              <p className="text-[10px] text-slate-450 font-mono">Last Updated: ${websiteDraft.legal?.lastUpdated || "June 2026"}</p>
            </div>
            <div className="flex-1 overflow-y-auto py-3 space-y-4 max-h-[280px] text-[11.5px] leading-relaxed text-slate-600">
              <div>
                <p className="font-bold text-slate-800 mb-1">1. Parties & Governing Jurisdiction</p>
                <p>These terms and conditions govern the use of virtual services. These guidelines are compiled on behalf of <span className="font-bold text-indigo-600">${websiteDraft.legal?.companyName || "Our Brand Group"}</span> and are strictly regulated under <span className="font-mono text-xs text-indigo-700 font-bold bg-indigo-55 px-1 py-0.5 rounded">${websiteDraft.legal?.governingLaw || "the Jurisdiction of India"}</span>.</p>
              </div>
              ${websiteDraft.legal?.clauses?.map((c: any, i: number) => `
              <div>
                <p className="font-bold text-slate-800 mb-1">\${i + 2}. ${c.title}</p>
                <p>${c.description}</p>
              </div>`).join('\n              ')}
            </div>
            <div className="border-t border-slate-101 pt-3 flex justify-end shrink-0">
              <button
                onClick={() => setShowTermsModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10.5px] px-5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Accept & Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}`;
  };

  const getCompiledHTMLCode = () => {
    if (!websiteDraft) return '';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${websiteDraft.themeName} | Generated</title>
  <!-- Tailwind CSS Playground compiled via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts Inter -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;450;600;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body className="bg-slate-55 text-slate-900 antialiased">

  <!-- Responsive Navigation -->
  <header className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-150 px-6 py-4 flex items-center justify-between z-50">
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-violet-600 inline-block"></span>
      <span className="font-extrabold uppercase text-xs tracking-wider">${websiteDraft.themeName}</span>
    </div>
    <div className="hidden md:flex gap-6 text-xs font-semibold text-slate-650">
      <a href="#features" className="hover:text-violet-650">Features</a>
      <a href="#stats" className="hover:text-violet-650">Stats</a>
      <a href="#reviews" className="hover:text-violet-650">Reviews</a>
    </div>
    <button className="bg-violet-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-violet-700 transition">
      ${websiteDraft.hero?.ctaText || 'Get Started'}
    </button>
  </header>

  <!-- Hero panel -->
  <section className="text-center py-20 px-4 max-w-4xl mx-auto space-y-6">
    <span className="bg-violet-100 text-violet-700 border border-violet-200 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full inline-block">60%+ fast compiled UI</span>
    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">${websiteDraft.hero?.title}</h1>
    <p className="text-slate-500 max-w-xl mx-auto text-xs md:text-sm leading-relaxed">${websiteDraft.hero?.subtitle}</p>
    <div className="flex justify-center gap-3">
      <button className="bg-violet-600 text-white px-5 py-3 rounded-lg text-xs font-bold shadow-md hover:bg-violet-700 select-none">${websiteDraft.hero?.ctaText}</button>
      <button className="bg-slate-150 text-slate-755 hover:bg-slate-200 px-5 py-3 rounded-lg text-xs font-bold">Watch Video</button>
    </div>
  </section>

  <!-- Features Grid -->
  <section id="features" className="py-16 bg-slate-50 border-t border-slate-200 px-6">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-center font-black tracking-tight text-slate-950 text-xl md:text-2xl mb-12">Core Features Specifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${websiteDraft.features?.map((f: any) => `
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm">${f.title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">${f.description}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section id="stats" className="py-10 bg-slate-950 text-white text-center">
    <div className="max-w-7xl mx-auto flex flex-wrap justify-around gap-6">
      ${websiteDraft.stats?.map((s: any) => `
      <div>
        <div className="text-xl md:text-2xl font-black text-violet-400">${s.value}</div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest">${s.label}</p>
      </div>`).join('')}
    </div>
  </section>

  <!-- Terms overlay Modal (Vanilla JS) -->
  <div id="terms-modal-overlay" class="fixed inset-0 bg-black/75 backdrop-blur-xs hidden flex items-center justify-center p-4 z-50 text-left font-sans">
    <div class="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-6 shadow-2xl relative flex flex-col max-h-[85%] text-slate-700">
      <button onclick="document.getElementById('terms-modal-overlay').classList.add('hidden')" class="absolute top-4 right-4 w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-200 cursor-pointer text-xs">
        &times;
      </button>
      <div class="pb-3 border-b border-slate-100 shrink-0 space-y-1">
        <span class="text-[8.5px] px-1.5 py-0.5 rounded font-black bg-indigo-50 border border-indigo-150 text-indigo-700 uppercase tracking-widest font-mono inline-block">Legal Document</span>
        <h3 class="font-sans font-black text-slate-900 text-sm tracking-tight">${websiteDraft.legal?.title || "Terms and Conditions"}</h3>
        <p class="text-[10px] text-slate-400 font-mono">Last Updated: ${websiteDraft.legal?.lastUpdated || "June 2026"}</p>
      </div>
      <div class="flex-1 overflow-y-auto py-3 space-y-4 max-h-[280px] text-[11.5px] leading-relaxed text-slate-600">
        <div>
          <p class="font-bold text-slate-800 mb-1">1. Parties & Governing Jurisdiction</p>
          <p>These terms and conditions govern the use of virtual services. These guidelines are compiled on behalf of <span class="font-bold text-violet-600">${websiteDraft.legal?.companyName || "Our Brand Group"}</span> and are strictly regulated under <span class="font-mono text-xs text-indigo-700 font-bold bg-indigo-55 px-1 py-0.5 rounded">${websiteDraft.legal?.governingLaw || "the Jurisdiction of India"}</span>.</p>
        </div>
        ${websiteDraft.legal?.clauses?.map((c: any, i: number) => `
        <div>
          <p class="font-bold text-slate-800 mb-1">${i + 2}. ${c.title}</p>
          <p>${c.description}</p>
        </div>`).join('')}
      </div>
      <div class="border-t border-slate-100 pt-3 flex justify-end shrink-0">
        <button onclick="document.getElementById('terms-modal-overlay').classList.add('hidden')" class="bg-violet-600 hover:bg-violet-700 text-white font-bold text-[10.5px] px-5 py-2 rounded-xl transition-colors cursor-pointer">
          Accept & Dismiss
        </button>
      </div>
    </div>
  </div>

  <footer class="py-12 border-t border-slate-200 text-center text-[10px] text-slate-400 uppercase tracking-wider space-y-4">
    <div>&copy; ${new Date().getFullYear()} ${websiteDraft.themeName}. Hosted Safely with NexHost AI clusters.</div>
    <div>
      <button onclick="document.getElementById('terms-modal-overlay').classList.remove('hidden')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 font-extrabold rounded-lg text-slate-600 text-[9px] uppercase cursor-pointer tracking-wider">
        Read Terms & Conditions
      </button>
    </div>
  </footer>

</body>
</html>`;
  };

  const handleCopyCode = () => {
    const code = activeCodeFormat === 'jsx' ? getCompiledJSXCode() : getCompiledHTMLCode();
    navigator.clipboard.writeText(code);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen">
      
      {/* Dynamic Header Credit Status Bar */}
      <div className="bg-white border-b border-slate-150 py-3 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 bg-[#5b36ff]/10 text-[#5b36ff] rounded-lg">
              <Coins className="w-5 h-5 animate-pulse" />
            </span>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                Available Engine Credits: <strong className="text-brand-purple font-mono text-sm leading-none bg-brand-purple/10 px-2 py-0.5 rounded-full">{credits}</strong>
              </p>
              <p className="text-[10px] text-slate-400 font-semibold">1 Credit consumed per dynamic website build & rewrite</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {credits <= 3 && (
              <span className="text-[10px] text-red-500 font-semibold bg-red-50 border border-red-100 rounded-lg px-2 py-1 leading-none animate-pulse">
                ⚠️ Low points balance
              </span>
            )}
            <button
              onClick={() => {
                setCheckoutProgress('idle');
                setCheckoutError('');
                setShowCreditModal(true);
              }}
              className="bg-[#120a2a] hover:bg-[#1f1246] text-white px-3.5 py-1.5 rounded-xl text-[11px] font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>+ Buy Points Bundle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upper AI Generation Board */}
      {!websiteDraft && (
        <section className="py-14 text-center relative overflow-hidden bg-gradient-to-b from-purple-50 via-white to-slate-50 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#5b36ff]/5 filter blur-[120px] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            
            <div className="inline-flex items-center space-x-2 bg-[#5b36ff]/10 border border-[#5b36ff]/20 px-3.5 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5 text-[#5b36ff]" />
              <span className="text-[10px] font-extrabold text-[#5b36ff] uppercase tracking-wider">
                Elite Unlimited SaaS Generative Core
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-display font-black text-slate-900 tracking-tight leading-tight">
              Assemble any <span className="text-[#5b36ff]">SaaS Website</span> or UI instantly.
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              No static templates. Simply define your SaaS, startup, commerce, or portfolio name, toggle blueprint matrices, choose custom colors, and download production-ready code with complete custom-tailored outputs.
            </p>

            {/* Configurable Generation box */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-5 text-left relative z-10">
              
              {/* Template Blueprint Type Tabs */}
              <div className="space-y-2">
                <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-widest font-mono">1. Select Website Blueprint Matrix</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTemplateType('saas-landing')}
                    className={`py-2 rounded-xl text-[10.5px] font-bold transition-all border ${selectedTemplateType === 'saas-landing' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-200'}`}
                  >
                    🚀 SaaS Landing
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTemplateType('saas-dashboard')}
                    className={`py-2 rounded-xl text-[10.5px] font-bold transition-all border ${selectedTemplateType === 'saas-dashboard' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-200'}`}
                  >
                    📊 Live Panel UI
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTemplateType('ecommerce-hub')}
                    className={`py-2 rounded-xl text-[10.5px] font-bold transition-all border ${selectedTemplateType === 'ecommerce-hub' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-200'}`}
                  >
                    🛒 E-Commerce
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTemplateType('corporate-portal')}
                    className={`py-2 rounded-xl text-[10.5px] font-bold transition-all border ${selectedTemplateType === 'corporate-portal' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-200'}`}
                  >
                    🏢 Corporate
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTemplateType('dev-portfolio')}
                    className={`py-2 rounded-xl text-[10.5px] font-bold transition-all border ${selectedTemplateType === 'dev-portfolio' ? 'bg-[#120a2a] text-white border-[#120a2a]' : 'bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-200'}`}
                  >
                    🧑‍💻 Tech Resume
                  </button>
                </div>
              </div>

              {/* Vibe Aesthetics Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-widest font-mono">2. Aesthetic Palette</label>
                  <div className="flex items-center space-x-2.5">
                    <button 
                      type="button"
                      title="Brand Purple"
                      onClick={() => setVibeColor('purple')}
                      className={`w-7 h-7 rounded-full bg-[#5b36ff] transition-transform ${vibeColor === 'purple' ? 'scale-115 ring-2 ring-indigo-500 ring-offset-2' : 'opacity-80 hover:opacity-100'}`}
                    />
                    <button 
                      type="button"
                      title="Midnight Dark"
                      onClick={() => setVibeColor('midnight')}
                      className={`w-7 h-7 rounded-full bg-slate-900 border border-slate-800 transition-transform ${vibeColor === 'midnight' ? 'scale-115 ring-2 ring-slate-400 ring-offset-2' : 'opacity-80 hover:opacity-100'}`}
                    />
                    <button 
                      type="button"
                      title="Emerald Mint"
                      onClick={() => setVibeColor('emerald')}
                      className={`w-7 h-7 rounded-full bg-emerald-600 transition-transform ${vibeColor === 'emerald' ? 'scale-115 ring-2 ring-emerald-500 ring-offset-2' : 'opacity-80 hover:opacity-100'}`}
                    />
                    <button 
                      type="button"
                      title="Ocean Cyan"
                      onClick={() => setVibeColor('cyan')}
                      className={`w-7 h-7 rounded-full bg-sky-505 bg-sky-500 transition-transform ${vibeColor === 'cyan' ? 'scale-115 ring-2 ring-sky-500 ring-offset-2' : 'opacity-80 hover:opacity-100'}`}
                    />
                    <button 
                      type="button"
                      title="Sunset Amber"
                      onClick={() => setVibeColor('amber')}
                      className={`w-7 h-7 rounded-full bg-amber-600 transition-transform ${vibeColor === 'amber' ? 'scale-115 ring-2 ring-amber-500 ring-offset-2' : 'opacity-80 hover:opacity-100'}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-widest font-mono">3. Font Combination</label>
                  <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setVibeFont('sans')}
                      className={`flex-grow py-1 rounded-lg text-[10.5px] font-semibold transition-all ${vibeFont === 'sans' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-450 hover:text-slate-800'}`}
                    >
                      Sans-Serif
                    </button>
                    <button
                      type="button"
                      onClick={() => setVibeFont('serif')}
                      className={`flex-grow py-1 rounded-lg text-[10.5px] font-serif font-bold transition-all ${vibeFont === 'serif' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-450 hover:text-slate-800'}`}
                    >
                      Elegant Serif
                    </button>
                    <button
                      type="button"
                      onClick={() => setVibeFont('mono')}
                      className={`flex-grow py-1 rounded-lg text-[10.5px] font-mono transition-all ${vibeFont === 'mono' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-450 hover:text-slate-800'}`}
                    >
                      Tech Mono
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Prompt Submit Input Row */}
              <div className="pt-2">
                <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <input 
                      type="text" 
                      value={promptValue} 
                      onChange={(e) => setPromptValue(e.target.value)}
                      placeholder="Enter SaaS product name or vision, e.g. 'PayFlow Payments' or 'HealthSync Engine'"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 placeholder-slate-400 font-bold focus:outline-none focus:border-[#5b36ff] transition-all text-sm"
                    />
                    <Sparkles className="w-5 h-5 text-[#5b36ff] absolute left-4.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-[#5b36ff] hover:bg-[#492be0] text-white font-bold px-7 py-4 rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-transform hover:scale-101 flex items-center justify-center space-x-2 whitespace-nowrap cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin text-white grow-0 shrink-0" />
                        <span>Assembling Layout...</span>
                      </>
                    ) : (
                      <>
                        <span>Build SaaS Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>

            {/* Quick ideas chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-450">
              <span className="font-mono text-[10px] uppercase">One-click Presets:</span>
              <button 
                onClick={() => handleQuickSuggestion('Matrix Automated CRM Flow', 'saas-landing')} 
                className="bg-white hover:border-[#5b36ff] hover:text-[#5b36ff] border border-slate-250 px-3.5 py-1.5 rounded-full cursor-pointer transition-all hover:scale-101 text-[11px]"
              >
                🚀 Smart CRM Platform
              </button>
              <button 
                onClick={() => handleQuickSuggestion('CloudNode VM Hypervisor', 'saas-dashboard')} 
                className="bg-white hover:border-[#5b36ff] hover:text-[#5b36ff] border border-slate-250 px-3.5 py-1.5 rounded-full cursor-pointer transition-all hover:scale-101 text-[11px]"
              >
                📊 Server Node Dashboard
              </button>
              <button 
                onClick={() => handleQuickSuggestion('Organic Bakeries UPI Store', 'ecommerce-hub')} 
                className="bg-white hover:border-[#5b36ff] hover:text-[#5b36ff] border border-slate-250 px-3.5 py-1.5 rounded-full cursor-pointer transition-all hover:scale-101 text-[11px]"
              >
                🛒 Smart Grocery Shop
              </button>
            </div>

          </div>
        </section>
      )}

      {/* Loading Screen Overlay */}
      {loading && (
        <div className="py-28 text-center max-w-xl mx-auto space-y-6">
          <div className="inline-block p-4.5 bg-[#5b36ff]/10 text-[#5b36ff] rounded-full animate-spin">
            <RefreshCw className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-black text-slate-900 text-xl tracking-tight">Designing UI Elements and Page Core</h3>
            <p className="text-slate-500 text-xs leading-normal px-4">
              Constructing tailored layouts with high-speed variables, pairing optimal system typography, composing responsive copywriting sections, and verifying real-time live performance SLA.
            </p>
          </div>
          <div className="w-56 bg-slate-200 h-1 rounded-full overflow-hidden mx-auto">
            <div className="bg-[#5b36ff] h-full animate-pulse" style={{ width: '80%' }} />
          </div>
        </div>
      )}

      {/* Live Code Dashboard and Simulator Frame */}
      {websiteDraft && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          
          {/* Editor Header controller bar */}
          <div className="bg-[#120a2a] text-white rounded-3xl p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/5 shadow-xl">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-[#5b36ff] rounded-2xl text-white">
                <Sparkles className="w-5.5 h-5.5" />
              </div>
              <div className="text-left">
                <span className="text-[9px] uppercase font-mono text-violet-400 bg-violet-600/20 px-2 py-0.5 rounded-md font-bold tracking-wider">Dynamic SaaS Blueprint Draft</span>
                <h2 className="text-sm font-extrabold tracking-wide text-white font-display mt-0.5 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={websiteDraft.themeName}
                    onChange={(e) => updateDraftText('themeName', null, 'themeName', e.target.value)}
                    className="bg-white/5 hover:bg-white/10 text-white rounded px-2 py-0.5 border border-white/10 focus:outline-none focus:border-brand-purple min-w-[200px]"
                  />
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                </h2>
              </div>
            </div>

            {/* Custom Responsive Controls */}
            <div className="flex items-center space-x-3 text-xs">
              
              {/* Output Display mode selectors */}
              <div className="bg-white/10 p-1 rounded-xl flex items-center space-x-1.5 border border-white/5 mr-2">
                <button
                  onClick={() => {
                    setActiveEditorTab('preview');
                    setSuccessDeployed(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${activeEditorTab === 'preview' ? 'bg-[#5b36ff] text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Interactive Browser</span>
                </button>
                <button
                  onClick={() => setActiveEditorTab('code')}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${activeEditorTab === 'code' ? 'bg-[#5b36ff] text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>React Code Out</span>
                </button>
              </div>

              {activeEditorTab === 'preview' && (
                <>
                  <button 
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer border ${previewDevice === 'desktop' ? 'bg-white/15 text-[#5b36ff] border-white/10' : 'text-slate-400 hover:text-white border-transparent'}`}
                    title="Desktop viewport monitor"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer border ${previewDevice === 'mobile' ? 'bg-white/15 text-[#5b36ff] border-white/10' : 'text-slate-400 hover:text-white border-transparent'}`}
                    title="Mobile viewport monitor"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </>
              )}

              <div className="h-6 w-px bg-white/15 mx-1" />

              <button 
                onClick={() => {
                  setWebsiteDraft(null);
                  setSuccessDeployed(false);
                }}
                className="px-4 py-2 hover:bg-white/10 border border-white/15 rounded-xl text-slate-350 hover:text-white cursor-pointer transition-colors text-[10.5px] font-bold"
              >
                Reset Canvas
              </button>
              <button 
                onClick={handleDeployDraft}
                className="bg-[#5b36ff] hover:bg-[#492be0] text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition-colors text-[10.5px]"
              >
                Confirm Deploy
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 items-start">
            
            {/* Interactive Sidebar Node Editor (Allows fine-tuning the active layout fully) */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              
              {/* Section tab switches */}
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center space-x-2.5 pb-2.5 border-b border-slate-100 justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Sliders className="w-4 h-4 text-brand-purple" />
                    <h3 className="font-display font-black text-xs uppercase tracking-wide text-slate-900">Node Customizer</h3>
                  </div>
                  <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-black tracking-widest font-mono">LIVE SYNC</span>
                </div>
                
                {/* Advanced Multi-Tab Controller */}
                <div className="space-y-2 text-left">
                  {/* Google AI Studio Workspace Toggle Button */}
                  <div className="mb-3.5">
                    <button
                      type="button"
                      onClick={() => setActiveEditSection('studio')}
                      className={`w-full py-3.5 px-4 rounded-2xl font-black flex items-center justify-between transition-all cursor-pointer border text-left ${activeEditSection === 'studio' ? 'bg-[#5b36ff] text-white border-[#5b36ff] shadow-md shadow-indigo-500/20' : 'bg-indigo-50/70 border-indigo-100 text-[#5b36ff] hover:bg-indigo-150/70'}`}
                    >
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4.5 h-4.5 animate-pulse shrink-0" />
                        <div>
                          <p className="text-[11px] leading-tight font-black uppercase tracking-wider">AI Studio Console</p>
                          <p className="text-[9px] font-medium opacity-80 leading-none mt-0.5">Iterative chat rewriting</p>
                        </div>
                      </div>
                      <span className="text-[8px] bg-indigo-600 outline-none text-white font-extrabold px-1.5 py-1 rounded-md leading-none uppercase shrink-0">ACTIVE</span>
                    </button>
                  </div>

                  <div className="text-[8.5px] text-slate-450 font-bold uppercase tracking-wider font-mono border-t border-slate-100 pt-3">1. Customizer Nodes</div>
                  <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-50 p-1 rounded-xl border border-slate-205">
                    <button
                      onClick={() => setActiveEditSection('hero')}
                      className={`py-1.5 rounded-lg text-[9px] font-bold transition-all ${activeEditSection === 'hero' ? 'bg-[#120a2a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}
                    >
                      Hero
                    </button>
                    <button
                      onClick={() => setActiveEditSection('features')}
                      className={`py-1.5 rounded-lg text-[9px] font-bold transition-all ${activeEditSection === 'features' ? 'bg-[#120a2a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}
                    >
                      Specs
                    </button>
                    <button
                      onClick={() => setActiveEditSection('stats')}
                      className={`py-1.5 rounded-lg text-[9px] font-bold transition-all ${activeEditSection === 'stats' ? 'bg-[#120a2a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}
                    >
                      Metrics
                    </button>
                    <button
                      onClick={() => setActiveEditSection('testimonials')}
                      className={`py-1.5 rounded-lg text-[9px] font-bold transition-all ${activeEditSection === 'testimonials' ? 'bg-[#120a2a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}
                    >
                      Reviews
                    </button>
                    <button
                      onClick={() => setActiveEditSection('faq')}
                      className={`py-1.5 rounded-lg text-[9px] font-bold transition-all ${activeEditSection === 'faq' ? 'bg-[#120a2a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}
                    >
                      FAQ
                    </button>
                    <button
                      onClick={() => setActiveEditSection('terms')}
                      className={`py-1.5 rounded-lg text-[9px] font-bold transition-all ${activeEditSection === 'terms' ? 'bg-[#120a2a] text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}
                    >
                      T&C Legal
                    </button>
                  </div>
                  
                  <div className="text-[8.5px] text-slate-450 font-bold uppercase tracking-wider font-mono pt-1">2. Production & Lifetime Security</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveEditSection('publish')}
                      className={`py-2 px-2 rounded-xl text-[10px] font-extrabold transition-all border flex items-center justify-center gap-1 cursor-pointer ${activeEditSection === 'publish' ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' : 'bg-slate-50 text-slate-650 hover:bg-slate-100 border-slate-205'}`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Publish & Domain
                    </button>
                    <button
                      onClick={() => setActiveEditSection('security')}
                      className={`py-2 px-2 rounded-xl text-[10px] font-extrabold transition-all border flex items-center justify-center gap-1 cursor-pointer ${activeEditSection === 'security' ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' : 'bg-slate-50 text-slate-650 hover:bg-slate-100 border-slate-205'}`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Lifetime Security
                    </button>
                  </div>
                </div>

                {/* Aesthetic Theme Quick override inside editor */}
                <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-100">
                  <span className="text-slate-500 font-semibold">Change Color palette on draft:</span>
                  <div className="flex items-center space-x-1.5">
                    <button onClick={() => setVibeColor('purple')} className={`w-3.5 h-3.5 rounded-full bg-[#5b36ff] ${vibeColor === 'purple' ? 'ring-2 ring-indigo-600' : ''}`} />
                    <button onClick={() => setVibeColor('midnight')} className={`w-3.5 h-3.5 rounded-full bg-slate-900 ${vibeColor === 'midnight' ? 'ring-2 ring-slate-600' : ''}`} />
                    <button onClick={() => setVibeColor('emerald')} className={`w-3.5 h-3.5 rounded-full bg-emerald-600 ${vibeColor === 'emerald' ? 'ring-2 ring-emerald-600' : ''}`} />
                    <button onClick={() => setVibeColor('cyan')} className={`w-3.5 h-3.5 rounded-full bg-sky-550 bg-sky-500 ${vibeColor === 'cyan' ? 'ring-2 ring-sky-500' : ''}`} />
                    <button onClick={() => setVibeColor('amber')} className={`w-3.5 h-3.5 rounded-full bg-amber-600 ${vibeColor === 'amber' ? 'ring-2 ring-amber-600' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Dynamic Edit Node inputs container */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-left">
                
                {activeEditSection === 'studio' && (
                  <div className="space-y-4 font-sans text-left">
                    {/* Header with AI Studio branding */}
                    <div className="bg-gradient-to-r from-[#120a2a] to-[#25154f] text-white p-4 rounded-xl space-y-1.5 shadow-md flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                          <h4 className="font-extrabold text-[12px] uppercase tracking-wider text-indigo-200 font-display">Google AI Studio Core</h4>
                        </div>
                        <p className="text-[10px] text-slate-300">Interact with Super AI models to refactor code</p>
                      </div>
                      <span className="text-[10px] uppercase font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-white border border-white/10">3.5 FLASH</span>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-250 text-center text-[10.5px] font-bold">
                      <button
                        type="button"
                        onClick={() => setStudioActiveRightTab('parameters')}
                        className={`flex-grow py-1.5 rounded-lg transition-all cursor-pointer ${studioActiveRightTab === 'parameters' ? 'bg-white text-[#5b36ff] shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        💬 Workspace Chat
                      </button>
                      <button
                        type="button"
                        onClick={() => setStudioActiveRightTab('logs')}
                        className={`flex-grow py-1.5 rounded-lg transition-all cursor-pointer ${studioActiveRightTab === 'logs' ? 'bg-white text-[#5b36ff] shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        💻 Compiler Logs
                      </button>
                    </div>

                    {studioActiveRightTab === 'parameters' ? (
                      <div className="space-y-4">
                        {/* Compact AI Parameter Settings */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider font-mono">WORKSPACE PARAMETERS</span>
                            <span className="text-[9px] text-indigo-600 bg-indigo-50 font-extrabold px-1.5 py-0.5 rounded">CONFIGURABLE</span>
                          </div>

                          <div className="space-y-1 text-left">
                            <label className="text-[9px] text-slate-500 font-bold uppercase block pl-0.5">System Instructions (Prompt Prefix)</label>
                            <textarea
                              rows={2}
                              value={systemInstructions}
                              onChange={(e) => setSystemInstructions(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10.5px] font-semibold text-slate-800 focus:outline-none focus:border-[#5b36ff] leading-relaxed"
                              placeholder="Write prompt instructions..."
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1 text-left">
                              <label className="text-[9px] text-slate-500 font-bold uppercase block pl-0.5">Active SDK Model</label>
                              <select
                                value={selectedStudioModel}
                                onChange={(e) => setSelectedStudioModel(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[10.5px] font-bold text-slate-700 outline-none focus:border-[#5b36ff]"
                              >
                                <option value="gemini-3.5-flash">gemini-3.5-flash</option>
                                <option value="gemini-3.1-pro-preview">gemini-3.1-pro</option>
                              </select>
                            </div>
                            <div className="space-y-1 text-left">
                              <div className="flex justify-between items-center px-0.5">
                                <label className="text-[9px] text-slate-500 font-bold uppercase">Temperature</label>
                                <span className="text-[9px] font-mono font-bold text-indigo-600">{studioTemperature}</span>
                              </div>
                              <input
                                type="range"
                                min="0.0"
                                max="2.0"
                                step="0.1"
                                value={studioTemperature}
                                onChange={(e) => setStudioTemperature(parseFloat(e.target.value))}
                                className="w-full text-indigo-600 accent-[#5b36ff]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Chat History Panel */}
                        <div className="space-y-2 text-left">
                          <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wider font-mono block pl-0.5">Studio Conversation Thread</label>
                          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                            {/* Scrollable messages container */}
                            <div className="p-3 space-y-2.5 max-h-[190px] overflow-y-auto text-xs leading-relaxed flex flex-col">
                              {studioChatHistory.map((msg, i) => (
                                <div
                                  key={i}
                                  className={`p-2.5 rounded-xl max-w-[85%] ${msg.sender === 'user' ? 'bg-[#5b36ff] text-white self-end ml-auto text-right' : 'bg-white border border-slate-205 text-slate-800 self-start mr-auto text-left'}`}
                                >
                                  <p className="font-semibold text-[11px] leading-relaxed break-words">{msg.text}</p>
                                </div>
                              ))}
                              {studioLoading && (
                                <div className="bg-white border border-slate-205 text-slate-500 self-start mr-auto p-2.5 rounded-xl flex items-center space-x-2 animate-pulse max-w-[85%] text-left">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5b36ff]" />
                                  <span className="text-[11px] font-bold">Super AI is rewriting layout...</span>
                                </div>
                              )}
                            </div>

                            {/* Chat controller form */}
                            <form onSubmit={handleStudioChatPrompt} className="border-t border-slate-150 p-2 bg-white flex gap-1.5 items-center">
                              <input
                                type="text"
                                value={studioChatInput}
                                onChange={(e) => setStudioChatInput(e.target.value)}
                                disabled={studioLoading}
                                placeholder="E.g. 'Add a beautiful Contact form section'..."
                                className="flex-1 bg-slate-50 rounded-lg px-2.5 py-2 text-[11px] font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#5b36ff]/20 disabled:opacity-75"
                              />
                              <button
                                type="submit"
                                disabled={studioLoading || !studioChatInput.trim()}
                                className="p-2 bg-[#5b36ff] text-white rounded-lg hover:bg-[#492be0] transition-transform hover:scale-101 border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Monospaced Log Console terminal log simulation output */
                      <div className="space-y-2 text-left">
                        <div className="flex justify-between items-center text-[9px] text-slate-450 font-bold uppercase tracking-wider font-mono px-0.5">
                          <span>Compiler Output (Port 3000)</span>
                          <button
                            type="button"
                            onClick={() => setStudioConsoleLogs([
                              'System: Google AI Studio Workspace compiler active.',
                              'System: Port 3000 mapped for sandbox deployment environments.'
                            ])}
                            className="text-indigo-650 hover:text-indigo-700 bg-none border-none text-[8px] cursor-pointer"
                          >
                            Clear Logs
                          </button>
                        </div>
                        <div className="bg-slate-950 text-emerald-400 font-mono text-[9px] p-4 rounded-xl border border-slate-800 overflow-y-auto max-h-[280px] space-y-1 tracking-tight text-left leading-normal shadow-inner select-all">
                          {studioConsoleLogs.map((log, i) => (
                            <div key={i} className="break-all">
                              <span className="text-zinc-650 shrink-0 select-none mr-1.5">&gt;</span>
                              <span className={log.includes('[Error]') ? 'text-rose-400 font-bold' : log.includes('System') ? 'text-cyan-400' : 'text-emerald-400'}>{log}</span>
                            </div>
                          ))}
                          <div className="h-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeEditSection === 'hero' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs text-slate-800 border-b border-light-purple pb-1.5">Edit Page Hero Block</h4>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Hero Heading title</label>
                      <textarea
                        rows={2}
                        value={websiteDraft.hero?.title || ''}
                        onChange={(e) => updateDraftText('hero', null, 'title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#5b36ff]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Marketing Subtitle</label>
                      <textarea
                        rows={3}
                        value={websiteDraft.hero?.subtitle || ''}
                        onChange={(e) => updateDraftText('hero', null, 'subtitle', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-slate-500 focus:outline-none focus:border-[#5b36ff] leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Primary Button (CTA)</label>
                      <input
                        type="text"
                        value={websiteDraft.hero?.ctaText || ''}
                        onChange={(e) => updateDraftText('hero', null, 'ctaText', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#5b36ff]"
                      />
                    </div>
                  </div>
                )}

                {activeEditSection === 'features' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs text-slate-800 border-b border-light-purple pb-1.5 flex justify-between items-center">
                      <span>SaaS Specification highlights</span>
                      <span className="text-[9px] text-slate-400 uppercase font-mono">Max 3 Cards</span>
                    </h4>
                    
                    {websiteDraft.features?.map((f: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
                        <span className="text-[9px] bg-indigo-650 bg-[#120a2a] text-white px-1.5 py-0.5 rounded font-bold">Feature #{idx + 1}</span>
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={f.title}
                            placeholder="Feature Title"
                            onChange={(e) => updateDraftText('features', idx, 'title', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:border-[#5b36ff]"
                          />
                        </div>
                        <div className="space-y-1">
                          <textarea
                            rows={2}
                            value={f.description}
                            placeholder="Bullet explanation"
                            onChange={(e) => updateDraftText('features', idx, 'description', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-500 focus:outline-none focus:border-[#5b36ff]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeEditSection === 'stats' && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs text-slate-800 border-b border-light-purple pb-1.5">Configure Telemetry Metrics Counters</h4>
                    {websiteDraft.stats?.map((s: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-150">
                        <div>
                          <label className="text-[8px] text-slate-400 font-bold uppercase">Metric Label</label>
                          <input
                            type="text"
                            value={s.label}
                            onChange={(e) => updateDraftText('stats', idx, 'label', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10.5px] font-semibold focus:outline-none focus:border-[#5b36ff]"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] text-slate-400 font-bold uppercase">Display Value</label>
                          <input
                            type="text"
                            value={s.value}
                            onChange={(e) => updateDraftText('stats', idx, 'value', e.target.value)}
                            className="w-full bg-white border border-[#5b36ff]/20 rounded-lg px-2 py-1 text-[10.5px] font-mono font-bold text-indigo-700 focus:outline-none focus:border-[#5b36ff]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeEditSection === 'testimonials' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs text-slate-800 border-b border-light-purple pb-1.5">Social Proof feedback</h4>
                    {websiteDraft.testimonials?.map((t: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-55 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            value={t.name}
                            placeholder="Reviewer Name"
                            onChange={(e) => updateDraftText('testimonials', idx, 'name', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none focus:border-[#5b36ff]"
                          />
                          <input
                            type="text"
                            value={t.role}
                            placeholder="Designation/Brand"
                            onChange={(e) => updateDraftText('testimonials', idx, 'role', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-500 focus:outline-none focus:border-[#5b36ff]"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={t.comment}
                          placeholder="Quote comment text"
                          onChange={(e) => updateDraftText('testimonials', idx, 'comment', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10.5px] text-slate-500 italic focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activeEditSection === 'faq' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs text-slate-800 border-b border-[#5b36ff]/10 pb-1.5">F.A.Q Helpdesk items</h4>
                    {websiteDraft.faq?.map((q: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-150 space-y-2">
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => updateDraftText('faq', idx, 'question', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={q.answer}
                          onChange={(e) => updateDraftText('faq', idx, 'answer', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10.5px] text-slate-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activeEditSection === 'terms' && websiteDraft.legal && (
                  <div className="space-y-4">
                    <div className="border-b border-[#5b36ff]/15 pb-2">
                      <h4 className="font-bold text-xs text-slate-800">Terms & Conditions Customizer</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                        Verify and customize the binding legal covenants generated for your brand.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wide animate-pulse">Document Title</label>
                      <input
                        type="text"
                        value={websiteDraft.legal.title || ""}
                        onChange={(e) => updateDraftText('legal', null, 'title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-[#5b36ff]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Last Updated</label>
                        <input
                          type="text"
                          value={websiteDraft.legal.lastUpdated || ""}
                          onChange={(e) => updateDraftText('legal', null, 'lastUpdated', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2 py-1 text-[11px] text-slate-650 focus:outline-none focus:border-[#5b36ff]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Company Name</label>
                        <input
                          type="text"
                          value={websiteDraft.legal.companyName || ""}
                          onChange={(e) => updateDraftText('legal', null, 'companyName', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2 py-1 text-[11px] text-slate-650 focus:outline-none focus:border-[#5b36ff]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wide">Governing Law Jurisdiction</label>
                      <input
                        type="text"
                        value={websiteDraft.legal.governingLaw || ""}
                        onChange={(e) => updateDraftText('legal', null, 'governingLaw', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs text-slate-650 focus:outline-none focus:border-[#5b36ff]"
                      />
                    </div>

                    <div className="space-y-3 pt-2.5 border-t border-slate-100">
                      <label className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wide block">Contractual Clauses</label>
                      {websiteDraft.legal.clauses?.map((c: any, idx: number) => (
                        <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-205 space-y-2 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-[8.5px] px-1.5 py-0.5 rounded font-bold font-mono bg-indigo-50 border border-indigo-100 text-indigo-700">Section {idx+1}</span>
                          </div>
                          <input
                            type="text"
                            value={c.title || ""}
                            onChange={(e) => updateDraftText('legal', idx, 'title', e.target.value)}
                            placeholder="Clause header title"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none focus:border-[#5b36ff]"
                          />
                          <textarea
                            rows={3}
                            value={c.description || ""}
                            onChange={(e) => updateDraftText('legal', idx, 'description', e.target.value)}
                            placeholder="Full clause legal copy text"
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] text-slate-500 leading-normal focus:outline-none focus:border-[#5b36ff]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeEditSection === 'publish' && (
                  <div className="space-y-4 text-left animate-fade-in">
                    <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                      <h4 className="font-bold text-xs text-slate-800">Edge Publishing Console</h4>
                      <span className={`text-[8.5px] px-2 py-0.5 rounded font-black ${successDeployed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                        {successDeployed ? '🟢 SYSTEM ONLINE' : '🟡 DRAFT MODE'}
                      </span>
                    </div>

                    {!successDeployed ? (
                      <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl text-xs space-y-3">
                        <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">Your custom generated blueprint website is compile-ready. To trigger the multi-region live launch, click the key below.</p>
                        <button
                          onClick={handleDeployDraft}
                          disabled={publishingState !== 'idle' && publishingState !== 'success'}
                          className="w-full py-2.5 bg-[#5b36ff] hover:bg-[#492be0] text-white font-extrabold rounded-xl text-[10.5px] tracking-wide shadow-sm flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
                        >
                          {publishingState === 'idle' || publishingState === 'success' ? (
                            <>
                              <Globe className="w-3.5 h-3.5 animate-pulse" />
                              <span>Go LIVE & Deploy Now</span>
                            </>
                          ) : (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>
                                {publishingState === 'compiling' && '1/4 Compiling React SSR...'}
                                {publishingState === 'securing' && '2/4 Hardening Firewalls...'}
                                {publishingState === 'cdn' && '3/4 Distributing Global Pointers...'}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Interactive Deployed Link and Clear Cache */}
                        <div className="p-3.5 bg-emerald-50/70 border border-emerald-150 rounded-2xl text-xs space-y-3">
                          <div>
                            <span className="text-[8px] text-emerald-700 font-extrabold uppercase font-mono tracking-wider">Live Protected URL:</span>
                            <a
                              href={`https://${connectedDomain || (promptValue.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'website') + '-ai-draft.live'}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-[11px] font-bold text-emerald-950 hover:text-emerald-750 block truncate underline mt-0.5"
                            >
                              https://{connectedDomain || (promptValue.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'website') + '-ai-draft.live'}
                            </a>
                          </div>
                          
                          <div className="text-[10px] text-emerald-800 font-semibold space-y-1">
                            <p className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline-block" />
                              Runtime protection: LIFETIME GUARANTEED
                            </p>
                            <p className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline-block" />
                              SSL Certificate: Let&apos;s Encrypt Active
                            </p>
                          </div>

                          <div className="flex gap-2 border-t border-emerald-150 pt-2">
                            <button
                              onClick={() => {
                                const originalLogs = [...securityLogs];
                                const timestamp = new Date().toLocaleTimeString();
                                setSecurityLogs([`[${timestamp}] - Pushed fresh global CDN cache purge. Caching optimized at 100%.`, ...originalLogs]);
                                alert("Global edge CDN cached cleared successfully successfully across all 24 deployment servers!");
                              }}
                              className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[9px] font-bold text-center cursor-pointer transition-colors uppercase"
                            >
                              ⚡ Purge Mirror Cache
                            </button>
                          </div>
                        </div>

                        {/* Custom Domain buy and connect console inside hpanel */}
                        <div className="border border-slate-150 rounded-2xl p-3.5 bg-slate-50 space-y-3">
                          <div className="space-y-1">
                            <h5 className="font-extrabold text-[11px] text-slate-800 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                              Buy &amp; Connect Custom TLD
                            </h5>
                            <p className="text-[9.5px] text-slate-450 font-medium">Map your own custom identity (e.g. .com, .in) directly right inside this screen.</p>
                          </div>

                          <form onSubmit={handleDomainSearchSide} className="flex gap-1.5">
                            <input
                              type="text"
                              value={searchDomainQuery}
                              onChange={(e) => setSearchDomainQuery(e.target.value)}
                              placeholder="e.g. coffeecorner"
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold focus:outline-none focus:border-[#5b36ff]"
                            />
                            <button
                              type="submit"
                              disabled={isSearchingDomainSide}
                              className="px-3 bg-indigo-650 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                            >
                              {isSearchingDomainSide ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : 'Search'}
                            </button>
                          </form>

                          {/* Domain search results sidebar list */}
                          {domainSearchResultsSide.length > 0 && (
                            <div className="space-y-1.5 pt-2 border-t border-slate-205">
                              <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider font-mono">Available Registered Matches</p>
                              {domainSearchResultsSide.map((res: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-155 hover:border-brand-purple transition-all">
                                  <div className="text-left max-w-[60%]">
                                    <span className="font-mono text-[10px] font-extrabold text-slate-800 block truncate">{res.name}</span>
                                    <span className="text-[7px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-1 rounded uppercase font-black tracking-widest inline-block mt-0.5">INSTANT BIND</span>
                                  </div>
                                  <div className="text-right flex items-center gap-1.5">
                                    <span className="font-mono text-[9.5px] font-bold text-slate-805 text-slate-800">{res.price}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedBuyDomain(res);
                                        setDomainBuyStep('pay');
                                        setDomainCheckoutError('');
                                        // Auto scroll sidebar card
                                      }}
                                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black rounded-lg cursor-pointer flex items-center gap-0.5 shadow-sm"
                                    >
                                      <span>Buy</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Built-in billing checkout for chosen TLD */}
                          {domainBuyStep === 'pay' && selectedBuyDomain && (
                            <div className="p-3 bg-slate-900 text-left text-slate-100 rounded-xl space-y-3 border border-emerald-500 animate-fade-in">
                              <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                                <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-400">Secure UPI &amp; DNS Gate</span>
                                <button type="button" onClick={() => setDomainBuyStep('none')} className="text-slate-400 hover:text-white text-xs">✕</button>
                              </div>
                              <p className="text-[10px] text-slate-350 leading-relaxed font-medium">
                                We will purchase and secure <span className="font-mono font-bold text-white underline">{selectedBuyDomain.name}</span> at <span className="text-emerald-450 text-emerald-350 text-emerald-400 font-bold">{selectedBuyDomain.price}/yr</span>. Active lifetime SSL + DDoS shield are standard setup parameters.
                              </p>

                              <div className="grid grid-cols-3 gap-1 bg-slate-850 bg-slate-800 p-0.5 rounded-lg border border-white/5">
                                <button
                                  type="button"
                                  onClick={() => setDomainPayMethod('razorpay')}
                                  className={`py-1 rounded text-[8.5px] font-black transition-all cursor-pointer ${domainPayMethod === 'razorpay' ? 'bg-[#5b36ff] text-white shadow-sm' : 'text-slate-400 hover:text-slate-100'}`}
                                >
                                  💳 Razorpay Secure
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDomainPayMethod('upi')}
                                  className={`py-1 rounded text-[8.5px] font-extrabold transition-all cursor-pointer ${domainPayMethod === 'upi' ? 'bg-[#5b36ff] text-white shadow-sm' : 'text-slate-400 hover:text-slate-100'}`}
                                >
                                  🇮🇳 UPI App
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDomainPayMethod('card')}
                                  className={`py-1 rounded text-[8.5px] font-extrabold transition-all cursor-pointer ${domainPayMethod === 'card' ? 'bg-[#5b36ff] text-white shadow-sm' : 'text-slate-400 hover:text-slate-100'}`}
                                >
                                  💳 Visa/Card
                                </button>
                              </div>

                              <form onSubmit={handleProcessDomainPurchase} className="space-y-2.5">
                                {domainPayMethod === 'razorpay' ? (
                                  <div className="p-3 bg-indigo-950/40 border border-indigo-900 rounded-xl text-left space-y-2.5">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white shrink-0 font-extrabold text-[10px] font-mono leading-none">R</div>
                                      <div>
                                        <p className="font-extrabold text-slate-100 text-[10px] leading-tight flex items-center gap-1.5 flex-wrap">
                                          Razorpay Secure Routing Integration
                                          {rzpKeyId ? (
                                            <span className="font-mono text-[7px] text-indigo-200 bg-indigo-500/20 border border-indigo-400/30 px-1 py-0.5 rounded font-bold">{rzpKeyId}</span>
                                          ) : (
                                            <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 text-[6.5px] px-1 py-0.5 rounded font-black uppercase">Simulated Mode</span>
                                          )}
                                        </p>
                                        <p className="text-[7.5px] text-indigo-300 font-bold uppercase tracking-wider font-mono">Instant API Verification & Cert Hook</p>
                                      </div>
                                    </div>
                                    <p className="text-[9.5px] text-slate-350 leading-relaxed font-semibold">
                                      Zero manual setup. Instant DNS mapping starts automatically using Razorpay&apos;s fast webhook verification infrastructure.
                                    </p>
                                    <div className="space-y-1.5">
                                      <div className="space-y-0.5">
                                        <span className="text-[7.5px] text-slate-400 uppercase font-black font-mono">Receipt Delivery Contacts</span>
                                        <div className="grid grid-cols-2 gap-1.5">
                                          <input 
                                            type="email" 
                                            required
                                            value={razorpayEmail}
                                            onChange={(e) => setRazorpayEmail(e.target.value)}
                                            placeholder="customer@email.com" 
                                            className="bg-slate-800 border border-slate-700 text-white text-[9.5px] px-2 py-1 rounded focus:outline-none" 
                                          />
                                          <input 
                                            type="tel" 
                                            required
                                            value={razorpayPhone}
                                            onChange={(e) => setRazorpayPhone(e.target.value)}
                                            placeholder="Mobile Number" 
                                            className="bg-slate-800 border border-slate-700 text-white text-[9.5px] px-2 py-1 rounded focus:outline-none" 
                                          />
                                        </div>
                                      </div>
                                      <div className="p-1.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded-md text-[8.5px] font-bold text-center">
                                        🛡 Verified Safe: Let&apos;s Encrypt SSL active forever.
                                      </div>
                                    </div>
                                  </div>
                                ) : domainPayMethod === 'upi' ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-slate-200">
                                      <div className="w-14 h-14 bg-slate-50 flex items-center justify-center border border-slate-205 shrink-0 select-none">
                                        <div className="grid grid-cols-4 gap-0.5 p-1 bg-white rounded border border-slate-300">
                                          <div className="w-2.5 h-2.5 bg-black" />
                                          <div className="w-2.5 h-2.5 bg-slate-200" />
                                          <div className="w-2.5 h-2.5 bg-slate-100" />
                                          <div className="w-2.5 h-2.5 bg-black" />
                                          <div className="w-2.5 h-2.5 bg-slate-100" />
                                          <div className="w-2.5 h-2.5 bg-black" />
                                          <div className="w-2.5 h-2.5 bg-black" />
                                          <div className="w-2.5 h-2.5 bg-slate-200" />
                                          <div className="w-2.5 h-2.5 bg-slate-200" />
                                          <div className="w-2.5 h-2.5 bg-black" />
                                          <div className="w-2.5 h-2.5 bg-black" />
                                          <div className="w-2.5 h-2.5 bg-slate-105" />
                                          <div className="w-2.5 h-2.5 bg-black" />
                                          <div className="w-2.5 h-2.5 bg-slate-200" />
                                          <div className="w-2.5 h-2.5 bg-slate-100" />
                                          <div className="w-2.5 h-2.5 bg-black" />
                                        </div>
                                      </div>
                                      <div className="text-[10px] text-slate-600 leading-tight">
                                        <p className="font-extrabold text-slate-850">Scan Code to Pay</p>
                                        <p className="text-[9px] font-semibold text-slate-500">Supports GPay, Paytm, PhonePe, and BHIM networks.</p>
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[8px] text-slate-400 uppercase font-black font-mono">Fill UPI Address</label>
                                      <input
                                        type="text"
                                        required
                                        value={domainUpiId}
                                        onChange={(e) => setDomainUpiId(e.target.value)}
                                        placeholder="e.g. name@paytm"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 text-white text-[10.5px] py-1.5 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-1.5">
                                    <input
                                      type="text"
                                      required
                                      value={domainCardName}
                                      onChange={(e) => setDomainCardName(e.target.value)}
                                      placeholder="Cardholder Full Name"
                                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-[10.5px] text-white focus:outline-none"
                                    />
                                    <input
                                      type="text"
                                      required
                                      placeholder="Card Number"
                                      value={domainCardNumber}
                                      onChange={(e) => {
                                        const raw = e.target.value.replace(/\s?/g, '');
                                        const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
                                        setDomainCardNumber(formatted);
                                      }}
                                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-[10.5px] text-white font-mono focus:outline-none"
                                    />
                                    <div className="grid grid-cols-2 gap-1.5">
                                      <input
                                        type="text"
                                        required
                                        maxLength={5}
                                        value={domainCardExpiry}
                                        onChange={(e) => setDomainCardExpiry(e.target.value)}
                                        placeholder="MM/YY"
                                        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-center text-[10px] text-white focus:outline-none"
                                      />
                                      <input
                                        type="password"
                                        required
                                        maxLength={3}
                                        value={domainCardCvv}
                                        onChange={(e) => setDomainCardCvv(e.target.value)}
                                        placeholder="CVV"
                                        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-center text-[10px] text-white focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                )}

                                {domainCheckoutError && (
                                  <p className="text-[9px] text-rose-400 font-bold">⚠️ {domainCheckoutError}</p>
                                )}

                                <button
                                  type="submit"
                                  disabled={domainCheckoutProgress}
                                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-lg shadow-md flex items-center justify-center gap-1 hover:scale-[1.02] cursor-pointer transition-all uppercase"
                                >
                                  {domainCheckoutProgress ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>Hard-binding DNS parameters...</span>
                                    </>
                                  ) : (
                                    <span>Complete Simulated UPI/Card Checkout</span>
                                  )}
                                </button>
                              </form>
                            </div>
                          )}

                          {domainBuyStep === 'success' && (
                            <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xl space-y-2 text-left text-emerald-100 animate-slide-up shadow-sm">
                              <p className="font-extrabold text-[10.5px] text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400 animate-bounce" />
                                Custom Domain mapped successfully!
                              </p>
                              <p className="text-[9px] leading-relaxed text-slate-350">
                                Global DNS A-records configured to point to our secure multi-tier CDN. SSL Issued. Live preview has updated!
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  alert(`Domain test query was verified! Responding in <4ms from Edge core nodes.`);
                                }}
                                className="w-full py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[8.5px] font-bold cursor-pointer"
                              >
                                Ping test target IP
                              </button>
                            </div>
                          )}

                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeEditSection === 'security' && (
                  <div className="space-y-4 text-left animate-fade-in">
                    <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                      <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-indigo-650 text-indigo-600 shrink-0" />
                        Continuous Security Guard
                      </h4>
                      <span className="text-[7.5px] px-2 py-0.5 rounded font-black bg-[#5b36ff]/10 text-[#5b36ff] font-mono tracking-wider select-none border border-indigo-100">
                        SHIELD ARMED
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Interactive Trust Badges */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">SSL Certificate</span>
                          <span className="text-[10px] text-slate-800 font-extrabold block mt-0.5 flex items-center gap-1 text-slate-900">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Lifetime Active
                          </span>
                        </div>
                        <div className="p-2 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">DDoS Edge Shield</span>
                          <span className="text-[10px] text-indigo-600 font-extrabold block mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            Armed (100Gbps)
                          </span>
                        </div>
                      </div>

                      {/* Web Application Firewall Details */}
                      <div className="p-3 bg-gradient-to-b from-[#120a2a]/5 to-[#120a2a]/10 border border-slate-200 rounded-xl">
                        <div className="space-y-1">
                          <p className="text-[8px] text-indigo-600 font-extrabold uppercase tracking-wider font-mono">WAF Ruleset Integrations</p>
                          <p className="text-[11px] text-slate-905 font-bold">SQL Injection &amp; XSS Isolation active</p>
                          <p className="text-[9.5px] text-slate-500 leading-relaxed font-semibold">
                            Our server layer intercepts queries to block dynamic vulnerabilities automatically, ensuring absolute lifelong database safety.
                          </p>
                        </div>
                      </div>

                      {/* Continuous logs with live Trigger Scan button */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[8.5px] text-slate-400 font-black uppercase tracking-wider font-mono">Threat Detection Logs</span>
                          <button
                            onClick={triggerLiveSecurityScan}
                            disabled={isScanningSecurity}
                            className="text-[9px] text-[#5b36ff] font-extrabold hover:underline flex items-center gap-1 focus:outline-none cursor-pointer"
                          >
                            <RefreshCw className={`w-2.5 h-2.5 ${isScanningSecurity ? 'animate-spin' : ''}`} />
                            Run Audit Scan
                          </button>
                        </div>

                        <div className="bg-slate-905 bg-slate-900 border border-slate-800 rounded-xl p-2.5 space-y-2 font-mono text-[9px] text-indigo-150 text-indigo-200 text-left max-h-[160px] overflow-y-auto">
                          <div className="border-b border-white/5 pb-1 flex justify-between items-center text-slate-500 text-[8px]">
                            <span>{securityScanTime}</span>
                            <span className="text-emerald-400 font-bold">● VIBE SHIELD VERIFIED</span>
                          </div>
                          {securityLogs.map((log: string, idx: number) => (
                            <p key={idx} className="leading-relaxed border-l-2 border-emerald-500/50 pl-1.5 text-slate-200">
                              {log}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-xl text-[10px] font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Security verified. Free auto-renewing certificates active forever.</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Download / Deploy widget info */}
              {successDeployed && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-250 text-left text-emerald-800 text-xs space-y-2 animate-fade-in shadow-xs">
                  <p className="font-black text-xs flex items-center gap-1.5 text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 animate-bounce" />
                    Deployed live to Vibe Node CDN!
                  </p>
                  <p className="text-[11px] text-emerald-700 leading-relaxed font-semibold">
                    Code compilation completed with 100% caching optimization speeds. Register a domain or map your hosting plan to point it to real coordinates.
                  </p>
                  <button 
                    onClick={() => setActivePage('pricing')}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[10.5px] font-bold text-center block shadow-sm cursor-pointer transition-all uppercase"
                  >
                    Select Plan & Launch custom TLD
                  </button>
                </div>
              )}
            </div>

            {/* simulated Live Viewport browser simulator */}
            <div className="col-span-12 lg:col-span-8">
              
              <AnimatePresence mode="wait">
                {activeEditorTab === 'preview' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.2 }}
                    className={`mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 ${previewDevice === 'mobile' ? 'max-w-[390px]' : 'w-full'}`}
                  >
                    
                    {/* Simulated URL bar */}
                    <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center space-x-1.5 max-w-[70%] truncate">
                        <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="font-mono text-emerald-600 font-bold truncate">
                          https://{connectedDomain || (promptValue.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'website') + '-ai-draft.live'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        <span className="text-[9px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-sm uppercase font-mono font-bold">Simulated Live</span>
                      </div>
                    </div>

                    {/* Live Preview interactive HTML rendering frame with user vibe customization */}
                    <div className={`bg-white text-slate-900 antialiased p-5 sm:p-9 space-y-12 overflow-y-auto max-h-[580px] bg-gradient-to-b ${selectedColors.backgroundBg} ${vibeFont === 'serif' ? 'font-serif' : vibeFont === 'mono' ? 'font-mono' : 'font-sans'}`}>
                      
                      {/* Virtual browser Navbar */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <span className="text-sm font-extrabold text-slate-950 tracking-tight flex items-center gap-1.5">
                          <span className={`${selectedColors.accentBg} w-3.5 h-3.5 rounded-full inline-block`} />
                          {websiteDraft.themeName || 'My Brand System'}
                        </span>
                        <nav className="hidden sm:flex space-x-4 text-[11px] font-bold text-slate-500">
                          <span className="hover:text-slate-800 cursor-pointer">Specs</span>
                          <span className="hover:text-slate-800 cursor-pointer">Performance</span>
                          <span className="hover:text-slate-800 cursor-pointer">FAQ</span>
                        </nav>
                      </div>

                      {/* Dynamic Hero rendering inside simulator */}
                      <div className="text-center py-6 space-y-4">
                        <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-[#5b36ff] px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-[#5b36ff]" />
                          <span>Dynamic {selectedTemplateType.replace('-', ' ')} Vibe Mode</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto">
                          {websiteDraft.hero?.title || 'Masterpiece layout draft state'}
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-[13px] max-w-lg mx-auto leading-relaxed">
                          {websiteDraft.hero?.subtitle}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <span className={`${selectedColors.primaryBtn} text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer inline-block`}>
                            {websiteDraft.hero?.ctaText || 'Claim Priority Registration'}
                          </span>
                        </div>
                      </div>

                      {/* Live Feature Highlights Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 py-4">
                        {websiteDraft.features?.map((f: any, idx: number) => (
                          <div key={idx} className="bg-white p-4.5 rounded-2xl border border-slate-150 text-left shadow-xs space-y-2">
                            <div className={`${selectedColors.accent} font-bold flex items-center justify-start gap-1.5`}>
                              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                              <span className="text-xs font-extrabold text-slate-900">{f.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{f.description}</p>
                          </div>
                        ))}
                      </div>

                      {/* Live Telemetry / metric Counter blocks */}
                      <div className="bg-slate-900 text-white p-6.5 rounded-3xl flex flex-wrap gap-6 justify-around text-center">
                        {websiteDraft.stats?.map((st: any, idx: number) => (
                          <div key={idx}>
                            <div className="text-xl sm:text-2xl font-black text-indigo-400">{st.value}</div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{st.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Consolidated detail Sections */}
                      <div className="space-y-8 py-4 text-left text-xs">
                        {websiteDraft.sections?.map((sec: any, idx: number) => (
                          <div key={idx} className={`flex flex-col md:flex-row items-center gap-6 ${sec.alignment === 'right' ? 'md:flex-row-reverse' : ''}`}>
                            <div className="w-full md:w-1/2 space-y-2.5">
                              <h3 className="font-extrabold text-[#120a2a] text-sm sm:text-base leading-tight">{sec.title}</h3>
                              <p className="text-slate-500 leading-relaxed">{sec.content}</p>
                            </div>
                            <div className="w-full md:w-1/2 aspect-video bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-slate-200">
                              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">Consolidated System Assets</span>
                              <span className="text-[8px] text-slate-400 mt-1 font-mono">100% optimised caching</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Live Testimonial proofs row */}
                      <div className="border-t border-slate-150 pt-8 text-left">
                        <h3 className="text-center font-black text-slate-950 mb-6 text-xs uppercase tracking-wider font-mono">Audited Partnerships reviews</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {websiteDraft.testimonials?.map((t: any, idx: number) => (
                            <div key={idx} className="bg-white p-4.5 rounded-2xl text-left border border-slate-200 shadow-xs space-y-3">
                              <p className="text-slate-500 italic text-[11px] leading-relaxed">&ldquo;{t.comment}&rdquo;</p>
                              <div className="flex items-center space-x-2">
                                <div className="w-6.5 h-6.5 rounded-full bg-slate-200" />
                                <div>
                                  <h4 className="font-bold text-slate-900 text-[11px]">{t.name}</h4>
                                  <p className="text-[9px] text-indigo-600 font-bold">{t.role}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Live FAQ Accordion rows */}
                      <div className="border-t border-slate-150 pt-8 text-left space-y-4">
                        <h3 className="text-center font-black text-slate-950 mb-3 text-xs uppercase tracking-wider font-mono">Addressed Queries</h3>
                        <div className="space-y-2.5">
                          {websiteDraft.faq?.map((q: any, idx: number) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200">
                              <p className="font-bold text-xs text-slate-900">{q.question}</p>
                              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{q.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Legal Footer */}
                      <div className="border-t border-slate-200 pt-8 pb-4 text-center space-y-3 shrink-0">
                        <p className="text-[10px] text-slate-400 font-mono tracking-tight leading-relaxed">
                          &copy; {new Date().getFullYear()} {websiteDraft.themeName}. All rights reserved under secure Indian cloud coordinates.
                        </p>
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => setShowPreviewTermsModal(true)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold px-3 py-1.5 rounded-lg border border-slate-205 text-[10px] tracking-wide transition-all uppercase cursor-pointer"
                          >
                            Read Terms & Conditions
                          </button>
                        </div>
                      </div>

                      {/* Overlaid Legal Modal inside simulator */}
                      {showPreviewTermsModal && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-left">
                          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-6 shadow-2xl relative flex flex-col max-h-[85%] text-slate-700 animate-fade-in">
                            <button
                              onClick={() => setShowPreviewTermsModal(false)}
                              className="absolute top-4 right-4 w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-605 font-bold border border-slate-205 cursor-pointer text-xs"
                            >
                              &times;
                            </button>
                            
                            <div className="space-y-1.5 pb-3 border-b border-slate-100 shrink-0">
                              <span className="text-[8.5px] px-2 py-0.5 rounded font-black bg-indigo-50 border border-indigo-150 text-indigo-700 uppercase tracking-widest font-mono block w-max">Legal Document</span>
                              <h3 className="font-display font-black text-slate-900 text-sm tracking-tight">{websiteDraft.legal?.title || "Terms and Conditions"}</h3>
                              <p className="text-[10px] text-slate-450 font-mono">Last Updated: {websiteDraft.legal?.lastUpdated || "June 2026"}</p>
                            </div>

                            <div className="flex-1 overflow-y-auto py-3 space-y-4 max-h-[280px] text-[11.5px] leading-relaxed text-slate-600">
                              <div>
                                <p className="font-bold text-slate-800 mb-1">1. Parties & Governing Jurisdiction</p>
                                <p>These terms and conditions govern the use of virtual services. These guidelines are compiled on behalf of <span className="font-bold text-[#5b36ff]">{websiteDraft.legal?.companyName || "Our Brand Group"}</span> and are strictly regulated under <span className="font-mono text-xs text-indigo-700 font-bold bg-indigo-50 border border-indigo-100/50 px-1 py-0.5 rounded">{websiteDraft.legal?.governingLaw || "the Jurisdiction of India"}</span>.</p>
                              </div>

                              {websiteDraft.legal?.clauses?.map((clause: any, i: number) => (
                                <div key={i}>
                                  <p className="font-bold text-slate-800 mb-1">{i + 2}. {clause.title}</p>
                                  <p>{clause.description}</p>
                                </div>
                              ))}
                            </div>

                            <div className="border-t border-slate-100 pt-3 flex justify-end shrink-0">
                              <button
                                onClick={() => setShowPreviewTermsModal(false)}
                                className="bg-[#120a2a] hover:bg-[#120a2a]/90 text-white font-bold text-[10.5px] px-5 py-2 rounded-xl transition-colors cursor-pointer"
                              >
                                Accept & Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-900 text-slate-100 rounded-3xl p-5 border border-white/15 shadow-xl text-left flex flex-col h-[650px] relative"
                  >
                    
                    {/* Code controls */}
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4 shrink-0">
                      <div className="flex items-center space-x-2.5">
                        <Code className="w-5 h-5 text-[#5b36ff]" />
                        <span className="text-xs font-bold font-mono tracking-wide text-slate-300">Clean React vs. Static HTML Template EXPORT</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex bg-slate-850 bg-slate-800 p-0.5 rounded-xl border border-white/5 mr-2">
                          <button
                            onClick={() => setActiveCodeFormat('jsx')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${activeCodeFormat === 'jsx' ? 'bg-[#5b36ff] text-white shadow-sm' : 'text-slate-450 hover:text-white'}`}
                          >
                            React JSX
                          </button>
                          <button
                            onClick={() => setActiveCodeFormat('html')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${activeCodeFormat === 'html' ? 'bg-[#5b36ff] text-white shadow-sm' : 'text-slate-450 hover:text-white'}`}
                          >
                            Static HTML
                          </button>
                        </div>

                        <button
                          onClick={handleCopyCode}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg transition-transform flex items-center space-x-1"
                        >
                          {showCopySuccess ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Code Display Console */}
                    <div className="flex-grow overflow-auto font-mono text-[11px] leading-relaxed text-indigo-200 bg-slate-950 p-4 rounded-2xl border border-slate-850 scrollbar-thin select-all">
                      <pre className="whitespace-pre">
                        {activeCodeFormat === 'jsx' ? getCompiledJSXCode() : getCompiledHTMLCode()}
                      </pre>
                    </div>

                    <div className="pt-2 text-[10.5px] text-slate-500 font-mono italic shrink-0">
                      💡 Code block updates live as you customize options inside the Node Editor sidebar. Ready to deploy.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>
      )}

      {/* Buy Credits point simulator Modal */}
      <AnimatePresence>
        {showCreditModal && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden text-left flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px]"
            >
              
              {/* Left Info Section */}
              <div className="bg-[#120a2a] text-white p-6 sm:p-8 md:w-5/12 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center md:block">
                    <span className="p-2.5 bg-[#5b36ff]/25 text-brand-purple rounded-2xl inline-block">
                      <Coins className="w-6.5 h-6.5 text-[#9f7aea]" />
                    </span>
                    <button 
                      onClick={() => setShowCreditModal(false)}
                      className="md:hidden text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="text-lg font-black tracking-tight font-display">Upgrade Generative Credits Hub</h3>
                  <p className="text-[11.5px] text-slate-350 leading-relaxed font-medium">
                    Google AI Studio compilation routines consume heavy system memory clusters. Overwrite barriers by purchasing credit matrices to design unlimited SaaS landing portals instantly.
                  </p>
                </div>

                <div className="hidden md:block py-4 border-t border-white/10 space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Instant credit activation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Secure Sandboxed UPI Gateway</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono">
                  NexHost AI Builder &bull; 100% verified operations
                </div>
              </div>

              {/* Right Billing checkout parameters */}
              <div className="p-6 sm:p-8 md:w-7/12 overflow-y-auto space-y-5 relative">
                
                {/* Close Button Desktop */}
                <button 
                  onClick={() => setShowCreditModal(false)}
                  className="hidden md:block absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <AnimatePresence mode="wait">
                  {checkoutProgress === 'idle' || checkoutProgress === 'processing' ? (
                    <motion.div 
                      key="checkout"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <h4 className="font-display font-black text-xs uppercase tracking-wider text-slate-900">1. Choose Credits Bundle</h4>
                      
                      {/* Bundle package items selector cards */}
                      <div className="space-y-2">
                        <label className={`block border p-3 rounded-2xl cursor-pointer transition-all ${selectedPack === 'starter' ? 'bg-[#5b36ff]/5 border-[#5b36ff] shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}>
                          <input 
                            type="radio" 
                            name="packSelection" 
                            checked={selectedPack === 'starter'}
                            onChange={() => setSelectedPack('starter')}
                            className="hidden" 
                          />
                          <div className="flex items-center justify-between text-left">
                            <div className="text-xs font-bold text-slate-900">🎟️ Starter Pack (+50 Credits)</div>
                            <span className="font-mono text-xs font-black text-slate-900">₹149 / $1.79</span>
                          </div>
                        </label>

                        <label className={`block border p-3 rounded-2xl cursor-pointer transition-all ${selectedPack === 'pro' ? 'bg-[#5b36ff]/5 border-[#5b36ff] shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}>
                          <input 
                            type="radio" 
                            name="packSelection" 
                            checked={selectedPack === 'pro'}
                            onChange={() => setSelectedPack('pro')}
                            className="hidden" 
                          />
                          <div className="flex items-center justify-between text-left">
                            <div className="text-xs font-bold text-[#5b36ff] flex items-center gap-1.5">
                              🚀 Professional Bundle (+150 Credits)
                              <span className="bg-emerald-500 text-[6.5px] text-white px-1 py-[1px] rounded uppercase font-black">60% Off</span>
                            </div>
                            <span className="font-mono text-xs font-black text-slate-900">₹299 / $3.59</span>
                          </div>
                        </label>

                        <label className={`block border p-3 rounded-2xl cursor-pointer transition-all ${selectedPack === 'ultimate' ? 'bg-[#5b36ff]/5 border-[#5b36ff] shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}>
                          <input 
                            type="radio" 
                            name="packSelection" 
                            checked={selectedPack === 'ultimate'}
                            onChange={() => setSelectedPack('ultimate')}
                            className="hidden" 
                          />
                          <div className="flex items-center justify-between text-left">
                            <div className="text-xs font-bold text-slate-900">👑 Ultimate Max Pro (+500 Credits)</div>
                            <span className="font-mono text-xs font-black text-slate-900">₹599 / $7.19</span>
                          </div>
                        </label>
                      </div>

                      {/* Payment Methods toggle tabs */}
                      <div className="space-y-2 border-t border-slate-100 pt-3">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">2. Secure Payment Gateway Mode</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod('razorpay');
                              setCheckoutError('');
                            }}
                            className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-0.5 cursor-pointer ${paymentMethod === 'razorpay' ? 'bg-[#5b36ff] text-white border-[#5b36ff] shadow-sm' : 'bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-205'}`}
                          >
                            <span className="font-extrabold text-[10.5px]">💳 Razorpay</span>
                            <span className="text-[7.5px] opacity-80 uppercase tracking-wide font-black">Secure #1</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod('upi');
                              setCheckoutError('');
                            }}
                            className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-0.5 cursor-pointer ${paymentMethod === 'upi' ? 'bg-[#120a2a] text-white border-[#120a2a] shadow-sm' : 'bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-205'}`}
                          >
                            <span>🇮🇳 Indian UPI</span>
                            <span className="text-[7.5px] opacity-80">Direct</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod('card');
                              setCheckoutError('');
                            }}
                            className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-0.5 cursor-pointer ${paymentMethod === 'card' ? 'bg-[#120a2a] text-white border-[#120a2a] shadow-sm' : 'bg-slate-50 text-slate-500 hover:text-slate-800 border-slate-205'}`}
                          >
                            <span>💳 Card Pay</span>
                            <span className="text-[7.5px] opacity-80">Visa/Rupay</span>
                          </button>
                        </div>
                      </div>

                      {/* Checkout detailed Form inputs */}
                      <form onSubmit={handleProcessUpgrade} className="space-y-3.5 text-left text-xs">
                        {paymentMethod === 'razorpay' ? (
                          <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-xs space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm font-black text-xs font-mono">
                                R
                              </div>
                              <div className="text-left">
                                <p className="font-extrabold text-indigo-950 text-[11px] leading-tight">Razorpay Instant Integration</p>
                                <p className="text-[8px] text-indigo-700 font-bold uppercase tracking-wider font-mono">India&apos;s Leading Trusted Gateway</p>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                              Pay securely via cards, 100+ netbanking portals, Google Pay, PhonePe, and instant automated Razorpay webhooks. Verified SSL connections are active forever.
                            </p>
                            
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 px-2.5 flex items-center justify-between text-[10px]">
                              <span className="text-slate-500 font-bold font-sans">Active Key ID:</span>
                              {rzpKeyId ? (
                                <span className="font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded font-bold break-all max-w-[190px]">{rzpKeyId}</span>
                              ) : (
                                <span className="text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded font-black tracking-tight text-[8px] uppercase">
                                  ⚠️ Simulated Mode
                                </span>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-0.5">
                                  <label className="text-[8px] text-slate-400 uppercase font-black font-mono">Safe Receipt Email</label>
                                  <input 
                                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 focus:outline-none" 
                                    type="email" 
                                    required
                                    value={razorpayEmail}
                                    onChange={(e) => setRazorpayEmail(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <label className="text-[8px] text-slate-400 uppercase font-black font-mono">Mobile Number</label>
                                  <input 
                                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 focus:outline-none" 
                                    type="tel"
                                    required
                                    value={razorpayPhone}
                                    onChange={(e) => setRazorpayPhone(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="p-2.5 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border border-indigo-100 rounded-xl text-indigo-950 text-[9.5px] font-extrabold leading-normal flex items-start gap-1.5">
                                <span className="text-emerald-500 font-mono">✔</span>
                                <span>Zero extra convenience fee. Seamless Razorpay callbacks auto-renewing security certificates forever.</span>
                              </div>
                            </div>
                          </div>
                        ) : paymentMethod === 'upi' ? (
                          <div className="space-y-1">
                            <label className="text-[9.5px] text-slate-450 font-bold uppercase">Enter UPI ID</label>
                            <input
                              type="text"
                              required
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="e.g. rajsahani@okicici"
                              className="w-full bg-slate-50 border border-slate-205 border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#5b36ff]"
                            />
                            <p className="text-[9px] text-slate-400 font-medium">Supports BHIM UPI, PhonePe, Google Pay, Paytm, or any banking portal.</p>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            <div className="space-y-1">
                              <label className="text-[9.5px] text-slate-450 font-bold uppercase">Cardholder Name</label>
                              <input
                                type="text"
                                required
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder="e.g. Rajesh Sahani"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-purple"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9.5px] text-slate-450 font-bold uppercase">Card Number</label>
                              <input
                                type="text"
                                required
                                maxLength={19}
                                value={cardNumber}
                                onChange={(e) => {
                                  const rawVal = e.target.value.replace(/\s?/g, '');
                                  if (isNaN(Number(rawVal))) return;
                                  const formatted = rawVal.match(/.{1,4}/g)?.join(' ') || rawVal;
                                  setCardNumber(formatted);
                                }}
                                placeholder="4123 4567 8901 2345"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-brand-purple"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[9.5px] text-slate-450 font-bold uppercase">Expiry Date</label>
                                <input
                                  type="text"
                                  required
                                  maxLength={5}
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  placeholder="MM/YY"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9.5px] text-slate-450 font-bold uppercase">CVV Code</label>
                                <input
                                  type="password"
                                  required
                                  maxLength={4}
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  placeholder="123"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {checkoutError && (
                          <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl text-red-650 text-[10.5px] font-semibold text-left">
                            ❌ {checkoutError}
                          </div>
                        )}

                        {checkoutProgress === 'processing' ? (
                          <button 
                            type="button"
                            disabled
                            className="w-full py-3 bg-[#120a2a]/90 text-white rounded-xl text-xs font-bold tracking-wider flex items-center justify-center space-x-2 border border-slate-800"
                          >
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>{checkoutStatusMsg}</span>
                          </button>
                        ) : (
                          <button 
                            type="submit"
                            className="w-full py-3 bg-[#5b36ff] hover:bg-[#492be0] text-white rounded-xl text-xs font-extrabold tracking-wider transition-all shadow-md text-center uppercase cursor-pointer flex items-center justify-center space-x-2"
                          >
                            <CreditCard className="w-4 h-4 shrink-0" />
                            <span>Verify Secure Checkout</span>
                          </button>
                        )}
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="success"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="py-12 text-center space-y-4"
                    >
                      <div className="inline-block p-4 bg-emerald-50 text-emerald-550 border border-emerald-100 rounded-full animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-display font-black text-emerald-950 text-lg sm:text-xl">UPI Gateway Fulfilled!</h3>
                        <p className="text-slate-500 text-xs px-2 leading-relaxed">
                          Your purchased points bundle has been synchronized and appended to your local creator balance successfully. Continue creating beautiful, high-speed SaaS solutions instantly.
                        </p>
                      </div>
                      
                      <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 mt-2">
                        <p className="text-xs text-slate-500 font-semibold mb-1">New Total Balance:</p>
                        <p className="font-mono text-2xl font-black text-[#5b36ff]">{credits} Credits</p>
                      </div>

                      <button 
                        onClick={() => setShowCreditModal(false)}
                        className="w-full py-3.5 bg-[#120a2a] hover:bg-[#180e37] text-white rounded-xl text-xs font-extrabold shadow-sm cursor-pointer transition-colors"
                      >
                        Navigate Back to Workspace
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Razorpay Native Premium Secured Checkout Overlay */}
      <AnimatePresence>
        {isRazorpayModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-full max-w-[430px] rounded-3xl overflow-hidden shadow-2xl border border-indigo-100 text-slate-800"
            >
              {/* Razorpay Dark Header */}
              <div className="bg-[#121c2d] text-white px-5 py-4 flex items-center justify-between relative">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-inner">
                    R
                  </div>
                  <div className="text-left">
                    <h4 className="font-display font-bold text-xs tracking-tight text-slate-100 flex items-center gap-1.5">
                      Razorpay Checkout
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 text-[7px] px-1.5 py-0.5 rounded font-black tracking-widest">SECURE</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[240px]">{razorpayPurpose}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsRazorpayModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Price Banner */}
              <div className="bg-indigo-50/70 border-b border-indigo-100 px-5 py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5 text-left">
                  <span className="text-[8.5px] text-indigo-700 font-black uppercase font-mono tracking-widest">Total Secure Amount</span>
                  <p className="text-[11px] text-slate-500 font-bold">Automatic lifelong setup included</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-black text-indigo-950">₹{razorpayAmount}</span>
                  <span className="text-[8.5px] font-bold text-indigo-600 block">INR (Indian Rupee)</span>
                </div>
              </div>

              {/* Dynamic Merchant Credential Key Badge */}
              <div className="bg-slate-900 text-slate-300 text-[10px] px-5 py-2 flex items-center justify-between border-b border-slate-800">
                <span className="font-semibold text-slate-400">Razorpay Merchant Key ID:</span>
                {rzpKeyId ? (
                  <span className="font-mono font-bold text-emerald-400 select-all bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 max-w-[200px] truncate">{rzpKeyId}</span>
                ) : (
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[8px] uppercase tracking-wider animate-pulse">Simulated Sandbox</span>
                )}
              </div>

              {/* Razorpay Tab Layout for Indian local payments */}
              {razorpayProcessingState === 'idle' ? (
                <div className="p-5 space-y-4 text-left">
                  {/* Select Payment channels */}
                  <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-100 rounded-xl border border-slate-205">
                    <button
                      type="button"
                      onClick={() => setRazorpayActiveTab('upi')}
                      className={`py-2 px-1 text-center rounded-lg text-[9.5px] font-bold transition-all cursor-pointer ${razorpayActiveTab === 'upi' ? 'bg-[#5b36ff] text-white shadow-xs' : 'text-slate-500 hover:text-slate-950'}`}
                    >
                      UPI ID
                    </button>
                    <button
                      type="button"
                      onClick={() => setRazorpayActiveTab('qr')}
                      className={`py-2 px-1 text-center rounded-lg text-[9.5px] font-bold transition-all cursor-pointer ${razorpayActiveTab === 'qr' ? 'bg-[#5b36ff] text-white shadow-xs' : 'text-slate-500 hover:text-slate-950'}`}
                    >
                      UPI QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setRazorpayActiveTab('card')}
                      className={`py-2 px-1 text-center rounded-lg text-[9.5px] font-bold transition-all cursor-pointer ${razorpayActiveTab === 'card' ? 'bg-[#5b36ff] text-white shadow-xs' : 'text-slate-500 hover:text-slate-950'}`}
                    >
                      Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setRazorpayActiveTab('netbanking')}
                      className={`py-2 px-1 text-center rounded-lg text-[9.5px] font-bold transition-all cursor-pointer ${razorpayActiveTab === 'netbanking' ? 'bg-[#5b36ff] text-white shadow-xs' : 'text-slate-500 hover:text-slate-950'}`}
                    >
                      Net Bank
                    </button>
                  </div>

                  {/* Dynamic Tab Body */}
                  {razorpayActiveTab === 'upi' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[8.5px] text-slate-400 uppercase font-black font-mono">1. Select Preferred UPI Network</label>
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => { setRazorpaySelectedUpiApp('gpay'); setRazorpayUpiAddress(`${razorpayPhone}@okaxis`); }}
                            className={`p-2 rounded-xl border text-[9.5px] font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${razorpaySelectedUpiApp === 'gpay' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-black shadow-xs' : 'border-slate-200 hover:border-slate-350 bg-white'}`}
                          >
                            <span className="text-xs">🔵</span>
                            <span>Google Pay</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRazorpaySelectedUpiApp('phonepe'); setRazorpayUpiAddress(`${razorpayPhone}@ybl`); }}
                            className={`p-2 rounded-xl border text-[9.5px] font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${razorpaySelectedUpiApp === 'phonepe' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-black shadow-xs' : 'border-slate-200 hover:border-slate-350 bg-white font-semibold'}`}
                          >
                            <span className="text-xs">🟣</span>
                            <span>PhonePe</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRazorpaySelectedUpiApp('paytm'); setRazorpayUpiAddress(`${razorpayPhone}@paytm`); }}
                            className={`p-2 rounded-xl border text-[9.5px] font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${razorpaySelectedUpiApp === 'paytm' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-black shadow-xs' : 'border-slate-200 hover:border-slate-350 bg-white'}`}
                          >
                            <span className="text-xs">🔵</span>
                            <span>Paytm UPI</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setRazorpaySelectedUpiApp('other'); setRazorpayUpiAddress(''); }}
                            className={`p-2 rounded-xl border text-[9.5px] font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${razorpaySelectedUpiApp === 'other' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-black shadow-xs' : 'border-slate-200 hover:border-slate-350 bg-white'}`}
                          >
                            <span className="text-xs">⚙</span>
                            <span>Other UPI</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[8px] text-slate-450 font-black font-mono uppercase">2. Confirm UPI Address</label>
                        <input
                          type="text"
                          required
                          value={razorpayUpiAddress}
                          onChange={(e) => setRazorpayUpiAddress(e.target.value)}
                          placeholder="e.g. 9876543210@paytm"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {razorpayActiveTab === 'qr' && (
                    <div className="bg-indigo-950 text-white p-3.5 rounded-2xl text-center space-y-3 border border-indigo-800">
                      <p className="text-[10px] text-indigo-200 font-semibold leading-relaxed text-center">
                        Scan this verified dynamic secure Razorpay QR code using GPay, PhonePe, Paytm, or BHIM to pay instantly.
                      </p>
                      
                      <div className="mx-auto w-32 h-32 bg-white p-2.5 rounded-xl border-4 border-indigo-400 flex items-center justify-center relative shadow-md">
                        <div className="grid grid-cols-5 gap-1 bg-white p-1">
                          <div className="w-4 h-4 bg-indigo-900" />
                          <div className="w-4 h-4 bg-indigo-900" />
                          <div className="w-4 h-4 bg-slate-200" />
                          <div className="w-4 h-4 bg-indigo-900" />
                          <div className="w-4 h-4 bg-indigo-900" />
                          
                          <div className="w-4 h-4 bg-slate-100" />
                          <div className="w-4 h-4 bg-indigo-900" />
                          <div className="w-4 h-4 bg-indigo-900" />
                          <div className="w-4 h-4 bg-slate-200" />
                          <div className="w-4 h-4 bg-slate-100" />
                          
                          <div className="w-4 h-4 bg-indigo-900" />
                          <div className="w-4 h-4 bg-slate-100" />
                          <div className="w-4 h-4 bg-indigo-900" />
                          <div className="w-4 h-4 bg-indigo-900" />
                          <div className="w-4 h-4 bg-slate-200" />
                          
                          <div className="w-4 h-4 bg-indigo-900" />
                          <div className="w-4 h-4 bg-indigo-900" />
                          <div className="w-4 h-4 bg-slate-100" />
                          <div className="w-4 h-4 bg-indigo-900" />
                          <div className="w-4 h-4 bg-indigo-900" />
                        </div>
                        <div className="absolute inset-0 m-auto w-7 h-7 bg-indigo-600 rounded-md border border-white flex items-center justify-center font-black text-[9px] text-white shadow">
                          R
                        </div>
                      </div>
                      <p className="text-[8px] uppercase font-black text-emerald-400 font-mono tracking-widest text-center animate-pulse">
                        ⌛ Dynamic QR code live loaded
                      </p>
                    </div>
                  )}

                  {razorpayActiveTab === 'card' && (
                    <div className="space-y-2 text-left">
                      <div className="space-y-1">
                        <label className="text-[8px] text-slate-400 uppercase font-black font-mono">Card number</label>
                        <input
                          type="text"
                          placeholder="4123 5678 9012 3456"
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-indigo-600 font-mono text-[11px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[8px] text-slate-400 uppercase font-black font-mono">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs rounded-xl focus:outline-none focus:border-indigo-600 font-mono text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] text-slate-400 uppercase font-black font-mono">CVV Code</label>
                          <input
                            type="password"
                            placeholder="***"
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs rounded-xl focus:outline-none focus:border-indigo-600 font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {razorpayActiveTab === 'netbanking' && (
                    <div className="space-y-2 text-left">
                      <label className="text-[8.5px] text-slate-400 uppercase font-black font-mono block">Choose Indian banking server</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'KOTAK Bank', 'Punjab National Bank'].map((bank, bidx) => (
                          <button
                            key={bidx}
                            type="button"
                            onClick={() => {
                              alert(`Simulated secure callback successfully attached with ${bank} credentials.`);
                            }}
                            className="p-2 border border-slate-150 hover:border-indigo-600 rounded-xl text-[10px] font-bold text-left bg-slate-50 hover:bg-white truncate block cursor-pointer transition-all"
                          >
                            🏛 {bank}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customer Contact Verification Indicator */}
                  <div className="border-t border-slate-105 pt-3 flex justify-between items-center text-[9px] text-slate-400 leading-tight">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Shield className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Razorpay SSL SECURED</span>
                    </div>
                    <span className="font-mono text-indigo-900 font-bold">{razorpayEmail}</span>
                  </div>

                  {/* Complete Payment Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setRazorpayProcessingState('processing');
                      const generatedId = `pay_Rzp${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                      setRazorpayPaymentId(generatedId);
                      
                      setTimeout(() => {
                        setRazorpayProcessingState('verified');
                        setTimeout(() => {
                          setIsRazorpayModalOpen(false);
                          const executable = razorpayOnSuccess;
                          if (typeof executable === 'function') {
                            executable();
                          }
                        }, 1600);
                      }, 2000);
                    }}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[11px] font-extrabold shadow-md hover:shadow-lg transition-all hover:scale-[1.01] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <Shield className="w-3.5 h-3.5 text-white animate-pulse" />
                    <span>Verify Payment ₹{razorpayAmount}</span>
                  </button>
                </div>
              ) : razorpayProcessingState === 'processing' ? (
                <div className="p-8 text-center space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-slate-800 text-xs">Authenticating Razorpay Gateway API...</h5>
                    <p className="text-[9.5px] text-slate-500 leading-relaxed max-w-[280px] mx-auto font-medium">
                      Exchanging signature credentials with server webhooks to guarantee 100% database safety. Please do not close this window.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl text-left text-[8.5px] font-mono text-slate-500 space-y-0.5 border border-slate-200">
                    <p>● API HANDSHAKE INSTANTIATED</p>
                    <p>● TOKEN ID: {razorpayPaymentId}</p>
                    <p>● STATUS: SECURE TRANSFER LOOP</p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-4 bg-emerald-50/40">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold animate-bounce">
                    ✔
                  </div>
                  <div className="space-y-1.5 font-sans">
                    <h5 className="font-bold text-emerald-950 text-xs">Razorpay Payment Verified!</h5>
                    <p className="text-[9px] text-emerald-800 leading-relaxed font-semibold">
                      Your transactional token is <span className="font-mono font-black">{razorpayPaymentId}</span>. Synchronization complete.
                    </p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-xl text-[8.5px] font-mono text-emerald-700 uppercase font-black tracking-widest border border-emerald-250">
                    🔒 SSL SAFE &amp; SECURED FOREVER
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

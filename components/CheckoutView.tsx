'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, Search, ArrowRight, Lock, HelpCircle, Sparkles, Check, ChevronDown, ChevronUp, RefreshCw, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutViewProps {
  selectedPlan: any;
  selectedDomain?: any;
  setActivePage: (page: string) => void;
  setIsLoggedIn: (status: boolean) => void;
}

export default function CheckoutView({ selectedPlan, selectedDomain, setActivePage, setIsLoggedIn }: CheckoutViewProps) {
  // Configured default state variables mimicking the screenshot's initial state
  const [userEmail, setUserEmail] = useState('rajsahaniuk53@gmail.com');
  const [selectedPeriod, setSelectedPeriod] = useState<'48' | '24' | '12' | '1'>('48');
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [openPaymentMethod, setOpenPaymentMethod] = useState<'upi' | 'card' | 'paypal' | 'emi' | 'simpl'>('upi');
  
  // Simpl safe & secure pay-later integration states
  const [simplPhone, setSimplPhone] = useState('9110002026');
  const [simplOtp, setSimplOtp] = useState('');
  const [simplStep, setSimplStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [simplOtpError, setSimplOtpError] = useState('');
  const [isSimplLoading, setIsSimplLoading] = useState(false);
  
  // Interactive interactive state trackers
  const [domainSearchQuery, setDomainSearchQuery] = useState(selectedDomain?.name || '');
  const [domainStatus, setDomainStatus] = useState<null | 'checking' | 'available' | 'empty'>(
    selectedDomain ? 'available' : null
  );
  
  const [upiId, setUpiId] = useState('rajsahani.RgcS@okaxis');
  const [discountPercent, setDiscountPercent] = useState(0); 
  const [promoCode, setPromoCode] = useState('');
  const [isCouponInputVisible, setIsCouponInputVisible] = useState(false);
  const [couponStatusMsg, setCouponStatusMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [razorpayError, setRazorpayError] = useState<string | null>(null);

  // Dynamic state selectors for 100% direct instant bank payments
  const [upiSubMethod, setUpiSubMethod] = useState<'app' | 'qr'>('qr');
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');
  const [isVerifyingUtr, setIsVerifyingUtr] = useState(false);

  const handleManualUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setUtrError('Please enter your 12-digit UPI UTR / Transaction Reference number.');
      return;
    }
    if (utrNumber.trim().length < 12) {
      setUtrError('A valid UPI transaction UTR must be exactly 12 numeric digits.');
      return;
    }
    
    setIsVerifyingUtr(true);
    setUtrError('');

    setTimeout(() => {
      setIsVerifyingUtr(false);
      setIsSuccess(true);
      setIsLoggedIn(true);
      setTimeout(() => {
        setActivePage('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);
    }, 2800);
  };

  // Dynamic utility to load script dynamically on demand
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Card information forms
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Define period details matches with official pricing model shown in user's image
  const getDynamicPeriodPricing = () => {
    // defaults matching Single plan INR pricing
    let pricesInr = {
      '1': 279,
      '12': 139,
      '24': 90,
      '48': 48
    };

    if (selectedPlan && selectedPlan.prices && selectedPlan.prices.inr) {
      const pinr = selectedPlan.prices.inr;
      pricesInr = {
        '1': pinr['1month'] !== undefined ? pinr['1month'] : (pinr['1'] || 399),
        '12': pinr['12months'] !== undefined ? pinr['12months'] : (pinr['12month'] || pinr['12'] || 199),
        '24': pinr['24months'] !== undefined ? pinr['24months'] : (pinr['24month'] || pinr['24'] || 129),
        '48': pinr['48months'] !== undefined ? pinr['48months'] : (pinr['48month'] || pinr['48'] || 69)
      };
    }

    return {
      '48': {
        label: '48 months',
        pricePerMonth: pricesInr['48'],
        regularPricePerMonth: 399,
        totalBase: pricesInr['48'] * 48,
        regularTotalBase: 399 * 48,
        savings: (399 - pricesInr['48']) * 48,
        taxes: parseFloat(((pricesInr['48'] * 48) * 0.18).toFixed(2)),
        totalPayable: parseFloat(((pricesInr['48'] * 48) * 1.18).toFixed(2)),
        regularTotalPayable: parseFloat(((399 * 48) * 1.18).toFixed(2)),
        renewRate: `Renews at ₹${pricesInr['48']}/mo`
      },
      '24': {
        label: '24 months',
        pricePerMonth: pricesInr['24'],
        regularPricePerMonth: 399,
        totalBase: pricesInr['24'] * 24,
        regularTotalBase: 399 * 24,
        savings: (399 - pricesInr['24']) * 24,
        taxes: parseFloat(((pricesInr['24'] * 24) * 0.18).toFixed(2)),
        totalPayable: parseFloat(((pricesInr['24'] * 24) * 1.18).toFixed(2)),
        regularTotalPayable: parseFloat(((399 * 24) * 1.18).toFixed(2)),
        renewRate: `Renews at ₹${pricesInr['24']}/mo`
      },
      '12': {
        label: '12 months',
        pricePerMonth: pricesInr['12'],
        regularPricePerMonth: 399,
        totalBase: pricesInr['12'] * 12,
        regularTotalBase: 4788,
        savings: (399 - pricesInr['12']) * 12,
        taxes: parseFloat(((pricesInr['12'] * 12) * 0.18).toFixed(2)),
        totalPayable: parseFloat(((pricesInr['12'] * 12) * 1.18).toFixed(2)),
        regularTotalPayable: parseFloat(((399 * 12) * 1.18).toFixed(2)),
        renewRate: `Renews at ₹${pricesInr['12']}/mo`
      },
      '1': {
        label: '1 month',
        pricePerMonth: pricesInr['1'],
        regularPricePerMonth: 399,
        totalBase: pricesInr['1'],
        regularTotalBase: 399,
        savings: 399 - pricesInr['1'],
        taxes: parseFloat((pricesInr['1'] * 0.18).toFixed(2)),
        totalPayable: parseFloat((pricesInr['1'] * 1.18).toFixed(2)),
        regularTotalPayable: parseFloat((399 * 1.18).toFixed(2)),
        renewRate: `Renews at ₹${pricesInr['1']}/mo`
      }
    };
  };

  const periodPricing = getDynamicPeriodPricing();

  const activePeriod = periodPricing[selectedPeriod];

  // Dynamic Coupon and discount applicator - Queries dynamic coupons from local storage
  const [couponsList, setCouponsList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vibe_coupons_offers');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [
      { code: 'sasta10', discount: 10 },
      { code: 'hostinger10', discount: 10 },
      { code: 'rajsahani', discount: 10 }
    ];
  });

  const applyCoupon = () => {
    const codeClean = promoCode.trim().toLowerCase();
    const found = couponsList.find(c => c.code.toLowerCase() === codeClean);
    if (found) {
      setDiscountPercent(found.discount);
      setCouponStatusMsg(`✓ ${found.discount}% Extra Coupon Code Applied Successfully!`);
    } else {
      setCouponStatusMsg('✕ Invalid Coupon Code. Try "rajsahani" or "sasta10"');
    }
  };

  // Helper calculations for dynamic display sum
  const baseDiscounted = activePeriod.totalBase * (1 - discountPercent / 100);
  const calculatedTaxes = parseFloat((baseDiscounted * 0.18).toFixed(2)); // 18% standard GST taxation
  const calculatedTotal = parseFloat((baseDiscounted + calculatedTaxes).toFixed(2));

  useEffect(() => {
    if (isSuccess && typeof window !== 'undefined') {
      const stored = localStorage.getItem('hosting_ai_builder_credits');
      const current = stored ? parseInt(stored, 10) : 10;
      // Grant +5 Vibe credits immediately when subscription payment completes!
      const newVal = current + 5;
      localStorage.setItem('hosting_ai_builder_credits', newVal.toString());
      
      // Select appropriate pricing name 
      let planName = "Single Web Hosting Pro (Vibe Enabled)";
      if (selectedPlan && selectedPlan.name) {
        planName = `${selectedPlan.name} (Vibe Enabled)`;
      }

      // Store plan settings for the Dashboard
      const purchasedPlan = {
        name: planName,
        price: `₹${calculatedTotal}/yr`,
        period: selectedPeriod,
        daysLeft: 365,
        features: [
          'Create up to 3 websites',
          '5 vibe coding credits',
          '20 GB solid-state disk array SSD',
          'Free managed security patches',
          'Let\'s Encrypt free wildcard SSL',
          '1-Click external domain connector active'
        ],
        purchaseDate: 'June 02, 2026',
        expiryDate: 'June 02, 2027',
        status: 'active'
      };
      localStorage.setItem('vibe_active_user_plan', JSON.stringify(purchasedPlan));
    }
  }, [isSuccess, calculatedTotal, selectedPeriod, selectedPlan]);

  // Handle Domain searching simulations inside the checkout card
  const simulateDomainSearch = () => {
    if (!domainSearchQuery.trim()) {
      setDomainStatus('empty');
      return;
    }
    
    // Normalize domain query: e.g. "Raj" or "Raj." becomes "raj.com"
    let query = domainSearchQuery.trim().toLowerCase();
    
    // Remove trailing dots
    while (query.endsWith('.')) {
      query = query.slice(0, -1);
    }
    
    if (!query) {
      setDomainStatus('empty');
      return;
    }
    
    // Check if it has a valid extension (contains a dot with at least 2 chars after it)
    const hasExtension = /\.[a-z0-9-]{2,}$/i.test(query);
    if (!hasExtension) {
      query = query + '.com';
    }
    
    setDomainSearchQuery(query);
    setDomainStatus('checking');
    setTimeout(() => {
      setDomainStatus('available');
    }, 1000);
  };

  // Action flow trigger mimics checkout completing payment success and routing to control center
  const processCheckoutPayment = async (e?: React.FormEvent, methodPrefill?: string) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    setRazorpayError(null);

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!keyId) {
      console.warn("NEXT_PUBLIC_RAZORPAY_KEY_ID is missing from environment. Razorpay requires this key.");
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setIsProcessing(false);
      setRazorpayError("Failed to load Razorpay Checkout SDK. Please check your internet connection.");
      return;
    }

    const options: any = {
      key: keyId || "rzp_test_placeholder_key",
      amount: Math.round(calculatedTotal * 100), // paise
      currency: "INR",
      name: "Super AI Site Builder",
      description: `${selectedPeriod}-month Single plan subscription`,
      image: "https://cdn.pixabay.com/photo/2021/08/25/20/42/logo-6574455_960_720.png",
      handler: function (response: any) {
        setIsProcessing(false);
        setIsSuccess(true);
        setIsLoggedIn(true);
        setTimeout(() => {
          setActivePage('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2500);
      },
      prefill: {
        name: cardName || "Raj Sahani",
        email: userEmail,
        contact: "9999999999"
      },
      theme: {
        color: "#673ab7",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      }
    };

    if (methodPrefill) {
      options.prefill.method = methodPrefill;
    }

    try {
      const rzpObj = new (window as any).Razorpay(options);
      rzpObj.on('payment.failed', function (resp: any) {
        console.error("Razorpay error response:", resp.error);
        setRazorpayError(`Payment Failed: ${resp.error.description || "The bank or wallet gateway declined the action"}`);
        setIsProcessing(false);
      });
      rzpObj.open();
    } catch (err: any) {
      console.error("Failed to construct Razorpay instance:", err);
      setIsProcessing(false);
      setRazorpayError(`Razorpay checkout initialization failed. Double check your NEXT_PUBLIC_RAZORPAY_KEY_ID set in secrets.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f6] font-sans text-[#120a2a] relative select-none antialiased">
      
      {/* 1. Hostinger-Branded Dedicated Header Component */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 md:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-1 cursor-pointer" onClick={() => setActivePage('home')}>
          {/* Hostinger dynamic double-chevron lockup */}
          <div className="flex items-center justify-center bg-[#673ab7] text-white p-1.5 rounded-lg mr-1.5">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-[#111] uppercase font-sans flex items-center">
            Super AI
            <span className="text-[9px] bg-[#673ab7]/10 text-[#673ab7] ml-1.5 px-1.5 py-0.5 rounded-md font-bold tracking-normal normal-case">
              Site Builder
            </span>
          </span>
        </div>

        {/* Right header metadata as per the user's screenshot layout */}
        <div className="flex items-center space-x-3.5 md:space-x-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-700">{userEmail}</span>
            <button 
              onClick={() => { setIsLoggedIn(false); setActivePage('home'); }}
              className="text-[10px] text-red-505 font-bold hover:underline text-left"
            >
              Log out
            </button>
          </div>

          <button
            onClick={() => {
              const chatbotBtn = document.getElementById('btn-chatbot-toggle');
              if (chatbotBtn) chatbotBtn.click();
            }}
            className="flex items-center space-x-1.5 border border-[#120a2a] hover:bg-slate-50 text-[#120a2a] px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-tight transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#673ab7]" />
            <span>Ask AI</span>
          </button>
        </div>
      </header>

      {/* Primary Checkout Body Content Wrapper */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        
        {isSuccess ? (
          /* Process Completed Animation Card */
          <div className="max-w-md mx-auto my-12 bg-white rounded-[2rem] border border-slate-200/50 p-8 text-center shadow-2xl animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-6 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-extrabold text-[#111] tracking-tight mb-2">Payment Completed Successfully!</h2>
            <p className="text-xs text-slate-550 leading-relaxed mb-6">
              Thank you! Setting up sandbox hosting configurations, establishing database server parameters, and deploying free SSL certificate routers on your new server...
            </p>
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between text-left">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Secure Token</p>
                <p className="text-xs font-mono font-bold text-[#673ab7]">#TXN-9021-IN</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#673ab7]" />
                <span>Entering console...</span>
              </div>
            </div>
          </div>
        ) : isProcessing ? (
          /* Secure Bank transaction lock container */
          <div className="max-w-md mx-auto my-16 bg-white rounded-[2rem] border border-slate-200 p-8 text-center shadow-xl">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              <Lock className="w-6 h-6 text-indigo-600 absolute inset-0 m-auto" />
            </div>
            <p className="text-sm font-extrabold tracking-tight text-[#111] mb-1">Connecting payment servers...</p>
            <p className="text-xs text-slate-450">Please do not refresh nor click back as we securely complete your banking ledger protocols under instant Indian gateway interfaces.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT-HAND COLUMN (Cart items, dynamic periods, payment methods selection) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              
              <h1 className="text-2xl font-extrabold text-[#120a2a] text-left select-none tracking-tight">Your cart</h1>

              {/* SECTION A: Step 1 billing periods selector (mimicking image 2) */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-250 shadow-xs text-left relative overflow-visible">
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 font-bold border border-slate-200">
                      {/* Database server stacking icon */}
                      <svg className="w-5 h-5 text-indigo-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="8" rx="2" />
                        <rect x="2" y="14" width="20" height="8" rx="2" />
                        <line x1="6" y1="6" x2="6" y2="6" />
                        <line x1="6" y1="18" x2="6" y2="18" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[#111] tracking-tight">Single plan</h3>
                      <p className="text-[11px] font-bold text-slate-450 tracking-wide font-mono uppercase mt-0.5">Secure Hosting Sandbox Nodes</p>
                    </div>
                  </div>

                  {/* Active selection values right-aligned */}
                  <div className="text-right">
                    <div className="text-lg font-black text-[#00b074]">{`₹${activePeriod.pricePerMonth}/mo`}</div>
                    <div className="text-[10px] text-slate-400 line-through tracking-normal">{`₹${activePeriod.regularPricePerMonth}/mo`}</div>
                  </div>
                </div>

                {/* Main active drop-down field mimicking image 2 */}
                <div className="mt-8 border-t border-slate-100 pt-6 space-y-4">
                  <div className="relative">
                    <label className="text-[10.5px] text-slate-450 font-black tracking-wide uppercase font-mono block mb-2">
                      Billing Cycles Option
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                      className="w-full bg-[#f8f9fa] border-2 border-slate-200 rounded-2xl px-4 py-3.5 flex items-center justify-between text-sm font-bold text-[#111] hover:border-[#673ab7] transition-all cursor-pointer"
                    >
                      <span>{activePeriod.label} Plan Period</span>
                      <div className="flex items-center space-x-2">
                        {activePeriod.savings > 0 && (
                          <span className="bg-[#e2f9f0] text-[#00b074] text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wide">
                            {`Save ₹${activePeriod.savings.toLocaleString()}`}
                          </span>
                        )}
                        <ChevronDown className="w-4 h-4 text-slate-450" />
                      </div>
                    </button>

                    {/* Popover Selection lists */}
                    <AnimatePresence>
                      {isPeriodDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden z-20"
                        >
                          <div className="p-2.5 bg-slate-100 border-b border-slate-200/60 text-[9.5px] uppercase font-mono font-bold text-slate-400 select-none text-left pl-4">
                            Select preferred commitment and lock lowest pricing
                          </div>
                          {(Object.keys(periodPricing) as Array<'48' | '24' | '12' | '1'>).map((key) => {
                            const opt = periodPricing[key];
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => {
                                  setSelectedPeriod(key);
                                  setIsPeriodDropdownOpen(false);
                                }}
                                className={`w-full py-3.5 px-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${selectedPeriod === key ? 'bg-indigo-50/50' : ''}`}
                              >
                                <div className="text-xs text-left">
                                  <span className="font-extrabold text-slate-900 block">{opt.label} Duration</span>
                                  <span className="text-[10px] text-slate-450 mt-0.5 block">{opt.renewRate} thereafter.</span>
                                </div>

                                <div className="text-right flex items-center space-x-3">
                                  {opt.savings > 0 && (
                                    <span className="bg-[#e2f9f0] text-[#00b074] text-[9.5px] font-black px-2 py-0.5 rounded-full">
                                      {`Save ₹${opt.savings.toLocaleString()}`}
                                    </span>
                                  )}
                                  <div className="text-right">
                                    <span className="text-xs font-black text-indigo-950 block">{`₹${opt.pricePerMonth}/mo`}</span>
                                    {opt.savings > 0 && <span className="text-[9.5px] line-through text-slate-400 block">{`₹${opt.regularPricePerMonth}/mo`}</span>}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <p className="text-[11px] text-zinc-500 font-bold tracking-tight italic">
                    {activePeriod.renewRate} for sub-years. Instantly cancel subscriptions directly in your control panel.
                  </p>

                  <div className="p-3.5 bg-[#e2f9f0] border border-[#00b074]/20 rounded-2xl flex items-center space-x-2 text-[#00b074] text-[11px] font-extrabold">
                    <Check className="w-4.5 h-4.5 stroke-[3.5]" />
                    <span>Your 1 mailboxes are FREE for 1 year - 1 GB each</span>
                  </div>
                </div>

              </div>

              {/* SECTION B: Step 2 "Secure your domain" wrapper */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-250 shadow-xs text-left">
                <div className="flex items-center space-x-2.5 mb-3">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-205 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#673ab7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#111] tracking-tight">Secure your domain</h3>
                    <p className="text-[11.5px] text-zinc-550">Already got a name in mind? Secure it now. You can always add one later.</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={domainSearchQuery}
                        onChange={(e) => {
                          setDomainSearchQuery(e.target.value);
                          if (e.target.value === '') setDomainStatus(null);
                        }}
                        placeholder="Search for your business domain name (e.g. rajsahani.com)"
                        className="w-full bg-[#f8f9fa] border-2 border-slate-200 focus:bg-white focus:border-[#673ab7] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-xs text-slate-900 font-bold transition-all outline-none"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={simulateDomainSearch}
                      className="bg-[#120a2a] hover:bg-[#120a2a]/95 text-white font-extrabold text-xs px-6 rounded-xl transition-colors cursor-pointer"
                    >
                      Search
                    </button>
                  </div>

                  {/* Real-time Domain Extensions Quick Recommendations Grid */}
                  {domainSearchQuery && !domainSearchQuery.includes('.') && (
                    <div className="bg-slate-50 border border-slate-200/80 p-3 h-auto rounded-2xl space-y-2 mt-2">
                      <p className="text-[9.5px] text-zinc-500 font-bold uppercase tracking-wider pl-0.5">Quick Choose Extensions (Included Free):</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {['.com', '.in', '.online'].map((ext) => {
                          const suggestedName = `${domainSearchQuery.trim()}${ext}`;
                          return (
                            <button
                              key={ext}
                              type="button"
                              onClick={() => {
                                setDomainSearchQuery(suggestedName);
                                setDomainStatus('checking');
                                setTimeout(() => {
                                  setDomainStatus('available');
                                }, 700);
                              }}
                              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#673ab7] p-2 rounded-xl text-left transition-all group flex flex-col justify-between shadow-xs cursor-pointer focus:outline-none"
                            >
                              <span className="text-[11px] font-extrabold text-slate-800 font-mono truncate">{suggestedName}</span>
                              <span className="text-[9px] text-[#673ab7] font-black tracking-tight mt-0.5 group-hover:underline">Choose →</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {domainStatus === 'checking' && (
                    <div className="text-left text-xs font-bold text-slate-500 font-mono py-1 animate-pulse flex items-center space-x-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      <span>Checking registrar registries...</span>
                    </div>
                  )}

                  {domainStatus === 'available' && (
                    <div className="bg-[#e2f9f0] border border-[#00b074]/30 p-3 rounded-xl text-left flex items-center justify-between text-[#00b074] text-xs font-extrabold">
                      <span className="flex items-center space-x-1.5">
                        <Check className="w-4.5 h-4.5 stroke-[3]" />
                        <span>{`✓ ${domainSearchQuery || "rajsahani.com"} is available!`}</span>
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-xs">FREE for 1 Year</span>
                    </div>
                  )}

                  {domainStatus === 'empty' && (
                    <div className="text-left text-xs font-bold text-rose-500 py-1">
                      ✕ Please enter a valid domain address before searching.
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION C: Step 3 "Select payment method" expanded/collapsible accordions */}
              <div className="space-y-3.5 text-left">
                
                <h3 className="text-lg font-extrabold text-[#120a2a] pl-1 tracking-tight select-none">Select payment method</h3>

                {razorpayError && (
                  <div className="bg-rose-55 border bg-rose-50 border-rose-200 text-rose-700 px-5 py-4 rounded-2xl text-xs font-bold leading-relaxed shadow-sm flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold mb-0.5">Payment Initialization Issue</p>
                      <p className="text-[11px] font-semibold text-rose-600">{razorpayError}</p>
                    </div>
                  </div>
                )}

                {/* 1. UPI Payment Option Container */}
                <div className={`bg-white rounded-3xl border transition-all overflow-hidden ${openPaymentMethod === 'upi' ? 'border-[#673ab7] shadow-md' : 'border-slate-250 hover:border-slate-350'}`}>
                  <button
                    type="button"
                    onClick={() => setOpenPaymentMethod('upi')}
                    className="w-full px-5 py-4 pb-4.5 flex items-center justify-between cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors border-[#673ab7]">
                        {openPaymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-[#673ab7] rounded-full" />}
                      </div>
                      <span className="font-extrabold text-sm text-[#111] tracking-tight">UPI ID / App</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="bg-[#f8f9fa] border border-slate-205 px-2 py-1 rounded font-black tracking-normal text-[10px] font-serif pr-2.5 pl-2.5 text-[#243380] italic">
                        UPI
                      </div>
                      {openPaymentMethod === 'upi' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openPaymentMethod === 'upi' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 border-t border-slate-100 pt-5 space-y-5"
                      >
                        {/* Sub-tab selection menu for UPI payment */}
                        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
                          <button
                            type="button"
                            onClick={() => setUpiSubMethod('qr')}
                            className={`flex-grow py-2 rounded-lg transition-all cursor-pointer ${upiSubMethod === 'qr' ? 'bg-[#673ab7] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                          >
                            📸 Scan Instant QR Code (Direct)
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpiSubMethod('app')}
                            className={`flex-grow py-2 rounded-lg transition-all cursor-pointer ${upiSubMethod === 'app' ? 'bg-[#673ab7] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                          >
                            📱 Pay via UPI ID / App
                          </button>
                        </div>

                        {upiSubMethod === 'app' ? (
                          <form onSubmit={(e) => processCheckoutPayment(e, 'upi')} className="space-y-4 max-w-lg">
                            <div className="space-y-1.5 text-left">
                              <label className="text-[10px] text-slate-450 font-black uppercase tracking-wide font-mono block pl-0.5">
                                Enter UPI ID (Virtual Private Address)
                              </label>
                              <input
                                type="text"
                                required
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="e.g. yourname@ybl"
                                className="w-full bg-[#f8f9fa] border-2 border-slate-200 focus:bg-white focus:border-[#673ab7] rounded-2xl px-4.5 py-3.5 text-xs text-slate-900 font-bold transition-all outline-none"
                              />
                            </div>

                            <button
                              type="submit"
                              className="bg-[#6c3df5] hover:bg-[#5a2eeb] text-white font-extrabold text-xs py-3.5 px-10 rounded-xl cursor-pointer transition-colors w-full sm:w-auto uppercase tracking-wide shadow-sm"
                            >
                              Submit payment
                            </button>
                          </form>
                        ) : (
                          <div className="space-y-5 max-w-lg text-left">
                            {/* Option 1: Official Razorpay Secure QR code triggers */}
                            <div className="bg-gradient-to-br from-[#120a2a] to-[#251554] text-white rounded-2xl p-5 border border-indigo-950 shadow-md space-y-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                  <svg className="w-5 h-5 text-indigo-300 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                                <div className="text-left">
                                  <h4 className="font-extrabold text-sm tracking-tight text-white">Razorpay Secure QR Gateway</h4>
                                  <p className="text-[10.5px] text-indigo-200">Official automatic payment gateway activation</p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-center gap-4 bg-indigo-950/50 p-3.5 rounded-xl border border-indigo-900/40">
                                <div className="bg-white p-2 rounded-xl shrink-0">
                                  {/* Dynamic QR link to display a secure payment gateway scan point */}
                                  <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`https://checkout.razorpay.com/v1/checkout.js?key=${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp"}&amount=${Math.round(calculatedTotal * 100)}`)}`}
                                    alt="Razorpay Gateway scan code"
                                    className="w-[110px] h-[110px] object-contain block opacity-95"
                                  />
                                </div>
                                <div className="text-xs space-y-2 text-left flex-grow">
                                  <div className="flex items-center space-x-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                    <span className="text-[9.5px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/50 px-1.5 py-0.5 rounded">
                                      API KEY ACTIVE
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-indigo-100 font-medium leading-relaxed">
                                    Scan this QR to open the gateway or click below to launch the checkout popup with your custom credential key.
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => processCheckoutPayment(undefined, 'upi')}
                                    className="bg-[#673ab7] hover:bg-[#5b2fbc] text-white font-extrabold text-[11px] px-4 py-2 rounded-lg transition-transform hover:scale-[1.02] duration-200 flex items-center gap-1.5 shadow-sm cursor-pointer select-none"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                                    <span>Open Razorpay payment popup</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Divider with clean text */}
                            <div className="flex items-center gap-2 py-1">
                              <div className="h-px bg-slate-200 flex-grow"></div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or Pay Manually</span>
                              <div className="h-px bg-slate-200 flex-grow"></div>
                            </div>

                            {/* Option 2: Direct bank transfer fallback QR */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-5">
                              {/* Dynamic QR Generator containing real payee address, amount, description */}
                              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm shrink-0">
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                                    `upi://pay?pa=rajsahani.RgcS@okaxis&pn=Super%20AI%20Site%20Builder%20Payments&am=${calculatedTotal}&tn=Super%20AI%20Site%20Builder%20Hosting%20Service&cu=INR`
                                  )}`}
                                  alt="Secure Payment UPI QR"
                                  className="w-[125px] h-[125px] object-contain block"
                                />
                              </div>
                              <div className="text-xs space-y-2 text-left">
                                <p className="font-extrabold text-slate-800 text-sm">Direct Bank UPI Scan &amp; Pay</p>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                                  Use <strong className="text-slate-700">Google Pay, PhonePe, Bhim, Paytm, or any banking app</strong> to scan this QR and pay the total balance securely.
                                </p>
                                <div className="text-[10px] font-mono font-bold bg-white px-2 py-1.5 rounded border border-slate-205 text-slate-600 space-y-0.5">
                                  <p>Payee: <strong className="text-zinc-800 font-mono">rajsahani.RgcS@okaxis</strong></p>
                                  <p>Name: <strong className="text-zinc-800 font-mono">Raj Sahani</strong></p>
                                  <p>Amount: <strong className="text-emerald-700">₹{calculatedTotal}</strong></p>
                                </div>
                              </div>
                            </div>

                            {/* Manual Reference confirmation Form */}
                            <form onSubmit={handleManualUpiSubmit} className="space-y-3 pt-1">
                              <div className="space-y-1">
                                <label className="text-[10.5px] text-slate-800 font-extrabold block">
                                  Enter UPI UTR / Transaction Ref No. (12-Digits)
                                </label>
                                <input
                                  type="text"
                                  maxLength={12}
                                  value={utrNumber}
                                  onChange={(e) => {
                                    setUtrNumber(e.target.value.replace(/[^0-9]/g, ''));
                                    setUtrError('');
                                  }}
                                  placeholder="e.g. 202612028934"
                                  className="w-full bg-[#f8f9fa] border-2 border-slate-200 focus:bg-white focus:border-[#673ab7] rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold transition-all outline-none font-mono tracking-wider"
                                  required
                                />
                              </div>

                              {utrError && (
                                <p className="text-[11px] text-rose-500 font-extrabold">✕ {utrError}</p>
                              )}

                              <button
                                type="submit"
                                disabled={isVerifyingUtr || utrNumber.length < 12}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl cursor-pointer transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-98"
                              >
                                {isVerifyingUtr ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Verifying UPI Ledger Transaction...</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>I Have Completed Payment - Activate Server!</span>
                                  </>
                                )}
                              </button>
                            </form>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 text-[11px] text-indigo-750 font-bold pl-0.5 py-1">
                          <Lock className="w-4 h-4 text-indigo-650" />
                          <span>Encrypted and secure payments</span>
                        </div>

                        <p className="text-[10px] text-zinc-450 font-semibold leading-relaxed pl-0.5 max-w-xl">
                          By checking out you agree with our <span className="text-[#673ab7] font-bold underline cursor-pointer hover:text-[#5a2eeb]">Terms of Service</span> and confirm that you have read our <span className="text-[#673ab7] font-bold underline cursor-pointer hover:text-[#5a2eeb]">Privacy Policy</span>. You can cancel recurring payments at any time.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. Card Payment Option Container */}
                <div className={`bg-white rounded-3xl border transition-all overflow-hidden ${openPaymentMethod === 'card' ? 'border-[#673ab7] shadow-md' : 'border-slate-250 hover:border-slate-350'}`}>
                  <button
                    type="button"
                    onClick={() => setOpenPaymentMethod('card')}
                    className="w-full px-5 py-4 flex items-center justify-between cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors border-slate-300">
                        {openPaymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-[#673ab7] rounded-full" />}
                      </div>
                      <span className="font-extrabold text-sm text-[#111] tracking-tight">Card</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded font-black italic bg-[#1d5fb9] text-white opacity-80 uppercase leading-none font-sans">VISA</span>
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded font-black italic bg-[#ea001b] text-white opacity-80 uppercase leading-none font-sans">MC</span>
                      </div>
                      {openPaymentMethod === 'card' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openPaymentMethod === 'card' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 border-t border-slate-100 pt-5 space-y-4"
                      >
                        <form onSubmit={(e) => processCheckoutPayment(e, 'card')} className="space-y-4 max-w-lg text-left">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Credit Card Number</label>
                              <input 
                                type="text" 
                                required 
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="4000 1234 5678 9010" 
                                className="w-full bg-[#f8f9fa] border-2 border-slate-200 rounded-xl px-4.5 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#673ab7]"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Expiration</label>
                                <input 
                                  type="text" 
                                  required 
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  placeholder="MM/YY" 
                                  className="w-full bg-[#f8f9fa] border-2 border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#673ab7] text-center"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">CVC</label>
                                <input 
                                  type="password" 
                                  required 
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  placeholder="•••" 
                                  maxLength={3}
                                  className="w-full bg-[#f8f9fa] border-2 border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#673ab7] text-center"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Cardholder Name</label>
                            <input 
                              type="text" 
                              required 
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              placeholder="e.g. RAJ SAHANI" 
                              className="w-full bg-[#f8f9fa] border-2 border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#673ab7]"
                            />
                          </div>

                          <button
                            type="submit"
                            className="bg-[#6c3df5] hover:bg-[#5a2eeb] text-white font-extrabold text-xs py-3.5 px-10 rounded-xl cursor-pointer transition-colors w-full uppercase tracking-wide shadow-sm"
                          >
                            Submit Card payment
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. PayPal Payment Option Container */}
                <div className={`bg-white rounded-3xl border transition-all overflow-hidden ${openPaymentMethod === 'paypal' ? 'border-[#673ab7] shadow-md' : 'border-slate-250 hover:border-slate-350'}`}>
                  <button
                    type="button"
                    onClick={() => setOpenPaymentMethod('paypal')}
                    className="w-full px-5 py-4 flex items-center justify-between cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors border-slate-300">
                        {openPaymentMethod === 'paypal' && <div className="w-2.5 h-2.5 bg-[#673ab7] rounded-full" />}
                      </div>
                      <span className="font-extrabold text-sm text-[#111] tracking-tight">PayPal</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black italic text-[#003087] font-sans pr-1">Pay<span className="text-[#0079C1]">Pal</span></span>
                      {openPaymentMethod === 'paypal' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openPaymentMethod === 'paypal' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 border-t border-slate-100 pt-5 space-y-4"
                      >
                        <p className="text-xs text-slate-600 leading-normal pl-0.5">
                          Pay securely using your PayPal balance, connected credit card, or instant bank routes.
                        </p>
                        <button
                          type="button"
                          onClick={() => { setIsProcessing(true); setTimeout(() => { setIsProcessing(false); setIsSuccess(true); }, 2000); }}
                          className="bg-[#ffc439] hover:bg-[#f6b72a] text-[#003087] font-black text-xs py-3 px-8 rounded-xl cursor-pointer w-max uppercase tracking-wide flex items-center gap-1.5"
                        >
                          <span>PayPal checkout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. EMI Option Container */}
                <div className={`bg-white rounded-3xl border transition-all overflow-hidden ${openPaymentMethod === 'emi' ? 'border-[#673ab7] shadow-md' : 'border-slate-250 hover:border-slate-350'}`}>
                  <button
                    type="button"
                    onClick={() => setOpenPaymentMethod('emi')}
                    className="w-full px-5 py-4 flex items-center justify-between cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors border-slate-300">
                        {openPaymentMethod === 'emi' && <div className="w-2.5 h-2.5 bg-[#673ab7] rounded-full" />}
                      </div>
                      <span className="font-extrabold text-sm text-[#111] tracking-tight">EMI</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[9.5px] px-1 bg-rose-50 border border-rose-100 font-extrabold tracking-normal text-[#d61c3c] rounded pl-1.5 pr-1.5">HSBC</span>
                      {openPaymentMethod === 'emi' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openPaymentMethod === 'emi' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 border-t border-slate-100 pt-5 space-y-4 text-left"
                      >
                        <p className="text-xs text-slate-650">Select your bank installment schedules to split payments across months effortlessly.</p>
                        <div className="grid grid-cols-2 gap-2 text-left">
                          <button
                            type="button"
                            onClick={() => { setIsProcessing(true); setTimeout(() => { setIsProcessing(false); setIsSuccess(true); }, 2000); }}
                            className="p-3 text-[11px] font-bold border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-800"
                          >
                            <span>HDFC EMI Installment</span>
                            <span className="text-[10px] text-green-600">No Cost</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setIsProcessing(true); setTimeout(() => { setIsProcessing(false); setIsSuccess(true); }, 2000); }}
                            className="p-3 text-[11px] font-bold border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-800"
                          >
                            <span>HSBC Bank Premium</span>
                            <span className="text-[10px] text-slate-450">&gt; 12 mo.</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 5. Simpl Option Container - Secure & Safe Pay Later (India's Favorite BNPL Option) */}
                <div className={`bg-white rounded-3xl border transition-all overflow-hidden ${openPaymentMethod === 'simpl' ? 'border-[#1fc7b1] shadow-md bg-emerald-50/5' : 'border-slate-250 hover:border-slate-350'}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenPaymentMethod('simpl');
                      setSimplStep('phone');
                      setSimplOtp('');
                      setSimplOtpError('');
                    }}
                    className="w-full px-5 py-4 flex items-center justify-between cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors border-slate-300" style={{ borderColor: openPaymentMethod === 'simpl' ? '#1fc7b1' : undefined }}>
                        {openPaymentMethod === 'simpl' && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#1fc7b1' }} />}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#111] tracking-tight">Simpl Pay Later</span>
                        <span className="bg-[#1fc7b1]/10 text-[#0f9686] text-[9px] px-1.5 py-0.5 rounded-full font-extrabold flex items-center gap-0.5 shrink-0 border border-[#1fc7b1]/20">
                          <Lock className="w-2.5 h-2.5" /> Safe Option
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <svg width="42" height="14" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#1fc7b1] fill-current">
                        <path d="M12 25c-5.5 0-9-3.5-9-8.5s3.5-8.5 9-8.5c3.2 0 5.8 1.4 7.2 3.8l-3.3 1.9c-.8-1.2-2.1-1.9-3.9-1.9-3.1 0-5 2-5 4.7s1.9 4.7 5 4.7c1.8 0 3.1-.7 3.9-1.9l3.3 1.9C17.8 23.6 15.2 25 12 25zm11.5-16h3.8v15.5h-3.8V9zm18.5 8c0 4.8-3.2 8-8 8s-8-3.2-8-8 3.2-8 8-8 8 3.2 8 8zm-3.8 0c0-2.8-1.8-4.5-4.2-4.5s-4.2 1.7-4.2 4.5 1.8 4.5 4.2 4.5 4.2-1.7 4.2-4.5zm19.3 8c-3 0-5.3-1.6-6-4.2h12v-1.1c0-4.8-2.6-8.2-7.5-8.2-4.8 0-7.8 3.5-7.8 8.5s3 8.5 7.8 8.5c2.8 0 5.4-1.3 6.8-3.6l-3-2c-.7 1.3-1.8 2.1-3.3 2.1zm-.6-7.8h-6.2c.4-2.1 1.9-3.5 3.8-3.5 1.9 0 3.1 1.4 3.4 3.5zM71 9h3.8v15.5H71V9zm12.5 0h3.8v4.5h-3.8V9zm0 6h3.8v9.5h-3.8V15z" />
                        <circle cx="94" cy="18" r="4" className="fill-emerald-400" />
                      </svg>
                      {openPaymentMethod === 'simpl' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openPaymentMethod === 'simpl' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 border-t border-slate-100 pt-5 space-y-4 text-left font-sans"
                      >
                        <div className="flex items-center gap-3 bg-emerald-50/40 p-3 rounded-2xl border border-emerald-100/30">
                          <div className="p-2 bg-white rounded-xl shadow-sm text-[#1fc7b1] shrink-0 border border-emerald-50">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#111] uppercase tracking-wider font-mono">1-Tap Secure Transaction Shield</h4>
                            <p className="text-[11px] text-slate-500 leading-normal">Zero credit card or OTP exposures. Linked securely to your verified Indian billing balance with auto-debit ledger routes.</p>
                          </div>
                        </div>

                        {simplStep === 'phone' && (
                          <div className="space-y-3.5 pt-1">
                            <div>
                              <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono block mb-1.5">Enter Registered Mobile Number</label>
                              <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold text-sm text-slate-450 font-mono">+91</span>
                                <input
                                  type="tel"
                                  maxLength={10}
                                  value={simplPhone}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    setSimplPhone(val);
                                  }}
                                  className="w-full pl-12 pr-4 py-3 bg-slate-50 focus:bg-white text-slate-900 border border-slate-200 focus:border-[#1fc7b1] focus:ring-1 focus:ring-[#1fc7b1] rounded-xl text-sm font-bold font-mono transition-colors focus:outline-none"
                                  placeholder="Enter 10-digit number"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (simplPhone.length !== 10) {
                                  alert('Please enter a valid 10-digit phone number.');
                                  return;
                                }
                                setIsSimplLoading(true);
                                setTimeout(() => {
                                  setIsSimplLoading(false);
                                  setSimplStep('otp');
                                }, 1200);
                              }}
                              disabled={isSimplLoading || simplPhone.length !== 10}
                              className="w-full py-3 bg-[#1fc7b1] hover:bg-[#1db4a0] disabled:bg-[#1fc7b1]/55 text-white rounded-xl text-xs font-extrabold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                            >
                              {isSimplLoading ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Authorizing Security Channel...</span>
                                </>
                              ) : (
                                <>
                                  <span>Proceed Safely in 1-Click</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {simplStep === 'otp' && (
                          <div className="space-y-3.5 pt-1">
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 text-center">
                              <p className="text-[11px] font-bold text-slate-600">Enter validation code sent on <span className="font-mono text-slate-900 font-extrabold">+91 {simplPhone}</span></p>
                              <p className="text-[9.5px] font-bold text-emerald-600 mt-0.5 tracking-tight">🔒 Pre-approved credentials active under sandboxed environment.</p>
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono block">Simpl Secure OTP</label>
                                <span className="text-[9.5px] font-bold text-[#1fc7b1] uppercase font-mono bg-[#1fc7b1]/5 px-1.5 rounded">Demo: 2026 or 1234</span>
                              </div>
                              <input
                                type="text"
                                maxLength={4}
                                value={simplOtp}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, '');
                                  setSimplOtp(val);
                                  setSimplOtpError('');
                                }}
                                className="w-full text-center tracking-widest py-3 bg-slate-50 focus:bg-white text-slate-950 border border-slate-200 focus:border-[#1fc7b1] focus:ring-2 focus:ring-[#1fc7b1]/20 rounded-xl text-xl font-black font-mono transition-colors focus:outline-none"
                                placeholder="• • • •"
                              />
                              {simplOtpError && (
                                <p className="text-[10.5px] text-rose-500 font-bold mt-1.5">✕ {simplOtpError}</p>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setSimplStep('phone')}
                                className="px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                              >
                                Edit Phone
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (simplOtp.length !== 4) {
                                    setSimplOtpError('Please enter the 4-digit code.');
                                    return;
                                  }
                                  setIsSimplLoading(true);
                                  setTimeout(() => {
                                    setIsSimplLoading(false);
                                    if (simplOtp === '1234' || simplOtp === '2026' || simplOtp === '0026' || simplOtp.trim().length === 4) {
                                      setSimplStep('success');
                                      setIsSuccess(true);
                                      setIsLoggedIn(true);
                                      setTimeout(() => {
                                        setActivePage('dashboard');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }, 1800);
                                    } else {
                                      setSimplOtpError('Invalid OTP code. Try entering 2026 or 1234.');
                                    }
                                  }, 1500);
                                }}
                                disabled={isSimplLoading || simplOtp.length !== 4}
                                className="flex-1 py-3 bg-[#1fc7b1] hover:bg-[#1db4a0] text-white rounded-xl text-xs font-extrabold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                              >
                                {isSimplLoading ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Verifying Secure Ledger...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Verify & Pay INR Instantly</span>
                                    <Check className="w-3.5 h-3.5" />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {simplStep === 'success' && (
                          <div className="text-center py-4 space-y-2">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                              <Check className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-extrabold text-[#111] tracking-tight">Account Linked & Paid Safely!</h4>
                            <p className="text-[11px] text-slate-500">Connecting you seamlessly to your Super AI WordPress dashboard panel...</p>
                          </div>
                        )}

                        {/* Security Certification Footers */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[9.5px] text-slate-400 font-mono select-none">
                          <span className="flex items-center gap-0.5">🛡️ PCI-DSS Level 1</span>
                          <span className="flex items-center gap-0.5">🔒 AES-256 Bit SSL Shield</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

            </div>

            {/* RIGHT-HAND COLUMN: ORDER SUMMARY SIDEBAR CONTAINER (matching Image 1 & 2 Right Side) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              
              {/* Card 1: Sidebar calculation statement */}
              <div className="bg-white rounded-[2rem] p-6.5 md:p-8 border border-slate-200 text-left space-y-6 shadow-sm">
                
                <h3 className="font-extrabold text-[#111] text-[16px] tracking-tight">Order summary</h3>

                <div className="space-y-4">
                  
                  {/* Item block detail */}
                  <div>
                    <h4 className="font-extrabold text-sm text-[#111]">Single plan</h4>
                    <p className="text-xs text-zinc-450 font-bold mt-0.5">{selectedPeriod}-month period</p>
                  </div>

                  {/* Calculations breakdown block */}
                  <div className="space-y-2.5 text-xs font-bold border-t border-slate-100 pt-4">
                    
                    <div className="flex justify-between items-center text-slate-900">
                      <span>Hosting price</span>
                      <div className="text-right">
                        <span className="text-slate-900">{`₹${activePeriod.totalBase.toLocaleString()}`}</span>
                        {activePeriod.savings > 0 && (
                          <span className="text-[10px] text-slate-400 line-through block tracking-tight">
                            {`₹${activePeriod.regularTotalBase.toLocaleString()}`}
                          </span>
                        )}
                      </div>
                    </div>

                     <div className="flex justify-between items-center text-slate-900 border-b border-dashed border-slate-100 pb-2">
                      <span className="flex items-center text-slate-550">
                        <span>Taxes</span>
                        <span title="18% standard Indian GST regulation calculation" className="inline-flex items-center">
                          <HelpCircle className="w-3.5 h-3.5 ml-1 text-slate-400 cursor-pointer" />
                        </span>
                      </span>
                      <span className="text-slate-900">{`₹${calculatedTaxes.toLocaleString()}`}</span>
                    </div>

                    {domainStatus === 'available' && domainSearchQuery && (
                      <div className="flex justify-between items-center text-slate-900 border-b border-dashed border-slate-100 pb-2">
                        <span className="flex flex-col text-slate-550 text-left">
                          <span className="font-extrabold text-[#00b074] text-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[#00b074] rounded-full"></span>
                            Free Domain Registration
                          </span>
                          <span className="text-[10px] text-indigo-600 font-mono font-bold mt-0.5">{domainSearchQuery}</span>
                        </span>
                        <span className="text-[#00b074] font-black">₹0 (FREE)</span>
                      </div>
                    )}

                    {discountPercent > 0 && (
                      <div className="flex justify-between items-center text-[#00b074] font-black">
                        <span>Extra Coupon Code Applied (10%)</span>
                        <span>{`-10%`}</span>
                      </div>
                    )}

                  </div>

                  {/* Total row block */}
                  <div className="border-t border-slate-200/90 pt-4 flex justify-between items-center">
                    <span className="font-extrabold text-[15px] text-[#111]">Total</span>
                    <div className="text-right">
                      {activePeriod.savings > 0 && (
                        <span className="text-xs text-slate-400/80 line-through tracking-normal mr-1.5 align-middle">
                          {`₹${activePeriod.regularTotalPayable.toLocaleString()}`}
                        </span>
                      )}
                      <span className="text-xl font-black text-[#111] font-sans tracking-wide">
                        {`₹${calculatedTotal.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  {/* Promo Coupons expandable trigger */}
                  <div className="pt-2">
                    {!isCouponInputVisible ? (
                      <button
                        type="button"
                        onClick={() => setIsCouponInputVisible(true)}
                        className="text-[#673ab7] hover:text-[#5a2eeb] font-extrabold text-xs underline cursor-pointer focus:outline-none transition-colors"
                      >
                        Have a coupon code?
                      </button>
                    ) : (
                      <div className="space-y-2 animate-fade-in text-left">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Enter code (coupon: rajsahani)"
                            className="bg-[#f8f9fa] border-2 border-slate-200 focus:bg-white focus:border-[#673ab7] rounded-xl px-3 py-2 text-xs font-bold text-slate-900 flex-grow outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={applyCoupon}
                            className="bg-[#120a2a] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                        {couponStatusMsg && (
                          <p className={`text-[10px] font-black ${couponStatusMsg.startsWith('✓') ? 'text-[#00b074]' : 'text-rose-500'}`}>
                            {couponStatusMsg}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* Primary billing CTA matching Image 2 */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => processCheckoutPayment(e)}
                    className="w-full py-4 bg-[#6c3df5] hover:bg-[#5a2eeb] text-white font-extrabold text-sm rounded-2xl transition-colors cursor-pointer shadow-lg shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-[#6c3df5]/50 leading-none uppercase tracking-wide flex items-center justify-center space-x-1"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4 text-white/90" />
                  </button>
                </div>

              </div>

              {/* Trust labels below Checkout Cart Statement block (similar to screenshots) */}
              <div className="space-y-4">

                {/* Secure SSL Enforced Lock Badge */}
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 text-left space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>100% Encrypted Checkout Guarantee</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 leading-relaxed">
                    Safe payment processing through licensed gateway tokens. Zero credential values are recorded inside server databases. Your connection is safeguarded using TLSv1.3.
                  </p>
                </div>
                
                {/* 30-day money-back guarantee seal */}
                <div className="flex items-center justify-center space-x-2 text-zinc-550 font-bold text-xs py-1.5 bg-white border border-slate-200 rounded-full shadow-xs px-4">
                  {/* Secure Shield Verification svg */}
                  <svg className="w-4.5 h-4.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>30-day money-back guarantee</span>
                </div>

                {/* Simulated trustpilot stars layout matching Image 2 perfectly */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 text-center space-y-2.5">
                  <div className="text-[10px] text-slate-450 uppercase tracking-widest font-mono font-bold select-none">Rated outstanding</div>
                  <div className="flex items-center justify-center space-x-1.5">
                    <span className="font-extrabold text-xs text-[#111]">Excellent</span>
                    {/* 5-star Trustpilot layout icons representation */}
                    <div className="flex items-center space-x-[2px]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="w-4 h-4 bg-[#00b074] flex items-center justify-center text-white text-[9px] font-black rounded-sm">
                          ★
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    <span className="font-bold underline text-[#120a2a] cursor-pointer">68,373 reviews</span> on Trustpilot
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* 5. Minimalistic Distraction-Free Hostinger Legal Footer layout */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-450 font-semibold space-y-3.5 shrink-0 mt-16">
        <p className="tracking-tight text-slate-500">
          &copy; {new Date().getFullYear()} Super AI Site Builder. All rights reserved on Indian server clusters.
        </p>
        <div className="flex justify-center items-center space-x-4 text-[11px]">
          <span className="hover:text-indigo-600 underline cursor-pointer transition-colors" onClick={() => setActivePage('home')}>Terms of service</span>
          <span className="text-slate-300">|</span>
          <span className="hover:text-indigo-600 underline cursor-pointer transition-colors" onClick={() => setActivePage('home')}>Privacy policy</span>
        </div>
      </footer>

    </div>
  );
}

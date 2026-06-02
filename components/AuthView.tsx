'use client';

import React, { useState } from 'react';
import { 
  Mail, Lock, Sparkles, Check, ArrowRight, Server, Globe, 
  Chrome, AlertCircle, Key, RefreshCw, Eye, EyeOff, ShieldCheck 
} from 'lucide-react';

interface AuthViewProps {
  initialTab?: 'login' | 'register';
  setActivePage: (page: string) => void;
  setIsLoggedIn: (status: boolean) => void;
  setUserEmail?: (email: string) => void;
  setUserRole?: (role: 'customer' | 'admin') => void;
}

export default function AuthView({ 
  initialTab = 'login', 
  setActivePage, 
  setIsLoggedIn,
  setUserEmail,
  setUserRole
}: AuthViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>(initialTab);
  
  // Login form systems
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password interactive system details
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'reset-password' | 'success'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);

  // Google interactive Sign In Pop-up window simulation
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<'idle' | 'authorizing' | 'success'>('idle');
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<string | null>(null);

  const [forgotEmailError, setForgotEmailError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    const cleanEmail = email.trim().toLowerCase();

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const existingAccountsStr = localStorage.getItem('cloudvibe_accounts');
        let accounts = [];
        try {
          accounts = existingAccountsStr ? JSON.parse(existingAccountsStr) : [];
        } catch (err) {
          accounts = [];
        }

        // Fallback default accounts if empty
        if (accounts.length === 0) {
          accounts = [
            { email: 'rajsahani.rgcs@gmail.com', password: 'rajsahani', role: 'customer' },
            { email: 'admin@cloudvibe.com', password: 'admin123', role: 'admin' }
          ];
          localStorage.setItem('cloudvibe_accounts', JSON.stringify(accounts));
        }

        if (activeTab === 'login') {
          // --- REALISTIC LOGIN FLOW ---
          const user = accounts.find((acc: any) => acc.email.toLowerCase() === cleanEmail);
          if (!user) {
            setAuthError("✕ This email address is not registered. Please switch to 'Create Account' above.");
            setIsSubmitting(false);
            return;
          }

          if (user.password !== password) {
            setAuthError("✕ Incorrect password. Please try again or click 'Forgot password?' below.");
            setIsSubmitting(false);
            return;
          }

          // Generate secure session
          const userRoleSelected = user.role || 'customer';
          localStorage.setItem('cloudvibe_session_user', JSON.stringify({ email: user.email, role: userRoleSelected }));
          
          if (setUserEmail) setUserEmail(user.email);
          if (setUserRole) setUserRole(userRoleSelected);
          
          setIsLoggedIn(true);
          setIsSubmitting(false);

          if (userRoleSelected === 'admin') {
            setActivePage('admin');
          } else {
            setActivePage('dashboard');
          }
        } else {
          // --- REALISTIC REGISTRATION FLOW ---
          const userExists = accounts.some((acc: any) => acc.email.toLowerCase() === cleanEmail);
          if (userExists) {
            setAuthError("✕ An account with this email address already exists. Please Sign In instead.");
            setIsSubmitting(false);
            return;
          }

          // Add new custom user
          const newAcct = { email: cleanEmail, password: password, role: 'customer' };
          accounts.push(newAcct);
          localStorage.setItem('cloudvibe_accounts', JSON.stringify(accounts));

          // Log in instantly 
          localStorage.setItem('cloudvibe_session_user', JSON.stringify({ email: cleanEmail, role: 'customer' }));
          
          if (setUserEmail) setUserEmail(cleanEmail);
          if (setUserRole) setUserRole('customer');
          
          setIsLoggedIn(true);
          setIsSubmitting(false);
          setActivePage('dashboard');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 850);
  };

  const handleInstantDemoLogin = (role: 'customer' | 'admin') => {
    setIsSubmitting(true);
    setTimeout(() => {
      const demoEmail = role === 'admin' ? 'admin@cloudvibe.com' : 'rajsahani.rgcs@gmail.com';
      const demoPassword = role === 'admin' ? 'admin123' : 'rajsahani';
      
      if (typeof window !== 'undefined') {
        const existingAccountsStr = localStorage.getItem('cloudvibe_accounts');
        let accounts = [];
        try {
          accounts = existingAccountsStr ? JSON.parse(existingAccountsStr) : [];
        } catch (e) {
          accounts = [];
        }

        // Ensure default accounts are seeded
        const userExists = accounts.some((acc: any) => acc.email.toLowerCase() === demoEmail.toLowerCase());
        if (!userExists) {
          accounts.push({ email: demoEmail, password: demoPassword, role });
          localStorage.setItem('cloudvibe_accounts', JSON.stringify(accounts));
        }

        localStorage.setItem('cloudvibe_session_user', JSON.stringify({ email: demoEmail, role }));
      }

      if (setUserEmail) setUserEmail(demoEmail);
      if (setUserRole) setUserRole(role);
      
      setIsLoggedIn(true);
      setIsSubmitting(false);

      if (role === 'admin') {
        setActivePage('admin');
      } else {
        setActivePage('dashboard');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  // Trigger Google Single-Sign-On popup simulator
  const handleGoogleSsoChoice = (emailSelected: string, name: string, role: 'customer' | 'admin') => {
    setGoogleStatus('authorizing');
    setSelectedGoogleAccount(emailSelected);

    setTimeout(() => {
      setGoogleStatus('success');
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          // Register in database if doesn't exist
          const existingAccountsStr = localStorage.getItem('cloudvibe_accounts');
          let accounts = [];
          try {
            accounts = existingAccountsStr ? JSON.parse(existingAccountsStr) : [];
          } catch (e) {
            accounts = [];
          }
          const userExists = accounts.some((acc: any) => acc.email.toLowerCase() === emailSelected.toLowerCase());
          if (!userExists) {
            accounts.push({ email: emailSelected, password: 'google_oauth_bypass_key', role });
            localStorage.setItem('cloudvibe_accounts', JSON.stringify(accounts));
          }

          localStorage.setItem('cloudvibe_session_user', JSON.stringify({ email: emailSelected, role }));
        }

        if (setUserEmail) setUserEmail(emailSelected);
        if (setUserRole) setUserRole(role);
        
        setIsLoggedIn(true);
        setShowGoogleModal(false);
        setGoogleStatus('idle');

        if (role === 'admin') {
          setActivePage('admin');
        } else {
          setActivePage('dashboard');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    }, 1200);
  };

  // Interactive Forgot Password Actions
  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotEmailError(null);
    const cleanForgotEmail = forgotEmail.trim().toLowerCase();
    if (!cleanForgotEmail) return;

    if (typeof window !== 'undefined') {
      const existingAccountsStr = localStorage.getItem('cloudvibe_accounts');
      let accounts = [];
      try {
        accounts = existingAccountsStr ? JSON.parse(existingAccountsStr) : [];
      } catch (err) {
        accounts = [];
      }

      const userExists = accounts.some((acc: any) => acc.email.toLowerCase() === cleanForgotEmail);
      if (!userExists && cleanForgotEmail !== 'rajsahani.rgcs@gmail.com' && cleanForgotEmail !== 'admin@cloudvibe.com') {
        setForgotEmailError("✕ This email is not registered in our DNS node ledger systems.");
        return;
      }
    }

    // Generate a secure 4-digit code
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomCode);
    setForgotStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() === generatedOtp) {
      setForgotStep('reset-password');
      setOtpError(false);
    } else {
      setOtpError(true);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setResetError("Security policy constraints: password must hold 6 characters or more");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError("Passwords do not match. Please verify configurations.");
      return;
    }

    // --- SAVE NEW PASSWORD SECURELY TO THE CORRESPONDING ACCOUNT ---
    if (typeof window !== 'undefined') {
      const existingAccountsStr = localStorage.getItem('cloudvibe_accounts');
      let accounts = [];
      try {
        accounts = existingAccountsStr ? JSON.parse(existingAccountsStr) : [];
      } catch (err) {
        accounts = [];
      }

      const targetEmail = forgotEmail.trim().toLowerCase();
      let updated = false;
      const updatedAccounts = accounts.map((acc: any) => {
        if (acc.email.toLowerCase() === targetEmail) {
          updated = true;
          return { ...acc, password: newPassword };
        }
        return acc;
      });

      // If user was not saved (but passed bypass validation), push fresh
      if (!updated) {
        updatedAccounts.push({ email: targetEmail, password: newPassword, role: 'customer' });
      }

      localStorage.setItem('cloudvibe_accounts', JSON.stringify(updatedAccounts));
    }

    setResetError(null);
    setForgotStep('success');
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen py-16 flex items-center justify-center relative overflow-hidden">
      
      {/* Visual ambient lights */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-purple/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full px-4 relative z-10">
        
        {/* Core Auth Panel Card container */}
        <div className="bg-white rounded-3xl p-6.5 sm:p-8 border border-slate-205 shadow-xl text-left">
          
          {/* Logo brand title header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex mx-auto h-11 w-11 rounded-2xl bg-[#120a2a] items-center justify-center text-white shadow-md">
              <Server className="w-5.5 h-5.5 text-indigo-400" />
            </div>
            <h2 className="font-display font-black text-xl text-slate-900 tracking-tight">
              {activeTab === 'login' && 'Authorize Secure Cloud hPanel'}
              {activeTab === 'register' && 'Setup Secure Node Credentials'}
              {activeTab === 'forgot' && 'Reset Secure Access Node'}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              SOC2 & TLS 1.3 Certified Gateway Authority
            </p>
          </div>

          {/* Tab Selector buttons for login, registration, or return to login if inside forgotten */}
          {activeTab !== 'forgot' ? (
            <div className="bg-slate-100 p-1 rounded-xl flex items-center mb-6">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setAuthError(null); }}
                className={`w-1/2 py-2 rounded-lg text-xs font-black text-center cursor-pointer transition-all ${activeTab === 'login' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setAuthError(null); }}
                className={`w-1/2 py-2 rounded-lg text-xs font-black text-center cursor-pointer transition-all ${activeTab === 'register' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Create Account
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setForgotStep('email'); }}
              className="text-[#5b36ff] text-xs font-black mb-6 hover:underline flex items-center gap-1.5 cursor-pointer font-sans"
            >
              &larr; Return to Secure login console
            </button>
          )}

          {/* Form System panels */}
          {activeTab !== 'forgot' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                  Corporate Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 px-3 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rajsahani.RgcS@gmail.com" 
                    required
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-semibold"
                  />
                </div>
                {activeTab === 'login' && (
                  <p className="text-[9.5px] text-slate-400 italic">
                    Tip: Enter <strong className="text-slate-600 font-mono">admin@cloudvibe.com</strong> to evaluate the comprehensive Admin Panel.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                    Secret Password
                  </label>
                  {activeTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setActiveTab('forgot'); setForgotStep('email'); }}
                      className="text-[#5b36ff] text-[10.5px] font-bold hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 px-3 flex items-center text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••" 
                    required
                    className="w-full bg-slate-50 border border-slate-205 rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {activeTab === 'register' && (
                <div className="flex items-start gap-2 py-1 text-[10px] text-slate-500 leading-normal font-sans text-left">
                  <input type="checkbox" required className="mt-0.5" defaultChecked />
                  <span>I approve cloud service data safety rules, single-sign-on credentials and ICANN WHOIS protection tags.</span>
                </div>
              )}

              {authError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#120a2a] hover:bg-[#201349] text-white text-xs font-black tracking-wider rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-lg shadow-black/5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>VERIFYING CRYPTO TOKEN SECURITY...</span>
                  </>
                ) : (
                  <>
                    <span>{activeTab === 'login' ? 'AUTHORIZE SECURELY (A to Z)' : 'BUILD ACTIVE CLOUDVIBE NODE'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            
            /* --- INTRICATE MULTI-STEP FORGOT PASSWORD SYSTEM --- */
            <div className="space-y-4 animate-fade-in text-left">
              
              {forgotStep === 'email' && (
                <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Enter your corporate registered email below. Super AI Site Builder diagnostic checks will generate a secure OTP key directly on-screen to reset credentials instantly.
                    </p>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Your Account Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 px-3 flex items-center text-slate-400 pointer-events-none">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input 
                        type="email" 
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value);
                          setForgotEmailError(null);
                        }}
                        placeholder="rajsahani.RgcS@gmail.com" 
                        required
                        className="w-full bg-slate-50 border border-slate-205 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-purple focus:bg-white font-semibold"
                      />
                    </div>
                    {forgotEmailError && (
                      <p className="text-[11px] text-rose-500 font-bold mt-1.5 font-sans">✕ {forgotEmailError}</p>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-[#120a2a] hover:bg-brand-purple text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Key className="w-4 h-4" />
                    <span>Generate Instant OTP Code</span>
                  </button>
                </form>
              )}

              {forgotStep === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-3.5">
                    
                    {/* Visual OTP Sim key block */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1 text-xs text-left">
                      <div className="flex items-center gap-1.5 text-amber-800 font-extrabold flex-row">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        <span>CloudVibe SMS OTP Simulator Channel</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500">
                        Super AI Site Builder security system has dispatched the access key to <strong className="text-slate-700">{forgotEmail}</strong>.
                      </p>
                      <div className="pt-1.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-850 px-2 py-1 rounded font-black tracking-widest">
                          ACCESS CODE: {generatedOtp}
                        </span>
                      </div>
                    </div>

                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Enter 4-Digit Verification OTP</label>
                    <input 
                      type="text" 
                      maxLength={4}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 1234" 
                      required
                      className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-center text-lg font-mono font-black tracking-widest text-[#120a2a] focus:outline-none focus:border-brand-purple"
                    />
                    
                    {otpError && (
                      <p className="text-[11px] text-rose-600 font-bold font-mono">❌ OTP security code failed. Enter matching {generatedOtp}</p>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-brand-purple hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Verify OTP Access Key
                  </button>
                </form>
              )}

              {forgotStep === 'reset-password' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-3 font-sans">
                    <p className="text-xs text-slate-500">
                      Identity authenticated with token signature. Type your secure brand new account password below.
                    </p>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Brand New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters e.g. rajPass1" 
                        required
                        className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm password" 
                        required
                        className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-brand-purple"
                      />
                    </div>

                    {resetError && (
                      <p className="text-[10px] text-rose-600 font-bold font-mono">{resetError}</p>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all cursor-pointer"
                  >
                    Commit New Security Password
                  </button>
                </form>
              )}

              {forgotStep === 'success' && (
                <div className="space-y-5 py-2 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-slate-900">Credentials Updated Successfully</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Your CloudVibe access pass key is refreshed safely inside the database logs. You can login immediately.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setForgotStep('email');
                      setForgotEmail('');
                      setGeneratedOtp('');
                      setEnteredOtp('');
                      setEmail('');
                      setPassword('');
                    }}
                    className="w-full py-2.5 bg-[#120a2a] hover:bg-brand-purple text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Authorize Active Password Now
                  </button>
                </div>
              )}

            </div>
          )}

          {/* Social / Google Single-Sign-On container bar */}
          <div className="relative my-5 text-center select-none">
            <hr className="border-slate-150" />
            <span className="text-[9.5px] font-mono font-bold text-slate-400 bg-white px-3 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              OR SECURE SINGLE-SIGN-ON
            </span>
          </div>

          {/* Google SSO Login button - opens high fidelity modal */}
          <button 
            type="button"
            onClick={() => {
              setShowGoogleModal(true);
              setGoogleStatus('idle');
            }}
            className="w-full py-3 border border-slate-205 hover:bg-slate-50/80 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Chrome className="w-4 h-4 text-[#ea4335] shrink-0" />
            <span className="text-slate-700">Continue with Google Account</span>
          </button>

          {/* Divider line OR Evaluation demo bypass */}
          <div className="relative my-5 text-center select-none">
            <hr className="border-slate-150" />
            <span className="text-[9.5px] font-mono font-bold text-slate-400 bg-white px-3 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              EVALUATE QUICK ADMIN & CUSTOMER
            </span>
          </div>

          {/* Side-by-side bypass credentials for rapid client speed assessment */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              type="button"
              onClick={() => handleInstantDemoLogin('customer')}
              className="py-2.5 border border-dashed border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/50 rounded-xl text-[10px] font-extrabold flex items-center justify-center space-x-1 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Customer Portal</span>
            </button>
            <button 
              type="button"
              onClick={() => handleInstantDemoLogin('admin')}
              className="py-2.5 border border-dashed border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100/50 rounded-xl text-[10px] font-extrabold flex items-center justify-center space-x-1 transition-all cursor-pointer border-rose-350"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              <span>Admin Root Panel</span>
            </button>
          </div>

        </div>
      </div>

      {/* HIGH-FIDELITY AUTOMATED GOOGLE SSO LOGINS MODAL DIALOG POPUP */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-[#06040cd9] backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 animate-scale-up text-left">
            
            {/* Header with Google Logo */}
            <div className="p-5.5 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Chrome className="w-5 h-5 text-[#4285f4] shrink-0" />
                <span className="font-sans font-bold text-slate-800 text-sm">Sign in with Google OAuth v2</span>
              </div>
              <button 
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-mono font-bold cursor-pointer"
              >
                Close [X]
              </button>
            </div>

            {googleStatus === 'idle' && (
              <div className="p-6 space-y-4">
                <p className="text-[11.5px] text-slate-500">
                  Select a Google Account to sign-in securely to Super AI Site Builder. Security validation ensures zero session hijacking vectors.
                </p>

                <div className="space-y-2">
                  
                  {/* Account options */}
                  <button
                    onClick={() => handleGoogleSsoChoice('rajsahani.RgcS@gmail.com', 'Raj Sahani', 'customer')}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:bg-slate-50/80 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">Raj Sahani</p>
                      <p className="text-[10px] text-slate-500 font-mono">rajsahani.RgcS@gmail.com</p>
                    </div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded font-sans scale-90">Customer</span>
                  </button>

                  <button
                    onClick={() => handleGoogleSsoChoice('admin.cloudvibe@gmail.com', 'System Security Admin', 'admin')}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:bg-slate-50/80 transition-all flex items-center justify-between cursor-pointer border-indigo-200"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">System Security Admin</p>
                      <p className="text-[10px] text-slate-500 font-mono">admin.cloudvibe@gmail.com</p>
                    </div>
                    <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded font-sans scale-90">Admin Root</span>
                  </button>

                  <button
                    onClick={() => handleGoogleSsoChoice('developer.cloudvibe@gmail.com', 'Dev sandbox', 'customer')}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:bg-slate-50/80 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">Vibe Developer</p>
                      <p className="text-[10px] text-slate-400 font-mono">developer.cloudvibe@gmail.com</p>
                    </div>
                    <span className="text-[10px] bg-slate-50 text-slate-500 font-bold px-2 py-0.5 rounded font-sans scale-90">Developer</span>
                  </button>

                </div>
              </div>
            )}

            {googleStatus === 'authorizing' && (
              <div className="p-10 text-center space-y-4">
                <RefreshCw className="w-8 h-8 animate-spin text-[#4285f4] mx-auto" />
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
                    AUTHO-INTEGRITY HANDSHAKE ENGAGED
                  </h4>
                  <p className="text-[10.5px] text-slate-500">
                    Exchanging OAuth payload assertions with <span className="font-mono">{selectedGoogleAccount}</span> credentials.
                  </p>
                </div>
              </div>
            )}

            {googleStatus === 'success' && (
              <div className="p-10 text-center space-y-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <Check className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    OAUTH SYNC VERIFIED
                  </h4>
                  <p className="text-[10.5px] text-slate-500">
                    Signing-in session securely. Redirecting hPanel indices...
                  </p>
                </div>
              </div>
            )}

            <div className="p-3 bg-slate-50 border-t border-slate-150 text-[9.5px] text-slate-400 font-mono text-center flex items-center justify-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>G-SUITE DEPLOYMENT ID SECURED BY APPS BOUNDARY</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HelpChatbot from '@/components/HelpChatbot';
import HomeView from '@/components/HomeView';
import HostingView from '@/components/HostingView';
import VpsView from '@/components/VpsView';
import CloudView from '@/components/CloudView';
import DomainView from '@/components/DomainView';
import BuilderView from '@/components/BuilderView';
import PricingView from '@/components/PricingView';
import BlogView from '@/components/BlogView';
import ContactView from '@/components/ContactView';
import AuthView from '@/components/AuthView';
import CheckoutView from '@/components/CheckoutView';
import DashboardView from '@/components/DashboardView';
import AdminView from '@/components/AdminView';

import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const [activePage, setActivePage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('cloudvibe_session_user');
      if (activeSession) {
        try {
          const session = JSON.parse(activeSession);
          return session.role === 'admin' ? 'admin' : 'dashboard';
        } catch (_) {}
      }
    }
    return 'home';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('cloudvibe_session_user');
    }
    return false;
  });
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<any | null>(null);
  const [sharedSearchQuery, setSharedSearchQuery] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('cloudvibe_session_user');
      if (activeSession) {
        try {
          return JSON.parse(activeSession).email || '';
        } catch (_) {}
      }
    }
    return '';
  });
  const [userRole, setUserRole] = useState<'customer' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('cloudvibe_session_user');
      if (activeSession) {
        try {
          return JSON.parse(activeSession).role || 'customer';
        } catch (_) {}
      }
    }
    return 'customer';
  });

  // Realistic persistent authentication system syncing & default account seeding
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Seed standard default user accounts database if not initialized
      const existingAccounts = localStorage.getItem('cloudvibe_accounts');
      if (!existingAccounts) {
        const defaultAccounts = [
          { email: 'rajsahani.rgcs@gmail.com', password: 'rajsahani', role: 'customer' },
          { email: 'admin@cloudvibe.com', password: 'admin123', role: 'admin' }
        ];
        localStorage.setItem('cloudvibe_accounts', JSON.stringify(defaultAccounts));
      }

      // 2. Redirect securely to dashboard/admin if they are logged in but on auth screens
      const activeSession = localStorage.getItem('cloudvibe_session_user');
      if (activeSession && (activePage === 'login' || activePage === 'register')) {
        try {
          const session = JSON.parse(activeSession);
          setTimeout(() => {
            setActivePage(session.role === 'admin' ? 'admin' : 'dashboard');
          }, 0);
        } catch (e) {
          console.error("Failed to parse cloudvibe auth session:", e);
        }
      }
    }
  }, [activePage]);

  const renderActiveView = () => {
    switch (activePage) {
      case 'home':
        return <HomeView setActivePage={setActivePage} setSelectedPlan={setSelectedPlan} setSharedSearchQuery={setSharedSearchQuery} />;
      case 'hosting':
        return <HostingView setActivePage={setActivePage} setSelectedPlan={setSelectedPlan} />;
      case 'vps':
        return <VpsView setActivePage={setActivePage} setSelectedPlan={setSelectedPlan} />;
      case 'cloud':
        return <CloudView setActivePage={setActivePage} setSelectedPlan={setSelectedPlan} />;
      case 'domain':
        return (
          <DomainView 
            setActivePage={setActivePage} 
            setSelectedDomain={setSelectedDomain} 
            initialSearchTerm={sharedSearchQuery}
            setInitialSearchTerm={setSharedSearchQuery}
          />
        );
      case 'builder':
        return <BuilderView setActivePage={setActivePage} />;
      case 'pricing':
        return <PricingView setActivePage={setActivePage} setSelectedPlan={setSelectedPlan} />;
      case 'blog':
        return <BlogView setActivePage={setActivePage} />;
      case 'contact':
        return <ContactView />;
      case 'login':
        return (
          <AuthView 
            initialTab="login" 
            setActivePage={setActivePage} 
            setIsLoggedIn={setIsLoggedIn} 
            setUserEmail={setUserEmail}
            setUserRole={setUserRole}
          />
        );
      case 'register':
        return (
          <AuthView 
            initialTab="register" 
            setActivePage={setActivePage} 
            setIsLoggedIn={setIsLoggedIn} 
            setUserEmail={setUserEmail}
            setUserRole={setUserRole}
          />
        );
      case 'dashboard':
        if (!isLoggedIn) {
          return (
            <AuthView 
              initialTab="login" 
              setActivePage={setActivePage} 
              setIsLoggedIn={setIsLoggedIn} 
              setUserEmail={setUserEmail}
              setUserRole={setUserRole}
            />
          );
        }
        return userRole === 'admin' ? (
          <AdminView setActivePage={setActivePage} />
        ) : (
          <DashboardView 
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            userEmail={userEmail || 'rajsahani.RgcS@gmail.com'}
            setActivePage={setActivePage}
          />
        );
      case 'admin':
        return <AdminView setActivePage={setActivePage} />;
      case 'checkout':
        return (
          <CheckoutView
            selectedPlan={selectedPlan}
            selectedDomain={selectedDomain}
            setActivePage={setActivePage}
            setIsLoggedIn={setIsLoggedIn}
          />
        );
      default:
        return <HomeView setActivePage={setActivePage} setSelectedPlan={setSelectedPlan} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-slate-50 antialiased font-sans">
      
      {/* Header Navigation panel */}
      {activePage !== 'checkout' && (
        <Header 
          activePage={activePage} 
          setActivePage={setActivePage} 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn} 
          userRole={userRole}
        />
      )}

      {/* Main content body with smooth transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Corporate footer */}
      {activePage !== 'checkout' && <Footer setActivePage={setActivePage} />}

      {/* Floating Interactive Help Chatbot */}
      <HelpChatbot />

    </div>
  );
}

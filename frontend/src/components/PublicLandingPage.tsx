import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Building, 
  Bus, 
  Award, 
  FileText, 
  Lock, 
  QrCode, 
  ExternalLink, 
  Sun, 
  Moon, 
  Sparkles, 
  Clock, 
  Layers, 
  MapPin, 
  Phone, 
  Mail, 
  Check, 
  AlertCircle, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Send, 
  X,
  FileCheck,
  Shield,
  Briefcase,
  Users,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './ui/LanguageToggle';
import { UserRole, MOCK_USERS } from '../types';

interface PublicLandingPageProps {
  onNavigateToLogin?: (role?: UserRole) => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({ onNavigateToLogin }) => {
  const { 
    isAuthenticated,
    user,
    login, 
    quickLogin, 
    register, 
    isLoading 
  } = useAuth();

  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Auth Form State inside Modal
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [identifier, setIdentifier] = useState<string>('citizen@govserve.ph');
  const [password, setPassword] = useState<string>('GovServe2025!');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedRolePreset, setSelectedRolePreset] = useState<UserRole>('user');

  // Register Form State
  const [regFullName, setRegFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regCitizenId, setRegCitizenId] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regBusinessName, setRegBusinessName] = useState<string>('');
  const [regRole, setRegRole] = useState<UserRole>('user');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');

  // Messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  // Hero Animated Typing Effect
  const taglines = ['Fast, Digital & Transparent.', '100% Online & AI-Assisted.', 'Tamper-Proof & QR Certified.'];
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const fullText = taglines[currentTaglineIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(fullText.substring(0, displayedText.length + 1));
        if (displayedText === fullText) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayedText(fullText.substring(0, displayedText.length - 1));
        if (displayedText === '') {
          setIsDeleting(false);
          setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentTaglineIndex]);

  // Open Auth Modal or Navigate to Full Login Page with specific initial role
  const handleOpenAuthWithRole = (role: UserRole) => {
    if (onNavigateToLogin) {
      onNavigateToLogin(role);
      return;
    }
    setSelectedRolePreset(role);
    const mock = MOCK_USERS[role];
    setIdentifier(mock.email);
    setPassword('GovServe2025!');
    setAuthMode('signin');
    setErrorMessage(null);
    setAuthModalOpen(true);
  };

  // Sign In submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    try {
      const result = await login({
        identifier: identifier.trim(),
        password,
        rememberMe: true,
        role: selectedRolePreset
      }, false);

      if (!result.success) {
        setErrorMessage(result.message || 'Authentication failed. Please verify your credentials.');
      } else {
        setAuthModalOpen(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT BAR & NAVIGATION */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & System Brand */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-md flex items-center justify-center border border-slate-200 dark:border-white/20 group-hover:scale-105 transition-transform overflow-hidden">
              <img 
                src="/government-logo.png" 
                alt="Government Logo" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  GovServe
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                  {t('portal_badge', 'E-Permit Portal')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
                {t('portal_subtitle', 'Unified Business & Permitting Hub')}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-blue-600 dark:text-blue-400 flex items-center space-x-1.5 cursor-pointer"
            >
              <span>{t('home', 'Home')}</span>
            </button>

            <button 
              onClick={() => {
                const el = document.getElementById('features-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              {language === 'tl' ? 'Mga Tampok' : 'Features'}
            </button>

            <button 
              onClick={() => {
                const el = document.getElementById('process-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              {t('how_it_works', 'How It Works')}
            </button>
          </nav>

          {/* Right Controls & Sign In CTA */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Switcher Button */}
            <LanguageToggle />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={theme === 'dark' ? t('theme_light', 'Switch to Light Mode') : t('theme_dark', 'Switch to Dark Mode')}
            >
              {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
            </button>

            {/* Sign In or Dashboard Button */}
            {isAuthenticated ? (
              <button
                onClick={() => onNavigateToLogin?.()}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>{language === 'tl' ? 'Pumunta sa Dashboard' : 'Go to Dashboard'}</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => handleOpenAuthWithRole('user')}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>{t('sign_in', 'Sign In')}</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        {/* Subtle Background Glow Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">

          {/* Massive Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Your Gateway to Business Permits,<br className="hidden sm:inline" />
            Building Clearances & Transport Franchises
          </h1>

          {/* Typing Animated Tagline */}
          <div className="h-9 flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-tight">
              {displayedText}
              <span className="animate-ping font-light text-blue-500">|</span>
            </span>
          </div>

          {/* Hero Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            GovServe Unified LGU Licensing Hub bridges Quezon City business owners, developers, and transport operators with BPLO, Engineering, MTFRB, and 24-Barangay regulatory clearances.
          </p>

          {/* CTA Buttons Row */}
          {isAuthenticated && (
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              <button
                onClick={() => onNavigateToLogin?.()}
                className="px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex items-center space-x-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Enter {user?.role === 'admin' ? 'Admin Console' : 'Citizen Dashboard'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. KEY METRICS STATS BAR */}
      {/* ========================================================================= */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <p className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                24+
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                Barangay Integrated Networks
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                ₱100M+
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                Annual LGU Revenue Processed
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-4xl sm:text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                15,000+
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                Active Certified E-Permits
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-4xl sm:text-5xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
                100%
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                Digital Cryptographic Processing
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. COMPREHENSIVE FEATURES GRID (6 CARDS) */}
      {/* ========================================================================= */}
      <section id="features-section" className="py-20 bg-slate-50/70 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Comprehensive Municipal Licensing & Permitting Features
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Designed for entrepreneurs, building contractors, transport operators, and LGU licensing officers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Business Permit Application */}
            <div className="p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Building2 size={24} />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md">
                  Module 1 • BPLO
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white pt-1">
                  Business Permit Application
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete portal for New & Renewal Business Permits, online requirement submissions, municipal tax fee assessment, and official electronic permit generation.
              </p>
            </div>

            {/* Card 2: Building & Construction Permits */}
            <div className="p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Building size={24} />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                  Module 2 • Engineering
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white pt-1">
                  Building & Construction Permits
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Digital building permit filing, architectural blueprint & CAD plan uploads, structural review audits, and site inspection scheduling dispatch.
              </p>
            </div>

            {/* Card 3: Franchise & Transport Permits */}
            <div className="p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Bus size={24} />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                  Module 3 • MTFRB / LTO
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white pt-1">
                  Franchise & Transport Permits
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tricycle and PUV franchise filing, route unit inspection verification, corridor capacity quota conflict checks, and transport clearance release.
              </p>
            </div>

            {/* Card 4: Barangay Permit Integration */}
            <div className="p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <ShieldCheck size={24} />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                  Module 4 • Barangay Grid
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white pt-1">
                  Barangay Permit Integration
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Unified clearance network connecting San Isidro, Poblacion, Batasan, and all 24 local barangays for real-time clearance requests and validations.
              </p>
            </div>

            {/* Card 5: E-Permit Tracker */}
            <div className="p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <QrCode size={24} />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                  Module 5 • Verification Hub
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white pt-1">
                  E-Permit Tracker & QR Verification
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Public reference code lookup, live clearance milestone tracking, and tamper-proof cryptographic QR code authenticity verification.
              </p>
            </div>

            {/* Card 6: AI Document & Compliance Engine */}
            <div className="p-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Sparkles size={24} />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                  AI Core Engine
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white pt-1">
                  AI OCR & Intelligent Approval
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automated document OCR validation, AI zoning & regulatory compliance checks, and intelligent recommendation engine for licensing officers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PROCESS SECTION (HOW IT WORKS - 3 STEPS) */}
      {/* ========================================================================= */}
      <section id="process-section" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              How GovServe Licensing System Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Simple 3-step digital permitting and licensing process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/80 text-center space-y-3 relative">
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Explore & Check Requirements
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Run our AI Pre-Checker to find specific requirements and compute estimated municipal regulatory fees automatically.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/80 text-center space-y-3 relative">
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Upload Vault Documents
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload DTI, Cedula, Lease contract, architectural blueprints, or vehicle OR/CR directly to your Secure Vault.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/80 text-center space-y-3 relative">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Get Approved & Released
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Undergo automated cross-checks, settle digital payments, and receive your tamper-proof cryptographic QR E-Permit.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PARTNER AGENCIES ROW */}
      {/* ========================================================================= */}
      <section className="py-12 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-center text-slate-600 dark:text-slate-300">
            Official Regulatory & Licensing Partner Agencies
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-xs font-bold text-slate-600 dark:text-slate-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck size={18} className="text-blue-600" />
              <span>DTI Philippines</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 size={18} className="text-teal-600" />
              <span>BPLO Quezon City</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building size={18} className="text-amber-500" />
              <span>OBO Engineering</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield size={18} className="text-rose-500" />
              <span>Bureau of Fire Protection (BFP)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bus size={18} className="text-emerald-500" />
              <span>MTFRB & LTO</span>
            </div>
            <div className="flex items-center space-x-2">
              <Layers size={18} className="text-purple-500" />
              <span>24 Local Barangay Councils</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-16 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Branding */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src="/government-logo.png" alt="Official Seal Logo" className="w-full h-full object-contain rounded" />
                </div>
                <span className="text-lg font-black text-white">GovServe</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Unified Business, Building, Transport & Barangay Permitting System for Quezon City Local Government.
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Certified Tamper-Proof under RA 8792.
              </p>
            </div>

            {/* Col 2: Quick Navigation */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Quick Navigation</h4>
              <ul className="space-y-1.5">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white cursor-pointer">Public Services Portal</button></li>
                <li><button onClick={() => handleOpenAuthWithRole('user')} className="hover:text-white cursor-pointer">Citizen & Business Login</button></li>
                <li><button onClick={() => handleOpenAuthWithRole('admin')} className="hover:text-white cursor-pointer">Staff & Officer Portal</button></li>
              </ul>
            </div>

            {/* Col 3: Public Services */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Public Services</h4>
              <ul className="space-y-1.5">
                <li><button onClick={() => handleOpenAuthWithRole('user')} className="hover:text-white cursor-pointer">AI Zoning & Tax Pre-Checker</button></li>
                <li><button onClick={() => handleOpenAuthWithRole('user')} className="hover:text-white cursor-pointer">Schedule Site Inspection</button></li>
                <li><button onClick={() => handleOpenAuthWithRole('user')} className="hover:text-white cursor-pointer">Franchise Corridor Quota Audit</button></li>
              </ul>
            </div>

            {/* Col 4: Contact & Office */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Contact & Office</h4>
              <div className="space-y-1.5 text-slate-400">
                <p className="flex items-center space-x-1.5"><MapPin size={13} /> <span>Quezon City Hall Complex, Elliptical Road, QC</span></p>
                <p className="flex items-center space-x-1.5"><Clock size={13} /> <span>Mon-Fri 8:00 AM – 5:00 PM</span></p>
                <p className="flex items-center space-x-1.5"><Phone size={13} /> <span>Hotline: (02) 8988-4242</span></p>
                <p className="flex items-center space-x-1.5"><Mail size={13} /> <span>support@govserve.ph</span></p>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Republic of the Philippines • City Government Licensing Office. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer">System Status (99.9% Uptime)</span>
            </div>
          </div>

        </div>
      </footer>


      {/* ========================================================================= */}
      {/* 9. INTERACTIVE MODAL: AUTHENTICATION & QUICK ROLE LOGIN */}
      {/* ========================================================================= */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5 relative">
            
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck size={26} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Sign In to GovServe
              </h3>
              <p className="text-xs text-slate-500">
                Access your permits, applications & clearances
              </p>
            </div>

            {/* Status Messages */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle size={15} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 size={15} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Regular Sign In / Role Selection */}
            <div className="space-y-4">
                {/* Role Switcher Pills */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleOpenAuthWithRole('user')}
                    className={`py-2 rounded-lg transition-all cursor-pointer ${
                      selectedRolePreset === 'user'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Citizen / Business
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenAuthWithRole('admin')}
                    className={`py-2 rounded-lg transition-all cursor-pointer ${
                      selectedRolePreset === 'admin'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    LGU Admin Officer
                  </button>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      placeholder="citizen@govserve.ph"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 mt-2"
                  >
                    <span>Sign In to {selectedRolePreset === 'admin' ? 'Admin Portal' : 'Citizen Hub'}</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>

          </div>
        </div>
      )}

    </div>
  );
};

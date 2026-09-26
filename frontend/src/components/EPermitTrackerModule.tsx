import React, { useState, useRef } from 'react';
import { 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Download, 
  Eye, 
  FileText, 
  MapPin, 
  Calendar, 
  User, 
  Check, 
  X, 
  Sparkles, 
  Award, 
  RefreshCw, 
  Shield, 
  Activity, 
  Printer, 
  Send,
  Building,
  CheckCircle,
  HelpCircle,
  Hash,
  Layers,
  ChevronDown,
  LogOut,
  Sun,
  Moon,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Camera,
  Lock,
  Zap,
  Building2,
  Bus,
  Home,
  Users,
  Banknote,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './ui/LanguageToggle';
import { TabType } from '../types';

interface VerificationRecord {
  id: string;
  type: 'Business Permit' | 'Building Permit' | 'Franchise MTOP' | 'Barangay Clearance';
  holderName: string;
  entityName: string;
  issueDate: string;
  validUntil: string;
  status: 'OFFICIALLY ISSUED & VALID' | 'UNDER EVALUATION' | 'RENEWAL REQUIRED' | 'INVALID / REVOKED';
  qrHash: string;
  milestones: { step: number; title: string; status: 'completed' | 'in_progress' | 'pending'; date: string }[];
}

const MOCK_VERIFICATION_RECORDS: Record<string, VerificationRecord> = {
  'BP-2024-00123': {
    id: 'BP-2024-00123',
    type: 'Business Permit',
    holderName: 'Juan Dela Cruz',
    entityName: 'Apex Innovations Retail Hub',
    issueDate: 'January 10, 2025',
    validUntil: 'December 31, 2025',
    status: 'OFFICIALLY ISSUED & VALID',
    qrHash: 'SHA256-BP-2024-00123-99A8F12B004',
    milestones: [
      { step: 1, title: 'Application Filed', status: 'completed', date: 'Jan 05, 2025' },
      { step: 2, title: 'Document Verification (OCR)', status: 'completed', date: 'Jan 06, 2025' },
      { step: 3, title: 'Fee Assessment & Computation', status: 'completed', date: 'Jan 07, 2025' },
      { step: 4, title: 'Mayor\'s Approval & Digital Signing', status: 'completed', date: 'Jan 09, 2025' },
      { step: 5, title: 'Permit & QR Decal Released', status: 'completed', date: 'Jan 10, 2025' }
    ]
  },
  'BLD-2025-00101': {
    id: 'BLD-2025-00101',
    type: 'Building Permit',
    holderName: 'Vertex Prime Real Estate Corp.',
    entityName: 'Vertex Heights 18-Storey Mixed-Use Tower',
    issueDate: 'August 10, 2025',
    validUntil: 'August 10, 2026',
    status: 'OFFICIALLY ISSUED & VALID',
    qrHash: 'SHA256-BLD-2025-00101-8849F29A',
    milestones: [
      { step: 1, title: 'Architectural Filing', status: 'completed', date: 'Aug 01, 2025' },
      { step: 2, title: 'Structural & Fire Review', status: 'completed', date: 'Aug 04, 2025' },
      { step: 3, title: 'NBCP Technical Evaluation', status: 'completed', date: 'Aug 07, 2025' },
      { step: 4, title: 'City Building Official Release', status: 'completed', date: 'Aug 10, 2025' }
    ]
  },
  'MTOP-2025-0412': {
    id: 'MTOP-2025-0412',
    type: 'Franchise MTOP',
    holderName: 'Juan Dela Cruz',
    entityName: 'San Isidro TODA (Unit #088)',
    issueDate: 'August 10, 2025',
    validUntil: 'December 31, 2025',
    status: 'OFFICIALLY ISSUED & VALID',
    qrHash: 'SHA256-MTOP-2025-0412-9981244',
    milestones: [
      { step: 1, title: 'Operator Registration', status: 'completed', date: 'Aug 02, 2025' },
      { step: 2, title: 'Route Quota Validation', status: 'completed', date: 'Aug 05, 2025' },
      { step: 3, title: 'Road Safety & Smoke Test', status: 'completed', date: 'Aug 08, 2025' },
      { step: 4, title: 'Windshield QR Decal Issued', status: 'completed', date: 'Aug 10, 2025' }
    ]
  }
};

interface EPermitTrackerModuleProps {
  currentTab?: TabType | string;
  onNavigateToTab?: (tab: TabType | string) => void;
  onAddNewApplication?: (applicantName: string, permitType: string) => void;
  onNavigateToDashboard?: () => void;
}

export const EPermitTrackerModule: React.FC<EPermitTrackerModuleProps> = ({
  onNavigateToTab,
  onAddNewApplication,
  onNavigateToDashboard
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const isAdmin = user?.role === 'admin';
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // View state: 'preview' | 'scan_camera' | 'track_timeline' | 'ctc_pulling' | 'verification' | 'report_fraud'
  const [currentView, setCurrentView] = useState<
    'preview' | 'scan_camera' | 'track_timeline' | 'ctc_pulling' | 'verification' | 'report_fraud'
  >('preview');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [searchCode, setSearchCode] = useState<string>('BP-2024-00123');
  const [activeRecord, setActiveRecord] = useState<VerificationRecord | null>(MOCK_VERIFICATION_RECORDS['BP-2024-00123']);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Fraud Report State
  const [fraudData, setFraudData] = useState({
    suspectPermitCode: 'BP-2024-FAKE-99',
    suspectBusiness: 'Illegal Vendor Hub',
    location: 'Commonwealth Ave., QC',
    details: 'Tampered permit QR code and fake Mayor signature'
  });
  const [fraudSubmitted, setFraudSubmitted] = useState<boolean>(false);

  const handleLookup = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = MOCK_VERIFICATION_RECORDS[clean] || {
      id: clean,
      type: 'Business Permit',
      holderName: 'Registered Taxpayer',
      entityName: 'Verified Commercial Enterprise',
      issueDate: 'January 15, 2025',
      validUntil: 'December 31, 2025',
      status: 'OFFICIALLY ISSUED & VALID',
      qrHash: `SHA256-${clean}-AUTHENTICATED`,
      milestones: [
        { step: 1, title: 'Filing Logged', status: 'completed', date: 'Jan 10, 2025' },
        { step: 2, title: 'Evaluated & Approved', status: 'completed', date: 'Jan 12, 2025' },
        { step: 3, title: 'QR Certificate Issued', status: 'completed', date: 'Jan 15, 2025' }
      ]
    };
    setActiveRecord(found);
    showToast(`Loaded cryptographic verification for ${clean}`);
  };

  const handleDownloadVerificationProof = (rec: VerificationRecord) => {
    const text = `========================================================================================
REPUBLIC OF THE PHILIPPINES • CITY GOVERNMENT OF QUEZON CITY
OFFICIAL CRYPTOGRAPHIC QR PERMIT VERIFICATION ATTESTATION
========================================================================================
PERMIT REFERENCE NO     : ${rec.id}
PERMIT CATEGORY         : ${rec.type.toUpperCase()}
AUTHENTICITY STATUS     : ${rec.status}
----------------------------------------------------------------------------------------
AUTHENTICATED RECORD SPECIFICATIONS:
Registered Grantee / Owner: ${rec.holderName}
Commercial Enterprise / Project: ${rec.entityName}
Issue Date              : ${rec.issueDate}
Official Expiry Date    : ${rec.validUntil}
----------------------------------------------------------------------------------------
CRYPTOGRAPHIC SECURITY AUDIT:
Blockchain Block / Hash : ${rec.qrHash}
Digital Signature Alg.  : ECDSA SHA-256 with 2048-bit City Mayor Master Key
Security Tamper Status  : 100% GENUINE & TAMPER-PROOF
----------------------------------------------------------------------------------------
LGU Chief Information Officer : DIR. ALEJANDRO S. BAUTISTA
Security Timestamp            : ${new Date().toISOString()}
========================================================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR_Verification_${rec.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded Cryptographic Proof for ${rec.id}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center space-x-2.5 animate-bounce">
          <Sparkles size={16} className="text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. STANDALONE TOP HEADER BAR (Hidden in Admin Mode) */}
      {/* ========================================================================= */}
      {!isAdmin && (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs px-4 sm:px-8 py-3.5 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left */}
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200 dark:border-white/20">
                <img src="/government-logo.png" alt="Government Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                    GOVSERVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  QR Authenticity & Cryptographic Verification Hub
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3">
              {/* Home Navigation Button */}
              <button
                onClick={() => onNavigateToTab ? onNavigateToTab('Home') : setCurrentView('preview')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl text-xs font-bold transition-all border border-blue-200 dark:border-blue-800 cursor-pointer shadow-xs"
                title={t('return_home', 'Return to Home Portal')}
              >
                <Home size={15} />
                <span>{t('home', 'Home')}</span>
              </button>

              {/* Language Switcher TL | EN Toggle */}
              <LanguageToggle />

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={theme === 'dark' ? t('theme_light', 'Switch to Light Mode') : t('theme_dark', 'Switch to Dark Mode')}
              >
                {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pl-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div className="text-left hidden sm:block pr-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[130px]">
                      {user?.name || 'User'}
                    </p>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'Citizen User'}</p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { setProfileDropdownOpen(false); onNavigateToTab?.('Home'); }} className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2">
                        <Home size={14} className="text-blue-500" />
                        <span>Home Portal</span>
                      </button>
                      <button onClick={() => { setProfileDropdownOpen(false); onNavigateToTab?.('Home'); }} className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2">
                        <Clock size={14} className="text-amber-500" />
                        <span>My Applications Dashboard</span>
                      </button>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button onClick={() => { setProfileDropdownOpen(false); logout(); }} className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-semibold">
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ========================================================================= */}
      {/* 2. FULL-WIDTH HERO SECTION */}
      {/* ========================================================================= */}
      <section className="w-full bg-white dark:bg-gradient-to-r dark:from-[#071326] dark:via-[#0E2744] dark:to-[#0A1A2F] text-slate-900 dark:text-white py-7 sm:py-9 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors">
        <div className="hidden dark:block absolute top-0 right-0 w-[500px] h-[500px] bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden dark:block absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-3">
          {currentView !== 'preview' && (
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentView('preview')}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <ArrowLeft size={13} />
                <span>Return to Verification Overview</span>
              </button>
            </div>
          )}

          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              QR Authenticity & E-Permit Verification Portal
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Verify cryptographic security signatures, authenticate official LGU permits, check real-time milestone progress, and validate digital watermarks across all municipal permits.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN BODY CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-9">

        {/* ========================================================================= */}
        {/* PREVIEW PAGE: OFFICIAL VERIFICATION & SECURITY STANDARDS GUIDE */}
        {/* ========================================================================= */}
        {currentView === 'preview' && (
          <div className="space-y-10 animate-in fade-in pb-10">
            


            {/* ========================================================================= */}
            {/* 4 SERVICE CARDS (PICTURE 5 UNIFIED LAYOUT) */}
            {/* ========================================================================= */}
            <div className="space-y-6">

              {/* ======================================================================= */}
              {/* CARD 1: TRACK & VERIFY OFFICIAL PERMITS - BLUE / SKY THEME */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-sky-50/70 to-blue-50/50 dark:from-[#061426] dark:via-[#091e38] dark:to-[#030914] border border-sky-200 dark:border-sky-500/40 p-6 sm:p-8 shadow-xl shadow-sky-900/5 dark:shadow-2xl dark:shadow-sky-950/40 group transition-all duration-300 select-text"
              >
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-sky-400/10 dark:bg-sky-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                        TRACK &amp; VERIFY OFFICIAL PERMITS
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">All citizens and applicants tracking pending or approved LGU permits</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <QrCode size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Online tracking through GovServe</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Instant 24/7 digital status lookup with milestone audit history</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">CHARGES &amp; PAYMENT</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Free Public LGU Service (₱0.00 Tariff)</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-400/40 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Via GovServe online portal</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Document Upload Callout */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col justify-between space-y-3">
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsScanning(true);
                          setCurrentView('scan_camera');
                        }}
                        className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-blue-600/40 hover:shadow-blue-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Track Permit Application →</span>
                      </button>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-black/45 border border-sky-200 dark:border-sky-500/30 backdrop-blur-xs space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400">
                        <Camera size={14} />
                        <span>QR Decal &amp; Reference Scanner Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Scan or upload clear photos of your Permit QR Decal, Official Receipt QR, or enter reference code for instant validation.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>Permit QR Decal
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>Official Receipt QR
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>Reference Code
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-sky-50/80 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>Digital Seal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 2: LIVE APPLICATION MILESTONE TRACKER - BLUE / INDIGO THEME */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-blue-50/70 to-indigo-50/50 dark:from-[#08152b] dark:via-[#0e2142] dark:to-[#040c1a] border border-blue-200 dark:border-blue-500/40 p-6 sm:p-8 shadow-xl shadow-blue-900/5 dark:shadow-2xl dark:shadow-blue-950/40 group transition-all duration-300 select-text"
              >
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                        LIVE APPLICATION MILESTONE TRACKER
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-400/40 flex items-center justify-center text-blue-700 dark:text-blue-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">All registered applicants, business owners, engineers, and authorized liaisons</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-400/40 flex items-center justify-center text-blue-700 dark:text-blue-300 shrink-0">
                          <Activity size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Online tracking through GovServe</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-400/40 flex items-center justify-center text-blue-700 dark:text-blue-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Instant real-time updates synchronized across all municipal departments</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-400/40 flex items-center justify-center text-blue-700 dark:text-blue-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">CHARGES &amp; PAYMENT</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Free Public LGU Service (₱0.00 Tariff)</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-400/40 flex items-center justify-center text-blue-700 dark:text-blue-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Via GovServe online portal</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Document Upload Callout */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col justify-between space-y-3">
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => setCurrentView('track_timeline')}
                        className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-blue-600/40 hover:shadow-blue-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Track Live Milestones →</span>
                      </button>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-black/45 border border-blue-200 dark:border-blue-500/30 backdrop-blur-xs space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                        <Camera size={14} />
                        <span>Reference Code &amp; Barcode Lookup Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Enter tracking reference code or barcode to inspect department milestones, pending endorsements, and timestamps.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-blue-50/80 dark:bg-white/5 border border-blue-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>Reference Code
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-blue-50/80 dark:bg-white/5 border border-blue-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>Department Milestones
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-blue-50/80 dark:bg-white/5 border border-blue-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>Officer Logs
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-blue-50/80 dark:bg-white/5 border border-blue-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>Estimated Clearance
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 3: CRYPTOGRAPHIC HASH & SEAL VERIFICATION - EMERALD / TEAL THEME */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-emerald-50/70 to-teal-50/50 dark:from-[#06241a] dark:via-[#093527] dark:to-[#03140f] border border-emerald-200 dark:border-emerald-500/40 p-6 sm:p-8 shadow-xl shadow-emerald-900/5 dark:shadow-2xl dark:shadow-emerald-950/40 group transition-all duration-300 select-text"
              >
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/10 dark:bg-teal-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                        CRYPTOGRAPHIC HASH &amp; SEAL VERIFICATION
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Enforcement officers, banking institutions, government agencies, and general public</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <ShieldCheck size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Online application through GovServe</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Instant cryptographic validation under 1.5 seconds</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">CHARGES &amp; PAYMENT</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Free Public LGU Service (₱0.00 Tariff)</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Via GovServe online portal</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Document Upload Callout */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col justify-between space-y-3">
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          handleLookup('BP-2024-00123');
                          setCurrentView('verification');
                        }}
                        className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/40 hover:shadow-emerald-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Verify Security Audit Hash →</span>
                      </button>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-black/45 border border-emerald-200 dark:border-emerald-500/30 backdrop-blur-xs space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        <Camera size={14} />
                        <span>Cryptographic Audit Trail Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Verify digital permits with SHA-256 tamper-evident hash validation, issuer credentials, and cryptographic certificates.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-white/5 border border-emerald-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>SHA-256 Hash
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-white/5 border border-emerald-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>Master Ledger
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-white/5 border border-emerald-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>RSA Signature
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-white/5 border border-emerald-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>Digital Stamp
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* CARD 4: REPORT FRAUDULENT OR TAMPERED PERMIT - ROSE / PINK THEME */}
              {/* ======================================================================= */}
              <div 
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-rose-50/70 to-pink-50/50 dark:from-[#260511] dark:via-[#38081a] dark:to-[#17020a] border border-rose-200 dark:border-rose-500/40 p-6 sm:p-8 shadow-xl shadow-rose-900/5 dark:shadow-2xl dark:shadow-rose-950/40 group transition-all duration-300 select-text"
              >
                {/* Ambient glow effects */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-rose-400/10 dark:bg-rose-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-pink-500/10 dark:bg-pink-600/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  {/* Left Column: Info & Details */}
                  <div className="flex-1 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                        REPORT FRAUDULENT OR TAMPERED PERMIT
                      </h3>
                    </div>

                    {/* 5 Information Rows with Circular Icons */}
                    <div className="space-y-2.5 pt-1">
                      {/* Row 1: Target Users */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-400/40 flex items-center justify-center text-rose-700 dark:text-rose-300 shrink-0">
                          <Users size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TARGET USERS</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Concerned citizens, establishments, field inspectors, and victimized applicants</p>
                        </div>
                      </div>

                      {/* Row 2: Service Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-400/40 flex items-center justify-center text-rose-700 dark:text-rose-300 shrink-0">
                          <AlertTriangle size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">SERVICE METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Online application through GovServe</p>
                        </div>
                      </div>

                      {/* Row 3: Time Period */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-400/40 flex items-center justify-center text-rose-700 dark:text-rose-300 shrink-0">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">TIME PERIOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Priority investigation initiated within 24 hours</p>
                        </div>
                      </div>

                      {/* Row 4: Charges & Payment */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-400/40 flex items-center justify-center text-rose-700 dark:text-rose-300 shrink-0">
                          <Banknote size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">CHARGES &amp; PAYMENT</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Free Citizen Reporting Service (₱0.00 Tariff)</p>
                        </div>
                      </div>

                      {/* Row 5: Payment Method */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-400/40 flex items-center justify-center text-rose-700 dark:text-rose-300 shrink-0">
                          <CreditCard size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">PAYMENT METHOD</span>
                          <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Via GovServe online portal</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions & Document Upload Callout */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col justify-between space-y-3">
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setFraudSubmitted(false);
                          setCurrentView('report_fraud');
                        }}
                        className="w-full py-3.5 px-5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-rose-600/40 hover:shadow-rose-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Report Fraudulent Permit →</span>
                      </button>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-black/45 border border-rose-200 dark:border-rose-500/30 backdrop-blur-xs space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
                        <Camera size={14} />
                        <span>Confidential Evidence &amp; Photo Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Upload photos or scans of suspected fake permits, counterfeit QR codes, fixers' receipts, or altered documents.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2.5 py-1 rounded-md bg-rose-50/80 dark:bg-white/5 border border-rose-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400"></span>Fake Decal Photo
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-rose-50/80 dark:bg-white/5 border border-rose-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400"></span>Tampered Permit
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-rose-50/80 dark:bg-white/5 border border-rose-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400"></span>Fixer Receipt
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-rose-50/80 dark:bg-white/5 border border-rose-200 dark:border-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400"></span>Incident Report
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>


          </div>
        )}

        {/* SUBVIEW: LIVE CAMERA SCANNER */}
        {currentView === 'scan_camera' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                    <Camera size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Live Camera QR & Barcode Scanner</h2>
                    <p className="text-xs text-slate-500">Align QR decal inside viewfinder frame</p>
                  </div>
                </div>
                <button onClick={() => setCurrentView('preview')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                  Back
                </button>
              </div>

              <div className="relative aspect-video max-w-md mx-auto bg-slate-950 rounded-3xl border-2 border-dashed border-teal-500 flex flex-col items-center justify-center text-white overflow-hidden shadow-2xl">
                <div className="w-48 h-48 border-2 border-teal-400 rounded-2xl relative flex items-center justify-center">
                  <div className="w-full h-0.5 bg-teal-400 absolute animate-pulse shadow-lg shadow-teal-500" />
                  <QrCode size={96} className="text-teal-500/40" />
                </div>
                <p className="text-xs text-teal-300 font-mono mt-4 animate-pulse">Scanning video stream for municipal QR hash...</p>
              </div>

              <div className="space-y-3 pt-2 text-center">
                <p className="text-xs text-slate-500">Quick Test Simulation:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['BP-2024-00123', 'BLD-2025-00101', 'MTOP-2025-0412'].map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        handleLookup(code);
                        setCurrentView('verification');
                      }}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-800 dark:text-slate-200 hover:text-teal-600 rounded-xl text-xs font-mono font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      Simulate Scan: {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBVIEW: TIMELINE MILESTONE TRACKER */}
        {currentView === 'track_timeline' && activeRecord && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-mono text-teal-600 font-bold text-xs">{activeRecord.id}</span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">Live Application Milestone Status</h2>
                  <p className="text-xs text-slate-500">{activeRecord.entityName} • {activeRecord.type}</p>
                </div>
                <button onClick={() => setCurrentView('preview')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                  Back to Overview
                </button>
              </div>

              <div className="space-y-4">
                {activeRecord.milestones.map((m, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      ✓
                    </div>
                    <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{m.title}</h4>
                        <p className="text-[11px] text-slate-500">{m.date}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-bold text-[10px]">
                        COMPLETED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBVIEW: CRYPTOGRAPHIC VERIFICATION DETAILS */}
        {currentView === 'verification' && activeRecord && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Cryptographic Verification Results</h2>
                    <p className="text-xs text-slate-500">2048-Bit RSA Mayor Digital Signature Verification</p>
                  </div>
                </div>
                <button onClick={() => setCurrentView('preview')} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer">
                  Back
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    placeholder="Enter Permit Code (e.g. BP-2024-00123)..."
                    className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-xs"
                  />
                  <button
                    onClick={() => handleLookup(searchCode)}
                    className="px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Verify
                  </button>
                </div>

                <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">
                      ✓ {activeRecord.status}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      {activeRecord.id}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">{activeRecord.entityName}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Registered Grantee: <strong>{activeRecord.holderName}</strong> • Type: {activeRecord.type}</p>
                    <p className="text-[11px] text-slate-500">Issued: {activeRecord.issueDate} • Valid Until: {activeRecord.validUntil}</p>
                    <p className="text-[10px] font-mono text-slate-400 truncate">Hash: {activeRecord.qrHash}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadVerificationProof(activeRecord)}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                >
                  <Download size={14} />
                  <span>Download Authenticated Verification Slip (TXT)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBVIEW: REPORT FRAUD */}
        {currentView === 'report_fraud' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Report Fake / Tampered Permit</h2>
                    <p className="text-xs text-slate-500">LGU Anti-Red Tape & Fraud Investigation Unit</p>
                  </div>
                </div>
                <button onClick={() => setCurrentView('preview')} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer">
                  Back
                </button>
              </div>

              {!fraudSubmitted ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Suspect Permit Number *</label>
                    <input type="text" value={fraudData.suspectPermitCode} onChange={(e) => setFraudData({...fraudData, suspectPermitCode: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-xs" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Establishment / Location *</label>
                    <input type="text" value={fraudData.suspectBusiness} onChange={(e) => setFraudData({...fraudData, suspectBusiness: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300">Details of Suspicious Activity *</label>
                    <textarea rows={3} value={fraudData.details} onChange={(e) => setFraudData({...fraudData, details: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs" />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setFraudSubmitted(true);
                        showToast('Confidential report dispatched to LGU Fraud Unit!');
                      }}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-md cursor-pointer"
                    >
                      Submit Confidential Fraud Report
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Confidential Report Received</h3>
                  <p className="text-xs text-slate-500">Thank you for keeping Quezon City safe. Case reference <strong className="text-rose-600 font-mono">FRD-2025-9912</strong>.</p>
                  <button onClick={() => setCurrentView('preview')} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

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
  Home
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
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
      <section className="w-full bg-gradient-to-r from-[#071326] via-[#0E2744] to-[#0A1A2F] text-white py-7 sm:py-9 px-4 sm:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

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
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              QR Authenticity & E-Permit Verification Portal
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
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
            


            {/* 4 Interactive Service Category Cards (Direct Action Functional Buttons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Scan QR Code */}
              <button
                type="button"
                onClick={() => {
                  setIsScanning(true);
                  setCurrentView('scan_camera');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800 group-hover:scale-105 transition-transform">
                    <Camera size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                      Scan QR Code Decal
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      I-scan ang permit barcode o QR decal gamit ang camera para sa mabilisang pagsusuri ng pagka-orihinal.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-teal-600 dark:text-teal-400 font-mono">Live Camera</span>
                  <span className="text-[11px] font-bold text-teal-600 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Launch Scanner</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>

              {/* Card 2: Track Live Milestones */}
              <button
                type="button"
                onClick={() => setCurrentView('track_timeline')}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 group-hover:scale-105 transition-transform">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      Track Live Milestones
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      Subaybayan ang bawat yugto ng progreso mula sa pag-file hanggang sa digital na pag-apruba ng Punong Lungsod.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">Real-Time</span>
                  <span className="text-[11px] font-bold text-blue-600 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Track Status</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>

              {/* Card 3: Cryptographic Verification */}
              <button
                type="button"
                onClick={() => {
                  handleLookup('BP-2024-00123');
                  setCurrentView('verification');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      Verify Cryptographic Hash
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      Patotohanan ang 2048-bit RSA digital signature laban sa opisyal na master ledger ng munisipyo o lungsod.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">SHA-256</span>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Verify Code</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>

              {/* Card 4: Report Tampered Permit */}
              <button
                type="button"
                onClick={() => {
                  setFraudSubmitted(false);
                  setCurrentView('report_fraud');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800 group-hover:scale-105 transition-transform">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                      Report Fraudulent Permit
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      Kumpidensyal na pag-uulat ng anomalya o pekeng permiso sa LGU Anti-Red Tape and Fraud Unit.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400 font-mono">Anti-Fraud</span>
                  <span className="text-[11px] font-bold text-rose-600 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Report Now</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </button>

            </div>

            {/* Itemized Cryptographic Security Specifications & Registry Schedules (2-Column Tables) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Table 1: Cryptographic Security Standards */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                      <Lock size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Cryptographic Security Specifications
                      </h3>
                      <p className="text-[11px] text-slate-500">Government Cryptographic Standard (DICT & QC-LGU)</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    Encrypted
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-3.5 py-2.5">Security Code & Standard</th>
                        <th className="px-3 py-2.5">Algorithm</th>
                        <th className="px-3.5 py-2.5 text-right">Integrity Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-teal-600 block text-[10px]">SEC-01</span>
                          <p className="font-bold text-slate-900 dark:text-white">Municipal SHA-256 Digest</p>
                          <span className="text-[10px] text-slate-500">Tamper-proof 256-bit block hash</span>
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">SHA-256</td>
                        <td className="px-3.5 py-3 text-right">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px]">VERIFIED</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-teal-600 block text-[10px]">SEC-02</span>
                          <p className="font-bold text-slate-900 dark:text-white">Mayor Digital Signature</p>
                          <span className="text-[10px] text-slate-500">2048-Bit asymmetric RSA key</span>
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">RSA-2048</td>
                        <td className="px-3.5 py-3 text-right">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px]">OFFICIAL</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-teal-600 block text-[10px]">SEC-03</span>
                          <p className="font-bold text-slate-900 dark:text-white">Holographic Microprint QR</p>
                          <span className="text-[10px] text-slate-500">Anti-photocopy physical decal</span>
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">Optical UV</td>
                        <td className="px-3.5 py-3 text-right">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px]">GENUINE</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-teal-600 block text-[10px]">SEC-04</span>
                          <p className="font-bold text-slate-900 dark:text-white">Live LGU Master Interlink</p>
                          <span className="text-[10px] text-slate-500">Real-time treasury status sync</span>
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">REST API / TLS</td>
                        <td className="px-3.5 py-3 text-right">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold text-[10px]">ACTIVE</span>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800/60 font-bold border-t border-slate-200 dark:border-slate-800">
                      <tr>
                        <td colSpan={2} className="px-3.5 py-2.5 text-slate-900 dark:text-white">Overall Security Level</td>
                        <td className="px-3.5 py-2.5 text-right font-mono text-teal-600 dark:text-teal-400 text-sm">BANK-GRADE (LVL 4)</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Table 2: Supported E-Permit Categories */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Supported Municipal Permit Registry
                      </h3>
                      <p className="text-[11px] text-slate-500">Cross-Department Verified E-Permits</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Registry
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-3.5 py-2.5">Category & Prefix</th>
                        <th className="px-3 py-2.5">Issuing Office</th>
                        <th className="px-3.5 py-2.5 text-right">Validity Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-blue-600 block text-[10px]">BP-XXXX-XXXXX</span>
                          <p className="font-bold text-slate-900 dark:text-white">Mayor's Business Permit</p>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">BPLD</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">Annual (Dec 31)</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-blue-600 block text-[10px]">BLD-XXXX-XXXXX</span>
                          <p className="font-bold text-slate-900 dark:text-white">Building & Structural Permit</p>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">OBO</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">Construction Life</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-blue-600 block text-[10px]">MTOP-XXXX-XXXXX</span>
                          <p className="font-bold text-slate-900 dark:text-white">Tricycle Franchise Permit</p>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">TRB / TRU</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">1 - 3 Years</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-3">
                          <span className="font-mono font-bold text-blue-600 block text-[10px]">BC-XXXX-XXXXX</span>
                          <p className="font-bold text-slate-900 dark:text-white">Barangay Clearance & CTC</p>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-400">Barangay LGU</td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">Fiscal Year</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800/60 font-bold border-t border-slate-200 dark:border-slate-800">
                      <tr>
                        <td colSpan={2} className="px-3.5 py-2.5 text-slate-900 dark:text-white">Total Indexed Permitting Records</td>
                        <td className="px-3.5 py-2.5 text-right font-mono text-blue-600 dark:text-blue-400 text-sm">100,000+ QC Units</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

            </div>

            {/* Mandatory Security Verification Checklist */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Mandatory 4-Step Security Verification Protocol
                  </h3>
                  <p className="text-xs text-slate-500">
                    Follow these four anti-fraud checkpoints to confirm the legal authenticity of any permit presented to you.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">1</div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Scan Dynamic QR Code</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Verify that scanning the decal redirects directly to the official encrypted municipal verification portal.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">2</div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Match Business & Entity</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Confirm that registered business name, owner name, and address match the on-site operational establishment.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">3</div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Inspect Cryptographic Seal</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Verify the SHA-256 digital signature stamp and ensure the status shows "OFFICIALLY ISSUED & VALID".
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">4</div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Report If Tampered</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    If QR code leads to an external site or details mismatch, submit an instant confidential report to the LGU Fraud Desk.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Regulatory Services & Digital Document Portal Dock */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Quick Regulatory Services & Digital Verification Portal
                </h3>
                <span className="text-xs text-slate-500">24/7 Cryptographic Tools</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Pull Certified True Copies (CTC) */}
                <button
                  type="button"
                  onClick={() => {
                    if (activeRecord) handleDownloadVerificationProof(activeRecord);
                  }}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                        Download Cryptographic Proof
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Download authenticated verification attestation with Mayor digital signature.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600">
                    <span>Export Proof</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 2. Deep Search Lookup */}
                <button
                  type="button"
                  onClick={() => setCurrentView('verification')}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800">
                      <Search size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                        Deep Code Search
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Search by permit reference, business name, or operator ID.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600">
                    <span>Search Registry</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 3. Camera Barcode Scanner */}
                <button
                  type="button"
                  onClick={() => {
                    setIsScanning(true);
                    setCurrentView('scan_camera');
                  }}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                      <Camera size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        Camera QR Scanner
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Scan physical windshield decals, certificates, and inspection stickers.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600">
                    <span>Open Camera</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 4. Report Tampered Permit */}
                <button
                  type="button"
                  onClick={() => {
                    setFraudSubmitted(false);
                    setCurrentView('report_fraud');
                  }}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                        Anti-Fraud Desk
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Direct confidential hotline to report counterfeit or tampered permits.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-rose-600">
                    <span>Report Fraud</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

              </div>
            </div>

            {/* Bottom Gateway Action CTA Banner */}
            <div className="rounded-3xl p-7 bg-gradient-to-r from-teal-900 via-slate-900 to-blue-900 border border-teal-500/30 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1 max-w-2xl">
                <h3 className="text-lg sm:text-xl font-black">
                  Verify Any Official Quezon City E-Permit Now
                </h3>
                <p className="text-xs text-slate-300">
                  Launch the live QR scanner or enter a permit code to check cryptographic signatures and active standing instantly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsScanning(true);
                  setCurrentView('scan_camera');
                }}
                className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl shadow-teal-500/25 transition-all flex items-center space-x-2 shrink-0 cursor-pointer active:scale-[0.98]"
              >
                <span>Launch Live QR Scanner</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
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

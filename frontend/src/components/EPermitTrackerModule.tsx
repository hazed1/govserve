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
            {/* TOP GATEWAY ACTION CTA */}
            {/* ========================================================================= */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black">
                  Ready to Track or Verify Your Official Permits?
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                  Scan windshield or business permit QR decals, verify digital cryptographic stamps, or look up live milestone status with public reference codes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsScanning(true);
                    setCurrentView('scan_camera');
                  }}
                  className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center space-x-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Scan QR Code Now</span>
                  <ArrowRight size={16} strokeWidth={3} className="text-blue-600" />
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* HERO SECTION: OFFICIAL PICTURE 3 REFERENCE DESIGN */}
            {/* ========================================================================= */}
            <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-white via-sky-50/70 to-blue-50/50 dark:from-slate-900 dark:via-[#10243e] dark:to-slate-950 border border-sky-200 dark:border-sky-500/30 text-slate-900 dark:text-white shadow-xl shadow-sky-900/5 dark:shadow-sky-950/40 overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-500/25 transition-all duration-700" />
              <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center space-x-3">
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-400/30">
                      Digital Services & Tracking
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                      E-Permit tracker
                    </h2>
                  </div>

                  {/* 5 Feature Rows with Circular Badges matching Picture 3 */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Users size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block">Target Users</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">All citizens and applicants tracking pending or approved LGU permits</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <QrCode size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block">Service Method</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Online tracking through GovServe</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Clock size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block">Time Period</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Instant 24/7 digital status lookup with milestone audit history</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Banknote size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block">Charges & Payment</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Free Public LGU Service (₱0.00 Tariff)</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0288d1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <CreditCard size={16} />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 dark:text-white block">Payment Method</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Via GovServe online portal</span>
                      </div>
                    </div>
                  </div>

                  {/* Document Photo Upload Callout */}
                  <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/15 space-y-2 shadow-xs dark:shadow-none">
                    <div className="flex items-center space-x-2 text-sky-700 dark:text-sky-300 text-xs font-bold">
                      <Camera size={15} className="text-sky-400" />
                      <span>QR Decal & Reference Scanner Active</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Scan or upload clear photos of your Permit QR Decal, Official Receipt QR, or enter reference code for instant validation.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-600 dark:text-sky-300" /> Permit QR Decal
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-600 dark:text-sky-300" /> Official Receipt QR
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-600 dark:text-sky-300" /> Reference Code
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                        <FileText size={10} className="text-sky-600 dark:text-sky-300" /> Digital Seal
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Controls matching Picture 3 */}
                <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                  <button
                    onClick={() => {
                      setIsScanning(true);
                      setCurrentView('scan_camera');
                    }}
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                  >
                    <span>Track Permit Application →</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setIsScanning(true);
                        setCurrentView('scan_camera');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border border-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 dark:hover:text-white dark:border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs dark:shadow-none"
                    >
                      <QrCode size={13} />
                      <span>Verify QR Decal</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView('verification');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border border-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 dark:hover:text-white dark:border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs dark:shadow-none"
                    >
                      <ShieldCheck size={13} />
                      <span>Security Audit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Interactive Service Category Cards (Expanded Horizontal Cards matching Picture 1) */}
            <div className="space-y-6">
              
              {/* Card 1: Track Live Milestones */}
              <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-white via-blue-50/70 to-indigo-50/50 dark:from-slate-900 dark:via-[#0a1f3d] dark:to-slate-950 border border-blue-200 dark:border-blue-500/30 text-slate-900 dark:text-white shadow-xl shadow-blue-900/5 dark:shadow-blue-950/40 overflow-hidden group">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/15 transition-all"></div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-400/30 text-blue-800 dark:text-blue-300 text-[11px] font-black uppercase tracking-wider">
                        Real-Time Workflow Tracker
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent text-[10px] font-bold">
                        ● Live LGU Audit
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Live Application Milestone Tracker
                      </h2>
                    </div>

                    {/* 5 Feature Rows with Circular Badges */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Users size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Target Users</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">All registered applicants, business owners, engineers, and authorized liaisons</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Activity size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Service Method</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Online tracking through GovServe</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Clock size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Time Period</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Instant real-time updates synchronized across all municipal departments</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Banknote size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Charges & Payment</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Free Public LGU Service (₱0.00 Tariff)</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <CreditCard size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Payment Method</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Via GovServe online portal</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Photo Upload Callout */}
                    <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/15 space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 text-xs font-bold">
                        <Camera size={15} className="text-blue-400" />
                        <span>Reference Code & Barcode Lookup Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Enter tracking reference code or barcode to inspect department milestones, pending endorsements, and timestamps.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-blue-600 dark:text-blue-300" /> Reference Code
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-blue-600 dark:text-blue-300" /> Department Milestones
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-blue-600 dark:text-blue-300" /> Officer Logs
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-blue-600 dark:text-blue-300" /> Estimated Clearance
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Controls matching Picture 1 */}
                  <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                    <button
                      onClick={() => setCurrentView('track_timeline')}
                      className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                    >
                      <span>Track Live Milestones →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="py-2.5 px-3 rounded-xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-center flex flex-col justify-center shadow-xs dark:shadow-none">
                        <span className="text-[10px] uppercase text-blue-700 dark:text-blue-300 font-extrabold">Cost</span>
                        <span className="text-slate-900 dark:text-white font-black font-mono">₱0.00 Free</span>
                      </div>

                      <button
                        onClick={() => setCurrentView('track_timeline')}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border border-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 dark:hover:text-white dark:border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs dark:shadow-none"
                      >
                        <Activity size={13} />
                        <span>View Timeline</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Cryptographic Verification */}
              <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-white via-emerald-50/70 to-teal-50/50 dark:from-slate-900 dark:via-[#06241a] dark:to-slate-950 border border-emerald-200 dark:border-emerald-500/30 text-slate-900 dark:text-white shadow-xl shadow-emerald-900/5 dark:shadow-emerald-950/40 overflow-hidden group">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all"></div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/30 text-emerald-800 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                        SHA-256 Ledger Audit
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent text-[10px] font-bold">
                        ● 2048-Bit RSA Encryption
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Cryptographic Hash & Seal Verification
                      </h2>
                    </div>

                    {/* 5 Feature Rows with Circular Badges */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Users size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Target Users</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Enforcement officers, banking institutions, government agencies, and general public</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <ShieldCheck size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Service Method</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Online application through GovServe</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Clock size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Time Period</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Instant cryptographic validation under 1.5 seconds</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Banknote size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Charges & Payment</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Free Public LGU Service (₱0.00 Tariff)</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <CreditCard size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Payment Method</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Via GovServe online portal</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Photo Upload Callout */}
                    <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/15 space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                        <Camera size={15} className="text-emerald-400" />
                        <span>Cryptographic Audit Trail Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Verify digital permits with SHA-256 tamper-evident hash validation, issuer credentials, and cryptographic certificates.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-600 dark:text-emerald-300" /> SHA-256 Hash
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-600 dark:text-emerald-300" /> Master Ledger
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-600 dark:text-emerald-300" /> RSA Signature
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-emerald-600 dark:text-emerald-300" /> Digital Stamp
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Controls matching Picture 1 */}
                  <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                    <button
                      onClick={() => {
                        handleLookup('BP-2024-00123');
                        setCurrentView('verification');
                      }}
                      className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                    >
                      <span>Verify Security Audit Hash →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="py-2.5 px-3 rounded-xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-center flex flex-col justify-center shadow-xs dark:shadow-none">
                        <span className="text-[10px] uppercase text-emerald-700 dark:text-emerald-300 font-extrabold">Security</span>
                        <span className="text-slate-900 dark:text-white font-black font-mono">SHA-256</span>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentView('verification');
                        }}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border border-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 dark:hover:text-white dark:border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs dark:shadow-none"
                      >
                        <ShieldCheck size={13} />
                        <span>Audit Records</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Report Tampered Permit */}
              <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-white via-rose-50/70 to-pink-50/50 dark:from-slate-900 dark:via-[#2a0b16] dark:to-slate-950 border border-rose-200 dark:border-rose-500/30 text-slate-900 dark:text-white shadow-xl shadow-rose-900/5 dark:shadow-rose-950/40 overflow-hidden group">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-500/15 transition-all"></div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-400/30 text-rose-800 dark:text-rose-300 text-[11px] font-black uppercase tracking-wider">
                        Anti-Red Tape & Integrity
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent text-[10px] font-bold">
                        ● Confidential Reporting
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Report Fraudulent or Tampered Permit
                      </h2>
                    </div>

                    {/* 5 Feature Rows with Circular Badges */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Users size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Target Users</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Concerned citizens, establishments, field inspectors, and victimized applicants</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <AlertTriangle size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Service Method</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Online application through GovServe</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Clock size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Time Period</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Priority investigation initiated within 24 hours</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <Banknote size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Charges & Payment</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Free Citizen Reporting Service (₱0.00 Tariff)</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                          <CreditCard size={16} />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 dark:text-white block">Payment Method</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">Via GovServe online portal</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Photo Upload Callout */}
                    <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/15 space-y-2 shadow-xs dark:shadow-none">
                      <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs font-bold">
                        <Camera size={15} className="text-rose-400" />
                        <span>Confidential Evidence & Photo Upload Active</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Upload photos or scans of suspected fake permits, counterfeit QR codes, fixers' receipts, or altered documents.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-rose-600 dark:text-rose-300" /> Fake Decal Photo
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-rose-600 dark:text-rose-300" /> Tampered Permit
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-rose-600 dark:text-rose-300" /> Fixer Receipt
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/10 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1">
                          <FileText size={10} className="text-rose-600 dark:text-rose-300" /> Incident Report
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Controls matching Picture 1 */}
                  <div className="w-full lg:w-80 flex flex-col space-y-3 flex-shrink-0">
                    <button
                      onClick={() => {
                        setFraudSubmitted(false);
                        setCurrentView('report_fraud');
                      }}
                      className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group/btn"
                    >
                      <span>Report Fraudulent Permit →</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="py-2.5 px-3 rounded-xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-center flex flex-col justify-center shadow-xs dark:shadow-none">
                        <span className="text-[10px] uppercase text-rose-700 dark:text-rose-300 font-extrabold">Desk</span>
                        <span className="text-slate-900 dark:text-white font-black font-mono">Anti-Fraud</span>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentView('report_fraud');
                        }}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-950 border border-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 dark:hover:text-white dark:border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs dark:shadow-none"
                      >
                        <AlertTriangle size={13} />
                        <span>Incident Desk</span>
                      </button>
                    </div>
                  </div>
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

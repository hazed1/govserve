import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Building,
  FileText, 
  RotateCw, 
  Edit3, 
  CreditCard, 
  Calendar, 
  Search, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  FileCheck, 
  Layers, 
  Clock, 
  Upload, 
  QrCode, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Shield, 
  Award, 
  Lock, 
  Info, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Printer, 
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Receipt,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Landmark,
  Home
} from 'lucide-react';
import { TabType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './ui/LanguageToggle';

interface BusinessPermitModuleProps {
  onNavigateToTab?: (tab: TabType) => void;
  onAddNewApplication?: (applicantName: string, permitType?: string) => void;
  onNavigateToDashboard?: () => void;
}

type MainViewMode = 
  | 'preview'
  | 'hub' 
  | 'new_app' 
  | 'renewal' 
  | 'amendment' 
  | 'pay_tax' 
  | 'special_permit' 
  | 'ctc_pulling' 
  | 'verification' 
  | 'safe_seal';

export const BusinessPermitModule: React.FC<BusinessPermitModuleProps> = ({
  onNavigateToTab,
  onAddNewApplication,
  onNavigateToDashboard
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const isAdmin = user?.role === 'admin';
  const [currentView, setCurrentView] = useState<MainViewMode>('preview');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // =========================================================================
  // CARD 1: APPLICATION ONLINE - STATE MANAGEMENT
  // =========================================================================
  
  // 1. New Application (7-Step Wizard)
  const [newAppStep, setNewAppStep] = useState<number>(1);
  const [newAppTermsAccepted, setNewAppTermsAccepted] = useState<boolean>(false);
  const [newAppData, setNewAppData] = useState({
    dtiSecNo: 'DTI-NCR-2025-99214',
    tin: '123-456-789-000',
    businessName: 'Apex Innovations Retail Hub',
    tradeName: 'Apex Innovations',
    orgType: 'Sole Proprietorship',
    unitNo: 'Unit 402, 4th Floor',
    street: '123 Ayala Avenue',
    barangay: 'Barangay San Antonio',
    city: 'Quezon City',
    province: 'Metro Manila',
    zipCode: '1105',
    floorArea: '120.5',
    ownershipType: 'Rented',
    lessorName: 'Ayala Commercial Land Corp.',
    lessorContact: '+63 917 123 4567',
    employeeCount: '8',
    deliveryVehicles: '2',
    lineOfBusiness: 'Retail of Consumer Electronics & Accessories',
    psicCode: '4741 - Retail sale of information and communication equipment',
    capitalInvestment: '1,500,000.00',
    natureOfActivity: 'Commercial Retail & After-sales Service',
    emergencyContactName: 'Maria Santos',
    emergencyContactPhone: '+63 918 987 6543',
    environmentalCertNo: 'ECC-NCR-2024-8841'
  });
  const [newAppSuccessRef, setNewAppSuccessRef] = useState<string | null>(null);

  // 2. Renewal State
  const [renewalPermitNo, setRenewalPermitNo] = useState<string>('BP-2024-00123');
  const [renewalOrNo, setRenewalOrNo] = useState<string>('OR-2024-88491');
  const [renewalRecord, setRenewalRecord] = useState<any>(null);
  const [renewalGrossSales, setRenewalGrossSales] = useState<string>('2,850,000.00');
  const [renewalSubmitted, setRenewalSubmitted] = useState<boolean>(false);

  // 3. Amendment State
  const [amendPermitNo, setAmendPermitNo] = useState<string>('BP-2024-00123');
  const [amendOrNo, setAmendOrNo] = useState<string>('OR-2024-88491');
  const [amendRecord, setAmendRecord] = useState<any>(null);
  const [amendmentType, setAmendmentType] = useState<'trade_name' | 'address' | 'line_of_business' | 'ownership'>('trade_name');
  const [amendedValue, setAmendedValue] = useState<string>('Apex Global Tech & Retail Enterprise');
  const [amendProofFile, setAmendProofFile] = useState<string | null>('DTI_Amended_Certificate_2025.pdf');
  const [amendSubmitted, setAmendSubmitted] = useState<boolean>(false);

  // 4. Pay Business Tax State
  const [taxBin, setTaxBin] = useState<string>('BP-2024-00123');
  const [taxPaymentMethod, setTaxPaymentMethod] = useState<'gcash' | 'maya' | 'landbank' | 'eprovider'>('gcash');
  const [taxPaymentReceipt, setTaxPaymentReceipt] = useState<any>(null);
  const [isProcessingTax, setIsProcessingTax] = useState<boolean>(false);

  // 5. Special Permit (Short Term / Event) State
  const [specialStep, setSpecialStep] = useState<number>(1);
  const [specialTermsAccepted, setSpecialTermsAccepted] = useState<boolean>(false);
  const [specialData, setSpecialData] = useState({
    businessName: 'Apex Innovations Retail Hub',
    eventTitle: 'QC Mid-Year Tech Expo & Electronics Bazaar 2025',
    venue: 'Quezon City Memorial Circle Grand Pavilion',
    startDate: '2025-09-15',
    endDate: '2025-09-20',
    operatingHours: '09:00 AM - 09:00 PM',
    expectedAttendees: '5,000 attendees / day',
    organizerName: 'Juan Dela Cruz',
    organizerContact: '+63 917 888 1234',
    boothCount: '45 display booths'
  });
  const [specialSubmitted, setSpecialSubmitted] = useState<boolean>(false);

  // Status Search State
  const [statusSearchCode, setStatusSearchCode] = useState<string>('');
  const [statusSearchResult, setStatusSearchResult] = useState<any>(null);

  // Request for E-Copy Modal State
  const [ecopyModalOpen, setEcopyModalOpen] = useState<boolean>(false);
  const [ecopyPermitNo, setEcopyPermitNo] = useState<string>('BP-2024-00123');
  const [ecopyGenerated, setEcopyGenerated] = useState<boolean>(false);

  // =========================================================================
  // CARD 2: BUSINESS INFORMATION SYSTEM (CTC PULLING) - STATE MANAGEMENT
  // =========================================================================
  const [ctcStep, setCtcStep] = useState<number>(1);
  const [ctcPermitNo, setCtcPermitNo] = useState<string>('BP-2024-00123');
  const [ctcBusinessName, setCtcBusinessName] = useState<string>('Apex Innovations Retail Hub');
  const [ctcRequestorName, setCtcRequestorName] = useState<string>(user?.name || 'Juan Dela Cruz');
  const [ctcRequestorContact, setCtcRequestorContact] = useState<string>('+63 917 555 4321');
  const [ctcRequestorEmail, setCtcRequestorEmail] = useState<string>(user?.email || 'juan.delacruz@govserve.ph');
  const [ctcIdType, setCtcIdType] = useState<string>('Philippine National ID (PhilID)');
  const [ctcIdNumber, setCtcIdNumber] = useState<string>('1234-5678-9012-3456');
  const [ctcRelation, setCtcRelation] = useState<string>('Business Owner / Registered Proprietor');
  const [ctcSelectedDocs, setCtcSelectedDocs] = useState<string[]>([
    'Certified True Copy of Mayor\'s Permit (Current Year)'
  ]);
  const [ctcPrivacyAgreed, setCtcPrivacyAgreed] = useState<boolean>(true);
  const [ctcIdUploaded, setCtcIdUploaded] = useState<boolean>(true);
  const [ctcReqRef, setCtcReqRef] = useState<string>('CTC-REQ-2025-00892');
  const [ctcAdminConfirmed, setCtcAdminConfirmed] = useState<boolean>(true);
  const [ctcAssessmentNo, setCtcAssessmentNo] = useState<string>('OP-CTC-2025-8842');
  const [ctcPaymentMethod, setCtcPaymentMethod] = useState<'gcash' | 'maya' | 'landbank' | 'card'>('gcash');
  const [ctcPaid, setCtcPaid] = useState<boolean>(false);
  const [ctcOrNo, setCtcOrNo] = useState<string>('OR-CTC-2025-77291');
  const [ctcIsProcessingPayment, setCtcIsProcessingPayment] = useState<boolean>(false);

  // =========================================================================
  // CARD 3: MAYOR'S PERMIT VERIFICATION - STATE MANAGEMENT
  // =========================================================================
  const [verifQuery, setVerifQuery] = useState<string>('BP-2024-00123');
  const [verifResult, setVerifResult] = useState<any>({
    permitNumber: 'BP-2024-00123',
    bin: 'BIN-QC-2024-88319',
    businessName: 'Apex Innovations Retail Hub',
    tradeName: 'Apex Innovations',
    ownerName: 'Juan Dela Cruz',
    address: 'Unit 402, 4th Floor, 123 Ayala Avenue, Brgy. San Antonio, QC',
    status: 'ACTIVE & VALID',
    validUntil: 'December 31, 2025',
    fsicStatus: 'COMPLIANT (FSIC-2025-00412)',
    sanitaryStatus: 'COMPLIANT (SAN-2025-9912)',
    zoningStatus: 'APPROVED (ZON-2025-441)',
    birTin: '123-456-789-000',
    qrHash: 'a7f92e3184bc912389adfe66201a4bc5'
  });
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // =========================================================================
  // CARD 4: SAFE SEAL (QC SAFE SEAL CERTIFICATION) - STATE MANAGEMENT
  // =========================================================================
  const [safePermitNo, setSafePermitNo] = useState<string>('BP-2024-00123');
  const [safeValidated, setSafeValidated] = useState<boolean>(true);
  const [safeFormData, setSafeFormData] = useState({
    businessName: 'Apex Innovations Retail Hub',
    address: 'Unit 402, 4th Floor, 123 Ayala Avenue, Brgy. San Antonio, QC',
    category: 'Commercial Retail / Electronics',
    employeeCount: '8 Employees',
    operatingHours: '09:00 AM - 09:00 PM',
    contactPerson: 'Juan Dela Cruz (General Manager)',
    contactNumber: '+63 917 123 4567',
    checklist: {
      antiTraffickingPolicy: true,
      hotlineSignagesPosted: true,
      employeeBackgroundVerified: true,
      cctvMonitoringPublicAreas: true,
      genderResponsiveWorkplace: true
    }
  });
  const [safeSealIssued, setSafeSealIssued] = useState<boolean>(false);

  // Copy helper
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* ========================================================================= */}
      {/* 1. STANDALONE TOP HEADER BAR (Hidden in Admin Mode) */}
      {/* ========================================================================= */}
      {!isAdmin && (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs px-4 sm:px-8 py-3.5 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left: Branding & Back to Portal */}
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
                  Mayor's Permit & Business Licensing Hub
                </p>
              </div>
            </div>

            {/* Right: Quick Action Controls, Dark Mode & Profile */}
            <div className="flex items-center space-x-3">
              


              {/* Home Navigation Button */}
              <button
                onClick={() => onNavigateToTab ? onNavigateToTab('Home') : setCurrentView('preview')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 shadow-xs"
                title={t('return_home', 'Return to Home Portal')}
              >
                <Home size={15} />
                <span>{t('home', 'Home')}</span>
              </button>

              {/* Language Switcher TL | EN Toggle */}
              <LanguageToggle />

              {/* Dark/Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={theme === 'dark' ? t('theme_light', 'Switch to Light Mode') : t('theme_dark', 'Switch to Dark Mode')}
              >
                {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
              </button>

              {/* Citizen Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pl-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
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
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email}</p>
                      {user?.citizenId && (
                        <div className="mt-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                          ID: {user.citizenId}
                        </div>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigateToTab?.('Home');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                      >
                        <Home size={14} className="text-blue-500" />
                        <span>Home Portal</span>
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigateToTab?.('Home');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                      >
                        <Clock size={14} className="text-amber-500" />
                        <span>My Applications Dashboard</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center space-x-2 cursor-pointer font-semibold"
                      >
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
        <div className="hidden dark:block absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden dark:block absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-3">
          {currentView !== 'preview' && (
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentView('preview')}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <ArrowLeft size={13} />
                <span>Return to Business Overview</span>
              </button>
            </div>
          )}

          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Business Permits & Licensing Portal
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Review official business regulatory fee schedules, municipal tax tariffs, and documentary prerequisites before filing your enterprise application.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN BODY CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-9">

        {/* ========================================================================= */}
        {/* PREVIEW PAGE: OFFICIAL BUSINESS FEE SCHEDULE & REGULATORY TARIFF GUIDE */}
        {/* ========================================================================= */}
        {currentView === 'preview' && (
          <div className="space-y-10 animate-in fade-in pb-10">
            


            {/* 4 Interactive Service Category Cards (Direct Action Functional Buttons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: New Mayor's Business Permit */}
              <button
                type="button"
                onClick={() => {
                  setNewAppStep(1);
                  setNewAppTermsAccepted(true);
                  setCurrentView('new_app');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer text-left group active:scale-[0.99]"
              >
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Building2 size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Step 1 Form</span>
                      <ChevronRight size={12} strokeWidth={3} />
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    New Business Permit
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    New Business Registration Wizard (7-Step Form) para sa Sole Proprietorship, Partnership, at Corporation.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between w-full">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Assessment</span>
                  <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">₱3,850.00</span>
                </div>
              </button>

              {/* Card 2: Annual Business License Renewal */}
              <button
                type="button"
                onClick={() => {
                  setRenewalSubmitted(false);
                  setCurrentView('renewal');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer text-left group active:scale-[0.99]"
              >
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <RotateCw size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Fast-Track</span>
                      <ChevronRight size={12} strokeWidth={3} />
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Annual License Renewal
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Annual License Renewal gamit ang inyong existing Permit No. at Official Receipt (OR) Number.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between w-full">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Annual Fee</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">₱3,850.00</span>
                </div>
              </button>

              {/* Card 3: Business Record Amendment */}
              <button
                type="button"
                onClick={() => {
                  setAmendSubmitted(false);
                  setCurrentView('amendment');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between hover:border-purple-500 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer text-left group active:scale-[0.99]"
              >
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center font-bold group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      <Edit3 size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Amend Form</span>
                      <ChevronRight size={12} strokeWidth={3} />
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Business Amendment
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Pagpapalit ng business address, trade name, line of business, o transfer of ownership.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between w-full">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Legal Tariff</span>
                  <span className="font-mono font-black text-purple-600 dark:text-purple-400 text-sm">₱1,500.00</span>
                </div>
              </button>

              {/* Card 4: Special Event & Short-Term Permit */}
              <button
                type="button"
                onClick={() => {
                  setSpecialSubmitted(false);
                  setCurrentView('special_permit');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between hover:border-amber-500 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer text-left group active:scale-[0.99]"
              >
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center font-bold group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Calendar size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Get Permit</span>
                      <ChevronRight size={12} strokeWidth={3} />
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Special Event Permit
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Temporary trade bazaar, commercial pop-up expo, concert showcase, at outdoor event clearance.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between w-full">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Standard Pass</span>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">₱1,200.00</span>
                </div>
              </button>

            </div>

            {/* ========================================================================= */}
            {/* SECTION: ITEMIZED FEE SCHEDULE TABLES */}
            {/* ========================================================================= */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="text-blue-500" size={20} />
                    <span>Official Business Regulatory Tariff Schedules</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Breakdown of municipal taxes and regulatory clearances mandated under the Quezon City Revenue Code (SP-1944)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Table 1: New Business Permit & Annual License */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <h4 className="font-black text-slate-900 dark:text-white text-sm">
                          1. New Business Permit & Annual License
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500">Standard municipal assessment schedule per registered business</p>
                    </div>
                    <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-base">
                      ₱3,850.00
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                          <th className="pb-2 font-bold">Code</th>
                          <th className="pb-2 font-bold">Assessment Component</th>
                          <th className="pb-2 font-bold hidden sm:table-cell">Legal Basis</th>
                          <th className="pb-2 font-bold text-right">Fee</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11px]">
                        <tr>
                          <td className="py-2 font-mono text-slate-400">BPLD-01</td>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Mayor's Permit & Licensing Fee</td>
                          <td className="py-2 text-slate-500 hidden sm:table-cell">QC Revenue Code Sec. 18</td>
                          <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱1,500.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-slate-400">BPLD-02</td>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Business Tax & Initial Assessment</td>
                          <td className="py-2 text-slate-500 hidden sm:table-cell">QC Local Tax Tariff</td>
                          <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱1,000.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-slate-400">BPLD-03</td>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Sanitary Inspection & Health Clearance Fee</td>
                          <td className="py-2 text-slate-500 hidden sm:table-cell">City Health Department</td>
                          <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱400.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-slate-400">BPLD-04</td>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Fire Safety Inspection Certificate (FSIC)</td>
                          <td className="py-2 text-slate-500 hidden sm:table-cell">Republic Act No. 9514</td>
                          <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱500.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-slate-400">BPLD-05</td>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Zoning & Locational Clearance Fee</td>
                          <td className="py-2 text-slate-500 hidden sm:table-cell">City Planning & Dev. Office</td>
                          <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱250.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-slate-400">BPLD-06</td>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Environmental & Solid Waste Management Fee</td>
                          <td className="py-2 text-slate-500 hidden sm:table-cell">QC EPWMD Compliance</td>
                          <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱150.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-slate-400">BPLD-07</td>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Legal Research Fund (LRF)</td>
                          <td className="py-2 text-slate-500 hidden sm:table-cell">Republic Act No. 3870</td>
                          <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱50.00</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold text-xs">
                          <td colSpan={2} className="pt-3 text-slate-900 dark:text-white">Total Assessment</td>
                          <td className="pt-3 hidden sm:table-cell text-slate-400 font-normal text-[10px]">All 7 Components</td>
                          <td className="pt-3 text-right font-mono text-blue-600 dark:text-blue-400 text-sm">₱3,850.00</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Table 2: Business Amendment & Special Event Clearances */}
                <div className="space-y-6">
                  
                  {/* Amendment Table */}
                  <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                          <h4 className="font-black text-slate-900 dark:text-white text-sm">
                            2. Business Amendment & Record Modification
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500">Change of address, trade name, business line, or owner</p>
                      </div>
                      <span className="font-mono font-black text-purple-600 dark:text-purple-400 text-base">
                        ₱1,500.00
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                            <th className="pb-2 font-bold">Code</th>
                            <th className="pb-2 font-bold">Component</th>
                            <th className="pb-2 font-bold text-right">Fee</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11px]">
                          <tr>
                            <td className="py-2 font-mono text-slate-400">AMD-01</td>
                            <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Amendment Filing & Record Verification</td>
                            <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱500.00</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-slate-400">AMD-02</td>
                            <td className="py-2 font-medium text-slate-800 dark:text-slate-200">New Mayor's Permit Certificate Issuance</td>
                            <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱400.00</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-slate-400">AMD-03</td>
                            <td className="py-2 font-medium text-slate-800 dark:text-slate-200">On-Site Joint Inspection & Validation Fee</td>
                            <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱450.00</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-slate-400">AMD-04</td>
                            <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Legal Research Fund (LRF)</td>
                            <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱150.00</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold text-xs">
                            <td colSpan={2} className="pt-3 text-slate-900 dark:text-white">Total Amendment Assessment</td>
                            <td className="pt-3 text-right font-mono text-purple-600 dark:text-purple-400 text-sm">₱1,500.00</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Special Event Table */}
                  <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <h4 className="font-black text-slate-900 dark:text-white text-sm">
                            3. Special Event & Short-Term Trade Clearance
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500">Temporary commercial clearance for bazaars & pop-up expos</p>
                      </div>
                      <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-base">
                        ₱1,200.00
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                            <th className="pb-2 font-bold">Code</th>
                            <th className="pb-2 font-bold">Component</th>
                            <th className="pb-2 font-bold text-right">Fee</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11px]">
                          <tr>
                            <td className="py-2 font-mono text-slate-400">STP-01</td>
                            <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Special Event Commercial Clearance</td>
                            <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱650.00</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-slate-400">STP-02</td>
                            <td className="py-2 font-medium text-slate-800 dark:text-slate-200">DPOS Crowd & Traffic Management Surcharge</td>
                            <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱400.00</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-slate-400">STP-03</td>
                            <td className="py-2 font-medium text-slate-800 dark:text-slate-200">Legal Research Fund (LRF)</td>
                            <td className="py-2 font-mono font-semibold text-right text-slate-900 dark:text-slate-100">₱150.00</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold text-xs">
                            <td colSpan={2} className="pt-3 text-slate-900 dark:text-white">Total Special Event Assessment</td>
                            <td className="pt-3 text-right font-mono text-amber-600 dark:text-amber-400 text-sm">₱1,200.00</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION: MANDATORY DOCUMENTARY CHECKLIST */}
            {/* ========================================================================= */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="text-blue-500" size={20} />
                  <span>Mandatory Documentary Checklist Before Business Filing</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Prepare scanned or digital copies of these required legal documents before initiating your transaction
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">DTI / SEC Registration</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Valid DTI Certificate of Business Name Registration or SEC Certificate of Articles of Incorporation.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Barangay Business Clearance</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Official Barangay Clearance issued by the host barangay where the commercial business operates.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Contract of Lease / TCT</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Notarized Contract of Lease, Certificate of Title (TCT), or Tax Declaration of the business premises.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">CGLI Insurance Policy</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Comprehensive General Liability Insurance (CGLI) policy covering third-party liabilities and patrons.
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION: QUICK REGULATORY SERVICES & DIGITAL VERIFICATION */}
            {/* ========================================================================= */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="text-blue-500" size={20} />
                  <span>Quick Regulatory Services & Digital Document Portal</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Instant document verification, Certified True Copy (CTC) pulling, Safe Seal application, and tax settlement
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* BIS / CTC Pulling */}
                <button
                  type="button"
                  onClick={() => {
                    setCtcStep(1);
                    setCtcPaid(false);
                    setCurrentView('ctc_pulling');
                  }}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                    <Layers size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    Pull Certified True Copies (CTC)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Official watermarked digital copies of Mayor's Permit, Tax Assessments, and Closures.
                  </p>
                </button>

                {/* Permit Verification */}
                <button
                  type="button"
                  onClick={() => setCurrentView('verification')}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    Mayor's Permit Verification
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Real-time legal standing, FSIC, Sanitary, and Zoning compliance lookup.
                  </p>
                </button>

                {/* Pay Tax */}
                <button
                  type="button"
                  onClick={() => {
                    setTaxPaymentReceipt(null);
                    setCurrentView('pay_tax');
                  }}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                    <CreditCard size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    Pay Business Tax & Dues
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Settle quarterly business tax and local assessment fees online with instant e-Receipt.
                  </p>
                </button>

                {/* Safe Seal */}
                <button
                  type="button"
                  onClick={() => {
                    setSafeSealIssued(false);
                    setCurrentView('safe_seal');
                  }}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                    <Award size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    QC Safe Seal Decal
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Apply for the official Stop All Forms of Exploitation (SAFE) Seal and downloadable QR decal.
                  </p>
                </button>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* BOTTOM GATEWAY ACTION CTA */}
            {/* ========================================================================= */}
            <div className="rounded-3xl p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black">
                  Ready to Start Your Business Permit Application?
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                  Proceed to register a new commercial enterprise, renew your existing license, or file business record amendments.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setNewAppStep(1);
                    setNewAppTermsAccepted(true);
                    setCurrentView('new_app');
                  }}
                  className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center space-x-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Start New Application</span>
                  <ArrowRight size={16} strokeWidth={3} className="text-blue-600" />
                </button>
              </div>
            </div>

          </div>
        )}

              {/* ========================================================================= */}
      {/* SUB-VIEW 1: NEW APPLICATION (7-STEP WIZARD) */}
      {/* ========================================================================= */}
      {currentView === 'new_app' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-7 animate-in fade-in">
          
          {/* Stepper Bar */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                New Business Permit Application • Step {newAppStep} of 7
              </span>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline">
                  {newAppStep === 1 && 'Application Requirements'}
                  {newAppStep === 2 && 'Basic Documentary Requirements'}
                  {newAppStep === 3 && 'Business Information & Registration'}
                  {newAppStep === 4 && 'Business Operation'}
                  {newAppStep === 5 && 'Business Activity'}
                  {newAppStep === 6 && 'Other Required Information'}
                  {newAppStep === 7 && 'Summary & Submission'}
                </span>
              </div>
            </div>

            {/* Step Pills */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <button
                  key={s}
                  onClick={() => setNewAppStep(s)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    s <= newAppStep ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: Application Requirements */}
          {newAppStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Step 1: Application Requirements & General Guidelines
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Review the mandatory documentary requirements before initiating your commercial registration.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <FileText size={15} className="text-blue-600" />
                    <span>Primary Government Registrations</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>DTI Certificate for Sole Proprietorship / SEC Articles for Corp</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Barangay Business Clearance from jurisdiction barangay</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Bureau of Internal Revenue (BIR) TIN Registration</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <Building size={15} className="text-amber-600" />
                    <span>Locational & Building Clearances</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Contract of Lease (if rented) or Land Title / Tax Dec (if owned)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Locational / Zoning Compliance Clearance</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <span>Fire Safety Inspection Certificate (FSIC) from BFP</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setNewAppStep(2)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <span>Proceed to Documentary Terms</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Basic Documentary Requirements (Terms & Conditions) */}
          {newAppStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Step 2: Basic Documentary Requirements & Anti-Fixer Declaration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Confirm consent under Republic Act 10173 (Data Privacy Act) and RA 11032 (Ease of Doing Business Act).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-3 leading-relaxed max-h-60 overflow-y-auto">
                <p className="font-bold text-slate-900 dark:text-white">TERMS AND CONDITIONS OF ONLINE PERMITTING:</p>
                <p>1. <strong>Truthfulness of Information:</strong> The applicant certifies under penalty of perjury that all submitted information and uploaded documents are genuine, authentic, and accurate representations of the commercial establishment.</p>
                <p>2. <strong>Data Privacy Consent:</strong> In compliance with the Data Privacy Act of 2012 (RA 10173), you authorize the Local Government Unit (LGU) and designated regulatory departments (BFP, Sanitary, Zoning, Treasury) to process your data solely for business permit assessment.</p>
                <p>3. <strong>Anti-Fixer Policy:</strong> Pursuant to RA 11032, transactions are strictly direct without fixers. All fees are paid directly through official LGU channels.</p>
              </div>

              <label className="flex items-center space-x-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAppTermsAccepted}
                  onChange={(e) => setNewAppTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>I have read, understood, and accept the Basic Documentary Terms & Data Privacy Policy</span>
              </label>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setNewAppStep(1)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Back
                </button>
                <button
                  disabled={!newAppTermsAccepted}
                  onClick={() => setNewAppStep(3)}
                  className="px-6 py-2.5 bg-blue-600 disabled:opacity-50 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <span>Business Information</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Business Information & Registration */}
          {newAppStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Step 3: Business Information & Registration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Enter official enterprise legal particulars as registered with DTI, SEC, or CDA.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">DTI / SEC / CDA Registration No.</label>
                  <input
                    type="text"
                    value={newAppData.dtiSecNo}
                    onChange={(e) => setNewAppData({...newAppData, dtiSecNo: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tax Identification Number (TIN)</label>
                  <input
                    type="text"
                    value={newAppData.tin}
                    onChange={(e) => setNewAppData({...newAppData, tin: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Registered Business Legal Name</label>
                  <input
                    type="text"
                    value={newAppData.businessName}
                    onChange={(e) => setNewAppData({...newAppData, businessName: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Trade Name / Franchised Name</label>
                  <input
                    type="text"
                    value={newAppData.tradeName}
                    onChange={(e) => setNewAppData({...newAppData, tradeName: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Form of Organization</label>
                  <select
                    value={newAppData.orgType}
                    onChange={(e) => setNewAppData({...newAppData, orgType: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option>Sole Proprietorship</option>
                    <option>Partnership</option>
                    <option>Corporation</option>
                    <option>One Person Corporation (OPC)</option>
                    <option>Cooperative</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setNewAppStep(2)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer">
                  Back
                </button>
                <button onClick={() => setNewAppStep(4)} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer">
                  <span>Business Operation</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Business Operation */}
          {newAppStep === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Step 4: Business Operation & Physical Location
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Specify your physical premises, jurisdiction barangay, floor area, and employee counts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Unit / Floor / Building</label>
                  <input
                    type="text"
                    value={newAppData.unitNo}
                    onChange={(e) => setNewAppData({...newAppData, unitNo: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Street Address</label>
                  <input
                    type="text"
                    value={newAppData.street}
                    onChange={(e) => setNewAppData({...newAppData, street: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Barangay</label>
                  <input
                    type="text"
                    value={newAppData.barangay}
                    onChange={(e) => setNewAppData({...newAppData, barangay: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">City / Municipality & Zip</label>
                  <input
                    type="text"
                    value={`${newAppData.city} (${newAppData.zipCode})`}
                    disabled
                    className="w-full px-3 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs opacity-80"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Total Floor Area (sq. meters)</label>
                  <input
                    type="text"
                    value={newAppData.floorArea}
                    onChange={(e) => setNewAppData({...newAppData, floorArea: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Premises Ownership</label>
                  <select
                    value={newAppData.ownershipType}
                    onChange={(e) => setNewAppData({...newAppData, ownershipType: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option>Owned</option>
                    <option>Rented</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Total Number of Employees</label>
                  <input
                    type="number"
                    value={newAppData.employeeCount}
                    onChange={(e) => setNewAppData({...newAppData, employeeCount: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Delivery / Service Vehicles</label>
                  <input
                    type="number"
                    value={newAppData.deliveryVehicles}
                    onChange={(e) => setNewAppData({...newAppData, deliveryVehicles: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setNewAppStep(3)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer">
                  Back
                </button>
                <button onClick={() => setNewAppStep(5)} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer">
                  <span>Business Activity</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Business Activity */}
          {newAppStep === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Step 5: Business Activity & Capital Investment
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Declare your principal commercial activity, PSIC classification, and initial paid-up capital.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Principal Line of Business</label>
                  <input
                    type="text"
                    value={newAppData.lineOfBusiness}
                    onChange={(e) => setNewAppData({...newAppData, lineOfBusiness: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">PSIC Code / Industry Sector</label>
                  <input
                    type="text"
                    value={newAppData.psicCode}
                    onChange={(e) => setNewAppData({...newAppData, psicCode: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Capital Investment (PHP ₱)</label>
                    <input
                      type="text"
                      value={newAppData.capitalInvestment}
                      onChange={(e) => setNewAppData({...newAppData, capitalInvestment: e.target.value})}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Nature of Activity</label>
                    <input
                      type="text"
                      value={newAppData.natureOfActivity}
                      onChange={(e) => setNewAppData({...newAppData, natureOfActivity: e.target.value})}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setNewAppStep(4)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer">
                  Back
                </button>
                <button onClick={() => setNewAppStep(6)} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer">
                  <span>Other Information</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Other Required Information */}
          {newAppStep === 6 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Step 6: Other Required Information & Emergency Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Lessor information, emergency contacts, and environmental compliance certificates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Lessor / Building Owner Name</label>
                  <input
                    type="text"
                    value={newAppData.lessorName}
                    onChange={(e) => setNewAppData({...newAppData, lessorName: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Lessor Monthly Rental & Contact</label>
                  <input
                    type="text"
                    value={newAppData.lessorContact}
                    onChange={(e) => setNewAppData({...newAppData, lessorContact: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Emergency Contact Person</label>
                  <input
                    type="text"
                    value={newAppData.emergencyContactName}
                    onChange={(e) => setNewAppData({...newAppData, emergencyContactName: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Emergency Contact Phone Number</label>
                  <input
                    type="text"
                    value={newAppData.emergencyContactPhone}
                    onChange={(e) => setNewAppData({...newAppData, emergencyContactPhone: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Environmental Compliance Certificate (ECC / CNC No.)</label>
                  <input
                    type="text"
                    value={newAppData.environmentalCertNo}
                    onChange={(e) => setNewAppData({...newAppData, environmentalCertNo: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setNewAppStep(5)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer">
                  Back
                </button>
                <button onClick={() => setNewAppStep(7)} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer">
                  <span>Review & Summary</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Summary Page */}
          {newAppStep === 7 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Step 7: Application Summary & Submission
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Review your complete declaration before generating your official Application Reference Number.
                </p>
              </div>

              {/* Summary Spec Sheet */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-400 font-semibold">Business Name:</span>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{newAppData.businessName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Trade Name:</span>
                    <p className="font-bold text-slate-900 dark:text-white">{newAppData.tradeName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Organization Type:</span>
                    <p className="font-bold text-slate-900 dark:text-white">{newAppData.orgType}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">DTI/SEC Registration:</span>
                    <p className="font-bold text-slate-900 dark:text-white font-mono">{newAppData.dtiSecNo}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">TIN:</span>
                    <p className="font-bold text-slate-900 dark:text-white font-mono">{newAppData.tin}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Capital Investment:</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">₱{newAppData.capitalInvestment}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-semibold">Location Address:</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{newAppData.unitNo}, {newAppData.street}, {newAppData.barangay}, {newAppData.city}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Employees:</span>
                    <p className="font-bold text-slate-900 dark:text-white">{newAppData.employeeCount} Staff ({newAppData.deliveryVehicles} Vehicles)</p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center space-x-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                    Pre-assessment computed fee estimate: <strong>₱14,350.00</strong> (Local Business Tax, Mayor's Permit Fee, Garbage & FSIC).
                  </span>
                </div>
              </div>

              {/* Submission Result */}
              {newAppSuccessRef ? (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-3xl text-center space-y-3 animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Check size={24} />
                  </div>
                  <h4 className="text-base font-black text-emerald-900 dark:text-emerald-200">
                    Application Submitted Successfully!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Your new business permit filing has been submitted to the BPLO and Zoning office for assessment.
                  </p>
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    <span>Reference: {newAppSuccessRef}</span>
                    <button onClick={() => handleCopy(newAppSuccessRef)} className="hover:text-emerald-500 cursor-pointer">
                      {copiedText === newAppSuccessRef ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="pt-2 flex justify-center space-x-3">
                    <button
                      onClick={() => {
                        setTaxBin(newAppSuccessRef);
                        setCurrentView('pay_tax');
                      }}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Proceed to Pay Tax
                    </button>
                    <button
                      onClick={() => setCurrentView('preview')}
                      className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Back to Business Overview
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between pt-4">
                  <button onClick={() => setNewAppStep(6)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer">
                    Back
                  </button>
                  <button
                    onClick={() => {
                      const refCode = `BP-2025-${Math.floor(10000 + Math.random() * 90000)}`;
                      setNewAppSuccessRef(refCode);
                      if (onAddNewApplication) {
                        onAddNewApplication(newAppData.businessName, 'Business Permit (New)');
                      }
                    }}
                    className="px-7 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center space-x-2 cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>Submit New Application</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: RENEWAL */}
      {/* ========================================================================= */}
      {currentView === 'renewal' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <RotateCw size={18} className="text-blue-600" />
                <span>Business Permit Annual Renewal</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enter your Business Permit Number and Official Receipt (OR) Number to pull previous records and declare gross sales.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Business Permit Number (Applicant Input)</label>
              <input
                type="text"
                value={renewalPermitNo}
                onChange={(e) => setRenewalPermitNo(e.target.value)}
                placeholder="e.g. BP-2024-00123"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Previous Official Receipt (OR) Number</label>
              <input
                type="text"
                value={renewalOrNo}
                onChange={(e) => setRenewalOrNo(e.target.value)}
                placeholder="e.g. OR-2024-88491"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setRenewalRecord({
                businessName: 'Apex Innovations Retail Hub',
                owner: 'Juan Dela Cruz',
                address: 'Unit 402, 4th Floor, 123 Ayala Avenue, QC',
                previousGrossSales: '₱2,450,000.00',
                validUntil: 'December 31, 2024 (Expired)',
                status: 'Eligible for 2025 Renewal'
              });
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md shadow-blue-600/20"
          >
            <Search size={14} />
            <span>Validate & Pull Business Record</span>
          </button>

          {renewalRecord && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-xs animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-semibold">Registered Business:</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{renewalRecord.businessName}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Owner / Representative:</span>
                  <p className="font-bold text-slate-900 dark:text-white">{renewalRecord.owner}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Address:</span>
                  <p className="text-slate-700 dark:text-slate-300">{renewalRecord.address}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Current Standing:</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{renewalRecord.status}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">
                  Annual Gross Sales Declaration for Previous Calendar Year (PHP ₱)
                </label>
                <input
                  type="text"
                  value={renewalGrossSales}
                  onChange={(e) => setRenewalGrossSales(e.target.value)}
                  className="w-full max-w-sm px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400"
                />
                <p className="text-[11px] text-slate-500">Auto-computed Local Business Tax (LBT) at 1.5% + Regulatory Fees: <strong>₱18,250.00</strong></p>
              </div>

              {renewalSubmitted ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 font-bold flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Renewal filed successfully! Reference: <strong>RNW-2025-00412</strong>. Proceed to Payment.</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setRenewalSubmitted(true);
                    if (onAddNewApplication && renewalRecord) {
                      onAddNewApplication(renewalRecord.businessName, 'Business Permit (Renewal)');
                    }
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 size={15} />
                  <span>Submit Annual Renewal Application</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: AMENDMENT */}
      {/* ========================================================================= */}
      {currentView === 'amendment' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit3 size={18} className="text-blue-600" />
                <span>Business Permit Amendment</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enter your Business Permit Number and OR Number to apply for legal amendments to your business license.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Business Permit Number</label>
              <input
                type="text"
                value={amendPermitNo}
                onChange={(e) => setAmendPermitNo(e.target.value)}
                placeholder="e.g. BP-2024-00123"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Official Receipt (OR) Number</label>
              <input
                type="text"
                value={amendOrNo}
                onChange={(e) => setAmendOrNo(e.target.value)}
                placeholder="e.g. OR-2024-88491"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Select Type of Amendment</label>
              <select
                value={amendmentType}
                onChange={(e) => setAmendmentType(e.target.value as any)}
                className="w-full max-w-md px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs"
              >
                <option value="trade_name">Change of Business / Trade Name</option>
                <option value="address">Change of Physical Business Address / Relocation</option>
                <option value="line_of_business">Change / Expansion of Line of Business</option>
                <option value="ownership">Change of Owner / Partner / Corporate Officers</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">New Amended Particulars</label>
              <input
                type="text"
                value={amendedValue}
                onChange={(e) => setAmendedValue(e.target.value)}
                className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Attach Amended DTI/SEC or Legal Proof</label>
              <div className="p-3 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs">
                <span className="font-mono text-slate-700 dark:text-slate-300">{amendProofFile || 'No file chosen'}</span>
                <button className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg font-semibold hover:bg-slate-300 cursor-pointer">
                  Browse File
                </button>
              </div>
            </div>

            {amendSubmitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 font-bold flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Amendment filed! Reference: <strong>AMD-2025-8831</strong>. Awaiting BPLO evaluation.</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAmendSubmitted(true);
                  if (onAddNewApplication) {
                    onAddNewApplication(user?.name || amendPermitNo || 'Business Permit Owner', 'Business Permit Amendment');
                  }
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <CheckCircle2 size={15} />
                <span>Submit Amendment Request</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: PAY BUSINESS TAX (REVENUE & QR) */}
      {/* ========================================================================= */}
      {currentView === 'pay_tax' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <CreditCard size={18} className="text-emerald-600" />
              <span>Pay Business Tax & Municipal Fees (Revenue Integration)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Direct linkage to City Treasury & Revenue Collection System with live QR payment checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Assessment Breakdown */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Assessment Order of Payment (OPN-2025-9921)</span>
                  <span className="font-mono text-slate-500">BIN: {taxBin}</span>
                </div>

                <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Local Business Tax (LBT - Gross Sales Assessment)</span>
                    <span className="font-mono font-semibold">₱12,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mayor's Permit & Regulatory Licensing Fee</span>
                    <span className="font-mono font-semibold">₱1,200.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sanitary Inspection & Health Fee</span>
                    <span className="font-mono font-semibold">₱350.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Garbage Service Fee</span>
                    <span className="font-mono font-semibold">₱600.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fire Safety Inspection Fee (BFP)</span>
                    <span className="font-mono font-semibold">₱1,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documentary Stamp Tax & Sticker Decal</span>
                    <span className="font-mono font-semibold">₱200.00</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center font-bold text-sm text-slate-900 dark:text-white">
                  <span>Total Assessed Dues:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-base">₱16,350.00</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Select Payment Channel</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {['gcash', 'maya', 'landbank', 'eprovider'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setTaxPaymentMethod(m as any)}
                      className={`p-3 rounded-xl border text-center font-bold capitalize transition-all cursor-pointer ${
                        taxPaymentMethod === m
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live QR Code & Checkout Card */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-between space-y-4 text-center">
              <div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold border border-emerald-500/30 uppercase">
                  Official Revenue QR
                </span>
                <h4 className="font-black text-sm mt-2">Scan & Settle Tax Dues</h4>
                <p className="text-[11px] text-slate-400">Merchant: City Government Revenue Treasury</p>
              </div>

              <div className="p-3 bg-white rounded-2xl shadow-inner flex items-center justify-center">
                <QrCode size={140} className="text-slate-900" />
              </div>

              <div className="w-full space-y-2">
                <p className="text-xs font-mono text-emerald-400 font-bold">Amount: ₱16,350.00</p>
                <button
                  disabled={isProcessingTax}
                  onClick={() => {
                    setIsProcessingTax(true);
                    setTimeout(() => {
                      setIsProcessingTax(false);
                      setTaxPaymentReceipt({
                        orNumber: `OR-2025-${Math.floor(10000 + Math.random() * 90000)}`,
                        date: new Date().toLocaleString(),
                        amount: '₱16,350.00',
                        method: taxPaymentMethod.toUpperCase(),
                        status: 'PAYMENT CLEARED'
                      });
                    }, 1200);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  {isProcessingTax ? 'Processing Payment...' : 'Simulate Instant Payment'}
                </button>
              </div>
            </div>

          </div>

          {taxPaymentReceipt && (
            <div className="p-5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-200 font-bold text-sm">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>Payment Confirmed! Official Receipt: {taxPaymentReceipt.orNumber}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Settled on <strong>{taxPaymentReceipt.date}</strong> via <strong>{taxPaymentReceipt.method}</strong>. Your Mayor's Permit has been validated and released.
              </p>
              <button
                onClick={() => setEcopyModalOpen(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Download Certified E-Permit
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 5: SPECIAL PERMIT (SHORT TERM / EVENT) */}
      {/* ========================================================================= */}
      {currentView === 'special_permit' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Calendar size={18} className="text-amber-600" />
                <span>Special Permit / Short-Term Event Application</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Flow: General ➔ Basic Documentary Requirements ➔ Business Information ➔ Business Operation ➔ Business Activity ➔ Event Information ➔ Summary Page
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600">
            <span>Step {specialStep} of 4:</span>
            <span className="text-slate-600 dark:text-slate-300">
              {specialStep === 1 && 'General & Terms'}
              {specialStep === 2 && 'Business & Operation Particulars'}
              {specialStep === 3 && 'Event Information & Venue'}
              {specialStep === 4 && 'Summary & Release'}
            </span>
          </div>

          {specialStep === 1 && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Special permits are issued for short-term events, bazaars, promotional activations, food festivals, and temporary exhibitions lasting up to 30 days.
              </p>
              <label className="flex items-center space-x-2 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialTermsAccepted}
                  onChange={(e) => setSpecialTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
                <span>I agree to the Short-Term Special Permitting terms and event safety regulations</span>
              </label>
              <div className="flex justify-end">
                <button
                  disabled={!specialTermsAccepted}
                  onClick={() => setSpecialStep(2)}
                  className="px-6 py-2.5 bg-amber-600 disabled:opacity-50 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Continue to Business Details
                </button>
              </div>
            </div>
          )}

          {specialStep === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Business Name / Entity</label>
                <input
                  type="text"
                  value={specialData.businessName}
                  onChange={(e) => setSpecialData({...specialData, businessName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Organizer Contact Person</label>
                <input
                  type="text"
                  value={specialData.organizerName}
                  onChange={(e) => setSpecialData({...specialData, organizerName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div className="sm:col-span-2 flex justify-between pt-2">
                <button onClick={() => setSpecialStep(1)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">Back</button>
                <button onClick={() => setSpecialStep(3)} className="px-6 py-2 bg-amber-600 text-white font-bold rounded-xl">Event Information</button>
              </div>
            </div>
          )}

          {specialStep === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Event Title / Exhibition Name</label>
                <input
                  type="text"
                  value={specialData.eventTitle}
                  onChange={(e) => setSpecialData({...specialData, eventTitle: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Venue / Event Location</label>
                <input
                  type="text"
                  value={specialData.venue}
                  onChange={(e) => setSpecialData({...specialData, venue: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Start Date</label>
                <input
                  type="date"
                  value={specialData.startDate}
                  onChange={(e) => setSpecialData({...specialData, startDate: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">End Date</label>
                <input
                  type="date"
                  value={specialData.endDate}
                  onChange={(e) => setSpecialData({...specialData, endDate: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div className="sm:col-span-2 flex justify-between pt-2">
                <button onClick={() => setSpecialStep(2)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">Back</button>
                <button onClick={() => setSpecialStep(4)} className="px-6 py-2 bg-amber-600 text-white font-bold rounded-xl">Summary & File</button>
              </div>
            </div>
          )}

          {specialStep === 4 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border space-y-2">
                <p><strong>Event:</strong> {specialData.eventTitle}</p>
                <p><strong>Venue:</strong> {specialData.venue}</p>
                <p><strong>Duration:</strong> {specialData.startDate} to {specialData.endDate}</p>
                <p><strong>Special Permit Fee:</strong> ₱3,500.00</p>
              </div>

              {specialSubmitted ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 rounded-xl text-emerald-800 dark:text-emerald-200 font-bold">
                  Special Permit Registered! Reference: <strong>SP-2025-4412</strong>.
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSpecialSubmitted(true);
                    if (onAddNewApplication) {
                      onAddNewApplication(specialData.businessName || specialData.organizerName || user?.name || 'Event Organizer', 'Special Mayor\'s Permit');
                    }
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Submit Special Permit Application
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW: CARD 2 - BUSINESS INFORMATION SYSTEM (CTC PULLING) */}
      {/* ========================================================================= */}
      {currentView === 'ctc_pulling' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers size={18} className="text-purple-600" />
                <span>Business Information System: Pull Certified True Copies (CTC)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official municipal registry pulling engine: Request ➔ Admin Review & Fee Confirmation ➔ Payment Linkage ➔ Document Issuance.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold border border-purple-200 dark:border-purple-800">
                Step {ctcStep} of 4: {ctcStep === 1 ? 'Request & Upload' : ctcStep === 2 ? 'Admin Review & Fee' : ctcStep === 3 ? 'Payment Linkage' : 'CTC Download'}
              </span>
            </div>
          </div>

          {/* Stepper Header Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
              ctcStep === 1 
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                : ctcStep > 1 
                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}>
              1. Request & Uploads
            </div>
            <div className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
              ctcStep === 2 
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                : ctcStep > 2 
                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}>
              2. Admin Fee Review
            </div>
            <div className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
              ctcStep === 3 
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                : ctcStep > 3 
                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}>
              3. Payment Linkage
            </div>
            <div className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
              ctcStep === 4 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}>
              4. CTC Provision
            </div>
          </div>

          {/* STEP 1: Request Form & Uploads */}
          {ctcStep === 1 && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-3">
                <h4 className="font-bold text-purple-900 dark:text-purple-200">1. Business Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Business Permit Number</label>
                    <input
                      type="text"
                      value={ctcPermitNo}
                      onChange={(e) => setCtcPermitNo(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Registered Business Name</label>
                    <input
                      type="text"
                      value={ctcBusinessName}
                      onChange={(e) => setCtcBusinessName(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">2. Requestor Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Requestor Full Name</label>
                    <input
                      type="text"
                      value={ctcRequestorName}
                      onChange={(e) => setCtcRequestorName(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Contact Number</label>
                    <input
                      type="text"
                      value={ctcRequestorContact}
                      onChange={(e) => setCtcRequestorContact(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={ctcRequestorEmail}
                      onChange={(e) => setCtcRequestorEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Presented ID Type</label>
                    <input
                      type="text"
                      value={ctcIdType}
                      onChange={(e) => setCtcIdType(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">ID Number</label>
                    <input
                      type="text"
                      value={ctcIdNumber}
                      onChange={(e) => setCtcIdNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Relationship to Business</label>
                    <input
                      type="text"
                      value={ctcRelation}
                      onChange={(e) => setCtcRelation(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">3. Select Requested Document(s)</h4>
                <div className="space-y-2">
                  {[
                    'Certified True Copy of Mayor\'s Permit (Current Year)',
                    'Certified True Copy of Business Tax Assessment & Official Receipt',
                    'Certificate of Business Closure / Retirement',
                    'Certificate of No Existing Business Record',
                    'Business Plate / Window Decal Replacement Endorsement'
                  ].map((doc, idx) => (
                    <label key={idx} className="flex items-center space-x-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ctcSelectedDocs.includes(doc)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCtcSelectedDocs([...ctcSelectedDocs, doc]);
                          } else {
                            setCtcSelectedDocs(ctcSelectedDocs.filter(d => d !== doc));
                          }
                        }}
                        className="w-4 h-4 rounded text-purple-600"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{doc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Supporting Documents Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">4. Supporting Documents Upload</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold">Government-Issued Valid ID</p>
                      <p className="text-[11px] text-emerald-600 font-mono">PhilID_JuanDelaCruz.pdf (Attached)</p>
                    </div>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold">Special Power of Attorney / Authorization</p>
                      <p className="text-[11px] text-slate-400">Required if filing on behalf of owner</p>
                    </div>
                    <Upload size={16} className="text-slate-400" />
                  </div>
                </div>
              </div>

              <label className="flex items-center space-x-2 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={ctcPrivacyAgreed}
                  onChange={(e) => setCtcPrivacyAgreed(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600"
                />
                <span>I confirm that the requested documents will be used solely for legitimate legal and commercial purposes pursuant to RA 10173</span>
              </label>

              <div className="flex justify-end pt-2">
                <button
                  disabled={!ctcPrivacyAgreed || ctcSelectedDocs.length === 0}
                  onClick={() => {
                    setCtcReqRef(`CTC-REQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`);
                    setCtcStep(2);
                  }}
                  className="px-6 py-2.5 bg-purple-600 disabled:opacity-50 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md shadow-purple-600/25"
                >
                  <span>Submit Request for Admin Review</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Admin Review & Fee Confirmation */}
          {ctcStep === 2 && (
            <div className="space-y-5 text-xs animate-in fade-in">
              
              {/* Review Status Banner */}
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-white">Request Tracking Reference:</span>
                      <span className="font-mono font-black text-purple-600 dark:text-purple-400">{ctcReqRef}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                      Reviewed by: <strong>Office of the City Treasurer & BPLO Records Division</strong>
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1">
                  <CheckCircle2 size={12} />
                  <span>Admin Evaluation & Fee Confirmed</span>
                </span>
              </div>

              {/* Admin Validation Checklist & Assessment Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Admin Audit Card */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    <span>LGU Records Custodian Verification</span>
                  </h4>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border">
                      <span className="text-slate-600 dark:text-slate-400">Business Registry File:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">FOUND & ACTIVE ({ctcPermitNo})</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border">
                      <span className="text-slate-600 dark:text-slate-400">Identity & SPA Verification:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">VALIDATED (PhilID Match)</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border">
                      <span className="text-slate-600 dark:text-slate-400">Tax Liabilities Check:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">CLEARED (No Outstanding Dues)</strong>
                    </div>
                  </div>
                </div>

                {/* Confirmed Order of Payment Assessment */}
                <div className="p-4 bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-purple-900 dark:text-purple-200 flex items-center space-x-1.5">
                      <Receipt size={15} className="text-purple-600" />
                      <span>Confirmed Order of Payment (OP)</span>
                    </h4>
                    <span className="font-mono text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded font-bold">
                      {ctcAssessmentNo}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>CTC Certification Fee ({ctcSelectedDocs.length} Doc @ ₱150):</span>
                      <span className="font-mono font-semibold">₱{ctcSelectedDocs.length * 150}.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Documentary Stamp Tax (DST):</span>
                      <span className="font-mono font-semibold">₱30.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Archival Retrieval & Security Seal Fee:</span>
                      <span className="font-mono font-semibold">₱50.00</span>
                    </div>
                    <div className="border-t border-purple-200 dark:border-purple-800 pt-2 flex justify-between font-bold text-xs text-purple-950 dark:text-purple-200">
                      <span>Total Confirmed Fee:</span>
                      <span className="font-mono text-sm text-purple-700 dark:text-purple-300 font-black">
                        ₱{ctcSelectedDocs.length * 150 + 80}.00
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setCtcStep(1)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Modify Request</span>
                </button>

                <button
                  onClick={() => setCtcStep(3)}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 flex items-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Payment Linkage</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Payment Linkage (Revenue Link & QR Settlement) */}
          {ctcStep === 3 && (
            <div className="space-y-5 text-xs animate-in fade-in">
              
              {/* Payment Linkage Header */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <div className="flex items-center space-x-2">
                    <CreditCard size={18} className="text-blue-300" />
                    <span className="font-bold text-sm">City Treasury Online Payment Linkage</span>
                  </div>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Order of Payment: <strong className="font-mono">{ctcAssessmentNo}</strong> • Assessment Reference: <strong className="font-mono">{ctcReqRef}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-blue-200">Total Amount Payable</span>
                  <p className="text-xl font-black font-mono text-emerald-300">
                    ₱{ctcSelectedDocs.length * 150 + 80}.00
                  </p>
                </div>
              </div>

              {/* Payment Method Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setCtcPaymentMethod('gcash')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    ctcPaymentMethod === 'gcash'
                      ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-blue-600 dark:text-blue-400">GCash</span>
                    <QrCode size={16} className="text-blue-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Scan Revenue QR & e-Wallet</p>
                </button>

                <button
                  onClick={() => setCtcPaymentMethod('maya')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    ctcPaymentMethod === 'maya'
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-emerald-600 dark:text-emerald-400">Maya</span>
                    <QrCode size={16} className="text-emerald-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Scan QR Ph / Instant Checkout</p>
                </button>

                <button
                  onClick={() => setCtcPaymentMethod('landbank')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    ctcPaymentMethod === 'landbank'
                      ? 'border-green-600 bg-green-50/80 dark:bg-green-950/60 ring-2 ring-green-600/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-green-700 dark:text-green-400">Landbank</span>
                    <CreditCard size={16} className="text-green-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Link.BizPortal / BancNet</p>
                </button>
              </div>

              {/* QR Code & Gateway Simulation Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center shadow-xs flex-shrink-0">
                    <QrCode size={70} className="text-slate-900" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      Official Revenue QR Payment Link
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Scan using your banking or e-wallet app to settle the confirmed CTC fee.
                    </p>
                    <p className="font-mono text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                      Ref: LGU-QC-REV-{ctcAssessmentNo.replace('OP-', '')}
                    </p>
                  </div>
                </div>

                <button
                  disabled={ctcIsProcessingPayment}
                  onClick={() => {
                    setCtcIsProcessingPayment(true);
                    setTimeout(() => {
                      setCtcIsProcessingPayment(false);
                      setCtcPaid(true);
                      setCtcOrNo(`OR-CTC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`);
                      setCtcStep(4);
                    }, 1500);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0"
                >
                  {ctcIsProcessingPayment ? (
                    <>
                      <RotateCw size={14} className="animate-spin" />
                      <span>Verifying Payment Linkage...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={14} />
                      <span>Simulate Immediate Payment (₱{ctcSelectedDocs.length * 150 + 80}.00)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={() => setCtcStep(2)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Assessment</span>
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: Official CTC Provision & Download */}
          {ctcStep === 4 && (
            <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-3xl text-center space-y-5 animate-in zoom-in-95">
              
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                <FileCheck size={32} />
              </div>

              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-extrabold mb-2 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 size={13} />
                  <span>Payment Verified via Treasury • CTC Released</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  Official Certified True Copy (CTC) Issued
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-1">
                  Your document for <strong>{ctcBusinessName}</strong> has been pulled from the municipal archives with holographic seal, digital authentication watermark, and valid Official Receipt.
                </p>
              </div>

              {/* Digital Certificate Spec Card */}
              <div className="p-5 max-w-lg mx-auto bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/80 rounded-2xl text-left text-xs space-y-2 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <ShieldCheck size={14} className="text-purple-600" />
                    <span>Certified True Copy Credentials</span>
                  </span>
                  <span className="font-mono text-[10px] font-bold text-emerald-600">VALIDATED</span>
                </div>
                
                <div className="space-y-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <p><strong>Tracking Ref:</strong> {ctcReqRef}</p>
                  <p><strong>Official Receipt No:</strong> {ctcOrNo}</p>
                  <p><strong>Order of Payment No:</strong> {ctcAssessmentNo}</p>
                  <p><strong>Document:</strong> {ctcSelectedDocs[0]}</p>
                  <p><strong>Issued To:</strong> {ctcRequestorName} ({ctcRelation})</p>
                  <p><strong>Security Hash:</strong> e8f92a11b02c8901f44d87aa</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    alert(`Official Certified True Copy (CTC) for ${ctcBusinessName} downloaded successfully.`);
                  }}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 flex items-center space-x-2 cursor-pointer"
                >
                  <Download size={15} />
                  <span>Download Watermarked CTC (.PDF)</span>
                </button>

                <button
                  onClick={() => {
                    alert(`Official Receipt ${ctcOrNo} for CTC processing downloaded.`);
                  }}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer"
                >
                  <Receipt size={14} />
                  <span>Download Official Receipt (OR)</span>
                </button>

                <button
                  onClick={() => {
                    setCtcStep(1);
                  }}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  File Another Request
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW: CARD 3 - MAYOR'S PERMIT VERIFICATION */}
      {/* ========================================================================= */}
      {currentView === 'verification' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              <span>Mayor's Permit Legal Verification & Compliance Audit</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verify whether a registered business establishment complies with municipal legal requirements, fire safety, sanitary, and zoning clearances.
            </p>
          </div>

          <div className="flex gap-2 max-w-xl">
            <input
              type="text"
              value={verifQuery}
              onChange={(e) => setVerifQuery(e.target.value)}
              placeholder="Enter Permit Number or BIN (e.g. BP-2024-00123)..."
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
            />
            <button
              disabled={isVerifying}
              onClick={() => {
                setIsVerifying(true);
                setTimeout(() => {
                  setIsVerifying(false);
                }, 600);
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Search size={14} />
              <span>{isVerifying ? 'Verifying...' : 'Verify Legal Standing'}</span>
            </button>
          </div>

          {verifResult && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-5 text-xs animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">{verifResult.businessName}</h4>
                  <p className="text-slate-500 text-[11px]">Trade: {verifResult.tradeName} • BIN: <span className="font-mono font-bold">{verifResult.bin}</span></p>
                </div>
                <div className="px-3.5 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold rounded-full text-xs border border-emerald-300 dark:border-emerald-700 flex items-center space-x-1.5">
                  <CheckCircle2 size={15} />
                  <span>{verifResult.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Fire Safety (FSIC):</span>
                  <strong className="text-emerald-600">{verifResult.fsicStatus}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Sanitary Clearance:</span>
                  <strong className="text-emerald-600">{verifResult.sanitaryStatus}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Zoning Compliance:</span>
                  <strong className="text-emerald-600">{verifResult.zoningStatus}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Validity Expiration:</span>
                  <strong className="text-slate-900 dark:text-white">{verifResult.validUntil}</strong>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center space-x-3">
                <Award size={20} className="text-emerald-600 flex-shrink-0" />
                <div className="text-[11px] text-emerald-900 dark:text-emerald-200">
                  <span>Cryptographic Seal Authenticated. The business is fully compliant with Quezon City Business Omnibus Ordinance & Republic Act 7160.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW: CARD 4 - SAFE SEAL (QC SAFE SEAL CERTIFICATION) */}
      {/* ========================================================================= */}
      {currentView === 'safe_seal' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-9 shadow-md space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Award size={18} className="text-amber-600" />
              <span>QC SAFE (Stop All Forms of Exploitation) Seal Certification</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Validate your Business Permit Number to automatically auto-fill and complete the QC SAFE SEAL Guidelines form.
            </p>
          </div>

          <div className="flex gap-2 max-w-xl">
            <input
              type="text"
              value={safePermitNo}
              onChange={(e) => setSafePermitNo(e.target.value)}
              placeholder="Enter Permit Number (e.g. BP-2024-00123)..."
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-mono font-bold"
            />
            <button
              onClick={() => {
                setSafeValidated(true);
              }}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Check size={14} />
              <span>Validate & Auto-Fill Form</span>
            </button>
          </div>

          {safeValidated && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-5 text-xs animate-in fade-in">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-700">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400/20 rounded-full font-bold text-[10px] uppercase">
                  Auto-filled from Business Permit Registry
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                  QC SAFE SEAL Guidelines.pdf Compliance Form
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Business Name:</span>
                  <strong className="text-slate-900 dark:text-white">{safeFormData.businessName}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Operating Category:</span>
                  <strong className="text-slate-900 dark:text-white">{safeFormData.category}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <span className="text-slate-400 font-semibold block">Workforce & Schedule:</span>
                  <strong className="text-slate-900 dark:text-white">{safeFormData.employeeCount} ({safeFormData.operatingHours})</strong>
                </div>
              </div>

              {/* Checklist */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border space-y-2.5">
                <h5 className="font-bold text-slate-900 dark:text-white">SAFE Protocol Compliance Checklist:</h5>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-amber-600" />
                    <span>Establishment enforces zero-tolerance policy against illegal child labor and human trafficking</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-amber-600" />
                    <span>Official anti-exploitation helplines (QC Helpline 122 & 1343) clearly posted at public entrances</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-amber-600" />
                    <span>Employee background check & government ID verification protocol implemented</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-amber-600" />
                    <span>CCTV cameras functional and actively monitoring commercial access points</span>
                  </label>
                </div>
              </div>

              {safeSealIssued ? (
                <div className="p-5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Award size={24} />
                  </div>
                  <h4 className="text-sm font-black text-amber-900 dark:text-amber-200">
                    QC SAFE SEAL Certified & Issued!
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Certificate Number: <strong>QC-SAFE-2025-0081</strong>. Your establishment is recognized as a SAFE certified venue.
                  </p>
                  <div className="flex justify-center space-x-3 pt-2">
                    <button 
                      onClick={() => alert('QC SAFE SEAL Certificate & Window Decal PDF downloaded.')}
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md"
                    >
                      Download Safe Seal Decal & QR Sticker
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSafeSealIssued(true)}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <Award size={15} />
                  <span>Issue QC Safe Seal Certificate</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REQUEST FOR E-COPY */}
      {/* ========================================================================= */}
      {ecopyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Download size={18} className="text-blue-400" />
                <h3 className="font-bold text-sm">Request Official Electronic Permit (E-Copy)</h3>
              </div>
              <button onClick={() => setEcopyModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Business Permit Reference Number</label>
                <input
                  type="text"
                  value={ecopyPermitNo}
                  onChange={(e) => setEcopyPermitNo(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-xs font-bold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-slate-700 dark:text-slate-300 space-y-1.5">
                <p><strong>Permit File:</strong> Official_Mayors_Permit_2025_{ecopyPermitNo}.pdf</p>
                <p><strong>Digital Signature:</strong> Cryptographically Sealed by City Mayor & BPLO Head</p>
                <p><strong>Verification:</strong> Includes Tamper-Proof Scannable QR Code</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2.5">
              <button onClick={() => setEcopyModalOpen(false)} className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs font-semibold cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Official E-Copy for permit ${ecopyPermitNo} generated and downloaded.`);
                  setEcopyModalOpen(false);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer flex items-center space-x-1.5"
              >
                <Download size={14} />
                <span>Download Certified E-Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      </main>

      {/* ========================================================================= */}
      {/* 4. FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <Landmark size={18} className="text-blue-600" />
            <span>Republic of the Philippines • Business Permits and Licensing Office (BPLO)</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer" onClick={() => onNavigateToTab?.('E-Permit Portal')}>
              E-Permit Portal
            </span>
            <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer" onClick={() => onNavigateToTab?.('Home')}>
              Dashboard & Tracker
            </span>
            <span>Helpline: 122 / (02) 8888-BPLO</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

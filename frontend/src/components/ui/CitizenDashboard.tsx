import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ArrowRight, 
  Plus, 
  Download, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Building, 
  Calendar, 
  QrCode, 
  Zap, 
  FileCheck, 
  ChevronRight, 
  CreditCard, 
  Layers, 
  ArrowUpRight,
  Check,
  Eye,
  Filter,
  X,
  Lock,
  Mail,
  Smartphone,
  Sliders
} from 'lucide-react';
import { TabType, ApplicationItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface CitizenDashboardProps {
  onNavigateToTab: (tab: TabType) => void;
  applications: ApplicationItem[];
  onViewDetails: (id: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onNavigateToTab,
  applications,
  onViewDetails,
}) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  // Status Filter State
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Progress' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal States
  const [activeModal, setActiveModal] = useState<'none' | 'app_details' | 'payment_gateway'>('none');
  const [selectedApp, setSelectedApp] = useState<any>(null);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'eprovider' | 'gcash' | 'maya' | 'bank'>('eprovider');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  // Download Package State
  const [downloadingAppId, setDownloadingAppId] = useState<string | null>(null);
  const [downloadAppSuccessId, setDownloadAppSuccessId] = useState<string | null>(null);

  // Full applications dataset (mapped from database applications prop with fallback)
  const fullApplicationsList = applications && applications.length > 0 
    ? applications.map(app => {
        const formData = (app as any).formData || {};
        const bName = formData.businessName || formData.tradeName || app.applicant;
        const fee = (app as any).assessmentFee || 2500;
        return {
          id: app.id,
          applicant: app.applicant,
          businessName: bName,
          type: app.type,
          date: app.date || 'Just now',
          dateSubmitted: (app as any).createdAt 
            ? new Date((app as any).createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
            : (app.date || 'Today'),
          status: app.status,
          statusColor: app.status === 'Approved'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
            : app.status === 'Rejected'
              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
          lastUpdated: (app as any).updatedAt 
            ? new Date((app as any).updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
            : 'Just now',
          amount: typeof fee === 'number' ? `₱${fee.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `₱${fee}`,
          location: formData.barangay || formData.location || 'San Isidro, Laguna',
          grossSales: formData.grossSales || 'N/A'
        };
      })
    : [
    {
      id: 'BP-2024-00123',
      applicant: 'Dela Cruz General Merchandise',
      businessName: 'Dela Cruz General Merchandise',
      type: 'Business Permit',
      date: 'May 1, 2024',
      dateSubmitted: 'May 1, 2024 09:15 AM',
      status: 'Approved',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      lastUpdated: 'May 7, 2024 10:32 AM',
      amount: '₱5,695.00',
      location: 'San Isidro, Laguna',
      grossSales: '₱1,500,000.00'
    },
    {
      id: 'BP-2024-00124',
      applicant: 'Cruz IT Solutions',
      businessName: 'Cruz IT Solutions',
      type: 'Business Permit',
      date: 'May 6, 2024',
      dateSubmitted: 'May 6, 2024 02:15 PM',
      status: 'In Progress',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
      lastUpdated: 'May 6, 2024 02:15 PM',
      amount: '₱3,200.00',
      location: 'Poblacion, Laguna',
      grossSales: '₱850,000.00'
    },
    {
      id: 'BC-2025-00125',
      applicant: '2-Storey Commercial Unit',
      businessName: '2-Storey Commercial Unit',
      type: 'Building Permit',
      date: 'May 18, 2025',
      dateSubmitted: 'May 18, 2025 11:30 AM',
      status: 'In Progress',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
      lastUpdated: 'May 19, 2025 09:00 AM',
      amount: '₱12,450.00',
      location: 'Barangay San Antonio',
      grossSales: 'N/A'
    },
    {
      id: 'FT-2025-00078',
      applicant: 'XYZ Transport Co-op',
      businessName: 'XYZ Transport Co-op',
      type: 'Franchise Permit',
      date: 'May 17, 2025',
      dateSubmitted: 'May 17, 2025 03:20 PM',
      status: 'In Progress',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
      lastUpdated: 'May 17, 2025 04:00 PM',
      amount: '₱2,100.00',
      location: 'Terminal 1 Hub',
      grossSales: 'N/A'
    },
    {
      id: 'BR-2025-00033',
      applicant: 'Juan Dela Cruz Residency',
      businessName: 'Juan Dela Cruz Residency',
      type: 'Barangay Clearance',
      date: 'May 16, 2025',
      dateSubmitted: 'May 16, 2025 08:30 AM',
      status: 'Approved',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      lastUpdated: 'May 16, 2025 10:15 AM',
      amount: '₱350.00',
      location: 'Barangay San Isidro',
      grossSales: 'N/A'
    }
  ];

  // Filtered applications
  const filteredApps = fullApplicationsList.filter(app => {
    const matchesFilter = statusFilter === 'All' 
      ? true 
      : statusFilter === 'In Progress' 
        ? (app.status === 'In Progress' || app.status === 'For Evaluation' || app.status === 'For Inspection' || app.status === 'For Approval')
        : app.status === statusFilter;

    const matchesSearch = 
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Stat counts
  const totalCount = fullApplicationsList.length;
  const inProgressCount = fullApplicationsList.filter(a => a.status === 'In Progress' || a.status === 'For Evaluation' || a.status === 'For Inspection' || a.status === 'For Approval').length;
  const approvedCount = fullApplicationsList.filter(a => a.status === 'Approved').length;
  const rejectedCount = fullApplicationsList.filter(a => a.status === 'Rejected').length;

  const handleStatCardClick = (filter: 'All' | 'In Progress' | 'Approved' | 'Rejected') => {
    setStatusFilter(filter);
    const el = document.getElementById('applications-management-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAppDetails = (app: any) => {
    setSelectedApp(app);
    setActiveModal('app_details');
  };

  const handleOpenPayment = (app?: any) => {
    if (app) setSelectedApp(app);
    setPaymentSuccess(false);
    setActiveModal('payment_gateway');
  };

  const handleConfirmPayment = () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setPaymentSuccess(true);
    }, 1200);
  };

  // Download Application Package File Handler
  const handleDownloadAppPackage = (app: any) => {
    setDownloadingAppId(app.id);

    setTimeout(() => {
      const content = `========================================================================================\nGOVSERVE LGU BUSINESS PERMIT PORTAL — OFFICIAL APPLICATION PACKAGE\n========================================================================================\nApplication ID          : ${app.id}\nBusiness Entity Name   : ${app.businessName || app.applicant}\nPermit Category        : ${app.type}\nSubmission Date        : ${app.dateSubmitted || app.date}\nApplication Status     : ${app.status}\nLast Updated           : ${app.lastUpdated || app.date}\nAssessment Fee Amount  : ${app.amount || '₱5,695.00'}\nSecurity Signature     : AUTHENTICATED-LGU-RECORD-${app.id}\n========================================================================================\n\n[INCLUDED DOCUMENTS IN PACKAGE]\n- 1. Business Registration (DTI / SEC Certificate)\n- 2. Mayor's / Business Permit Application Form\n- 3. Barangay Clearance & Tax Clearance Certificate\n- 4. Official Fee Assessment Receipt (OR-998230112)\n\n========================================================================================\nOfficial Document Record — Republic of the Philippines LGU Permitting Office.\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Application_Package_${app.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingAppId(null);
      setDownloadAppSuccessId(app.id);
      setTimeout(() => setDownloadAppSuccessId(null), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. CITIZEN WELCOME HERO BANNER */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-gradient-to-r dark:from-[#0B192C] dark:via-[#102A45] dark:to-[#0A1A2F] text-slate-900 dark:text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="hidden dark:block absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden dark:block absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-400/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                <Sparkles size={13} className="text-amber-500 dark:text-amber-400" />
                <span>{t('citizen_badge', 'Republic of the Philippines • Citizen Services Portal')}</span>
              </div>
              <LanguageToggle />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {language === 'tl' ? `Maligayang pagbabalik, ${user?.name || 'Mamamayan'}!` : `Welcome back, ${user?.name || 'Citizen'}!`}
            </h1>
            
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t('citizen_hero_desc', 'File applications, track real-time milestone progress, settle assessed municipal fees, and download official QR-verified permits directly from your dashboard.')}
            </p>

            {user?.organization && (
              <div className="pt-1 flex items-center space-x-2 text-xs text-slate-700 dark:text-blue-200 bg-slate-100 dark:bg-blue-900/40 border border-slate-200 dark:border-blue-700/50 px-3 py-1.5 rounded-xl w-fit">
                <Building size={14} className="text-blue-600 dark:text-blue-400" />
                <span>{t('registered_entity', 'Registered Entity:')} <strong className="text-slate-900 dark:text-white">{user.organization}</strong></span>
              </div>
            )}
          </div>

          {/* Primary Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            <button
              onClick={() => onNavigateToTab('Business Registration (New / Renewal)')}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <Plus size={16} />
              <span>{t('apply_new_permit', 'Apply for New Permit')}</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('applications-management-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-2xl border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Search size={15} />
              <span>{t('track_my_applications', 'Track My Applications')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LIVE APPLICANT MILESTONE PROGRESS TRACKER */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-7 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-200/60 dark:border-blue-800/60 shadow-xs">
              <FileText size={22} />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white">
                  BP-2024-00123
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 rounded-full text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Approved</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active Application Milestone & Real-Time Status Pipeline
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleOpenAppDetails(fullApplicationsList[0])}
              className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              View Full Filing
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('applications-management-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
            >
              <span>View All ({totalCount})</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Applicant Metadata Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider">Business / Entity</p>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">Dela Cruz General Merchandise</p>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider">Date Submitted</p>
            <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">May 1, 2024 • 09:15 AM</p>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider">Permit Category</p>
            <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">Sole Proprietorship</p>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider">LGU Location</p>
            <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">San Isidro, Laguna</p>
          </div>
        </div>

        {/* Milestone Progress Stages */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
              <Clock size={15} className="text-blue-500" />
              <span>Timeline of Process & Milestones</span>
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              5 of 5 Milestones Completed
            </span>
          </div>

          {/* Desktop Horizontal Milestone Stepper */}
          <div className="hidden lg:grid grid-cols-5 gap-3 relative py-4">
            {/* Connecting Bar */}
            <div className="absolute top-9 left-12 right-12 h-1 bg-gradient-to-r from-blue-600 via-blue-600 to-emerald-500 -z-0 rounded-full" />

            {[
              { step: 1, title: 'Application Submitted', date: 'May 1, 09:15 AM', desc: 'Filing received & logged', icon: FileText, done: true },
              { step: 2, title: 'Initial Review', date: 'May 1, 10:02 AM', desc: 'Requirements verified', icon: Search, done: true },
              { step: 3, title: 'For Evaluation', date: 'May 2, 11:30 AM', desc: 'Assessed by officer', icon: FileCheck, done: true },
              { step: 4, title: 'For Approval', date: 'May 3, 02:45 PM', desc: 'Endorsed for sign-off', icon: ShieldCheck, done: true },
              { step: 5, title: 'Approved', date: 'May 7, 10:32 AM', desc: 'Permit released', icon: Check, done: true, isFinal: true },
            ].map((m) => (
              <div key={m.step} className="flex flex-col items-center text-center relative z-10 space-y-2">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-md transition-transform hover:scale-105 ${
                  m.isFinal
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 shadow-emerald-600/30'
                    : 'bg-blue-600 text-white ring-4 ring-blue-50 dark:ring-blue-950 shadow-blue-600/20'
                }`}>
                  <m.icon size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className={`text-xs font-bold ${m.isFinal ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {m.title}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{m.date}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile / Tablet Vertical Timeline Stepper */}
          <div className="lg:hidden relative pl-6 space-y-5 border-l-2 border-slate-200 dark:border-slate-800 ml-4 py-2">
            {[
              { title: 'Application Submitted', time: 'May 1, 2024 09:15 AM', desc: 'Your application has been successfully submitted.', icon: FileText, color: 'bg-blue-600' },
              { title: 'Initial Review', time: 'May 1, 2024 10:02 AM', desc: 'Your application is under initial review.', icon: Search, color: 'bg-blue-600' },
              { title: 'For Evaluation', time: 'May 2, 2024 11:30 AM', desc: 'Your application is being evaluated by the assigned officer.', icon: FileCheck, color: 'bg-blue-600' },
              { title: 'For Approval', time: 'May 3, 2024 02:45 PM', desc: 'Your application is endorsed for approval.', icon: ShieldCheck, color: 'bg-blue-600' },
              { title: 'Approved', time: 'May 7, 2024 10:32 AM', desc: 'Your business permit has been approved.', icon: Check, color: 'bg-emerald-600', isFinal: true },
            ].map((step, idx) => (
              <div key={idx} className="relative group">
                <div className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full ${step.color} text-white flex items-center justify-center font-bold text-xs shadow-md ${step.isFinal ? 'ring-4 ring-emerald-100 dark:ring-emerald-950' : ''}`}>
                  <step.icon size={16} />
                </div>
                <div className="pl-3 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-xs ${step.isFinal ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {step.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{step.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approved Success Callout Action Box */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/70 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="font-bold text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm">
                Application Successfully Approved!
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                You may now proceed to fee assessment payment or generate your official digital permit.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <button
              onClick={() => handleOpenPayment(fullApplicationsList[0])}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 cursor-pointer"
            >
              <CreditCard size={14} />
              <span>Proceed to Payment</span>
            </button>
            <button
              onClick={() => onNavigateToTab('Permit Generation')}
              className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>PDF Permit</span>
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. ALL APPLICATIONS & STATUS MANAGEMENT (TRANSFERRED SECTION) */}
      {/* ========================================================================= */}
      <div id="applications-management-section" className="space-y-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
            <FileText size={16} className="text-blue-500" />
            <span>{language === 'tl' ? 'Pangkalahatang-ideya ng mga Aplikasyon' : 'Applications & Status Overview'}</span>
          </h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {language === 'tl' ? 'Kabuuang Naisumite:' : 'Total Filings:'} <strong>{totalCount}</strong>
          </span>
        </div>

        {/* 4 Interactive Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Applications */}
          <div 
            onClick={() => handleStatCardClick('All')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              statusFilter === 'All'
                ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20 flex-shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{totalCount}</span>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('total_apps', 'Total Filings')}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{language === 'tl' ? 'Lahat' : 'View All'}</span>
          </div>

          {/* Card 2: In Progress */}
          <div 
            onClick={() => handleStatCardClick('In Progress')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              statusFilter === 'In Progress'
                ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20 flex-shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{inProgressCount}</span>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('in_progress', 'In Progress')}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{language === 'tl' ? 'Salain' : 'Filter'}</span>
          </div>

          {/* Card 3: Approved */}
          <div 
            onClick={() => handleStatCardClick('Approved')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              statusFilter === 'Approved'
                ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 flex-shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{approvedCount}</span>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('approved', 'Approved')}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{language === 'tl' ? 'Salain' : 'Filter'}</span>
          </div>

          {/* Card 4: Rejected */}
          <div 
            onClick={() => handleStatCardClick('Rejected')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              statusFilter === 'Rejected'
                ? 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20 flex-shrink-0">
                <XCircle size={20} />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{rejectedCount}</span>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('rejected', 'Rejected')}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">{language === 'tl' ? 'Salain' : 'Filter'}</span>
          </div>

        </div>

        {/* Active Filter Notification Bar */}
        {statusFilter !== 'All' && (
          <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 p-3 rounded-2xl flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
            <div className="flex items-center space-x-2">
              <Filter size={15} className="text-blue-600 dark:text-blue-400" />
              <span>{language === 'tl' ? 'Ipinapakita ang mga aplikasyon ayon sa katayuan:' : 'Showing applications filtered by status:'} <strong className="font-bold uppercase text-blue-700 dark:text-blue-300">{t(statusFilter, statusFilter)}</strong></span>
            </div>
            <button 
              onClick={() => setStatusFilter('All')} 
              className="text-blue-700 dark:text-blue-400 hover:underline font-bold text-xs cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Main Applications Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">My Application Records</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Search, inspect specifications, download certified summary packages, and proceed to payment</p>
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search reference or entity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold">
                  <th className="p-3.5 pl-4">Application Reference</th>
                  <th className="p-3.5">Business / Project Name</th>
                  <th className="p-3.5">Permit Category</th>
                  <th className="p-3.5">Date Filed</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Last Updated</th>
                  <th className="p-3.5 pr-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                      No applications found matching the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 pl-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {app.id}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {app.businessName || app.applicant}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {app.type}
                      </td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400">
                        {app.dateSubmitted || app.date}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${app.statusColor}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {app.lastUpdated || app.date}
                      </td>
                      <td className="p-3.5 pr-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* View Specs Modal Button */}
                          <button 
                            onClick={() => handleOpenAppDetails(app)} 
                            className="p-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                            title="View Application Details"
                          >
                            <Eye size={14} />
                          </button>

                          {/* Download Package Button */}
                          <button 
                            onClick={() => handleDownloadAppPackage(app)} 
                            disabled={downloadingAppId === app.id}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              downloadAppSuccessId === app.id
                                ? 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                            title="Download Official Application Summary Package"
                          >
                            {downloadingAppId === app.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            ) : downloadAppSuccessId === app.id ? (
                              <CheckCircle2 size={14} className="text-emerald-600" />
                            ) : (
                              <Download size={14} />
                            )}
                          </button>

                          {/* Payment / PDF Actions */}
                          {app.status === 'Approved' ? (
                            <button
                              onClick={() => handleOpenPayment(app)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition-colors shadow-xs cursor-pointer flex items-center space-x-1"
                              title="Proceed to Payment"
                            >
                              <CreditCard size={12} />
                              <span>Pay</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onNavigateToTab('Requirements Submission')}
                              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                              title="Update Requirements"
                            >
                              Docs
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW APPLICATION DETAILS SPEC SHEET */}
      {/* ========================================================================= */}
      {activeModal === 'app_details' && selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <FileText size={20} className="text-blue-400" />
                <h3 className="font-bold text-sm">Application Spec Sheet — {selectedApp.id}</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-3 rounded-2xl flex items-center justify-between text-emerald-900 dark:text-emerald-200 font-semibold">
                <span>Status: <strong className="uppercase">{selectedApp.status}</strong></span>
                <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">Ref: NR-2024-000123</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider text-slate-400">
                  Business Particulars & Entity Info
                </h4>
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px]">Business Entity Name</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedApp.businessName || selectedApp.applicant}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px]">Permit Category</p>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{selectedApp.type}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px]">Gross Annual Sales / Scope</p>
                    <p className="font-mono font-bold text-slate-900 dark:text-white">{selectedApp.grossSales || '₱1,500,000.00'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px]">LGU Location</p>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{selectedApp.location || 'San Isidro, Laguna'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider text-slate-400">
                  Submitted Government Documents
                </h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span>1. Business Registration (DTI / SEC)</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                      <Check size={14} />
                      <span>Verified</span>
                    </span>
                  </li>
                  <li className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span>2. Mayor's / Business Application Form</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                      <Check size={14} />
                      <span>Verified</span>
                    </span>
                  </li>
                  <li className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span>3. Barangay Business Clearance</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                      <Check size={14} />
                      <span>Verified</span>
                    </span>
                  </li>
                  <li className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span>4. Tax Identification Number (TIN)</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                      <Check size={14} />
                      <span>Verified</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
              <button 
                onClick={() => setActiveModal('none')} 
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={() => { setActiveModal('payment_gateway'); }} 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EPROVIDER PAYMENT GATEWAY MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'payment_gateway' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-blue-900 text-white flex items-center justify-between border-b border-blue-800">
              <div className="flex items-center space-x-2.5">
                <CreditCard size={20} className="text-blue-400" />
                <h3 className="font-bold text-sm">Eprovider Payment Gateway</h3>
              </div>
              <button onClick={() => { setActiveModal('none'); setPaymentSuccess(false); }} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {!paymentSuccess ? (
              <div className="p-6 space-y-4 text-xs">
                <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">Total Amount Due</p>
                    <p className="text-2xl font-black text-blue-900 dark:text-blue-200">
                      {selectedApp?.amount || '₱5,695.00'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-600 text-white font-mono font-bold text-[10px] rounded-full">
                    {selectedApp?.id || 'BP-2024-00123'}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-slate-800 dark:text-slate-200">Select Payment Method</label>

                  <div className="space-y-2">
                    <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-colors ${
                      paymentMethod === 'eprovider' 
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/50 font-bold dark:border-blue-500' 
                        : 'border-slate-200 dark:border-slate-800 dark:bg-slate-800/40'
                    }`}>
                      <div className="flex items-center space-x-2.5">
                        <input type="radio" name="payMethod" checked={paymentMethod === 'eprovider'} onChange={() => setPaymentMethod('eprovider')} />
                        <span className="text-slate-800 dark:text-slate-200">Eprovider Auth Wallet (JWT OTP Instant)</span>
                      </div>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold">Zero Fee</span>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-colors ${
                      paymentMethod === 'gcash' 
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/50 font-bold dark:border-blue-500' 
                        : 'border-slate-200 dark:border-slate-800 dark:bg-slate-800/40'
                    }`}>
                      <div className="flex items-center space-x-2.5">
                        <input type="radio" name="payMethod" checked={paymentMethod === 'gcash'} onChange={() => setPaymentMethod('gcash')} />
                        <span className="text-slate-800 dark:text-slate-200">GCash e-Wallet</span>
                      </div>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-colors ${
                      paymentMethod === 'maya' 
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/50 font-bold dark:border-blue-500' 
                        : 'border-slate-200 dark:border-slate-800 dark:bg-slate-800/40'
                    }`}>
                      <div className="flex items-center space-x-2.5">
                        <input type="radio" name="payMethod" checked={paymentMethod === 'maya'} onChange={() => setPaymentMethod('maya')} />
                        <span className="text-slate-800 dark:text-slate-200">Maya Pay</span>
                      </div>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-colors ${
                      paymentMethod === 'bank' 
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/50 font-bold dark:border-blue-500' 
                        : 'border-slate-200 dark:border-slate-800 dark:bg-slate-800/40'
                    }`}>
                      <div className="flex items-center space-x-2.5">
                        <input type="radio" name="payMethod" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                        <span className="text-slate-800 dark:text-slate-200">Over-the-Counter Bank Transfer</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleConfirmPayment}
                    disabled={isPaymentProcessing}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isPaymentProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing Instant Payment...</span>
                      </div>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>Confirm & Pay {selectedApp?.amount || '₱5,695.00'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-4 text-xs">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Payment Successful!</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Transaction Ref: TXN-998230112</p>
                  <p className="text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">Amount Paid: {selectedApp?.amount || '₱5,695.00'}</p>
                </div>
                <div className="pt-2 flex justify-center space-x-3">
                  <button 
                    onClick={() => { setActiveModal('none'); setPaymentSuccess(false); }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

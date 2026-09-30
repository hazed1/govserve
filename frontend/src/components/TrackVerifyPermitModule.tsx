import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Search, Upload, FileText, CheckCircle2, Clock, AlertTriangle, Shield,
  ShieldCheck, QrCode, Eye, EyeOff, Camera, X, ArrowLeft, ArrowRight,
  User, Users, Globe, CreditCard, Banknote, MapPin, Calendar, Building,
  Activity, Hash, Lock, RefreshCw, Sparkles, Award, ChevronDown, ChevronUp,
  HelpCircle, AlertCircle, XCircle, Check, Download, Printer, Send,
  Home, Layers, Zap, Image, File, Trash2, RotateCcw, Info, Flag,
  MessageSquare, Phone, Mail, ExternalLink, ChevronRight, Fingerprint,
  ScanLine, Timer, CircleDot, Loader2
} from 'lucide-react';
import { TabType } from '../types';

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'pdf' | 'unknown';
  name: string;
  size: string;
}

interface TrackingResult {
  applicantName: string;
  permitType: string;
  applicationNumber: string;
  dateSubmitted: string;
  currentStatus: string;
  currentDepartment: string;
  processingProgress: number;
  lastUpdated: string;
  milestones: MilestoneItem[];
}

interface MilestoneItem {
  step: number;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  date: string;
  time?: string;
  department?: string;
  officer?: string;
  description?: string;
}

interface VerificationResult {
  isAuthentic: boolean;
  documentType: string;
  referenceNumber: string;
  issuingDepartment: string;
  digitalSealStatus: 'valid' | 'invalid' | 'unknown';
  sha256Status: 'match' | 'mismatch' | 'unknown';
  rsaSignatureStatus: 'valid' | 'invalid' | 'unknown';
  masterLedgerStatus: 'recorded' | 'not_found' | 'unknown';
  verificationDateTime: string;
  sha256Hash?: string;
  rsaPublicKey?: string;
  certificateChain?: string;
  blockHeight?: number;
}

interface FraudReport {
  referenceNumber: string;
  submissionDateTime: string;
  reportStatus: string;
  investigationStatus: string;
}

type ServiceView = 'dashboard' | 'track-permit' | 'live-milestones' | 'verify-hash' | 'report-fraud';
type ProcessStep = 'upload' | 'processing' | 'result' | 'success';

/* ==========================================================================
   PROPS
   ========================================================================== */

interface TrackVerifyPermitModuleProps {
  onNavigateToTab?: (tab: TabType | string) => void;
  onNavigateToDashboard?: () => void;
  currentTab?: string;
}

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const MOCK_TRACKING_RESULTS: Record<string, TrackingResult> = {
  'BP-2025-00045': {
    applicantName: 'Maria Santos',
    permitType: 'Business Permit — New Registration',
    applicationNumber: 'BP-2025-00045',
    dateSubmitted: 'September 15, 2026',
    currentStatus: 'Department Processing',
    currentDepartment: 'Business Permits & Licensing Office',
    processingProgress: 65,
    lastUpdated: 'September 28, 2026 — 3:42 PM',
    milestones: [
      { step: 1, title: 'Application Submitted', status: 'completed', date: 'Sep 15, 2026', time: '9:15 AM', department: 'Online Portal', description: 'Application successfully filed through GovServe portal.' },
      { step: 2, title: 'Under Review', status: 'completed', date: 'Sep 16, 2026', time: '10:30 AM', department: 'Receiving Office', officer: 'Officer R. Mendoza', description: 'Application received and initial completeness check passed.' },
      { step: 3, title: 'Document Verification', status: 'completed', date: 'Sep 18, 2026', time: '2:00 PM', department: 'Document Verification Unit', officer: 'Officer A. Garcia', description: 'All submitted documents verified and validated.' },
      { step: 4, title: 'Department Processing', status: 'in_progress', date: 'Sep 22, 2026', time: '11:00 AM', department: 'Business Permits & Licensing Office', officer: 'Officer J. Reyes', description: 'Your application is currently being reviewed by the Business Permit Office.' },
      { step: 5, title: 'Approved', status: 'pending', date: '', department: 'Mayor\'s Office', description: 'Awaiting final approval from the Mayor\'s Office.' },
      { step: 6, title: 'Ready for Release', status: 'pending', date: '', department: 'Releasing Office', description: 'Permit will be available for download once approved.' },
    ]
  },
  'BC-2025-00125': {
    applicantName: 'Engr. Daniel Ramos',
    permitType: 'Building Permit — 2-Storey Residential',
    applicationNumber: 'BC-2025-00125',
    dateSubmitted: 'August 10, 2026',
    currentStatus: 'Inspection / Assessment',
    currentDepartment: 'City Engineering Office',
    processingProgress: 78,
    lastUpdated: 'September 27, 2026 — 11:15 AM',
    milestones: [
      { step: 1, title: 'Application Submitted', status: 'completed', date: 'Aug 10, 2026', time: '8:45 AM', department: 'Online Portal', description: 'Building permit application submitted with complete plans.' },
      { step: 2, title: 'Initial Review', status: 'completed', date: 'Aug 12, 2026', time: '9:30 AM', department: 'City Engineering Office', officer: 'Engr. P. Villanueva', description: 'Plans reviewed for code compliance.' },
      { step: 3, title: 'Document Verification', status: 'completed', date: 'Aug 15, 2026', time: '1:15 PM', department: 'Document Verification Unit', description: 'All structural plans and engineering documents verified.' },
      { step: 4, title: 'Department Review', status: 'completed', date: 'Aug 20, 2026', time: '3:00 PM', department: 'City Engineering Office', officer: 'Engr. M. Santos', description: 'Multi-department review completed.' },
      { step: 5, title: 'Inspection / Assessment', status: 'in_progress', date: 'Sep 25, 2026', time: '10:00 AM', department: 'City Engineering Office', officer: 'Insp. R. Cruz', description: 'On-site inspection scheduled and in progress.' },
      { step: 6, title: 'Approval', status: 'pending', date: '', department: 'City Engineering Office', description: 'Pending inspection report and final approval.' },
      { step: 7, title: 'Permit Ready', status: 'pending', date: '', department: 'Releasing Office', description: 'Building permit will be released after approval.' },
    ]
  },
  'FT-2025-00078': {
    applicantName: 'XYZ Transport Co.',
    permitType: 'Franchise Permit (MTOP)',
    applicationNumber: 'FT-2025-00078',
    dateSubmitted: 'July 5, 2026',
    currentStatus: 'Approved',
    currentDepartment: 'Mayor\'s Office',
    processingProgress: 95,
    lastUpdated: 'September 30, 2026 — 4:00 PM',
    milestones: [
      { step: 1, title: 'Application Submitted', status: 'completed', date: 'Jul 05, 2026', time: '10:00 AM', department: 'Online Portal', description: 'MTOP franchise application filed.' },
      { step: 2, title: 'Initial Review', status: 'completed', date: 'Jul 08, 2026', time: '9:00 AM', department: 'Transport Office', officer: 'Officer L. Bautista', description: 'Route and fleet documents reviewed.' },
      { step: 3, title: 'Document Verification', status: 'completed', date: 'Jul 12, 2026', time: '2:30 PM', department: 'Document Verification Unit', description: 'Vehicle registration and insurance verified.' },
      { step: 4, title: 'Department Review', status: 'completed', date: 'Jul 20, 2026', time: '11:00 AM', department: 'Transport Regulatory Office', description: 'Route conflict check passed.' },
      { step: 5, title: 'Inspection / Assessment', status: 'completed', date: 'Aug 01, 2026', time: '8:30 AM', department: 'Transport Inspection Unit', description: 'Vehicle inspection passed.' },
      { step: 6, title: 'Approval', status: 'completed', date: 'Sep 30, 2026', time: '4:00 PM', department: 'Mayor\'s Office', description: 'Franchise permit approved by the Mayor.' },
      { step: 7, title: 'Permit Ready', status: 'in_progress', date: '', department: 'Releasing Office', description: 'Your permit is being prepared for release. Please check back soon.' },
    ]
  }
};

const DEFAULT_REFERENCE = 'BP-2025-00045';

/* ==========================================================================
   HELPER COMPONENTS
   ========================================================================== */

// File Upload Zone
const FileUploadZone: React.FC<{
  files: UploadedFile[];
  onFilesAdded: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  label?: string;
  hint?: string;
  accept?: string;
  maxSizeMB?: number;
  accentColor?: string;
}> = ({ files, onFilesAdded, onRemoveFile, label, hint, accept = '.jpg,.jpeg,.png,.pdf', maxSizeMB = 10, accentColor = 'blue' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-100 dark:bg-blue-900/50' },
    green: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-300 dark:border-emerald-700', text: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/50' },
    red: { bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-300 dark:border-rose-700', text: 'text-rose-600 dark:text-rose-400', iconBg: 'bg-rose-100 dark:bg-rose-900/50' },
  };
  const colors = colorMap[accentColor] || colorMap.blue;

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFiles = useCallback((fileList: FileList | File[]) => {
    const validFiles: File[] = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    Array.from(fileList).forEach(f => {
      if (!allowedTypes.includes(f.type)) return;
      if (f.size > maxSizeMB * 1024 * 1024) return;
      validFiles.push(f);
    });
    if (validFiles.length > 0) onFilesAdded(validFiles);
  }, [onFilesAdded, maxSizeMB]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragOver ? `${colors.bg} ${colors.border} scale-[1.01]` : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple
          capture="environment"
          onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }}
        />
        <div className={`w-14 h-14 ${colors.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <Upload size={24} className={colors.text} />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
          {hint || 'Upload a clear photo or screenshot'}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Drag & drop files here, or click to browse
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-medium text-slate-500 dark:text-slate-400">
            <Image size={10} /> JPG / PNG
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-medium text-slate-500 dark:text-slate-400">
            <File size={10} /> PDF
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-medium text-slate-500 dark:text-slate-400">
            <Camera size={10} /> Camera
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Max {maxSizeMB}MB</span>
        </div>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
              {f.type === 'image' ? (
                <img src={f.preview} alt={f.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
              ) : (
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-rose-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{f.name}</p>
                <p className="text-[10px] text-slate-400">{f.size}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onRemoveFile(f.id); }} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Service Info Card (left panel)
const ServiceInfoPanel: React.FC<{
  targetUsers: string;
  serviceMethod: string;
  timePeriod: string;
  charges: string;
  paymentMethod: string;
  accentColor?: string;
}> = ({ targetUsers, serviceMethod, timePeriod, charges, paymentMethod, accentColor = 'blue' }) => {
  const colorMap: Record<string, { icon: string; badge: string }> = {
    blue: { icon: 'text-blue-500', badge: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    green: { icon: 'text-emerald-500', badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    red: { icon: 'text-rose-500', badge: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
  };
  const c = colorMap[accentColor] || colorMap.blue;

  const items = [
    { icon: <Users size={16} className={c.icon} />, label: 'Target Users', value: targetUsers },
    { icon: <Globe size={16} className={c.icon} />, label: 'Service Method', value: serviceMethod },
    { icon: <Clock size={16} className={c.icon} />, label: 'Time Period', value: timePeriod },
    { icon: <Banknote size={16} className={c.icon} />, label: 'Charges & Payment', value: charges },
    { icon: <CreditCard size={16} className={c.icon} />, label: 'Payment Method', value: paymentMethod },
  ];

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${c.badge} border`}>
            {item.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">{item.label}</p>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Progress Bar
const ProgressBar: React.FC<{ progress: number; color?: string }> = ({ progress, color = 'blue' }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-rose-500',
  };
  return (
    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-full rounded-full ${colorMap[color] || colorMap.blue} transition-all duration-1000 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Loading Spinner Overlay
const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-300">
    <div className="relative w-20 h-20 mb-6">
      <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full" />
      <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <div className="absolute inset-3 border-4 border-blue-300 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
    </div>
    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">{message}</p>
    <p className="text-xs text-slate-400">This usually takes a few seconds...</p>
  </div>
);

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export const TrackVerifyPermitModule: React.FC<TrackVerifyPermitModuleProps> = ({
  onNavigateToTab,
  onNavigateToDashboard,
  currentTab
}) => {
  // View states
  const [activeView, setActiveView] = useState<ServiceView>('dashboard');
  const [processStep, setProcessStep] = useState<ProcessStep>('upload');

  // Upload states
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [referenceCode, setReferenceCode] = useState('');

  // Result states
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [fraudReport, setFraudReport] = useState<FraudReport | null>(null);
  const [showTechDetails, setShowTechDetails] = useState(false);

  // Fraud report form
  const [reportType, setReportType] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportContact, setReportContact] = useState('');
  const [reportRefCode, setReportRefCode] = useState('');

  // Help section
  const [showHelp, setShowHelp] = useState(false);

  // Nav state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // File handling
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFilesAdded = useCallback((files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      type: file.type.startsWith('image/') ? 'image' as const : file.type === 'application/pdf' ? 'pdf' as const : 'unknown' as const,
      name: file.name,
      size: formatFileSize(file.size),
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const resetState = () => {
    setUploadedFiles([]);
    setReferenceCode('');
    setTrackingResult(null);
    setVerificationResult(null);
    setFraudReport(null);
    setShowTechDetails(false);
    setProcessStep('upload');
    setReportType('');
    setReportDescription('');
    setReportContact('');
    setReportRefCode('');
  };

  const navigateTo = (view: ServiceView) => {
    resetState();
    setActiveView(view);
  };

  // Simulate tracking lookup
  const handleTrackPermit = () => {
    if (uploadedFiles.length === 0 && !referenceCode.trim()) return;
    setProcessStep('processing');

    setTimeout(() => {
      const code = referenceCode.trim().toUpperCase() || DEFAULT_REFERENCE;
      const result = MOCK_TRACKING_RESULTS[code] || MOCK_TRACKING_RESULTS[DEFAULT_REFERENCE];
      setTrackingResult(result);
      setProcessStep('result');
    }, 2500);
  };

  // Simulate verification
  const handleVerifyDocument = () => {
    if (uploadedFiles.length === 0 && !referenceCode.trim()) return;
    setProcessStep('processing');

    setTimeout(() => {
      const isAuthentic = Math.random() > 0.15; // 85% chance authentic
      setVerificationResult({
        isAuthentic,
        documentType: 'Business Permit — Official Digital Copy',
        referenceNumber: referenceCode.trim().toUpperCase() || 'BP-2025-00045',
        issuingDepartment: 'Business Permits & Licensing Office (BPLO)',
        digitalSealStatus: isAuthentic ? 'valid' : 'invalid',
        sha256Status: isAuthentic ? 'match' : 'mismatch',
        rsaSignatureStatus: isAuthentic ? 'valid' : 'invalid',
        masterLedgerStatus: isAuthentic ? 'recorded' : 'not_found',
        verificationDateTime: new Date().toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'medium' }),
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        rsaPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQ...',
        certificateChain: 'GovServe Root CA → LGU Intermediate CA → BPLO Signing Certificate',
        blockHeight: 847291,
      });
      setProcessStep('result');
    }, 3000);
  };

  // Simulate fraud report
  const handleSubmitReport = () => {
    if (uploadedFiles.length === 0 && !reportDescription.trim()) return;
    setProcessStep('processing');

    setTimeout(() => {
      const reportNum = `FR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setFraudReport({
        referenceNumber: reportNum,
        submissionDateTime: new Date().toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'medium' }),
        reportStatus: 'Submitted — Pending Review',
        investigationStatus: 'Queued for Priority Investigation (within 24 hours)',
      });
      setProcessStep('success');
    }, 2000);
  };

  // Confirm dialog
  const [showConfirm, setShowConfirm] = useState(false);

  /* ========================================================================
     RENDER: DASHBOARD
     ======================================================================== */

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={32} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">Track & Verify Official Permits</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
          Track your application progress, verify permit authenticity, or report suspicious documents — all in one place.
        </p>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
        {/* Card 1: Track Permit */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Search size={22} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Track & Verify Official Permits</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Track pending or approved LGU permit applications with instant digital status lookup.</p>
              </div>
            </div>
            <ServiceInfoPanel
              targetUsers="All citizens and applicants tracking pending or approved LGU permits"
              serviceMethod="Online tracking through GovServe"
              timePeriod="Instant 24/7 digital status lookup with milestone audit history"
              charges="Free Public LGU Service (₱0.00 Tariff)"
              paymentMethod="Via GovServe online portal"
              accentColor="blue"
            />
          </div>
          <div className="px-6 pb-6 pt-2">
            <button
              onClick={() => navigateTo('track-permit')}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
            >
              <Search size={16} />
              Track Permit Application
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Card 2: Live Milestones */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/40 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Activity size={22} className="text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Live Application Milestone Tracker</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Monitor real-time progress of your application across municipal departments.</p>
              </div>
            </div>
            <ServiceInfoPanel
              targetUsers="All registered applicants, business owners, engineers, and authorized liaisons"
              serviceMethod="Online tracking through GovServe"
              timePeriod="Instant real-time updates synchronized across municipal departments"
              charges="Free Public LGU Service (₱0.00 Tariff)"
              paymentMethod="Via GovServe online portal"
              accentColor="blue"
            />
          </div>
          <div className="px-6 pb-6 pt-2">
            <button
              onClick={() => navigateTo('live-milestones')}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-sky-500/20 active:scale-[0.98]"
            >
              <Activity size={16} />
              Track Live Milestones
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Card 3: Cryptographic Verification */}
        <div className="bg-white dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl overflow-hidden hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Shield size={22} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Cryptographic Hash & Seal Verification</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Verify whether an official digital document or permit is authentic and unmodified.</p>
              </div>
            </div>
            <ServiceInfoPanel
              targetUsers="Enforcement officers, banking institutions, government agencies, and general public"
              serviceMethod="Online application through GovServe"
              timePeriod="Instant cryptographic validation under 1.5 seconds"
              charges="Free Public LGU Service (₱0.00 Tariff)"
              paymentMethod="Via GovServe online portal"
              accentColor="green"
            />
          </div>
          <div className="px-6 pb-6 pt-2">
            <button
              onClick={() => navigateTo('verify-hash')}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
            >
              <Shield size={16} />
              Verify Security Audit Hash
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Card 4: Report Fraud */}
        <div className="bg-white dark:bg-slate-900/60 border border-rose-200 dark:border-rose-900/50 rounded-2xl overflow-hidden hover:shadow-lg hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/40 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Flag size={22} className="text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Report Fraudulent or Tampered Permit</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Report suspicious or fraudulent permits for priority investigation.</p>
              </div>
            </div>
            <ServiceInfoPanel
              targetUsers="Concerned citizens, establishments, field inspectors, and victimized applicants"
              serviceMethod="Online application through GovServe"
              timePeriod="Priority investigation initiated within 24 hours"
              charges="Free Citizen Reporting Service (₱0.00 Tariff)"
              paymentMethod="Via GovServe online portal"
              accentColor="red"
            />
          </div>
          <div className="px-6 pb-6 pt-2">
            <button
              onClick={() => navigateTo('report-fraud')}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-rose-500/20 active:scale-[0.98]"
            >
              <Flag size={16} />
              Report Fraudulent Permit
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
              <HelpCircle size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Need Help?</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Step-by-step instructions for using this system</p>
            </div>
          </div>
          {showHelp ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>

        {showHelp && (
          <div className="mt-3 p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Camera size={20} className="text-blue-500" />, title: 'How to Upload', steps: ['Take a clear photo of your permit, QR code, or receipt', 'Click the upload area or drag your file', 'You can also use your phone camera', 'Make sure the image is clear and readable'] },
                { icon: <Hash size={20} className="text-sky-500" />, title: 'Find Your Reference Code', steps: ['Check your official receipt or email confirmation', 'The code starts with BP-, BC-, FT-, or BR-', 'You can also scan the QR code on your receipt', 'Contact the issuing office if you lost your code'] },
                { icon: <Search size={20} className="text-emerald-500" />, title: 'Track Application', steps: ['Upload your permit or reference code', 'Click "Track Application"', 'View your current status and progress', 'Check milestones for detailed history'] },
                { icon: <Shield size={20} className="text-amber-500" />, title: 'Verify a Permit', steps: ['Upload the permit document or QR code', 'Click "Verify Document"', 'View the authenticity result', 'Green = Authentic, Red = Problem detected'] },
              ].map((guide, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {guide.icon}
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{guide.title}</h4>
                  </div>
                  <ol className="space-y-2">
                    {guide.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-slate-500">{j + 1}</span>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* ========================================================================
     RENDER: TRACK PERMIT
     ======================================================================== */

  const renderTrackPermit = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Back Button */}
      <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
        <ArrowLeft size={16} /> Back to Services
      </button>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
          <Search size={24} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Track & Verify Official Permits</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Upload your permit, QR code, or receipt to check your application status.</p>
        </div>
      </div>

      {processStep === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Info Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Service Information</h3>
            <ServiceInfoPanel
              targetUsers="All citizens and applicants tracking pending or approved LGU permits"
              serviceMethod="Online tracking through GovServe"
              timePeriod="Instant 24/7 digital status lookup with milestone audit history"
              charges="Free Public LGU Service (₱0.00 Tariff)"
              paymentMethod="Via GovServe online portal"
              accentColor="blue"
            />
          </div>

          {/* Right: Upload */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Upload Your Document</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload a photo or screenshot of your permit, QR code, or reference code and we'll help identify your application.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['QR Code', 'Permit', 'Receipt', 'Reference Code'].map((label) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <QrCode size={12} className="text-blue-500" />
                  <span className="text-[10px] font-medium text-blue-700 dark:text-blue-300">{label}</span>
                </div>
              ))}
            </div>

            <FileUploadZone
              files={uploadedFiles}
              onFilesAdded={handleFilesAdded}
              onRemoveFile={handleRemoveFile}
              hint="Upload a clear photo or screenshot of your permit, QR code, or reference code"
              accentColor="blue"
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700" /></div>
              <div className="relative flex justify-center"><span className="px-3 bg-white dark:bg-slate-900/60 text-xs text-slate-400">or enter manually</span></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Reference Code</label>
              <div className="relative">
                <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value)}
                  placeholder="e.g. BP-2025-00045"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleTrackPermit}
              disabled={uploadedFiles.length === 0 && !referenceCode.trim()}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
            >
              <Search size={16} />
              Track Application
            </button>
          </div>
        </div>
      )}

      {processStep === 'processing' && (
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
          <LoadingOverlay message="Searching application records..." />
        </div>
      )}

      {processStep === 'result' && trackingResult && (
        <div className="space-y-5 animate-in fade-in duration-500">
          {/* Result Card */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-200">Application Found</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">We found your permit application. Here are the details.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Applicant Name', value: trackingResult.applicantName, icon: <User size={14} className="text-slate-400" /> },
                { label: 'Permit Type', value: trackingResult.permitType, icon: <FileText size={14} className="text-slate-400" /> },
                { label: 'Application Number', value: trackingResult.applicationNumber, icon: <Hash size={14} className="text-slate-400" /> },
                { label: 'Date Submitted', value: trackingResult.dateSubmitted, icon: <Calendar size={14} className="text-slate-400" /> },
                { label: 'Current Status', value: trackingResult.currentStatus, icon: <Activity size={14} className="text-blue-500" /> },
                { label: 'Current Department', value: trackingResult.currentDepartment, icon: <Building size={14} className="text-slate-400" /> },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <div className="flex items-center gap-1.5 mb-1">
                    {item.icon}
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                  </div>
                  <p className={`text-sm font-semibold ${item.label === 'Current Status' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Processing Progress</p>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{trackingResult.processingProgress}%</p>
              </div>
              <ProgressBar progress={trackingResult.processingProgress} color="blue" />
            </div>

            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock size={10} /> Last Updated: {trackingResult.lastUpdated}
            </p>
          </div>

          {/* Milestones */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity size={16} className="text-blue-500" /> Application Milestones
            </h3>
            <div className="space-y-0">
              {trackingResult.milestones.map((ms, i) => (
                <div key={i} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                      ms.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-600' :
                      ms.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-500 text-blue-600 animate-pulse' :
                      'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                    }`}>
                      {ms.status === 'completed' ? <Check size={14} /> : ms.status === 'in_progress' ? <Loader2 size={14} className="animate-spin" /> : <CircleDot size={14} />}
                    </div>
                    {i < trackingResult.milestones.length - 1 && (
                      <div className={`w-0.5 h-16 ${ms.status === 'completed' ? 'bg-emerald-300 dark:bg-emerald-700' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-6 flex-1 ${ms.status === 'pending' ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{ms.title}</p>
                      {ms.status === 'completed' && <span className="text-[10px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full font-medium border border-emerald-200 dark:border-emerald-800">✓ Completed</span>}
                      {ms.status === 'in_progress' && <span className="text-[10px] px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium border border-blue-200 dark:border-blue-800">● In Progress</span>}
                    </div>
                    {ms.date && <p className="text-[10px] text-slate-400 mt-0.5">{ms.date}{ms.time ? ` — ${ms.time}` : ''}</p>}
                    {ms.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{ms.description}</p>}
                    {ms.department && <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Building size={10} /> {ms.department}</p>}
                    {ms.officer && <p className="text-[10px] text-slate-400 flex items-center gap-1"><User size={10} /> {ms.officer}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigateTo('dashboard')} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <Home size={16} /> Back to Dashboard
            </button>
            <button onClick={() => { resetState(); }} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/20">
              <RotateCcw size={16} /> Track Another Application
            </button>
          </div>
        </div>
      )}
    </div>
  );

  /* ========================================================================
     RENDER: LIVE MILESTONES
     ======================================================================== */

  const renderLiveMilestones = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium">
        <ArrowLeft size={16} /> Back to Services
      </button>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/40 rounded-xl flex items-center justify-center">
          <Activity size={24} className="text-sky-600 dark:text-sky-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Application Milestone Tracker</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Monitor the real-time progress of your application across departments.</p>
        </div>
      </div>

      {processStep === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Service Information</h3>
            <ServiceInfoPanel
              targetUsers="All registered applicants, business owners, engineers, and authorized liaisons"
              serviceMethod="Online tracking through GovServe"
              timePeriod="Instant real-time updates synchronized across municipal departments"
              charges="Free Public LGU Service (₱0.00 Tariff)"
              paymentMethod="Via GovServe online portal"
              accentColor="blue"
            />
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Upload Your Document</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload your reference code screenshot, application receipt, permit, or QR code.</p>
            </div>

            <FileUploadZone
              files={uploadedFiles}
              onFilesAdded={handleFilesAdded}
              onRemoveFile={handleRemoveFile}
              hint="Upload your reference code, receipt, permit, or QR code"
              accentColor="blue"
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700" /></div>
              <div className="relative flex justify-center"><span className="px-3 bg-white dark:bg-slate-900/60 text-xs text-slate-400">or enter manually</span></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Enter Reference Code</label>
              <div className="relative">
                <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value)}
                  placeholder="e.g. BC-2025-00125"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleTrackPermit}
              disabled={uploadedFiles.length === 0 && !referenceCode.trim()}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-sky-500/20 active:scale-[0.98]"
            >
              <Activity size={16} />
              Track Live Milestones
            </button>
          </div>
        </div>
      )}

      {processStep === 'processing' && (
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
          <LoadingOverlay message="Checking your document..." />
        </div>
      )}

      {processStep === 'result' && trackingResult && (
        <div className="space-y-5 animate-in fade-in duration-500">
          {/* Status Banner */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-start gap-3">
            <Activity size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-200">
                {trackingResult.currentStatus === 'Approved' ? 'Your application has been approved!' :
                 `Your application is currently being reviewed by the ${trackingResult.currentDepartment}.`}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">{trackingResult.applicationNumber} — {trackingResult.permitType}</p>
            </div>
          </div>

          {/* Visual Timeline */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Timer size={16} className="text-sky-500" /> Live Milestone Timeline
            </h3>

            {/* Horizontal progress on larger screens */}
            <div className="hidden lg:block mb-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="absolute top-4 left-0 h-1 bg-sky-500 rounded-full transition-all duration-1000" style={{ width: `${(trackingResult.milestones.filter(m => m.status === 'completed').length / trackingResult.milestones.length) * 100}%` }} />
                {trackingResult.milestones.map((ms, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center" style={{ width: `${100 / trackingResult.milestones.length}%` }}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      ms.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' :
                      ms.status === 'in_progress' ? 'bg-sky-500 border-sky-500 text-white animate-pulse' :
                      'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                    }`}>
                      {ms.status === 'completed' ? <Check size={14} /> : ms.status === 'in_progress' ? <Loader2 size={14} className="animate-spin" /> : <span className="text-[10px] font-bold">{ms.step}</span>}
                    </div>
                    <p className={`text-[10px] font-medium mt-2 text-center leading-tight ${ms.status === 'pending' ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{ms.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical timeline (always shown, hidden on lg only for horizontal) */}
            <div className="lg:mt-4 space-y-0">
              {trackingResult.milestones.map((ms, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                      ms.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-600' :
                      ms.status === 'in_progress' ? 'bg-sky-100 dark:bg-sky-900/40 border-sky-500 text-sky-600 animate-pulse' :
                      'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                    }`}>
                      {ms.status === 'completed' ? <Check size={16} /> : ms.status === 'in_progress' ? <Loader2 size={16} className="animate-spin" /> : <CircleDot size={16} />}
                    </div>
                    {i < trackingResult.milestones.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-[40px] ${ms.status === 'completed' ? 'bg-emerald-300 dark:bg-emerald-700' : 'bg-slate-200 dark:bg-slate-700'}`} />
                    )}
                  </div>
                  <div className={`pb-6 flex-1 ${ms.status === 'pending' ? 'opacity-40' : ''}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{ms.title}</p>
                      {ms.status === 'in_progress' && (
                        <span className="text-[10px] px-2 py-0.5 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full font-semibold border border-sky-200 dark:border-sky-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" /> In Progress
                        </span>
                      )}
                    </div>
                    {ms.date && (
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar size={10} /> {ms.date}{ms.time ? ` at ${ms.time}` : ''}
                      </p>
                    )}
                    {ms.department && <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1"><Building size={10} /> {ms.department}</p>}
                    {ms.officer && <p className="text-[10px] text-slate-400 flex items-center gap-1"><User size={10} /> Assigned: {ms.officer}</p>}
                    {ms.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl leading-relaxed border border-slate-100 dark:border-slate-700/50">{ms.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigateTo('dashboard')} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <Home size={16} /> Back to Dashboard
            </button>
            <button onClick={() => { resetState(); }} className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-sky-500/20">
              <RotateCcw size={16} /> Track Another Application
            </button>
          </div>
        </div>
      )}
    </div>
  );

  /* ========================================================================
     RENDER: VERIFY HASH
     ======================================================================== */

  const renderVerifyHash = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
        <ArrowLeft size={16} /> Back to Services
      </button>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
          <Shield size={24} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Cryptographic Hash & Seal Verification</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Verify whether an official document or permit is authentic and has not been modified.</p>
        </div>
      </div>

      {processStep === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Service Information</h3>
            <ServiceInfoPanel
              targetUsers="Enforcement officers, banking institutions, government agencies, and general public"
              serviceMethod="Online application through GovServe"
              timePeriod="Instant cryptographic validation under 1.5 seconds"
              charges="Free Public LGU Service (₱0.00 Tariff)"
              paymentMethod="Via GovServe online portal"
              accentColor="green"
            />
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Upload Document to Verify</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload a permit image, PDF, QR code, digital seal screenshot, or official receipt.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Permit Image', 'PDF Permit', 'QR Code', 'Digital Seal', 'Receipt'].map((label) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <Shield size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300">{label}</span>
                </div>
              ))}
            </div>

            <FileUploadZone
              files={uploadedFiles}
              onFilesAdded={handleFilesAdded}
              onRemoveFile={handleRemoveFile}
              hint="Upload your permit, QR code, or digital seal for verification"
              accentColor="green"
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700" /></div>
              <div className="relative flex justify-center"><span className="px-3 bg-white dark:bg-slate-900/60 text-xs text-slate-400">or enter manually</span></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Enter Hash / Reference Code</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value)}
                  placeholder="e.g. SHA256-BP-2024-00123-99A8F12B004"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleVerifyDocument}
              disabled={uploadedFiles.length === 0 && !referenceCode.trim()}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
            >
              <Shield size={16} />
              Verify Document
            </button>
          </div>
        </div>
      )}

      {processStep === 'processing' && (
        <div className="bg-white dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-8">
          <LoadingOverlay message="Verifying permit..." />
        </div>
      )}

      {processStep === 'result' && verificationResult && (
        <div className="space-y-5 animate-in fade-in duration-500">
          {/* Main Verdict */}
          <div className={`p-8 rounded-2xl border-2 text-center ${
            verificationResult.isAuthentic
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700'
              : 'bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700'
          }`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              verificationResult.isAuthentic
                ? 'bg-emerald-100 dark:bg-emerald-800/50'
                : 'bg-rose-100 dark:bg-rose-800/50'
            }`}>
              {verificationResult.isAuthentic
                ? <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
                : <XCircle size={40} className="text-rose-600 dark:text-rose-400" />
              }
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${
              verificationResult.isAuthentic
                ? 'text-emerald-800 dark:text-emerald-200'
                : 'text-rose-800 dark:text-rose-200'
            }`}>
              {verificationResult.isAuthentic ? '✓ AUTHENTIC DOCUMENT' : '⚠ VERIFICATION FAILED'}
            </h2>
            <p className={`text-sm ${
              verificationResult.isAuthentic
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-rose-700 dark:text-rose-300'
            }`}>
              {verificationResult.isAuthentic
                ? 'Digital seal and document integrity successfully verified.'
                : 'We could not verify this document. Please upload a clearer copy or contact the issuing office.'
              }
            </p>
          </div>

          {/* Verification Details */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verification Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Document Type', value: verificationResult.documentType, icon: <FileText size={14} /> },
                { label: 'Reference Number', value: verificationResult.referenceNumber, icon: <Hash size={14} /> },
                { label: 'Issuing Department', value: verificationResult.issuingDepartment, icon: <Building size={14} /> },
                { label: 'Verification Date & Time', value: verificationResult.verificationDateTime, icon: <Calendar size={14} /> },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                    {item.icon}
                    <p className="text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Status badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Digital Seal', status: verificationResult.digitalSealStatus },
                { label: 'SHA-256 Hash', status: verificationResult.sha256Status === 'match' ? 'valid' : verificationResult.sha256Status },
                { label: 'RSA Signature', status: verificationResult.rsaSignatureStatus },
                { label: 'Master Ledger', status: verificationResult.masterLedgerStatus === 'recorded' ? 'valid' : verificationResult.masterLedgerStatus },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-xl text-center border ${
                  item.status === 'valid' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' :
                  item.status === 'invalid' || item.status === 'mismatch' || item.status === 'not_found' ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800' :
                  'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}>
                  <div className="flex items-center justify-center mb-1">
                    {item.status === 'valid' ? <CheckCircle2 size={16} className="text-emerald-500" /> :
                     item.status === 'invalid' || item.status === 'mismatch' || item.status === 'not_found' ? <XCircle size={16} className="text-rose-500" /> :
                     <HelpCircle size={16} className="text-slate-400" />}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className={`text-xs font-semibold capitalize ${
                    item.status === 'valid' ? 'text-emerald-700 dark:text-emerald-300' :
                    item.status === 'invalid' || item.status === 'mismatch' || item.status === 'not_found' ? 'text-rose-700 dark:text-rose-300' :
                    'text-slate-500'
                  }`}>{item.status === 'match' ? 'Valid' : item.status === 'recorded' ? 'Recorded' : item.status === 'not_found' ? 'Not Found' : item.status}</p>
                </div>
              ))}
            </div>

            {/* Technical Details Toggle */}
            <button
              onClick={() => setShowTechDetails(!showTechDetails)}
              className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              {showTechDetails ? <EyeOff size={14} /> : <Eye size={14} />}
              {showTechDetails ? 'Hide Technical Details' : 'View Technical Details'}
              {showTechDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showTechDetails && (
              <div className="p-4 bg-slate-900 dark:bg-slate-950 rounded-xl space-y-3 animate-in slide-in-from-top-2 duration-300">
                <div>
                  <p className="text-[10px] font-mono text-slate-500 mb-0.5">SHA-256 Document Hash</p>
                  <p className="text-[11px] font-mono text-emerald-400 break-all">{verificationResult.sha256Hash}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-500 mb-0.5">RSA Public Key (Truncated)</p>
                  <p className="text-[11px] font-mono text-blue-400 break-all">{verificationResult.rsaPublicKey}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-500 mb-0.5">Certificate Chain</p>
                  <p className="text-[11px] font-mono text-amber-400">{verificationResult.certificateChain}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-500 mb-0.5">Master Ledger Block Height</p>
                  <p className="text-[11px] font-mono text-purple-400">#{verificationResult.blockHeight}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigateTo('dashboard')} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <Home size={16} /> Back to Dashboard
            </button>
            <button onClick={() => { resetState(); }} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-emerald-500/20">
              <RotateCcw size={16} /> Verify Another Document
            </button>
          </div>
        </div>
      )}
    </div>
  );

  /* ========================================================================
     RENDER: REPORT FRAUD
     ======================================================================== */

  const renderReportFraud = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-medium">
        <ArrowLeft size={16} /> Back to Services
      </button>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/40 rounded-xl flex items-center justify-center">
          <Flag size={24} className="text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Report Fraudulent or Tampered Permit</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Upload evidence and describe the issue. Your report will be investigated within 24 hours.</p>
        </div>
      </div>

      {processStep === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Service Information</h3>
            <ServiceInfoPanel
              targetUsers="Concerned citizens, establishments, field inspectors, and victimized applicants"
              serviceMethod="Online application through GovServe"
              timePeriod="Priority investigation initiated within 24 hours"
              charges="Free Citizen Reporting Service (₱0.00 Tariff)"
              paymentMethod="Via GovServe online portal"
              accentColor="red"
            />

            {/* Simple steps */}
            <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/15 rounded-xl border border-rose-200 dark:border-rose-800">
              <p className="text-xs font-bold text-rose-800 dark:text-rose-200 mb-2">Simple 3-Step Process</p>
              <div className="space-y-2">
                {['Upload Evidence', 'Describe the Issue', 'Submit Report'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-rose-200 dark:bg-rose-800 rounded-full flex items-center justify-center text-[10px] font-bold text-rose-700 dark:text-rose-200">{i + 1}</div>
                    <p className="text-xs text-rose-700 dark:text-rose-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-slate-900/60 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 space-y-5">
            {/* Step 1: Upload */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <span className="w-6 h-6 bg-rose-100 dark:bg-rose-900/40 rounded-full flex items-center justify-center text-[10px] font-bold text-rose-600">1</span>
                Upload Evidence
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-8">Photo of suspicious permit, screenshot, receipt, or any supporting evidence.</p>
            </div>

            <FileUploadZone
              files={uploadedFiles}
              onFilesAdded={handleFilesAdded}
              onRemoveFile={handleRemoveFile}
              hint="Upload photos, screenshots, or documents as evidence"
              accentColor="red"
            />

            {/* Step 2: Describe */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-rose-100 dark:bg-rose-900/40 rounded-full flex items-center justify-center text-[10px] font-bold text-rose-600">2</span>
                Describe the Issue
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">What are you reporting?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'fake_permit', label: 'Fake Permit', icon: <FileText size={14} /> },
                      { value: 'tampered_permit', label: 'Tampered Permit', icon: <AlertTriangle size={14} /> },
                      { value: 'fake_receipt', label: 'Fake Receipt', icon: <CreditCard size={14} /> },
                      { value: 'incident', label: 'Incident Report', icon: <Flag size={14} /> },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setReportType(opt.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                          reportType === opt.value
                            ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 ring-1 ring-rose-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-200 dark:hover:border-rose-800'
                        }`}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Short Description</label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Briefly describe what you observed..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Reference Code <span className="text-slate-400 font-normal">(optional)</span></label>
                    <div className="relative">
                      <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={reportRefCode}
                        onChange={(e) => setReportRefCode(e.target.value)}
                        placeholder="e.g. BP-2025-00045"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Contact Info <span className="text-slate-400 font-normal">(optional)</span></label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={reportContact}
                        onChange={(e) => setReportContact(e.target.value)}
                        placeholder="Phone or email"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Submit */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-rose-100 dark:bg-rose-900/40 rounded-full flex items-center justify-center text-[10px] font-bold text-rose-600">3</span>
                Submit Report
              </h3>

              {!showConfirm ? (
                <button
                  onClick={() => {
                    if (uploadedFiles.length === 0 && !reportDescription.trim()) return;
                    setShowConfirm(true);
                  }}
                  disabled={uploadedFiles.length === 0 && !reportDescription.trim()}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-rose-500/20 active:scale-[0.98]"
                >
                  <Send size={16} />
                  Submit Fraud Report
                </button>
              ) : (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Confirm Submission</p>
                      <p className="text-xs text-amber-700 dark:text-amber-300">Are you sure you want to submit this fraud report? This action cannot be undone.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { setShowConfirm(false); handleSubmitReport(); }}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-all"
                    >
                      Yes, Submit Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {processStep === 'processing' && (
        <div className="bg-white dark:bg-slate-900/60 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-8">
          <LoadingOverlay message="Submitting your report..." />
        </div>
      )}

      {processStep === 'success' && fraudReport && (
        <div className="space-y-5 animate-in fade-in duration-500">
          {/* Success Banner */}
          <div className="p-8 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl text-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">Report Successfully Submitted</h2>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">Your report has been received and queued for priority investigation.</p>
          </div>

          {/* Report Details */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Report Confirmation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Report Reference Number', value: fraudReport.referenceNumber, icon: <Hash size={14} /> },
                { label: 'Submission Date & Time', value: fraudReport.submissionDateTime, icon: <Calendar size={14} /> },
                { label: 'Report Status', value: fraudReport.reportStatus, icon: <Activity size={14} /> },
                { label: 'Investigation Status', value: fraudReport.investigationStatus, icon: <Shield size={14} /> },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                    {item.icon}
                    <p className="text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3">
            <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              Save your Report Reference Number <strong>{fraudReport.referenceNumber}</strong> for future tracking. 
              You may be contacted by our investigation team if additional information is needed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigateTo('dashboard')} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <Home size={16} /> Back to Dashboard
            </button>
            <button onClick={() => { resetState(); }} className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-rose-500/20">
              <RotateCcw size={16} /> Submit Another Report
            </button>
          </div>
        </div>
      )}
    </div>
  );

  /* ========================================================================
     NAVIGATION HEADER
     ======================================================================== */

  const navItems: { label: string; view: ServiceView; icon: React.ReactNode }[] = [
    { label: 'Home', view: 'dashboard', icon: <Home size={14} /> },
    { label: 'Track Application', view: 'track-permit', icon: <Search size={14} /> },
    { label: 'Verify Permit', view: 'verify-hash', icon: <Shield size={14} /> },
    { label: 'Report Issue', view: 'report-fraud', icon: <Flag size={14} /> },
  ];

  /* ========================================================================
     MAIN RENDER
     ======================================================================== */

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans antialiased">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-none">GovServe</h1>
                <p className="text-[9px] text-blue-600 dark:text-blue-400 font-semibold">Official Permit Services</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => navigateTo(item.view)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeView === item.view
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              >
                <HelpCircle size={14} />
                Help
              </button>
            </nav>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileNavOpen ? <X size={18} /> : <Layers size={18} />}
            </button>
          </div>

          {/* Mobile Nav Dropdown */}
          {mobileNavOpen && (
            <div className="md:hidden pb-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => { navigateTo(item.view); setMobileNavOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    activeView === item.view
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { setShowHelp(!showHelp); setMobileNavOpen(false); if (activeView !== 'dashboard') navigateTo('dashboard'); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              >
                <HelpCircle size={14} />
                Help
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'track-permit' && renderTrackPermit()}
        {activeView === 'live-milestones' && renderLiveMilestones()}
        {activeView === 'verify-hash' && renderVerifyHash()}
        {activeView === 'report-fraud' && renderReportFraud()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} GovServe — Official Permit Tracking & Verification System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TrackVerifyPermitModule;

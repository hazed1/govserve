import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Download, 
  Printer, 
  Mail, 
  Share2, 
  Lock, 
  QrCode, 
  Info,
  Building,
  ShieldCheck,
  FileCheck,
  X,
  Copy,
  Check,
  Send,
  ZoomIn,
  Eye,
  Calendar, 
  User, 
  Shield 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PermitGenerationProps {
  onNavigateToTab?: (tab: string) => void;
}

export const PermitGeneration: React.FC<PermitGenerationProps> = ({
  onNavigateToTab
}) => {
  const { user } = useAuth();

  // Modal Overlays
  const [activeModal, setActiveModal] = useState<
    'none' | 'print_preview' | 'send_email' | 'share_permit' | 'qr_verify' | 'permit_zoom'
  >('none');

  // Interactive Action States
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const [recipientEmail, setRecipientEmail] = useState<string>(user?.email || 'citizen@govserve.ph');
  const [emailNotes, setEmailNotes] = useState<string>('Here is your official City Business Permit (BP-2025-00045).');
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState<boolean>(false);

  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const permitVerifyURL = 'https://verify.pili.gov.ph/BP-2024-00123';

  // Real File Download Handler for Official Business Permit Document
  const handleDownloadPDF = () => {
    setIsDownloading(true);

    setTimeout(() => {
      const content = `========================================================================================\nREPUBLIC OF THE PHILIPPINES — PROVINCE OF CAMARINES SUR — MUNICIPALITY OF PILI\n========================================================================================\nOFFICIAL BUSINESS PERMIT NO : BP-2024-00123\n========================================================================================\n\nThis certifies that\n\n                       DELA CRUZ GENERAL MERCHANDISE\n                            Sole Proprietorship\n                 San Isidro, Laguna, Pili, Camarines Sur\n\nis granted this Business Permit to operate the business/es in the City of Pili in\naccordance with existing local ordinances and regulations.\n\n----------------------------------------------------------------------------------------\n[BUSINESS PERMIT SPECIFICATIONS]\n----------------------------------------------------------------------------------------\nBusiness Type       : Sole Proprietorship\nNature of Business  : Retail / General Merchandise\nBusiness Size       : Small (1 - 10 employees)\nGross Annual Sales  : ₱1,500,000.00\nEffectivity Period  : May 7, 2024 - Dec 31, 2024\nDate Issued         : May 7, 2024\nTotal Amount Due    : ₱5,695.00\n\n----------------------------------------------------------------------------------------\n[DIGITAL SIGNATURE & AUTHENTICATION]\n----------------------------------------------------------------------------------------\nSigned By           : ENGR. GLENN R. GONZALES (City Mayor)\nQR Verification Code: ${permitVerifyURL}\nDigital Audit Hash  : SHA256-PILIGOV-PERMIT-BP202400123-VALIDATED\n========================================================================================\nThis is a digitally generated document under Republic Act 8792 (E-Commerce Act of 2000).\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Official_Business_Permit_BP-2024-00123.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 700);
  };

  // Browser Print Trigger
  const handlePrintPermit = () => {
    setActiveModal('print_preview');
  };

  // Copy Verification Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(permitVerifyURL);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  // Dispatch Email Handler
  const handleExecuteSendEmail = () => {
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSentSuccess(true);
      setTimeout(() => {
        setEmailSentSuccess(false);
        setActiveModal('none');
      }, 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Notification Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-blue-950 tracking-tight">
              Permit Generated Successfully!
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              The business permit has been generated and is ready for download or printing.
            </p>
          </div>
        </div>

        <button 
          onClick={() => {
            if (onNavigateToTab) onNavigateToTab('Application Status Tracking');
            else alert('Navigating to applications overview...');
          }}
          className="flex items-center space-x-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors self-end md:self-center"
        >
          <ArrowLeft size={16} />
          <span>Back to Applications</span>
        </button>
      </div>

      {/* Main Grid: Permit Certificate (Left 8 cols) + Actions Panel (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Official Business Permit Document Certificate */}
        <div className="lg:col-span-8 space-y-4">
          {/* Certificate Container with Double Blue Border Frame */}
          <div className="bg-white p-8 rounded-2xl border-4 border-double border-blue-800 shadow-xl relative overflow-hidden space-y-6 select-none">
            {/* Certificate Header */}
            <div className="text-center space-y-1 border-b-2 border-slate-800 pb-4 font-sans">
              <div className="w-16 h-16 mx-auto mb-1">
                <img src="/government-logo.png" alt="Gov Logo" className="w-full h-full object-contain" />
              </div>
              <p className="text-[11px] tracking-widest uppercase font-semibold text-slate-600">Republic of the Philippines</p>
              <h2 className="text-xl font-black tracking-tight text-slate-900">OFFICE OF THE MUNICIPAL MAYOR</h2>
              <p className="text-xs font-bold text-slate-700">BUSINESS PERMITS & LICENSING OFFICE (BPLO)</p>
              <div className="inline-block mt-2 px-4 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                OFFICIAL BUSINESS PERMIT
              </div>
            </div>

            {/* Grant Statement */}
            <div className="text-center space-y-2 py-2">
              <p className="text-xs italic text-slate-600">
                TO ALL WHOM THESE PRESENTS SHALL COME, GREETINGS:
              </p>
              <p className="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed">
                Pursuant to the provisions of the Local Government Code of 1991 and existing Municipal Ordinances, permission is hereby granted to:
              </p>
            </div>

            {/* Business Entity Name */}
            <div className="text-center space-y-1 py-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Business Trade Name</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                DELA CRUZ GENERAL MERCHANDISE
              </h2>
              <p className="text-xs font-semibold text-slate-700">
                Proprietor / Grantee: {user?.name || 'Juan Dela Cruz'}
              </p>
              <p className="text-[11px] font-mono text-teal-700 font-bold">
                BP-2025-00045
              </p>
            </div>

            {/* 6-Column Official Permit Details Bar */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-white/90 shadow-xs grid grid-cols-2 md:grid-cols-6 gap-3 items-center text-center font-sans">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Business Permit No.</span>
                <p className="font-mono font-black text-sm text-emerald-600">BP-2025-00045</p>
              </div>
              
              <div className="space-y-1 md:border-l md:border-slate-200 md:pl-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Permit Classification</span>
                <p className="font-bold text-xs text-slate-900">Business Permit</p>
              </div>
              
              <div className="space-y-1 md:border-l md:border-slate-200 md:pl-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Date Issued</span>
                <p className="font-bold text-xs text-slate-800 flex items-center justify-center space-x-1">
                  <Calendar size={13} className="text-emerald-600 inline" />
                  <span>January 15, 2025</span>
                </p>
              </div>
              
              <div className="space-y-1 md:border-l md:border-slate-200 md:pl-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Valid Until</span>
                <p className="font-bold text-xs text-slate-800 flex items-center justify-center space-x-1">
                  <Calendar size={13} className="text-emerald-600 inline" />
                  <span>December 31, 2025</span>
                </p>
              </div>
              
              <div className="space-y-1 md:border-l md:border-slate-200 md:pl-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Official Receipt No.</span>
                <p className="font-mono font-bold text-xs text-slate-900">OR-2025-991204</p>
              </div>
              
              <div className="space-y-0.5 md:border-l md:border-slate-200 md:pl-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Fees Paid</span>
                <p className="font-black text-sm text-emerald-700">₱14,850.00</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[9px] font-extrabold tracking-wider">
                  FULLY PAID
                </span>
              </div>
            </div>

            {/* Certificate Footer: QR Code & Mayor Signature */}
            <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-1 md:grid-cols-2 items-end justify-between gap-6 font-sans">
              {/* Left Column: Secure QR Verification */}
              <div className="flex items-start space-x-4">
                <div 
                  onClick={() => setActiveModal('qr_verify')}
                  className="w-24 h-24 bg-white p-1.5 border-2 border-slate-900 rounded-2xl shadow-xs flex-shrink-0 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  title="Click to Verify QR"
                >
                  <QrCode size={70} className="text-slate-900" />
                </div>
                
                <div className="space-y-1.5 text-left">
                  <h4 className="text-xs font-black text-slate-900 tracking-wider uppercase">
                    SECURE QR VERIFICATION
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Scan this QR code to verify the authenticity of this business permit.
                  </p>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    <span>AUTHENTICITY VERIFIED</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-700 font-bold pt-0.5">
                    Verification ID: <span className="text-blue-700 font-black">GOVSERVE-BP-2025-00045</span>
                  </p>
                </div>
              </div>

              {/* Right Column: Signature of Mayor */}
              <div className="text-right flex flex-col items-end space-y-1">
                {/* Realistic Signature Graphic */}
                <div className="w-44 h-12 relative flex items-center justify-end">
                  <svg viewBox="0 0 160 50" className="w-36 h-12 text-slate-900 fill-none stroke-current">
                    <path d="M15,42 L25,12 L30,36 M22,25 L40,24 Q45,15 52,28 Q60,18 70,30 T85,26 Q98,15 110,28 M105,20 Q120,10 135,22 M25,44 Q80,36 145,30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="w-56 border-b border-slate-700 pb-0.5" />
                <p className="text-xs font-black text-slate-900 tracking-wide pt-1">
                  HON. ARTURO C. MERCADO
                </p>
                <p className="text-[10px] text-slate-600 font-medium">
                  Municipal Mayor / Licensing Authority
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  Issued at Municipal Hall Licensing Complex
                </p>
              </div>
            </div>

            {/* Bottom Security Watermark Tag */}
            <div className="bg-slate-100 p-2 rounded-lg text-center text-[10px] text-slate-500 flex items-center justify-center space-x-1.5">
              <Lock size={12} className="text-slate-400" />
              <span>This is a digitally generated document and is legally valid under RA 8792.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Details Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: ACTIONS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase text-slate-500">
              ACTIONS
            </h3>

            <div className="space-y-2.5">
              {/* Download PDF Button */}
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Download size={16} />
                <span>
                  {isDownloading 
                    ? 'Generating Permit PDF...' 
                    : downloadSuccess 
                    ? 'Downloaded Permit PDF ✓' 
                    : 'Download PDF'}
                </span>
              </button>

              {/* Print Permit Button */}
              <button
                onClick={handlePrintPermit}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Printer size={16} />
                <span>Print Permit</span>
              </button>

              {/* Send to Email Button */}
              <button
                onClick={() => setActiveModal('send_email')}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Mail size={16} />
                <span>Send to Email</span>
              </button>

              {/* Share Permit Button */}
              <button
                onClick={() => setActiveModal('share_permit')}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Share2 size={16} />
                <span>Share Permit</span>
              </button>
            </div>
          </div>

          {/* Card 2: PERMIT DETAILS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase text-slate-500">
              PERMIT DETAILS
            </h3>

            <div className="space-y-2.5 text-xs divide-y divide-slate-100">
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400">Application No.</span>
                <span className="font-mono font-bold text-blue-600">NR-2024-000123</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Date Approved</span>
                <span className="font-medium text-slate-700">May 7, 2024 10:32 AM</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Approved By</span>
                <div className="text-right">
                  <p className="font-bold text-slate-800">Juan Dela Cruz</p>
                  <p className="text-[10px] text-slate-400">Evaluator</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Status</span>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold">
                  Approved
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Valid Until</span>
                <span className="font-bold text-slate-900">December 31, 2024</span>
              </div>
            </div>
          </div>

          {/* Card 3: PERMIT PREVIEW (Clickable Zoom) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-xs tracking-wider uppercase text-slate-500">
              PERMIT PREVIEW
            </h3>

            {/* Thumbnail Canvas Container */}
            <div 
              onClick={() => setActiveModal('permit_zoom')}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center shadow-xs cursor-pointer hover:border-blue-400 transition-all group"
            >
              <div className="p-3 bg-white border-2 border-double border-blue-700 rounded-lg shadow-xs space-y-1 relative overflow-hidden">
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white p-1 rounded-md">
                  <ZoomIn size={12} />
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <Building size={14} className="text-blue-700" />
                  <span className="text-[8px] font-bold text-blue-900">CITY OF PILI</span>
                  <span className="text-[8px] font-mono text-blue-700">BP-2024-00123</span>
                </div>
                <p className="text-[9px] font-black text-blue-800 uppercase">BUSINESS PERMIT</p>
                <p className="text-[7px] font-bold text-slate-900">DELA CRUZ GENERAL MERCHANDISE</p>
                <div className="text-[6px] text-slate-500 space-y-0.5 pt-1">
                  <p>Sole Proprietorship • Small</p>
                  <p>Valid until: Dec 31, 2024</p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-[11px] text-slate-500 pt-1">
              <Info size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p>
                You can always download or re-print your permit from{' '}
                <button 
                  onClick={() => {
                    if (onNavigateToTab) onNavigateToTab('Requirements Submission');
                    else alert('Opening My Documents...');
                  }}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  My Documents
                </button>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: PRINT PREVIEW OVERLAY MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'print_preview' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Printer size={20} className="text-blue-400" />
                <h3 className="font-bold text-sm">Print Business Permit Document</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Document Type</span>
                  <span className="font-bold text-slate-900">Official Municipal Permit (A4)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Print Quality</span>
                  <span className="font-bold text-slate-900">300 DPI High Resolution</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Digital Seal</span>
                  <span className="font-bold text-emerald-600">Verified Authentic</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">
                Cancel
              </button>

              <button
                onClick={() => {
                  window.print();
                  setActiveModal('none');
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
              >
                <Printer size={16} />
                <span>Launch System Print Dialog</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SEND TO EMAIL MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'send_email' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-blue-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail size={20} className="text-blue-300" />
                <h3 className="font-bold text-sm">Send Business Permit via Email</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-800">Recipient Email Address</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-800">Message / Cover Note</label>
                <textarea
                  rows={3}
                  value={emailNotes}
                  onChange={(e) => setEmailNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {emailSentSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-xs flex items-center space-x-2 animate-in fade-in">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Permit PDF successfully dispatched to {recipientEmail}!</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">
                Cancel
              </button>

              <button
                onClick={handleExecuteSendEmail}
                disabled={isSendingEmail}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Send size={14} />
                <span>{isSendingEmail ? 'Dispatching Email...' : 'Send Permit PDF Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SHARE PERMIT MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'share_permit' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Share2 size={20} className="text-blue-400" />
                <h3 className="font-bold text-sm">Share Verification Link</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">Anyone with this official link can verify the authenticity of this permit:</p>

              <div className="flex items-center space-x-2 p-2 bg-slate-100 border border-slate-200 rounded-xl font-mono text-xs">
                <input
                  type="text"
                  readOnly
                  value={permitVerifyURL}
                  className="bg-transparent flex-1 outline-none text-slate-800 text-[11px]"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  {linkCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{linkCopied ? 'Copied ✓' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: QR SCAN VERIFICATION INSPECTOR MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'qr_verify' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck size={20} className="text-emerald-300" />
                <div>
                  <h3 className="font-bold text-sm">LGU Public QR Verification Inspector</h3>
                  <p className="text-[10px] text-emerald-200">Republic of the Philippines Municipal Portal</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-950">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-900">AUTHENTIC & VALIDATED PERMIT</h4>
                  <p className="text-[10px] text-emerald-800">Permit No: BP-2024-00123 • Active Status</p>
                </div>
              </div>

              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">Business Entity</span>
                  <span className="font-bold text-slate-800">DELA CRUZ GENERAL MERCHANDISE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Issuing LGU</span>
                  <span className="font-medium text-slate-700">Municipality of Pili, Cam Sur</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Digital Signature Hash</span>
                  <span className="font-mono text-blue-600 font-bold">SHA256: 9f8a-7e6d-5c4b</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: FULLSCREEN PERMIT ZOOM MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'permit_zoom' && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye size={18} className="text-blue-400" />
                <h3 className="font-bold text-xs">High-Resolution Permit View — BP-2024-00123</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {/* Scaled High Res Certificate */}
              <div className="bg-white p-6 rounded-xl border-4 border-double border-blue-800 shadow-md space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Republic of the Philippines</h3>
                  <h2 className="text-xl font-black text-blue-900 uppercase">MUNICIPALITY OF PILI</h2>
                  <h1 className="text-2xl font-black text-blue-800 uppercase tracking-widest">BUSINESS PERMIT</h1>
                  <p className="text-xs font-bold text-slate-900 pt-2 uppercase">DELA CRUZ GENERAL MERCHANDISE</p>
                  <p className="text-xs text-slate-600">Sole Proprietorship • Small Tier • ₱1,500,000.00 Gross Sales</p>
                  <p className="text-xs font-bold text-blue-900 pt-1">Valid: May 7, 2024 - December 31, 2024</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  FileCheck, 
  ShieldCheck, 
  Check, 
  Bell, 
  Info, 
  Eye, 
  Download, 
  ChevronRight, 
  ExternalLink,
  ArrowRight,
  X,
  CreditCard,
  Sliders,
  History,
  Filter,
  CheckSquare,
  Smartphone,
  Mail,
  Lock,
  Printer,
  Sparkles
} from 'lucide-react';

interface ApplicationStatusTrackingProps {
  onNavigateToTab?: (tab: string) => void;
}

export const ApplicationStatusTracking: React.FC<ApplicationStatusTrackingProps> = ({
  onNavigateToTab
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>('BP-2024-00123');

  // Modal States
  const [activeModal, setActiveModal] = useState<
    'none' | 'view_all_apps' | 'app_details' | 'payment_gateway' | 'notifications_all' | 'notification_prefs' | 'full_audit_log'
  >('none');

  // Filter State for Applications
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Progress' | 'Approved' | 'Rejected'>('All');

  // Notification Preferences State
  const [notifPrefs, setNotifPrefs] = useState({
    emailStatus: true,
    emailReceipts: true,
    smsAlerts: true,
    pushNotifications: true
  });
  const [isSavingPrefs, setIsSavingPrefs] = useState<boolean>(false);
  const [savePrefsSuccess, setSavePrefsSuccess] = useState<boolean>(false);

  // Save Preferences Handler
  const handleSavePreferences = () => {
    setIsSavingPrefs(true);
    try {
      localStorage.setItem('govserve_notif_prefs', JSON.stringify(notifPrefs));
    } catch (e) {}

    setTimeout(() => {
      setIsSavingPrefs(false);
      setSavePrefsSuccess(true);
      setTimeout(() => {
        setSavePrefsSuccess(false);
        setActiveModal('none');
      }, 1200);
    }, 600);
  };

  // Payment Method Selection State
  const [paymentMethod, setPaymentMethod] = useState<'eprovider' | 'gcash' | 'maya' | 'bank'>('eprovider');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  // Audit Export State
  const [isExportingAudit, setIsExportingAudit] = useState<boolean>(false);
  const [auditExportSuccess, setAuditExportSuccess] = useState<boolean>(false);

  // Application Package Download State
  const [downloadingAppId, setDownloadingAppId] = useState<string | null>(null);
  const [downloadAppSuccessId, setDownloadAppSuccessId] = useState<string | null>(null);

  // Download Application Package File Handler
  const handleDownloadAppPackage = (app: any) => {
    setDownloadingAppId(app.id);

    setTimeout(() => {
      const content = `========================================================================================\nGOVSERVE LGU BUSINESS PERMIT PORTAL — OFFICIAL APPLICATION PACKAGE\n========================================================================================\nApplication ID          : ${app.id}\nBusiness Entity Name   : ${app.businessName}\nPermit Category        : ${app.type}\nSubmission Date        : ${app.dateSubmitted}\nApplication Status     : ${app.status}\nLast Updated           : ${app.lastUpdated}\nAssessment Fee Amount  : ${app.amount || '₱5,695.00'}\nSecurity Signature     : AUTHENTICATED-LGU-RECORD-${app.id}\n========================================================================================\n\n[INCLUDED DOCUMENTS IN PACKAGE]\n- 1. Business Registration (DTI / SEC Certificate)\n- 2. Mayor's / Business Permit Application Form\n- 3. Barangay Clearance & Tax Clearance Certificate\n- 4. Official Fee Assessment Receipt (OR-998230112)\n\n========================================================================================\nOfficial Document Record — Republic of the Philippines LGU Permitting Office.\n`;

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
    }, 700);
  };

  // Export Audit PDF File Handler
  const handleExportAuditPDF = () => {
    setIsExportingAudit(true);

    setTimeout(() => {
      const content = `========================================================================================\nGOVSERVE LGU BUSINESS PERMIT PORTAL — OFFICIAL SYSTEM AUDIT TRAIL LOG\n========================================================================================\nApplication Reference Code : BP-2024-00123\nBusiness Entity Name      : Dela Cruz General Merchandise\nApplicant Name            : Juan Dela Cruz\nGenerated Timestamp       : ${new Date().toLocaleString()}\nSecurity Signature        : SHA256-AUTHENTICATED-LGU-AUDIT-99201\n========================================================================================\n\n[TIMELINE AUDIT HISTORY]\n----------------------------------------------------------------------------------------\n1. Timestamp: May 1, 2024 09:15 AM\n   Action   : Submitted\n   Actor    : Juan Dela Cruz (Applicant)\n   Remarks  : Application submitted online via Web Portal.\n\n2. Timestamp: May 1, 2024 10:02 AM\n   Action   : Initial Review\n   Actor    : Clerk - LGU (Staff)\n   Remarks  : Completeness checked & verified.\n\n3. Timestamp: May 2, 2024 11:30 AM\n   Action   : Evaluation\n   Actor    : Evaluator (Assigned Officer)\n   Remarks  : AI OCR document verification passed.\n\n4. Timestamp: May 3, 2024 02:45 PM\n   Action   : For Approval\n   Actor    : Evaluator (Assigned Officer)\n   Remarks  : Endorsed to Mayor's Office for final approval.\n\n5. Timestamp: May 7, 2024 10:32 AM\n   Action   : Approved\n   Actor    : City Mayor (Approver)\n   Remarks  : Approved & digital signature applied.\n----------------------------------------------------------------------------------------\nEnd of Audit Log Record.\n========================================================================================\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Audit_Trail_BP-2024-00123.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExportingAudit(false);
      setAuditExportSuccess(true);
      setTimeout(() => setAuditExportSuccess(false), 3000);
    }, 800);
  };

  // Sample Applications List
  const applicationsList = [
    {
      id: 'BP-2024-00123',
      businessName: 'Dela Cruz General Merchandise',
      type: 'Business Permit',
      dateSubmitted: 'May 1, 2024 09:15 AM',
      status: 'Approved',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      lastUpdated: 'May 7, 2024 10:32 AM',
      amount: '₱5,695.00'
    },
    {
      id: 'BP-2024-00124',
      businessName: 'Cruz IT Solutions',
      type: 'Business Permit',
      dateSubmitted: 'May 6, 2024 02:15 PM',
      status: 'In Progress',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      lastUpdated: 'May 6, 2024 02:15 PM',
      amount: '₱3,200.00'
    }
  ];

  const filteredApps = statusFilter === 'All' 
    ? applicationsList 
    : applicationsList.filter(a => a.status === statusFilter);

  const handleStatCardClick = (filter: 'All' | 'In Progress' | 'Approved' | 'Rejected') => {
    setStatusFilter(filter);
    const element = document.getElementById('my-applications-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConfirmPayment = () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Active Filter Notification Bar */}
      {statusFilter !== 'All' && (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center space-x-2">
            <Filter size={15} className="text-blue-600" />
            <span>Showing applications filtered by: <strong className="font-bold">{statusFilter}</strong></span>
          </div>
          <button 
            onClick={() => setStatusFilter('All')} 
            className="text-blue-700 hover:underline font-bold text-[11px]"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* 1. Top Section: Application Overview (4 Stat Cards with functional filter handlers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md flex-shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">2</span>
              <p className="text-xs font-semibold text-slate-500">Total Applications</p>
              <button 
                onClick={() => handleStatCardClick('All')} 
                className="text-[10px] text-blue-600 font-bold hover:underline"
              >
                View all
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: In Progress */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/70 bg-amber-50/10 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold shadow-md flex-shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">1</span>
              <p className="text-xs font-semibold text-slate-500">In Progress</p>
              <button 
                onClick={() => handleStatCardClick('In Progress')} 
                className="text-[10px] text-blue-600 font-bold hover:underline"
              >
                View details
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Approved */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/70 bg-emerald-50/10 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md flex-shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">1</span>
              <p className="text-xs font-semibold text-slate-500">Approved</p>
              <button 
                onClick={() => handleStatCardClick('Approved')} 
                className="text-[10px] text-blue-600 font-bold hover:underline"
              >
                View details
              </button>
            </div>
          </div>
        </div>

        {/* Card 4: Rejected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold shadow-md flex-shrink-0">
              <XCircle size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">0</span>
              <p className="text-xs font-semibold text-slate-500">Rejected</p>
              <button 
                onClick={() => handleStatCardClick('Rejected')} 
                className="text-[10px] text-blue-600 font-bold hover:underline"
              >
                View details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. My Applications Table (Full Width) */}
      <div id="my-applications-section" className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">My Applications</h2>
          {statusFilter !== 'All' && (
            <span className="text-xs text-slate-500">Showing {filteredApps.length} application(s)</span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold">
                <th className="p-3 pl-4">Application No.</th>
                <th className="p-3">Business Name</th>
                <th className="p-3">Date Submitted</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Updated</th>
                <th className="p-3 pr-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 pl-4 font-mono font-bold text-blue-600">{app.id}</td>
                  <td className="p-3 font-bold text-slate-900">{app.businessName}</td>
                  <td className="p-3 text-slate-600">{app.dateSubmitted}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${app.statusColor}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 font-mono text-[11px]">{app.lastUpdated}</td>
                  <td className="p-3 pr-4 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button 
                        onClick={() => setActiveModal('app_details')} 
                        className="p-1.5 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        title="View Application Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleDownloadAppPackage(app)} 
                        disabled={downloadingAppId === app.id}
                        className={`p-1.5 rounded-lg border transition-all ${
                          downloadAppSuccessId === app.id
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
                            : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                        title="Download Application Summary Package"
                      >
                        {downloadingAppId === app.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : downloadAppSuccessId === app.id ? (
                          <CheckCircle2 size={14} className="text-emerald-600" />
                        ) : (
                          <Download size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW APPLICATION DETAILS MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'app_details' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText size={20} className="text-blue-400" />
                <h3 className="font-bold text-sm">Application Spec Sheet — BP-2024-00123</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-emerald-900 font-semibold">
                <span>Application Status: Approved</span>
                <span className="font-mono text-[11px] text-emerald-700">Ref: NR-2024-000123</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-slate-400">Business Particulars</h4>
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-slate-400 text-[10px]">Business Name</p>
                    <p className="font-bold text-slate-800">Dela Cruz General Merchandise</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Business Type</p>
                    <p className="font-medium text-slate-800">Sole Proprietorship</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Gross Annual Sales</p>
                    <p className="font-mono font-bold text-slate-900">₱1,500,000.00</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Location</p>
                    <p className="font-medium text-slate-800">San Isidro, Laguna</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-slate-400">Submitted Documents</h4>
                <ul className="space-y-1.5 text-slate-700">
                  <li className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span>1. Business Registration (DTI/SEC)</span>
                    <span className="font-mono text-emerald-600 font-bold">✓ Verified</span>
                  </li>
                  <li className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span>2. Mayor's/Business Permit (Current)</span>
                    <span className="font-mono text-emerald-600 font-bold">✓ Verified</span>
                  </li>
                  <li className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span>3. Barangay Clearance</span>
                    <span className="font-mono text-emerald-600 font-bold">✓ Verified</span>
                  </li>
                  <li className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span>4. Tax Identification Number (TIN)</span>
                    <span className="font-mono text-emerald-600 font-bold">✓ Verified</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
              <button 
                onClick={() => setActiveModal('none')} 
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button 
                onClick={() => { setActiveModal('payment_gateway'); }} 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PROCEED TO PAYMENT GATEWAY MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'payment_gateway' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-blue-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard size={20} className="text-blue-400" />
                <h3 className="font-bold text-sm">Eprovider Payment Gateway</h3>
              </div>
              <button onClick={() => { setActiveModal('none'); setPaymentSuccess(false); }} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {!paymentSuccess ? (
              <div className="p-6 space-y-4 text-xs">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-[11px]">Total Amount Due</p>
                    <p className="text-2xl font-black text-blue-900">₱5,695.00</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-600 text-white font-mono font-bold text-[10px] rounded-full">
                    BP-2024-00123
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-slate-800">Select Payment Method</label>

                  <div className="space-y-2">
                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'eprovider' ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200'}`}>
                      <div className="flex items-center space-x-2.5">
                        <input type="radio" name="payMethod" checked={paymentMethod === 'eprovider'} onChange={() => setPaymentMethod('eprovider')} />
                        <span>Eprovider Auth Wallet (JWT OTP Instant)</span>
                      </div>
                      <span className="text-[10px] text-blue-600 font-mono">Zero Fee</span>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'gcash' ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200'}`}>
                      <div className="flex items-center space-x-2.5">
                        <input type="radio" name="payMethod" checked={paymentMethod === 'gcash'} onChange={() => setPaymentMethod('gcash')} />
                        <span>GCash e-Wallet</span>
                      </div>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'maya' ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200'}`}>
                      <div className="flex items-center space-x-2.5">
                        <input type="radio" name="payMethod" checked={paymentMethod === 'maya'} onChange={() => setPaymentMethod('maya')} />
                        <span>Maya Pay</span>
                      </div>
                    </label>

                    <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'bank' ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200'}`}>
                      <div className="flex items-center space-x-2.5">
                        <input type="radio" name="payMethod" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                        <span>Over-the-Counter Bank Transfer</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleConfirmPayment}
                    disabled={isPaymentProcessing}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isPaymentProcessing ? (
                      <span>Processing Payment...</span>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>Confirm & Pay ₱5,695.00</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-4 text-xs">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Payment Successful!</h3>
                  <p className="text-slate-500 mt-1">Transaction Ref: TXN-998230112</p>
                  <p className="text-emerald-700 font-bold mt-0.5">Amount Paid: ₱5,695.00</p>
                </div>
                <div className="pt-2 flex justify-center space-x-3">
                  <button 
                    onClick={() => { setActiveModal('none'); setPaymentSuccess(false); }}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-semibold"
                  >
                    Back to Tracking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: VIEW ALL NOTIFICATIONS MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'notifications_all' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell size={20} className="text-amber-400" />
                <h3 className="font-bold text-sm">Notifications Center</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs max-h-[65vh] overflow-y-auto">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3">
                <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Your application #BP-2024-00123 has been approved.</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">May 7, 2024 10:32 AM</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-3">
                <Info size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Your application #BP-2024-00124 is currently under review.</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">May 6, 2024 02:15 PM</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3">
                <Bell size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Payment received for application #BP-2024-00124.</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">May 6, 2024 01:45 PM</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3">
                <Clock size={18} className="text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-700">Initial review completed for application #BP-2024-00123.</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">May 1, 2024 10:02 AM</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: MANAGE NOTIFICATION PREFERENCES MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'notification_prefs' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders size={20} className="text-blue-400" />
                <h3 className="font-bold text-sm">Notification Preferences</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-blue-600" />
                    <div>
                      <p className="font-bold text-slate-800">Email Status Alerts</p>
                      <p className="text-[10px] text-slate-500">Receive status updates via email</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifPrefs.emailStatus} 
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, emailStatus: e.target.checked })} 
                    className="w-4 h-4 text-blue-600 rounded" 
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Smartphone size={16} className="text-blue-600" />
                    <div>
                      <p className="font-bold text-slate-800">SMS Alerts & OTP</p>
                      <p className="text-[10px] text-slate-500">Receive SMS notifications on mobile number</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifPrefs.smsAlerts} 
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, smsAlerts: e.target.checked })} 
                    className="w-4 h-4 text-blue-600 rounded" 
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Bell size={16} className="text-blue-600" />
                    <div>
                      <p className="font-bold text-slate-800">In-App Push Alerts</p>
                      <p className="text-[10px] text-slate-500">Receive real-time popups inside portal</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifPrefs.pushNotifications} 
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, pushNotifications: e.target.checked })} 
                    className="w-4 h-4 text-blue-600 rounded" 
                  />
                </label>
              </div>
              {savePrefsSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-xs flex items-center space-x-2 animate-in fade-in">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Notification preferences saved successfully!</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
              <button 
                onClick={handleSavePreferences} 
                disabled={isSavingPrefs}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                {isSavingPrefs ? 'Saving Preferences...' : savePrefsSuccess ? 'Saved Preferences ✓' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ApplicationStatusTracking;


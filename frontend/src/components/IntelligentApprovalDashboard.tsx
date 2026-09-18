import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  ArrowLeft, 
  MessageSquare, 
  Check, 
  X, 
  HelpCircle,
  Clock,
  FileText,
  FileCheck,
  Download,
  Shield,
  Send,
  User,
  Building,
  Calendar,
  AlertCircle,
  Settings,
  Search,
  ChevronRight,
  ArrowUpRight,
  HardHat,
  Bus,
  Landmark,
  Eye,
  Phone,
  MapPin,
  CreditCard
} from 'lucide-react';
import { evaluateApplicationWithAI, fetchAIStatus, AIStatusResponse, AIEvaluationResponse } from '../services/aiApi';
import { AISettingsModal } from './ui/AISettingsModal';
import { ApplicationItem } from '../types';

interface IntelligentApprovalDashboardProps {
  onNavigateToTab?: (tab: string) => void;
  applications?: ApplicationItem[];
  onApproveApplication?: (id: string) => void;
  onAddNewApplication?: (nameOrApp: string | Partial<ApplicationItem>, type?: string) => void;
}

export const IntelligentApprovalDashboard: React.FC<IntelligentApprovalDashboardProps> = ({
  onNavigateToTab,
  applications,
  onApproveApplication,
  onAddNewApplication
}) => {
  const defaultAppsList: ApplicationItem[] = [
    {
      id: 'BP-2026-12530',
      applicant: 'Juan Dela Cruz',
      businessName: 'Juan Dela Cruz',
      type: 'Business Permit',
      category: 'business',
      status: 'For Evaluation',
      statusColor: 'text-amber-600 bg-amber-50 border border-amber-200',
      date: 'Sep 19, 2026',
      address: '22 Rizal St, Poblacion, Laguna',
      contact: '+63 917 123 4567',
      assessmentFee: 4500.00
    },
    {
      id: 'BP-2026-99237',
      applicant: 'Juan Dela Cruz',
      businessName: 'Juan Dela Cruz',
      type: 'Business Permit',
      category: 'business',
      status: 'For Evaluation',
      statusColor: 'text-amber-600 bg-amber-50 border border-amber-200',
      date: 'Sep 19, 2026',
      address: 'Zone 4, Poblacion, Laguna',
      contact: '+63 918 222 3333',
      assessmentFee: 3200.00
    },
    {
      id: 'BP-2026-60107',
      applicant: 'Juan Dela Cruz',
      businessName: 'Juan Dela Cruz',
      type: 'Business Permit',
      category: 'business',
      status: 'For Evaluation',
      statusColor: 'text-amber-600 bg-amber-50 border border-amber-200',
      date: 'Sep 19, 2026',
      address: 'San Isidro Highway, Laguna',
      contact: '+63 920 333 4444',
      assessmentFee: 5695.00
    },
    {
      id: 'BP-2026-26362',
      applicant: 'Juan Dela Cruz',
      businessName: 'Juan Dela Cruz',
      type: 'Business Permit',
      category: 'business',
      status: 'For Evaluation',
      statusColor: 'text-amber-600 bg-amber-50 border border-amber-200',
      date: 'Sep 19, 2026',
      address: 'Block 2, San Antonio, Laguna',
      contact: '+63 919 444 5555',
      assessmentFee: 4800.00
    },
    {
      id: 'BP-2026-14540',
      applicant: 'Juan Dela Cruz',
      businessName: 'Juan Dela Cruz',
      type: 'Business Permit',
      category: 'business',
      status: 'Rejected',
      statusColor: 'text-rose-600 bg-rose-50 border border-rose-200',
      date: 'Sep 19, 2026',
      address: 'Market Site, Poblacion, Laguna',
      contact: '+63 921 555 6666',
      assessmentFee: 2100.00
    },
    {
      id: 'BP-2026-20509',
      applicant: 'Juan Dela Cruz',
      businessName: 'Juan Dela Cruz',
      type: 'Business Permit',
      category: 'business',
      status: 'For Evaluation',
      statusColor: 'text-amber-600 bg-amber-50 border border-amber-200',
      date: 'Sep 19, 2026',
      address: 'National Road, Laguna',
      contact: '+63 922 666 7777',
      assessmentFee: 3750.00
    }
  ];

  const applicationsList = (applications && applications.length > 0) ? applications : defaultAppsList;
  const [selectedAppId, setSelectedAppId] = useState<string>(() => applicationsList[0]?.id || 'BP-2026-12530');
  const [appSearchQuery, setAppSearchQuery] = useState<string>('');
  const [evaluatorDecision, setEvaluatorDecision] = useState<'Approve' | 'Reject' | 'Needs Review'>('Approve');
  const [comments, setComments] = useState<string>('');
  const [overrideAI, setOverrideAI] = useState<boolean>(false);
  const [showAnalysisDetails, setShowAnalysisDetails] = useState<boolean>(false);
  const [selectedModalApp, setSelectedModalApp] = useState<ApplicationItem | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'requirements' | 'assessment'>('overview');

  const displayedApplications = applicationsList.filter(app => {
    if (!appSearchQuery.trim()) return true;
    const q = appSearchQuery.toLowerCase();
    return (
      app.id.toLowerCase().includes(q) ||
      app.applicant.toLowerCase().includes(q) ||
      (app.businessName && app.businessName.toLowerCase().includes(q)) ||
      (app.type && app.type.toLowerCase().includes(q)) ||
      (app.status && app.status.toLowerCase().includes(q))
    );
  });

  const getCategoryBadge = (type: string = '', cat?: string) => {
    if (type.includes('Business') || cat === 'business') {
      return { label: 'Business', icon: Building, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
    }
    if (type.includes('Building') || cat === 'building') {
      return { label: 'Building', icon: HardHat, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
    }
    if (type.includes('Franchise') || cat === 'transport') {
      return { label: 'Franchise', icon: Bus, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
    }
    return { label: 'Barangay', icon: Landmark, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800' };
  };

  const currentApp = applicationsList.find(a => a.id === selectedAppId) || applicationsList[0];

  // Interactive Subsystem States
  const [activeRiskSubsystem, setActiveRiskSubsystem] = useState<string | null>(null);
  const [expandedFlagId, setExpandedFlagId] = useState<string | null>(null);
  const [selectedConfidenceCategory, setSelectedConfidenceCategory] = useState<string>('Approve');

  // Request Info Checklist State
  const [requestChecklist, setRequestChecklist] = useState({
    barangay: true,
    locationSketch: false,
    proofOwnership: true,
    governmentId: false
  });
  const [requestNotes, setRequestNotes] = useState<string>('Please provide updated Barangay clearance for calendar year 2024.');

  // Modal Overlays
  const [activeModal, setActiveModal] = useState<
    'none' | 'app_details' | 'full_ai_report' | 'request_info_form' | 'submit_decision_success' | 'request_info_success'
  >('none');

  const [isExportingReport, setIsExportingReport] = useState<boolean>(false);
  const [reportExportSuccess, setReportExportSuccess] = useState<boolean>(false);

  // Live AI Evaluation States
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [liveAIResult, setLiveAIResult] = useState<AIEvaluationResponse | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);

  useEffect(() => {
    fetchAIStatus().then(setAiStatus).catch(() => {});
  }, []);

  const handleRunLiveAIEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const result = await evaluateApplicationWithAI({
        id: 'NR-2024-000123',
        applicant: 'Juan Dela Cruz',
        businessName: 'Dela Cruz General Merchandise',
        type: 'Business Permit (New Registration)',
        category: 'business',
        address: '22 Rizal St, Poblacion, Laguna',
        assessmentFee: 3450.00,
        status: 'For Evaluation',
        formData: {
          businessType: 'Sole Proprietorship',
          natureOfBusiness: 'Retail & General Merchandise',
          capitalInvestment: 250000.00,
          employeesCount: 4
        }
      });
      setLiveAIResult(result);
      if (result.recommendation && result.recommendation.toLowerCase().includes('reject')) {
        setEvaluatorDecision('Reject');
      } else if (result.recommendation && (result.recommendation.toLowerCase().includes('review') || result.recommendation.toLowerCase().includes('conditional'))) {
        setEvaluatorDecision('Needs Review');
      } else {
        setEvaluatorDecision('Approve');
      }
      if (result.draftOfficerRemarks) {
        setComments(result.draftOfficerRemarks);
      }
    } catch (e) {
      console.warn('AI evaluation error:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleApplyAIRecommendation = () => {
    const rec = liveAIResult?.recommendation || 'Approve';
    if (rec.toLowerCase().includes('reject')) {
      setEvaluatorDecision('Reject');
    } else if (rec.toLowerCase().includes('review') || rec.toLowerCase().includes('conditional')) {
      setEvaluatorDecision('Needs Review');
    } else {
      setEvaluatorDecision('Approve');
    }
    if (liveAIResult?.draftOfficerRemarks) {
      setComments(liveAIResult.draftOfficerRemarks);
    }
  };

  const handleSubmitDecision = () => {
    if (overrideAI && !comments.trim()) {
      alert('Please provide a comment / justification when overriding the AI recommendation.');
      return;
    }

    const appId = currentApp.id;
    const isExisting = applications?.some(a => a.id === appId);

    if (evaluatorDecision === 'Approve') {
      if (isExisting && onApproveApplication) {
        onApproveApplication(appId);
      } else if (onAddNewApplication) {
        onAddNewApplication({
          id: appId,
          applicant: currentApp.applicant,
          businessName: currentApp.businessName || currentApp.applicant,
          type: currentApp.type || 'Business Permit',
          category: currentApp.category || 'business',
          status: 'Approved',
          statusColor: 'text-emerald-600 bg-emerald-50 border border-emerald-200',
          assessmentFee: currentApp.assessmentFee || 5695.00,
          remarks: comments || 'Approved via AI Intelligent Approval Decision Engine'
        });
      }
    }

    setActiveModal('submit_decision_success');
  };

  const handleRequestMoreInfo = () => {
    setActiveModal('request_info_form');
  };

  // Export AI Audit Certificate Handler
  const handleExportAICertificate = () => {
    setIsExportingReport(true);

    setTimeout(() => {
      const content = `========================================================================================\nGOVSERVE LGU INTELI-APPROVAL ENGINE — FULL AI COMPREHENSIVE ASSESSMENT REPORT\n========================================================================================\nApplication Ref Code : NR-2024-000123\nBusiness Entity Name : Dela Cruz General Merchandise\nAI Model Version     : v2.3.1 (Multi-Layer Neural OCR & Rule Engine)\nAnalysis Timestamp   : May 7, 2024 10:32 AM\nProcessing Duration  : 3.4 Seconds\nOverall Confidence   : 92.0% (HIGH CONFIDENCE APPROVAL)\nSecurity Authentication: SHA256-AI-REPORT-VALIDATED-88912\n========================================================================================\n\n[1. RISK SUB-SYSTEM SCORE BREAKDOWN]\n----------------------------------------------------------------------------------------\n- Compliance Risk    : LOW (0.15 / 1.0) — Zero negative watchlist flags\n- Document Risk      : LOW (0.18 / 1.0) — 8 of 8 documents 100% OCR verified\n- Business Risk      : LOW (0.22 / 1.0) — Small business retail profile\n\n[2. AI RULE MATRIX & EVIDENCE]\n----------------------------------------------------------------------------------------\n✓ Rule 1: Mandatory Documents Present (100% Complete)\n✓ Rule 2: OCR Text Quality & Watermark Check (100% Passed)\n⚠ Rule 3: Business Address Geocoding (Pending LGU internal db sync - Non-blocking)\n✓ Rule 4: Applicant Watchlist & Delinquency (Cleared)\n\n[3. PROBABILITY DISTRIBUTION]\n----------------------------------------------------------------------------------------\n- Approve Probability : 92.0%\n- Reject Probability  : 5.0%\n- Needs Review Prob   : 3.0%\n========================================================================================\nOfficial AI Audit Document — Republic of the Philippines Local Permitting Office.\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Full_AI_Assessment_Report_NR-2024-000123.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExportingReport(false);
      setReportExportSuccess(true);
      setTimeout(() => setReportExportSuccess(false), 3000);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Application Under Review
            </h1>
            <span className="bg-indigo-100 text-indigo-700 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow-2xs">
              <Bot size={12} className="mr-0.5 text-indigo-600 animate-pulse" /> AI-Assisted Evaluation
            </span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border transition-colors cursor-pointer ${
                aiStatus?.hasKey || aiStatus?.configured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
              }`}
              title="Configure Gemini AI Key"
            >
              <Sparkles size={10} className={aiStatus?.hasKey || aiStatus?.configured ? "text-emerald-500 animate-pulse" : "text-amber-500"} />
              <span>{aiStatus?.hasKey || aiStatus?.configured ? 'Gemini 1.5 Active' : 'AI Setup'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            AI has analyzed the application and provided an objective recommendation to assist your evaluation.
          </p>
          {applications && applications.length > 0 && (
            <div className="flex items-center space-x-2 mt-2.5">
              <span className="text-[11px] font-bold text-slate-500">Evaluating:</span>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl px-2.5 py-1 font-bold focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
              >
                <option value="NR-2024-000123">NR-2024-000123 — Dela Cruz General Merchandise (New)</option>
                {applications.map(app => (
                  <option key={app.id} value={app.id}>
                    {app.id} — {app.businessName || app.applicant} ({app.status})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-end md:self-center">
          <button
            onClick={handleRunLiveAIEvaluation}
            disabled={isEvaluating}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <Sparkles size={13} className={isEvaluating ? 'animate-spin' : 'text-amber-300'} />
            <span>{isEvaluating ? 'Analyzing with Gemini...' : 'Run Live AI Assessment'}</span>
          </button>

          <button 
            onClick={() => setSelectedModalApp(currentApp)}
            className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <span>Details</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* Main Grid: Evaluation Workspace (Left 8 cols) + Evaluator Decision Panel (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Top Row: AI Recommendation + AI Reasoning side by side */}
          <div className="grid grid-cols-2 gap-5">
            {/* AI Recommendation Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-3">
                  AI Recommendation
                </h3>

                <div className="flex items-start space-x-4">
                  {/* Robot Avatar Badge */}
                  <div className="relative w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md flex-shrink-0">
                    <Bot size={34} />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 border-2 border-white dark:border-slate-900">
                      <Check size={12} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h2 className={`text-2xl font-black tracking-tight ${
                        (liveAIResult?.recommendation || 'Approve').toLowerCase().includes('approve') ? 'text-emerald-700 dark:text-emerald-400' :
                        (liveAIResult?.recommendation || 'Approve').toLowerCase().includes('reject') ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'
                      }`}>
                        {liveAIResult?.recommendation || 'Approve'}
                      </h2>
                      {liveAIResult?.isRealAI && (
                        <span className="bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                          <Sparkles size={10} className="text-amber-500" />
                          <span>Gemini 1.5 Flash</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {liveAIResult?.riskLevel ? `${liveAIResult.riskLevel} (${liveAIResult.riskScore}/100)` : 'High confidence recommendation'}
                    </p>

                    <div className="pt-1">
                      <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full text-xs font-bold inline-block">
                        Confidence Score: {liveAIResult?.confidence || '92%'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                  {liveAIResult?.summary || 'Based on the information provided and document analysis, this application meets the requirements for approval.'}
                </p>
              </div>

              <div>
                <button
                  onClick={() => setShowAnalysisDetails(!showAnalysisDetails)}
                  className="w-full flex items-center justify-center space-x-1 py-2 px-3 bg-white dark:bg-slate-800 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>View AI Analysis Details</span>
                  {showAnalysisDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>

            {/* AI Reasoning / Explanation Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400">
                  AI Reasoning / Explanation
                </h3>

                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>All required documents are complete and valid.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Business information is consistent across all submissions.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>No matches found in negative watchlists or violation databases.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Computed fees are correct based on approved schedules.</span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Overall, the application complies with existing rules and policies.</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer Notice Banner */}
              <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 p-3 rounded-xl flex items-center space-x-2 text-xs text-blue-900 dark:text-blue-300">
                <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-[11px]">
                  AI analysis is for reference only. Final decision rests with the evaluator.
                </span>
              </div>
            </div>
          </div>

          {/* Collapsible Expanded AI Analysis Details Panel */}
          {showAnalysisDetails && (
            <div className="bg-indigo-50/40 border border-indigo-100 p-5 rounded-2xl space-y-3 text-xs text-indigo-950 animate-in fade-in">
              <h4 className="font-bold text-indigo-900 text-xs">Deep AI Analysis Breakdown</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Bi-directional OCR matching validated 100% of text elements between DTI Registration (NR-2024-000123) and Mayor's Permit application. Address geocoding verified boundary coordinates within Barangay San Isidro, Laguna.
              </p>
            </div>
          )}


          {/* ======================================================================= */}
          {/* RECENT APPLICATIONS (CONNECTED LIVE FEED & SELECTOR) */}
          {/* ======================================================================= */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col flex-1 min-h-0 space-y-3">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Recent Applications</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Live synchronized regulatory ledger</p>
              </div>
              
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow-2xs">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping mr-1" /> Live Feed
              </span>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search applicant, permit no, type..."
                value={appSearchQuery}
                onChange={(e) => setAppSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
              {appSearchQuery && (
                <button 
                  onClick={() => setAppSearchQuery('')} 
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Table Feed with Connected Row Interactivity */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <table className="w-full table-fixed text-left text-xs">
                <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-semibold text-[11px]">
                    <th className="py-3 pl-4 w-1/3 text-left">Permit / App No.</th>
                    <th className="py-3 px-2 w-1/3 text-center">Applicant / Entity</th>
                    <th className="py-3 pr-4 w-1/3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {displayedApplications.length > 0 ? (
                    displayedApplications.slice(0, 8).map((r) => {
                      const isSelected = selectedAppId === r.id;
                      const catBadge = getCategoryBadge(r.type, r.category);
                      const CatIcon = catBadge.icon;

                      return (
                        <tr 
                          key={r.id} 
                          onClick={() => {
                            setSelectedAppId(r.id);
                          }}
                          className={`cursor-pointer transition-all duration-200 group ${
                            isSelected 
                              ? 'bg-emerald-50/90 dark:bg-emerald-950/40 ring-1 ring-emerald-400 dark:ring-emerald-500 font-bold border-l-4 border-emerald-500' 
                              : 'hover:bg-blue-50/80 dark:hover:bg-slate-800/80'
                          }`}
                        >
                          {/* App Number & Category Badge */}
                          <td className="py-3.5 pl-4 w-1/3 align-middle">
                            <div className="flex items-center space-x-2.5">
                              <span className={`p-1.5 rounded-lg border text-[11px] flex-shrink-0 ${catBadge.color}`} title={r.type || 'Permit'}>
                                <CatIcon size={14} />
                              </span>
                              <div className="min-w-0">
                                <span className={`font-mono font-extrabold block text-xs truncate ${
                                  isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                                }`}>
                                  {r.id}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block truncate">
                                  {r.date || 'Sep 19, 2026'} • {r.type || 'Permit'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Applicant & Business Name */}
                          <td className="py-3.5 px-2 w-1/3 text-center align-middle">
                            <div className="flex flex-col items-center justify-center min-w-0">
                              <p className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate max-w-full">
                                {r.businessName || r.applicant}
                              </p>
                              {r.businessName && r.businessName !== r.applicant && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-full">
                                  {r.applicant}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 pr-4 w-1/3 text-center align-middle whitespace-nowrap">
                            <span className={`inline-block px-3 py-1 text-[11px] rounded-full font-bold shadow-2xs ${
                              r.status === 'Approved' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                              r.status === 'Rejected' ? 'text-rose-700 bg-rose-50 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                              'text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-slate-400 text-xs italic">
                        No applications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              <span>
                Showing {Math.min(8, displayedApplications.length)} of {displayedApplications.length} filtered ({applicationsList.length} total)
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end pt-2">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRequestMoreInfo}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <MessageSquare size={15} />
                <span>Request More Information</span>
              </button>

              <button
                onClick={handleSubmitDecision}
                className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Check size={16} />
                <span>Submit Decision</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Evaluator Decision Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card: AI Recommendation Details */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs">AI Recommendation Details</h3>

            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400 dark:text-slate-500">Model Version</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">v2.3.1</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400 dark:text-slate-500">Analysis Date</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">May 7, 2024 10:32 AM</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400 dark:text-slate-500">Processing Time</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">3.4 seconds</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400 dark:text-slate-500">Documents Analyzed</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">8 of 8</span>
              </div>
            </div>

            {/* View Full AI Report Link */}
            <button
              onClick={() => setActiveModal('full_ai_report')}
              className="w-full text-left text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 pt-2 flex items-center justify-between group cursor-pointer"
            >
              <span>View Full AI Report</span>
              <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Risk & Compliance Flags */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Risk &amp; Compliance Flags
            </h3>

            <div className="space-y-2 text-xs">
              {/* Flag 1 */}
              <div
                onClick={() => setExpandedFlagId(expandedFlagId === 'flag-1' ? null : 'flag-1')}
                className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-[11px]">All required documents submitted</p>
                      <p className="text-[10px] text-slate-400">All mandatory documents are present and valid.</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-[10px] font-bold flex-shrink-0">Cleared</span>
                </div>
                {expandedFlagId === 'flag-1' && (
                  <div className="p-2 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 rounded-lg text-[10px] text-emerald-950 dark:text-emerald-200 space-y-1 animate-in fade-in">
                    <p className="font-bold">Evidence Record:</p>
                    <p>✓ DTI Registration, Barangay Clearance, TIN, and Lease Agreement uploaded.</p>
                  </div>
                )}
              </div>

              {/* Flag 2 */}
              <div
                onClick={() => setExpandedFlagId(expandedFlagId === 'flag-2' ? null : 'flag-2')}
                className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-[11px]">Document quality verified</p>
                      <p className="text-[10px] text-slate-400">All documents are clear, readable, and authentic.</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-[10px] font-bold flex-shrink-0">Cleared</span>
                </div>
                {expandedFlagId === 'flag-2' && (
                  <div className="p-2 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 rounded-lg text-[10px] text-emerald-950 dark:text-emerald-200 space-y-1 animate-in fade-in">
                    <p className="font-bold">Evidence Record:</p>
                    <p>✓ Image DPI check passed. Zero blurs or obscured signatures found.</p>
                  </div>
                )}
              </div>

              {/* Flag 3 (Warning) */}
              <div
                onClick={() => setExpandedFlagId(expandedFlagId === 'flag-3' ? null : 'flag-3')}
                className="p-2 rounded-xl hover:bg-amber-50/40 dark:hover:bg-amber-950/20 cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-[11px]">Business address not yet verified</p>
                      <p className="text-[10px] text-slate-400">Address validation from LGU database is pending.</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-full text-[10px] font-bold flex-shrink-0">Warning</span>
                </div>
                {expandedFlagId === 'flag-3' && (
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-[10px] text-amber-950 dark:text-amber-200 space-y-1 animate-in fade-in">
                    <p className="font-bold">Inspection Requirement:</p>
                    <p>⚠ Business physical location requires routine LGU inspector walkthrough verification.</p>
                  </div>
                )}
              </div>

              {/* Flag 4 (Info) */}
              <div
                onClick={() => setExpandedFlagId(expandedFlagId === 'flag-4' ? null : 'flag-4')}
                className="p-2 rounded-xl hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex items-start space-x-2">
                    <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-[11px]">New business applicant</p>
                      <p className="text-[10px] text-slate-400">No prior records found. Standard verification applied.</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full text-[10px] font-bold flex-shrink-0">Info</span>
                </div>
                {expandedFlagId === 'flag-4' && (
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-[10px] text-blue-950 dark:text-blue-200 space-y-1 animate-in fade-in">
                    <p className="font-bold">Registration Profile:</p>
                    <p>ℹ Initial registration under Sole Proprietorship category (Year 2024).</p>
                  </div>
                )}
              </div>

              {/* Flag 5 */}
              <div
                onClick={() => setExpandedFlagId(expandedFlagId === 'flag-5' ? null : 'flag-5')}
                className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-[11px]">No derogatory records found</p>
                      <p className="text-[10px] text-slate-400">No outstanding violations or delinquencies.</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-[10px] font-bold flex-shrink-0">Cleared</span>
                </div>
                {expandedFlagId === 'flag-5' && (
                  <div className="p-2 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 rounded-lg text-[10px] text-emerald-950 dark:text-emerald-200 space-y-1 animate-in fade-in">
                    <p className="font-bold">Database Query Result:</p>
                    <p>✓ 0 Negative flags in Municipal Ordinance Violation Index.</p>
                  </div>
                )}
              </div>
            </div>
          </div>







          {/* Card 3: Evaluator Decision Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-xs">Evaluator Decision</h3>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleApplyAIRecommendation}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                  title="Automatically set decision and paste AI draft remarks"
                >
                  <Sparkles size={11} className="text-indigo-600" />
                  <span>Apply AI Rec</span>
                </button>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                  {liveAIResult?.recommendation || 'Approve'}
                </span>
              </div>
            </div>

            {/* Decision Radio Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Your Decision <span className="text-red-500">*</span>
              </label>

              <div className="space-y-2 text-xs">
                <label className={`flex items-center space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${evaluatorDecision === 'Approve' ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900 font-bold' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="evaluatorDecision"
                    value="Approve"
                    checked={evaluatorDecision === 'Approve'}
                    onChange={() => setEvaluatorDecision('Approve')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Approve</span>
                </label>

                <label className={`flex items-center space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${evaluatorDecision === 'Reject' ? 'border-rose-500 bg-rose-50/40 text-rose-900 font-bold' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="evaluatorDecision"
                    value="Reject"
                    checked={evaluatorDecision === 'Reject'}
                    onChange={() => setEvaluatorDecision('Reject')}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span>Reject</span>
                </label>

                <label className={`flex items-center space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${evaluatorDecision === 'Needs Review' ? 'border-amber-500 bg-amber-50/40 text-amber-900 font-bold' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="evaluatorDecision"
                    value="Needs Review"
                    checked={evaluatorDecision === 'Needs Review'}
                    onChange={() => setEvaluatorDecision('Needs Review')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>Needs Review</span>
                </label>
              </div>
            </div>

            {/* Comments Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Comments (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Enter your comments here..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-400">{comments.length}/500 characters</p>
            </div>

            {/* Override Checkbox */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-start space-x-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={overrideAI}
                  onChange={(e) => setOverrideAI(e.target.checked)}
                  className="mt-0.5 text-blue-600 rounded"
                />
                <div>
                  <span className="font-semibold text-slate-800">Override AI Recommendation</span>
                  <p className="text-[10px] text-slate-400">Provide reason when overriding ⓘ</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW APPLICATION DETAILS MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'app_details' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCheck size={20} className="text-blue-400" />
                <h3 className="font-bold text-sm">Application Spec Sheet — NR-2024-000123</h3>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <p className="text-[10px] text-slate-400">Business Entity Name</p>
                <p className="font-extrabold text-blue-900 text-sm">Dela Cruz General Merchandise</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="text-slate-400 text-[10px]">Business Type</p>
                  <p className="font-bold text-slate-800">Sole Proprietorship</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px]">Business Size</p>
                  <p className="font-medium text-slate-700">Small (1 - 10 employees)</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px]">Gross Annual Sales</p>
                  <p className="font-mono font-bold text-slate-900">₱1,500,000.00</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px]">Total Fee Amount</p>
                  <p className="font-mono font-bold text-blue-600">₱5,695.00</p>
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
      {/* MODAL 2: VIEW FULL AI REPORT MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'full_ai_report' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot size={20} className="text-indigo-400 animate-pulse" />
                <div>
                  <h3 className="font-bold text-sm">Full AI Audit & Compliance Report</h3>
                  <p className="text-[10px] text-slate-400">Inteli-Approval Model Version v2.3.1</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center text-emerald-950">
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={20} className="text-emerald-600" />
                  <div>
                    <p className="font-bold">Overall AI Recommendation: Approve (92% Score)</p>
                    <p className="text-[10px] text-emerald-800">Zero blocking non-compliance items found across all 8 attachments.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-slate-400">
                  Detailed AI Verification Matrix
                </h4>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">AI Sub-System</th>
                        <th className="p-2.5">Evaluation Status</th>
                        <th className="p-2.5 text-right">Risk Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-bold">1. Document OCR Quality Check</td>
                        <td className="p-2.5 text-emerald-600 font-semibold">Passed (8 of 8 Documents)</td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-600">0.05 (Low)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">2. Bi-directional Field Match</td>
                        <td className="p-2.5 text-emerald-600 font-semibold">100% Data Alignment</td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-600">0.02 (Low)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">3. Negative Watchlist & Violations</td>
                        <td className="p-2.5 text-emerald-600 font-semibold">Cleared (Zero Matches)</td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-600">0.00 (Zero)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">4. Fee & Tax Computation Check</td>
                        <td className="p-2.5 text-emerald-600 font-semibold">100% Ordinance Match</td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-600">0.00 (Zero)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button 
                onClick={handleExportAICertificate}
                disabled={isExportingReport}
                className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Download size={14} className="text-blue-600" />
                <span>
                  {isExportingReport 
                    ? 'Exporting Certificate...' 
                    : reportExportSuccess 
                    ? 'Exported AI Report ✓' 
                    : 'Export AI Certificate PDF'}
                </span>
              </button>

              <button onClick={() => setActiveModal('none')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DECISION SUBMITTED CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'submit_decision_success' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-4 animate-in fade-in zoom-in-95 relative">
            <button
              onClick={() => setActiveModal('none')}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Decision Submitted Successfully!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your evaluation decision <strong className="text-slate-900 dark:text-white font-bold">"{evaluatorDecision}"</strong> for Application <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">NR-2024-000123</span> has been logged into the system audit trail.
              </p>
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs text-blue-700 dark:text-blue-300 font-bold">
                Log Ref: DECISION-2024-88910
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: REQUEST INFORMATION FORM MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'request_info_form' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare size={20} className="text-blue-400" />
                <div>
                  <h3 className="font-bold text-sm">Request Additional Information</h3>
                  <p className="text-[10px] text-slate-400">Application: NR-2024-000123</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">Select required documents or clarifications to request from applicant:</p>
              
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-800">
                  <input 
                    type="checkbox" 
                    checked={requestChecklist.barangay} 
                    onChange={(e) => setRequestChecklist(prev => ({ ...prev, barangay: e.target.checked }))}
                    className="text-blue-600 rounded" 
                  />
                  <span>Updated Barangay Clearance Certificate (2024)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-800">
                  <input 
                    type="checkbox" 
                    checked={requestChecklist.locationSketch} 
                    onChange={(e) => setRequestChecklist(prev => ({ ...prev, locationSketch: e.target.checked }))}
                    className="text-blue-600 rounded" 
                  />
                  <span>Detailed Business Location Sketch / GPS Map</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-800">
                  <input 
                    type="checkbox" 
                    checked={requestChecklist.proofOwnership} 
                    onChange={(e) => setRequestChecklist(prev => ({ ...prev, proofOwnership: e.target.checked }))}
                    className="text-blue-600 rounded" 
                  />
                  <span>Clear Copy of Lease Contract / Property Title</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-800">
                  <input 
                    type="checkbox" 
                    checked={requestChecklist.governmentId} 
                    onChange={(e) => setRequestChecklist(prev => ({ ...prev, governmentId: e.target.checked }))}
                    className="text-blue-600 rounded" 
                  />
                  <span>Owner Government Valid Photo ID with Signature</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-800">Additional Instructions to Applicant</label>
                <textarea
                  rows={3}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button onClick={() => setActiveModal('none')} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">
                Cancel
              </button>

              <button
                onClick={() => setActiveModal('request_info_success')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
              >
                <Send size={14} />
                <span>Send Request to Applicant</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: REQUEST INFORMATION CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'request_info_success' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <MessageSquare size={28} />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">Request Sent to Applicant</h3>
              <p className="text-xs text-slate-500 mt-1">
                An automated email & portal message requesting additional information has been dispatched to <strong className="text-slate-800">Dela Cruz General Merchandise</strong>.
              </p>
            </div>

            <button
              onClick={() => setActiveModal('none')}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Back to Evaluation
            </button>
          </div>
        </div>
      )}

      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onStatusUpdated={(s) => setAiStatus(s)}
      />
    </div>
  );
};

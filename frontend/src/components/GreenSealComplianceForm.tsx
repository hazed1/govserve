import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  ShieldCheck, 
  Sparkles,
  ArrowLeft,
  FileCheck2,
  Trash2
} from 'lucide-react';

export interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  fileRequired: boolean;
  uploadedFile: File | null;
  status: 'completed' | 'pending' | 'optional';
}

interface GreenSealComplianceFormProps {
  onBack?: () => void;
  onSubmitSuccess?: (permitNo: string, rating: string) => void;
}

export const GreenSealComplianceForm: React.FC<GreenSealComplianceFormProps> = ({
  onBack,
  onSubmitSuccess
}) => {
  const [permitNo, setPermitNo] = useState('BLD-2025-00101');
  const [selectedRating, setSelectedRating] = useState<'Platinum' | 'Gold' | 'Silver'>('Platinum');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [checklist, setChecklist] = useState<ComplianceItem[]>([
    {
      id: 'energy',
      title: 'Energy Efficiency & Solar Integration Plan',
      description: 'ASHRAE 90.1 standard compliance certificate or solar layout blueprint.',
      fileRequired: true,
      uploadedFile: null,
      status: 'pending'
    },
    {
      id: 'water',
      title: 'Rainwater Harvesting & Plumbing Clearance',
      description: 'Plumbing engineer sign-off and dual-piping system layout.',
      fileRequired: true,
      uploadedFile: null,
      status: 'pending'
    },
    {
      id: 'materials',
      title: 'Sustainable Materials & Waste Management Audit',
      description: 'Material procurement declaration (required for Platinum and Gold ratings).',
      fileRequired: true,
      uploadedFile: null,
      status: 'pending'
    },
    {
      id: 'inspection',
      title: 'On-site Green Building Pre-inspection',
      description: 'Automatically scheduled upon complete document submission.',
      fileRequired: false,
      uploadedFile: null,
      status: 'optional'
    }
  ]);

  const handleFileUpload = (id: string, file: File) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, uploadedFile: file, status: 'completed' }
          : item
      )
    );
  };

  const handleRemoveFile = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, uploadedFile: null, status: 'pending' }
          : item
      )
    );
  };

  const completedCount = checklist.filter((item) => item.status === 'completed').length;
  const requiredCount = checklist.filter((item) => item.fileRequired).length;
  const isFullyComplied = completedCount >= requiredCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFullyComplied) return;
    setIsSubmitted(true);
    if (onSubmitSuccess) {
      onSubmitSuccess(permitNo, selectedRating);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto rounded-3xl flex items-center justify-center shadow-inner">
            <FileCheck2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold border border-amber-200 dark:border-amber-800">
              <Sparkles size={13} />
              <span>{selectedRating} Rating Application Received</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Green Seal Application Submitted!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Building Permit <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{permitNo}</span> has been endorsed to the Quezon City Green Building & Sustainability Committee for blueprint review and RPT incentive qualification.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Attached Clearances:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{completedCount} of {requiredCount} Verified</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Target Standard:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{selectedRating} Certification</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Status:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">Queueing for Committee On-Site Audit</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
              }}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Modify Submission
            </button>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs shadow-md shadow-amber-600/20 transition-all cursor-pointer"
              >
                Return to Building Permits
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Permit Overview</span>
        </button>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-200 dark:border-amber-800 flex-shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Green Building & Safety Seal Application
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Sparkles size={11} />
                QC Ordinance
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Quezon City Green Building Ordinance Certification & RPT Tax Incentive
            </p>
          </div>
        </div>

        {/* Permit & Rating Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Registered Building Permit No. *
            </label>
            <input
              type="text"
              value={permitNo}
              onChange={(e) => setPermitNo(e.target.value)}
              placeholder="e.g. BLD-2025-00101"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Target Green Rating
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Platinum', 'Gold', 'Silver'] as const).map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setSelectedRating(rating)}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                    selectedRating === rating
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 shadow-sm ring-1 ring-amber-500/30'
                      : 'border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {rating} Rating
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Progress Indicator */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/70 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs sm:text-sm gap-1">
            <span className="font-bold text-slate-700 dark:text-slate-200">Requirement Compliance Progress</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {completedCount} of {requiredCount} Requirements Attached
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isFullyComplied ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (completedCount / requiredCount) * 100)}%` }}
            />
          </div>
        </div>

        {/* Requirements Checklist & Upload Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
            Mandatory Clearances & Documents
          </h3>
          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    )}
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                      {item.title}
                    </h4>
                    <span
                      className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                        item.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {item.status === 'completed' ? 'Attached' : item.fileRequired ? 'Required' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 pl-7 leading-relaxed">
                    {item.description}
                  </p>
                  {item.uploadedFile && (
                    <div className="pl-7 pt-1 flex items-center gap-2">
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-xs">
                        📎 {item.uploadedFile.name} ({(item.uploadedFile.size / 1024).toFixed(1)} KB)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(item.id)}
                        className="text-rose-500 hover:text-rose-600 p-0.5 rounded transition-colors"
                        title="Remove file"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {item.fileRequired && (
                  <div className="pl-7 sm:pl-0 flex-shrink-0">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs">
                      <UploadCloud className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>
                        {item.uploadedFile 
                          ? 'Change File' 
                          : 'Upload File'
                        }
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(item.id, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Card */}
        <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 sm:p-5 text-xs space-y-2 text-amber-900 dark:text-amber-200">
          <p className="font-bold text-sm">Green Building Benefits:</p>
          <ul className="space-y-1.5 list-disc pl-4 text-amber-800 dark:text-amber-300/90 font-medium">
            <li>Up to 25% Real Property Tax (RPT) discount incentives for commercial and residential properties</li>
            <li>Priority processing and express lane for Certificate of Occupancy</li>
            <li>Official Municipal Green Seal QR Plaque & verification certificate</li>
          </ul>
        </div>

        {/* Submission Button */}
        <button
          type="button"
          disabled={!isFullyComplied}
          onClick={handleSubmit}
          className={`w-full py-3.5 sm:py-4 rounded-2xl font-bold text-sm text-white shadow-md transition-all ${
            isFullyComplied
              ? 'bg-amber-600 hover:bg-amber-500 cursor-pointer shadow-amber-600/25 active:scale-[0.99]'
              : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500 dark:text-slate-500 shadow-none'
          }`}
        >
          {isFullyComplied ? 'Submit Green Seal Filing' : 'Complete All Required Documents to Submit'}
        </button>
      </div>
    </div>
  );
};

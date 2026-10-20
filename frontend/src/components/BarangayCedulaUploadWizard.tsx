import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Camera,
  CheckCircle2,
  Eye,
  RefreshCw,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Printer,
  Check,
  X,
  CreditCard,
  Banknote,
  QrCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface UploadedDoc {
  name: string;
  size: string;
  previewUrl: string;
}

interface BarangayCedulaUploadWizardProps {
  onBackToPortal: () => void;
  onReturnToOverview: () => void;
  onAddNewApplication?: (name: string, type: string) => void;
}

export const BarangayCedulaUploadWizard: React.FC<BarangayCedulaUploadWizardProps> = ({
  onBackToPortal,
  onReturnToOverview,
  onAddNewApplication
}) => {
  const { user } = useAuth();

  // Step 1: Valid ID photo, Step 2: Proof of Income photo, Step 3: Instant Computation & Issue
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [ctcNumber, setCtcNumber] = useState<string>('');

  // 2 Mandatory Photo Uploads
  const [idDoc, setIdDoc] = useState<UploadedDoc | null>(null);
  const [incomeDoc, setIncomeDoc] = useState<UploadedDoc | null>(null);

  // Auto-extracted applicant info (Zero manual typing required!)
  const [taxpayerName, setTaxpayerName] = useState<string>(user?.name || 'Jason Taccad');
  const [taxpayerAddress, setTaxpayerAddress] = useState<string>('Barangay San Isidro, Quezon City');
  const [incomeLevel, setIncomeLevel] = useState<string>('₱350,000.00 Annual Compensation');
  const [basicTax, setBasicTax] = useState<number>(5.00);
  const [additionalTax, setAdditionalTax] = useState<number>(50.00);
  const [totalCedula, setTotalCedula] = useState<number>(55.00);

  // Preview modal & toast
  const [previewDoc, setPreviewDoc] = useState<{ title: string; doc: UploadedDoc } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'id' | 'income') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    const newDoc: UploadedDoc = {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      previewUrl: fakeUrl
    };

    if (target === 'id') setIdDoc(newDoc);
    if (target === 'income') setIncomeDoc(newDoc);

    showToast(`✓ Uploaded ${file.name}`);
  };

  const handleLoadSamplePhotos = () => {
    setIdDoc({
      name: 'Philippine_National_ID_PhilID.jpg',
      size: '1.9 MB',
      previewUrl: '/government-logo.png'
    });
    setIncomeDoc({
      name: 'BIR_Form_2316_Income_Proof.jpg',
      size: '2.1 MB',
      previewUrl: '/government-logo.png'
    });
    showToast('✓ Sample photos loaded for testing!');
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedNo = `CTC-2025-${Math.floor(1000000 + Math.random() * 9000000)}`;
      setCtcNumber(generatedNo);
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onAddNewApplication) {
        onAddNewApplication(taxpayerName, 'Community Tax Certificate (Cedula)');
      }
      showToast('✓ Community Tax Certificate (Cedula) generated!');
    }, 1000);
  };

  // Helper render
  const renderPhotoDropzone = (
    title: string,
    desc: string,
    doc: UploadedDoc | null,
    target: 'id' | 'income',
    badge: string
  ) => {
    return (
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Camera size={16} className="text-blue-600 dark:text-blue-400" />
              <span>{title}</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
          </div>
          {!doc ? (
            <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              ○ Not uploaded
            </span>
          ) : (
            <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
              <CheckCircle2 size={13} />
              ✓ Uploaded
            </span>
          )}
        </div>

        {!doc ? (
          <div className="flex justify-center w-full py-4">
            <label
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer group shrink-0"
            >
              <Upload size={15} className="group-hover:-translate-y-0.5 transition-transform" />
              <span>UPLOAD PHOTO</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.webp"
                onChange={(e) => handleFileUpload(e, target)}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="pt-2 w-full flex justify-center">
            <div className="relative group/thumb p-3 rounded-2xl bg-[#091524] border border-slate-700/80 shadow-lg w-full max-w-[320px] sm:max-w-[340px] flex flex-col items-center animate-in fade-in zoom-in-95 mx-auto">
              {/* Circular (X) remove button at top-right */}
              <button
                type="button"
                onClick={() => {
                  if (target === 'id') setIdDoc(null);
                  if (target === 'income') setIncomeDoc(null);
                }}
                title="Remove Photo"
                className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-slate-700 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer z-10"
              >
                <X size={15} />
              </button>

              {/* Photo Thumbnail - Direct Click to Preview */}
              <div
                onClick={() => setPreviewDoc({ title, doc })}
                className="w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 cursor-pointer relative group-hover/thumb:border-blue-500 transition-colors flex items-center justify-center p-1"
                title="Click to view full photo"
              >
                {doc.previewUrl.endsWith('.pdf') ? (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                    <FileText size={40} className="text-blue-400" />
                    <span className="text-[11px] font-bold text-slate-300">PDF Document</span>
                  </div>
                ) : (
                  <img
                    src={doc.previewUrl}
                    alt={doc.name}
                    className="w-full h-full object-contain group-hover/thumb:scale-[1.03] transition-transform duration-200"
                  />
                )}
                <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-bold text-xs pointer-events-none">
                  <Eye size={16} />
                  <span>Click to Preview</span>
                </div>
              </div>

              {/* Document details below thumbnail */}
              <div className="mt-2.5 w-full px-1 text-center">
                <p className="text-xs font-bold text-slate-200 truncate">{doc.name}</p>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center justify-center gap-1 mt-0.5">
                  <Check size={11} /> Photo verified &amp; ready ({doc.size})
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center space-x-2 animate-bounce">
          <Sparkles size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Header with Title and Step Tracker */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                  Step {currentStep} of 3
                </span>
                <span className="text-xs text-slate-400 font-bold">100% Picture-Upload Cedula</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                Community Tax Certificate (Cedula CTC)
              </h2>
            </div>
          </div>

        </div>

        {/* Step Progress Bar */}
        {!isSubmitted && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { step: 1, label: 'Upload Valid ID' },
              { step: 2, label: 'Upload Income Proof' },
              { step: 3, label: 'Tax Assessment & Issue' },
            ].map((s) => (
              <div
                key={s.step}
                className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all cursor-default select-none pointer-events-none ${
                  currentStep === s.step
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : currentStep > s.step
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <span className="text-[10px] block uppercase">Step {s.step}</span>
                <span className="text-[11px] font-extrabold truncate block">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Form Content */}
        {!isSubmitted ? (
          <div className="space-y-6 pt-2">
            {/* STEP 1: VALID GOVERNMENT ID PHOTO */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in">
                {renderPhotoDropzone(
                  'Valid Government ID Photo',
                  'Take a clear picture of your National ID (PhilID), Driver\'s License, Passport, or UMID.',
                  idDoc,
                  'id',
                  'Photo Required'
                )}

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-black text-slate-700 dark:text-slate-300">Taxpayer Full Name:</span>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{taxpayerName} • {taxpayerAddress}</p>
                </div>
              </div>
            )}

            {/* STEP 2: PROOF OF GROSS INCOME PHOTO */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                {renderPhotoDropzone(
                  'Proof of Gross Income, Payslip, or BIR 2316 Photo',
                  'Take a photo of your latest payslip, compensation voucher, or previous year Cedula receipt.',
                  incomeDoc,
                  'income',
                  'Photo Required'
                )}

                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs space-y-1">
                  <span className="font-black text-blue-900 dark:text-blue-300">Automated Income Assessment:</span>
                  <p className="text-blue-800 dark:text-blue-400 font-medium">
                    Calculated based on declared compensation: {incomeLevel}.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: AUTOMATED TAX CALCULATION & ISSUE */}
            {currentStep === 3 && (() => {
              const uploadedCount = [idDoc, incomeDoc].filter(Boolean).length;
              const isAllUploaded = uploadedCount === 2;

              return (
                <div className="space-y-5 animate-in fade-in">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-blue-900 dark:text-blue-300 tracking-wider">
                        Document Photo Review (Steps 1 &amp; 2)
                      </span>
                      <span className={`text-[11px] font-bold flex items-center gap-1 ${
                        isAllUploaded ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {isAllUploaded ? <CheckCircle2 size={13} /> : <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                        {uploadedCount} of 2 Photos Uploaded
                      </span>
                    </div>

                    {/* Step 1 & 2 Review Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Step 1: Valid ID */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                        {idDoc ? (
                          <div
                            onClick={() => setPreviewDoc({ title: 'Step 1: Valid Government ID', doc: idDoc })}
                            className="w-20 h-16 sm:w-22 sm:h-18 rounded-xl bg-[#091524] border border-slate-700/80 shadow-xs flex items-center justify-center shrink-0 cursor-pointer relative group/thumb overflow-hidden hover:border-blue-500 transition-all p-1"
                            title="Click to preview photo"
                          >
                            <img src={idDoc.previewUrl} alt={idDoc.name} className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye size={14} />
                            </div>
                          </div>
                        ) : (
                          <div className="w-20 h-16 sm:w-22 sm:h-18 rounded-xl bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center shrink-0 text-slate-400">
                            <Camera size={18} />
                            <span className="text-[9px] font-bold mt-1">Missing</span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">Step 1</span>
                            <span className="text-xs font-black text-slate-800 dark:text-white truncate">Valid Government ID</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {idDoc ? idDoc.name : 'No photo uploaded'}
                          </p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                            idDoc ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          }`}>
                            {idDoc ? `✓ Uploaded (${idDoc.size})` : '○ Missing'}
                          </span>
                        </div>
                      </div>

                      {/* Step 2: Proof of Income */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                        {incomeDoc ? (
                          <div
                            onClick={() => setPreviewDoc({ title: 'Step 2: Proof of Gross Income / Payslip', doc: incomeDoc })}
                            className="w-20 h-16 sm:w-22 sm:h-18 rounded-xl bg-[#091524] border border-slate-700/80 shadow-xs flex items-center justify-center shrink-0 cursor-pointer relative group/thumb overflow-hidden hover:border-blue-500 transition-all p-1"
                            title="Click to preview photo"
                          >
                            <img src={incomeDoc.previewUrl} alt={incomeDoc.name} className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye size={14} />
                            </div>
                          </div>
                        ) : (
                          <div className="w-20 h-16 sm:w-22 sm:h-18 rounded-xl bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center shrink-0 text-slate-400">
                            <Camera size={18} />
                            <span className="text-[9px] font-bold mt-1">Missing</span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">Step 2</span>
                            <span className="text-xs font-black text-slate-800 dark:text-white truncate">Proof of Income</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {incomeDoc ? incomeDoc.name : 'No photo uploaded'}
                          </p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                            incomeDoc ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          }`}>
                            {incomeDoc ? `✓ Uploaded (${incomeDoc.size})` : '○ Missing'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Taxpayer Information Summary */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Taxpayer Details:</span>
                        <span className="font-semibold text-slate-800 dark:text-white">{taxpayerName}</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{taxpayerAddress}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Declared Compensation:</span>
                        <span className="font-semibold text-slate-800 dark:text-white">{incomeLevel}</span>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Verified from Uploaded Form</p>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })()}

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {currentStep === 1 ? (
                  <button
                    type="button"
                    onClick={onBackToPortal}
                    className="px-4 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-4 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {currentStep < 3 ? (
                  (() => {
                    const isStepUploaded = currentStep === 1 ? !!idDoc : currentStep === 2 ? !!incomeDoc : true;
                    return (
                      <button
                        type="button"
                        disabled={!isStepUploaded}
                        onClick={() => {
                          if (!isStepUploaded) return;
                          setCurrentStep(prev => prev + 1);
                        }}
                        className={`px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                          isStepUploaded
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                            : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                        }`}
                      >
                        <span>Next Step →</span>
                      </button>
                    );
                  })()
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting || !idDoc || !incomeDoc}
                    onClick={handleSubmit}
                    className={`px-6 py-3.5 rounded-xl text-white text-xs sm:text-sm font-black shadow-lg transition-all flex items-center gap-2 ${
                      !idDoc || !incomeDoc
                        ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500'
                        : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30 cursor-pointer active:scale-[0.98]'
                    }`}
                  >
                    <ShieldCheck size={16} />
                    <span>{isSubmitting ? 'Generating Digital Cedula...' : 'Issue Digital Cedula'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ISSUED OFFICIAL DIGITAL CEDULA (FORM NO. 0016) */
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                Official Digital Cedula Issued
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                Community Tax Certificate (Cedula) Ready!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Your Community Tax Certificate has been authenticated by the City Treasurer's Office and Barangay Revenue Collector.
              </p>
            </div>

            {/* Official CTC Form 0016 Box */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-blue-300 dark:border-blue-700/60 max-w-lg mx-auto text-left text-xs font-mono space-y-3 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-blue-700 dark:text-blue-400">CITY TREASURER • QUEZON CITY</span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">FORM NO. 0016</span>
              </div>
              
              <div className="space-y-1 pt-1">
                <p><strong>CTC NUMBER    :</strong> <span className="text-blue-600 font-bold">{ctcNumber}</span></p>
                <p><strong>TAXPAYER NAME :</strong> {taxpayerName}</p>
                <p><strong>ADDRESS       :</strong> {taxpayerAddress}</p>
                <p><strong>DATE ISSUED   :</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p><strong>TOTAL TAX PAID:</strong> ₱ {totalCedula.toFixed(2)} (OFFICIALLY PAID)</p>
                <p><strong>VALIDITY      :</strong> Calendar Year 2025</p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                  <ShieldCheck size={14} />
                  <span>Authenticated Cryptographic Seal</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">QR SEAL READY</span>
              </div>
            </div>

            {/* Post-Issue Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer size={15} />
                <span>Print Official CTC Form</span>
              </button>
              <button
                type="button"
                onClick={onReturnToOverview}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Check size={15} />
                <span>Return to Barangay Overview</span>
              </button>
              <button
                type="button"
                onClick={onBackToPortal}
                className="px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Portal</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Picture Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">{previewDoc.title}</h3>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500"
              >
                <X size={16} />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 p-2 flex items-center justify-center min-h-[220px]">
              <img
                src={previewDoc.doc.previewUrl}
                alt={previewDoc.title}
                className="max-h-72 object-contain rounded-xl"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

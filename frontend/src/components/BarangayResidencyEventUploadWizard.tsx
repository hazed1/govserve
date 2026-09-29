import React, { useState } from 'react';
import {
  Award,
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
  Calendar,
  FileCheck,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface UploadedDoc {
  name: string;
  size: string;
  previewUrl: string;
}

interface BarangayResidencyEventUploadWizardProps {
  onBackToPortal: () => void;
  onReturnToOverview: () => void;
  onAddNewApplication?: (name: string, type: string) => void;
}

export const BarangayResidencyEventUploadWizard: React.FC<BarangayResidencyEventUploadWizardProps> = ({
  onBackToPortal,
  onReturnToOverview,
  onAddNewApplication
}) => {
  const { user } = useAuth();

  // Wizard Steps: 1 (Valid ID), 2 (Proof of Address), 3 (Event Itinerary / Purpose), 4 (Issue Pass)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [clearanceNo, setClearanceNo] = useState<string>('');

  // Clearance Type Toggle
  const [clearanceType, setClearanceType] = useState<'Residency' | 'Event'>('Residency');

  // 3 Mandatory Photo Uploads
  const [idDoc, setIdDoc] = useState<UploadedDoc | null>(null);
  const [addressDoc, setAddressDoc] = useState<UploadedDoc | null>(null);
  const [purposeDoc, setPurposeDoc] = useState<UploadedDoc | null>(null);

  // Auto-populated fields (Friendly, no tedious manual typing)
  const [applicantName, setApplicantName] = useState<string>(user?.name || 'Jason Taccad');
  const [residentialAddress, setResidentialAddress] = useState<string>('Block 5 Lot 12, Katipunan Ave., Brgy. San Isidro, Quezon City');
  const [eventPurpose, setEventPurpose] = useState<string>('Barangay Certificate of Residency / Community Activity Pass');
  const [isIndigent, setIsIndigent] = useState<boolean>(false);

  // Preview modal & toast
  const [previewDoc, setPreviewDoc] = useState<{ title: string; doc: UploadedDoc } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'id' | 'address' | 'purpose') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    const newDoc: UploadedDoc = {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      previewUrl: fakeUrl
    };

    if (target === 'id') setIdDoc(newDoc);
    if (target === 'address') setAddressDoc(newDoc);
    if (target === 'purpose') setPurposeDoc(newDoc);

    showToast(`✓ Uploaded ${file.name}`);
  };

  const handleLoadSamplePhotos = () => {
    setIdDoc({
      name: 'Philippine_Postal_ID_Card.jpg',
      size: '1.7 MB',
      previewUrl: '/government-logo.png'
    });
    setAddressDoc({
      name: 'Meralco_Electricity_Bill_Latest.jpg',
      size: '2.3 MB',
      previewUrl: '/government-logo.png'
    });
    setPurposeDoc({
      name: 'Activity_Itinerary_Community_Pass.jpg',
      size: '1.4 MB',
      previewUrl: '/government-logo.png'
    });
    showToast('✓ Sample photos loaded for testing!');
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedNo = `BRE-2025-${Math.floor(100000 + Math.random() * 900000)}`;
      setClearanceNo(generatedNo);
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onAddNewApplication) {
        onAddNewApplication(applicantName, clearanceType === 'Residency' ? 'Barangay Certificate of Residency' : 'Special Barangay Event Pass');
      }
      showToast('✓ Official Barangay Clearance Pass Generated!');
    }, 1100);
  };

  const renderPhotoDropzone = (
    title: string,
    desc: string,
    doc: UploadedDoc | null,
    target: 'id' | 'address' | 'purpose',
    badge: string
  ) => {
    return (
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Camera size={16} className="text-purple-600 dark:text-purple-400" />
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
          <label className="border-2 border-dashed border-purple-300 dark:border-purple-800/80 hover:border-purple-500 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-purple-50/40 dark:bg-purple-950/20 hover:bg-purple-50/70 transition-all cursor-pointer group">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileUpload(e, target)}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <Camera size={26} />
            </div>
            <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white">
              Take a Photo or Click to Upload Picture
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Supports Smartphone Photos, Clear Pictures, or Scanned Documents (JPG/PNG)
            </p>
            <span className="mt-3 px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold shadow-xs">
              + Choose Photo
            </span>
          </label>
        ) : (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500/50 shadow-md flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">{doc.name}</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <Check size={11} /> Photo verified &amp; ready ({doc.size})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewDoc({ title, doc })}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                title="View Photo"
              >
                <Eye size={15} />
              </button>
              <label className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer">
                <RefreshCw size={15} />
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileUpload(e, target)}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  if (target === 'id') setIdDoc(null);
                  if (target === 'address') setAddressDoc(null);
                  if (target === 'purpose') setPurposeDoc(null);
                }}
                className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer"
                title="Remove Photo"
              >
                <Trash2 size={15} />
              </button>
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
          <Sparkles size={16} className="text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Header with Title and Step Tracker */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <Award size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                  Step {currentStep} of 4
                </span>
                <span className="text-xs text-slate-400 font-bold">100% Picture-Upload Filing</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                Barangay Residency Clearance
              </h2>
            </div>
          </div>

          {!isSubmitted && (
            <button
              type="button"
              onClick={handleLoadSamplePhotos}
              className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900 text-purple-800 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Preload sample photos for fast testing"
            >
              <Sparkles size={14} />
              <span>Load Sample Photos</span>
            </button>
          )}
        </div>

        {/* Step Progress Bar */}
        {!isSubmitted && (
          <div className="grid grid-cols-4 gap-2">
            {[
              { step: 1, label: 'Upload Valid ID' },
              { step: 2, label: 'Proof of Address' },
              { step: 3, label: 'Event / Purpose' },
              { step: 4, label: 'Review & Issue' },
            ].map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all ${
                  currentStep === s.step
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : currentStep > s.step
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <span className="text-[10px] block uppercase">Step {s.step}</span>
                <span className="text-[11px] font-extrabold truncate block">{s.label}</span>
              </button>
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
                  'Take a clear picture of your National ID, Postal ID, Voter\'s ID, or Driver\'s License.',
                  idDoc,
                  'id',
                  'Photo Required'
                )}

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-black text-slate-700 dark:text-slate-300">Resident / Applicant:</span>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{applicantName}</p>
                </div>
              </div>
            )}

            {/* STEP 2: PROOF OF ADDRESS PHOTO */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                {renderPhotoDropzone(
                  'Proof of Address / Residency Photo',
                  'Take a photo of your latest Utility Bill (Meralco, Maynilad), Notarized Lease Contract, or HOA Certification.',
                  addressDoc,
                  'address',
                  'Photo Required'
                )}

                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-1">
                  <span className="font-black text-purple-900 dark:text-purple-300">Registered Residential Address:</span>
                  <p className="text-purple-800 dark:text-purple-400 font-medium">{residentialAddress}</p>
                </div>
              </div>
            )}

            {/* STEP 3: EVENT ITINERARY OR PURPOSE PHOTO */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                {/* Mode selector */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setClearanceType('Residency')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      clearanceType === 'Residency'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 ring-2 ring-purple-600/20'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="font-black text-xs text-slate-800 dark:text-white block">Certificate of Residency</span>
                    <span className="text-[11px] text-slate-500">For scholarship, job application, or proof of address</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClearanceType('Event')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      clearanceType === 'Event'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 ring-2 ring-purple-600/20'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="font-black text-xs text-slate-800 dark:text-white block">Special Event Pass</span>
                    <span className="text-[11px] text-slate-500">For street activity, motorcade, bazaar, or liga</span>
                  </button>
                </div>

                {renderPhotoDropzone(
                  clearanceType === 'Residency' ? 'Request Purpose / Endorsement Letter Photo' : 'Event Program / Itinerary & Safety Route Photo',
                  'Take a photo of your request purpose, school endorsement, event layout, or activity program.',
                  purposeDoc,
                  'purpose',
                  'Photo Required'
                )}

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Indigent / First-Time Jobseeker (100% Fee Exemption):</span>
                  <input
                    type="checkbox"
                    checked={isIndigent}
                    onChange={(e) => setIsIndigent(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & ISSUE */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/40 dark:to-fuchsia-950/20 border border-purple-200 dark:border-purple-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-purple-900 dark:text-purple-300 tracking-wider">
                      Residency &amp; Lupon Validation Summary
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Lupon Record Clean
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-purple-100 dark:border-purple-900/60">
                      <span className="text-slate-600 dark:text-slate-400">Clearance Document:</span>
                      <span className="font-bold text-slate-800 dark:text-white">
                        {clearanceType === 'Residency' ? 'Official Barangay Certificate of Residency' : 'Special Barangay Event Permit'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-purple-100 dark:border-purple-900/60">
                      <span className="text-slate-600 dark:text-slate-400">Standard Regulatory Fee:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-white">
                        {isIndigent ? '₱0.00 (Exempted under RA 11261)' : '₱150.00'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 text-sm font-black">
                      <span className="text-purple-950 dark:text-purple-200">Amount to Pay:</span>
                      <span className="font-mono text-purple-600 dark:text-purple-400 text-lg">
                        {isIndigent ? '₱ 0.00' : '₱ 150.00'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onBackToPortal}
                  className="px-4 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Portal</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100"
                  >
                    Previous
                  </button>
                )}

                {currentStep < 4 ? (
                  (() => {
                    const isStepUploaded = currentStep === 1 ? !!idDoc : currentStep === 2 ? !!addressDoc : currentStep === 3 ? !!purposeDoc : true;
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
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
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
                    disabled={isSubmitting || !idDoc || !addressDoc || !purposeDoc}
                    onClick={handleSubmit}
                    className={`px-6 py-3.5 rounded-xl text-white text-xs sm:text-sm font-black shadow-lg transition-all flex items-center gap-2 ${
                      !idDoc || !addressDoc || !purposeDoc
                        ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500'
                        : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30 cursor-pointer active:scale-[0.98]'
                    }`}
                  >
                    <ShieldCheck size={16} />
                    <span>{isSubmitting ? 'Issuing Certificate...' : isIndigent ? 'Issue Free Certificate' : 'Issue Clearance (₱150.00)'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ISSUED OFFICIAL BARANGAY RESIDENCY / EVENT CERTIFICATE */
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                Official Certification Issued
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                Barangay Residency Clearance Ready!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Your clearance has been registered in the Barangay Registry with Lupon Tagapamayapa certification.
              </p>
            </div>

            {/* Official Certificate Box */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-purple-300 dark:border-purple-700/60 max-w-lg mx-auto text-left text-xs font-mono space-y-3 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-purple-700 dark:text-purple-400">BARANGAY COUNCIL • QUEZON CITY</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">FORM BR-02</span>
              </div>
              
              <div className="space-y-1 pt-1">
                <p><strong>CLEARANCE NO  :</strong> <span className="text-purple-600 font-bold">{clearanceNo}</span></p>
                <p><strong>RESIDENT NAME :</strong> {applicantName}</p>
                <p><strong>RESIDENCE     :</strong> {residentialAddress}</p>
                <p><strong>PURPOSE       :</strong> {clearanceType === 'Residency' ? 'Certificate of Good Standing & Residency' : 'Special Event Activity Authorization'}</p>
                <p><strong>DATE ISSUED   :</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p><strong>LUPON RECORD  :</strong> CLEAN / NO ACTIVE DISPUTE</p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                  <ShieldCheck size={14} />
                  <span>Punong Barangay Signature Verified</span>
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
                <span>Print Certificate</span>
              </button>
              <button
                type="button"
                onClick={onReturnToOverview}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
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

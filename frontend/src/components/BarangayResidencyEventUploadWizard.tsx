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

  // Clearance Type Selection (Starts empty so user must select one: Certificate of Residency or Special Event Pass)
  const [clearanceType, setClearanceType] = useState<'Residency' | 'Event' | ''>('');

  // 3 Mandatory Photo Uploads
  const [idDoc, setIdDoc] = useState<UploadedDoc | null>(null);
  const [addressDoc, setAddressDoc] = useState<UploadedDoc | null>(null);
  const [purposeDoc, setPurposeDoc] = useState<UploadedDoc | null>(null);

  // Auto-populated fields (Friendly, no tedious manual typing)
  const [applicantName, setApplicantName] = useState<string>(user?.name || 'Jason Taccad');
  const [residentialAddress, setResidentialAddress] = useState<string>('Block 5 Lot 12, Katipunan Ave., Brgy. San Isidro, Quezon City');
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
    setClearanceType('Residency');
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
        onAddNewApplication(
          applicantName,
          clearanceType === 'Residency' ? 'Certificate of Residency' : 'Special Event Pass'
        );
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
                  if (target === 'address') setAddressDoc(null);
                  if (target === 'purpose') setPurposeDoc(null);
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
                    <FileCheck size={40} className="text-blue-400" />
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
          <Sparkles size={16} className="text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Header with Title and Step Tracker */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <Award size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                  Step {currentStep} of 4
                </span>
                <span className="text-xs text-slate-400 font-bold">100% Picture-Upload Filing</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                Barangay Residency Clearance
              </h2>
            </div>
          </div>

        </div>

        {/* Step Progress Bar (Non-clickable visual indicator) */}
        {!isSubmitted && (
          <div className="grid grid-cols-4 gap-2">
            {[
              { step: 1, label: 'Upload Valid ID' },
              { step: 2, label: 'Proof of Address' },
              { step: 3, label: 'Event / Purpose' },
              { step: 4, label: 'Review & Issue' },
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

                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs space-y-1">
                  <span className="font-black text-blue-900 dark:text-blue-300">Registered Residential Address:</span>
                  <p className="text-blue-800 dark:text-blue-400 font-medium">{residentialAddress}</p>
                </div>
              </div>
            )}

            {/* STEP 3: EVENT ITINERARY OR PURPOSE PHOTO */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                {/* Clearance Selection Dropdown (Only 2 Choices + English Placeholder without dashes) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Select Clearance Type / Purpose:
                  </label>
                  <select
                    value={clearanceType}
                    onChange={(e) => setClearanceType(e.target.value as 'Residency' | 'Event' | '')}
                    className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all cursor-pointer shadow-xs"
                  >
                    <option value="">Select Clearance Type</option>
                    <option value="Residency">
                      Certificate of Residency (For scholarship, job application, or proof of address)
                    </option>
                    <option value="Event">
                      Special Event Pass (For street activity, motorcade, bazaar, or liga)
                    </option>
                  </select>
                </div>

                {renderPhotoDropzone(
                  clearanceType === 'Event'
                    ? 'Event Program / Itinerary & Safety Route Photo'
                    : 'Request Purpose / Endorsement Letter Photo',
                  clearanceType === 'Event'
                    ? 'Take a photo of your activity program, route map, or venue authorization.'
                    : 'Take a photo of your request purpose, school endorsement, or employer requirement.',
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
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & ISSUE */}
            {currentStep === 4 && (() => {
              const uploadedCount = [idDoc, addressDoc, purposeDoc].filter(Boolean).length;
              const isAllUploaded = uploadedCount === 3;

              return (
                <div className="space-y-5 animate-in fade-in">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-blue-900 dark:text-blue-300 tracking-wider">
                        Document Photo Review (Steps 1 to 3)
                      </span>
                      <span className={`text-[11px] font-bold flex items-center gap-1 ${
                        isAllUploaded ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {isAllUploaded ? <CheckCircle2 size={13} /> : <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                        {uploadedCount} of 3 Photos Uploaded
                      </span>
                    </div>

                    {/* Step-by-Step Review Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Step 1: Valid ID */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-3">
                        {idDoc ? (
                          <div
                            onClick={() => setPreviewDoc({ title: 'Step 1: Valid Government ID', doc: idDoc })}
                            className="w-full h-24 rounded-xl bg-[#091524] border border-slate-700/80 shadow-xs flex items-center justify-center cursor-pointer relative group/thumb overflow-hidden hover:border-blue-500 transition-all p-1"
                            title="Click to preview photo"
                          >
                            <img src={idDoc.previewUrl} alt={idDoc.name} className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye size={14} />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-24 rounded-xl bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                            <Camera size={18} />
                            <span className="text-[9px] font-bold mt-1">Missing</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 block">Step 1</span>
                          <span className="text-xs font-black text-slate-800 dark:text-white truncate block">Valid ID Photo</span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {idDoc ? idDoc.name : 'No photo'}
                          </p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                            idDoc ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          }`}>
                            {idDoc ? `✓ Uploaded (${idDoc.size})` : '○ Missing'}
                          </span>
                        </div>
                      </div>

                      {/* Step 2: Proof of Address */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-3">
                        {addressDoc ? (
                          <div
                            onClick={() => setPreviewDoc({ title: 'Step 2: Proof of Address', doc: addressDoc })}
                            className="w-full h-24 rounded-xl bg-[#091524] border border-slate-700/80 shadow-xs flex items-center justify-center cursor-pointer relative group/thumb overflow-hidden hover:border-blue-500 transition-all p-1"
                            title="Click to preview photo"
                          >
                            <img src={addressDoc.previewUrl} alt={addressDoc.name} className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye size={14} />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-24 rounded-xl bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                            <Camera size={18} />
                            <span className="text-[9px] font-bold mt-1">Missing</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 block">Step 2</span>
                          <span className="text-xs font-black text-slate-800 dark:text-white truncate block">Proof of Address</span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {addressDoc ? addressDoc.name : 'No photo'}
                          </p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                            addressDoc ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          }`}>
                            {addressDoc ? `✓ Uploaded (${addressDoc.size})` : '○ Missing'}
                          </span>
                        </div>
                      </div>

                      {/* Step 3: Purpose / Supporting Doc */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-3">
                        {purposeDoc ? (
                          <div
                            onClick={() => setPreviewDoc({ title: 'Step 3: Purpose / Endorsement', doc: purposeDoc })}
                            className="w-full h-24 rounded-xl bg-[#091524] border border-slate-700/80 shadow-xs flex items-center justify-center cursor-pointer relative group/thumb overflow-hidden hover:border-blue-500 transition-all p-1"
                            title="Click to preview photo"
                          >
                            <img src={purposeDoc.previewUrl} alt={purposeDoc.name} className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye size={14} />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-24 rounded-xl bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                            <Camera size={18} />
                            <span className="text-[9px] font-bold mt-1">Missing</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 block">Step 3</span>
                          <span className="text-xs font-black text-slate-800 dark:text-white truncate block">Purpose Document</span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {purposeDoc ? purposeDoc.name : 'No photo'}
                          </p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                            purposeDoc ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          }`}>
                            {purposeDoc ? `✓ Uploaded (${purposeDoc.size})` : '○ Missing'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Resident & Purpose Info Summary */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resident / Applicant:</span>
                        <span className="font-semibold text-slate-800 dark:text-white">{applicantName}</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{residentialAddress}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selected Clearance Type:</span>
                        <span className="font-semibold text-blue-700 dark:text-blue-400 block">
                          {clearanceType === 'Residency'
                            ? 'Certificate of Residency (For scholarship, job application, or proof of address)'
                            : clearanceType === 'Event'
                            ? 'Special Event Pass (For street activity, motorcade, bazaar, or liga)'
                            : 'None Selected'}
                        </span>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                          {isIndigent ? '✓ Fee Exempted (Indigent / First-Time Jobseeker)' : '✓ Standard Verified Application'}
                        </p>
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
                {currentStep < 4 ? (
                  (() => {
                    const isStepUploaded =
                      currentStep === 1
                        ? !!idDoc
                        : currentStep === 2
                        ? !!addressDoc
                        : currentStep === 3
                        ? !!purposeDoc && !!clearanceType
                        : true;
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
                    disabled={isSubmitting || !idDoc || !addressDoc || !purposeDoc || !clearanceType}
                    onClick={handleSubmit}
                    className={`px-6 py-3.5 rounded-xl text-white text-xs sm:text-sm font-black shadow-lg transition-all flex items-center gap-2 ${
                      !idDoc || !addressDoc || !purposeDoc || !clearanceType
                        ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500'
                        : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30 cursor-pointer active:scale-[0.98]'
                    }`}
                  >
                    <ShieldCheck size={16} />
                    <span>{isSubmitting ? 'Issuing Certificate...' : 'Issue Barangay Clearance'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ISSUED OFFICIAL BARANGAY RESIDENCY / EVENT CERTIFICATE */
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
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
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-blue-300 dark:border-blue-700/60 max-w-lg mx-auto text-left text-xs font-mono space-y-3 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-blue-700 dark:text-blue-400">BARANGAY COUNCIL • QUEZON CITY</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">FORM BR-02</span>
              </div>
              
              <div className="space-y-1 pt-1">
                <p><strong>CLEARANCE NO  :</strong> <span className="text-blue-600 font-bold">{clearanceNo}</span></p>
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

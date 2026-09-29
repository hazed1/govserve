import React, { useState } from 'react';
import {
  Building,
  Upload,
  Camera,
  CheckCircle2,
  FileCheck,
  Eye,
  RefreshCw,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Download,
  Printer,
  Calendar,
  User,
  Check,
  X,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface UploadedDoc {
  name: string;
  size: string;
  previewUrl: string;
}

interface BarangayConstructionUploadWizardProps {
  onBackToPortal: () => void;
  onReturnToOverview: () => void;
  onAddNewApplication?: (name: string, type: string) => void;
}

export const BarangayConstructionUploadWizard: React.FC<BarangayConstructionUploadWizardProps> = ({
  onBackToPortal,
  onReturnToOverview,
  onAddNewApplication
}) => {
  const { user } = useAuth();

  // Current wizard step: 1 (Site Sketch), 2 (Lot Title / TCT), 3 (Neighbor Consent), 4 (Contractor ID), 5 (Review & Issue)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [endorsementNo, setEndorsementNo] = useState<string>('');

  // 4 Mandatory Photo Uploads
  const [sketchDoc, setSketchDoc] = useState<UploadedDoc | null>(null);
  const [titleDoc, setTitleDoc] = useState<UploadedDoc | null>(null);
  const [consentDoc, setConsentDoc] = useState<UploadedDoc | null>(null);
  const [contractorDoc, setContractorDoc] = useState<UploadedDoc | null>(null);

  // Applicant details (Auto-filled, friendly, no tedious typing needed)
  const [applicantName, setApplicantName] = useState<string>(user?.name || 'Engr. Jason Taccad');
  const [projectSite, setProjectSite] = useState<string>('Lot 14 Blk 8, Acacia St., Brgy. San Isidro, Quezon City');
  const [projectType, setProjectType] = useState<string>('2-Storey Residential Construction');

  // Preview modal
  const [previewDoc, setPreviewDoc] = useState<{ title: string; doc: UploadedDoc } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'sketch' | 'title' | 'consent' | 'contractor') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    const newDoc: UploadedDoc = {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      previewUrl: fakeUrl
    };

    if (target === 'sketch') setSketchDoc(newDoc);
    if (target === 'title') setTitleDoc(newDoc);
    if (target === 'consent') setConsentDoc(newDoc);
    if (target === 'contractor') setContractorDoc(newDoc);

    showToast(`✓ Uploaded ${file.name}`);
  };

  // Quick Test sample loader for fast testing
  const handleLoadSamplePhotos = () => {
    setSketchDoc({
      name: 'Site_Sketch_Architectural_Plan.jpg',
      size: '2.4 MB',
      previewUrl: '/government-logo.png'
    });
    setTitleDoc({
      name: 'Transfer_Certificate_Title_TCT_88192.jpg',
      size: '1.8 MB',
      previewUrl: '/government-logo.png'
    });
    setConsentDoc({
      name: 'Neighbor_Concurrence_Consent_Signed.jpg',
      size: '1.2 MB',
      previewUrl: '/government-logo.png'
    });
    setContractorDoc({
      name: 'Contractor_PRC_License_ID.jpg',
      size: '1.5 MB',
      previewUrl: '/government-logo.png'
    });
    showToast('✓ Sample photos loaded for testing!');
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedNo = `BCE-2025-${Math.floor(100000 + Math.random() * 900000)}`;
      setEndorsementNo(generatedNo);
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onAddNewApplication) {
        onAddNewApplication(applicantName, 'Barangay Construction Endorsement');
      }
      showToast('✓ Construction Endorsement officially issued!');
    }, 1200);
  };

  // Photo Upload Zone Helper
  const renderPhotoDropzone = (
    title: string,
    desc: string,
    doc: UploadedDoc | null,
    target: 'sketch' | 'title' | 'consent' | 'contractor',
    sampleName: string
  ) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Camera size={16} className="text-amber-600 dark:text-amber-400" />
              <span>{title}</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
            Photo Required
          </span>
        </div>

        {!doc ? (
          <label className="border-2 border-dashed border-amber-300 dark:border-amber-800/80 hover:border-amber-500 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50/70 transition-all cursor-pointer group">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileUpload(e, target)}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <Camera size={26} />
            </div>
            <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white">
              Take a Photo or Click to Upload Picture
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Supports JPG, PNG, Smartphone Photos, or Scanned Documents
            </p>
            <span className="mt-3 px-3 py-1 rounded-full bg-amber-600 text-white text-[10px] font-bold shadow-xs">
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
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                title="View Photo"
              >
                <Eye size={15} />
              </button>
              <label className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold transition-all cursor-pointer">
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
                  if (target === 'sketch') setSketchDoc(null);
                  if (target === 'title') setTitleDoc(null);
                  if (target === 'consent') setConsentDoc(null);
                  if (target === 'contractor') setContractorDoc(null);
                }}
                className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer"
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center space-x-2 animate-bounce">
          <Sparkles size={16} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Header with Title and Step Tracker */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <Building size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
                  Step {currentStep} of 5
                </span>
                <span className="text-xs text-slate-400 font-bold">100% Picture-Upload Filing</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                Barangay Construction Endorsement
              </h2>
            </div>
          </div>

          {!isSubmitted && (
            <button
              type="button"
              onClick={handleLoadSamplePhotos}
              className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Preload sample photos for fast testing"
            >
              <Sparkles size={14} />
              <span>Load Sample Photos</span>
            </button>
          )}
        </div>

        {/* Step Progress Bar */}
        {!isSubmitted && (
          <div className="grid grid-cols-5 gap-2">
            {[
              { step: 1, label: 'Site Sketch' },
              { step: 2, label: 'Lot Title' },
              { step: 3, label: 'Neighbor Consent' },
              { step: 4, label: 'Contractor ID' },
              { step: 5, label: 'Review & Issue' },
            ].map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all ${
                  currentStep === s.step
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
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

        {/* Wizard Content Based on Step */}
        {!isSubmitted ? (
          <div className="space-y-6 pt-2">
            {/* STEP 1: SITE SKETCH PLAN PHOTO */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in">
                {renderPhotoDropzone(
                  'Site Sketch Plan & Architectural Layout Photo',
                  'Take a clear photo or upload an image of the site sketch plan showing structural boundaries.',
                  sketchDoc,
                  'sketch',
                  'Site_Sketch_Plan.jpg'
                )}
                
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-black text-slate-700 dark:text-slate-300">Project Location:</span>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{projectSite}</p>
                </div>
              </div>
            )}

            {/* STEP 2: LOT TITLE / TCT PHOTO */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                {renderPhotoDropzone(
                  'Transfer Certificate of Title (TCT) or Tax Declaration Photo',
                  'Upload photo of proof of lot ownership, lease agreement, or latest Real Property Tax receipt.',
                  titleDoc,
                  'title',
                  'Lot_Title_TCT.jpg'
                )}

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-black text-slate-700 dark:text-slate-300">Property Owner / Declarant:</span>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{applicantName}</p>
                </div>
              </div>
            )}

            {/* STEP 3: NEIGHBOR CONSENT PHOTO */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                {renderPhotoDropzone(
                  'Adjacent Neighbors Concurrence & No-Objection Form Photo',
                  'Upload photo of signed concurrence forms from immediate left, right, and rear lot neighbors.',
                  consentDoc,
                  'consent',
                  'Neighbor_Consent_Signed.jpg'
                )}

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
                  <span className="font-black text-amber-900 dark:text-amber-300">Lupon / Barangay Verification Notice:</span>
                  <p className="text-amber-800 dark:text-amber-400 font-medium">
                    Neighbor signatures will be cross-checked during the scheduled Kagawad ocular site visit.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: CONTRACTOR / ENGINEER ID PHOTO */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in">
                {renderPhotoDropzone(
                  'Supervising Engineer or Contractor PRC License Photo',
                  'Upload photo of the registered Civil Engineer, Architect, or PCAB-licensed builder ID.',
                  contractorDoc,
                  'contractor',
                  'Contractor_PRC_License.jpg'
                )}

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-black text-slate-700 dark:text-slate-300">Project Type:</span>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{projectType}</p>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & ISSUE */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-900 dark:text-amber-300 tracking-wider">
                      Document Photo Checklist
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={13} /> 4 Required Photos Uploaded
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">1. Site Sketch</span>
                      <span className="font-bold text-slate-800 dark:text-white truncate block">{sketchDoc ? '✓ Uploaded' : 'Missing'}</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">2. Lot Title</span>
                      <span className="font-bold text-slate-800 dark:text-white truncate block">{titleDoc ? '✓ Uploaded' : 'Missing'}</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">3. Neighbor Consent</span>
                      <span className="font-bold text-slate-800 dark:text-white truncate block">{consentDoc ? '✓ Uploaded' : 'Missing'}</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">4. Contractor ID</span>
                      <span className="font-bold text-slate-800 dark:text-white truncate block">{contractorDoc ? '✓ Uploaded' : 'Missing'}</span>
                    </div>
                  </div>

                  <div className="border-t border-amber-200 dark:border-amber-800 pt-3 flex items-center justify-between text-xs sm:text-sm font-black">
                    <span className="text-slate-800 dark:text-white">Fixed Construction Regulatory Fee:</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400 text-base">₱800.00</span>
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

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 1 && !sketchDoc) {
                        showToast('Please upload the site sketch photo to proceed.');
                        return;
                      }
                      if (currentStep === 2 && !titleDoc) {
                        showToast('Please upload the lot title photo to proceed.');
                        return;
                      }
                      if (currentStep === 3 && !consentDoc) {
                        showToast('Please upload the neighbor consent photo to proceed.');
                        return;
                      }
                      if (currentStep === 4 && !contractorDoc) {
                        showToast('Please upload the contractor license photo to proceed.');
                        return;
                      }
                      setCurrentStep(prev => prev + 1);
                    }}
                    className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <span>Next Step →</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting || !sketchDoc || !titleDoc || !consentDoc || !contractorDoc}
                    onClick={handleSubmit}
                    className={`px-6 py-3.5 rounded-xl text-white text-xs sm:text-sm font-black shadow-lg transition-all flex items-center gap-2 ${
                      !sketchDoc || !titleDoc || !consentDoc || !contractorDoc
                        ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500'
                        : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30 cursor-pointer active:scale-[0.98]'
                    }`}
                  >
                    <ShieldCheck size={16} />
                    <span>{isSubmitting ? 'Processing Endorsement...' : 'Issue Construction Endorsement (₱800.00)'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ISSUED OFFICIAL CONSTRUCTION ENDORSEMENT CERTIFICATE */
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                Official Seal Generated
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                Barangay Construction Endorsement Issued!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Your construction site inspection has been verified. Present this authenticated digital endorsement alongside your City Building Permit application.
              </p>
            </div>

            {/* Official Certificate Card */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-amber-300 dark:border-amber-700/60 max-w-lg mx-auto text-left text-xs font-mono space-y-3 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-amber-700 dark:text-amber-400">QUEZON CITY LGU • BARANGAY COUNCIL</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Form BCE-01</span>
              </div>
              
              <div className="space-y-1 pt-1">
                <p><strong>ENDORSEMENT NO :</strong> <span className="text-amber-600 font-bold">{endorsementNo}</span></p>
                <p><strong>APPLICANT      :</strong> {applicantName}</p>
                <p><strong>PROJECT SITE   :</strong> {projectSite}</p>
                <p><strong>FEE ASSESSMENT :</strong> ₱800.00 (PAID)</p>
                <p><strong>INSPECTION DATE:</strong> Within 48 hours by Kagawad on Public Works</p>
                <p><strong>VALID UNTIL    :</strong> 180 Days from Issuance Date</p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                  <ShieldCheck size={14} />
                  <span>Digitally Authenticated by Punong Barangay</span>
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
                <span>Print Endorsement</span>
              </button>
              <button
                type="button"
                onClick={onReturnToOverview}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
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

      {/* Full Picture Preview Modal */}
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

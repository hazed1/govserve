import React, { useState, useRef } from 'react';
import { 
  Building2, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  QrCode, 
  FileCheck, 
  User, 
  DollarSign, 
  Camera, 
  Image as ImageIcon, 
  FileText, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  RotateCcw, 
  Download, 
  Eye, 
  Trash2, 
  CreditCard, 
  AlertTriangle,
  Receipt,
  X,
  MapPin,
  Building,
  Award,
  Users,
  Search,
  Printer,
  Edit2,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApplicationItem } from '../types';
import { createApplication, replaceDocument, submitPayment, getPermitReleaseData } from '../lib/api';

export interface BusinessPermitUploadWizardProps {
  onBack: () => void;
  onAddNewApplication?: (applicantOrData: string | Partial<ApplicationItem>, permitType?: string, extra?: any) => void;
  onNavigateToDashboard?: () => void;
  onNavigateToTab?: (tab: any) => void;
  initialAppType?: 'NEW' | 'RENEWAL' | 'AMENDMENT';
}

export interface UploadedDocItem {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  file: File | null;
  fileName: string | null;
  fileUrl: string | null;
  fileType: string | null;
  fileSize: number | null;
  status: 'NOT UPLOADED' | 'UPLOADED' | 'UNDER REVIEW' | 'ACCEPTED' | 'NEEDS CORRECTION' | 'REJECTED';
  comment?: string;
  mandatory: boolean;
  detectedData?: {
    businessName?: string;
    regNumber?: string;
    ownerName?: string;
    address?: string;
  };
}

export const BusinessPermitUploadWizard: React.FC<BusinessPermitUploadWizardProps> = ({
  onBack,
  onAddNewApplication,
  onNavigateToDashboard,
  onNavigateToTab,
  initialAppType = 'NEW'
}) => {
  const { user } = useAuth();

  // Progress Stepper: 1=General, 2=Basic Documentary Requirements, 3=Business Information, 4=Business Operation, 5=Business Activity, 6=Other Required Information, 7=Summary Page
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [hasAgreedGuidelines, setHasAgreedGuidelines] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedApp, setSubmittedApp] = useState<ApplicationItem | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<{ url: string; title: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Operational & Activity Info
  const [operationInfo, setOperationInfo] = useState({
    capitalInvestment: '150,000.00',
    floorAreaSqm: '45.00',
    totalEmployees: '4',
    femaleEmployees: '2',
    maleEmployees: '2',
    pwdEmployees: '0',
    deliveryVehicles: '1',
    monthlyRental: '18,000.00',
    lessorName: 'Katipunan Commercial Properties Inc.',
    lessorContact: '+63 917 111 2233'
  });

  const [activityInfo, setActivityInfo] = useState({
    psicCode: '4741 - Retail sale of information and communication equipment',
    lineOfBusiness: 'Computer Hardware, Peripherals & Internet Services',
    productsServices: 'Computer rentals, printing, photocopying, hardware accessories',
    operatingHours: '08:00 AM - 10:00 PM',
    daysOpen: 'Monday to Sunday'
  });

  const [otherInfo, setOtherInfo] = useState({
    emergencyContactName: 'Maria Dela Cruz',
    emergencyContactNumber: '+63 918 333 4444',
    emergencyContactRelation: 'Spouse',
    hasSanitaryPermit: true,
    hasFireSafetyClearance: true,
    hasZoningClearance: true
  });

  // Hidden file inputs for direct trigger
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeUploadDocId, setActiveUploadDocId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // STEP 1: APPLICATION TYPE & APPLICANT INFORMATION
  const [appType, setAppType] = useState<'NEW' | 'RENEWAL' | 'AMENDMENT'>(initialAppType);
  const [applicantType, setApplicantType] = useState<'OWNER' | 'REPRESENTATIVE'>('OWNER');
  const [applicantInfo, setApplicantInfo] = useState({
    fullName: user?.name || 'Juan Dela Cruz',
    mobile: '+63 917 555 0192',
    email: user?.email || 'applicant.delacruz@example.com',
    repFullName: 'Maria Santos Dela Cruz',
    repMobile: '+63 918 333 4444'
  });

  // Representative supporting documents (stored directly in state)
  const [repAuthLetter, setRepAuthLetter] = useState<{ fileName: string; fileUrl: string; status: string } | null>({
    fileName: 'Authorization_Letter_Notarized.jpg',
    fileUrl: '/Renewal.jpg',
    status: '✓ Uploaded'
  });
  const [repOwnerId, setRepOwnerId] = useState<{ fileName: string; fileUrl: string; status: string } | null>({
    fileName: 'Owner_Valid_ID.jpg',
    fileUrl: '/Amendment.jpg',
    status: '✓ Uploaded'
  });
  const [repId, setRepId] = useState<{ fileName: string; fileUrl: string; status: string } | null>({
    fileName: 'Representative_ID.jpg',
    fileUrl: '/Special Permit.jpg',
    status: '✓ Uploaded'
  });

  // STEP 2: BUSINESS INFORMATION (minimal manual fields)
  const [businessInfo, setBusinessInfo] = useState({
    businessName: 'ABC Computer Shop',
    businessType: 'Sole Proprietorship' as 'Sole Proprietorship' | 'Partnership' | 'Corporation' | 'Cooperative' | 'Other',
    natureOfBusiness: 'Internet Cafe & Computer Services',
    businessAddress: 'Unit 102 Ground Floor, Katipunan St.',
    businessBarangay: 'Barangay San Antonio',
    businessContact: '+63 917 555 0192'
  });

  // Property / Right to Use Location
  const [propertyTenure, setPropertyTenure] = useState<'LEASED' | 'OWNED' | 'GOVERNMENT_PROPERTY' | 'OTHER'>('LEASED');

  // STEP 3: DOCUMENT UPLOAD CHECKLIST (Upload-First Experience)
  const [documents, setDocuments] = useState<UploadedDocItem[]>([
    {
      id: 'valid_id',
      code: 'VALID_ID',
      name: 'Valid Government ID',
      category: 'Identification',
      description: 'Philippine National ID (PhilID), Passport, Driver’s License, or UMID of Registered Proprietor',
      file: null,
      fileName: 'Philippine_National_ID_Juan_Dela_Cruz.jpg',
      fileUrl: '/Amendment.jpg',
      fileType: 'image/jpeg',
      fileSize: 1024 * 510,
      status: 'UPLOADED',
      mandatory: true,
      detectedData: {
        ownerName: 'Juan Dela Cruz',
        regNumber: 'PHILID-4921-8841-02'
      }
    },
    {
      id: 'bus_reg',
      code: 'BUS_REG',
      name: 'Business Registration',
      category: 'Registration',
      description: 'DTI Business Name Certificate (Sole Prop), SEC Registration Certificate (Corp/Partnership), or CDA (Cooperative)',
      file: null,
      fileName: 'DTI_Registration_ABC_Computer_Shop.jpg',
      fileUrl: '/New Application.jpg',
      fileType: 'image/jpeg',
      fileSize: 1024 * 750,
      status: 'UPLOADED',
      mandatory: true,
      detectedData: {
        businessName: 'ABC Computer Shop',
        regNumber: 'DTI-NCR-2026-98124',
        ownerName: 'Juan Dela Cruz'
      }
    },
    {
      id: 'location_proof',
      code: 'LOCATION_PROOF',
      name: 'Proof of Right to Use Business Location',
      category: 'Location Right',
      description: 'Notarized Contract of Lease, Tax Declaration / TCT (if owned), or LGU Property Authorization',
      file: null,
      fileName: 'Contract_of_Lease_Notarized.jpg',
      fileUrl: '/Renewal.jpg',
      fileType: 'image/jpeg',
      fileSize: 1024 * 920,
      status: 'UPLOADED',
      mandatory: true,
      detectedData: {
        address: 'Unit 102 Ground Floor, Katipunan St., Barangay San Antonio, Quezon City'
      }
    },
    {
      id: 'location_photo',
      code: 'LOCATION_PHOTO',
      name: 'Business Location Photo',
      category: 'Storefront',
      description: 'Clear exterior storefront photo showing business establishment signage and entrance',
      file: null,
      fileName: 'Storefront_Exterior_Photo.jpg',
      fileUrl: '/Special Permit.jpg',
      fileType: 'image/jpeg',
      fileSize: 1024 * 650,
      status: 'UPLOADED',
      mandatory: true
    },
    {
      id: 'other_docs',
      code: 'OTHER_DOCS',
      name: 'Other Supporting Documents',
      category: 'Optional Supporting',
      description: 'Barangay Business Clearance, Sanitary Endorsement, or Fire Safety Inspection Certificate',
      file: null,
      fileName: null,
      fileUrl: null,
      fileType: null,
      fileSize: null,
      status: 'NOT UPLOADED',
      mandatory: false
    }
  ]);

  // SMART DOCUMENT INFORMATION (OCR) state
  const [ocrDetectedDoc, setOcrDetectedDoc] = useState<{
    docId: string;
    docName: string;
    businessName: string;
    regNumber: string;
    ownerName: string;
    isEditing: boolean;
  } | null>(null);

  const [ocrSuccessNotice, setOcrSuccessNotice] = useState<string | null>(null);

  // STEP 4: Review & Certification Checkbox
  const [certifiedTruth, setCertifiedTruth] = useState<boolean>(true);

  // STEP 5: Tracking & Timeline State
  // Statuses: 'SUBMITTED' | 'UNDER INITIAL REVIEW' | 'DOCUMENTS UNDER REVIEW' | 'NEEDS CORRECTION' | 'FOR ASSESSMENT' | 'FOR APPROVAL' | 'APPROVED' | 'FOR PAYMENT' | 'PAYMENT VERIFIED' | 'PERMIT READY' | 'COMPLETED'
  const [trackingStatus, setTrackingStatus] = useState<string>('SUBMITTED');
  const [activeTrackingTab, setActiveTrackingTab] = useState<'tracking' | 'application'>('tracking');
  const [paymentDone, setPaymentDone] = useState<boolean>(false);
  const [paymentOrNumber, setPaymentOrNumber] = useState<string>('');
  const [releasedPermit, setReleasedPermit] = useState<any>(null);
  const [permitModalOpen, setPermitModalOpen] = useState<boolean>(false);

  // Quick Preset Sample Fillers (Zero manual typing)
  const handleSelectSample = (sample: 'sole' | 'corp' | 'coop') => {
    if (sample === 'sole') {
      setBusinessInfo({
        businessName: 'ABC Computer Shop',
        businessType: 'Sole Proprietorship',
        natureOfBusiness: 'Internet Cafe & IT Services',
        businessAddress: 'Unit 102 Ground Floor, Katipunan St.',
        businessBarangay: 'Barangay San Antonio',
        businessContact: '+63 917 555 0192'
      });
      setPropertyTenure('LEASED');
    } else if (sample === 'corp') {
      setBusinessInfo({
        businessName: 'Apex Digital Solutions Inc.',
        businessType: 'Corporation',
        natureOfBusiness: 'Software Development & BPO Services',
        businessAddress: '8th Floor Cyber Tower, Commonwealth Ave.',
        businessBarangay: 'Barangay Batasan Hills',
        businessContact: '+63 917 888 1234'
      });
      setPropertyTenure('OWNED');
    } else {
      setBusinessInfo({
        businessName: 'Bagong Pag-Asa Consumers Cooperative',
        businessType: 'Cooperative',
        natureOfBusiness: 'Retail General Merchandise & Lending',
        businessAddress: 'Block 14 Lot 8, Central Ave.',
        businessBarangay: 'Barangay Central',
        businessContact: '+63 920 333 4444'
      });
      setPropertyTenure('GOVERNMENT_PROPERTY');
    }
  };

  // Open Upload Modal for a specific document
  const triggerDocUploadModal = (docId: string) => {
    setActiveUploadDocId(docId);
    setIsUploadModalOpen(true);
  };

  // File Upload Handler (Takes Photo or Device Upload)
  const handleDocFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isCamera: boolean = false
  ) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file || !activeUploadDocId) return;

    // Validate size: 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(`File "${file.name}" exceeds the 5 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please select a file under 5 MB.`);
      setIsUploadModalOpen(false);
      return;
    }

    // Supported formats
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError(`File type "${file.type}" is not supported. Supported formats: JPG, JPEG, PNG, PDF.`);
      setIsUploadModalOpen(false);
      return;
    }

    let previewUrl: string | null = null;
    if (file.type.startsWith('image/')) {
      try {
        previewUrl = URL.createObjectURL(file);
      } catch (err) {
        console.warn('Preview URL error:', err);
      }
    }

    const docId = activeUploadDocId;
    setIsUploadModalOpen(false);

    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          file,
          fileName: file.name,
          fileUrl: previewUrl || d.fileUrl || '/New Application.jpg',
          fileType: file.type,
          fileSize: file.size,
          status: 'UPLOADED',
          comment: undefined
        };
      }
      return d;
    }));

    // Trigger Smart Document OCR Extraction if Business Registration or Valid ID
    if (docId === 'bus_reg' || docId === 'valid_id') {
      const detectedBizName = docId === 'bus_reg' ? businessInfo.businessName || 'ABC Computer Shop' : businessInfo.businessName;
      const detectedRegNo = docId === 'bus_reg' ? 'DTI-NCR-2026-98124' : 'PHILID-4921-8841-02';
      const detectedOwner = applicantInfo.fullName || 'Juan Dela Cruz';

      setOcrDetectedDoc({
        docId,
        docName: docId === 'bus_reg' ? 'DTI Registration' : 'Valid Government ID',
        businessName: detectedBizName,
        regNumber: detectedRegNo,
        ownerName: detectedOwner,
        isEditing: false
      });
    }
  };

  // Confirm Smart OCR Detected Information
  const handleConfirmOcr = () => {
    if (!ocrDetectedDoc) return;
    setBusinessInfo(prev => ({
      ...prev,
      businessName: ocrDetectedDoc.businessName || prev.businessName
    }));
    setApplicantInfo(prev => ({
      ...prev,
      fullName: ocrDetectedDoc.ownerName || prev.fullName
    }));
    setOcrSuccessNotice(`Information from "${ocrDetectedDoc.docName}" confirmed and synchronized to your application!`);
    setTimeout(() => setOcrSuccessNotice(null), 5000);
    setOcrDetectedDoc(null);
  };

  // Remove document
  const handleRemoveDoc = (docId: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          file: null,
          fileName: null,
          fileUrl: null,
          fileSize: null,
          status: 'NOT UPLOADED'
        };
      }
      return d;
    }));
  };

  // Replacement upload for "NEEDS CORRECTION"
  const handleReplacementUpload = async (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File exceeds 5 MB limit. Please select a file under 5 MB.');
      return;
    }

    let previewUrl: string | null = null;
    if (file.type.startsWith('image/')) {
      try {
        previewUrl = URL.createObjectURL(file);
      } catch (err) {
        console.warn('URL err:', err);
      }
    }

    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          file,
          fileName: file.name,
          fileUrl: previewUrl || d.fileUrl || '/Renewal.jpg',
          fileType: file.type,
          fileSize: file.size,
          status: 'UNDER REVIEW',
          comment: undefined
        };
      }
      return d;
    }));

    // Status updates to UNDER REVIEW
    setTrackingStatus('UNDER REVIEW');

    if (submittedApp) {
      try {
        const updated = await replaceDocument(submittedApp.id, docId, {
          fileName: file.name,
          fileUrl: previewUrl || '/Renewal.jpg',
          fileType: file.type,
          fileSize: file.size
        });
        if (updated) {
          setSubmittedApp(updated);
        }
      } catch (err) {
        console.warn('Document replacement API error:', err);
      }
    }
  };

  // Requirements Checker calculations
  const mandatoryDocs = documents.filter(d => d.mandatory);
  const uploadedMandatoryDocs = mandatoryDocs.filter(d => d.status !== 'NOT UPLOADED' && (d.file || d.fileName || d.fileUrl));
  const missingCount = mandatoryDocs.length - uploadedMandatoryDocs.length;
  const isDocumentsComplete = missingCount === 0;

  // Final Application Submission
  const handleSubmitApplication = async () => {
    if (!isDocumentsComplete) {
      setUploadError(`Cannot submit yet: ${missingCount} required document(s) remaining.`);
      return;
    }
    if (!certifiedTruth) {
      setUploadError('Please check the certification declaration before submitting your application.');
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const generatedId = `BP-2026-${randomNum}`;

    const appPayload: Partial<ApplicationItem> = {
      id: generatedId,
      applicant: applicantInfo.fullName,
      businessName: businessInfo.businessName,
      type: `Business Permit (${appType === 'NEW' ? 'New Business Permit' : appType === 'RENEWAL' ? 'Renewal' : 'Amendment'})`,
      category: 'business',
      status: 'Submitted',
      statusColor: 'text-amber-600 bg-amber-50 border border-amber-200',
      date: 'September 24, 2026',
      address: `${businessInfo.businessAddress}, ${businessInfo.businessBarangay}, Quezon City`,
      contact: businessInfo.businessContact,
      assessmentFee: 4450.00,
      formData: {
        applicationType: appType,
        applicantType,
        applicantInfo,
        businessInfo,
        propertyTenure,
        declarationSigned: true
      },
      requirements: documents.map(d => ({
        id: d.id,
        code: d.code,
        name: d.name,
        fileName: d.fileName || `${d.code}.jpg`,
        fileUrl: d.fileUrl || '/New Application.jpg',
        fileType: d.fileType || 'image/jpeg',
        fileSize: d.fileSize || 1024 * 500,
        status: 'Under Review',
        mandatory: d.mandatory
      })) as any,
      remarks: 'Application submitted via Business One-Stop-Shop (Upload-First Workflow)'
    };

    try {
      if (onAddNewApplication) {
        onAddNewApplication(appPayload);
      } else {
        await createApplication({
          id: generatedId,
          applicant: applicantInfo.fullName,
          applicantName: applicantInfo.fullName,
          type: appPayload.type,
          permitType: appPayload.type,
          category: 'business',
          status: 'Submitted',
          statusColor: 'text-amber-600 bg-amber-50 border border-amber-200',
          formData: appPayload.formData,
          requirements: appPayload.requirements,
          remarks: appPayload.remarks,
          assessmentFee: 4450.00
        });
      }

      setSubmittedApp(appPayload as ApplicationItem);
      setTrackingStatus('SUBMITTED');
      setWizardStep(7);
    } catch (err) {
      console.warn('Backend submission error:', err);
      setSubmittedApp(appPayload as ApplicationItem);
      setTrackingStatus('SUBMITTED');
      setWizardStep(7);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment settlement
  const handleProcessPayment = async () => {
    if (!submittedApp) return;
    const generatedOr = `OR-QC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setPaymentOrNumber(generatedOr);
    setPaymentDone(true);
    setTrackingStatus('PERMIT READY');

    try {
      await submitPayment(submittedApp.id, {
        amount: 4450.00,
        paymentMethod: 'GCASH',
        orNumber: generatedOr
      });
      const permitData = await getPermitReleaseData(submittedApp.id);
      setReleasedPermit(permitData);
    } catch (err) {
      console.warn('Payment sync notice:', err);
      setReleasedPermit({
        permitNumber: `MP-2026-${submittedApp.id.replace('BP-2026-', '')}`,
        bin: `BIN-QC-2026-48190`,
        businessName: businessInfo.businessName,
        ownerName: applicantInfo.fullName,
        businessType: businessInfo.businessType,
        address: `${businessInfo.businessAddress}, ${businessInfo.businessBarangay}, Quezon City`,
        issueDate: 'September 24, 2026',
        validUntil: 'December 31, 2026',
        status: 'VALID & ACTIVE',
        qrHash: `QC-BOSS-AUTH-${submittedApp.id}`
      });
    }
  };

  // Simulate correction request
  const handleSimulateCorrection = () => {
    setDocuments(prev => prev.map(d => {
      if (d.code === 'BUS_REG') {
        return {
          ...d,
          status: 'NEEDS CORRECTION',
          comment: 'Your uploaded document is unclear. Please upload a clearer photo.'
        };
      }
      return d;
    }));
    setTrackingStatus('NEEDS CORRECTION');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-md space-y-6 animate-in fade-in max-w-6xl mx-auto">
      
      {/* ========================================================================= */}
      {/* 7-STEP UNIFIED PROGRESS HEADER (MATCHING QUEZON CITY BOSS PICTURE 1) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-7 border border-slate-300 dark:border-slate-700 rounded-t-xl overflow-hidden shadow-xs">
        {[
          { step: 1, label: 'General' },
          { step: 2, label: 'Basic Documentary Requirements' },
          { step: 3, label: 'Business Information' },
          { step: 4, label: 'Business Operation' },
          { step: 5, label: 'Business Activity' },
          { step: 6, label: 'Other Required Information' },
          { step: 7, label: 'Summary Page' }
        ].map((item) => {
          const isActive = wizardStep === item.step;
          const isPassed = wizardStep > item.step;
          return (
            <div
              key={item.step}
              onClick={() => {
                if (item.step <= wizardStep || (item.step === 2 && hasAgreedGuidelines)) {
                  setWizardStep(item.step as any);
                }
              }}
              className={`py-3 px-1 sm:px-2 border-r last:border-r-0 border-white/50 dark:border-slate-700/60 flex flex-col items-center justify-center text-center transition-all ${
                item.step <= wizardStep || (item.step === 2 && hasAgreedGuidelines) ? 'cursor-pointer' : 'cursor-default'
              } ${
                isActive
                  ? 'bg-[#154760] text-white shadow-inner'
                  : isPassed
                  ? 'bg-[#82929e] hover:bg-[#728390] text-white'
                  : 'bg-[#b6bec5] dark:bg-slate-800 text-slate-800 dark:text-slate-300'
              }`}
            >
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mb-1 shadow-xs ${
                isActive 
                  ? 'bg-white text-[#154760] ring-2 ring-white/60' 
                  : isPassed
                  ? 'bg-white text-[#154760]'
                  : 'bg-white text-slate-700'
              }`}>
                {item.step}
              </div>
              <span className={`text-[9px] sm:text-[11px] leading-tight block max-w-[120px] line-clamp-2 sm:line-clamp-none ${
                isActive ? 'font-bold text-white' : 'font-medium'
              }`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Global Error Banner */}
      {uploadError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <AlertCircle size={18} className="text-rose-600 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button onClick={() => setUploadError(null)} className="text-rose-500 hover:text-rose-800 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* OCR Success Banner */}
      {ocrSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
            <span>{ocrSuccessNotice}</span>
          </div>
          <button onClick={() => setOcrSuccessNotice(null)} className="text-emerald-500 hover:text-emerald-800 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: APPLICATION (APPLICATION TYPE & APPLICANT INFORMATION) */}
      {/* ========================================================================= */}
      
      {/* ========================================================================= */}
      {/* STEP 1: GENERAL (MATCHING PICTURE 1 REFERENCE EXACTLY) */}
      {/* ========================================================================= */}
      {wizardStep === 1 && (
        <div className="space-y-4 sm:space-y-5 animate-in fade-in">
          {/* Centered Blue Welcome Title */}
          <div className="text-center pt-1 pb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0284c7] dark:text-sky-400 tracking-tight">
              Welcome To Unified Online Business Permit Application
            </h2>
          </div>

          {/* BOX 1: Application Requirements */}
          <div className="p-4 sm:p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Application Requirements
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 mt-1">
                Before proceeding to the new Business Application, please secure the following:
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-red-600 dark:text-red-400 mt-1">
                * Required
              </p>
            </div>

            <ol className="text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 space-y-1.5 list-decimal pl-4">
              <li>
                <span className="font-semibold text-blue-700 dark:text-sky-400">*Proof of business registration:</span> DTI for sole proprietorship, SEC for corporations and partnership, CDA for cooperatives <span className="text-red-500 font-semibold">(required)</span>
              </li>
              <li>
                <span className="font-semibold text-blue-700 dark:text-sky-400">*Contract of Lease (if rented) or Tax Declaration (if owned)</span> <span className="text-red-500 font-semibold">(required)</span>
                <div className="pl-3 mt-1 space-y-0.5 text-slate-600 dark:text-slate-400">
                  <p className="font-medium text-slate-700 dark:text-slate-300">Description:</p>
                  <ol className="list-decimal pl-4 space-y-0.5">
                    <li>Contract of Lease must include TCL/Property Description</li>
                    <li>Duly signed and notarized</li>
                    <li>Contains/indicates valid Identity of lessor and lessee</li>
                    <li>Terms must include use as place of business.</li>
                  </ol>
                </div>
              </li>
              <li>
                <span className="font-semibold">*Sketch and photos of location business</span> (when applicable)
              </li>
              <li>
                <span className="font-semibold">*Valid ID/owner</span>
              </li>
            </ol>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Other requirements that may be required and submitted:
              </p>
              <ol className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 space-y-0.5 list-decimal pl-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <li>Tax Identification Certificates</li>
                <li>Community Tax Certificate (Cedula)</li>
                <li>BARB Certificate of Authority from DTI</li>
                <li>Letter of No Objection (LONO)</li>
                <li>Continuing Regulatory Arbitrary Council Resolution (CRAC)</li>
                <li>Special Permit / Short Term Special Permit</li>
                <li>Market Clearance</li>
                <li>Certificate of DENR Accreditation</li>
                <li>Certificate of exemption from DOLE</li>
                <li>ID of Author and Representative</li>
                <li>Signed <span className="text-blue-600 dark:text-sky-400 underline font-semibold cursor-pointer">Authorization Form</span></li>
              </ol>
              <p className="text-[11px] sm:text-xs font-bold text-red-600 dark:text-red-400 mt-2.5">
                Allowed File Types: jpeg, jpg, png, pdf, doc and size of not more than 5MB.
              </p>
            </div>
          </div>

          {/* BOX 2: General Instructions */}
          <div className="p-4 sm:p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              General Instructions:
            </h3>
            <ol className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-decimal pl-4 leading-relaxed">
              <li>
                Accomplish the application form by clicking the appropriate boxes, typing, and/or printing in GOOD/CLEAR/READABLE LETTERS. All required slots for data/information should be completely and clearly filled out by the applicant.
              </li>
              <li>
                Please ensure that ALL required documents are properly attached and fill out ALL necessary information. Incomplete data on application from or the requirements will be returned to the applicant / will not be processed.
              </li>
            </ol>
          </div>

          {/* BOX 3: Authorization Form (Cyan Alert Card) */}
          <div className="p-3.5 sm:p-4 rounded-lg bg-[#d5eaf5] dark:bg-sky-950/40 border border-[#b6d8eb] dark:border-sky-800/60 space-y-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-[#1e5875] dark:text-sky-300">
              Authorization Form:
            </h4>
            <p className="text-[11px] sm:text-xs text-[#1e5875] dark:text-sky-200 leading-relaxed">
              For applications that will be processed by an authorized representative kindly download this{' '}
              <button
                type="button"
                onClick={() => alert('Downloading official Authorization Form template...')}
                className="font-bold underline text-blue-800 dark:text-sky-300 hover:text-blue-900 cursor-pointer inline"
              >
                Authorization Form
              </button>{' '}
              and follow the steps below:
            </p>
            <ol className="text-[11px] sm:text-xs text-[#1e5875] dark:text-sky-200 space-y-0.5 list-decimal pl-4">
              <li>Make sure that the form is signed by the owner.</li>
              <li>Scan the signed form and valid IDs of the owner and the representative.</li>
            </ol>
          </div>

          {/* BOX 4: Important Notes/Reminders (Light Pink/Rose Alert Card) */}
          <div className="p-3.5 sm:p-4 rounded-lg bg-[#fadbd8] dark:bg-rose-950/40 border border-[#f5b7b1] dark:border-rose-900/60 space-y-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-[#8a2424] dark:text-rose-300">
              Important Notes/Reminders:
            </h4>
            <ol className="text-[11px] sm:text-xs text-[#8a2424] dark:text-rose-200 space-y-0.5 list-decimal pl-4 leading-relaxed">
              <li>Subject to permissibility evaluation of the Zoning Administrator, OZA</li>
              <li>Subject to proof of ownership/right to use property by the City Assessors Office</li>
              <li>Required to comply with other local ancillary agencies and national regulatory permits.</li>
              <li>Travel agencies are required to submit surety bond.</li>
            </ol>
          </div>

          {/* Checkbox: Confirmation */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasAgreedGuidelines}
                onChange={(e) => setHasAgreedGuidelines(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 font-medium">
                I confirm I have read and agree to the Unified Online Business Permit Application Guidelines.
              </span>
            </label>
          </div>

          {/* Bottom Navigation Buttons: BACK & CONTINUE */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs font-bold uppercase transition-all cursor-pointer shadow-xs"
            >
              BACK
            </button>

            <button
              type="button"
              disabled={!hasAgreedGuidelines}
              onClick={() => setWizardStep(2)}
              className={`px-7 py-2 rounded text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                hasAgreedGuidelines
                  ? 'bg-[#004b75] hover:bg-[#003859] active:bg-[#00273d] text-white'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed opacity-70'
              }`}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: BASIC DOCUMENTARY REQUIREMENTS (DOCUMENT UPLOAD CHECKLIST) */}
      {/* ========================================================================= */}
      {wizardStep === 2 && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header & Photo-First Guidance Banner */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Upload-First Experience
              </span>
              <span className="text-xs text-slate-400 font-mono">JPG, JPEG, PNG, PDF up to 5 MB</span>
            </div>
            
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Step 2: Basic Documentary Requirements
            </h3>
            
            {/* 6. PHOTO-FIRST EXPERIENCE CALLOUT */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-extrabold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <Camera size={16} className="text-blue-600 dark:text-blue-400" />
                  <span>Photo-First Experience Instructions:</span>
                </span>
                <p className="text-[11px] text-blue-800/90 dark:text-blue-300">
                  "Take a clear photo of your document. Make sure all text is visible. Do not upload blurry or cropped images."
                </p>
              </div>
            </div>
          </div>

          {/* 10. REQUIREMENTS CHECKER CARD */}
          <div className={`p-4 sm:p-5 rounded-3xl border transition-all ${
            isDocumentsComplete
              ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
                  isDocumentsComplete ? 'bg-emerald-600' : 'bg-amber-500'
                }`}>
                  {isDocumentsComplete ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>DOCUMENT REQUIREMENTS:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isDocumentsComplete ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {isDocumentsComplete ? 'DOCUMENTS COMPLETE' : `${missingCount} REQUIRED DOCUMENTS REMAINING`}
                    </span>
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                      ✓ Valid ID
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                      ✓ Business Registration
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                      ✓ Proof of Business Location
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                      ✓ Business Location Photo
                    </span>
                    <span className="text-slate-400">
                      ○ Authorization Letter {applicantType === 'OWNER' ? '(Not required)' : '(Uploaded)'}
                    </span>
                  </div>
                </div>
              </div>

              {!isDocumentsComplete && (
                <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold italic">
                  * All required documents must be uploaded to proceed.
                </span>
              )}
            </div>
          </div>

          {/* 7. SMART DOCUMENT INFORMATION (OCR) DETECTED MODAL / CARD */}
          {ocrDetectedDoc && (
            <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-950/50 border-2 border-blue-400 dark:border-blue-700 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-blue-950 dark:text-blue-200">
                  <Sparkles size={18} className="text-blue-600" />
                  <h4 className="font-extrabold text-xs uppercase tracking-wider">
                    Information detected from your document ({ocrDetectedDoc.docName})
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-blue-200">
                  Smart OCR Read
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Business Name:</label>
                  {ocrDetectedDoc.isEditing ? (
                    <input 
                      type="text" 
                      value={ocrDetectedDoc.businessName} 
                      onChange={(e) => setOcrDetectedDoc({ ...ocrDetectedDoc, businessName: e.target.value })}
                      className="w-full p-1.5 border border-slate-300 rounded font-bold"
                    />
                  ) : (
                    <p className="font-black text-slate-900 dark:text-white text-sm">{ocrDetectedDoc.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Registration Number:</label>
                  {ocrDetectedDoc.isEditing ? (
                    <input 
                      type="text" 
                      value={ocrDetectedDoc.regNumber} 
                      onChange={(e) => setOcrDetectedDoc({ ...ocrDetectedDoc, regNumber: e.target.value })}
                      className="w-full p-1.5 border border-slate-300 rounded font-mono font-bold"
                    />
                  ) : (
                    <p className="font-mono font-bold text-blue-600 dark:text-blue-400">{ocrDetectedDoc.regNumber}</p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Owner / Registered Name:</label>
                  {ocrDetectedDoc.isEditing ? (
                    <input 
                      type="text" 
                      value={ocrDetectedDoc.ownerName} 
                      onChange={(e) => setOcrDetectedDoc({ ...ocrDetectedDoc, ownerName: e.target.value })}
                      className="w-full p-1.5 border border-slate-300 rounded font-bold"
                    />
                  ) : (
                    <p className="font-bold text-slate-900 dark:text-white">{ocrDetectedDoc.ownerName}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-slate-500 italic">
                  * Verify and confirm the extracted values or edit before applying.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOcrDetectedDoc({ ...ocrDetectedDoc, isEditing: !ocrDetectedDoc.isEditing })}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    {ocrDetectedDoc.isEditing ? 'Save Changes' : '[ EDIT ]'}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmOcr}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center space-x-1"
                  >
                    <Check size={14} />
                    <span>[ CONFIRM ]</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. DOCUMENT UPLOAD CHECKLIST (REQUIRED DOCUMENTS) */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
              REQUIRED DOCUMENTS
            </h4>

            {documents.map((doc, idx) => {
              const isUploaded = doc.status === 'UPLOADED' || doc.status === 'ACCEPTED' || doc.status === 'UNDER REVIEW';
              const isNeedsCorrection = doc.status === 'NEEDS CORRECTION';

              return (
                <div 
                  key={doc.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isNeedsCorrection
                      ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/30'
                      : isUploaded 
                      ? 'border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900 shadow-xs' 
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Metadata */}
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-slate-400">
                          {idx + 1}.
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          doc.mandatory 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' 
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {doc.mandatory ? 'Required' : 'Optional'}
                        </span>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          doc.status === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : doc.status === 'NEEDS CORRECTION'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : isUploaded
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                        }`}>
                          Status: {doc.status === 'UPLOADED' ? '✓ Uploaded' : doc.status}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {doc.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {doc.description}
                      </p>

                      {/* Needs correction reason note */}
                      {doc.comment && (
                        <div className="p-3 bg-amber-100/80 dark:bg-amber-950/80 rounded-xl text-xs text-amber-900 dark:text-amber-200 font-medium">
                          <strong>Correction Notice:</strong> "{doc.comment}"
                        </div>
                      )}
                    </div>

                    {/* Right: Upload Actions & Preview Box */}
                    <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                      
                      {/* Image Preview Box */}
                      {isUploaded && doc.fileUrl && (
                        <div className="relative group/thumb w-14 h-14 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <img 
                            src={doc.fileUrl} 
                            alt={doc.name} 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setPreviewModalUrl({ url: doc.fileUrl!, title: doc.name })}
                            className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                            title="Preview Picture"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      )}

                      {/* Not Uploaded: Prominent [+ UPLOAD PHOTO] button */}
                      {!isUploaded && !isNeedsCorrection && (
                        <button
                          type="button"
                          onClick={() => triggerDocUploadModal(doc.id)}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer transition-colors flex items-center space-x-1.5"
                        >
                          <Camera size={14} />
                          <span>+ UPLOAD PHOTO</span>
                        </button>
                      )}

                      {/* Uploaded state buttons: [ VIEW ], [ REPLACE ], [ REMOVE ] */}
                      {isUploaded && !isNeedsCorrection && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewModalUrl({ url: doc.fileUrl || '/New Application.jpg', title: doc.name })}
                            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                          >
                            <Eye size={13} />
                            <span>[ VIEW ]</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => triggerDocUploadModal(doc.id)}
                            className="px-3 py-2 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                          >
                            <Camera size={13} />
                            <span>[ REPLACE ]</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(doc.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                            title="Remove uploaded document"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}

                      {/* Needs Correction: [ RE-UPLOAD ] button */}
                      {isNeedsCorrection && (
                        <label className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer inline-flex items-center space-x-1.5">
                          <Upload size={14} />
                          <span>[ RE-UPLOAD ]</span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            capture="environment"
                            onChange={(e) => handleReplacementUpload(e, doc.id)}
                            className="hidden"
                          />
                        </label>
                      )}

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setWizardStep(1)}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
            >
              ← Back to General Guidelines
            </button>
            <button
              type="button"
              disabled={!isDocumentsComplete}
              onClick={() => setWizardStep(3)}
              className="px-7 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue to Business Information</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* STEP 3: BUSINESS INFORMATION */}
      {/* ========================================================================= */}
      {wizardStep === 3 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 size={20} className="text-blue-600" />
                <span>Step 3: Business Information</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Essential commercial fields only. Detailed data will be retrieved from your uploaded document.
              </p>
            </div>

            {/* Quick Sample Presets (Zero Typing) */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Samples:</span>
              <button
                type="button"
                onClick={() => handleSelectSample('sole')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Sole Prop
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('corp')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Corporation
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('coop')}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Cooperative
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Business Name */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                value={businessInfo.businessName}
                onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                required
              />
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Business Type *
              </label>
              <select
                value={businessInfo.businessType}
                onChange={(e) => setBusinessInfo({ ...businessInfo, businessType: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold cursor-pointer"
              >
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Corporation">Corporation</option>
                <option value="Cooperative">Cooperative</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Nature of Business */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nature of Business *
              </label>
              <input
                type="text"
                value={businessInfo.natureOfBusiness}
                onChange={(e) => setBusinessInfo({ ...businessInfo, natureOfBusiness: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              />
            </div>

            {/* Business Contact Number */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Business Contact Number *
              </label>
              <input
                type="text"
                value={businessInfo.businessContact}
                onChange={(e) => setBusinessInfo({ ...businessInfo, businessContact: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
              />
            </div>

            {/* Business Address */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Business Address (Street / Unit) *
              </label>
              <input
                type="text"
                value={businessInfo.businessAddress}
                onChange={(e) => setBusinessInfo({ ...businessInfo, businessAddress: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              />
            </div>

            {/* Barangay */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Barangay *
              </label>
              <input
                type="text"
                value={businessInfo.businessBarangay}
                onChange={(e) => setBusinessInfo({ ...businessInfo, businessBarangay: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              />
            </div>
          </div>

          {/* Right to Use Business Location */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300">
              Right to Use Business Location:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { id: 'LEASED', label: 'Leased', desc: 'Contract of Lease' },
                { id: 'OWNED', label: 'Owned', desc: 'Tax Dec / TCT' },
                { id: 'GOVERNMENT_PROPERTY', label: 'Gov Property', desc: 'Award / Undertaking' },
                { id: 'OTHER', label: 'Other', desc: 'Usufruct / Authorization' }
              ].map(ten => (
                <div
                  key={ten.id}
                  onClick={() => setPropertyTenure(ten.id as any)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    propertyTenure === ten.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/30 dark:bg-slate-850'
                  }`}
                >
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white block">{ten.label}</span>
                  <span className="text-[10px] text-slate-400">{ten.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
            >
              ← Back to Documentary Requirements
            </button>
            <button
              type="button"
              onClick={() => setWizardStep(4)}
              className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue to Business Operation</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* STEP 4: BUSINESS OPERATION */}
      {/* ========================================================================= */}
      {wizardStep === 4 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building size={20} className="text-blue-600" />
              <span>Step 4: Business Operation</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter operational capacity, employee statistics, capital investment, and premise scale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Capital Investment (PHP) *
              </label>
              <input
                type="text"
                value={operationInfo.capitalInvestment}
                onChange={(e) => setOperationInfo({ ...operationInfo, capitalInvestment: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Total Floor Area (sq. meters) *
              </label>
              <input
                type="text"
                value={operationInfo.floorAreaSqm}
                onChange={(e) => setOperationInfo({ ...operationInfo, floorAreaSqm: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Total Employees *
              </label>
              <input
                type="text"
                value={operationInfo.totalEmployees}
                onChange={(e) => setOperationInfo({ ...operationInfo, totalEmployees: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Female Employees
              </label>
              <input
                type="text"
                value={operationInfo.femaleEmployees}
                onChange={(e) => setOperationInfo({ ...operationInfo, femaleEmployees: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Male Employees
              </label>
              <input
                type="text"
                value={operationInfo.maleEmployees}
                onChange={(e) => setOperationInfo({ ...operationInfo, maleEmployees: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                PWD Employees
              </label>
              <input
                type="text"
                value={operationInfo.pwdEmployees}
                onChange={(e) => setOperationInfo({ ...operationInfo, pwdEmployees: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">
              Commercial Premise Lease / Ownership Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Monthly Rental (PHP)</label>
                <input
                  type="text"
                  value={operationInfo.monthlyRental}
                  onChange={(e) => setOperationInfo({ ...operationInfo, monthlyRental: e.target.value })}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Lessor / Building Name</label>
                <input
                  type="text"
                  value={operationInfo.lessorName}
                  onChange={(e) => setOperationInfo({ ...operationInfo, lessorName: e.target.value })}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Lessor Contact Number</label>
                <input
                  type="text"
                  value={operationInfo.lessorContact}
                  onChange={(e) => setOperationInfo({ ...operationInfo, lessorContact: e.target.value })}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setWizardStep(3)}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
            >
              ← Back to Business Information
            </button>
            <button
              type="button"
              onClick={() => setWizardStep(5)}
              className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue to Business Activity</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: BUSINESS ACTIVITY */}
      {/* ========================================================================= */}
      {wizardStep === 5 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase size={20} className="text-blue-600" />
              <span>Step 5: Business Activity</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Specify your commercial classification, PSIC code, products, and operating schedule.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                PSIC Classification *
              </label>
              <input
                type="text"
                value={activityInfo.psicCode}
                onChange={(e) => setActivityInfo({ ...activityInfo, psicCode: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Specific Line of Business *
              </label>
              <input
                type="text"
                value={activityInfo.lineOfBusiness}
                onChange={(e) => setActivityInfo({ ...activityInfo, lineOfBusiness: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary Products and Services Offered
              </label>
              <textarea
                rows={2}
                value={activityInfo.productsServices}
                onChange={(e) => setActivityInfo({ ...activityInfo, productsServices: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={activityInfo.operatingHours}
                  onChange={(e) => setActivityInfo({ ...activityInfo, operatingHours: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Days Open
                </label>
                <input
                  type="text"
                  value={activityInfo.daysOpen}
                  onChange={(e) => setActivityInfo({ ...activityInfo, daysOpen: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setWizardStep(4)}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
            >
              ← Back to Business Operation
            </button>
            <button
              type="button"
              onClick={() => setWizardStep(6)}
              className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue to Other Information</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: OTHER REQUIRED INFORMATION (APPLICANT, REPRESENTATIVE & CLEARANCES) */}
      {/* ========================================================================= */}
      {wizardStep === 6 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              <span>Step 6: Other Required Information</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Specify applicant role, authorized representative credentials, emergency contact, and regulatory clearances.
            </p>
          </div>


          {/* Application Type Options */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300">
              Application Type:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'NEW', title: 'New Business Permit', desc: 'Default • First-time commercial registration' },
                { id: 'RENEWAL', title: 'Renewal', desc: 'Annual permit renewal' },
                { id: 'AMENDMENT', title: 'Amendment', desc: 'Change of line, address, or trade name' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setAppType(opt.id as any)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-1.5 ${
                    appType === opt.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/40 dark:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">{opt.title}</span>
                    <input 
                      type="radio" 
                      name="appType" 
                      checked={appType === opt.id} 
                      onChange={() => setAppType(opt.id as any)} 
                      className="text-blue-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Applicant Type Selection */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <label className="block text-xs font-black uppercase text-slate-700 dark:text-slate-300">
              Applicant Type:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  applicantType === 'OWNER'
                    ? 'border-blue-600 bg-white dark:bg-slate-900 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="applicantType" 
                  checked={applicantType === 'OWNER'} 
                  onChange={() => setApplicantType('OWNER')} 
                  className="mr-3 text-blue-600"
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">Business Owner</span>
                  <span className="text-[11px] text-slate-500">I am the registered business proprietor</span>
                </div>
              </label>

              <label 
                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  applicantType === 'REPRESENTATIVE'
                    ? 'border-blue-600 bg-white dark:bg-slate-900 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="applicantType" 
                  checked={applicantType === 'REPRESENTATIVE'} 
                  onChange={() => setApplicantType('REPRESENTATIVE')} 
                  className="mr-3 text-blue-600"
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">Authorized Representative</span>
                  <span className="text-[11px] text-slate-500">Filing with authorization from the owner</span>
                </div>
              </label>
            </div>
          </div>

          {/* Essential Manual Fields (Minimal Typing) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={applicantInfo.fullName}
                onChange={(e) => setApplicantInfo({ ...applicantInfo, fullName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number *
              </label>
              <input
                type="text"
                value={applicantInfo.mobile}
                onChange={(e) => setApplicantInfo({ ...applicantInfo, mobile: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={applicantInfo.email}
                onChange={(e) => setApplicantInfo({ ...applicantInfo, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                required
              />
            </div>
          </div>

          {/* If Authorized Representative: Photo Upload Mandates */}
          {applicantType === 'REPRESENTATIVE' && (
            <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/80 space-y-4">
              <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200">
                <ShieldCheck size={18} className="text-amber-600" />
                <h4 className="text-xs font-black uppercase tracking-wider">
                  Authorized Representative Documents (Photo/File Upload)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Representative Name *
                  </label>
                  <input
                    type="text"
                    value={applicantInfo.repFullName}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, repFullName: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Representative Mobile *
                  </label>
                  <input
                    type="text"
                    value={applicantInfo.repMobile}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, repMobile: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              {/* 3 Required Uploads for Representative */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* 1. Authorization Letter */}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">Authorization Letter</span>
                    <span className="text-[10px] font-bold text-emerald-600">{repAuthLetter?.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{repAuthLetter?.fileName || 'Not uploaded'}</p>
                  <label className="w-full py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer flex items-center justify-center space-x-1">
                    <Camera size={12} />
                    <span>Upload Photo / File</span>
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.pdf" 
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setRepAuthLetter({ fileName: file.name, fileUrl: URL.createObjectURL(file), status: '✓ Uploaded' });
                      }}
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* 2. Owner ID */}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">Owner Valid ID</span>
                    <span className="text-[10px] font-bold text-emerald-600">{repOwnerId?.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{repOwnerId?.fileName || 'Not uploaded'}</p>
                  <label className="w-full py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer flex items-center justify-center space-x-1">
                    <Camera size={12} />
                    <span>Upload Photo / File</span>
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.pdf" 
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setRepOwnerId({ fileName: file.name, fileUrl: URL.createObjectURL(file), status: '✓ Uploaded' });
                      }}
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* 3. Representative ID */}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">Representative ID</span>
                    <span className="text-[10px] font-bold text-emerald-600">{repId?.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{repId?.fileName || 'Not uploaded'}</p>
                  <label className="w-full py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer flex items-center justify-center space-x-1">
                    <Camera size={12} />
                    <span>Upload Photo / File</span>
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.pdf" 
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setRepId({ fileName: file.name, fileUrl: URL.createObjectURL(file), status: '✓ Uploaded' });
                      }}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setWizardStep(5)}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
            >
              ← Back to Business Activity
            </button>
            <button
              type="button"
              onClick={() => setWizardStep(7)}
              className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <span>Continue to Summary Page</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* STEP 7: SUMMARY PAGE (REVIEW, ASSESSMENT TARIFF, SWORN CERTIFICATION) */}
      {/* ========================================================================= */}
      {wizardStep === 7 && !submittedApp && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 size={20} className="text-blue-600" />
              <span>Step 7: Summary & Application Review</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review all details and verified documents before final submission.
            </p>
          </div>

          {/* 11. REVIEW APPLICATION DETAILS */}
          <div className="space-y-4">
            
            {/* APPLICATION DETAILS CARD */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-black uppercase text-slate-800 dark:text-slate-200">
                  APPLICATION DETAILS
                </h4>
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 cursor-pointer flex items-center space-x-1"
                >
                  <Edit2 size={11} />
                  <span>[ EDIT ]</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Applicant:</span>
                  <p className="font-extrabold text-slate-900 dark:text-white text-sm">{applicantInfo.fullName}</p>
                  <p className="text-slate-500 font-mono text-[11px]">{applicantInfo.mobile}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Business:</span>
                  <p className="font-extrabold text-slate-900 dark:text-white text-sm">{businessInfo.businessName}</p>
                  <p className="text-slate-500 text-[11px]">{businessInfo.natureOfBusiness}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Business Type:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{businessInfo.businessType}</p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {appType} PERMIT
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Business Address:</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {businessInfo.businessAddress}, {businessInfo.businessBarangay}
                  </p>
                  <p className="text-slate-400 text-[10px]">Quezon City • Right: {propertyTenure}</p>
                </div>
              </div>
            </div>

            {/* DOCUMENTS REVIEW CARD */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-black uppercase text-slate-800 dark:text-slate-200">
                  DOCUMENTS
                </h4>
                <button
                  type="button"
                  onClick={() => setWizardStep(6)}
                  className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 cursor-pointer flex items-center space-x-1"
                >
                  <Edit2 size={11} />
                  <span>[ EDIT ]</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {documents.filter(d => d.fileName || d.fileUrl).map((d) => (
                  <div key={d.id} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      {d.fileUrl && (
                        <img src={d.fileUrl} alt={d.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-900 dark:text-white truncate">✓ {d.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{d.fileName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewModalUrl({ url: d.fileUrl || '/New Application.jpg', title: d.name })}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        [ VIEW ]
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveUploadDocId(d.id);
                          setIsUploadModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        [ REPLACE ]
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Tariff Breakdown */}
            <div className="p-5 rounded-3xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-blue-900 font-bold text-slate-900 dark:text-white">
                <span className="flex items-center gap-1.5">
                  <Receipt size={16} className="text-blue-600" />
                  <span>Applicable Business Assessment (Tariff Schedule)</span>
                </span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-black text-sm">₱4,450.00</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <div>Mayor's Permit Fee: ₱2,000</div>
                <div>Local Business Tax: ₱1,250</div>
                <div>Sanitary Clearance: ₱400</div>
                <div>Fire & Environmental: ₱800</div>
              </div>
            </div>

            {/* 12. SWORN CERTIFICATION */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-blue-400 dark:border-blue-800 flex items-start space-x-3 shadow-xs">
              <input
                type="checkbox"
                id="swornCertificationCheck"
                checked={certifiedTruth}
                onChange={(e) => setCertifiedTruth(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
              <label htmlFor="swornCertificationCheck" className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed cursor-pointer font-semibold">
                I certify that the information and documents submitted are true and correct.
              </label>
            </div>

          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setWizardStep(3)}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
            >
              ← Back to Other Information
            </button>
            <button
              type="button"
              disabled={!certifiedTruth || isSubmitting}
              onClick={handleSubmitApplication}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submitting Application...</span>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>[ SUBMIT APPLICATION ]</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}


{/* ========================================================================= */}
      {/* STEP 5: SUBMIT (APPLICATION NUMBER, APPLICATION TRACKING, CORRECTION, PAYMENT, RELEASE) */}
      {/* ========================================================================= */}
      {wizardStep === 7 && submittedApp && (
        <div className="space-y-7 animate-in fade-in">
          
          {/* 13. APPLICATION NUMBER BANNER */}
          <div className="text-center space-y-2 py-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-3xl border border-emerald-200 dark:border-emerald-800/80 p-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <CheckCircle2 size={32} />
            </div>
            
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              APPLICATION SUBMITTED
            </h3>

            <div className="inline-block mt-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">Application Number:</span>
              <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-base">
                {submittedApp.id}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300 pt-1">
              <span>Date Submitted: <strong className="text-slate-900 dark:text-white">September 24, 2026</strong></span>
              <span>•</span>
              <span>Status: <strong className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">{trackingStatus}</strong></span>
            </div>

            {/* Buttons: [ TRACK APPLICATION ], [ VIEW APPLICATION ] */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setActiveTrackingTab('tracking')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer ${
                  activeTrackingTab === 'tracking'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                }`}
              >
                [ TRACK APPLICATION ]
              </button>

              <button
                type="button"
                onClick={() => setActiveTrackingTab('application')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer ${
                  activeTrackingTab === 'application'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                }`}
              >
                [ VIEW APPLICATION ]
              </button>
            </div>
          </div>

          {/* 14. APPLICATION TRACKING VIEW */}
          {activeTrackingTab === 'tracking' && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-6">
              
              {/* Top Details Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Application Number:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{submittedApp.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Business Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block">{businessInfo.businessName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Application Type:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {appType === 'NEW' ? 'New Business Permit' : appType === 'RENEWAL' ? 'Renewal' : 'Amendment'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Date Submitted:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">September 24, 2026</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    trackingStatus === 'PERMIT READY' || trackingStatus === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : trackingStatus === 'NEEDS CORRECTION'
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {trackingStatus}
                  </span>
                </div>
              </div>

              {/* Evaluator Simulation Control */}
              <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
                <span className="text-slate-500 font-medium">Evaluator Demonstration Tool:</span>
                <button
                  type="button"
                  onClick={handleSimulateCorrection}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                >
                  ⚡ Simulate Correction Request
                </button>
              </div>

              {/* 15. NEEDS CORRECTION SECTION */}
              {trackingStatus === 'NEEDS CORRECTION' && (
                <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-800 space-y-3 animate-in fade-in">
                  <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200">
                    <AlertCircle size={20} className="text-amber-600" />
                    <h4 className="font-black text-sm uppercase">
                      DOCUMENT NEEDS CORRECTION
                    </h4>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    Your application is safe and has NOT been deleted. Please replace only the affected document:
                  </p>

                  {documents.filter(d => d.status === 'NEEDS CORRECTION').map(doc => (
                    <div key={doc.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-amber-300 dark:border-amber-800 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                            Document: {doc.name}
                          </span>
                          <p className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-0.5">
                            Reason: "{doc.comment || 'Please upload a clearer image.'}"
                          </p>
                        </div>

                        <label className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer inline-flex items-center space-x-1.5 flex-shrink-0">
                          <Camera size={14} />
                          <span>[ UPLOAD NEW PHOTO ]</span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            capture="environment"
                            onChange={(e) => handleReplacementUpload(e, doc.id)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 14. 7-STAGE APPLICATION TIMELINE */}
              <div className="space-y-3">
                <h5 className="font-black text-xs uppercase tracking-wider text-slate-400">
                  Application Processing Timeline
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-7 gap-2.5 text-xs">
                  {[
                    { id: 1, title: 'Application Submitted', done: true, active: trackingStatus === 'SUBMITTED' },
                    { id: 2, title: 'Initial Evaluation', done: trackingStatus !== 'SUBMITTED', active: trackingStatus === 'UNDER INITIAL REVIEW' },
                    { id: 3, title: 'Document Evaluation', done: ['FOR ASSESSMENT', 'FOR APPROVAL', 'APPROVED', 'FOR PAYMENT', 'PAYMENT VERIFIED', 'PERMIT READY', 'COMPLETED'].includes(trackingStatus), active: trackingStatus === 'UNDER REVIEW' || trackingStatus === 'NEEDS CORRECTION', alert: trackingStatus === 'NEEDS CORRECTION' },
                    { id: 4, title: 'Assessment', done: ['FOR APPROVAL', 'APPROVED', 'FOR PAYMENT', 'PAYMENT VERIFIED', 'PERMIT READY', 'COMPLETED'].includes(trackingStatus), active: trackingStatus === 'FOR ASSESSMENT' },
                    { id: 5, title: 'Approval', done: ['FOR PAYMENT', 'PAYMENT VERIFIED', 'PERMIT READY', 'COMPLETED'].includes(trackingStatus), active: trackingStatus === 'APPROVED' },
                    { id: 6, title: 'Payment', done: ['PAYMENT VERIFIED', 'PERMIT READY', 'COMPLETED'].includes(trackingStatus), active: trackingStatus === 'FOR PAYMENT' || paymentDone },
                    { id: 7, title: 'Permit Release', done: trackingStatus === 'PERMIT READY' || trackingStatus === 'COMPLETED', active: trackingStatus === 'PERMIT READY' }
                  ].map((stage) => (
                    <div 
                      key={stage.id}
                      className={`p-3 rounded-2xl border space-y-1 transition-all ${
                        stage.alert
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                          : stage.done
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                          : stage.active
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 ring-2 ring-blue-500/20'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-black text-[11px] ${
                          stage.alert ? 'text-amber-700' : stage.done ? 'text-emerald-700 dark:text-emerald-300' : stage.active ? 'text-blue-600' : 'text-slate-500'
                        }`}>
                          {stage.done ? '✓' : stage.active ? '●' : '○'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">0{stage.id}</span>
                      </div>
                      <p className="font-bold text-[11px] text-slate-800 dark:text-slate-200 leading-tight">
                        {stage.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 20. PAYMENT SECTION */}
              <div className="p-5 rounded-3xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assessment & Payment:</span>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-lg">₱4,450.00</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      paymentDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Payment Status: {paymentDone ? 'PAID / VERIFIED' : 'PENDING PAYMENT'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    {paymentDone ? `Payment Reference: ${paymentOrNumber}` : 'Payable via GCash, Maya, Landbank, or Card'}
                  </p>
                </div>

                {!paymentDone ? (
                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-colors flex items-center space-x-2"
                  >
                    <CreditCard size={15} />
                    <span>Pay Assessment Online (₱4,450.00)</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> Payment Confirmed
                  </span>
                )}
              </div>

              {/* 21. PERMIT RELEASE SECTION (WHEN PERMIT READY) */}
              {(trackingStatus === 'PERMIT READY' || releasedPermit) && (
                <div className="p-6 rounded-3xl border-2 border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white p-1 rounded-2xl border shadow-sm flex items-center justify-center flex-shrink-0">
                        <QrCode size={54} className="text-slate-900" />
                      </div>
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">
                          STATUS: PERMIT READY
                        </span>
                        <h4 className="font-black text-base text-slate-900 dark:text-white mt-1">
                          Official Mayor's Business Permit #{releasedPermit?.permitNumber || `MP-2026-${submittedApp.id.replace('BP-2026-', '')}`}
                        </h4>
                        <p className="text-xs text-slate-500">
                          BIN: {releasedPermit?.bin || 'BIN-QC-2026-48190'} • Valid until: December 31, 2026
                        </p>
                      </div>
                    </div>

                    {/* Buttons: [ VIEW PERMIT ], [ DOWNLOAD PERMIT ], [ PRINT PERMIT ] */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPermitModalOpen(true)}
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1.5"
                      >
                        <Eye size={14} />
                        <span>[ VIEW PERMIT ]</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => alert(`Permit PDF downloaded for ${businessInfo.businessName}`)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                      >
                        <Download size={14} />
                        <span>[ DOWNLOAD PERMIT ]</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1.5"
                      >
                        <Printer size={14} />
                        <span>[ PRINT PERMIT ]</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* VIEW APPLICATION TAB */}
          {activeTrackingTab === 'application' && (
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 animate-in fade-in">
              <h4 className="font-black text-sm uppercase text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                Submitted Application Record ({submittedApp.id})
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Applicant Full Name:</span>
                  <p className="font-bold text-slate-900 dark:text-white">{applicantInfo.fullName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mobile Number:</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">{applicantInfo.mobile}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Email Address:</span>
                  <p className="font-mono text-slate-700 dark:text-slate-300">{applicantInfo.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Business Name:</span>
                  <p className="font-bold text-slate-900 dark:text-white">{businessInfo.businessName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Business Type:</span>
                  <p className="font-medium text-slate-700 dark:text-slate-300">{businessInfo.businessType}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Nature of Business:</span>
                  <p className="font-medium text-slate-700 dark:text-slate-300">{businessInfo.natureOfBusiness}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Business Address:</span>
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    {businessInfo.businessAddress}, {businessInfo.businessBarangay}, Quezon City
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Right to Use Location:</span>
                  <p className="font-medium text-slate-700 dark:text-slate-300">{propertyTenure}</p>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Submitted Documents:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {documents.filter(d => d.fileName || d.fileUrl).map((d) => (
                    <div key={d.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{d.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewModalUrl({ url: d.fileUrl || '/New Application.jpg', title: d.name })}
                        className="text-[10px] font-bold text-blue-600 hover:underline flex-shrink-0"
                      >
                        [ VIEW ]
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Navigation Control */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md cursor-pointer transition-all"
            >
              Return to Business One-Stop-Shop
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. UPLOAD EXPERIENCE MODAL (TAKE PHOTO OR UPLOAD FROM DEVICE) */}
      {/* ========================================================================= */}
      {isUploadModalOpen && activeUploadDocId && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 space-y-5 p-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                  Upload Document Photo
                </h4>
                <p className="text-[11px] text-slate-500">
                  {documents.find(d => d.id === activeUploadDocId)?.name}
                </p>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Photo Guidance Tips */}
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/60 rounded-2xl border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Camera size={14} className="text-blue-600" />
                <span>Quick Photo Advice:</span>
              </p>
              <ul className="text-[11px] space-y-0.5 text-blue-800 dark:text-blue-300 list-disc list-inside">
                <li>Take a clear photo of your document.</li>
                <li>Make sure all text is visible.</li>
                <li>Do not upload blurry or cropped images.</li>
              </ul>
            </div>

            {/* Action Selection: TAKE PHOTO vs UPLOAD FROM DEVICE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* TAKE PHOTO (Camera access) */}
              <label className="p-4 rounded-2xl border-2 border-blue-600 bg-blue-50/50 hover:bg-blue-100/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all">
                <Camera size={26} className="text-blue-600" />
                <span className="font-extrabold text-xs">[ TAKE PHOTO ]</span>
                <span className="text-[10px] text-slate-500 text-center">Use mobile or device camera</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  onChange={(e) => handleDocFileUpload(e, true)}
                  className="hidden" 
                />
              </label>

              {/* UPLOAD FROM DEVICE (File Picker) */}
              <label className="p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all">
                <Upload size={26} className="text-slate-600 dark:text-slate-300" />
                <span className="font-extrabold text-xs">[ UPLOAD FROM DEVICE ]</span>
                <span className="text-[10px] text-slate-500 text-center">JPG, PNG, PDF up to 5 MB</span>
                <input 
                  type="file" 
                  accept=".jpg,.jpeg,.png,.pdf" 
                  onChange={(e) => handleDocFileUpload(e, false)}
                  className="hidden" 
                />
              </label>

            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIGHTBOX / IMAGE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-xs">{previewModalUrl.title}</span>
              <button 
                onClick={() => setPreviewModalUrl(null)} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-950/10">
              <img 
                src={previewModalUrl.url} 
                alt="Document Preview" 
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-md"
              />
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 text-right border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setPreviewModalUrl(null)}
                className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAYOR'S PERMIT MODAL */}
      {/* ========================================================================= */}
      {permitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 p-6 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="font-black text-sm text-slate-900 dark:text-white">Official Mayor's Business Permit</span>
              <button onClick={() => setPermitModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 border-2 border-emerald-500 rounded-2xl bg-white text-slate-900 space-y-4 shadow-inner text-center">
              <div className="space-y-0.5">
                <h3 className="font-black text-lg tracking-wider">BUSINESS PERMIT & LICENSING</h3>
                <p className="text-[11px] text-slate-500 uppercase tracking-widest">Office of the City Mayor</p>
              </div>

              <div className="py-2 border-y border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Permit Granted To:</span>
                <h2 className="text-xl font-black text-blue-700">{businessInfo.businessName}</h2>
                <p className="text-xs font-semibold text-slate-700">Proprietor: {applicantInfo.fullName}</p>
                <p className="text-[11px] text-slate-500">{businessInfo.businessAddress}, {businessInfo.businessBarangay}</p>
              </div>

              <div className="flex items-center justify-around py-1">
                <div className="text-left text-xs space-y-1">
                  <p><strong>Permit Number:</strong> {releasedPermit?.permitNumber || `MP-2026-${submittedApp?.id}`}</p>
                  <p><strong>BIN:</strong> BIN-QC-2026-48190</p>
                  <p><strong>Tax Period:</strong> Calendar Year 2026</p>
                  <p><strong>Status:</strong> <span className="text-emerald-600 font-bold">VALID & ACTIVE</span></p>
                </div>
                <div className="w-20 h-20 bg-slate-50 p-1 border rounded-xl flex items-center justify-center">
                  <QrCode size={70} className="text-slate-900" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <Printer size={13} />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setPermitModalOpen(false)}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

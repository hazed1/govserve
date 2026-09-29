import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Download,
  Calendar,
  User,
  X,
  Sparkles,
  Award,
  Shield,
  ShieldCheck,
  Layers,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Building,
  HelpCircle,
  Hash,
  MapPin,
  Users,
  Banknote,
  Camera,
  Home,
  Eye,
  Trash2,
  RefreshCw,
  Printer,
  Check,
  QrCode,
  FileCheck,
  AlertCircle,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Sliders,
  File,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './ui/LanguageToggle';
import { TabType, ApplicationItem } from '../types';
import { createApplication, updateApplicationStatus } from '../lib/api';

export interface UploadedDoc {
  id: string;
  name: string;
  size: string;
  type: string;
  previewUrl: string;
  uploadDate: string;
  isBlurry?: boolean;
  status: 'uploaded' | 'verified' | 'needs_replacement';
}

export interface BarangayApplicationRecord {
  id: string;
  refNumber: string;
  applicantName: string;
  address: string;
  contactNumber: string;
  email: string;
  purpose: string;
  customPurpose?: string;
  status:
    | 'SUBMITTED'
    | 'DOCUMENT REVIEW'
    | 'FOR VERIFICATION'
    | 'PROCESSING'
    | 'APPROVED'
    | 'READY FOR RELEASE'
    | 'NEEDS CORRECTION'
    | 'REJECTED';
  dateSubmitted: string;
  estimatedTime: string;
  documents: {
    validId?: UploadedDoc | null;
    proofOfResidency?: UploadedDoc | null;
    cedula?: UploadedDoc | null;
    endorsement?: UploadedDoc | null;
    endorsementNotApplicable?: boolean;
  };
  remarks?: string;
  correctionRequestedDoc?: 'proofOfResidency' | 'validId' | 'cedula' | 'endorsement' | null;
  reviewedBy?: string;
}

const STORAGE_KEY = 'govserve_barangay_clearance_applications_v1';

// Seed Initial Mock Applications for rich Admin and Tracking Experience
const INITIAL_APPLICATIONS: BarangayApplicationRecord[] = [
  {
    id: 'brgy-app-1',
    refNumber: 'BC-QC-2026-08129',
    applicantName: 'Juan Miguel Dela Cruz',
    address: 'Block 12 Lot 4, Dahlia St., Brgy. Fairview, Quezon City',
    contactNumber: '+63 917 555 1234',
    email: 'juan.delacruz@example.com',
    purpose: 'Employment',
    status: 'READY FOR RELEASE',
    dateSubmitted: 'Sep 28, 2026',
    estimatedTime: 'Ready for Release',
    documents: {
      validId: {
        id: 'doc-id-1',
        name: 'Philippine_National_ID_JuanDelaCruz.jpg',
        size: '1.8 MB',
        type: 'image/jpeg',
        previewUrl: '/New Application.jpg',
        uploadDate: 'Sep 28, 2026',
        status: 'verified'
      },
      proofOfResidency: {
        id: 'doc-res-1',
        name: 'Meralco_Electric_Bill_August2026.pdf',
        size: '2.4 MB',
        type: 'application/pdf',
        previewUrl: '/Renewal.jpg',
        uploadDate: 'Sep 28, 2026',
        status: 'verified'
      },
      cedula: {
        id: 'doc-ctc-1',
        name: 'Cedula_CTC_2026_CC20248810.pdf',
        size: '1.2 MB',
        type: 'application/pdf',
        previewUrl: '/Special Permit.jpg',
        uploadDate: 'Sep 28, 2026',
        status: 'verified'
      },
      endorsement: null,
      endorsementNotApplicable: true
    },
    remarks: 'All documents verified with clean Lupon record. Official Barangay Clearance ready.',
    reviewedBy: 'Hon. Corazon C. Dizon'
  },
  {
    id: 'brgy-app-2',
    refNumber: 'BC-QC-2026-08130',
    applicantName: 'Maria Theresa Santos',
    address: 'Unit 301, San Antonio Residences, Brgy. Batasan Hills, Quezon City',
    contactNumber: '+63 918 888 4321',
    email: 'maria.santos@example.com',
    purpose: 'Business',
    status: 'NEEDS CORRECTION',
    dateSubmitted: 'Sep 29, 2026',
    estimatedTime: 'Pending Applicant Action',
    documents: {
      validId: {
        id: 'doc-id-2',
        name: 'UMID_Card_MariaSantos.jpg',
        size: '2.1 MB',
        type: 'image/jpeg',
        previewUrl: '/Amendment.jpg',
        uploadDate: 'Sep 29, 2026',
        status: 'verified'
      },
      proofOfResidency: {
        id: 'doc-res-2',
        name: 'Water_Bill_Maynilad_Blurry.jpg',
        size: '1.1 MB',
        type: 'image/jpeg',
        previewUrl: '/New Application.jpg',
        uploadDate: 'Sep 29, 2026',
        isBlurry: true,
        status: 'needs_replacement'
      },
      cedula: {
        id: 'doc-ctc-2',
        name: 'Cedula_CTC_2026_CC20249912.pdf',
        size: '1.5 MB',
        type: 'application/pdf',
        previewUrl: '/Renewal.jpg',
        uploadDate: 'Sep 29, 2026',
        status: 'verified'
      },
      endorsement: {
        id: 'doc-end-2',
        name: 'HOA_Commercial_Endorsement.pdf',
        size: '1.9 MB',
        type: 'application/pdf',
        previewUrl: '/Special Permit.jpg',
        uploadDate: 'Sep 29, 2026',
        status: 'verified'
      },
      endorsementNotApplicable: false
    },
    remarks: 'Action Required: Please replace Proof of Residency. The uploaded water bill is blurry and address is unreadable.',
    correctionRequestedDoc: 'proofOfResidency',
    reviewedBy: 'Barangay Officer Roberto'
  },
  {
    id: 'brgy-app-3',
    refNumber: 'BC-QC-2026-08131',
    applicantName: 'Ferdinand Gomez Ramos',
    address: '45 Commonwealth Ave, Brgy. Commonwealth, Quezon City',
    contactNumber: '+63 920 123 7890',
    email: 'ferdinand.ramos@example.com',
    purpose: 'School Requirement',
    status: 'FOR VERIFICATION',
    dateSubmitted: 'Sep 30, 2026',
    estimatedTime: '2 - 4 hours',
    documents: {
      validId: {
        id: 'doc-id-3',
        name: 'Drivers_License_LTO_Ramos.jpg',
        size: '2.5 MB',
        type: 'image/jpeg',
        previewUrl: '/Amendment.jpg',
        uploadDate: 'Sep 30, 2026',
        status: 'verified'
      },
      proofOfResidency: {
        id: 'doc-res-3',
        name: 'Lease_Contract_Notarized_2026.pdf',
        size: '3.1 MB',
        type: 'application/pdf',
        previewUrl: '/Renewal.jpg',
        uploadDate: 'Sep 30, 2026',
        status: 'verified'
      },
      cedula: {
        id: 'doc-ctc-3',
        name: 'Cedula_CTC_2026_CC20251122.pdf',
        size: '1.4 MB',
        type: 'application/pdf',
        previewUrl: '/Special Permit.jpg',
        uploadDate: 'Sep 30, 2026',
        status: 'verified'
      },
      endorsement: null,
      endorsementNotApplicable: true
    },
    remarks: 'Under Lupon Tagapamayapa dispute record check and address verification.',
    reviewedBy: 'Hon. Danilo Morales'
  }
];

interface BarangayClearanceApplicationSystemProps {
  onBack?: () => void;
  onNavigateToTab?: (tab: TabType | string) => void;
  onAddNewApplication?: (applicantName: string, permitType: string) => void;
  initialMode?: 'apply' | 'track' | 'admin';
}

export const BarangayClearanceApplicationSystem: React.FC<BarangayClearanceApplicationSystemProps> = ({
  onBack,
  onNavigateToTab,
  onAddNewApplication,
  initialMode = 'apply'
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isAdmin = user?.role === 'admin';

  // Navigation mode
  const [activeView, setActiveView] = useState<'apply' | 'track' | 'admin' | 'confirmation'>(
    isAdmin ? 'admin' : initialMode
  );

  // Application Storage
  const [applications, setApplications] = useState<BarangayApplicationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_APPLICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {
      console.warn('Failed to save barangay applications:', e);
    }
  }, [applications]);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Preview Modal State for Admin & Citizen
  const [previewDoc, setPreviewDoc] = useState<{ title: string; doc: UploadedDoc } | null>(null);

  // -------------------------------------------------------------
  // APPLICATION WIZARD STATE (STEPS 1 - 6)
  // -------------------------------------------------------------
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastSubmittedApp, setLastSubmittedApp] = useState<BarangayApplicationRecord | null>(null);

  // Step 1: Valid Government ID
  const [idDoc, setIdDoc] = useState<UploadedDoc | null>(null);
  const [ocrScanning, setOcrScanning] = useState<boolean>(false);
  const [ocrSuccess, setOcrSuccess] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('09175559988');
  const [emailAddress, setEmailAddress] = useState<string>(user?.email || '');

  // Step 2: Proof of Residency
  const [residencyDoc, setResidencyDoc] = useState<UploadedDoc | null>(null);

  // Step 3: Cedula / CTC
  const [cedulaDoc, setCedulaDoc] = useState<UploadedDoc | null>(null);

  // Step 4: Barangay Endorsement
  const [endorsementDoc, setEndorsementDoc] = useState<UploadedDoc | null>(null);
  const [endorsementNotApplicable, setEndorsementNotApplicable] = useState<boolean>(false);

  // Step 5: Purpose of Application
  const [selectedPurpose, setSelectedPurpose] = useState<string>('Employment');
  const [customPurpose, setCustomPurpose] = useState<string>('');

  // -------------------------------------------------------------
  // TRACKER STATE
  // -------------------------------------------------------------
  const [trackQuery, setTrackQuery] = useState<string>('BC-QC-2026-08129');
  const [trackedRecord, setTrackedRecord] = useState<BarangayApplicationRecord | null>(applications[0]);
  const [replacementDocTarget, setReplacementDocTarget] = useState<string | null>(null);
  const [isUploadingReplacement, setIsUploadingReplacement] = useState<boolean>(false);

  // -------------------------------------------------------------
  // ADMIN DASHBOARD STATE
  // -------------------------------------------------------------
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('All');
  const [adminPurposeFilter, setAdminPurposeFilter] = useState<string>('All');
  const [correctionModalApp, setCorrectionModalApp] = useState<BarangayApplicationRecord | null>(null);
  const [correctionTargetDoc, setCorrectionTargetDoc] = useState<'proofOfResidency' | 'validId' | 'cedula' | 'endorsement'>('proofOfResidency');
  const [correctionMessage, setCorrectionMessage] = useState<string>('The document is blurry or text is difficult to read. Please upload a clear photo or PDF.');
  const [viewApplicationModal, setViewApplicationModal] = useState<BarangayApplicationRecord | null>(null);

  // Receipt Modal State
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // -------------------------------------------------------------
  // FILE VALIDATION HELPER
  // -------------------------------------------------------------
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    if (!acceptedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Oops! We couldn't use this file. Please upload a JPG, PNG, or PDF."
      };
    }

    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: 'File size exceeds 10MB. Please choose a smaller file or compress the document.'
      };
    }

    return { valid: true };
  };

  // -------------------------------------------------------------
  // OCR SIMULATION & AUTOMATIC POPULATION (Step 1)
  // -------------------------------------------------------------
  const runOCR = (personName: string, homeAddress: string, phone: string, email: string) => {
    setOcrScanning(true);
    setTimeout(() => {
      setFullName(personName);
      setAddress(homeAddress);
      setContactNumber(phone.replace(/\D/g, '').slice(0, 11));
      setEmailAddress(email);
      setOcrScanning(false);
      setOcrSuccess(true);
      showToast('✨ OCR Auto-Extracted Name & Address from your Valid ID!', 'success');
    }, 1100);
  };

  // -------------------------------------------------------------
  // QUICK SAMPLE PRESET APPLICANT (1-Click Test)
  // -------------------------------------------------------------
  const handleLoadSamplePreset = (preset: 'juan' | 'elena' | 'carlo') => {
    if (preset === 'juan') {
      const mockId: UploadedDoc = {
        id: `doc-id-${Date.now()}`,
        name: 'Philippine_National_ID_JuanDelaCruz.jpg',
        size: '2.1 MB',
        type: 'image/jpeg',
        previewUrl: '/New Application.jpg',
        uploadDate: 'Today',
        status: 'verified'
      };
      setIdDoc(mockId);
      runOCR(
        'Juan Miguel Dela Cruz',
        'Block 14 Lot 8, Jasmine Street, Brgy. Fairview, Quezon City',
        '+63 917 555 1234',
        'juan.delacruz@example.com'
      );
      setResidencyDoc({
        id: `doc-res-${Date.now()}`,
        name: 'Meralco_Electric_Bill_Current.pdf',
        size: '1.8 MB',
        type: 'application/pdf',
        previewUrl: '/Renewal.jpg',
        uploadDate: 'Today',
        status: 'verified'
      });
      setCedulaDoc({
        id: `doc-ctc-${Date.now()}`,
        name: 'Community_Tax_Certificate_Cedula_2026.pdf',
        size: '1.3 MB',
        type: 'application/pdf',
        previewUrl: '/Special Permit.jpg',
        uploadDate: 'Today',
        status: 'verified'
      });
      setEndorsementNotApplicable(true);
      setSelectedPurpose('Employment');
    } else if (preset === 'elena') {
      const mockId: UploadedDoc = {
        id: `doc-id-${Date.now()}`,
        name: 'UMID_Card_ElenaSantos.jpg',
        size: '1.9 MB',
        type: 'image/jpeg',
        previewUrl: '/Amendment.jpg',
        uploadDate: 'Today',
        status: 'verified'
      };
      setIdDoc(mockId);
      runOCR(
        'Elena Morales Santos',
        'Unit 204, CyberTower Residence, Brgy. Batasan Hills, Quezon City',
        '+63 918 444 8899',
        'elena.santos@example.com'
      );
      setResidencyDoc({
        id: `doc-res-${Date.now()}`,
        name: 'Notarized_Lease_Contract_Batasan.pdf',
        size: '3.4 MB',
        type: 'application/pdf',
        previewUrl: '/Renewal.jpg',
        uploadDate: 'Today',
        status: 'verified'
      });
      setCedulaDoc({
        id: `doc-ctc-${Date.now()}`,
        name: 'Cedula_CTC_Form_0016_2026.pdf',
        size: '1.5 MB',
        type: 'application/pdf',
        previewUrl: '/Special Permit.jpg',
        uploadDate: 'Today',
        status: 'verified'
      });
      setEndorsementDoc({
        id: `doc-end-${Date.now()}`,
        name: 'Barangay_Batasan_Business_Referral.pdf',
        size: '2.0 MB',
        type: 'application/pdf',
        previewUrl: '/New Application.jpg',
        uploadDate: 'Today',
        status: 'verified'
      });
      setEndorsementNotApplicable(false);
      setSelectedPurpose('Business');
    } else {
      const mockId: UploadedDoc = {
        id: `doc-id-${Date.now()}`,
        name: 'Philippine_Passport_CarloAquino.jpg',
        size: '2.6 MB',
        type: 'image/jpeg',
        previewUrl: '/New Application.jpg',
        uploadDate: 'Today',
        status: 'verified'
      };
      setIdDoc(mockId);
      runOCR(
        'Carlo Rafael Aquino',
        '18 Katipunan Avenue, Brgy. Central, Quezon City',
        '+63 920 777 5511',
        'carlo.aquino@student.edu.ph'
      );
      setResidencyDoc({
        id: `doc-res-${Date.now()}`,
        name: 'Certificate_Of_Residency_HOA.pdf',
        size: '1.4 MB',
        type: 'application/pdf',
        previewUrl: '/Renewal.jpg',
        uploadDate: 'Today',
        status: 'verified'
      });
      setCedulaDoc({
        id: `doc-ctc-${Date.now()}`,
        name: 'Cedula_Student_CTC_2026.pdf',
        size: '1.1 MB',
        type: 'application/pdf',
        previewUrl: '/Special Permit.jpg',
        uploadDate: 'Today',
        status: 'verified'
      });
      setEndorsementNotApplicable(true);
      setSelectedPurpose('School Requirement');
    }
  };

  // -------------------------------------------------------------
  // DOCUMENT UPLOAD HANDLERS WITH DRAG & DROP & VALIDATION
  // -------------------------------------------------------------
  const handleGenericFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'validId' | 'residency' | 'cedula' | 'endorsement'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      showToast(validation.error || 'Invalid file', 'error');
      if (e.target) e.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const docObj: UploadedDoc = {
      id: `doc-${Date.now()}`,
      name: file.name,
      size: `${sizeMb} MB`,
      type: file.type,
      previewUrl,
      uploadDate: 'Just now',
      status: 'verified'
    };

    if (type === 'validId') {
      setIdDoc(docObj);
      runOCR(
        user?.name || 'Applicant Resident',
        'Quezon City, Metro Manila',
        '+63 917 555 9988',
        user?.email || 'applicant@example.com'
      );
    } else if (type === 'residency') {
      setResidencyDoc(docObj);
      showToast('✓ Proof of Residency uploaded successfully!', 'success');
    } else if (type === 'cedula') {
      setCedulaDoc(docObj);
      showToast('✓ Cedula / CTC uploaded successfully!', 'success');
    } else if (type === 'endorsement') {
      setEndorsementDoc(docObj);
      showToast('✓ Barangay Endorsement uploaded successfully!', 'success');
    }

    if (e.target) e.target.value = '';
  };

  // -------------------------------------------------------------
  // REPLACEMENT UPLOAD IN TRACKING ("Action Required")
  // -------------------------------------------------------------
  const handleReplacementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !trackedRecord) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      showToast(validation.error || 'Invalid file', 'error');
      return;
    }

    setIsUploadingReplacement(true);
    setTimeout(() => {
      const previewUrl = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const newDoc: UploadedDoc = {
        id: `doc-replaced-${Date.now()}`,
        name: file.name,
        size: `${sizeMb} MB`,
        type: file.type,
        previewUrl,
        uploadDate: 'Just now',
        status: 'verified'
      };

      const updatedDocs = { ...trackedRecord.documents };
      if (trackedRecord.correctionRequestedDoc === 'proofOfResidency') {
        updatedDocs.proofOfResidency = newDoc;
      } else if (trackedRecord.correctionRequestedDoc === 'validId') {
        updatedDocs.validId = newDoc;
      } else if (trackedRecord.correctionRequestedDoc === 'cedula') {
        updatedDocs.cedula = newDoc;
      } else if (trackedRecord.correctionRequestedDoc === 'endorsement') {
        updatedDocs.endorsement = newDoc;
      }

      const updatedRecord: BarangayApplicationRecord = {
        ...trackedRecord,
        status: 'DOCUMENT REVIEW',
        documents: updatedDocs,
        remarks: 'Replacement document uploaded by applicant. Pending administrative verification.',
        correctionRequestedDoc: null
      };

      setApplications(prev => prev.map(a => (a.refNumber === updatedRecord.refNumber ? updatedRecord : a)));
      setTrackedRecord(updatedRecord);
      setIsUploadingReplacement(false);
      showToast('✓ Replacement document submitted! Your application is now in Document Review.', 'success');
    }, 1200);

    if (e.target) e.target.value = '';
  };

  // -------------------------------------------------------------
  // STEP SUBMIT & PERSISTENCE
  // -------------------------------------------------------------
  const handleFinalSubmit = async () => {
    // Validate Required Documents
    if (!idDoc) {
      showToast('Please upload your Valid Government ID to continue.', 'error');
      setCurrentStep(1);
      return;
    }
    if (!residencyDoc) {
      showToast('Please upload your Proof of Residency to continue.', 'error');
      setCurrentStep(2);
      return;
    }
    if (!cedulaDoc) {
      showToast('Please upload your Cedula / CTC to continue.', 'error');
      setCurrentStep(3);
      return;
    }
    if (!endorsementDoc && !endorsementNotApplicable) {
      showToast('Please upload your Barangay Endorsement or select "Not Applicable".', 'error');
      setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);

    const refNum = `BC-QC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord: BarangayApplicationRecord = {
      id: `brgy-${Date.now()}`,
      refNumber: refNum,
      applicantName: fullName.trim() || user?.name || 'Applicant Resident',
      address: address.trim() || 'Quezon City, Metro Manila',
      contactNumber: contactNumber.trim() || '+63 917 000 0000',
      email: emailAddress.trim() || user?.email || 'resident@example.com',
      purpose: selectedPurpose === 'Other' && customPurpose.trim() ? customPurpose.trim() : selectedPurpose,
      customPurpose: selectedPurpose === 'Other' ? customPurpose : undefined,
      status: 'SUBMITTED',
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      estimatedTime: '2 to 4 hours',
      documents: {
        validId: idDoc,
        proofOfResidency: residencyDoc,
        cedula: cedulaDoc,
        endorsement: endorsementDoc,
        endorsementNotApplicable
      },
      remarks: 'Application received online. Queued for document completeness check.'
    };

    // Save to Local Applications
    setApplications(prev => [newRecord, ...prev]);
    setLastSubmittedApp(newRecord);
    setTrackedRecord(newRecord);
    setTrackQuery(refNum);

    // Sync to PostgreSQL backend / global registry
    try {
      await createApplication({
        id: refNum,
        applicant: newRecord.applicantName,
        applicantName: newRecord.applicantName,
        type: 'Barangay Clearance',
        permitType: 'Barangay Clearance',
        category: 'barangay',
        status: 'Submitted',
        assessmentFee: 150.0,
        formData: {
          address: newRecord.address,
          contact: newRecord.contactNumber,
          email: newRecord.email,
          purpose: newRecord.purpose
        },
        requirements: [
          { name: 'Valid Government ID', file: idDoc?.name, status: 'Uploaded' },
          { name: 'Proof of Residency', file: residencyDoc?.name, status: 'Uploaded' },
          { name: 'Cedula / CTC', file: cedulaDoc?.name, status: 'Uploaded' },
          {
            name: 'Barangay Endorsement',
            file: endorsementNotApplicable ? 'Not Applicable' : endorsementDoc?.name,
            status: endorsementNotApplicable ? 'Waived' : 'Uploaded'
          }
        ]
      });
    } catch (e) {
      console.warn('Backend sync fallback to local storage:', e);
    }

    if (onAddNewApplication) {
      onAddNewApplication(newRecord.applicantName, 'Barangay Clearance');
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setActiveView('confirmation');
      showToast('🎉 Application submitted successfully!', 'success');
    }, 1000);
  };

  // -------------------------------------------------------------
  // ADMIN ACTIONS
  // -------------------------------------------------------------
  const handleAdminVerify = (appId: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: 'FOR VERIFICATION', remarks: 'Documents verified by Barangay staff. Under Lupon record audit.' } : app))
    );
    showToast('Application status updated to FOR VERIFICATION', 'info');
  };

  const handleAdminApprove = (appId: string) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === appId
          ? {
              ...app,
              status: 'READY FOR RELEASE',
              remarks: 'Approved by Punong Barangay. Official Digital Barangay Clearance ready for release.',
              reviewedBy: user?.name || 'Hon. Barangay Chairman'
            }
          : app
      )
    );
    showToast('✓ Barangay Clearance APPROVED & READY FOR RELEASE!', 'success');
  };

  const handleAdminReject = (appId: string) => {
    const reason = prompt('Please provide reason for rejection:');
    if (reason === null) return;
    setApplications(prev =>
      prev.map(app =>
        app.id === appId
          ? {
              ...app,
              status: 'REJECTED',
              remarks: `Application rejected: ${reason || 'Incomplete or fraudulent documentation.'}`,
              reviewedBy: user?.name || 'Barangay Officer'
            }
          : app
      )
    );
    showToast('Application has been rejected.', 'warning');
  };

  const handleAdminSubmitCorrection = () => {
    if (!correctionModalApp) return;

    const docLabels: Record<string, string> = {
      proofOfResidency: 'Proof of Residency',
      validId: 'Valid Government ID',
      cedula: 'Cedula / CTC',
      endorsement: 'Barangay Endorsement'
    };

    const updated: BarangayApplicationRecord = {
      ...correctionModalApp,
      status: 'NEEDS CORRECTION',
      correctionRequestedDoc: correctionTargetDoc,
      remarks: `Action Required: Please replace ${docLabels[correctionTargetDoc]}. ${correctionMessage}`,
      reviewedBy: user?.name || 'Barangay Officer'
    };

    setApplications(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    setCorrectionModalApp(null);
    showToast(`Correction notice issued to applicant for ${docLabels[correctionTargetDoc]}.`, 'info');
  };

  // Stats Counters for Admin
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'SUBMITTED' || a.status === 'DOCUMENT REVIEW').length,
    verification: applications.filter(a => a.status === 'FOR VERIFICATION' || a.status === 'PROCESSING').length,
    approved: applications.filter(a => a.status === 'APPROVED' || a.status === 'READY FOR RELEASE').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
    ready: applications.filter(a => a.status === 'READY FOR RELEASE').length
  };

  // Status Badge Helper
  const getStatusBadge = (status: BarangayApplicationRecord['status']) => {
    switch (status) {
      case 'READY FOR RELEASE':
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
      case 'NEEDS CORRECTION':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/40 animate-pulse';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30';
      case 'FOR VERIFICATION':
      case 'PROCESSING':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30';
      case 'DOCUMENT REVIEW':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30';
      case 'SUBMITTED':
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200 pb-16">
      
      {/* Toast Alert Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500'
                : toast.type === 'warning'
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-blue-600 text-white border-blue-500'
            }`}
          >
            <Sparkles size={18} />
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-75">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* ========================================================================= */}
        {/* 2. APPLICATION FORM (UPLOAD-BASED, STEP-BY-STEP WIZARD)                   */}
        {/* ========================================================================= */}
        {activeView === 'apply' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
            
            {/* Header with Title & Step Progress Tracker */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      STEP {currentStep} OF 6
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Upload-Based Clearance Filing</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Apply for Barangay Clearance
                  </h2>
                </div>
              </div>

              {/* Visual Step Progress Bar */}
              <div className="grid grid-cols-6 gap-2">
                {[
                  { step: 1, label: 'Valid ID' },
                  { step: 2, label: 'Residency' },
                  { step: 3, label: 'Cedula CTC' },
                  { step: 4, label: 'Endorsement' },
                  { step: 5, label: 'Purpose' },
                  { step: 6, label: 'Review' },
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => {
                      if (s.step < currentStep || (s.step === 2 && idDoc) || (s.step === 3 && residencyDoc)) {
                        setCurrentStep(s.step);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-bold transition-all text-center ${
                      currentStep === s.step
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : currentStep > s.step
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider">Step {s.step}</span>
                    <span className="truncate w-full text-[11px] font-extrabold mt-0.5">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 1: APPLICANT INFORMATION & VALID ID UPLOAD */}
            {currentStep === 1 && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
                
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Step 1 — Upload your Valid Government ID
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Take a clear photo or upload a scan of your ID. Our system will automatically read your Name and Address so you don’t have to type it manually.
                  </p>
                </div>

                {/* Upload Card / Dropzone */}
                {!idDoc ? (
                  <label className="border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/80 transition-all group">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleGenericFileUpload(e, 'validId')}
                      className="hidden"
                    />
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform mb-3">
                      <Camera size={28} />
                    </div>
                    <span className="text-base font-black text-blue-900 dark:text-blue-300">
                      + Upload ID Photo
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      Drag &amp; drop or click to browse (JPG, JPEG, PNG, PDF up to 10MB)
                    </span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-2">
                      Accepted: PhilSys National ID, Driver's License, Passport, UMID, Postal ID
                    </span>
                  </label>
                ) : (
                  <div className="space-y-4">
                    {/* Uploaded File Preview Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden border flex items-center justify-center shrink-0">
                          {idDoc.type.includes('image') ? (
                            <img src={idDoc.previewUrl} alt="ID Preview" className="w-full h-full object-cover" />
                          ) : (
                            <FileText size={28} className="text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-xs">
                              {idDoc.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                              <CheckCircle2 size={11} />
                              <span>Uploaded</span>
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">Size: {idDoc.size}</p>
                        </div>
                      </div>

                      {/* Replace / Remove Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ title: 'Valid Government ID', doc: idDoc })}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                        <label className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer flex items-center gap-1.5">
                          <RefreshCw size={13} />
                          <span>Replace</span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => handleGenericFileUpload(e, 'validId')}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIdDoc(null);
                            setOcrSuccess(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5"
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* OCR Status Scanning animation / Banner */}
                    {ocrScanning && (
                      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center space-x-3 text-xs text-blue-700 dark:text-blue-300 animate-pulse">
                        <Sparkles size={18} className="animate-spin text-blue-600" />
                        <span className="font-bold">Scanning ID Document... Reading full name and residential address.</span>
                      </div>
                    )}

                    {ocrSuccess && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 size={16} className="text-emerald-600" />
                          <span className="font-bold">Information Extracted Successfully via ID Recognition</span>
                        </div>
                        <span className="text-[11px] text-emerald-600">Auto-filled below</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Basic Fields (Extracted by OCR, editable by user if desired) */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Applicant Information Details
                    </h4>
                    <span className="text-[11px] text-slate-400">Pre-filled from uploaded document</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Juan Miguel Dela Cruz"
                          className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {fullName && (
                          <button
                            type="button"
                            onClick={() => setFullName('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                            title="Clear Full Name"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Contact Number (Strictly 11 digits, numbers only, no letters) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Contact Number
                        </label>
                        <span className="text-[10px] text-slate-400 font-medium">11 digits (numbers only)</span>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={11}
                          value={contactNumber}
                          onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 11);
                            setContactNumber(digitsOnly);
                          }}
                          placeholder="09171234567"
                          className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {contactNumber && (
                          <button
                            type="button"
                            onClick={() => setContactNumber('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                            title="Clear Contact Number"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Residential Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Residential Address
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="House / Unit No., Street, Barangay, City"
                          className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {address && (
                          <button
                            type="button"
                            onClick={() => setAddress('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                            title="Clear Residential Address"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="email"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="applicant@example.com"
                          className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {emailAddress && (
                          <button
                            type="button"
                            onClick={() => setEmailAddress('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                            title="Clear Email Address"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Navigation Button */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (onBack) onBack();
                      else if (onNavigateToTab) onNavigateToTab('Home');
                    }}
                    className="px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Portal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!idDoc) {
                        showToast('Please upload this document to continue.', 'error');
                        return;
                      }
                      setCurrentStep(2);
                    }}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next: Proof of Residency →</span>
                  </button>
                </div>

              </div>
            )}

            {/* STEP 2: PROOF OF RESIDENCY */}
            {currentStep === 2 && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
                
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Step 2 — Upload Proof of Residency
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    “Take a clear photo of your document. Make sure all text is readable.”
                  </p>
                </div>

                {/* Upload Card / Dropzone */}
                {!residencyDoc ? (
                  <label className="border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/80 transition-all group">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleGenericFileUpload(e, 'residency')}
                      className="hidden"
                    />
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform mb-3">
                      <Home size={28} />
                    </div>
                    <span className="text-base font-black text-blue-900 dark:text-blue-300">
                      + Upload Proof of Residency
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      Accepted formats: JPG, JPEG, PNG, PDF (Up to 10MB)
                    </span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-2">
                      Examples: Meralco / Maynilad Electric / Water Bill, Notarized Lease Contract, Certificate of Residency from HOA
                    </span>
                  </label>
                ) : (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden border flex items-center justify-center shrink-0">
                        {residencyDoc.type.includes('image') ? (
                          <img src={residencyDoc.previewUrl} alt="Residency Preview" className="w-full h-full object-cover" />
                        ) : (
                          <FileText size={28} className="text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-xs">
                            {residencyDoc.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 size={11} />
                            <span>Uploaded</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Size: {residencyDoc.size} • Verified</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc({ title: 'Proof of Residency', doc: residencyDoc })}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5"
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                      <label className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer flex items-center gap-1.5">
                        <RefreshCw size={13} />
                        <span>Replace</span>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleGenericFileUpload(e, 'residency')}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setResidencyDoc(null)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Navigation Buttons */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!residencyDoc) {
                        showToast('Please upload this document to continue.', 'error');
                        return;
                      }
                      setCurrentStep(3);
                    }}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    <span>Next: Cedula / CTC →</span>
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: CEDULA / COMMUNITY TAX CERTIFICATE */}
            {currentStep === 3 && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
                
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Step 3 — Upload Cedula / Community Tax Certificate (CTC)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload your current year Community Tax Certificate (Cedula Form No. 0016).
                  </p>
                </div>

                {!cedulaDoc ? (
                  <label className="border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/80 transition-all group">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleGenericFileUpload(e, 'cedula')}
                      className="hidden"
                    />
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform mb-3">
                      <Banknote size={28} />
                    </div>
                    <span className="text-base font-black text-blue-900 dark:text-blue-300">
                      + Upload Cedula
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      Accepted formats: JPG, JPEG, PNG, PDF (Up to 10MB)
                    </span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-2">
                      Make sure the CTC Number and Year are clearly visible.
                    </span>
                  </label>
                ) : (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden border flex items-center justify-center shrink-0">
                        {cedulaDoc.type.includes('image') ? (
                          <img src={cedulaDoc.previewUrl} alt="Cedula Preview" className="w-full h-full object-cover" />
                        ) : (
                          <FileText size={28} className="text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-xs">
                            {cedulaDoc.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 size={11} />
                            <span>Uploaded</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Size: {cedulaDoc.size} • Verified</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc({ title: 'Cedula / Community Tax Certificate', doc: cedulaDoc })}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5"
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                      <label className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer flex items-center gap-1.5">
                        <RefreshCw size={13} />
                        <span>Replace</span>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleGenericFileUpload(e, 'cedula')}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setCedulaDoc(null)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Navigation Buttons */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!cedulaDoc) {
                        showToast('Please upload this document to continue.', 'error');
                        return;
                      }
                      setCurrentStep(4);
                    }}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    <span>Next: Barangay Endorsement →</span>
                  </button>
                </div>

              </div>
            )}

            {/* STEP 4: BARANGAY ENDORSEMENT */}
            {currentStep === 4 && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
                
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Step 4 — Upload Barangay Endorsement
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload your Barangay Kagawad / HOA Endorsement if applicable. If not required for your clearance, simply check "Not Applicable".
                  </p>
                </div>

                {/* Checkbox: Not Applicable */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="endorsementNa"
                    checked={endorsementNotApplicable}
                    onChange={(e) => {
                      setEndorsementNotApplicable(e.target.checked);
                      if (e.target.checked) {
                        setEndorsementDoc(null);
                      }
                    }}
                    className="w-5 h-5 rounded-md text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="endorsementNa" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                    Not Applicable (My application does not require a prior endorsement)
                  </label>
                </div>

                {!endorsementNotApplicable && (
                  <>
                    {!endorsementDoc ? (
                      <label className="border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/80 transition-all group">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleGenericFileUpload(e, 'endorsement')}
                          className="hidden"
                        />
                        <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform mb-3">
                          <Award size={28} />
                        </div>
                        <span className="text-base font-black text-blue-900 dark:text-blue-300">
                          + Upload Endorsement
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          Photo or PDF upload (Up to 10MB)
                        </span>
                      </label>
                    ) : (
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden border flex items-center justify-center shrink-0">
                            {endorsementDoc.type.includes('image') ? (
                              <img src={endorsementDoc.previewUrl} alt="Endorsement Preview" className="w-full h-full object-cover" />
                            ) : (
                              <FileText size={28} className="text-blue-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-xs">
                                {endorsementDoc.name}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                                <CheckCircle2 size={11} />
                                <span>Uploaded</span>
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Size: {endorsementDoc.size}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc({ title: 'Barangay Endorsement', doc: endorsementDoc })}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                          <label className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer flex items-center gap-1.5">
                            <RefreshCw size={13} />
                            <span>Replace</span>
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) => handleGenericFileUpload(e, 'endorsement')}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setEndorsementDoc(null)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Footer Navigation Buttons */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!endorsementDoc && !endorsementNotApplicable) {
                        showToast('Please upload your endorsement or mark as Not Applicable.', 'error');
                        return;
                      }
                      setCurrentStep(5);
                    }}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    <span>Next: Purpose of Application →</span>
                  </button>
                </div>

              </div>
            )}

            {/* STEP 5: PURPOSE OF APPLICATION */}
            {currentStep === 5 && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
                
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Step 5 — Select Purpose of Application
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select your reason for requesting this Barangay Clearance. No long manual typing required!
                  </p>
                </div>

                {/* Selectable visual button cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'Employment', label: 'Employment', icon: '💼', desc: 'Job application & local hiring' },
                    { key: 'Business', label: 'Business', icon: '🏢', desc: 'Permit filing & commercial renewal' },
                    { key: 'School Requirement', label: 'School Requirement', icon: '🎓', desc: 'Enrollment & scholarships' },
                    { key: 'Government Requirement', label: 'Government Requirement', icon: '🏛️', desc: 'NBI, Police, DFA Passport' },
                    { key: 'Residency Verification', label: 'Residency Verification', icon: '🏡', desc: 'Proof of address / bank' },
                    { key: 'Local Transaction', label: 'Local Transaction', icon: '🤝', desc: 'Barangay agreement or dispute' },
                    { key: 'Other', label: 'Other', icon: '✍️', desc: 'Specify custom purpose below' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSelectedPurpose(item.key)}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        selectedPurpose === item.key
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-2xl mb-1.5">{item.icon}</div>
                      <div className="text-xs font-black">{item.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>

                {/* If Other is selected, show small text field */}
                {selectedPurpose === 'Other' && (
                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-2 animate-in fade-in">
                    <label className="block text-xs font-bold text-blue-900 dark:text-blue-300">
                      Please specify your purpose:
                    </label>
                    <input
                      type="text"
                      value={customPurpose}
                      onChange={(e) => setCustomPurpose(e.target.value)}
                      placeholder="e.g. Travel Abroad / Loan Application / Electricity Meter Application"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Footer Navigation Buttons */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedPurpose === 'Other' && !customPurpose.trim()) {
                        showToast('Please type your clearance purpose.', 'error');
                        return;
                      }
                      setCurrentStep(6);
                    }}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    <span>Next: Review Application →</span>
                  </button>
                </div>

              </div>
            )}

            {/* STEP 6: REVIEW APPLICATION */}
            {currentStep === 6 && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
                
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Step 6 — Review Your Application
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    “Please review your information and uploaded documents before submitting.”
                  </p>
                </div>

                {/* Applicant Information Summary */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Applicant Information
                    </span>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Edit Info
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Full Name:</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">{fullName || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Contact Number:</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">{contactNumber || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Residential Address:</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">{address || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Email Address:</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-0.5">{emailAddress || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Selected Purpose:</span>
                      <p className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                        {selectedPurpose === 'Other' ? customPurpose : selectedPurpose}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Documents Checklist Summary */}
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                    Uploaded Documents Checklist
                  </span>

                  {[
                    { title: 'Valid Government ID', doc: idDoc, step: 1, required: true },
                    { title: 'Proof of Residency', doc: residencyDoc, step: 2, required: true },
                    { title: 'Cedula / CTC', doc: cedulaDoc, step: 3, required: true },
                    {
                      title: 'Barangay Endorsement',
                      doc: endorsementDoc,
                      step: 4,
                      required: false,
                      isNa: endorsementNotApplicable
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden border flex items-center justify-center shrink-0">
                          {item.doc?.type.includes('image') ? (
                            <img src={item.doc.previewUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                          ) : item.isNa ? (
                            <span className="text-xs font-bold text-slate-400">N/A</span>
                          ) : (
                            <FileText size={22} className="text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              ✓ {item.title}
                            </span>
                            {item.isNa ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                Marked as Not Applicable
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                Ready
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {item.isNa ? 'Waived for this clearance category' : item.doc ? `${item.doc.name} (${item.doc.size})` : 'Not uploaded'}
                          </p>
                        </div>
                      </div>

                      {/* View / Replace Actions */}
                      <div className="flex items-center space-x-2 shrink-0">
                        {item.doc && (
                          <button
                            type="button"
                            onClick={() => setPreviewDoc({ title: item.title, doc: item.doc! })}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 flex items-center gap-1"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setCurrentStep(item.step)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700 text-xs font-bold hover:bg-blue-100"
                        >
                          Replace
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Submit & Back Buttons */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} />
                    <span>[ ← Back ]</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalSubmit}
                    className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-black shadow-xl shadow-blue-600/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <span>[ Submit Application → ]</span>
                    )}
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. SUBMISSION CONFIRMATION PAGE                                            */}
        {/* ========================================================================= */}
        {activeView === 'confirmation' && lastSubmittedApp && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
            
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
              
              {/* Success Green Seal */}
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={44} />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  ✓ APPLICATION SUBMITTED SUCCESSFULLY
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                  Your Barangay Clearance Application Has Been Received
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Our barangay licensing and document review team has initiated verification.
                </p>
              </div>

              {/* Reference Details Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">Application Reference Number:</span>
                  <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                    {lastSubmittedApp.refNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Applicant Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{lastSubmittedApp.applicantName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Date Submitted:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{lastSubmittedApp.dateSubmitted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Initial Application Status:</span>
                  <span className="font-bold px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {lastSubmittedApp.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Estimated Processing Time:</span>
                  <span className="font-bold text-emerald-600">{lastSubmittedApp.estimatedTime}</span>
                </div>
              </div>

              {/* Status Flow Milestone (Matching Prompt) */}
              <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-900 dark:text-blue-300 block text-center">
                  Processing Lifecycle
                </span>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  <div className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-black">SUBMITTED</div>
                  <span className="text-slate-400 hidden sm:inline">↓</span>
                  <div className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700">DOCUMENT REVIEW</div>
                  <span className="text-slate-400 hidden sm:inline">↓</span>
                  <div className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700">BARANGAY VERIFICATION</div>
                  <span className="text-slate-400 hidden sm:inline">↓</span>
                  <div className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700">APPROVED</div>
                  <span className="text-slate-400 hidden sm:inline">↓</span>
                  <div className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700">CLEARANCE READY</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTrackQuery(lastSubmittedApp.refNumber);
                    setTrackedRecord(lastSubmittedApp);
                    setActiveView('track');
                  }}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5"
                >
                  <Search size={14} />
                  <span>View Status</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  <Download size={14} />
                  <span>Download Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onBack) onBack();
                    else if (onNavigateToTab) onNavigateToTab('Home');
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black hover:bg-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Portal</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. APPLICATION STATUS PAGE (TRACK APPLICATION)                           */}
        {/* ========================================================================= */}
        {activeView === 'track' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
            
            {/* Search Track Header Card */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  REAL-TIME APPLICATION TRACKER
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Track Your Barangay Clearance Application
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your Application Reference Number to see current milestone status and required actions.
                </p>
              </div>

              {/* Reference Search Input */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Hash className="absolute left-3.5 top-3 text-slate-400" size={17} />
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="Enter Reference Number (e.g. BC-QC-2026-08129)"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const found = applications.find(
                      a => a.refNumber.toLowerCase() === trackQuery.trim().toLowerCase()
                    );
                    if (found) {
                      setTrackedRecord(found);
                      showToast('Application record found!', 'success');
                    } else {
                      showToast('No record found with that Reference Number. Please check and try again.', 'error');
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Search size={15} />
                  <span>Track Application</span>
                </button>
              </div>
            </div>

            {/* Tracked Record Result Card */}
            {trackedRecord && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                
                {/* Header Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {trackedRecord.refNumber}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {trackedRecord.applicantName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Purpose: <strong>{trackedRecord.purpose}</strong> • Submitted: {trackedRecord.dateSubmitted}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-black ${getStatusBadge(trackedRecord.status)}`}>
                      {trackedRecord.status}
                    </span>
                  </div>
                </div>

                {/* ACTION REQUIRED BANNER (If status is NEEDS CORRECTION) */}
                {trackedRecord.status === 'NEEDS CORRECTION' && (
                  <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600 space-y-3 animate-in fade-in">
                    <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-black text-sm">
                      <AlertTriangle size={18} className="text-amber-600" />
                      <span>Action Required</span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {trackedRecord.remarks ||
                        'Please replace the following document: Proof of Residency. The uploaded document may be difficult to read.'}
                    </p>

                    <div className="pt-1 flex items-center space-x-3">
                      <label className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md shadow-amber-500/30 flex items-center gap-2 cursor-pointer">
                        <Upload size={14} />
                        <span>Upload Replacement</span>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleReplacementUpload}
                          className="hidden"
                        />
                      </label>

                      {isUploadingReplacement && (
                        <span className="text-xs text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1.5 animate-pulse">
                          <RefreshCw size={13} className="animate-spin" />
                          <span>Uploading new file &amp; updating status...</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* APPROVED & READY BANNER */}
                {trackedRecord.status === 'READY FOR RELEASE' && (
                  <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-black text-sm">
                        <Award size={18} className="text-emerald-600" />
                        <span>Barangay Clearance Ready for Release</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        Your official Barangay Clearance has been signed and certified with a secure cryptographic QR code.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowReceiptModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-600/30 flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Download Digital Clearance</span>
                    </button>
                  </div>
                )}

                {/* Visual Step Progress Tracker (7 Life Cycle Stages) */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                    Progress Tracker
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-[10px] font-bold">
                    {[
                      { key: 'SUBMITTED', label: '1. Submitted' },
                      { key: 'DOCUMENT REVIEW', label: '2. Doc Review' },
                      { key: 'FOR VERIFICATION', label: '3. Verification' },
                      { key: 'PROCESSING', label: '4. Processing' },
                      { key: 'APPROVED', label: '5. Approved' },
                      { key: 'READY FOR RELEASE', label: '6. Release Ready' },
                      { key: 'NEEDS CORRECTION', label: 'Correction / Reject' },
                    ].map((stepItem) => {
                      const isActive = trackedRecord.status === stepItem.key;
                      return (
                        <div
                          key={stepItem.key}
                          className={`p-2.5 rounded-xl border transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-black'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="truncate">{stepItem.label}</div>
                          {isActive && <div className="text-[9px] mt-0.5 font-bold">CURRENT</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submitted Documents in Record */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                    Document Submissions in Record
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Valid ID */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 truncate">
                        <FileText size={16} className="text-blue-600 shrink-0" />
                        <div className="truncate">
                          <span className="font-bold block text-slate-900 dark:text-white">Valid Government ID</span>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {trackedRecord.documents.validId?.name || 'Not uploaded'}
                          </span>
                        </div>
                      </div>
                      {trackedRecord.documents.validId && (
                        <button
                          onClick={() => setPreviewDoc({ title: 'Valid ID', doc: trackedRecord.documents.validId! })}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border text-[11px] font-bold hover:bg-slate-100"
                        >
                          View
                        </button>
                      )}
                    </div>

                    {/* Proof of Residency */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 truncate">
                        <Home size={16} className="text-blue-600 shrink-0" />
                        <div className="truncate">
                          <span className="font-bold block text-slate-900 dark:text-white">Proof of Residency</span>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {trackedRecord.documents.proofOfResidency?.name || 'Not uploaded'}
                          </span>
                        </div>
                      </div>
                      {trackedRecord.documents.proofOfResidency && (
                        <button
                          onClick={() => setPreviewDoc({ title: 'Proof of Residency', doc: trackedRecord.documents.proofOfResidency! })}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border text-[11px] font-bold hover:bg-slate-100"
                        >
                          View
                        </button>
                      )}
                    </div>

                    {/* Cedula / CTC */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 truncate">
                        <Banknote size={16} className="text-blue-600 shrink-0" />
                        <div className="truncate">
                          <span className="font-bold block text-slate-900 dark:text-white">Cedula / CTC</span>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {trackedRecord.documents.cedula?.name || 'Not uploaded'}
                          </span>
                        </div>
                      </div>
                      {trackedRecord.documents.cedula && (
                        <button
                          onClick={() => setPreviewDoc({ title: 'Cedula / CTC', doc: trackedRecord.documents.cedula! })}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border text-[11px] font-bold hover:bg-slate-100"
                        >
                          View
                        </button>
                      )}
                    </div>

                    {/* Endorsement */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 truncate">
                        <Award size={16} className="text-blue-600 shrink-0" />
                        <div className="truncate">
                          <span className="font-bold block text-slate-900 dark:text-white">Barangay Endorsement</span>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {trackedRecord.documents.endorsementNotApplicable
                              ? 'Waived (Not Applicable)'
                              : trackedRecord.documents.endorsement?.name || 'Not uploaded'}
                          </span>
                        </div>
                      </div>
                      {trackedRecord.documents.endorsement && (
                        <button
                          onClick={() => setPreviewDoc({ title: 'Endorsement', doc: trackedRecord.documents.endorsement! })}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border text-[11px] font-bold hover:bg-slate-100"
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. ADMIN SIDE (BARANGAY PERSONNEL DASHBOARD)                              */}
        {/* ========================================================================= */}
        {activeView === 'admin' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Admin Header with Real-time Counters */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center gap-1">
                      <Shield size={12} />
                      <span>BARANGAY PERSONNEL CONSOLE</span>
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Digital Clearance Verification Desk</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Barangay Clearance Applications Queue
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleLoadSamplePreset('juan');
                    showToast('Seeded test clearance application into admin queue!', 'info');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles size={14} className="text-indigo-600" />
                  <span>Seed Test Application</span>
                </button>
              </div>

              {/* 6 Metric Stat Cards (Matching Prompt Specification) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Total Applications', count: stats.total, color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-slate-800/80' },
                  { label: 'Pending Applications', count: stats.pending, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/60 dark:bg-blue-950/30' },
                  { label: 'For Verification', count: stats.verification, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50/60 dark:bg-indigo-950/30' },
                  { label: 'Approved', count: stats.approved, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/60 dark:bg-emerald-950/30' },
                  { label: 'Needs Action / Reject', count: stats.rejected, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50/60 dark:bg-rose-950/30' },
                  { label: 'Ready for Release', count: stats.ready, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50/60 dark:bg-teal-950/30' },
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 ${item.bg}`}>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <span className={`text-2xl font-black mt-1 block ${item.color}`}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Search by Reference No., Applicant Name, or Address..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={adminStatusFilter}
                    onChange={(e) => setAdminStatusFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="DOCUMENT REVIEW">Document Review</option>
                    <option value="FOR VERIFICATION">For Verification</option>
                    <option value="APPROVED">Approved</option>
                    <option value="READY FOR RELEASE">Ready for Release</option>
                    <option value="NEEDS CORRECTION">Needs Correction</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                  <select
                    value={adminPurposeFilter}
                    onChange={(e) => setAdminPurposeFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                  >
                    <option value="All">All Purposes</option>
                    <option value="Employment">Employment</option>
                    <option value="Business">Business</option>
                    <option value="School Requirement">School</option>
                    <option value="Government Requirement">Government</option>
                    <option value="Residency Verification">Residency</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Applications Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4">Reference Number</th>
                      <th className="py-3.5 px-4">Applicant Name</th>
                      <th className="py-3.5 px-4">Date Submitted</th>
                      <th className="py-3.5 px-4">Purpose</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Documents</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {applications
                      .filter(app => {
                        const matchSearch =
                          !adminSearch ||
                          app.refNumber.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          app.applicantName.toLowerCase().includes(adminSearch.toLowerCase()) ||
                          app.address.toLowerCase().includes(adminSearch.toLowerCase());
                        const matchStatus = adminStatusFilter === 'All' || app.status === adminStatusFilter;
                        const matchPurpose = adminPurposeFilter === 'All' || app.purpose.includes(adminPurposeFilter);
                        return matchSearch && matchStatus && matchPurpose;
                      })
                      .map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {app.refNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 dark:text-white block">{app.applicantName}</span>
                            <span className="text-[11px] text-slate-400 truncate block max-w-xs">{app.address}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                            {app.dateSubmitted}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {app.purpose}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusBadge(app.status)}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-1">
                              {app.documents.validId && (
                                <button
                                  type="button"
                                  title="Valid Government ID"
                                  onClick={() => setPreviewDoc({ title: `Valid ID - ${app.applicantName}`, doc: app.documents.validId! })}
                                  className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center hover:bg-blue-100"
                                >
                                  <User size={13} />
                                </button>
                              )}
                              {app.documents.proofOfResidency && (
                                <button
                                  type="button"
                                  title="Proof of Residency"
                                  onClick={() => setPreviewDoc({ title: `Proof of Residency - ${app.applicantName}`, doc: app.documents.proofOfResidency! })}
                                  className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"
                                >
                                  <Home size={13} />
                                </button>
                              )}
                              {app.documents.cedula && (
                                <button
                                  type="button"
                                  title="Cedula / CTC"
                                  onClick={() => setPreviewDoc({ title: `Cedula / CTC - ${app.applicantName}`, doc: app.documents.cedula! })}
                                  className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center hover:bg-amber-100"
                                >
                                  <Banknote size={13} />
                                </button>
                              )}
                              {app.documents.endorsement && (
                                <button
                                  type="button"
                                  title="Barangay Endorsement"
                                  onClick={() => setPreviewDoc({ title: `Endorsement - ${app.applicantName}`, doc: app.documents.endorsement! })}
                                  className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center hover:bg-purple-100"
                                >
                                  <Award size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* View Application Details */}
                              <button
                                type="button"
                                onClick={() => setViewApplicationModal(app)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 text-[11px]"
                              >
                                View
                              </button>

                              {/* Verify Button */}
                              {app.status === 'SUBMITTED' && (
                                <button
                                  type="button"
                                  onClick={() => handleAdminVerify(app.id)}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 text-[11px]"
                                >
                                  Verify
                                </button>
                              )}

                              {/* Approve Button */}
                              {app.status !== 'APPROVED' && app.status !== 'READY FOR RELEASE' && (
                                <button
                                  type="button"
                                  onClick={() => handleAdminApprove(app.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 text-[11px]"
                                >
                                  Approve
                                </button>
                              )}

                              {/* Request Correction Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setCorrectionModalApp(app);
                                  setCorrectionTargetDoc('proofOfResidency');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold hover:bg-amber-200 text-[11px]"
                              >
                                Request Correction
                              </button>

                              {/* Reject Button */}
                              {app.status !== 'REJECTED' && (
                                <button
                                  type="button"
                                  onClick={() => handleAdminReject(app.id)}
                                  className="px-2 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold"
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: HIGH-RES DOCUMENT PREVIEW (WITHOUT DOWNLOADING)                 */}
      {/* ========================================================================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <FileText className="text-blue-600" size={20} />
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">{previewDoc.title}</h3>
                  <p className="text-[11px] text-slate-400">{previewDoc.doc.name} • {previewDoc.doc.size}</p>
                </div>
              </div>
            </div>

            {/* Document Render Canvas */}
            <div className="flex-1 overflow-auto rounded-2xl bg-slate-100 dark:bg-slate-950 p-4 flex items-center justify-center min-h-[350px]">
              {previewDoc.doc.previewUrl.endsWith('.pdf') || previewDoc.doc.type === 'application/pdf' ? (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                    <FileText size={32} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    PDF Document Preview Active
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm">
                    {previewDoc.doc.name} — Encrypted municipal archival format.
                  </p>
                  <img
                    src="/New Application.jpg"
                    alt="Document Scan Render"
                    className="max-h-[300px] mx-auto rounded-xl shadow-md border object-contain"
                  />
                </div>
              ) : (
                <img
                  src={previewDoc.doc.previewUrl}
                  alt={previewDoc.doc.name}
                  className="max-h-[500px] w-auto max-w-full rounded-xl shadow-md object-contain"
                />
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-500">Document authenticated through GovServe Security Gate</span>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REQUEST CORRECTION DIALOG (FOR ADMIN)                           */}
      {/* ========================================================================= */}
      {correctionModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2 text-amber-600 font-black text-sm">
                <AlertTriangle size={18} />
                <span>Request Document Correction</span>
              </div>
              <button
                onClick={() => setCorrectionModalApp(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                Specify which uploaded document requires replacement by the applicant (<strong>{correctionModalApp.applicantName}</strong>):
              </p>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Document Requiring Replacement:
                </label>
                <select
                  value={correctionTargetDoc}
                  onChange={(e) => setCorrectionTargetDoc(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold outline-none text-xs"
                >
                  <option value="proofOfResidency">Proof of Residency</option>
                  <option value="validId">Valid Government ID</option>
                  <option value="cedula">Cedula / Community Tax Certificate</option>
                  <option value="endorsement">Barangay Endorsement</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Explanation to Applicant:
                </label>
                <textarea
                  rows={3}
                  value={correctionMessage}
                  onChange={(e) => setCorrectionMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium outline-none"
                  placeholder="e.g. Your uploaded document is cut off or blurry. Please upload a clearer copy."
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setCorrectionModalApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdminSubmitCorrection}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20"
              >
                Send Correction Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: VIEW FULL APPLICATION DETAILS (FOR ADMIN)                       */}
      {/* ========================================================================= */}
      {viewApplicationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">{viewApplicationModal.refNumber}</span>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Barangay Clearance File: {viewApplicationModal.applicantName}
                </h3>
              </div>
              <button
                onClick={() => setViewApplicationModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* Applicant Metadata */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Applicant:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{viewApplicationModal.applicantName}</p>
              </div>
              <div>
                <span className="text-slate-400">Purpose:</span>
                <p className="font-bold text-blue-600 mt-0.5">{viewApplicationModal.purpose}</p>
              </div>
              <div>
                <span className="text-slate-400">Address:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{viewApplicationModal.address}</p>
              </div>
              <div>
                <span className="text-slate-400">Contact / Email:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {viewApplicationModal.contactNumber} • {viewApplicationModal.email}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Current Status:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{viewApplicationModal.status}</p>
              </div>
              <div>
                <span className="text-slate-400">Reviewed By:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{viewApplicationModal.reviewedBy || 'Pending'}</p>
              </div>
            </div>

            {/* Documents Preview Grid */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Uploaded Documents (Click to Inspect)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Valid Gov ID', doc: viewApplicationModal.documents.validId },
                  { label: 'Proof of Residency', doc: viewApplicationModal.documents.proofOfResidency },
                  { label: 'Cedula CTC', doc: viewApplicationModal.documents.cedula },
                  {
                    label: 'Endorsement',
                    doc: viewApplicationModal.documents.endorsement,
                    na: viewApplicationModal.documents.endorsementNotApplicable
                  },
                ].map((d, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (d.doc) setPreviewDoc({ title: d.label, doc: d.doc });
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      d.doc
                        ? 'bg-white dark:bg-slate-800 hover:border-blue-500 border-slate-200 dark:border-slate-700'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-dashed border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-bold block text-slate-800 dark:text-slate-200">{d.label}</span>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {d.na ? 'Marked as Not Applicable' : d.doc ? d.doc.name : 'Missing'}
                      </span>
                    </div>
                    {d.doc && <Eye size={14} className="text-blue-600 shrink-0 ml-2" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Remarks note */}
            {viewApplicationModal.remarks && (
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs">
                <span className="font-bold text-blue-900 dark:text-blue-300 block mb-0.5">Remarks / Audit Note:</span>
                <p className="text-slate-700 dark:text-slate-300">{viewApplicationModal.remarks}</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setViewApplicationModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAdminApprove(viewApplicationModal.id);
                  setViewApplicationModal(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
              >
                Approve &amp; Release Clearance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: OFFICIAL APPLICATION RECEIPT / DIGITAL CLEARANCE CERTIFICATE    */}
      {/* ========================================================================= */}
      {showReceiptModal && (lastSubmittedApp || trackedRecord) && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden">
            
            {/* Header with Government Seal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <img src="/government-logo.png" alt="QC Logo" className="w-12 h-12 object-contain" />
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wide">REPUBLIC OF THE PHILIPPINES</h3>
                  <h4 className="font-extrabold text-xs text-blue-900">BARANGAY CLEARANCE CERTIFICATION RECEIPT</h4>
                  <p className="text-[10px] text-slate-500">Quezon City • GovServe Digital Services</p>
                </div>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* Certificate Details */}
            {(() => {
              const app = lastSubmittedApp || trackedRecord!;
              return (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-900 block">APPLICATION REFERENCE</span>
                      <span className="font-mono font-black text-base text-blue-700">{app.refNumber}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase text-blue-900 block">STATUS</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white">
                        {app.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Applicant Name:</span>
                      <span className="font-bold text-slate-900">{app.applicantName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Purpose:</span>
                      <span className="font-bold text-slate-900">{app.purpose}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Address:</span>
                      <span className="font-bold text-slate-900">{app.address}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Date Filed:</span>
                      <span className="font-bold text-slate-900">{app.dateSubmitted}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Fee Assessment:</span>
                      <span className="font-bold text-emerald-600">₱100.00 (PAID / WAIVED)</span>
                    </div>
                  </div>

                  {/* QR Security Stamp */}
                  <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-xl border flex items-center justify-center p-1">
                        <QrCode size={36} className="text-slate-900" />
                      </div>
                      <div>
                        <span className="font-black text-[11px] block">CRYPTOGRAPHIC QR SEAL</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          SHA256-{app.refNumber.replace(/[^A-Z0-9]/g, '')}-VERIFIED
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                      OFFICIAL COPY
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Print & Close */}
            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <Printer size={14} />
                <span>Print Official Document</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
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

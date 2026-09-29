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
  Info,
  HardHat,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { TabType } from '../types';

export type BarangayServiceKey = 'clearance' | 'residency_event' | 'cedula' | 'construction';

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

export interface ServiceDocDef {
  key: string;
  title: string;
  subtitle: string;
  iconType: 'id' | 'home' | 'map' | 'file' | 'building' | 'users' | 'wallet' | 'calendar' | 'hardhat';
  required: boolean;
  acceptedFormats: string;
  hint: string;
}

export interface ServiceDef {
  key: BarangayServiceKey;
  title: string;
  badge: string;
  themeColor: 'blue' | 'purple' | 'emerald' | 'amber';
  buttonLabel: string;
  documents: ServiceDocDef[];
}

export const BARANGAY_SERVICES: Record<BarangayServiceKey, ServiceDef> = {
  clearance: {
    key: 'clearance',
    title: 'Barangay Permit Integration',
    badge: 'Official Barangay Clearance',
    themeColor: 'blue',
    buttonLabel: 'Request Barangay Clearance →',
    documents: [
      {
        key: 'validId',
        title: 'Valid Government ID',
        subtitle: 'PhilSys National ID, Passport, Driver\'s License, UMID, or Postal ID',
        iconType: 'id',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Take a clear photo of your government-issued ID. Name and picture must be clear.'
      },
      {
        key: 'proofOfResidency',
        title: 'Proof of Residency',
        subtitle: 'Utility Bill (Meralco / Maynilad), Notarized Lease, or Certificate from HOA',
        iconType: 'home',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Upload your latest utility bill or lease contract with your barangay address.'
      },
      {
        key: 'cedula',
        title: 'Cedula / CTC',
        subtitle: 'Current year Community Tax Certificate Form 0016',
        iconType: 'file',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Upload your current year Cedula issued by City/Municipal Treasury or Barangay.'
      },
      {
        key: 'endorsement',
        title: 'Barangay Endorsement',
        subtitle: 'Lupon clearance, HOA endorsement, or Kagawad referral',
        iconType: 'building',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Upload endorsement letter from your homeowner association or local Purok / Kagawad.'
      }
    ]
  },
  residency_event: {
    key: 'residency_event',
    title: 'Barangay Residency & Event Clearance',
    badge: 'Community Pass & Event Permit',
    themeColor: 'purple',
    buttonLabel: 'Request Residency & Event Pass →',
    documents: [
      {
        key: 'validId',
        title: 'Valid Government ID',
        subtitle: 'Government ID of applicant, resident, or event organizer',
        iconType: 'id',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Take a clear photo of your government-issued ID. Make sure text is readable.'
      },
      {
        key: 'proofOfAddress',
        title: 'Proof of Address',
        subtitle: 'Recent billing statement, barangay address record, or utility receipt',
        iconType: 'map',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Upload proof of address establishing your residence in this barangay.'
      },
      {
        key: 'proofOfResidency',
        title: 'Residency Proof',
        subtitle: '6-Month Certificate of Residency or Notarized Tenancy Agreement',
        iconType: 'home',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Upload proof of at least 6 months continuous residency in the barangay.'
      },
      {
        key: 'eventDoc',
        title: 'Event Itinerary / Event Document',
        subtitle: 'Activity program, street pass request, or tournament schedule',
        iconType: 'calendar',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Upload event itinerary, safety protocol, or program outline for the activity.'
      }
    ]
  },
  cedula: {
    key: 'cedula',
    title: 'Community Tax Certificate (Cedula CTC)',
    badge: 'Instant Municipal Tax Assessment',
    themeColor: 'emerald',
    buttonLabel: 'File Instant Cedula (CTC) →',
    documents: [
      {
        key: 'validId',
        title: 'Valid Government ID',
        subtitle: 'PhilSys National ID, Driver\'s License, Passport, or UMID',
        iconType: 'id',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Take a clear photo of your primary government ID for identity & age validation.'
      },
      {
        key: 'incomeProof',
        title: 'Proof of Income',
        subtitle: 'Recent payslip, Certificate of Compensation, or Income Declaration',
        iconType: 'wallet',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Upload payslip, ITR, or income declaration for accurate automated tax assessment.'
      },
      {
        key: 'prevCedula',
        title: 'Previous Cedula CTC',
        subtitle: 'Prior year Community Tax Certificate receipt (if applicable)',
        iconType: 'file',
        required: false, // OPTIONAL
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Optional: Upload last year\'s Cedula to expedite prior year record matching.'
      },
      {
        key: 'bir2316',
        title: 'BIR Form 2316',
        subtitle: 'Certificate of Compensation Payment / Tax Withheld (if employed)',
        iconType: 'file',
        required: false, // OPTIONAL
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Optional: Upload BIR Form 2316 for automated compensation verification.'
      }
    ]
  },
  construction: {
    key: 'construction',
    title: 'Barangay Construction Endorsement',
    badge: 'Local Building & Renovation Concurrence',
    themeColor: 'amber',
    buttonLabel: 'Apply for Construction Endorsement →',
    documents: [
      {
        key: 'siteSketch',
        title: 'Site Sketch Plan',
        subtitle: 'Architectural / structural location map and boundary sketch',
        iconType: 'map',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Upload readable sketch or blueprint plan highlighting property bounds and street access.'
      },
      {
        key: 'lotTitle',
        title: 'Lot Title / TCT',
        subtitle: 'Transfer Certificate of Title (TCT) or Tax Declaration of Real Property',
        iconType: 'home',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Upload the registered lot title or certified true copy of property tax declaration.'
      },
      {
        key: 'neighborConsent',
        title: 'Neighbor Consent',
        subtitle: 'Signed consent agreement from adjacent lot and homeowner neighbors',
        iconType: 'users',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Upload signed concurrence statements from immediate left, right, and rear lot neighbors.'
      },
      {
        key: 'contractorId',
        title: 'Contractor ID',
        subtitle: 'PCAB license or professional PRC ID of lead contractor / engineer',
        iconType: 'hardhat',
        required: true,
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Upload photo of PRC engineer license or PCAB contractor accreditation card.'
      },
      {
        key: 'constructionDocs',
        title: 'Construction-Related Documents',
        subtitle: 'Scope of work, excavation clearance, or road access plan',
        iconType: 'building',
        required: false, // OPTIONAL
        acceptedFormats: 'JPG, PNG, PDF',
        hint: 'Optional: Upload project timeline, safety hazard plan, or debris disposal permit.'
      }
    ]
  }
};

export interface BarangayApplicationRecord {
  id: string;
  refNumber: string;
  serviceCategory: BarangayServiceKey;
  serviceTitle: string;
  applicantName: string;
  address: string;
  contactNumber: string;
  email: string;
  purpose: string;
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
  documents: Record<string, UploadedDoc | null>;
  remarks?: string;
  correctionRequestedDoc?: string | null;
  reviewedBy?: string;
}

const STORAGE_KEY = 'govserve_barangay_clearance_applications_v2';

const INITIAL_APPLICATIONS: BarangayApplicationRecord[] = [
  {
    id: 'brgy-app-1',
    refNumber: 'BC-QC-2026-08129',
    serviceCategory: 'clearance',
    serviceTitle: 'Barangay Permit Integration',
    applicantName: 'Juan Miguel Dela Cruz',
    address: 'Block 12 Lot 4, Dahlia St., Brgy. Fairview, Quezon City',
    contactNumber: '09175551234',
    email: 'juan.delacruz@example.com',
    purpose: 'Employment & Business Filing',
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
      endorsement: {
        id: 'doc-end-1',
        name: 'HOA_Clearance_Endorsement.pdf',
        size: '1.1 MB',
        type: 'application/pdf',
        previewUrl: '/Amendment.jpg',
        uploadDate: 'Sep 28, 2026',
        status: 'verified'
      }
    },
    remarks: 'Verified clean Lupon blotter record. Clearance generated with digital seal.',
    reviewedBy: 'Hon. Danilo Morales'
  },
  {
    id: 'brgy-app-2',
    refNumber: 'BR-QC-2026-04910',
    serviceCategory: 'residency_event',
    serviceTitle: 'Barangay Residency & Event Clearance',
    applicantName: 'Maria Clara Santos',
    address: 'Unit 3B, Sunshine Residences, Brgy. Batasan Hills, Quezon City',
    contactNumber: '09187774433',
    email: 'maria.santos@example.com',
    purpose: 'Community Outreach & Street Bazaar',
    status: 'NEEDS CORRECTION',
    dateSubmitted: 'Sep 29, 2026',
    estimatedTime: 'Action Required',
    documents: {
      validId: {
        id: 'doc-id-2',
        name: 'UMID_Card_Santos.jpg',
        size: '2.1 MB',
        type: 'image/jpeg',
        previewUrl: '/Amendment.jpg',
        uploadDate: 'Sep 29, 2026',
        status: 'verified'
      },
      proofOfAddress: {
        id: 'doc-addr-2',
        name: 'Water_Bill_Blury_August.jpg',
        size: '1.9 MB',
        type: 'image/jpeg',
        previewUrl: '/New Application.jpg',
        uploadDate: 'Sep 29, 2026',
        isBlurry: true,
        status: 'needs_replacement'
      },
      proofOfResidency: {
        id: 'doc-res-2',
        name: 'Certificate_Residency_HOA.pdf',
        size: '1.4 MB',
        type: 'application/pdf',
        previewUrl: '/Renewal.jpg',
        uploadDate: 'Sep 29, 2026',
        status: 'verified'
      },
      eventDoc: {
        id: 'doc-eve-2',
        name: 'Event_Itinerary_Bazaar_Program.pdf',
        size: '2.2 MB',
        type: 'application/pdf',
        previewUrl: '/Special Permit.jpg',
        uploadDate: 'Sep 29, 2026',
        status: 'verified'
      }
    },
    remarks: 'Action Required: Please replace Proof of Address. The uploaded water bill is blurry and address is unreadable.',
    correctionRequestedDoc: 'proofOfAddress',
    reviewedBy: 'Barangay Officer Roberto'
  },
  {
    id: 'brgy-app-3',
    refNumber: 'CT-QC-2026-01582',
    serviceCategory: 'cedula',
    serviceTitle: 'Community Tax Certificate (Cedula CTC)',
    applicantName: 'Ferdinand Gomez Ramos',
    address: '45 Commonwealth Ave, Brgy. Commonwealth, Quezon City',
    contactNumber: '09201237890',
    email: 'ferdinand.ramos@example.com',
    purpose: 'Cedula CTC Instant Filing',
    status: 'FOR VERIFICATION',
    dateSubmitted: 'Sep 30, 2026',
    estimatedTime: '1 - 2 hours',
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
      incomeProof: {
        id: 'doc-inc-3',
        name: 'Payslip_September2026.pdf',
        size: '1.7 MB',
        type: 'application/pdf',
        previewUrl: '/Renewal.jpg',
        uploadDate: 'Sep 30, 2026',
        status: 'verified'
      },
      prevCedula: null,
      bir2316: null
    },
    remarks: 'Under gross salary and business tax assessment audit.',
    reviewedBy: 'Treasurer Assistant Maria'
  },
  {
    id: 'brgy-app-4',
    refNumber: 'CE-QC-2026-09241',
    serviceCategory: 'construction',
    serviceTitle: 'Barangay Construction Endorsement',
    applicantName: 'Engr. Arnold Bautista',
    address: '77 Quirino Highway, Brgy. Novaliches, Quezon City',
    contactNumber: '09198882211',
    email: 'arnold.bautista@example.com',
    purpose: 'Residential 2-Storey Renovation',
    status: 'APPROVED',
    dateSubmitted: 'Sep 29, 2026',
    estimatedTime: 'Approved',
    documents: {
      siteSketch: {
        id: 'doc-ssk-4',
        name: 'Site_Sketch_Blueprint_Plan.pdf',
        size: '4.2 MB',
        type: 'application/pdf',
        previewUrl: '/Special Permit.jpg',
        uploadDate: 'Sep 29, 2026',
        status: 'verified'
      },
      lotTitle: {
        id: 'doc-lot-4',
        name: 'TCT_Title_No_991823.pdf',
        size: '3.1 MB',
        type: 'application/pdf',
        previewUrl: '/New Application.jpg',
        uploadDate: 'Sep 29, 2026',
        status: 'verified'
      },
      neighborConsent: {
        id: 'doc-nc-4',
        name: 'Signed_Neighbor_Concurrence.pdf',
        size: '1.8 MB',
        type: 'application/pdf',
        previewUrl: '/Renewal.jpg',
        uploadDate: 'Sep 29, 2026',
        status: 'verified'
      },
      contractorId: {
        id: 'doc-prc-4',
        name: 'PCAB_License_PRC_Engineer.jpg',
        size: '1.9 MB',
        type: 'image/jpeg',
        previewUrl: '/Amendment.jpg',
        uploadDate: 'Sep 29, 2026',
        status: 'verified'
      },
      constructionDocs: null
    },
    remarks: 'Site inspection completed by Barangay Kagawad on Infrastructure. Cleared for release.',
    reviewedBy: 'Engr. Dante Villanueva'
  }
];

interface BarangayClearanceApplicationSystemProps {
  onBack?: () => void;
  onNavigateToTab?: (tab: TabType | string) => void;
  onAddNewApplication?: (applicantName: string, permitType: string) => void;
  initialMode?: 'apply' | 'track' | 'admin';
  initialServiceCategory?: BarangayServiceKey;
}

export const BarangayClearanceApplicationSystem: React.FC<BarangayClearanceApplicationSystemProps> = ({
  onBack,
  onNavigateToTab,
  onAddNewApplication,
  initialMode = 'apply',
  initialServiceCategory = 'clearance'
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isAdmin = user?.role === 'admin';

  // Active service selection (clearance | residency_event | cedula | construction)
  const [selectedService, setSelectedService] = useState<BarangayServiceKey>(initialServiceCategory);
  const activeServiceDef = BARANGAY_SERVICES[selectedService];

  // Navigation mode: 'apply' | 'review' | 'track' | 'admin' | 'confirmation'
  const [activeView, setActiveView] = useState<'apply' | 'review' | 'track' | 'admin' | 'confirmation'>(
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
  // DYNAMIC UPLOAD STATE FOR THE SELECTED SERVICE
  // -------------------------------------------------------------
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDoc | null>>({});
  const [docValidation, setDocValidation] = useState<Record<string, { readable: boolean; blurry: boolean; message: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastSubmittedApp, setLastSubmittedApp] = useState<BarangayApplicationRecord | null>(null);

  // Auto-populated applicant details from Valid ID (OCR Simulation)
  const [fullName, setFullName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('09175559988');
  const [emailAddress, setEmailAddress] = useState<string>(user?.email || '');
  const [ocrScanning, setOcrScanning] = useState<boolean>(false);
  const [ocrSuccess, setOcrSuccess] = useState<boolean>(false);

  // Tracker State
  const [trackQuery, setTrackQuery] = useState<string>('BC-QC-2026-08129');
  const [trackedRecord, setTrackedRecord] = useState<BarangayApplicationRecord | null>(applications[0]);
  const [replacementDocTarget, setReplacementDocTarget] = useState<string | null>(null);

  // Admin Dashboard State
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('All');
  const [adminServiceFilter, setAdminServiceFilter] = useState<string>('All');
  const [correctionModalApp, setCorrectionModalApp] = useState<BarangayApplicationRecord | null>(null);
  const [correctionTargetDoc, setCorrectionTargetDoc] = useState<string>('');
  const [correctionMessage, setCorrectionMessage] = useState<string>('The document is blurry or text is difficult to read. Please upload a clear photo or PDF.');
  const [viewApplicationModal, setViewApplicationModal] = useState<BarangayApplicationRecord | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // File Inputs Refs
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const cameraInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Reset uploads when changing services
  useEffect(() => {
    setUploadedDocs({});
    setDocValidation({});
    setOcrSuccess(false);
  }, [selectedService]);

  // Helper: Get Icon Component
  const renderDocIcon = (iconType: ServiceDocDef['iconType']) => {
    switch (iconType) {
      case 'id':
        return <Camera size={22} className="text-blue-500" />;
      case 'home':
        return <Home size={22} className="text-emerald-500" />;
      case 'map':
        return <MapPin size={22} className="text-purple-500" />;
      case 'file':
        return <FileText size={22} className="text-sky-500" />;
      case 'building':
        return <Building size={22} className="text-amber-500" />;
      case 'users':
        return <Users size={22} className="text-indigo-500" />;
      case 'wallet':
        return <Banknote size={22} className="text-emerald-500" />;
      case 'calendar':
        return <Calendar size={22} className="text-rose-500" />;
      case 'hardhat':
        return <HardHat size={22} className="text-amber-500" />;
      default:
        return <FileText size={22} className="text-blue-500" />;
    }
  };

  // -------------------------------------------------------------
  // SMART DOCUMENT UPLOAD & VALIDATION HANDLER
  // -------------------------------------------------------------
  const handleFileUpload = (docKey: string, file: File) => {
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    if (!acceptedTypes.includes(file.type)) {
      showToast('Oops! This file cannot be uploaded. Please use JPG, PNG, or PDF.', 'error');
      return;
    }

    if (file.size > maxSizeBytes) {
      showToast('File too large! Please upload a document smaller than 10MB.', 'error');
      return;
    }

    // Size formatting
    const sizeStr = file.size < 1024 * 1024 
      ? `${(file.size / 1024).toFixed(1)} KB` 
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    // Preview URL
    const isImage = file.type.startsWith('image/');
    const previewUrl = isImage ? URL.createObjectURL(file) : '/Renewal.jpg';

    // Smart Image Quality Checking Simulation
    const isPotentiallyBlurry = file.name.toLowerCase().includes('blurry') || file.size < 15 * 1024;

    const newDoc: UploadedDoc = {
      id: `doc-${docKey}-${Date.now()}`,
      name: file.name,
      size: sizeStr,
      type: file.type,
      previewUrl,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isBlurry: isPotentiallyBlurry,
      status: isPotentiallyBlurry ? 'needs_replacement' : 'uploaded'
    };

    setUploadedDocs(prev => ({ ...prev, [docKey]: newDoc }));

    if (isPotentiallyBlurry) {
      setDocValidation(prev => ({
        ...prev,
        [docKey]: {
          readable: false,
          blurry: true,
          message: '⚠ Your photo looks a little blurry. Please take another photo with better lighting.'
        }
      }));
      showToast('⚠ Your photo looks a little blurry. Please take another photo with better lighting.', 'warning');
    } else {
      setDocValidation(prev => ({
        ...prev,
        [docKey]: {
          readable: true,
          blurry: false,
          message: '✓ Document looks good! You can continue to the next step.'
        }
      }));
      showToast('✓ Document received! Looks sharp and readable.', 'success');
    }

    // If uploading Valid ID, trigger Smart OCR Auto-Extraction
    if (docKey === 'validId' && !isPotentiallyBlurry) {
      setOcrScanning(true);
      setTimeout(() => {
        setOcrScanning(false);
        setOcrSuccess(true);
        if (!fullName) setFullName('Jason Taccad');
        if (!address) setAddress('Quezon City, Metro Manila');
        if (!contactNumber) setContactNumber('09175559988');
        if (!emailAddress && user?.email) setEmailAddress(user.email);
        showToast('✓ Auto-extracted applicant info from Valid ID! No manual typing needed.', 'success');
      }, 1100);
    }
  };

  // Replacement handler from Tracker Action Required
  const handleReplacementUpload = (file: File) => {
    if (!trackedRecord || !replacementDocTarget) return;

    const sizeStr = file.size < 1024 * 1024 
      ? `${(file.size / 1024).toFixed(1)} KB` 
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    const newDoc: UploadedDoc = {
      id: `doc-rep-${Date.now()}`,
      name: file.name,
      size: sizeStr,
      type: file.type,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '/Renewal.jpg',
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'uploaded'
    };

    const updatedDocuments = {
      ...trackedRecord.documents,
      [replacementDocTarget]: newDoc
    };

    const updatedRecord: BarangayApplicationRecord = {
      ...trackedRecord,
      documents: updatedDocuments,
      status: 'FOR VERIFICATION',
      remarks: 'Updated document received. Queued for expedited barangay re-verification.',
      correctionRequestedDoc: null
    };

    setTrackedRecord(updatedRecord);
    setApplications(prev => prev.map(a => a.id === updatedRecord.id ? updatedRecord : a));
    setReplacementDocTarget(null);
    showToast('✓ Upload complete! Replacement document submitted for verification.', 'success');
  };

  // Check required documents completeness
  const requiredDocs = activeServiceDef.documents.filter(d => d.required);
  const missingRequiredDocs = requiredDocs.filter(d => !uploadedDocs[d.key]);
  const isAllRequiredUploaded = missingRequiredDocs.length === 0;

  // Final Submit Handler
  const handleFinalSubmit = () => {
    if (!isAllRequiredUploaded) {
      showToast(`Please upload: ${missingRequiredDocs.map(d => d.title).join(', ')} to continue.`, 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedRef = `BRGY-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const newApp: BarangayApplicationRecord = {
        id: `brgy-app-${Date.now()}`,
        refNumber: generatedRef,
        serviceCategory: selectedService,
        serviceTitle: activeServiceDef.title,
        applicantName: fullName.trim() || 'Jason Taccad',
        address: address.trim() || 'Quezon City, Metro Manila',
        contactNumber: contactNumber.trim() || '09175559988',
        email: emailAddress.trim() || user?.email || 'applicant@example.com',
        purpose: activeServiceDef.title,
        status: 'SUBMITTED',
        dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        estimatedTime: 'Same-day to 1 working day',
        documents: { ...uploadedDocs },
        remarks: 'New upload-based application submitted. Under document review.',
        reviewedBy: 'Barangay Verification Officer'
      };

      setApplications(prev => [newApp, ...prev]);
      setLastSubmittedApp(newApp);
      setTrackedRecord(newApp);
      setTrackQuery(generatedRef);
      setIsSubmitting(false);
      setActiveView('confirmation');

      if (onAddNewApplication) {
        onAddNewApplication(newApp.applicantName, activeServiceDef.title);
      }

      showToast('✓ Application submitted successfully!', 'success');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`px-5 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-bold flex items-center space-x-2.5 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-500 shadow-emerald-900/30'
                : toast.type === 'error'
                ? 'bg-rose-900/90 text-white border-rose-500 shadow-rose-900/30'
                : toast.type === 'warning'
                ? 'bg-amber-900/90 text-white border-amber-500 shadow-amber-900/30'
                : 'bg-blue-900/90 text-white border-blue-500 shadow-blue-900/30'
            }`}
          >
            <Sparkles size={16} />
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-75 cursor-pointer">
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12">
        
        {/* ========================================================================= */}
        {/* VIEW 1: UPLOAD DOCUMENTS (VERY USER-FRIENDLY, UPLOAD-BASED APPLICATION)   */}
        {/* ========================================================================= */}
        {activeView === 'apply' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
            
            {/* Header & Step Progress Bar */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      STEP 1 OF 4: UPLOAD DOCUMENTS
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Upload-Based Application</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {activeServiceDef.title}
                  </h2>
                </div>

                {/* Service Selector Tabs if citizen wants to switch service */}
                <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-[11px] font-bold overflow-x-auto">
                  {(['clearance', 'residency_event', 'cedula', 'construction'] as BarangayServiceKey[]).map(key => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedService(key)}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        selectedService === key
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {key === 'clearance' && 'Barangay Clearance'}
                      {key === 'residency_event' && 'Residency & Event'}
                      {key === 'cedula' && 'Cedula (CTC)'}
                      {key === 'construction' && 'Construction'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Indicator: 1 Upload Documents -> 2 Review -> 3 Submit -> 4 Track */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { num: 1, label: 'Upload Documents', active: true, done: false },
                  { num: 2, label: 'Review', active: false, done: false },
                  { num: 3, label: 'Submit', active: false, done: false },
                  { num: 4, label: 'Track Application', active: false, done: false }
                ].map(step => (
                  <div
                    key={step.num}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-center border transition-all ${
                      step.active
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider">Step {step.num}</span>
                    <span className="text-xs font-extrabold truncate w-full mt-0.5">{step.label}</span>
                  </div>
                ))}
              </div>

              {/* Friendly Instruction Banner */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/70 flex items-start space-x-3 text-xs text-blue-900 dark:text-blue-200">
                <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black block">Take a clear photo of your document and upload it here.</span>
                  <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 mt-0.5">
                    No long forms required! Your details will be automatically read from your uploaded documents. Supported formats: JPG, PNG, PDF (Max 10MB).
                  </p>
                </div>
              </div>
            </div>

            {/* Smart OCR Auto-Extraction Preview (Minimizes manual typing) */}
            {ocrScanning && (
              <div className="p-4 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center space-x-3 text-xs text-blue-700 dark:text-blue-300 animate-pulse">
                <RefreshCw size={16} className="animate-spin text-blue-600" />
                <span>Reading document details from your uploaded Valid ID...</span>
              </div>
            )}

            {ocrSuccess && (
              <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-black text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Auto-Extracted from ID (No typing needed)</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  {/* Full Name */}
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Applicant Name"
                        className="w-full pl-3 pr-8 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-white text-xs outline-none"
                      />
                      {fullName && (
                        <button
                          type="button"
                          onClick={() => setFullName('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Contact Number (11 digits only)</label>
                    <div className="relative">
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={11}
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        placeholder="09171234567"
                        className="w-full pl-3 pr-8 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-white text-xs outline-none"
                      />
                      {contactNumber && (
                        <button
                          type="button"
                          onClick={() => setContactNumber('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2 relative">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Residential Address</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Residential Address"
                        className="w-full pl-3 pr-8 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-white text-xs outline-none"
                      />
                      {address && (
                        <button
                          type="button"
                          onClick={() => setAddress('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* List of Large Document Upload Areas */}
            <div className="space-y-5">
              {activeServiceDef.documents.map((docDef) => {
                const uploaded = uploadedDocs[docDef.key];
                const validation = docValidation[docDef.key];

                return (
                  <div
                    key={docDef.key}
                    className={`bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border transition-all ${
                      uploaded 
                        ? 'border-emerald-300 dark:border-emerald-800/80 shadow-sm' 
                        : 'border-slate-200 dark:border-slate-800 shadow-xs'
                    }`}
                  >
                    {/* Header of Document Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                          {renderDocIcon(docDef.iconType)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                              {docDef.title}
                            </h3>
                            {docDef.required ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                                Required
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                OPTIONAL
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {docDef.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Status indicator */}
                      {uploaded ? (
                        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold shrink-0 self-start sm:self-center">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span>✓ Uploaded</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-semibold self-start sm:self-center">
                          {docDef.acceptedFormats}
                        </span>
                      )}
                    </div>

                    {/* Card Body: Not uploaded yet */}
                    {!uploaded ? (
                      <div className="pt-5 space-y-4">
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleFileUpload(docDef.key, e.dataTransfer.files[0]);
                            }
                          }}
                          className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 sm:p-8 text-center transition-all group bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer"
                          onClick={() => fileInputRefs.current[docDef.key]?.click()}
                        >
                          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                            <Upload size={28} />
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            Drag and drop your file here, or click to browse
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                            {docDef.hint}
                          </p>

                          {/* Action Buttons: Upload Picture & Take Photo */}
                          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRefs.current[docDef.key]?.click();
                              }}
                              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                            >
                              <Upload size={14} />
                              <span>+ Upload Picture</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                cameraInputRefs.current[docDef.key]?.click();
                              }}
                              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all border border-slate-200 dark:border-slate-700 active:scale-[0.98]"
                            >
                              <Camera size={14} />
                              <span>Take Photo</span>
                            </button>
                          </div>
                        </div>

                        {/* Hidden Inputs */}
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[docDef.key] = el;
                          }}
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(docDef.key, e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                        <input
                          type="file"
                          ref={(el) => {
                            cameraInputRefs.current[docDef.key] = el;
                          }}
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(docDef.key, e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      /* Card Body: Already Uploaded */
                      <div className="pt-4 space-y-4">
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          
                          {/* Thumbnail & File Details */}
                          <div className="flex items-center space-x-3.5">
                            <div 
                              onClick={() => setPreviewDoc({ title: docDef.title, doc: uploaded })}
                              className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-600 relative group cursor-pointer"
                            >
                              {uploaded.type.startsWith('image/') ? (
                                <img src={uploaded.previewUrl} alt={uploaded.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                  <FileText size={24} />
                                  <span className="text-[9px] font-bold mt-0.5">PDF</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <Eye size={16} />
                              </div>
                            </div>

                            <div className="min-w-0">
                              <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate block max-w-xs sm:max-w-md">
                                {uploaded.name}
                              </span>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {uploaded.size} • Uploaded on {uploaded.uploadDate}
                              </p>
                              
                              {/* Smart Check Status Tag */}
                              {validation && (
                                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold">
                                  {validation.blurry ? (
                                    <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                                      <AlertTriangle size={12} />
                                      {validation.message}
                                    </span>
                                  ) : (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                      <CheckCircle2 size={12} />
                                      {validation.message}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons: Preview, Replace, Remove */}
                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setPreviewDoc({ title: docDef.title, doc: uploaded })}
                              className="px-3.5 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                            >
                              <Eye size={13} />
                              <span>View</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[docDef.key]?.click()}
                              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-blue-200 dark:border-blue-800"
                            >
                              <RefreshCw size={13} />
                              <span>Replace</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setUploadedDocs(prev => ({ ...prev, [docDef.key]: null }));
                                setDocValidation(prev => {
                                  const updated = { ...prev };
                                  delete updated[docDef.key];
                                  return updated;
                                });
                                showToast('Document removed.', 'info');
                              }}
                              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all border border-rose-200 dark:border-rose-800"
                            >
                              <Trash2 size={13} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>

                        {/* Hidden Input for Replace */}
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[docDef.key] = el;
                          }}
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(docDef.key, e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Navigation Bar */}
            <div className="pt-4 flex items-center justify-between">
              {/* Left: Back to Portal button */}
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

              {/* Right: Review Uploaded Documents */}
              <button
                type="button"
                onClick={() => {
                  if (!isAllRequiredUploaded) {
                    showToast(`Please upload: ${missingRequiredDocs.map(d => d.title).join(', ')} to continue.`, 'error');
                    return;
                  }
                  setActiveView('review');
                }}
                className={`px-6 py-3 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                  isAllRequiredUploaded
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99]'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Review Uploaded Documents →</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: REVIEW PAGE (CLEAN SUMMARY BEFORE SUBMISSION)                     */}
        {/* ========================================================================= */}
        {activeView === 'review' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
            
            {/* Header with Step Tracker */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    STEP 2 OF 4: APPLICATION REVIEW
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Review Your Application
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('apply')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Edit Uploads
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { num: 1, label: 'Upload Documents', active: false, done: true },
                  { num: 2, label: 'Review', active: true, done: false },
                  { num: 3, label: 'Submit', active: false, done: false },
                  { num: 4, label: 'Track Application', active: false, done: false }
                ].map(step => (
                  <div
                    key={step.num}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-center border transition-all ${
                      step.active
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                        : step.done
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider">Step {step.num}</span>
                    <span className="text-xs font-extrabold truncate w-full mt-0.5">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Completeness Banner */}
            {isAllRequiredUploaded ? (
              <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-3 text-xs text-emerald-800 dark:text-emerald-200">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <div>
                  <span className="font-black block">✓ All required documents uploaded!</span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Your uploads have been validated for readability. You may now submit your application.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
                <div className="flex items-center space-x-3">
                  <AlertTriangle size={20} className="text-amber-600 shrink-0" />
                  <div>
                    <span className="font-black block">⚠ Missing Required Document</span>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300">
                      Please upload: {missingRequiredDocs.map(d => d.title).join(', ')}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('apply')}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm hover:bg-amber-500 cursor-pointer"
                >
                  Upload Now
                </button>
              </div>
            )}

            {/* Applicant Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Applicant Information (Extracted)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Applicant Name</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{fullName || 'Jason Taccad'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Contact Number</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{contactNumber || '09175559988'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block font-medium">Residential Address</span>
                  <span className="font-bold text-slate-900 dark:text-white">{address || 'Quezon City, Metro Manila'}</span>
                </div>
              </div>
            </div>

            {/* Uploaded Documents List */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Uploaded Documents ({Object.values(uploadedDocs).filter(Boolean).length} Documents)
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeServiceDef.documents.map((docDef) => {
                  const uploaded = uploadedDocs[docDef.key];

                  return (
                    <div key={docDef.key} className="py-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          uploaded 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                        }`}>
                          {uploaded ? <Check size={16} /> : <AlertCircle size={16} />}
                        </div>
                        <div className="min-w-0">
                          <span className="font-black text-xs text-slate-900 dark:text-white block truncate">
                            {docDef.title}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {uploaded ? `${uploaded.name} (${uploaded.size})` : docDef.required ? 'Missing Required' : 'Not uploaded (Optional)'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {uploaded ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setPreviewDoc({ title: docDef.title, doc: uploaded })}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Eye size={12} />
                              <span>Preview</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveView('apply')}
                              className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 cursor-pointer"
                            >
                              Replace
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveView('apply')}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 cursor-pointer"
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveView('apply')}
                className="px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                ← Back to Uploads
              </button>

              <button
                type="button"
                disabled={!isAllRequiredUploaded || isSubmitting}
                onClick={handleFinalSubmit}
                className={`px-7 py-3.5 rounded-xl font-black text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 ${
                  isAllRequiredUploaded && !isSubmitting
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application →</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: SUBMISSION CONFIRMATION                                           */}
        {/* ========================================================================= */}
        {activeView === 'confirmation' && lastSubmittedApp && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-9 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
              
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  APPLICATION RECEIVED
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  ✓ APPLICATION SUBMITTED!
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Your application has been successfully submitted to the Barangay Licensing & Lupon Registry.
                </p>
              </div>

              {/* Reference Number Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-slate-400">Application Reference</span>
                  <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400">
                    {lastSubmittedApp.refNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{lastSubmittedApp.serviceTitle}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{lastSubmittedApp.applicantName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Date Submitted:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{lastSubmittedApp.dateSubmitted}</span>
                </div>
              </div>

              {/* Status Pipeline Progress Indicator */}
              <div className="space-y-2 max-w-lg mx-auto">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block text-left">
                  Verification Pipeline
                </span>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span className="text-blue-600 font-extrabold">● SUBMITTED</span>
                  <span>→ DOCUMENT REVIEW</span>
                  <span>→ VERIFICATION</span>
                  <span>→ PROCESSING</span>
                  <span>→ APPROVED</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTrackedRecord(lastSubmittedApp);
                    setTrackQuery(lastSubmittedApp.refNumber);
                    setActiveView('track');
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Track Application
                </button>

                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download size={14} />
                  <span>View Official Copy</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onBack) onBack();
                    else if (onNavigateToTab) onNavigateToTab('Home');
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  ← Back to Portal
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: APPLICATION TRACKING                                              */}
        {/* ========================================================================= */}
        {activeView === 'track' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
            
            {/* Search Header */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-full">
                    LIVE APPLICATION TRACKER
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Track Your Barangay Application
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveView('apply')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                >
                  + New Application
                </button>
              </div>

              {/* Search Box */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="Enter Reference Number (e.g. BC-QC-2026-08129)"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm font-mono font-bold outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const match = applications.find(a => 
                      a.refNumber.toLowerCase() === trackQuery.trim().toLowerCase() ||
                      a.id.toLowerCase() === trackQuery.trim().toLowerCase()
                    );
                    if (match) {
                      setTrackedRecord(match);
                      showToast('✓ Record found!', 'success');
                    } else {
                      showToast('Reference number not found. Please verify and try again.', 'error');
                    }
                  }}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Track Application
                </button>
              </div>
            </div>

            {/* Tracked Record Details */}
            {trackedRecord && (
              <div className="space-y-6">
                
                {/* Status Pipeline Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Application Reference</span>
                      <h3 className="font-mono text-lg font-black text-blue-600 dark:text-blue-400">
                        {trackedRecord.refNumber}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {trackedRecord.serviceTitle} • Filed on {trackedRecord.dateSubmitted}
                      </span>
                    </div>

                    <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase self-start sm:self-center ${
                      trackedRecord.status === 'READY FOR RELEASE' || trackedRecord.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : trackedRecord.status === 'NEEDS CORRECTION'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {trackedRecord.status}
                    </span>
                  </div>

                  {/* 5-Stage Visual Progress Tracker */}
                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {[
                      { step: 'Submitted', key: 'SUBMITTED', done: true },
                      { step: 'Document Review', key: 'DOCUMENT REVIEW', done: trackedRecord.status !== 'SUBMITTED' },
                      { step: 'Verification', key: 'FOR VERIFICATION', done: ['FOR VERIFICATION', 'PROCESSING', 'APPROVED', 'READY FOR RELEASE'].includes(trackedRecord.status) },
                      { step: 'Processing', key: 'PROCESSING', done: ['PROCESSING', 'APPROVED', 'READY FOR RELEASE'].includes(trackedRecord.status) },
                      { step: 'Approved', key: 'APPROVED', done: ['APPROVED', 'READY FOR RELEASE'].includes(trackedRecord.status) }
                    ].map((st, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl text-center border text-[11px] font-bold ${
                          st.done
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <span className="block text-[10px] uppercase font-black">{st.done ? '✓' : `Stage ${idx + 1}`}</span>
                        <span className="truncate block mt-0.5">{st.step}</span>
                      </div>
                    ))}
                  </div>

                  {/* ACTION REQUIRED: Correction Banner if needed */}
                  {trackedRecord.status === 'NEEDS CORRECTION' && (
                    <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/80 space-y-3 animate-in fade-in">
                      <div className="flex items-start space-x-3 text-amber-900 dark:text-amber-200">
                        <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-black text-sm uppercase">⚠ ACTION REQUIRED</h4>
                          <p className="text-xs font-semibold mt-0.5">
                            One of your uploaded documents needs to be replaced.
                          </p>
                          <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1">
                            <strong>Reason:</strong> {trackedRecord.remarks || 'The uploaded image is unclear.'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center space-x-3">
                        <label className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/30 flex items-center gap-1.5 cursor-pointer">
                          <Camera size={14} />
                          <span>Upload New Picture</span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setReplacementDocTarget(trackedRecord.correctionRequestedDoc || 'proofOfAddress');
                                handleReplacementUpload(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Uploaded Documents List */}
                  <div className="pt-2 space-y-2">
                    <span className="text-[11px] font-black uppercase text-slate-400">Attached Documents</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(trackedRecord.documents).map(([key, doc]) => {
                        if (!doc) return null;
                        return (
                          <div
                            key={key}
                            onClick={() => setPreviewDoc({ title: key, doc })}
                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <FileText size={16} className="text-blue-500 shrink-0" />
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                {doc.name}
                              </span>
                            </div>
                            <Eye size={14} className="text-slate-400 shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Back to Portal */}
            <div className="pt-2 flex justify-start">
              <button
                type="button"
                onClick={() => {
                  if (onBack) onBack();
                  else if (onNavigateToTab) onNavigateToTab('Home');
                }}
                className="px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer shadow-xs"
              >
                ← Back to Portal
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: ADMIN DASHBOARD (MAINTAINS EXISTING DESIGN LANGUAGE)              */}
        {/* ========================================================================= */}
        {activeView === 'admin' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Admin Header */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                    BARANGAY OFFICER WORKSPACE
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Clearance &amp; Endorsement Applications
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveView('apply')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Applicant View
                  </button>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {['All', 'SUBMITTED', 'DOCUMENT REVIEW', 'FOR VERIFICATION', 'NEEDS CORRECTION', 'APPROVED', 'REJECTED'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setAdminStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      adminStatusFilter === st
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'All' ? 'All Applications' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Reference</th>
                      <th className="px-6 py-4">Applicant</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Documents</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {applications
                      .filter(app => adminStatusFilter === 'All' || app.status === adminStatusFilter)
                      .map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {app.refNumber}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-900 dark:text-white block">{app.applicantName}</span>
                            <span className="text-[11px] text-slate-400">{app.contactNumber}</span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                            {app.serviceTitle}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {app.dateSubmitted}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              app.status === 'APPROVED' || app.status === 'READY FOR RELEASE'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : app.status === 'NEEDS CORRECTION'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                              {Object.values(app.documents).filter(Boolean).map((doc, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setPreviewDoc({ title: doc!.name, doc: doc! })}
                                  className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                                  title={doc!.name}
                                >
                                  <FileText size={13} />
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* View: Previews all documents directly */}
                              <button
                                type="button"
                                onClick={() => setViewApplicationModal(app)}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 font-bold text-[11px] hover:bg-blue-100 cursor-pointer"
                              >
                                View
                              </button>

                              {/* Verify */}
                              {app.status !== 'APPROVED' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'FOR VERIFICATION' } : a));
                                    showToast(`Application ${app.refNumber} moved to Verification.`, 'info');
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 font-bold text-[11px] hover:bg-purple-100 cursor-pointer"
                                >
                                  Verify
                                </button>
                              )}

                              {/* Request Correction */}
                              <button
                                type="button"
                                onClick={() => {
                                  setCorrectionModalApp(app);
                                  setCorrectionTargetDoc(Object.keys(app.documents)[0] || 'validId');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold text-[11px] hover:bg-amber-100 cursor-pointer"
                              >
                                Request Correction
                              </button>

                              {/* Approve */}
                              {app.status !== 'APPROVED' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'APPROVED', remarks: 'Approved by Barangay Captain.' } : a));
                                    showToast(`Application ${app.refNumber} Approved!`, 'success');
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 cursor-pointer"
                                >
                                  Approve
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
      {/* MODAL 1: SINGLE DOCUMENT PREVIEW MODAL (NO X AT TOP-RIGHT AS REQUESTED)   */}
      {/* ========================================================================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white">{previewDoc.title}</h3>
                <p className="text-[11px] text-slate-400">{previewDoc.doc.name} • {previewDoc.doc.size}</p>
              </div>
            </div>

            {/* Document Render Canvas */}
            <div className="flex-1 overflow-auto rounded-2xl bg-slate-100 dark:bg-slate-950 p-4 flex items-center justify-center min-h-[350px]">
              {previewDoc.doc.previewUrl.endsWith('.pdf') || previewDoc.doc.type === 'application/pdf' ? (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto">
                    <FileText size={36} />
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    PDF Document: {previewDoc.doc.name}
                  </p>
                </div>
              ) : (
                <img
                  src={previewDoc.doc.previewUrl}
                  alt={previewDoc.title}
                  className="max-h-[500px] w-auto max-w-full rounded-xl object-contain shadow-md"
                />
              )}
            </div>

            {/* Footer with Close Preview button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">Document authenticated through GovServe Security Gate</span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADMIN VIEW APPLICATION WITH ALL DOCUMENT PREVIEWS                */}
      {/* ========================================================================= */}
      {viewApplicationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[92vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                  {viewApplicationModal.refNumber}
                </span>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  {viewApplicationModal.applicantName} — {viewApplicationModal.serviceTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewApplicationModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Document Previews directly in browser */}
            <div className="flex-1 overflow-auto space-y-4">
              <span className="text-xs font-black uppercase text-slate-400 block">Uploaded Documents (Instant Inspection)</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(viewApplicationModal.documents).map(([key, doc]) => {
                  if (!doc) return null;
                  return (
                    <div key={key} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span className="truncate">{doc.name}</span>
                        <span className="text-[10px] text-slate-400">{doc.size}</span>
                      </div>

                      <div className="h-44 rounded-xl bg-slate-200 dark:bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-300 dark:border-slate-600">
                        {doc.type.startsWith('image/') ? (
                          <img src={doc.previewUrl} alt={doc.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="text-center text-slate-400">
                            <FileText size={32} className="mx-auto" />
                            <span className="text-xs font-mono font-bold mt-1 block">PDF Document</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setPreviewDoc({ title: key, doc })}
                        className="w-full py-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 cursor-pointer"
                      >
                        Inspect Full Size
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewApplicationModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: REQUEST CORRECTION MODAL                                         */}
      {/* ========================================================================= */}
      {correctionModalApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white">Request Document Correction</h3>
                <p className="text-[11px] text-slate-400">Applicant: {correctionModalApp.applicantName}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Document to Replace</label>
                <select
                  value={correctionTargetDoc}
                  onChange={(e) => setCorrectionTargetDoc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
                >
                  {Object.keys(correctionModalApp.documents).map((docKey) => (
                    <option key={docKey} value={docKey}>{docKey}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Reason for Correction</label>
                <textarea
                  rows={3}
                  value={correctionMessage}
                  onChange={(e) => setCorrectionMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setCorrectionModalApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setApplications(prev => prev.map(a => a.id === correctionModalApp.id ? {
                    ...a,
                    status: 'NEEDS CORRECTION',
                    remarks: correctionMessage,
                    correctionRequestedDoc: correctionTargetDoc
                  } : a));
                  setCorrectionModalApp(null);
                  showToast('Correction requested and notification sent to applicant.', 'info');
                }}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/30 cursor-pointer"
              >
                Send Request
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: OFFICIAL RECEIPT / CERTIFICATE MODAL                             */}
      {/* ========================================================================= */}
      {showReceiptModal && (lastSubmittedApp || trackedRecord) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-slate-200 text-slate-900 space-y-5 max-h-[90vh] overflow-auto">
            
            {(() => {
              const app = lastSubmittedApp || trackedRecord!;
              return (
                <div className="space-y-4 text-xs font-mono">
                  <div className="text-center pb-3 border-b border-slate-200 space-y-1">
                    <img src="/government-logo.png" alt="QC Logo" className="w-12 h-12 mx-auto object-contain" />
                    <h3 className="font-black text-sm font-sans tracking-tight">BARANGAY CLEARANCE REGISTRY</h3>
                    <p className="text-[10px] text-slate-500">Quezon City Local Government Unit • Official E-Copy</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block">Reference:</span>
                      <span className="font-bold text-blue-600">{app.refNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Service:</span>
                      <span className="font-bold">{app.serviceTitle}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Applicant:</span>
                      <span className="font-bold text-slate-900 text-sm">{app.applicantName}</span>
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
                      <span className="text-slate-500 block">Status:</span>
                      <span className="font-bold text-emerald-600 font-sans">{app.status}</span>
                    </div>
                  </div>

                  {/* QR Security Seal */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 bg-white rounded-xl border flex items-center justify-center p-1">
                        <QrCode size={32} className="text-slate-900" />
                      </div>
                      <div>
                        <span className="font-black text-[11px] block font-sans">CRYPTOGRAPHIC QR SEAL</span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          SHA256-{app.refNumber.replace(/[^A-Z0-9]/g, '')}-VERIFIED
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md font-sans">
                      AUTHENTIC
                    </span>
                  </div>
                </div>
              );
            })()}

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <Printer size={14} />
                <span>Print Official Copy</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
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

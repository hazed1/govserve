import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Check,
  X,
  Eye,
  Download,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  User,
  Phone,
  ZoomIn,
  ZoomOut,
  RotateCw,
  AlertCircle,
  FileCheck,
  Truck,
  Settings,
  Hash,
  Users,
  Printer,
  ChevronRight,
  Filter,
  RefreshCw,
  HelpCircle,
  Car
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TabType } from '../types';

export type AmendmentTypeKey = 
  | 'vehicle_substitution'
  | 'plate_change'
  | 'ownership_transfer';

export interface AmendmentDocItem {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  iconName: string;
  required: boolean;
  fileName: string | null;
  fileType: string | null;
  fileSize: number | null;
  previewUrl: string | null;
  uploadedAt: string | null;
  qualityStatus: 'optimal' | 'warning_blur' | 'warning_dark' | 'warning_crop' | 'none';
  qualityMessage?: string;
  adminRemark?: string;
  status: 'pending' | 'accepted' | 'needs_correction';
}

export interface AmendmentApplication {
  id: string;
  applicationNo: string;
  franchiseNo: string;
  ownerName: string;
  contactNo: string;
  email: string;
  amendmentType: AmendmentTypeKey;
  amendmentTypeTitle: string;
  amendmentTypeDescription: string;
  dateSubmitted: string;
  status: 'Submitted' | 'Document Verification' | 'Legal Office Review' | 'Traffic Board Review' | 'Approved' | 'Needs Correction' | 'Rejected';
  statusStep: 1 | 2 | 3 | 4 | 5;
  documents: Record<string, AmendmentDocItem>;
  correctionRemarks?: string;
  defectiveDocKey?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  auditTrail: {
    action: string;
    timestamp: string;
    actor: string;
    notes?: string;
  }[];
}

const AMENDMENT_TYPES_CATALOG: {
  key: AmendmentTypeKey;
  title: string;
  description: string;
  icon: string;
  tag: string;
}[] = [
  {
    key: 'vehicle_substitution',
    title: 'Vehicle Unit Substitution',
    description: 'Replace the current vehicle unit with a newly acquired roadworthy vehicle.',
    icon: '🚐',
    tag: 'Primary Service'
  },

  {
    key: 'plate_change',
    title: 'Plate Number Change',
    description: 'Update the vehicle plate number following LTO plate issuance or renewal.',
    icon: '🔢',
    tag: 'LTO Record'
  },
  {
    key: 'ownership_transfer',
    title: 'Transfer of Ownership',
    description: 'Submit documents for legal deed of sale or transfer of franchise rights.',
    icon: '👤',
    tag: 'Legal'
  },

];

const REQUIRED_DOCS_BY_TYPE: Record<AmendmentTypeKey, {
  key: string;
  title: string;
  subtitle: string;
  iconName: string;
  required: boolean;
}[]> = {
  vehicle_substitution: [
    {
      key: 'deedOfSale',
      title: 'Deed of Sale',
      subtitle: 'Upload a clear picture of the notarized Deed of Sale or Certificate of Acquisition.',
      iconName: 'FileText',
      required: true
    },
    {
      key: 'ltoEngineCert',
      title: 'New Engine LTO Certificate',
      subtitle: 'Upload the new vehicle/engine LTO Certificate of Registration (CR) or Official Receipt (OR).',
      iconName: 'FileCheck',
      required: true
    },
    {
      key: 'vehicleInspection',
      title: 'Vehicle Inspection Photo',
      subtitle: 'Upload a clear physical inspection photo showing vehicle front, side, and body number.',
      iconName: 'Camera',
      required: true
    },
    {
      key: 'routeEndorsement',
      title: 'Route/Coop Endorsement',
      subtitle: 'Upload Board Resolution or Route Cooperative Endorsement clearance.',
      iconName: 'Users',
      required: true
    },
    {
      key: 'otherSupporting',
      title: 'Other Supporting Document',
      subtitle: 'Upload additional affidavit, ID of previous operator, or supporting clearance (optional).',
      iconName: 'Sparkles',
      required: false
    }
  ],

  plate_change: [
    {
      key: 'ltoEngineCert',
      title: 'LTO Plate Authorization',
      subtitle: 'Upload official LTO Order of Payment or New Plate Issuance receipt.',
      iconName: 'FileCheck',
      required: true
    },
    {
      key: 'deedOfSale',
      title: 'Affidavit of Loss / Surrender',
      subtitle: 'Notarized Affidavit explaining plate replacement or police clearance.',
      iconName: 'FileText',
      required: true
    },
    {
      key: 'vehicleInspection',
      title: 'Vehicle Photo with New Plate',
      subtitle: 'Physical photo showing front and rear plate attached to tricycle unit.',
      iconName: 'Camera',
      required: true
    },
    {
      key: 'routeEndorsement',
      title: 'Route/Coop Endorsement',
      subtitle: 'Route / Cooperative endorsement verifying updated vehicle plate record.',
      iconName: 'Users',
      required: true
    }
  ],
  ownership_transfer: [
    {
      key: 'deedOfSale',
      title: 'Notarized Deed of Absolute Sale',
      subtitle: 'Complete Deed of Sale transferring franchise rights from seller to buyer.',
      iconName: 'FileText',
      required: true
    },
    {
      key: 'ltoEngineCert',
      title: 'Valid Government IDs (Buyer & Seller)',
      subtitle: 'Photocopy or photo of valid IDs with 3 specimen signatures each.',
      iconName: 'User',
      required: true
    },
    {
      key: 'vehicleInspection',
      title: 'LTO OR / CR Transfer Clearance',
      subtitle: 'Updated or ongoing transfer confirmation from Land Transportation Office.',
      iconName: 'FileCheck',
      required: true
    },
    {
      key: 'routeEndorsement',
      title: 'Board Resolution of Transfer',
      subtitle: 'Board resolution approving franchise transfer to the new operator.',
      iconName: 'Users',
      required: true
    }
  ],

};

const INITIAL_MOCK_APPLICATIONS: AmendmentApplication[] = [
  {
    id: 'ams-app-001',
    applicationNo: 'AMS-2026-0038',
    franchiseNo: 'MTOP-2025-0412',
    ownerName: 'Juan Dela Cruz',
    contactNo: '+63 917 888 2941',
    email: 'citizen@govserve.ph',
    amendmentType: 'vehicle_substitution',
    amendmentTypeTitle: 'Vehicle Unit Substitution',
    amendmentTypeDescription: 'Replace the current vehicle unit with a newly acquired roadworthy vehicle.',
    dateSubmitted: '2026-09-24',
    status: 'Document Verification',
    statusStep: 2,
    reviewedBy: 'Atty. Maria Santos (Legal Office Reviewer)',
    reviewedAt: '2026-09-25 09:30 AM',
    documents: {
      deedOfSale: {
        id: 'doc-m1',
        key: 'deedOfSale',
        title: 'Deed of Sale',
        subtitle: 'Upload a clear picture of the notarized Deed of Sale or Certificate of Acquisition.',
        iconName: 'FileText',
        required: true,
        fileName: 'Deed_Of_Sale_Unit_088.jpg',
        fileType: 'image/jpeg',
        fileSize: 1240000,
        previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2026-09-24 11:20 AM',
        qualityStatus: 'optimal',
        qualityMessage: 'Clear and readable document.',
        status: 'accepted'
      },
      ltoEngineCert: {
        id: 'doc-m2',
        key: 'ltoEngineCert',
        title: 'New Engine LTO Certificate',
        subtitle: 'Upload the new vehicle/engine LTO Certificate of Registration (CR) or Official Receipt (OR).',
        iconName: 'FileCheck',
        required: true,
        fileName: 'LTO_CR_Replacement_Honda.jpg',
        fileType: 'image/jpeg',
        fileSize: 1820000,
        previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2026-09-24 11:22 AM',
        qualityStatus: 'optimal',
        qualityMessage: 'Clear and readable document.',
        status: 'accepted'
      },
      vehicleInspection: {
        id: 'doc-m3',
        key: 'vehicleInspection',
        title: 'Vehicle Inspection Photo',
        subtitle: 'Upload a clear physical inspection photo showing vehicle front, side, and body number.',
        iconName: 'Camera',
        required: true,
        fileName: 'Tricycle_Unit_Inspection_Front.jpg',
        fileType: 'image/jpeg',
        fileSize: 2450000,
        previewUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2026-09-24 11:24 AM',
        qualityStatus: 'optimal',
        qualityMessage: 'Clear physical inspection photograph.',
        status: 'accepted'
      },
      routeEndorsement: {
        id: 'doc-m4',
        key: 'routeEndorsement',
        title: 'Route/Coop Endorsement',
        subtitle: 'Upload Board Resolution or Route Cooperative Endorsement clearance.',
        iconName: 'Users',
        required: true,
        fileName: 'Route_Substitution_Concurrence.pdf',
        fileType: 'image/jpeg',
        fileSize: 950000,
        previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2026-09-24 11:25 AM',
        qualityStatus: 'optimal',
        qualityMessage: 'Valid endorsement verified.',
        status: 'accepted'
      }
    },
    auditTrail: [
      { action: 'Application Filed', timestamp: '2026-09-24 11:30 AM', actor: 'Juan Dela Cruz (Applicant)' },
      { action: 'Document Verification Started', timestamp: '2026-09-24 02:15 PM', actor: 'GovServe Intake Officer' },
      { action: 'Correction Requested', timestamp: '2026-09-25 09:30 AM', actor: 'Atty. Maria Santos (Legal Office Reviewer)', notes: 'Your Deed of Sale photo needs to be replaced with a clearer copy.' }
    ]
  },
  {
    id: 'ams-app-002',
    applicationNo: 'AMS-2026-0021',
    franchiseNo: 'MTOP-2025-1102',
    ownerName: 'Elena V. Santos',
    contactNo: '+63 920 888 9911',
    email: 'elena.santos@example.com',
    amendmentType: 'plate_change',
    amendmentTypeTitle: 'Plate Number Change',
    amendmentTypeDescription: 'Update the vehicle plate number following LTO plate issuance or renewal.',
    dateSubmitted: '2026-09-26',
    status: 'Legal Office Review',
    statusStep: 3,
    documents: {
      ltoEngineCert: {
        id: 'doc-e1',
        key: 'ltoEngineCert',
        title: 'New Engine LTO Certificate',
        subtitle: 'LTO Engine Certification',
        iconName: 'FileCheck',
        required: true,
        fileName: 'Engine_LTO_Clearance.jpg',
        fileType: 'image/jpeg',
        fileSize: 1540000,
        previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2026-09-26 08:45 AM',
        qualityStatus: 'optimal',
        status: 'accepted'
      },
      deedOfSale: {
        id: 'doc-e2',
        key: 'deedOfSale',
        title: 'Engine Sales Invoice / Deed',
        subtitle: 'Purchase Receipt',
        iconName: 'FileText',
        required: true,
        fileName: 'Honda_Engine_Official_Receipt.jpg',
        fileType: 'image/jpeg',
        fileSize: 1210000,
        previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2026-09-26 08:47 AM',
        qualityStatus: 'optimal',
        status: 'accepted'
      },
      vehicleInspection: {
        id: 'doc-e3',
        key: 'vehicleInspection',
        title: 'Engine Stenciling Photo',
        subtitle: 'Stenciled Serial',
        iconName: 'Camera',
        required: true,
        fileName: 'Engine_Stencil_Serial.jpg',
        fileType: 'image/jpeg',
        fileSize: 1980000,
        previewUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2026-09-26 08:50 AM',
        qualityStatus: 'optimal',
        status: 'accepted'
      },
      routeEndorsement: {
        id: 'doc-e4',
        key: 'routeEndorsement',
        title: 'Route/Coop Endorsement',
        subtitle: 'Coop Clearance',
        iconName: 'Users',
        required: true,
        fileName: 'Route_Endorsement.pdf',
        fileType: 'image/jpeg',
        fileSize: 890000,
        previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        uploadedAt: '2026-09-26 08:52 AM',
        qualityStatus: 'optimal',
        status: 'accepted'
      }
    },
    auditTrail: [
      { action: 'Application Filed', timestamp: '2026-09-26 09:00 AM', actor: 'Elena V. Santos' },
      { action: 'Document Verification Passed', timestamp: '2026-09-26 11:30 AM', actor: 'GovServe Intake Officer' },
      { action: 'Transmitted to Legal Office', timestamp: '2026-09-26 02:00 PM', actor: 'MTFRB Admin' }
    ]
  },
  {
    id: 'ams-app-003',
    applicationNo: 'AMS-2026-0012',
    franchiseNo: 'MTOP-2025-1490',
    ownerName: 'Danilo C. Ocampo',
    contactNo: '+63 917 444 8812',
    email: 'danilo.ocampo@example.com',
    amendmentType: 'vehicle_substitution',
    amendmentTypeTitle: 'Vehicle Unit Substitution',
    amendmentTypeDescription: 'Replace the current vehicle unit.',
    dateSubmitted: '2026-09-18',
    status: 'Approved',
    statusStep: 5,
    reviewedBy: 'QC Municipal Transport Regulatory Board',
    reviewedAt: '2026-09-21 04:15 PM',
    documents: {},
    auditTrail: [
      { action: 'Application Filed', timestamp: '2026-09-18 10:00 AM', actor: 'Danilo C. Ocampo' },
      { action: 'Document Verification Passed', timestamp: '2026-09-19 09:20 AM', actor: 'Intake Officer' },
      { action: 'Legal Office Concurred', timestamp: '2026-09-20 02:40 PM', actor: 'Legal Office' },
      { action: 'Traffic Board Approved', timestamp: '2026-09-21 04:15 PM', actor: 'QC Transport Board' }
    ]
  }
];

const LOCAL_STORAGE_KEY = 'govserve_amendment_substitution_apps_v4';

interface FranchiseAmendmentSubstitutionModuleProps {
  onBackToPortal: () => void;
  onNavigateToTab?: (tab: TabType) => void;
  initialMode?: 'wizard' | 'tracker' | 'admin';
}

export const FranchiseAmendmentSubstitutionModule: React.FC<FranchiseAmendmentSubstitutionModuleProps> = ({
  onBackToPortal,
  onNavigateToTab,
  initialMode = 'wizard'
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Active top view mode
  const [viewMode, setViewMode] = useState<'wizard' | 'tracker' | 'admin'>(
    initialMode === 'admin' && isAdmin ? 'admin' : 'wizard'
  );

  // Wizard Step: 1. Application, 2. Upload Documents, 3. Review, 4. Submit / Success
  const [step, setStep] = useState<number>(1);

  // Stored Applications
  const [applications, setApplications] = useState<AmendmentApplication[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_MOCK_APPLICATIONS;
  });

  // Save applications to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(applications));
    } catch {
      // Ignore
    }
  }, [applications]);

  // Franchise Information (Editable & Required)
  const [franchiseNo, setFranchiseNo] = useState<string>('MTOP-2025-0412');
  const [ownerName, setOwnerName] = useState<string>(user?.name || 'Juan Dela Cruz');
  const [contactNo, setContactNo] = useState<string>('+63 917 888 2941');
  const email = user?.email || 'citizen@govserve.ph';

  // Selected Amendment Type
  const [selectedType, setSelectedType] = useState<AmendmentTypeKey>('vehicle_substitution');

  // Uploaded Documents state for current wizard
  const initDocsForType = (typeKey: AmendmentTypeKey): Record<string, AmendmentDocItem> => {
    const list = REQUIRED_DOCS_BY_TYPE[typeKey] || REQUIRED_DOCS_BY_TYPE.vehicle_substitution;
    const initialMap: Record<string, AmendmentDocItem> = {};
    list.forEach((doc, idx) => {
      initialMap[doc.key] = {
        id: `doc-${doc.key}-${idx}`,
        key: doc.key,
        title: doc.title,
        subtitle: doc.subtitle,
        iconName: doc.iconName,
        required: doc.required,
        fileName: null,
        fileType: null,
        fileSize: null,
        previewUrl: null,
        uploadedAt: null,
        qualityStatus: 'none',
        status: 'pending'
      };
    });
    return initialMap;
  };

  const [uploadedDocs, setUploadedDocs] = useState<Record<string, AmendmentDocItem>>(() =>
    initDocsForType('vehicle_substitution')
  );

  // Update docs map when amendment type changes
  const handleSelectType = (typeKey: AmendmentTypeKey) => {
    setSelectedType(typeKey);
    setUploadedDocs(initDocsForType(typeKey));
  };

  // Active target for upload / camera
  const [activeUploadDocKey, setActiveUploadDocKey] = useState<string | null>(null);

  // Camera State
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraHasStream, setCameraHasStream] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Zoom / Lightbox State
  const [zoomModalOpen, setZoomModalOpen] = useState<boolean>(false);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [zoomImageTitle, setZoomImageTitle] = useState<string>('');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [zoomRotation, setZoomRotation] = useState<number>(0);

  // Confirmation Modal before submitting
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

  // Active tracked application (for status tracker screen)
  const [trackedApp, setTrackedApp] = useState<AmendmentApplication | null>(null);

  // Single-Document Replacement modal for "Action Required"
  const [actionRequiredModalOpen, setActionRequiredModalOpen] = useState<boolean>(false);
  const [actionRequiredTargetDoc, setActionRequiredTargetDoc] = useState<string>('');
  const [actionRequiredApp, setActionRequiredApp] = useState<AmendmentApplication | null>(null);

  // Admin Review states
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [adminTypeFilter, setAdminTypeFilter] = useState<string>('All');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('All');
  const [selectedAdminApp, setSelectedAdminApp] = useState<AmendmentApplication | null>(null);
  const [correctionModalOpen, setCorrectionModalOpen] = useState<boolean>(false);
  const [correctionReasonText, setCorrectionReasonText] = useState<string>('');
  const [correctionTargetDocAdmin, setCorrectionTargetDocAdmin] = useState<string>('deedOfSale');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Image Quality Validation Heuristic
  const evaluatePhotoQuality = (file: File): {
    status: 'optimal' | 'warning_blur' | 'warning_dark' | 'warning_crop';
    message: string;
  } => {
    const lowerName = file.name.toLowerCase();
    if (file.size < 40000 || lowerName.includes('blur')) {
      return {
        status: 'warning_blur',
        message: '⚠ The photo appears blurry. Please upload a clearer photo.'
      };
    }
    if (lowerName.includes('dark')) {
      return {
        status: 'warning_dark',
        message: '⚠ The photo is too dark. Please upload a brighter image.'
      };
    }
    if (lowerName.includes('crop') || lowerName.includes('cut')) {
      return {
        status: 'warning_crop',
        message: '⚠ The entire document is not visible. Please take another photo.'
      };
    }
    return {
      status: 'optimal',
      message: '✓ Document uploaded successfully'
    };
  };

  // Handle File Input from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      showToast('File size exceeds the 20MB limit.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a JPG, JPEG, PNG, or PDF file.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const quality = evaluatePhotoQuality(file);

    const docStatus: 'accepted' | 'needs_correction' = quality.status === 'optimal' ? 'accepted' : 'needs_correction';

    setUploadedDocs(prev => ({
      ...prev,
      [docKey]: {
        ...prev[docKey],
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        previewUrl: objectUrl,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        qualityStatus: quality.status,
        qualityMessage: quality.message,
        status: docStatus
      }
    }));

    showToast(quality.message);
    e.target.value = '';
  };

  // Camera Management
  const startCamera = async (docKey: string) => {
    setActiveUploadDocKey(docKey);
    setCameraModalOpen(true);
    setCameraLoading(true);
    setCameraHasStream(false);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraHasStream(true);
      } else {
        setCameraHasStream(false);
      }
    } catch {
      setCameraHasStream(false);
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraModalOpen(false);
    setCameraHasStream(false);
    setActiveUploadDocKey(null);
  };

  const capturePhoto = () => {
    if (!activeUploadDocKey) return;

    let photoUrl = '';
    const now = new Date();
    const fileName = `Camera_Capture_${activeUploadDocKey}_${now.getTime()}.jpg`;

    if (cameraHasStream && videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 800;
        canvas.height = videoRef.current.videoHeight || 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          photoUrl = canvas.toDataURL('image/jpeg', 0.9);
        }
      } catch {
        photoUrl = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60';
      }
    } else {
      photoUrl = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60';
    }

    setUploadedDocs(prev => ({
      ...prev,
      [activeUploadDocKey]: {
        ...prev[activeUploadDocKey],
        fileName,
        fileType: 'image/jpeg',
        fileSize: 1350000,
        previewUrl: photoUrl,
        uploadedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        qualityStatus: 'optimal',
        qualityMessage: '✓ Document uploaded successfully',
        status: 'accepted'
      }
    }));

    showToast('✓ Photo captured and uploaded successfully');
    stopCamera();
  };

  const handleRemoveDoc = (docKey: string) => {
    setUploadedDocs(prev => ({
      ...prev,
      [docKey]: {
        ...prev[docKey],
        fileName: null,
        fileType: null,
        fileSize: null,
        previewUrl: null,
        uploadedAt: null,
        qualityStatus: 'none',
        qualityMessage: undefined,
        status: 'pending'
      }
    }));
    showToast('Document removed.');
  };

  // Zoom / Lightbox
  const handleOpenZoom = (url: string | null, title: string) => {
    if (!url) return;
    setZoomImageUrl(url);
    setZoomImageTitle(title);
    setZoomScale(1);
    setZoomRotation(0);
    setZoomModalOpen(true);
  };

  // Document Checklist Calculations
  const requiredDocsList = Object.values(uploadedDocs).filter(d => d.required);
  const totalRequiredCount = requiredDocsList.length;
  const uploadedRequiredCount = requiredDocsList.filter(d => d.previewUrl !== null).length;
  const progressPercent = totalRequiredCount > 0 
    ? Math.round((uploadedRequiredCount / totalRequiredCount) * 100) 
    : 100;
  const allRequiredUploaded = totalRequiredCount > 0 && uploadedRequiredCount >= totalRequiredCount;

  // Submit Application Handler
  const handleConfirmSubmit = () => {
    setConfirmModalOpen(false);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newAppNo = `AMS-2026-${randomSuffix}`;
    const selectedCatalog = AMENDMENT_TYPES_CATALOG.find(c => c.key === selectedType)!;

    const newApp: AmendmentApplication = {
      id: `ams-${Date.now()}`,
      applicationNo: newAppNo,
      franchiseNo,
      ownerName,
      contactNo,
      email,
      amendmentType: selectedType,
      amendmentTypeTitle: selectedCatalog.title,
      amendmentTypeDescription: selectedCatalog.description,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Document Verification',
      statusStep: 2,
      documents: { ...uploadedDocs },
      auditTrail: [
        {
          action: 'Application Submitted',
          timestamp: new Date().toLocaleString(),
          actor: `${ownerName} (Applicant)`,
          notes: `Lodged ${selectedCatalog.title} online through GovServe.`
        },
        {
          action: 'Queued for Document Verification',
          timestamp: new Date().toLocaleString(),
          actor: 'GovServe Automated Engine',
          notes: 'Initial image verification cleared.'
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    setTrackedApp(newApp);
    setStep(4);
    showToast(`✓ Application ${newAppNo} submitted successfully!`);
  };

  // Handle Single-Document Correction Replacement
  const handleActionRequiredFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !actionRequiredApp || !actionRequiredTargetDoc) return;

    const objectUrl = URL.createObjectURL(file);
    const quality = evaluatePhotoQuality(file);

    const docStatus: 'accepted' | 'needs_correction' = quality.status === 'optimal' ? 'accepted' : 'needs_correction';

    const updatedDocs: Record<string, AmendmentDocItem> = {
      ...actionRequiredApp.documents,
      [actionRequiredTargetDoc]: {
        ...(actionRequiredApp.documents[actionRequiredTargetDoc] || {
          id: `doc-${actionRequiredTargetDoc}`,
          key: actionRequiredTargetDoc,
          title: 'Updated Document',
          subtitle: 'Replaced photo',
          iconName: 'FileCheck',
          required: true
        }),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        previewUrl: objectUrl,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        qualityStatus: quality.status,
        qualityMessage: quality.message,
        status: docStatus
      }
    };

    const updatedApp: AmendmentApplication = {
      ...actionRequiredApp,
      status: 'Document Verification',
      statusStep: 2,
      documents: updatedDocs,
      correctionRemarks: undefined,
      defectiveDocKey: undefined,
      auditTrail: [
        ...actionRequiredApp.auditTrail,
        {
          action: 'Corrected Document Uploaded',
          timestamp: new Date().toLocaleString(),
          actor: `${actionRequiredApp.ownerName} (Applicant)`,
          notes: `Replaced defective document ${actionRequiredTargetDoc} with a clearer photo.`
        }
      ]
    };

    setApplications(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
    setTrackedApp(updatedApp);
    setActionRequiredModalOpen(false);
    showToast('✓ Replacement document uploaded! Application returned to verification queue.');
  };

  // Admin Actions
  const handleAdminApprove = (appId: string) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: 'Approved',
          statusStep: 5,
          reviewedBy: `${user?.name || 'Administrator'} (QC Transport Board)`,
          reviewedAt: new Date().toLocaleString(),
          auditTrail: [
            ...a.auditTrail,
            {
              action: 'Application Approved',
              timestamp: new Date().toLocaleString(),
              actor: `${user?.name || 'Admin'} (Legal & Traffic Board)`,
              notes: 'All documents verified and compliant with Ordinance SP-2990.'
            }
          ]
        };
      }
      return a;
    }));
    showToast('Application marked as Approved!');
    if (selectedAdminApp && selectedAdminApp.id === appId) {
      setSelectedAdminApp(prev => prev ? { ...prev, status: 'Approved', statusStep: 5 } : null);
    }
  };

  const handleAdminRequestCorrection = () => {
    if (!selectedAdminApp || !correctionReasonText.trim()) {
      showToast('Please provide a reason for correction.');
      return;
    }

    setApplications(prev => prev.map(a => {
      if (a.id === selectedAdminApp.id) {
        return {
          ...a,
          status: 'Needs Correction',
          statusStep: 2,
          correctionRemarks: correctionReasonText.trim(),
          defectiveDocKey: correctionTargetDocAdmin,
          reviewedBy: `${user?.name || 'Administrator'} (Legal Office)`,
          reviewedAt: new Date().toLocaleString(),
          auditTrail: [
            ...a.auditTrail,
            {
              action: 'Deficiency Notice Issued',
              timestamp: new Date().toLocaleString(),
              actor: `${user?.name || 'Admin'} (Legal Office)`,
              notes: correctionReasonText.trim()
            }
          ]
        };
      }
      return a;
    }));

    showToast('Correction requested. Notice sent to applicant dashboard.');
    setCorrectionModalOpen(false);
    setSelectedAdminApp(prev => prev ? {
      ...prev,
      status: 'Needs Correction',
      correctionRemarks: correctionReasonText.trim(),
      defectiveDocKey: correctionTargetDocAdmin
    } : null);
  };

  const handleAdminReject = (appId: string) => {
    const reason = prompt('Please enter the reason for rejection:');
    if (!reason) return;

    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: 'Rejected',
          statusStep: 1,
          correctionRemarks: reason,
          reviewedBy: `${user?.name || 'Administrator'} (QC Transport Board)`,
          reviewedAt: new Date().toLocaleString(),
          auditTrail: [
            ...a.auditTrail,
            {
              action: 'Application Rejected',
              timestamp: new Date().toLocaleString(),
              actor: `${user?.name || 'Admin'} (QC Board)`,
              notes: reason
            }
          ]
        };
      }
      return a;
    }));
    showToast('Application marked as Rejected.');
    if (selectedAdminApp && selectedAdminApp.id === appId) {
      setSelectedAdminApp(prev => prev ? { ...prev, status: 'Rejected' } : null);
    }
  };

  // Filtered Applications for Admin
  const filteredAdminApps = applications.filter(app => {
    const matchesSearch = 
      app.franchiseNo.toLowerCase().includes(adminSearch.toLowerCase()) ||
      app.ownerName.toLowerCase().includes(adminSearch.toLowerCase()) ||
      app.applicationNo.toLowerCase().includes(adminSearch.toLowerCase());
    const matchesType = adminTypeFilter === 'All' || app.amendmentType === adminTypeFilter;
    const matchesStatus = adminStatusFilter === 'All' || app.status === adminStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 select-text font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div className="bg-slate-900/95 dark:bg-purple-950/95 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-purple-500/40 backdrop-blur-md flex items-center gap-2.5">
            <Sparkles size={16} className="text-purple-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. APPLICATION WIZARD MODE */}
      {/* ========================================================================= */}
      {viewMode === 'wizard' && (
        <div className="space-y-6">
          {/* Wizard Header & Visual Progress Indicator */}
          <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50/50 dark:from-[#1b0a2b] dark:via-slate-900 dark:to-[#170824] p-6 sm:p-7 rounded-3xl border border-purple-200/90 dark:border-purple-500/30 shadow-sm space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white shadow-sm shadow-purple-600/30">
                <FileCheck size={12} />
                <span>Upload-First Process</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">
                AMENDMENT &amp; SUBSTITUTION APPLICATION
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Upload your documents and photos to complete your application. No long forms or manual typing required.
              </p>
            </div>

            {/* 4-Step Visual Progress Bar */}
            <div className="pt-2">
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[
                  { stepNum: 1, title: 'Application', desc: 'Franchise & Type' },
                  { stepNum: 2, title: 'Upload Documents', desc: 'Photos & Clearance' },
                  { stepNum: 3, title: 'Review', desc: 'Verify Details' },
                  { stepNum: 4, title: 'Submit', desc: 'Track & Receipt' }
                ].map(s => {
                  const isActive = step === s.stepNum;
                  const isDone = step > s.stepNum;

                  return (
                    <div
                      key={s.stepNum}
                      className={`relative p-3 rounded-2xl border transition-all text-left ${
                        isActive
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/30'
                          : isDone
                          ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800'
                          : 'bg-white/80 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : isDone
                            ? 'bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                        }`}>
                          {isDone ? '✓ Done' : `0${s.stepNum}`}
                        </span>
                        {isDone && <CheckCircle2 size={14} className="text-purple-600 dark:text-purple-400" />}
                      </div>
                      <div className="font-bold text-xs sm:text-sm tracking-tight truncate">
                        {s.title}
                      </div>
                      <div className={`text-[10px] hidden sm:block truncate ${isActive ? 'text-purple-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {s.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 1: APPLICATION (FRANCHISE INFORMATION + SELECT AMENDMENT TYPE) */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Franchise Information */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-purple-200/80 dark:border-purple-500/30 shadow-sm space-y-4">
                <div className="pb-3 border-b border-purple-100 dark:border-purple-950">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <ShieldCheck size={18} />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Franchise Information
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Franchise Number */}
                  <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/40 space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-purple-700 dark:text-purple-400 block">
                      Franchise Number
                    </label>
                    <input
                      type="text"
                      required
                      value={franchiseNo}
                      onChange={(e) => setFranchiseNo(e.target.value)}
                      placeholder="e.g. MTOP-2025-0412"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-xs"
                    />
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Active MTOP Registry</span>
                  </div>

                  {/* Owner Name */}
                  <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/40 space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-purple-700 dark:text-purple-400 block">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Juan Dela Cruz"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-xs"
                    />
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Registered Franchise Holder</span>
                  </div>

                  {/* Contact Number */}
                  <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/40 space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-purple-700 dark:text-purple-400 block">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      required
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                      placeholder="e.g. +63 917 888 2941"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-xs"
                    />
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">SMS Verification Active</span>
                  </div>
                </div>
              </div>

              {/* SELECT AMENDMENT TYPE: Large Clickable Cards */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-purple-200/80 dark:border-purple-500/30 shadow-sm space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    What would you like to amend or substitute?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select one service category below. Upload requirements will adjust automatically.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {AMENDMENT_TYPES_CATALOG.map(card => {
                    const isSelected = selectedType === card.key;

                    return (
                      <button
                        key={card.key}
                        type="button"
                        onClick={() => handleSelectType(card.key)}
                        className={`group p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-600 dark:border-purple-500 ring-2 ring-purple-600/30 shadow-md shadow-purple-600/10 scale-[1.01]'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-600/60 hover:bg-purple-50/30'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs">
                            <Check size={14} />
                          </div>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl p-2 rounded-xl bg-purple-100/70 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-800/60 shrink-0">
                              {card.icon}
                            </span>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 block">
                                {card.tag}
                              </span>
                              <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                                {card.title}
                              </h4>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {card.description}
                          </p>
                        </div>

                        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold">
                          <span className={isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-slate-500'}>
                            {isSelected ? '✓ Selected' : 'Click to select'}
                          </span>
                          <span className="font-mono text-purple-600 dark:text-purple-400">₱900.00 Legal Tariff</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onBackToPortal}
                  className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!franchiseNo.trim() || !ownerName.trim() || !contactNo.trim()) {
                      showToast('Please fill in all required franchise fields (Franchise Number, Owner Name, Contact Number).');
                      return;
                    }
                    setStep(2);
                  }}
                  disabled={!franchiseNo.trim() || !ownerName.trim() || !contactNo.trim()}
                  className={`px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 ${
                    franchiseNo.trim() && ownerName.trim() && contactNo.trim()
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Continue to Upload Documents</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: UPLOAD DOCUMENTS (UPLOAD-FIRST CORE) */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Checklist & Upload Progress Bar */}
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-purple-200/80 dark:border-purple-500/30 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                      DOCUMENT CHECKLIST
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {uploadedRequiredCount} of {totalRequiredCount} documents uploaded
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-purple-600 dark:text-purple-400">
                      {progressPercent}% Complete
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 transition-all duration-300 shadow-sm"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Checklist Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {Object.values(uploadedDocs).map(doc => {
                    const isUploaded = doc.previewUrl !== null;
                    return (
                      <span
                        key={doc.key}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                          isUploaded
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : doc.required
                            ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isUploaded ? (
                          <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        )}
                        <span>{doc.title}</span>
                        {doc.required && !isUploaded && (
                          <span className="text-[9px] uppercase font-bold text-purple-600 dark:text-purple-400">*Required</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Instruction banner */}
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 flex items-start gap-3">
                <HelpCircle size={18} className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    Make sure the entire document is visible and readable.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Use either <strong className="text-purple-700 dark:text-purple-300">📷 Take Photo</strong> on mobile or webcam, or <strong className="text-purple-700 dark:text-purple-300">⬆ Upload from Device</strong>. Accepted formats: JPG, JPEG, PNG, PDF (max 20MB).
                  </p>
                </div>
              </div>

              {/* DOCUMENT UPLOAD CARDS */}
              <div className="space-y-4">
                {Object.values(uploadedDocs).map(doc => {
                  const isUploaded = doc.previewUrl !== null;

                  return (
                    <div
                      key={doc.key}
                      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-500/30 shadow-sm space-y-4 hover:border-purple-400 dark:hover:border-purple-500 transition-all"
                    >
                      {/* Top Header of Document Card */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold shrink-0 shadow-xs">
                            <Camera size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                📷 {doc.title}
                              </h4>
                              {doc.required && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                              {doc.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="self-start sm:self-auto">
                          {!isUploaded ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                              ○ Not uploaded
                            </span>
                          ) : doc.qualityStatus === 'optimal' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 size={13} />
                              ✓ Uploaded
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              <AlertTriangle size={13} />
                              ⚠ Needs clearer photo
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Area: If Uploaded vs Not Uploaded */}
                      {!isUploaded ? (
                        <div className="p-6 rounded-2xl bg-purple-50/40 dark:bg-slate-800/40 border-2 border-dashed border-purple-200 dark:border-purple-900/60 flex flex-col items-center justify-center text-center gap-4">
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Select an option to provide your document:
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-3">
                            {/* Take Photo Button */}
                            <button
                              type="button"
                              onClick={() => startCamera(doc.key)}
                              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                            >
                              <Camera size={15} />
                              <span>📷 TAKE PHOTO</span>
                            </button>

                            {/* Upload Photo Button */}
                            <label className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all">
                              <Upload size={15} />
                              <span>⬆ UPLOAD PHOTO</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,application/pdf"
                                onChange={(e) => handleFileUpload(e, doc.key)}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <span className="text-[10px] text-slate-400">
                            Accepted formats: JPG, JPEG, PNG, PDF (Max 20MB)
                          </span>
                        </div>
                      ) : (
                        /* AFTER UPLOAD: PREVIEW & ACTION CONTROLS */
                        <div className="space-y-3">
                          <div className="p-4 rounded-2xl bg-purple-50/30 dark:bg-slate-800/40 border border-purple-200/80 dark:border-purple-900/50 flex flex-col sm:flex-row items-center gap-4">
                            {/* Thumbnail Preview with Click to Zoom */}
                            <div
                              onClick={() => handleOpenZoom(doc.previewUrl, doc.title)}
                              className="relative group w-32 h-24 sm:w-36 sm:h-28 rounded-xl overflow-hidden border border-purple-300 dark:border-purple-700 bg-slate-900 shrink-0 cursor-pointer shadow-sm"
                            >
                              <img
                                src={doc.previewUrl!}
                                alt={doc.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                                <ZoomIn size={14} />
                                <span>Click to enlarge</span>
                              </div>
                            </div>

                            {/* Metadata and Quality Messages */}
                            <div className="flex-1 space-y-1.5 text-center sm:text-left">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                  {doc.fileName || 'Uploaded_Document.jpg'}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  ({doc.fileSize ? `${Math.round(doc.fileSize / 1024)} KB` : 'Verified'}) • {doc.uploadedAt}
                                </span>
                              </div>

                              {/* Quality heuristic friendly message */}
                              <div className="text-xs">
                                {doc.qualityStatus === 'optimal' ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
                                    <CheckCircle2 size={13} />
                                    <span>✓ Clear and readable document</span>
                                  </span>
                                ) : (
                                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
                                    <AlertTriangle size={13} />
                                    <span>{doc.qualityMessage || 'Please upload a clearer photo.'}</span>
                                  </span>
                                )}
                              </div>

                              {/* Action Buttons: Replace, Retake, Remove */}
                              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => startCamera(doc.key)}
                                  className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px] font-bold hover:bg-purple-100 flex items-center gap-1 cursor-pointer"
                                >
                                  <Camera size={13} />
                                  <span>Retake Photo</span>
                                </button>

                                <label className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-[11px] font-bold hover:bg-slate-100 flex items-center gap-1 cursor-pointer">
                                  <Upload size={13} />
                                  <span>Replace Photo</span>
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,application/pdf"
                                    onChange={(e) => handleFileUpload(e, doc.key)}
                                    className="hidden"
                                  />
                                </label>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveDoc(doc.key)}
                                  className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-[11px] font-bold hover:bg-rose-100 flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step 2 Actions */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Application</span>
                </button>

                <button
                  type="button"
                  disabled={!allRequiredUploaded}
                  onClick={() => setStep(3)}
                  className={`px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 ${
                    allRequiredUploaded
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Review Application</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW APPLICATION */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-purple-200/80 dark:border-purple-500/30 shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                    STEP 3 OF 4
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    AMENDMENT &amp; SUBSTITUTION APPLICATION REVIEW
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Please verify your franchise information, requested amendment type, and uploaded documents before lodging.
                  </p>
                </div>

                {/* Section A: Franchise Information */}
                <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/40 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-200/60 dark:border-purple-900/40">
                    <h4 className="text-xs font-black uppercase text-purple-800 dark:text-purple-300 tracking-wider">
                      Franchise Information
                    </h4>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">✓ Verified Record</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Franchise Number</span>
                      <span className="font-mono font-black text-slate-900 dark:text-white text-sm">{franchiseNo}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Owner Name</span>
                      <span className="font-black text-slate-900 dark:text-white text-sm">{ownerName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Contact Number</span>
                      <span className="font-mono font-black text-slate-900 dark:text-white text-sm">{contactNo}</span>
                    </div>
                  </div>
                </div>

                {/* Section B: Amendment Type */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-purple-200/70 dark:border-purple-900/40 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-black uppercase text-purple-800 dark:text-purple-300 tracking-wider">
                      Amendment Type
                    </h4>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-3xl">
                      {AMENDMENT_TYPES_CATALOG.find(c => c.key === selectedType)?.icon || '🚐'}
                    </span>
                    <div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        {AMENDMENT_TYPES_CATALOG.find(c => c.key === selectedType)?.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {AMENDMENT_TYPES_CATALOG.find(c => c.key === selectedType)?.description}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section C: Uploaded Documents Summary */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-black uppercase text-purple-800 dark:text-purple-300 tracking-wider">
                      Uploaded Documents ({uploadedRequiredCount} of {totalRequiredCount} Ready)
                    </h4>
                    <span className="text-xs text-slate-500">Click any document photo to enlarge</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.values(uploadedDocs).map(doc => {
                      if (!doc.previewUrl && !doc.required) return null;

                      return (
                        <div
                          key={doc.key}
                          className="p-3.5 rounded-2xl border border-purple-200/70 dark:border-purple-900/40 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {doc.previewUrl ? (
                              <img
                                src={doc.previewUrl}
                                alt={doc.title}
                                onClick={() => handleOpenZoom(doc.previewUrl, doc.title)}
                                className="w-12 h-12 rounded-xl object-cover border border-purple-300 dark:border-purple-700 cursor-pointer shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                                <FileText size={18} />
                              </div>
                            )}

                            <div className="overflow-hidden">
                              <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                                {doc.title}
                              </span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                                <CheckCircle2 size={11} />
                                <span>{doc.fileName || 'Uploaded and verified'}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tariff / Fee Notice */}
                <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-black text-slate-900 dark:text-white block">
                      Legal Tariff &amp; Vehicle Unit Substitution Fee:
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Payment payable online via GovServe portal upon submission confirmation
                    </span>
                  </div>
                  <span className="text-base font-black font-mono text-purple-600 dark:text-purple-400">
                    ₱900.00
                  </span>
                </div>
              </div>

              {/* Step 3 Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Edit Uploaded Documents</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmModalOpen(true)}
                  className="px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>SUBMIT APPLICATION →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS & APPLICATION STATUS */}
          {step === 4 && trackedApp && (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-purple-200/80 dark:border-purple-500/30 shadow-sm text-center space-y-6 max-w-2xl mx-auto">
                <div className="w-18 h-18 mx-auto rounded-3xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
                  <CheckCircle2 size={44} />
                </div>

                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <Sparkles size={13} />
                    <span>✓ APPLICATION SUBMITTED</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Your Amendment &amp; Substitution application has been successfully submitted.
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Quezon City Municipal Transport Regulatory Board docket docketed.
                  </p>
                </div>

                {/* Summary Box */}
                <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 text-left text-xs space-y-2.5">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span>Application Number:</span>
                    <span className="font-mono font-black text-purple-700 dark:text-purple-300 text-sm">
                      {trackedApp.applicationNo}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span>Franchise Number:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {trackedApp.franchiseNo}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span>Application Type:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {trackedApp.amendmentTypeTitle}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span>Date Submitted:</span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      {trackedApp.dateSubmitted}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-purple-200/60 dark:border-purple-900/40">
                    <span className="font-bold text-slate-900 dark:text-white">Current Status:</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      🟡 Pending Review ({trackedApp.status})
                    </span>
                  </div>
                </div>

                {/* Visual Status Tracker Preview */}
                <div className="pt-2 text-left space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                    APPLICATION PROGRESSION
                  </span>
                  <div className="space-y-2 text-xs">
                    {[
                      { stepIdx: 1, label: 'Application Submitted', state: 'done' },
                      { stepIdx: 2, label: 'Document Verification', state: 'active' },
                      { stepIdx: 3, label: 'Legal Office Review', state: 'pending' },
                      { stepIdx: 4, label: 'Traffic Board Review', state: 'pending' },
                      { stepIdx: 5, label: 'Approved', state: 'pending' }
                    ].map(st => (
                      <div key={st.stepIdx} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          st.state === 'done'
                            ? 'bg-emerald-500 text-white'
                            : st.state === 'active'
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}>
                          {st.state === 'done' ? '✓' : st.stepIdx}
                        </div>
                        <span className={`font-semibold ${
                          st.state === 'active' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {st.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Success Screen Buttons */}
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      onBackToPortal();
                    }}
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    BACK TO PORTAL
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. APPLICATION STATUS TRACKER VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'tracker' && trackedApp && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-purple-200/80 dark:border-purple-500/30 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100 dark:border-purple-950">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                  APPLICATION TRACKING SYSTEM
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Docket: {trackedApp.applicationNo}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {trackedApp.amendmentTypeTitle} • Franchise {trackedApp.franchiseNo}
                </p>
              </div>

              <button
                type="button"
                onClick={onBackToPortal}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer self-start sm:self-auto transition-all"
              >
                Back to Portal
              </button>
            </div>

            {/* If Needs Correction, display Action Required block */}
            {trackedApp.status === 'Needs Correction' && (
              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-black text-xs uppercase tracking-wide">
                  <AlertTriangle size={16} />
                  <span>ACTION REQUIRED</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                  {trackedApp.correctionRemarks || 'Your Deed of Sale photo needs to be replaced with a clearer copy.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActionRequiredApp(trackedApp);
                    setActionRequiredTargetDoc(trackedApp.defectiveDocKey || 'deedOfSale');
                    setActionRequiredModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Upload size={14} />
                  <span>UPLOAD NEW PHOTO</span>
                </button>
              </div>
            )}

            {/* If Approved */}
            {trackedApp.status === 'Approved' && (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-black text-emerald-800 dark:text-emerald-300 uppercase">
                      ✓ APPLICATION APPROVED
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Your amendment has been officially ratified by the QC Municipal Transport Regulatory Board.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Downloading Official Certificate of Unit Substitution...')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer shrink-0"
                >
                  Download Certificate
                </button>
              </div>
            )}

            {/* 5-STAGE VISUAL TRACKING SYSTEM */}
            <div className="p-6 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                5-STAGE REGULATORY PROGRESSION
              </span>

              <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-purple-300 dark:border-purple-700 ml-3">
                {[
                  { stageIdx: 1, title: 'Application Submitted', desc: 'Docketed and registered into the municipal franchise database.' },
                  { stageIdx: 2, title: 'Document Verification', desc: 'OCR image analysis and compliance check with QC Transport Code.' },
                  { stageIdx: 3, title: 'Legal Office Review', desc: 'Verification of Deed of Sale, ownership rights, and Cooperative/Route concurrence.' },
                  { stageIdx: 4, title: 'Traffic Board Review', desc: 'Quezon City Municipal Transport Regulatory Board evaluation.' },
                  { stageIdx: 5, title: 'Approved', desc: 'Official Certificate of Substitution & Franchise Decal ready.' }
                ].map(st => {
                  const isCurrent = trackedApp.statusStep === st.stageIdx;
                  const isPast = trackedApp.statusStep > st.stageIdx;
                  const isDefective = trackedApp.status === 'Needs Correction' && st.stageIdx === 2;

                  return (
                    <div key={st.stageIdx} className="relative">
                      {/* Stage Circle */}
                      <div className={`absolute -left-[35px] sm:-left-[43px] top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs ${
                        isPast
                          ? 'bg-purple-600 text-white'
                          : isDefective
                          ? 'bg-rose-600 text-white animate-pulse'
                          : isCurrent
                          ? 'bg-amber-500 text-white animate-pulse ring-4 ring-amber-500/20'
                          : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                      }`}>
                        {isPast ? '✓' : isDefective ? '⚠' : st.stageIdx}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs sm:text-sm font-black ${
                            isCurrent
                              ? 'text-purple-700 dark:text-purple-300'
                              : isPast
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}>
                            {st.title}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                              Active Stage
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit Trail */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                Audit Trail &amp; Processing History
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {trackedApp.auditTrail.map((log, idx) => (
                  <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{log.action}</span>
                      <span className="text-slate-400 text-[10px] ml-2 font-mono">by {log.actor}</span>
                      {log.notes && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ADMIN REVIEW CONSOLE */}
      {/* ========================================================================= */}
      {viewMode === 'admin' && isAdmin && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-purple-200/80 dark:border-purple-500/30 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100 dark:border-purple-950">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                  ADMINISTRATIVE REGULATORY CONSOLE
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Amendment Applications Review
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inspect uploaded documents, verify photo clarity, request corrections, or issue board approvals.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  {filteredAdminApps.length} Records Found
                </span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Search by Franchise No or Owner Name..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <select
                  value={adminTypeFilter}
                  onChange={(e) => setAdminTypeFilter(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Amendment Types</option>
                  <option value="vehicle_substitution">Vehicle Unit Substitution</option>
                  <option value="plate_change">Plate Number Change</option>
                  <option value="ownership_transfer">Transfer of Ownership</option>
                </select>
              </div>

              <div>
                <select
                  value={adminStatusFilter}
                  onChange={(e) => setAdminStatusFilter(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Document Verification">Document Verification</option>
                  <option value="Legal Office Review">Legal Office Review</option>
                  <option value="Traffic Board Review">Traffic Board Review</option>
                  <option value="Needs Correction">Needs Correction</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-3">Docket No</th>
                    <th className="py-3 px-3">Franchise</th>
                    <th className="py-3 px-3">Operator Name</th>
                    <th className="py-3 px-3">Amendment Type</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAdminApps.map(app => (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedAdminApp(app)}
                      className={`hover:bg-purple-50/50 dark:hover:bg-purple-950/20 cursor-pointer transition-colors ${
                        selectedAdminApp?.id === app.id ? 'bg-purple-50/80 dark:bg-purple-950/40' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-black text-purple-700 dark:text-purple-300">
                        {app.applicationNo}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {app.franchiseNo}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {app.ownerName}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {app.amendmentTypeTitle}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">
                        {app.dateSubmitted}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Approved'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                            : app.status === 'Needs Correction'
                            ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200'
                            : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAdminApp(app);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[11px] font-bold shadow-xs hover:bg-purple-500 cursor-pointer"
                        >
                          Inspect Docs
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected Application Review Drawer / Card */}
            {selectedAdminApp && (
              <div className="p-6 rounded-3xl bg-purple-50/30 dark:bg-purple-950/20 border-2 border-purple-300 dark:border-purple-700 space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-200 dark:border-purple-800">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                      DOCUMENT INSPECTION &amp; REGULATORY ACTION
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {selectedAdminApp.applicationNo} • {selectedAdminApp.ownerName} ({selectedAdminApp.franchiseNo})
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdminApprove(selectedAdminApp.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve Application</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCorrectionReasonText('Please upload a clearer photo of the Deed of Sale.');
                        setCorrectionModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <AlertTriangle size={14} />
                      <span>Request Correction</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAdminReject(selectedAdminApp.id)}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Uploaded Documents Grid */}
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 mb-3">
                    Uploaded Document Proofs ({Object.keys(selectedAdminApp.documents).length} Files Attached)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.values(selectedAdminApp.documents).map(doc => {
                      return (
                        <div
                          key={doc.key}
                          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 shadow-xs space-y-2.5 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                              {doc.title}
                            </span>

                            {doc.previewUrl ? (
                              <div
                                onClick={() => handleOpenZoom(doc.previewUrl, doc.title)}
                                className="relative group w-full h-32 rounded-xl overflow-hidden bg-slate-900 cursor-pointer border border-purple-200 dark:border-purple-700"
                              >
                                <img
                                  src={doc.previewUrl}
                                  alt={doc.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                  <ZoomIn size={16} />
                                  <span>Zoom Photo</span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-32 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
                                No Photo Uploaded
                              </div>
                            )}

                            <span className="text-[10px] text-slate-500 block truncate font-mono">
                              {doc.fileName || 'file_attachment.jpg'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                            <button
                              type="button"
                              onClick={() => handleOpenZoom(doc.previewUrl, doc.title)}
                              className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <ZoomIn size={12} />
                              <span>Enlarge</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => showToast(`Downloading ${doc.fileName}...`)}
                              className="text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Download size={12} />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CAMERA CAPTURE VIEWFINDER */}
      {/* ========================================================================= */}
      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl border border-purple-500/40 shadow-2xl max-w-lg w-full p-6 space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-purple-400" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  Document Camera Viewfinder
                </h3>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Viewfinder with Alignment Guidelines */}
            <div className="relative w-full h-64 sm:h-72 bg-black rounded-2xl overflow-hidden border border-purple-500/50 flex items-center justify-center">
              {cameraLoading ? (
                <div className="text-xs text-purple-300 flex items-center gap-2">
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Accessing device camera...</span>
                </div>
              ) : cameraHasStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Simulated high-clarity viewfinder with guidelines */
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-black">
                  <div className="w-48 h-36 border-2 border-purple-400 border-dashed rounded-xl flex flex-col items-center justify-center p-3 text-center">
                    <Camera size={28} className="text-purple-400 mb-1" />
                    <span className="text-[11px] font-bold text-white">Align Document Inside Box</span>
                    <span className="text-[9px] text-slate-400">Ensure text is clear and readable</span>
                  </div>
                </div>
              )}

              {/* Viewfinder Corner Overlays */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-purple-400 pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-purple-400 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-purple-400 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-purple-400 pointer-events-none" />
            </div>

            <p className="text-[11px] text-slate-400">
              Hold device steady with sufficient lighting. Tap Capture when document is fully framed.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                className="px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-purple-600/40 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Camera size={18} />
                <span>CAPTURE PHOTO</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ZOOM / INSPECT DOCUMENT LIGHTBOX */}
      {/* ========================================================================= */}
      {zoomModalOpen && zoomImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative max-w-4xl w-full bg-slate-900 border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <FileCheck size={18} className="text-purple-400" />
                <span className="font-bold text-sm tracking-wide">{zoomImageTitle}</span>
              </div>

              {/* Controls: Zoom In, Zoom Out, Rotate, Close */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomScale(s => Math.min(s + 0.25, 3))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(s => Math.max(s - 0.25, 0.5))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomRotation(r => (r + 90) % 360)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Rotate 90°"
                >
                  <RotateCw size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white cursor-pointer transition-colors"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Document Canvas Area */}
            <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-black/60 min-h-[300px]">
              <img
                src={zoomImageUrl}
                alt="Document Zoom View"
                style={{
                  transform: `scale(${zoomScale}) rotate(${zoomRotation}deg)`,
                  transition: 'transform 0.2s ease-in-out'
                }}
                className="max-h-[60vh] max-w-full rounded-lg shadow-2xl object-contain select-none"
              />
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-center text-xs text-slate-400">
              ✓ Clear and readable document verified under Quezon City Transport Regulation Standards
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CONFIRM SUBMIT MODAL */}
      {/* ========================================================================= */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-800 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 mx-auto flex items-center justify-center shadow-xs">
              <FileCheck size={30} />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Ready to submit?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Please make sure all uploaded documents are clear and complete. Once submitted, your docket will be transmitted to the Legal Office &amp; Traffic Board.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg shadow-purple-600/30 cursor-pointer active:scale-95 transition-all"
              >
                SUBMIT APPLICATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: SINGLE-DOCUMENT ACTION REQUIRED REPLACEMENT MODAL */}
      {/* ========================================================================= */}
      {actionRequiredModalOpen && actionRequiredApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-rose-300 dark:border-rose-800 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-950">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-sm uppercase">
                <AlertTriangle size={18} />
                <span>Replace Deficient Document</span>
              </div>
              <button
                type="button"
                onClick={() => setActionRequiredModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-slate-800 dark:text-slate-200 space-y-1">
              <span className="font-bold text-rose-700 dark:text-rose-400 block uppercase text-[10px]">
                Reviewer Remark:
              </span>
              <p>"{actionRequiredApp.correctionRemarks}"</p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              You only need to replace this single photo. You do not need to re-upload any other documents or start over.
            </p>

            {/* Direct Upload Options */}
            <div className="p-6 rounded-2xl bg-purple-50/40 dark:bg-slate-800/40 border-2 border-dashed border-purple-300 dark:border-purple-800 flex flex-col items-center justify-center gap-3 text-center">
              <label className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95">
                <Upload size={16} />
                <span>SELECT CLEARER PHOTO FROM DEVICE</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleActionRequiredFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-slate-400">
                Recommended: Ensure entire document is visible with no blur or dark shadows.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: ADMIN REQUEST CORRECTION MODAL */}
      {/* ========================================================================= */}
      {correctionModalOpen && selectedAdminApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-300 dark:border-amber-700 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-sm uppercase">
                <AlertTriangle size={18} />
                <span>Request Document Correction</span>
              </div>
              <button
                type="button"
                onClick={() => setCorrectionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Target Deficient Document
                </label>
                <select
                  value={correctionTargetDocAdmin}
                  onChange={(e) => setCorrectionTargetDocAdmin(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium cursor-pointer"
                >
                  {Object.values(selectedAdminApp.documents).map(d => (
                    <option key={d.key} value={d.key}>{d.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Reason for Correction (Required)
                </label>
                <textarea
                  rows={3}
                  value={correctionReasonText}
                  onChange={(e) => setCorrectionReasonText(e.target.value)}
                  placeholder="e.g. Please upload a clearer photo of the Deed of Sale."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCorrectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAdminRequestCorrection}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black shadow-md cursor-pointer"
                >
                  Transmit Correction Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
